// Session routes
//
// POST   /sessions              — create a session (with optional scenario)
// GET    /sessions/:id          — get session detail + live workflow evaluation
// PATCH  /sessions/:id/stage    — advance the session stage
// POST   /sessions/:id/close    — close the session
//
// Workflow decisions stay in the workflow engine module; this file only wires
// HTTP I/O to service calls. No business logic lives here.
//
// See docs/council_tax_call_coach_technical_prd_v_0.md §15 for API design.
// See docs/council_tax_call_coach_domain_model_and_data_schema_v_0.md §5.4 for CallSession.

import type { FastifyInstance } from 'fastify';
import { CreateSessionSchema } from '@ctcc/shared-schemas';
import {
  createSession,
  getSessionDetails,
  advanceSessionStage,
  closeSession,
  isValidStage,
} from '../modules/sessions/service.js';
import { evaluateWorkflow } from '../modules/workflow/engine.js';

export async function sessionsRoute(app: FastifyInstance): Promise<void> {
  // ── POST /sessions ──────────────────────────────────────────────────────────
  app.post('/sessions', async (req, reply) => {
    const parsed = CreateSessionSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply
        .code(400)
        .send({ error: 'Invalid request body', details: parsed.error.flatten() });
    }

    const { id } = await createSession(parsed.data);

    // Run initial evaluation so the caller gets an immediate workflow state.
    const [session, workflow] = await Promise.all([
      getSessionDetails(id),
      evaluateWorkflow(id),
    ]);

    return reply.code(201).send({ session, workflow });
  });

  // ── GET /sessions/:id ───────────────────────────────────────────────────────
  app.get<{ Params: { id: string } }>('/sessions/:id', async (req, _reply) => {
    const { id } = req.params;
    const [session, workflow] = await Promise.all([
      getSessionDetails(id),
      evaluateWorkflow(id),
    ]);
    return { session, workflow };
  });

  // ── PATCH /sessions/:id/stage ───────────────────────────────────────────────
  app.patch<{
    Params: { id: string };
    Body: { stage: string };
  }>('/sessions/:id/stage', async (req, reply) => {
    const { stage } = req.body ?? {};
    if (!stage || typeof stage !== 'string') {
      return reply.code(400).send({ error: '"stage" string is required' });
    }
    if (!isValidStage(stage)) {
      return reply.code(400).send({ error: `Unknown stage "${stage}"` });
    }
    const updated = await advanceSessionStage(req.params.id, stage);
    return updated;
  });

  // ── POST /sessions/:id/close ────────────────────────────────────────────────
  app.post<{
    Params: { id: string };
    Body: { end_reason?: string };
  }>('/sessions/:id/close', async (req, _reply) => {
    const { end_reason } = (req.body ?? {}) as { end_reason?: string };
    return closeSession(req.params.id, end_reason);
  });
}
