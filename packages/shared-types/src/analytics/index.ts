// Analytics event types
// Source: docs/council_tax_call_coach_analytics_and_qa_specification_v_0.md §5–§14
//         docs/council_tax_call_coach_technical_prd_v_0.md §19

export type AnalyticsEventName =
  // Session lifecycle
  | 'call_started'
  | 'session_closed'
  // Workflow progression
  | 'intake_reason_selected'
  | 'enquiry_classified'
  | 'classification_overridden'
  | 'question_presented'
  | 'question_answered'
  | 'mandatory_question_skipped'
  | 'path_changed'
  | 'override_used'
  // Guidance usage
  | 'guidance_card_viewed'
  | 'wording_viewed'
  | 'trace_opened'
  | 'card_pinned'
  // Support and escalation
  | 'support_option_surfaced'
  | 'support_option_discussed'
  | 'vulnerability_signal_detected'
  | 'escalation_triggered'
  | 'escalation_confirmed'
  | 'escalation_dismissed'
  | 'escalation_screen_opened'
  | 'callback_marked'
  // Wrap-up
  | 'summary_generated'
  | 'summary_edited'
  | 'summary_accepted'
  | 'call_outcome_selected'
  // AI assistance
  | 'ai_job_requested'
  | 'ai_job_completed'
  | 'ai_job_failed'
  // QA and coaching
  | 'qa_view_opened'
  | 'qa_review_started'
  | 'qa_review_completed'
  | 'coaching_feedback_generated'
  | 'coaching_note_saved'
  | 'support_tab_opened'
  // Admin
  | 'workflow_version_viewed'
  | 'content_version_viewed'
  | 'prompt_version_viewed'
  | 'scenario_opened';

export interface AnalyticsEventBase {
  event_id: string;
  event_name: AnalyticsEventName;
  occurred_at: string;
  call_session_id: string;
  workflow_version_id: string;
  created_at: string;
  agent_id?: string;
  scenario_id?: string;
  content_version_id?: string;
  prompt_version_id?: string;
  screen_name?: string;
  payload_json?: Record<string, unknown>;
}

export interface AnalyticsEvent extends AnalyticsEventBase {
  payload_json?: Record<string, unknown>;
}
