-- CreateEnum
CREATE TYPE "AgentRole" AS ENUM ('agent', 'revenues_adviser', 'team_lead', 'qa_coach', 'admin');

-- CreateEnum
CREATE TYPE "AgentStatus" AS ENUM ('active', 'training', 'restricted', 'inactive');

-- CreateEnum
CREATE TYPE "CallerRole" AS ENUM ('account_holder', 'representative', 'unknown');

-- CreateEnum
CREATE TYPE "AuthStatus" AS ENUM ('unknown', 'partial', 'authenticated', 'authenticated_via_representative');

-- CreateEnum
CREATE TYPE "DataOrigin" AS ENUM ('synthetic', 'mocked_live_like', 'future_live');

-- CreateEnum
CREATE TYPE "ScenarioStatus" AS ENUM ('draft', 'active', 'archived');

-- CreateEnum
CREATE TYPE "SessionMode" AS ENUM ('demo_guided', 'scenario_replay', 'manual_test', 'future_live_call');

-- CreateEnum
CREATE TYPE "SessionStage" AS ENUM ('intake', 'classification', 'fact_gathering', 'path_determination', 'support_and_explanation', 'escalation_review', 'wrap_up', 'closed');

-- CreateEnum
CREATE TYPE "ClassificationStatus" AS ENUM ('unclassified', 'provisional', 'confirmed', 'overridden');

-- CreateEnum
CREATE TYPE "EnquiryTypeCode" AS ENUM ('PD1', 'PD2', 'PD3', 'PD4', 'PD5', 'PD6', 'PD7', 'PD8');

-- CreateEnum
CREATE TYPE "EnquiryTypeStatus" AS ENUM ('active', 'deprecated', 'draft');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('single_select', 'multi_select', 'free_text', 'boolean', 'numeric', 'date');

-- CreateEnum
CREATE TYPE "ResponseStatus" AS ENUM ('answered', 'skipped', 'not_applicable', 'overridden');

-- CreateEnum
CREATE TYPE "ResponseSource" AS ENUM ('agent_input', 'scenario_seed', 'future_transcript_inference', 'system_default');

-- CreateEnum
CREATE TYPE "DecisionType" AS ENUM ('classification', 'path_selection', 'support_trigger', 'escalation_trigger', 'outcome_constraint', 'warning_trigger');

-- CreateEnum
CREATE TYPE "DecisionResultStatus" AS ENUM ('evaluated', 'pending', 'superseded');

-- CreateEnum
CREATE TYPE "SourceDomain" AS ENUM ('public_policy', 'acme_operations');

-- CreateEnum
CREATE TYPE "GuidanceCardStatus" AS ENUM ('active', 'draft', 'archived');

-- CreateEnum
CREATE TYPE "GuidanceCardViewType" AS ENUM ('auto_surfaced', 'manually_opened', 'pinned');

-- CreateEnum
CREATE TYPE "SupportOptionCategory" AS ENUM ('payment_difficulty', 'council_tax_reduction_signpost', 'discount_exemption_signpost', 'debt_advice', 'specialist_review', 'communication_support');

-- CreateEnum
CREATE TYPE "SupportOptionStatus" AS ENUM ('active', 'draft', 'archived');

-- CreateEnum
CREATE TYPE "SurfacedSupportState" AS ENUM ('surfaced', 'discussed', 'offered', 'accepted', 'declined', 'referred');

-- CreateEnum
CREATE TYPE "EscalationCategory" AS ENUM ('higher_risk_recovery_stage', 'liability_dispute', 'representation_unclear', 'vulnerability_sensitive', 'breathing_space_related', 'specialist_review_required');

-- CreateEnum
CREATE TYPE "EscalationSeverity" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "EscalationState" AS ENUM ('raised', 'acknowledged', 'routed', 'resolved');

-- CreateEnum
CREATE TYPE "VulnerabilityCategory" AS ENUM ('physical_health', 'mental_health', 'disability_or_access_need', 'bereavement', 'caring_responsibility', 'learning_or_cognitive_need', 'language_or_communication_difficulty', 'acute_financial_crisis', 'third_party_support_dependency', 'other_crisis');

-- CreateEnum
CREATE TYPE "VulnerabilitySource" AS ENUM ('resident_stated', 'scenario_seed', 'agent_selected', 'future_system_flag');

-- CreateEnum
CREATE TYPE "WordingSourceType" AS ENUM ('curated', 'generated', 'templated');

-- CreateEnum
CREATE TYPE "WordingStatus" AS ENUM ('active', 'draft', 'retired');

-- CreateEnum
CREATE TYPE "PrimaryOutcomeCode" AS ENUM ('info_only', 'support_signposted', 'specialist_review_referred', 'debt_advice_signposted', 'vulnerability_flag_raised', 'callback_required', 'pending_further_evidence', 'redirected');

-- CreateEnum
CREATE TYPE "OutcomeDisposition" AS ENUM ('completed', 'pending', 'escalated', 'redirected');

-- CreateEnum
CREATE TYPE "CaseNoteStatus" AS ENUM ('draft', 'accepted', 'edited', 'locked');

-- CreateEnum
CREATE TYPE "EvidenceType" AS ENUM ('account_reference', 'notice_stage_statement', 'benefit_or_income_statement', 'support_worker_or_representative_statement', 'communication_need_statement', 'other_fact');

-- CreateEnum
CREATE TYPE "EvidenceStatus" AS ENUM ('unverified', 'resident_stated', 'scenario_verified', 'future_system_verified', 'disputed');

-- CreateEnum
CREATE TYPE "CompetencySignalType" AS ENUM ('positive', 'negative', 'neutral', 'trend');

-- CreateEnum
CREATE TYPE "CompetencySignalSource" AS ENUM ('workflow_rules', 'qa_review', 'coaching_engine');

-- CreateEnum
CREATE TYPE "QAReviewStatus" AS ENUM ('pending', 'completed', 'calibrated', 'reopened');

-- CreateEnum
CREATE TYPE "VersionStatus" AS ENUM ('draft', 'active', 'superseded', 'archived');

-- CreateEnum
CREATE TYPE "Confidence" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "IntentSignalSource" AS ENUM ('agent_selected', 'typed_note', 'scenario_seed', 'future_transcript', 'workflow_inference');

-- CreateTable
CREATE TABLE "workflow_versions" (
    "id" TEXT NOT NULL,
    "version_label" TEXT NOT NULL,
    "status" "VersionStatus" NOT NULL DEFAULT 'draft',
    "description" TEXT,
    "change_summary" TEXT,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflow_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_versions" (
    "id" TEXT NOT NULL,
    "version_label" TEXT NOT NULL,
    "status" "VersionStatus" NOT NULL DEFAULT 'draft',
    "description" TEXT,
    "change_summary" TEXT,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_versions" (
    "id" TEXT NOT NULL,
    "version_label" TEXT NOT NULL,
    "status" "VersionStatus" NOT NULL DEFAULT 'draft',
    "description" TEXT,
    "change_summary" TEXT,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prompt_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enquiry_types" (
    "id" TEXT NOT NULL,
    "code" "EnquiryTypeCode" NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "is_overlay" BOOLEAN NOT NULL DEFAULT false,
    "parent_code" "EnquiryTypeCode",
    "sort_order" INTEGER,
    "handling_notes" TEXT,
    "status" "EnquiryTypeStatus" NOT NULL DEFAULT 'active',
    "version" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enquiry_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agents" (
    "id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "role" "AgentRole" NOT NULL,
    "team" TEXT NOT NULL,
    "skill_level" INTEGER NOT NULL DEFAULT 1,
    "status" "AgentStatus" NOT NULL DEFAULT 'active',
    "email" TEXT,
    "coach_id" TEXT,
    "tenure_weeks" INTEGER,
    "qa_band" TEXT,
    "feature_flags" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "residents" (
    "id" TEXT NOT NULL,
    "display_label" TEXT NOT NULL,
    "caller_role" "CallerRole" NOT NULL DEFAULT 'unknown',
    "authentication_status" "AuthStatus" NOT NULL DEFAULT 'unknown',
    "data_origin" "DataOrigin" NOT NULL DEFAULT 'synthetic',
    "account_reference" TEXT,
    "liable_party_name" TEXT,
    "address_line_1" TEXT,
    "postcode" TEXT,
    "contact_phone" TEXT,
    "contact_email" TEXT,
    "preferred_contact_method" TEXT,
    "communication_needs" TEXT,
    "representative_name" TEXT,
    "representative_relationship" TEXT,
    "known_support_flags" TEXT[],
    "notes_summary" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "residents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenarios" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scenario_type" TEXT NOT NULL,
    "resident_profile_json" JSONB NOT NULL,
    "account_context_json" JSONB NOT NULL,
    "expected_primary_path" "EnquiryTypeCode" NOT NULL,
    "expected_overlay_paths_json" JSONB,
    "expected_outcome_code" "PrimaryOutcomeCode",
    "expected_escalation_codes_json" JSONB,
    "expected_support_codes_json" JSONB,
    "difficulty_level" INTEGER,
    "tags" TEXT[],
    "seed_transcript" TEXT,
    "status" "ScenarioStatus" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "call_sessions" (
    "id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "resident_id" TEXT NOT NULL,
    "scenario_id" TEXT,
    "session_mode" "SessionMode" NOT NULL DEFAULT 'demo_guided',
    "stage" "SessionStage" NOT NULL DEFAULT 'intake',
    "classification_status" "ClassificationStatus" NOT NULL DEFAULT 'unclassified',
    "current_path_code" "EnquiryTypeCode",
    "overlay_path_codes_json" JSONB,
    "call_channel" TEXT,
    "session_confidence_score" DOUBLE PRECISION,
    "agent_notes_draft" TEXT,
    "end_reason" TEXT,
    "workflow_version_id" TEXT NOT NULL,
    "content_version_id" TEXT NOT NULL,
    "prompt_version_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "call_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intent_signals" (
    "id" TEXT NOT NULL,
    "call_session_id" TEXT NOT NULL,
    "signal_type" TEXT NOT NULL,
    "signal_value" TEXT NOT NULL,
    "source" "IntentSignalSource" NOT NULL,
    "confidence" "Confidence" NOT NULL DEFAULT 'medium',
    "raw_text_snippet" TEXT,
    "detected_by" TEXT,
    "dismissed_by_agent" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "intent_signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_step_definitions" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "stage" "SessionStage" NOT NULL,
    "question_text" TEXT NOT NULL,
    "question_type" "QuestionType" NOT NULL,
    "mandatory" BOOLEAN NOT NULL DEFAULT true,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "why_it_matters_text" TEXT,
    "help_text" TEXT,
    "sensitivity_warning" TEXT,
    "answer_options_json" JSONB,
    "trigger_conditions_json" JSONB,
    "skip_conditions_json" JSONB,
    "sort_order" INTEGER,
    "workflow_version_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_step_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_responses" (
    "id" TEXT NOT NULL,
    "call_session_id" TEXT NOT NULL,
    "question_step_definition_id" TEXT NOT NULL,
    "response_status" "ResponseStatus" NOT NULL,
    "answer_text" TEXT,
    "answer_boolean" BOOLEAN,
    "answer_number" DOUBLE PRECISION,
    "answer_json" JSONB,
    "captured_by" TEXT,
    "confidence" "Confidence",
    "source" "ResponseSource" NOT NULL DEFAULT 'agent_input',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decision_point_results" (
    "id" TEXT NOT NULL,
    "call_session_id" TEXT NOT NULL,
    "decision_code" TEXT NOT NULL,
    "decision_type" "DecisionType" NOT NULL,
    "result_status" "DecisionResultStatus" NOT NULL DEFAULT 'evaluated',
    "triggered" BOOLEAN NOT NULL DEFAULT false,
    "trigger_facts_json" JSONB,
    "result_payload_json" JSONB,
    "trace_text" TEXT,
    "confidence" "Confidence",
    "workflow_version_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "decision_point_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guidance_cards" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "source_domain" "SourceDomain" NOT NULL,
    "body_markdown" TEXT,
    "do_say_text" TEXT,
    "do_not_say_text" TEXT,
    "warning_text" TEXT,
    "applicable_contexts_json" JSONB,
    "source_reference_url" TEXT,
    "tags" TEXT[],
    "status" "GuidanceCardStatus" NOT NULL DEFAULT 'active',
    "content_version_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guidance_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guidance_card_views" (
    "id" TEXT NOT NULL,
    "call_session_id" TEXT NOT NULL,
    "guidance_card_id" TEXT NOT NULL,
    "view_type" "GuidanceCardViewType" NOT NULL,
    "trigger_code" TEXT,
    "display_context" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guidance_card_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suggested_wording" (
    "id" TEXT NOT NULL,
    "code" TEXT,
    "context_code" TEXT NOT NULL,
    "tone_type" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "source_type" "WordingSourceType" NOT NULL,
    "status" "WordingStatus" NOT NULL DEFAULT 'active',
    "reading_level" TEXT,
    "prohibited_use_notes" TEXT,
    "applicable_contexts_json" JSONB,
    "content_version_id" TEXT,
    "prompt_version_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suggested_wording_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_options" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "category" "SupportOptionCategory" NOT NULL,
    "resident_explanation" TEXT NOT NULL,
    "internal_handling_note" TEXT NOT NULL,
    "requires_specialist_follow_up" BOOLEAN NOT NULL DEFAULT false,
    "source_domain" "SourceDomain",
    "urgency" TEXT,
    "handoff_target" TEXT,
    "trigger_conditions_json" JSONB,
    "status" "SupportOptionStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surfaced_support_options" (
    "id" TEXT NOT NULL,
    "call_session_id" TEXT NOT NULL,
    "support_option_id" TEXT NOT NULL,
    "state" "SurfacedSupportState" NOT NULL DEFAULT 'surfaced',
    "trigger_code" TEXT,
    "notes" TEXT,
    "accepted_by_resident" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "surfaced_support_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escalation_flags" (
    "id" TEXT NOT NULL,
    "call_session_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "category" "EscalationCategory" NOT NULL,
    "severity" "EscalationSeverity" NOT NULL,
    "state" "EscalationState" NOT NULL DEFAULT 'raised',
    "reason_text" TEXT NOT NULL,
    "trigger_facts_json" JSONB,
    "handoff_target" TEXT,
    "sla_band" TEXT,
    "resident_wording_text" TEXT,
    "evidence_gap_text" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "escalation_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vulnerability_signals" (
    "id" TEXT NOT NULL,
    "call_session_id" TEXT NOT NULL,
    "resident_id" TEXT,
    "category" "VulnerabilityCategory" NOT NULL,
    "source" "VulnerabilitySource" NOT NULL,
    "confidence" "Confidence" NOT NULL DEFAULT 'medium',
    "requires_sensitive_handling" BOOLEAN NOT NULL DEFAULT true,
    "resident_stated_text" TEXT,
    "temporary_or_ongoing" TEXT,
    "consent_to_record_detail" BOOLEAN,
    "specialist_review_recommended" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vulnerability_signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "call_outcomes" (
    "id" TEXT NOT NULL,
    "call_session_id" TEXT NOT NULL,
    "primary_outcome_code" "PrimaryOutcomeCode" NOT NULL,
    "disposition" "OutcomeDisposition" NOT NULL,
    "owner_next_step" TEXT NOT NULL,
    "secondary_outcome_codes_json" JSONB,
    "callback_required" BOOLEAN NOT NULL DEFAULT false,
    "follow_up_due_at" TIMESTAMP(3),
    "resident_commitment_text" TEXT,
    "internal_action_text" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "call_outcomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_notes" (
    "id" TEXT NOT NULL,
    "call_session_id" TEXT NOT NULL,
    "summary_text" TEXT NOT NULL,
    "facts_json" JSONB NOT NULL,
    "actions_json" JSONB NOT NULL,
    "resident_commitments_json" JSONB,
    "follow_up_json" JSONB,
    "editing_history_json" JSONB,
    "ai_generated_draft" BOOLEAN NOT NULL DEFAULT false,
    "status" "CaseNoteStatus" NOT NULL DEFAULT 'draft',
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "case_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_records" (
    "id" TEXT NOT NULL,
    "call_session_id" TEXT NOT NULL,
    "resident_id" TEXT,
    "captured_from_question_response_id" TEXT,
    "evidence_type" "EvidenceType" NOT NULL,
    "source" TEXT NOT NULL,
    "status" "EvidenceStatus" NOT NULL DEFAULT 'unverified',
    "reference_value" TEXT,
    "summary_text" TEXT,
    "document_link_placeholder" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidence_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competency_signals" (
    "id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "call_session_id" TEXT,
    "signal_type" "CompetencySignalType" NOT NULL,
    "dimension_code" TEXT,
    "score_delta" DOUBLE PRECISION NOT NULL,
    "source" "CompetencySignalSource" NOT NULL,
    "explanation_text" TEXT,
    "confidence" "Confidence",
    "window_start" TIMESTAMP(3),
    "window_end" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competency_signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qa_reviews" (
    "id" TEXT NOT NULL,
    "call_session_id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "rubric_version" TEXT NOT NULL,
    "overall_score" DOUBLE PRECISION NOT NULL,
    "classification_score" DOUBLE PRECISION,
    "fact_gathering_score" DOUBLE PRECISION,
    "clarity_score" DOUBLE PRECISION,
    "support_handling_score" DOUBLE PRECISION,
    "escalation_score" DOUBLE PRECISION,
    "note_quality_score" DOUBLE PRECISION,
    "missed_steps_json" JSONB,
    "coaching_notes" TEXT,
    "status" "QAReviewStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "qa_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "call_session_id" TEXT NOT NULL,
    "workflow_version_id" TEXT NOT NULL,
    "agent_id" TEXT,
    "scenario_id" TEXT,
    "content_version_id" TEXT,
    "prompt_version_id" TEXT,
    "screen_name" TEXT,
    "payload_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workflow_versions_version_label_key" ON "workflow_versions"("version_label");

-- CreateIndex
CREATE UNIQUE INDEX "content_versions_version_label_key" ON "content_versions"("version_label");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_versions_version_label_key" ON "prompt_versions"("version_label");

-- CreateIndex
CREATE UNIQUE INDEX "enquiry_types_code_key" ON "enquiry_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "agents_email_key" ON "agents"("email");

-- CreateIndex
CREATE INDEX "call_sessions_agent_id_idx" ON "call_sessions"("agent_id");

-- CreateIndex
CREATE INDEX "call_sessions_stage_idx" ON "call_sessions"("stage");

-- CreateIndex
CREATE INDEX "call_sessions_started_at_idx" ON "call_sessions"("started_at");

-- CreateIndex
CREATE INDEX "intent_signals_call_session_id_idx" ON "intent_signals"("call_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "question_step_definitions_code_workflow_version_id_key" ON "question_step_definitions"("code", "workflow_version_id");

-- CreateIndex
CREATE INDEX "question_responses_call_session_id_idx" ON "question_responses"("call_session_id");

-- CreateIndex
CREATE INDEX "decision_point_results_call_session_id_idx" ON "decision_point_results"("call_session_id");

-- CreateIndex
CREATE INDEX "guidance_cards_source_domain_idx" ON "guidance_cards"("source_domain");

-- CreateIndex
CREATE UNIQUE INDEX "guidance_cards_code_content_version_id_key" ON "guidance_cards"("code", "content_version_id");

-- CreateIndex
CREATE INDEX "guidance_card_views_call_session_id_idx" ON "guidance_card_views"("call_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "suggested_wording_code_key" ON "suggested_wording"("code");

-- CreateIndex
CREATE UNIQUE INDEX "support_options_code_key" ON "support_options"("code");

-- CreateIndex
CREATE INDEX "surfaced_support_options_call_session_id_idx" ON "surfaced_support_options"("call_session_id");

-- CreateIndex
CREATE INDEX "escalation_flags_call_session_id_idx" ON "escalation_flags"("call_session_id");

-- CreateIndex
CREATE INDEX "vulnerability_signals_call_session_id_idx" ON "vulnerability_signals"("call_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "call_outcomes_call_session_id_key" ON "call_outcomes"("call_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "case_notes_call_session_id_key" ON "case_notes"("call_session_id");

-- CreateIndex
CREATE INDEX "evidence_records_call_session_id_idx" ON "evidence_records"("call_session_id");

-- CreateIndex
CREATE INDEX "competency_signals_agent_id_idx" ON "competency_signals"("agent_id");

-- CreateIndex
CREATE UNIQUE INDEX "qa_reviews_call_session_id_key" ON "qa_reviews"("call_session_id");

-- CreateIndex
CREATE INDEX "analytics_events_call_session_id_idx" ON "analytics_events"("call_session_id");

-- CreateIndex
CREATE INDEX "analytics_events_event_name_idx" ON "analytics_events"("event_name");

-- CreateIndex
CREATE INDEX "analytics_events_occurred_at_idx" ON "analytics_events"("occurred_at");

-- AddForeignKey
ALTER TABLE "call_sessions" ADD CONSTRAINT "call_sessions_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_sessions" ADD CONSTRAINT "call_sessions_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "residents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_sessions" ADD CONSTRAINT "call_sessions_scenario_id_fkey" FOREIGN KEY ("scenario_id") REFERENCES "scenarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_sessions" ADD CONSTRAINT "call_sessions_workflow_version_id_fkey" FOREIGN KEY ("workflow_version_id") REFERENCES "workflow_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_sessions" ADD CONSTRAINT "call_sessions_content_version_id_fkey" FOREIGN KEY ("content_version_id") REFERENCES "content_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_sessions" ADD CONSTRAINT "call_sessions_prompt_version_id_fkey" FOREIGN KEY ("prompt_version_id") REFERENCES "prompt_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intent_signals" ADD CONSTRAINT "intent_signals_call_session_id_fkey" FOREIGN KEY ("call_session_id") REFERENCES "call_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_step_definitions" ADD CONSTRAINT "question_step_definitions_workflow_version_id_fkey" FOREIGN KEY ("workflow_version_id") REFERENCES "workflow_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_responses" ADD CONSTRAINT "question_responses_call_session_id_fkey" FOREIGN KEY ("call_session_id") REFERENCES "call_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_responses" ADD CONSTRAINT "question_responses_question_step_definition_id_fkey" FOREIGN KEY ("question_step_definition_id") REFERENCES "question_step_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_point_results" ADD CONSTRAINT "decision_point_results_call_session_id_fkey" FOREIGN KEY ("call_session_id") REFERENCES "call_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_point_results" ADD CONSTRAINT "decision_point_results_workflow_version_id_fkey" FOREIGN KEY ("workflow_version_id") REFERENCES "workflow_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guidance_cards" ADD CONSTRAINT "guidance_cards_content_version_id_fkey" FOREIGN KEY ("content_version_id") REFERENCES "content_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guidance_card_views" ADD CONSTRAINT "guidance_card_views_call_session_id_fkey" FOREIGN KEY ("call_session_id") REFERENCES "call_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guidance_card_views" ADD CONSTRAINT "guidance_card_views_guidance_card_id_fkey" FOREIGN KEY ("guidance_card_id") REFERENCES "guidance_cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggested_wording" ADD CONSTRAINT "suggested_wording_content_version_id_fkey" FOREIGN KEY ("content_version_id") REFERENCES "content_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surfaced_support_options" ADD CONSTRAINT "surfaced_support_options_call_session_id_fkey" FOREIGN KEY ("call_session_id") REFERENCES "call_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surfaced_support_options" ADD CONSTRAINT "surfaced_support_options_support_option_id_fkey" FOREIGN KEY ("support_option_id") REFERENCES "support_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escalation_flags" ADD CONSTRAINT "escalation_flags_call_session_id_fkey" FOREIGN KEY ("call_session_id") REFERENCES "call_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vulnerability_signals" ADD CONSTRAINT "vulnerability_signals_call_session_id_fkey" FOREIGN KEY ("call_session_id") REFERENCES "call_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vulnerability_signals" ADD CONSTRAINT "vulnerability_signals_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "residents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_outcomes" ADD CONSTRAINT "call_outcomes_call_session_id_fkey" FOREIGN KEY ("call_session_id") REFERENCES "call_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_notes" ADD CONSTRAINT "case_notes_call_session_id_fkey" FOREIGN KEY ("call_session_id") REFERENCES "call_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence_records" ADD CONSTRAINT "evidence_records_call_session_id_fkey" FOREIGN KEY ("call_session_id") REFERENCES "call_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence_records" ADD CONSTRAINT "evidence_records_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "residents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence_records" ADD CONSTRAINT "evidence_records_captured_from_question_response_id_fkey" FOREIGN KEY ("captured_from_question_response_id") REFERENCES "question_responses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competency_signals" ADD CONSTRAINT "competency_signals_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competency_signals" ADD CONSTRAINT "competency_signals_call_session_id_fkey" FOREIGN KEY ("call_session_id") REFERENCES "call_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qa_reviews" ADD CONSTRAINT "qa_reviews_call_session_id_fkey" FOREIGN KEY ("call_session_id") REFERENCES "call_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qa_reviews" ADD CONSTRAINT "qa_reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_call_session_id_fkey" FOREIGN KEY ("call_session_id") REFERENCES "call_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_workflow_version_id_fkey" FOREIGN KEY ("workflow_version_id") REFERENCES "workflow_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_content_version_id_fkey" FOREIGN KEY ("content_version_id") REFERENCES "content_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_prompt_version_id_fkey" FOREIGN KEY ("prompt_version_id") REFERENCES "prompt_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
