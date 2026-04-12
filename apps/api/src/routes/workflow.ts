// Workflow routes
//
// POST /workflow/evaluate           — re-evaluate workflow for a session (read-only)
// POST /workflow/respond            — submit a question response, then re-evaluate and persist
// GET  /workflow/:sessionId/next    — get next required question + current classification state
// POST /workflow/override           — agent override of the current classification
//
// All workflow decisions remain in src/modules/workflow/engine.ts.
// This file only handles HTTP I/O and coordinates service calls.
//
// See docs/council_tax_call_coach_workflow_specification_v_0.md for workflow logic.

import type { FastifyInstance } from 'fastify';
import { SubmitResponseSchema, OverrideClassificationSchema } from '@ctcc/shared-schemas';
import { evaluateWorkflow } from '../modules/workflow/engine.js';
import { persistDecisionResults } from '../modules/workflow/persist.js';
import { updateSessionPaths } from '../modules/sessions/service.js';
import { db } from '../db/client.js';

export async function workflowRoute(app: FastifyInstance): Promise<void> {
  // ── POST /workflow/evaluate ─────────────────────────────────────────────────
  // Read-only re-evaluation. Does not persist decision results or update session.
  app.post<{ Body: { call_session_id: string } }>('/workflow/evaluate', async (req, reply) => {
    const { call_session_id } = (req.body ?? {}) as { call_session_id?: string };
    if (!call_session_id) {
      return reply.code(400).send({ error: '"call_session_id" is required' });
    }
    return evaluateWorkflow(call_session_id);
  });

  // ── POST /workflow/respond ──────────────────────────────────────────────────
  // Submit an answer to a question. After saving the response, the workflow is
  // re-evaluated and the trace is persisted. Session paths are updated.
  app.post('/workflow/respond', async (req, reply) => {
    const parsed = SubmitResponseSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply
        .code(400)
        .send({ error: 'Invalid request body', details: parsed.error.flatten() });
    }

    const {
      call_session_id,
      question_code,
      response_status,
      answer_text,
      answer_boolean,
      answer_number,
      answer_json,
      source,
    } = parsed.data;

    // Look up the question step definition for this session's workflow version.
    const session = await db.callSession.findUniqueOrThrow({
      where: { id: call_session_id },
      select: { workflow_version_id: true },
    });

    const step = await db.questionStepDefinition.findFirstOrThrow({
      where: {
        code: question_code,
        workflow_version_id: session.workflow_version_id,
      },
      select: { id: true },
    });

    // Upsert the response (one response per question per session).
    const existing = await db.questionResponse.findFirst({
      where: {
        call_session_id,
        question_step_definition_id: step.id,
      },
      select: { id: true },
    });

    const saved = existing
      ? await db.questionResponse.update({
          where: { id: existing.id },
          data: {
            response_status,
            answer_text: answer_text ?? null,
            answer_boolean: answer_boolean ?? null,
            answer_number: answer_number ?? null,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            answer_json: (answer_json ?? null) as any,
            source,
          },
          select: { id: true },
        })
      : await db.questionResponse.create({
          data: {
            call_session_id,
            question_step_definition_id: step.id,
            response_status,
            answer_text: answer_text ?? null,
            answer_boolean: answer_boolean ?? null,
            answer_number: answer_number ?? null,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            answer_json: (answer_json ?? null) as any,
            source,
          },
          select: { id: true },
        });

    // Re-evaluate and persist decision trace.
    const workflow = await evaluateWorkflow(call_session_id);

    await Promise.all([
      persistDecisionResults(
        call_session_id,
        session.workflow_version_id,
        workflow.trace.decisions,
      ),
      updateSessionPaths(
        call_session_id,
        workflow.primaryPath,
        workflow.overlayPaths,
        workflow.classificationStatus,
      ),
    ]);

    return { response_id: saved.id, workflow };
  });

  // ── GET /workflow/:sessionId/next ───────────────────────────────────────────
  // Lightweight "what comes next?" endpoint. Evaluates the workflow and returns
  // the next required question, current paths, and classification state.
  app.get<{ Params: { sessionId: string } }>(
    '/workflow/:sessionId/next',
    async (req, _reply) => {
      const { sessionId } = req.params;

      const [workflow, session] = await Promise.all([
        evaluateWorkflow(sessionId),
        db.callSession.findUniqueOrThrow({
          where: { id: sessionId },
          select: { stage: true },
        }),
      ]);

      return {
        current_stage: session.stage,
        primary_path: workflow.primaryPath,
        overlay_paths: workflow.overlayPaths,
        classification_status: workflow.classificationStatus,
        next_required_question: workflow.nextRequiredQuestion,
        optional_clarifiers: workflow.optionalClarifiers,
        support_options: workflow.supportOptions,
        escalation_flags: workflow.escalationFlags,
        warnings: workflow.warnings,
        allowed_outcomes: workflow.allowedOutcomes,
      };
    },
  );

  // ── POST /workflow/override ─────────────────────────────────────────────────
  // Agent overrides the current classification. The override is recorded as a
  // DecisionPointResult and an intent signal is seeded so future evaluations
  // respect the agent's choice.
  app.post('/workflow/override', async (req, reply) => {
    const parsed = OverrideClassificationSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply
        .code(400)
        .send({ error: 'Invalid request body', details: parsed.error.flatten() });
    }

    const { call_session_id, from_classification, to_classification, reason } = parsed.data;

    const session = await db.callSession.findUniqueOrThrow({
      where: { id: call_session_id },
      select: { workflow_version_id: true },
    });

    // Persist the override as a decision point result for traceability.
    await db.decisionPointResult.create({
      data: {
        call_session_id,
        decision_code: 'AGENT_OVERRIDE',
        decision_type: 'classification',
        triggered: true,
        result_payload_json: {
          from_classification,
          to_classification,
          reason,
        },
        trace_text: `Agent override: "${from_classification}" → "${to_classification}". Reason: ${reason}`,
        workflow_version_id: session.workflow_version_id,
      },
    });

    // Update session with the overridden path.
    await db.callSession.update({
      where: { id: call_session_id },
      data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        current_path_code: to_classification as any,
        classification_status: 'overridden',
      },
    });

    // Seed an intent signal so the engine reflects the override in future calls.
    // The notice_type signal is the primary classification driver, so we map
    // the override target path back to the most common notice_type value for
    // that path. For the override case, we simply surface the agent's selection
    // as a specialist_review signal.
    await db.intentSignal.create({
      data: {
        call_session_id,
        signal_type: 'specialist_review_needed',
        signal_value: 'true',
        source: 'agent_selected',
        confidence: 'high',
      },
    });

    const workflow = await evaluateWorkflow(call_session_id);
    return { workflow };
  });
}
