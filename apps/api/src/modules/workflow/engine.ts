// Workflow engine — evaluates all rules for a session and returns a WorkflowEngineOutput.
//
// Entry point: evaluateWorkflow(sessionId)
//
// Steps:
//   1. Load session + related data from DB
//   2. Extract normalised facts from responses, intent signals, vulnerability signals
//   3. Run classification rules → primary path + overlay paths
//   4. Enrich facts with resolved paths for downstream rule evaluation
//   5. Resolve next required question and optional clarifiers for current stage
//   6. Evaluate support trigger rules
//   7. Evaluate escalation trigger rules
//   8. Resolve active warnings from content bundle
//   9. Compute allowed outcomes for active paths
//  10. Assemble trace and return WorkflowEngineOutput
//
// No AI, no telephony. Fully deterministic against seeded DB + config files.

import { db } from '../../db/client.js';
import { loadV1WorkflowConfig } from '@ctcc/workflow-config';
import { loadV1ContentBundle } from '@ctcc/content-bundles';
import type {
  WorkflowEngineOutput,
  WorkflowQuestion,
  WorkflowEscalationFlag,
  WorkflowWarning,
  WorkflowDecision,
} from '@ctcc/shared-types';
import type { EnquiryTypeCode, ClassificationStatus } from '@ctcc/shared-types';
import { evaluateConditions, type WorkflowFacts } from './condition-evaluator.js';
import { extractFacts } from './fact-extractor.js';
import type {
  ClassificationRule,
  SupportTriggerRule,
  EscalationTriggerRule,
  OutcomeRule,
} from '@ctcc/shared-schemas';
import type { WarningContent } from '@ctcc/shared-schemas';

// ─── Public entry point ───────────────────────────────────────────────────────

export async function evaluateWorkflow(sessionId: string): Promise<WorkflowEngineOutput> {
  // 1. Load session from DB with all related data needed for evaluation.
  const session = await db.callSession.findUniqueOrThrow({
    where: { id: sessionId },
    include: {
      intent_signals: {
        where: { dismissed_by_agent: false },
        select: { signal_type: true, signal_value: true },
      },
      vulnerability_signals: {
        select: { category: true },
      },
      question_responses: {
        // All responses regardless of status — answered ones feed facts,
        // all are counted as "handled" for next-question resolution.
        select: {
          response_status: true,
          answer_text: true,
          answer_boolean: true,
          answer_number: true,
          question_step_definition: {
            select: { code: true },
          },
        },
      },
    },
  });

  const config = loadV1WorkflowConfig();
  const content = loadV1ContentBundle();

  // 2. Extract normalised facts.
  const facts = extractFacts(
    session.question_responses,
    session.intent_signals,
    session.vulnerability_signals,
  );

  // Seed facts with the session's persisted path state (from prior evaluations).
  // These can be overridden by fresh classification below.
  if (session.current_path_code) {
    facts.primary_path = session.current_path_code as string;
  }
  const persistedOverlays = Array.isArray(session.overlay_path_codes_json)
    ? (session.overlay_path_codes_json as unknown as string[])
    : [];
  if (persistedOverlays.length > 0) {
    facts.overlay_paths = persistedOverlays;
  }

  const workflowVersionId = session.workflow_version_id;

  // 3. Classification.
  const classResult = runClassification(facts, config.classificationRules);
  const primaryPath = classResult.primaryPath;
  const overlayPaths = classResult.overlayPaths;
  const classificationStatus = classResult.status;

  // 4. Enrich facts with resolved paths so support / escalation rules see current paths.
  if (primaryPath !== null) facts.primary_path = primaryPath;
  facts.overlay_paths = overlayPaths;

  // 5. Next required question.
  const handledCodes = session.question_responses.map(
    (r) => r.question_step_definition.code,
  );
  const questionResult = await resolveNextQuestion(
    session.stage as string,
    workflowVersionId,
    handledCodes,
  );

  // 6. Support triggers.
  const supportResult = evaluateSupportTriggers(facts, config.supportRules);

  // 7. Escalation triggers.
  const escalationResult = evaluateEscalationTriggers(facts, config.escalationRules);

  // 8. Warnings from content bundle.
  const warnings = resolveWarnings(facts, content.warnings);

  // 9. Allowed outcomes.
  const allowedOutcomes = resolveAllowedOutcomes(primaryPath, overlayPaths, config.outcomeRules);

  // 10. Assemble trace.
  const decisions: WorkflowDecision[] = [
    ...classResult.decisions,
    ...supportResult.decisions,
    ...escalationResult.decisions,
  ];

  const trace = {
    decisions,
    workflow_version_id: workflowVersionId,
    evaluated_at: new Date().toISOString(),
  };

  return {
    primaryPath: primaryPath as EnquiryTypeCode | null,
    overlayPaths: overlayPaths as EnquiryTypeCode[],
    nextRequiredQuestion: questionResult.nextRequired,
    optionalClarifiers: questionResult.optional,
    supportOptions: supportResult.codes,
    escalationFlags: escalationResult.flags,
    warnings,
    trace,
    classificationStatus,
    allowedOutcomes,
  };
}

// ─── Classification ───────────────────────────────────────────────────────────

interface ClassificationResult {
  primaryPath: string | null;
  overlayPaths: string[];
  status: ClassificationStatus;
  decisions: WorkflowDecision[];
}

function runClassification(
  facts: WorkflowFacts,
  rules: ClassificationRule[],
): ClassificationResult {
  let primaryPath: string | null = null;
  const overlayPaths: string[] = [];
  const decisions: WorkflowDecision[] = [];

  for (const rule of rules) {
    const triggered = evaluateConditions(
      rule.conditions as Record<string, unknown>,
      facts,
    );
    const triggerFacts = triggered
      ? collectTriggerFacts(rule.conditions as Record<string, unknown>, facts)
      : [];

    decisions.push({
      rule_code: rule.rule_code,
      decision_type: 'classification',
      triggered,
      trigger_facts: triggerFacts,
      result: triggered ? rule.output_path : 'no_match',
      explanation: rule.description,
    });

    if (!triggered) continue;

    if (rule.is_overlay) {
      if (!overlayPaths.includes(rule.output_path)) {
        overlayPaths.push(rule.output_path);
      }
    } else if (primaryPath === null) {
      // First matching non-overlay rule wins.
      primaryPath = rule.output_path;
    }
  }

  const status: ClassificationStatus =
    primaryPath !== null ? 'provisional' : 'unclassified';

  return { primaryPath, overlayPaths, status, decisions };
}

// ─── Next question ────────────────────────────────────────────────────────────

interface QuestionResult {
  nextRequired: WorkflowQuestion | null;
  optional: WorkflowQuestion[];
}

async function resolveNextQuestion(
  currentStage: string,
  workflowVersionId: string,
  handledCodes: string[],
): Promise<QuestionResult> {
  const steps = await db.questionStepDefinition.findMany({
    where: {
      workflow_version_id: workflowVersionId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      stage: currentStage as any,
      active: true,
    },
    orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }],
  });

  // Questions whose codes already appear in handledCodes are skipped.
  const unanswered = steps.filter((s) => !handledCodes.includes(s.code));
  const mandatory = unanswered.filter((s) => s.mandatory);
  const optional = unanswered.filter((s) => !s.mandatory);

  return {
    nextRequired: mandatory.length > 0 ? toWorkflowQuestion(mandatory[0]!) : null,
    optional: optional.map(toWorkflowQuestion),
  };
}

function toWorkflowQuestion(
  s: Awaited<ReturnType<typeof db.questionStepDefinition.findMany>>[number],
): WorkflowQuestion {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const q: WorkflowQuestion = {
    code: s.code,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stage: s.stage as any,
    question_text: s.question_text,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    question_type: s.question_type as any,
    mandatory: s.mandatory,
  };
  // exactOptionalPropertyTypes: only set optional fields when they have values.
  if (s.why_it_matters_text) q.why_it_matters_text = s.why_it_matters_text;
  if (s.sensitivity_warning) q.sensitivity_warning = s.sensitivity_warning;
  if (Array.isArray(s.answer_options_json) && s.answer_options_json.length > 0) {
    q.answer_options = s.answer_options_json as string[];
  }
  return q;
}

// ─── Support triggers ─────────────────────────────────────────────────────────

interface SupportResult {
  codes: string[];
  decisions: WorkflowDecision[];
}

function evaluateSupportTriggers(
  facts: WorkflowFacts,
  rules: SupportTriggerRule[],
): SupportResult {
  const codes: string[] = [];
  const decisions: WorkflowDecision[] = [];

  for (const rule of rules) {
    const triggered = evaluateConditions(
      rule.trigger_conditions as Record<string, unknown>,
      facts,
    );
    const triggerFacts = triggered
      ? collectTriggerFacts(rule.trigger_conditions as Record<string, unknown>, facts)
      : [];

    decisions.push({
      rule_code: rule.rule_code,
      decision_type: 'support_trigger',
      triggered,
      trigger_facts: triggerFacts,
      result: triggered ? rule.support_option_code : 'not_triggered',
      explanation: rule.description,
    });

    if (triggered && !codes.includes(rule.support_option_code)) {
      codes.push(rule.support_option_code);
    }
  }

  return { codes, decisions };
}

// ─── Escalation triggers ──────────────────────────────────────────────────────

interface EscalationResult {
  flags: WorkflowEscalationFlag[];
  decisions: WorkflowDecision[];
}

function evaluateEscalationTriggers(
  facts: WorkflowFacts,
  rules: EscalationTriggerRule[],
): EscalationResult {
  const flags: WorkflowEscalationFlag[] = [];
  const decisions: WorkflowDecision[] = [];

  for (const rule of rules) {
    const triggered = evaluateConditions(
      rule.trigger_conditions as Record<string, unknown>,
      facts,
    );
    const triggerFacts = triggered
      ? collectTriggerFacts(rule.trigger_conditions as Record<string, unknown>, facts)
      : [];

    decisions.push({
      rule_code: rule.rule_code,
      decision_type: 'escalation_trigger',
      triggered,
      trigger_facts: triggerFacts,
      result: triggered ? rule.escalation_code : 'not_triggered',
      explanation: rule.description,
    });

    if (triggered) {
      flags.push({
        code: rule.escalation_code,
        category: rule.category,
        severity: rule.severity,
        reason: rule.description,
        trigger_facts: triggerFacts,
      });
    }
  }

  return { flags, decisions };
}

// ─── Warnings ─────────────────────────────────────────────────────────────────

function resolveWarnings(
  facts: WorkflowFacts,
  warnings: WarningContent[],
): WorkflowWarning[] {
  const activePaths = [
    ...(facts.primary_path ? [facts.primary_path] : []),
    ...(facts.overlay_paths ?? []),
  ];

  const active: WorkflowWarning[] = [];

  for (const w of warnings) {
    // Breathing-space warning is ONLY raised when the explicit signal is present.
    // Its applicable_contexts mark it as relevant IF mentioned — not always-on.
    if (w.code === 'WARN_BREATHING_SPACE_CRITICAL') {
      if (facts.breathing_space_mentioned) {
        active.push({ code: w.code, severity: w.severity, message: w.message });
      }
      continue;
    }

    const contexts = w.applicable_contexts ?? [];
    if (activePaths.some((p) => contexts.includes(p))) {
      active.push({ code: w.code, severity: w.severity, message: w.message });
    }
  }

  return active;
}

// ─── Allowed outcomes ─────────────────────────────────────────────────────────

function resolveAllowedOutcomes(
  primaryPath: string | null,
  overlayPaths: string[],
  rules: OutcomeRule[],
): string[] {
  const allCodes = new Set<string>();

  for (const rule of rules) {
    if (rule.path_code === primaryPath || overlayPaths.includes(rule.path_code)) {
      rule.allowed_outcomes.forEach((o) => allCodes.add(o));
    }
  }

  return [...allCodes];
}

// ─── Trace helper ─────────────────────────────────────────────────────────────

/**
 * Return human-readable "key=value" strings for the fact keys referenced
 * by a condition block. Used to populate WorkflowDecision.trigger_facts.
 */
function collectTriggerFacts(
  conditions: Record<string, unknown>,
  facts: WorkflowFacts,
): string[] {
  const result: string[] = [];
  const factRecord = facts as Record<string, unknown>;

  for (const [key, _expected] of Object.entries(conditions)) {
    if (key === 'OR') continue;
    const actual = factRecord[key];
    if (actual !== undefined) {
      result.push(`${key}=${JSON.stringify(actual)}`);
    }
  }

  return result;
}
