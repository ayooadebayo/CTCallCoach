export type AnalyticsEventName = 'call_started' | 'session_closed' | 'intake_reason_selected' | 'enquiry_classified' | 'classification_overridden' | 'question_presented' | 'question_answered' | 'mandatory_question_skipped' | 'path_changed' | 'override_used' | 'guidance_card_viewed' | 'wording_viewed' | 'trace_opened' | 'card_pinned' | 'support_option_surfaced' | 'support_option_discussed' | 'vulnerability_signal_detected' | 'escalation_triggered' | 'escalation_confirmed' | 'escalation_dismissed' | 'escalation_screen_opened' | 'callback_marked' | 'summary_generated' | 'summary_edited' | 'summary_accepted' | 'call_outcome_selected' | 'ai_job_requested' | 'ai_job_completed' | 'ai_job_failed' | 'qa_view_opened' | 'qa_review_started' | 'qa_review_completed' | 'coaching_feedback_generated' | 'coaching_note_saved' | 'support_tab_opened' | 'workflow_version_viewed' | 'content_version_viewed' | 'prompt_version_viewed' | 'scenario_opened';
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
//# sourceMappingURL=index.d.ts.map