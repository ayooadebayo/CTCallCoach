export type AiJobName = 'question_rationale' | 'policy_simplifier' | 'suggested_wording' | 'wrap_up_summary' | 'coaching_feedback' | 'missed_support_opportunity';
export type AiConfidence = 'low' | 'medium' | 'high';
export interface AiJobBaseInput {
    call_session_id: string;
    workflow_version_id: string;
    content_version_id: string;
    prompt_version_id: string;
    session_context: {
        current_stage: string;
        primary_path: string | null;
        overlay_paths: string[];
        classification_status: string;
    };
    captured_facts: Record<string, unknown>;
}
export interface QuestionRationaleInput extends AiJobBaseInput {
    current_question_text: string;
    sensitivity_warning?: string;
}
export interface QuestionRationaleOutput {
    rationale_text: string;
    focus_area: string;
    warning_text?: string;
    confidence: AiConfidence;
}
export interface PolicySimplifierInput extends AiJobBaseInput {
    concept_code: string;
    concept_label: string;
    source_snippets: SourceSnippet[];
}
export interface PolicySimplifierOutput {
    plain_english_explanation: string;
    source_domain_summary: string;
    important_limitations: string;
    confidence: AiConfidence;
}
export interface SuggestedWordingInput extends AiJobBaseInput {
    escalation_state: string | null;
    vulnerability_flags: string[];
    tone_style: 'empathetic' | 'neutral' | 'firm_but_supportive';
}
export interface SuggestedWordingOutput {
    suggested_wording_text: string;
    tone_label: string;
    usage_note: string;
    warning_text?: string;
    confidence: AiConfidence;
}
export interface WrapUpSummaryInput extends AiJobBaseInput {
    surfaced_support_options: string[];
    escalation_flags: string[];
    selected_outcome?: string;
    resident_commitments: string[];
    internal_next_actions: string[];
}
export interface WrapUpSummaryOutput {
    summary_text: string;
    facts_structured: Record<string, unknown>;
    actions_structured: Record<string, unknown>;
    missing_information_warning?: string;
    confidence: AiConfidence;
}
export interface CoachingFeedbackInput extends AiJobBaseInput {
    session_outcome: string;
    mandatory_questions_completed: string[];
    mandatory_questions_missed: string[];
    support_routes_surfaced: string[];
    support_routes_discussed: string[];
    escalation_decisions: string[];
    override_count: number;
}
export interface CoachingFeedbackOutput {
    what_went_well: string;
    missed_opportunity: string;
    next_time_tip: string;
    confidence: AiConfidence;
}
export interface MissedSupportOpportunityInput extends AiJobBaseInput {
    surfaced_support_options: string[];
    discussed_support_options: string[];
    vulnerability_signals: string[];
    selected_outcome: string;
}
export interface MissedSupportOpportunityOutput {
    missed_opportunity_detected: boolean;
    opportunity_type?: string;
    reason_text?: string;
    evidence_points?: string[];
    confidence: AiConfidence;
}
export interface SourceSnippet {
    source_id: string;
    source_domain: 'public_policy' | 'acme_operations';
    title: string;
    snippet_text: string;
    applicability_reason?: string;
}
//# sourceMappingURL=index.d.ts.map