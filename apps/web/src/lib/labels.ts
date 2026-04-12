// Human-readable labels for codes used in the UI.

// ─── Stage labels ─────────────────────────────────────────────────────────────

export const STAGE_LABELS: Record<string, string> = {
  intake: 'Intake',
  classification: 'Classification',
  fact_gathering: 'Fact Gathering',
  path_determination: 'Path',
  support_and_explanation: 'Support',
  escalation_review: 'Escalation',
  wrap_up: 'Wrap-Up',
  closed: 'Closed',
};

// Stages shown in the progress stepper (in order).
export const PROGRESS_STAGES = [
  'intake',
  'classification',
  'fact_gathering',
  'support_and_explanation',
  'wrap_up',
] as const;

// ─── Path labels ──────────────────────────────────────────────────────────────

export const PATH_LABELS: Record<string, string> = {
  PD1: 'No Notice / Early Contact',
  PD2: 'Reminder Notice',
  PD3: 'Final Notice',
  PD4: 'Summons / Liability Order',
  PD5: 'Formal Recovery / TTP',
  PD6: 'Benefits / Low Income',
  PD7: 'Vulnerability',
  PD8: 'Out of Scope',
};

export const PATH_COLORS: Record<string, string> = {
  PD1: 'bg-green-100 text-green-800',
  PD2: 'bg-yellow-100 text-yellow-800',
  PD3: 'bg-orange-100 text-orange-800',
  PD4: 'bg-red-100 text-red-800',
  PD5: 'bg-red-200 text-red-900',
  PD6: 'bg-blue-100 text-blue-800',
  PD7: 'bg-purple-100 text-purple-800',
  PD8: 'bg-gray-100 text-gray-700',
};

// ─── Outcome code labels ──────────────────────────────────────────────────────

export const OUTCOME_LABELS: Record<string, string> = {
  info_only: 'Information only',
  support_signposted: 'Support signposted',
  specialist_review_referred: 'Referred for specialist review',
  debt_advice_signposted: 'Debt advice signposted',
  vulnerability_flag_raised: 'Vulnerability flag raised',
  callback_required: 'Callback required',
  pending_further_evidence: 'Pending further evidence',
  redirected: 'Redirected',
};

export const OUTCOME_CODES = Object.keys(OUTCOME_LABELS);

// ─── Answer option labels ─────────────────────────────────────────────────────

// Maps raw answer option values to display labels for common questions.
export const ANSWER_OPTION_LABELS: Record<string, string> = {
  // Q_INTAKE_REASON options
  struggling_to_pay: 'Struggling to pay',
  wants_arrangement_or_help: 'Wants an arrangement or help',
  asks_about_reduction_or_help_available: 'Asking about reductions or help available',
  received_notice_has_questions: 'Received a notice and has questions',
  other: 'Other',

  // Q_CLASS_NOTICE_TYPE options
  no_notice: 'No notice received',
  reminder: 'Reminder notice',
  final_notice: 'Final notice',
  summons: 'Summons',
  liability_order: 'Liability order',

  // Q_CLASS_STRUGGLING_OR_NOTICE options
  struggling_to_pay_confirmed: 'Yes, struggling to pay',

  // Q_FACTS_STAGE_ESTIMATE options
  early_contact: 'Early contact (no recovery action)',
  formal_recovery: 'Formal recovery in progress',
  post_liability_order: 'Post liability order',

  // Q_CLASS_RESIDENT_GOAL / Q_FACTS_RESIDENT_INTENT
  time_to_pay: 'Set up a payment plan',
  check_available_help: 'Check what help is available',
};

export function labelFor(value: string): string {
  return ANSWER_OPTION_LABELS[value] ?? value.replace(/_/g, ' ');
}

// ─── Classification status labels ─────────────────────────────────────────────

export const CLASSIFICATION_STATUS_LABELS: Record<string, string> = {
  unclassified: 'Unclassified',
  provisional: 'Provisional',
  confirmed: 'Confirmed',
  overridden: 'Overridden',
};

// ─── Severity colours for warnings / escalations ──────────────────────────────

export const SEVERITY_COLORS: Record<string, string> = {
  informational: 'bg-blue-50 border-blue-300 text-blue-800',
  caution: 'bg-yellow-50 border-yellow-400 text-yellow-900',
  high_risk: 'bg-red-50 border-red-500 text-red-900',
  low: 'bg-blue-50 border-blue-300 text-blue-800',
  medium: 'bg-yellow-50 border-yellow-400 text-yellow-900',
  high: 'bg-orange-50 border-orange-400 text-orange-900',
  critical: 'bg-red-50 border-red-600 text-red-900',
};
