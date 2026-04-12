// Fact extractor — builds a normalised WorkflowFacts object from raw DB query results.
//
// Priority rules:
//   1. Question responses (answered) override intent signals for the same fact key.
//   2. Vulnerability signals are always additive — they add to vulnerability_categories
//      and set vulnerability_detected=true regardless of question responses.
//
// Intent signals provide background context seeded from the scenario or agent-typed notes.
// They fill fact keys that have not yet been answered via a question response.

import type { WorkflowFacts } from './condition-evaluator.js';

// ─── Minimal shapes expected from Prisma query results ────────────────────────

export interface ResponseRow {
  response_status: string;
  answer_text: string | null;
  answer_boolean: boolean | null;
  answer_number: number | null;
  question_step_definition: { code: string };
}

export interface IntentSignalRow {
  signal_type: string;
  signal_value: string;
}

export interface VulnerabilitySignalRow {
  category: string;
}

// ─── Main extractor ───────────────────────────────────────────────────────────

/**
 * Build WorkflowFacts from session data.
 *
 * @param responses   All question_responses for the session (any status).
 * @param intentSignals  Non-dismissed intent signals for the session.
 * @param vulnerabilitySignals  All vulnerability signals for the session.
 */
export function extractFacts(
  responses: ResponseRow[],
  intentSignals: IntentSignalRow[],
  vulnerabilitySignals: VulnerabilitySignalRow[],
): WorkflowFacts {
  const facts: WorkflowFacts = {};

  // Intent signals provide background context (lowest priority).
  for (const sig of intentSignals) {
    applySignal(facts, sig.signal_type, sig.signal_value);
  }

  // Answered question responses override signals.
  for (const resp of responses) {
    if (resp.response_status !== 'answered') continue;
    applyResponse(facts, resp.question_step_definition.code, resp);
  }

  // Vulnerability signals are always additive.
  if (vulnerabilitySignals.length > 0) {
    facts.vulnerability_detected = true;
    facts.vulnerability_categories = [
      ...new Set([
        ...(facts.vulnerability_categories ?? []),
        ...vulnerabilitySignals.map((v) => v.category),
      ]),
    ];
  }

  return facts;
}

// ─── Signal → fact mapping ────────────────────────────────────────────────────

/**
 * Map a free-form intent signal (signal_type + signal_value) to the facts object.
 *
 * Signal types correspond to the fact keys used by classification / escalation rules.
 */
function applySignal(facts: WorkflowFacts, type: string, value: string): void {
  switch (type) {
    case 'notice_type':
      facts.notice_type = value;
      break;
    case 'intent':
      facts.intent = value;
      break;
    case 'stage_estimate':
      facts.stage_estimate = value;
      break;
    case 'income_changed':
      facts.income_changed = value === 'true';
      break;
    case 'benefits_or_low_income':
      facts.benefits_or_low_income = value === 'true';
      break;
    case 'vulnerability_detected':
      facts.vulnerability_detected = value === 'true';
      break;
    case 'breathing_space':
      facts.breathing_space_mentioned = value === 'true';
      break;
    case 'out_of_scope':
      facts.out_of_scope = value === 'true';
      break;
    case 'specialist_review_needed':
      facts.agent_override_specialist_review = value === 'true';
      break;
    case 'vulnerability_category':
      facts.vulnerability_categories = [
        ...(facts.vulnerability_categories ?? []),
        value,
      ];
      break;
    default:
      // Unknown signal type — silently ignored.
      break;
  }
}

// ─── Response → fact mapping ──────────────────────────────────────────────────

/**
 * Map an answered question response (identified by question_code) to the facts object.
 *
 * Each question_code corresponds to a specific fact key.
 */
function applyResponse(facts: WorkflowFacts, code: string, resp: ResponseRow): void {
  switch (code) {
    case 'Q_INTAKE_REASON':
      if (resp.answer_text) {
        facts.intake_reason = resp.answer_text;
        // Derive intent from intake answer — used by CR_001 and CR_005.
        if (resp.answer_text === 'struggling_to_pay') {
          facts.intent = 'struggling_to_pay';
        } else if (
          resp.answer_text === 'wants_arrangement_or_help'
        ) {
          facts.intent = 'time_to_pay';
        } else if (
          resp.answer_text === 'asks_about_reduction_or_help_available'
        ) {
          facts.intent = 'check_available_help';
        }
      }
      break;
    case 'Q_CLASS_STRUGGLING_OR_NOTICE':
      // Provides a more explicit intent confirmation at classification stage.
      if (resp.answer_text === 'struggling_to_pay') {
        facts.intent = 'struggling_to_pay';
      }
      break;
    case 'Q_CLASS_NOTICE_TYPE':
      if (resp.answer_text) facts.notice_type = resp.answer_text;
      break;
    case 'Q_CLASS_RESIDENT_GOAL':
      // Resident goal at classification stage provides an initial intent signal.
      if (resp.answer_text) facts.intent = resp.answer_text;
      break;
    case 'Q_FACTS_STAGE_ESTIMATE':
      if (resp.answer_text) facts.stage_estimate = resp.answer_text;
      break;
    case 'Q_FACTS_INCOME_CHANGE':
      if (resp.answer_boolean !== null) facts.income_changed = resp.answer_boolean;
      break;
    case 'Q_FACTS_BENEFITS_LOW_INCOME':
      if (resp.answer_boolean !== null) facts.benefits_or_low_income = resp.answer_boolean;
      break;
    case 'Q_FACTS_VULNERABILITY':
      if (resp.answer_boolean !== null) facts.vulnerability_detected = resp.answer_boolean;
      break;
    case 'Q_FACTS_RESIDENT_INTENT':
      // Resident intent captured during fact_gathering overrides earlier goal.
      if (resp.answer_text) facts.intent = resp.answer_text;
      break;
    default:
      // Optional or unknown question — no fact mapping needed.
      break;
  }
}
