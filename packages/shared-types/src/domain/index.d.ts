export type AgentRole = 'agent' | 'revenues_adviser' | 'team_lead' | 'qa_coach' | 'admin';
export type AgentStatus = 'active' | 'training' | 'restricted' | 'inactive';
export type CallerRole = 'account_holder' | 'representative' | 'unknown';
export type AuthenticationStatus = 'unknown' | 'partial' | 'authenticated' | 'authenticated_via_representative';
export type DataOrigin = 'synthetic' | 'mocked_live_like' | 'future_live';
export type ScenarioType = 'payment_difficulty' | 'arrears' | 'support_route' | 'escalation';
export type ScenarioStatus = 'draft' | 'active' | 'archived';
export type SessionMode = 'demo_guided' | 'scenario_replay' | 'manual_test' | 'future_live_call';
export type SessionStage = 'intake' | 'classification' | 'fact_gathering' | 'path_determination' | 'support_and_explanation' | 'escalation_review' | 'wrap_up' | 'closed';
export type ClassificationStatus = 'unclassified' | 'provisional' | 'confirmed' | 'overridden';
export type EnquiryTypeCode = 'PD1' | 'PD2' | 'PD3' | 'PD4' | 'PD5' | 'PD6' | 'PD7' | 'PD8';
export type EnquiryTypeStatus = 'active' | 'deprecated' | 'draft';
export type QuestionType = 'single_select' | 'multi_select' | 'free_text' | 'boolean' | 'numeric' | 'date';
export type ResponseStatus = 'answered' | 'skipped' | 'not_applicable' | 'overridden';
export type ResponseSource = 'agent_input' | 'scenario_seed' | 'future_transcript_inference' | 'system_default';
export type DecisionType = 'classification' | 'path_selection' | 'support_trigger' | 'escalation_trigger' | 'outcome_constraint' | 'warning_trigger';
export type DecisionResultStatus = 'evaluated' | 'pending' | 'superseded';
export type SourceDomain = 'public_policy' | 'acme_operations';
export type GuidanceCardStatus = 'active' | 'draft' | 'archived';
export type GuidanceCardViewType = 'auto_surfaced' | 'manually_opened' | 'pinned';
export type SupportOptionCategory = 'payment_difficulty' | 'council_tax_reduction_signpost' | 'discount_exemption_signpost' | 'debt_advice' | 'specialist_review' | 'communication_support';
export type SurfacedSupportOptionState = 'surfaced' | 'discussed' | 'offered' | 'accepted' | 'declined' | 'referred';
export type EscalationCategory = 'higher_risk_recovery_stage' | 'liability_dispute' | 'representation_unclear' | 'vulnerability_sensitive' | 'breathing_space_related' | 'specialist_review_required';
export type EscalationSeverity = 'low' | 'medium' | 'high' | 'critical';
export type EscalationState = 'raised' | 'acknowledged' | 'routed' | 'resolved';
export type VulnerabilityCategory = 'physical_health' | 'mental_health' | 'disability_or_access_need' | 'bereavement' | 'caring_responsibility' | 'learning_or_cognitive_need' | 'language_or_communication_difficulty' | 'acute_financial_crisis' | 'third_party_support_dependency' | 'other_crisis';
export type VulnerabilitySource = 'resident_stated' | 'scenario_seed' | 'agent_selected' | 'future_system_flag';
export type WordingSourceType = 'curated' | 'generated' | 'templated';
export type WordingStatus = 'active' | 'draft' | 'retired';
export type PrimaryOutcomeCode = 'info_only' | 'support_signposted' | 'specialist_review_referred' | 'debt_advice_signposted' | 'vulnerability_flag_raised' | 'callback_required' | 'pending_further_evidence' | 'redirected';
export type OutcomeDisposition = 'completed' | 'pending' | 'escalated' | 'redirected';
export type CaseNoteStatus = 'draft' | 'accepted' | 'edited' | 'locked';
export type EvidenceType = 'account_reference' | 'notice_stage_statement' | 'benefit_or_income_statement' | 'support_worker_or_representative_statement' | 'communication_need_statement' | 'other_fact';
export type CompetencySignalType = 'positive' | 'negative' | 'neutral' | 'trend';
export type CompetencySignalSource = 'workflow_rules' | 'qa_review' | 'coaching_engine';
export type QAReviewStatus = 'pending' | 'completed' | 'calibrated' | 'reopened';
export type VersionStatus = 'draft' | 'active' | 'superseded' | 'archived';
export type Confidence = 'low' | 'medium' | 'high';
export type IntentSignalSource = 'agent_selected' | 'typed_note' | 'scenario_seed' | 'future_transcript' | 'workflow_inference';
export type EvidenceStatus = 'unverified' | 'resident_stated' | 'scenario_verified' | 'future_system_verified' | 'disputed';
export type SupportOptionStatus = 'active' | 'draft' | 'archived';
export interface Agent {
    id: string;
    display_name: string;
    role: AgentRole;
    team: string;
    skill_level: number;
    status: AgentStatus;
    created_at: string;
    updated_at: string;
    email?: string;
    coach_id?: string;
    tenure_weeks?: number;
    qa_band?: string;
}
export interface Resident {
    id: string;
    display_label: string;
    caller_role: CallerRole;
    authentication_status: AuthenticationStatus;
    data_origin: DataOrigin;
    created_at: string;
    updated_at: string;
    account_reference?: string;
    liable_party_name?: string;
    address_line_1?: string;
    postcode?: string;
    communication_needs?: string;
    known_support_flags?: string[];
}
export interface Scenario {
    id: string;
    title: string;
    description: string;
    scenario_type: ScenarioType;
    resident_profile_json: Record<string, unknown>;
    account_context_json: Record<string, unknown>;
    expected_primary_path: EnquiryTypeCode;
    status: ScenarioStatus;
    created_at: string;
    updated_at: string;
    expected_overlay_paths_json?: EnquiryTypeCode[];
    expected_outcome_code?: PrimaryOutcomeCode;
    difficulty_level?: number;
    tags?: string[];
}
export interface CallSession {
    id: string;
    agent_id: string;
    resident_id: string;
    session_mode: SessionMode;
    stage: SessionStage;
    classification_status: ClassificationStatus;
    workflow_version_id: string;
    content_version_id: string;
    prompt_version_id: string;
    started_at: string;
    created_at: string;
    updated_at: string;
    scenario_id?: string;
    primary_enquiry_type_id?: string;
    ended_at?: string;
    current_path_code?: EnquiryTypeCode;
    overlay_path_codes_json?: EnquiryTypeCode[];
}
export interface EnquiryType {
    id: string;
    code: EnquiryTypeCode;
    label: string;
    description: string;
    category: string;
    is_overlay: boolean;
    status: EnquiryTypeStatus;
    version: string;
    created_at: string;
    updated_at: string;
    parent_code?: EnquiryTypeCode;
    sort_order?: number;
}
export interface QuestionStepDefinition {
    id: string;
    code: string;
    stage: SessionStage;
    question_text: string;
    question_type: QuestionType;
    mandatory: boolean;
    active: boolean;
    workflow_version_id: string;
    created_at: string;
    updated_at: string;
    help_text?: string;
    why_it_matters_text?: string;
    sensitivity_warning?: string;
    answer_options_json?: string[];
    trigger_conditions_json?: Record<string, unknown>;
    skip_conditions_json?: Record<string, unknown>;
    sort_order?: number;
}
export interface GuidanceCard {
    id: string;
    code: string;
    title: string;
    summary: string;
    source_domain: SourceDomain;
    content_version_id: string;
    status: GuidanceCardStatus;
    created_at: string;
    updated_at: string;
    body_markdown?: string;
    do_say_text?: string;
    do_not_say_text?: string;
    warning_text?: string;
    tags?: string[];
    source_url?: string | null;
}
export interface SupportOption {
    id: string;
    code: string;
    label: string;
    category: SupportOptionCategory;
    resident_explanation: string;
    internal_handling_note: string;
    status: SupportOptionStatus;
    created_at: string;
    updated_at: string;
    requires_specialist_follow_up?: boolean;
    source_domain?: SourceDomain;
}
export interface EscalationFlag {
    id: string;
    call_session_id: string;
    code: string;
    category: EscalationCategory;
    severity: EscalationSeverity;
    state: EscalationState;
    reason_text: string;
    created_at: string;
    trigger_facts_json?: Record<string, unknown>;
    handoff_target?: string;
    resident_wording_text?: string;
}
export interface VulnerabilitySignal {
    id: string;
    call_session_id: string;
    category: VulnerabilityCategory;
    source: VulnerabilitySource;
    confidence: Confidence;
    requires_sensitive_handling: boolean;
    created_at: string;
    resident_stated_text?: string;
    specialist_review_recommended?: boolean;
}
export interface CallOutcome {
    id: string;
    call_session_id: string;
    primary_outcome_code: PrimaryOutcomeCode;
    disposition: OutcomeDisposition;
    owner_next_step: string;
    created_at: string;
    updated_at: string;
    callback_required?: boolean;
    resident_commitment_text?: string;
    internal_action_text?: string;
}
export interface CaseNote {
    id: string;
    call_session_id: string;
    summary_text: string;
    facts_json: Record<string, unknown>;
    actions_json: Record<string, unknown>;
    status: CaseNoteStatus;
    created_by: string;
    created_at: string;
    updated_at: string;
    ai_generated_draft?: boolean;
}
export interface WorkflowVersion {
    id: string;
    version_label: string;
    status: VersionStatus;
    published_at: string;
    created_at: string;
    updated_at: string;
    description?: string;
    change_summary?: string;
}
export interface ContentVersion {
    id: string;
    version_label: string;
    status: VersionStatus;
    published_at: string;
    created_at: string;
    updated_at: string;
}
export interface PromptVersion {
    id: string;
    version_label: string;
    status: VersionStatus;
    published_at: string;
    created_at: string;
    updated_at: string;
}
export interface IntentSignal {
    id: string;
    call_session_id: string;
    enquiry_type_code: EnquiryTypeCode;
    source: IntentSignalSource;
    confidence: Confidence;
    raw_signal_text: string;
    created_at: string;
    resolved_at?: string;
}
export interface QuestionResponse {
    id: string;
    call_session_id: string;
    question_step_id: string;
    status: ResponseStatus;
    source: ResponseSource;
    created_at: string;
    updated_at: string;
    text_value?: string;
    selected_options_json?: string[];
    numeric_value?: number;
    boolean_value?: boolean;
    date_value?: string;
    override_reason?: string;
}
export interface DecisionPointResult {
    id: string;
    call_session_id: string;
    decision_type: DecisionType;
    rule_code: string;
    result_status: DecisionResultStatus;
    trigger_facts_json: Record<string, unknown>;
    workflow_version_id: string;
    evaluated_at: string;
    result_payload_json?: Record<string, unknown>;
    override_reason?: string;
}
export interface GuidanceCardView {
    id: string;
    call_session_id: string;
    guidance_card_id: string;
    view_type: GuidanceCardViewType;
    viewed_at: string;
    dismissed_at?: string;
}
export interface SurfacedSupportOption {
    id: string;
    call_session_id: string;
    support_option_id: string;
    state: SurfacedSupportOptionState;
    trigger_rule_code: string;
    surfaced_at: string;
    updated_at: string;
    agent_notes?: string;
    outcome_notes?: string;
}
export interface SuggestedWording {
    id: string;
    call_session_id: string;
    stage: SessionStage;
    wording_text: string;
    source_type: WordingSourceType;
    status: WordingStatus;
    created_at: string;
    content_version_id?: string;
    prompt_version_id?: string;
    template_code?: string;
    confidence?: Confidence;
    dismissed_at?: string;
}
export interface EvidenceRecord {
    id: string;
    call_session_id: string;
    resident_id: string;
    evidence_type: EvidenceType;
    status: EvidenceStatus;
    recorded_at: string;
    captured_from_question_response_id?: string;
    description_text?: string;
    reference_value?: string;
}
export interface CompetencySignal {
    id: string;
    agent_id: string;
    signal_type: CompetencySignalType;
    source: CompetencySignalSource;
    signal_text: string;
    created_at: string;
    call_session_id?: string;
    competency_tag?: string;
    score_delta?: number;
}
export interface QAReview {
    id: string;
    call_session_id: string;
    reviewer_id: string;
    status: QAReviewStatus;
    created_at: string;
    updated_at: string;
    overall_score?: number;
    completed_at?: string;
    calibration_notes?: string;
    dimension_scores_json?: Record<string, number>;
    improvement_notes?: string;
}
//# sourceMappingURL=index.d.ts.map