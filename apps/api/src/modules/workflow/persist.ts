// Persist workflow decision point results to the database.
//
// Called after evaluateWorkflow() when a mutation occurs (respond, override).
// Read-only evaluations (GET /workflow/:id/next) do not persist.
//
// Each WorkflowDecision in the trace is written as a DecisionPointResult row,
// enabling full rule traceability per the workflow specification §12.

import { db } from '../../db/client.js';
import type { WorkflowDecision } from '@ctcc/shared-types';

/** Subset of Prisma's DecisionType enum that we emit from the engine. */
type DBDecisionType =
  | 'classification'
  | 'path_selection'
  | 'support_trigger'
  | 'escalation_trigger'
  | 'outcome_constraint'
  | 'warning_trigger';

function mapDecisionType(type: string): DBDecisionType {
  switch (type) {
    case 'classification':    return 'classification';
    case 'path_selection':    return 'path_selection';
    case 'support_trigger':   return 'support_trigger';
    case 'escalation_trigger':return 'escalation_trigger';
    case 'outcome_constraint':return 'outcome_constraint';
    case 'warning_trigger':   return 'warning_trigger';
    default:                  return 'classification';
  }
}

/**
 * Persist an array of WorkflowDecision records for a session.
 *
 * All decisions (triggered and not-triggered) are written so that a full
 * trace of every rule evaluation is available for QA and coaching review.
 */
export async function persistDecisionResults(
  sessionId: string,
  workflowVersionId: string,
  decisions: WorkflowDecision[],
): Promise<void> {
  if (decisions.length === 0) return;

  await db.decisionPointResult.createMany({
    data: decisions.map((d) => ({
      call_session_id: sessionId,
      decision_code: d.rule_code,
      decision_type: mapDecisionType(d.decision_type),
      triggered: d.triggered,
      // Omit the field (undefined) rather than null to satisfy Prisma's nullable JSON type.
      ...(d.trigger_facts.length > 0
        ? { trigger_facts_json: { facts: d.trigger_facts } }
        : {}),
      result_payload_json: { result: d.result },
      trace_text: d.explanation,
      workflow_version_id: workflowVersionId,
    })),
  });
}
