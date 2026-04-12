// Workflow rule condition evaluator — pure function, no side effects.
//
// Conditions follow the JSON format in packages/workflow-config/src/versions/v1/*.json.
// Supported patterns (AND-combined at the top level):
//
//   { "notice_type": "no_notice" }
//     → scalar equality
//   { "notice_type": ["summons_or_court", "liability_order"] }
//     → scalar-fact must be one of the listed values
//   { "overlay_paths": ["PD6"] }
//     → array-fact must contain at least one of the listed values
//   { "vulnerability_categories": ["mental_health", "bereavement"] }
//     → array-fact must contain at least one of the listed values
//   { "benefits_or_low_income": true }
//     → boolean equality
//   { "OR": [{ ... }, { ... }] }
//     → at least one sub-condition block must match
//
// Top-level keys are AND-combined: all must pass for the overall condition to pass.

// ─── Facts shape ──────────────────────────────────────────────────────────────

/** Normalised, flat facts object produced by extractFacts() from session DB data. */
export interface WorkflowFacts {
  /** Answer from Q_INTAKE_REASON */
  intake_reason?: string;
  /** Answer from Q_CLASS_NOTICE_TYPE (or scenario seed) */
  notice_type?: string;
  /** Answer from Q_CLASS_RESIDENT_GOAL or Q_FACTS_RESIDENT_INTENT (or scenario seed) */
  intent?: string;
  /** Answer from Q_FACTS_STAGE_ESTIMATE */
  stage_estimate?: string;
  /** Answer from Q_FACTS_INCOME_CHANGE (or scenario seed) */
  income_changed?: boolean;
  /** Answer from Q_FACTS_BENEFITS_LOW_INCOME (or scenario seed) */
  benefits_or_low_income?: boolean;
  /** Answer from Q_FACTS_VULNERABILITY (or scenario seed / vulnerability signals) */
  vulnerability_detected?: boolean;
  /** Collected from VulnerabilitySignal records */
  vulnerability_categories?: string[];
  /** Set true when a breathing-space intent signal is present */
  breathing_space_mentioned?: boolean;
  /** Set true when an out-of-scope signal is present */
  out_of_scope?: boolean;
  /** Set true when agent explicitly requests specialist review */
  agent_override_specialist_review?: boolean;
  /** Mirrors session.current_path_code — enriched after classification run */
  primary_path?: string;
  /** Mirrors session.overlay_path_codes_json — enriched after classification run */
  overlay_paths?: string[];
}

// ─── Keys whose facts are arrays; condition values use any-of semantics ──────
const ARRAY_FACT_KEYS = new Set<string>(['overlay_paths', 'vulnerability_categories']);

// ─── Evaluator ────────────────────────────────────────────────────────────────

function evaluatePair(key: string, expected: unknown, facts: WorkflowFacts): boolean {
  const factRecord = facts as Record<string, unknown>;
  const actual = factRecord[key];

  if (ARRAY_FACT_KEYS.has(key)) {
    // Fact is an array; condition value is an array of candidates.
    // Pass if any candidate is found in the actual array.
    const actualArr = (actual as string[] | undefined) ?? [];
    const candidates = Array.isArray(expected) ? expected : [expected];
    return (candidates as string[]).some((c) => actualArr.includes(c));
  }

  if (Array.isArray(expected)) {
    // Scalar fact; condition is a list of allowed values.
    return expected.includes(actual);
  }

  // Direct equality (strings, booleans, null).
  return actual === expected;
}

/**
 * Evaluate a condition object (from a rule's `conditions` or `trigger_conditions` field)
 * against a normalised facts object.
 *
 * Returns true when all top-level key tests pass (AND semantics).
 * The special key "OR" evaluates sub-conditions with OR semantics.
 */
export function evaluateConditions(
  conditions: Record<string, unknown>,
  facts: WorkflowFacts,
): boolean {
  for (const [key, expected] of Object.entries(conditions)) {
    if (key === 'OR') {
      const subConditions = expected as Array<Record<string, unknown>>;
      if (!subConditions.some((sub) => evaluateConditions(sub, facts))) {
        return false;
      }
      continue;
    }
    if (!evaluatePair(key, expected, facts)) {
      return false;
    }
  }
  return true;
}
