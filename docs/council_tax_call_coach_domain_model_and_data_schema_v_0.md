# Council Tax Call Coach — Domain Model and Data Schema v0.1

## 1. Document purpose
This document defines the canonical domain model and initial data schema for the **Council Tax Call Coach MVP**.

It translates the Product PRD, Technical PRD, and Workflow Specification into build-ready data structures that can support:
- workflow execution
- fact capture
- guidance retrieval
- escalation logic
- wrap-up generation
- QA review
- coaching and analytics

This document is intended to guide:
- backend implementation
- database design
- API contracts
- frontend state shape
- workflow engine input/output definitions

---

## 2. Scope
This schema is designed for the MVP only.
It is optimized for a:
- browser-based demo product
- synthetic Acme City Council environment
- single supported call scenario: payment difficulty / arrears
- rules-first workflow engine
- constrained AI assistance layer

It is not intended to model the full council tax system of record.

---

## 3. Modeling principles
1. **Canonical entities first**  
   The product should have a small set of stable domain objects that can be reused across UI, workflow, AI, and analytics.

2. **Workflow state is explicit**  
   The system should not infer call state only from logs; active call state should be represented directly.

3. **Facts are structured**  
   Facts captured during the call should be stored in structured form, not only in free text.

4. **Version traceability is required**  
   Workflow version, content version, and prompt version should be associated to sessions and outputs.

5. **Synthetic scenario support is first-class**  
   Demo scenarios and synthetic residents must be clearly modeled rather than treated as ad hoc fixtures.

6. **Operational data and policy content are separate**  
   Acme operational objects and public-policy content must remain separable in storage and retrieval.

---

## 4. Entity overview
The MVP domain includes these primary entities:
- Agent
- Resident
- Scenario
- Call Session
- Enquiry Type
- Intent Signal
- Question Step Definition
- Question Response
- Decision Point Result
- Guidance Card
- Support Option
- Escalation Flag
- Vulnerability Signal
- Suggested Wording
- Call Outcome
- Case Note
- Evidence Record
- Competency Signal
- QA Review
- Analytics Event
- Workflow Version
- Content Version
- Prompt Version

Not all of these need to be exposed as separate UI objects, but they should exist in the system model.

---

## 5. Canonical entity definitions

## 5.1 Agent
### Purpose
Represents the contact-centre user handling a call.

### Required fields
- `id`
- `display_name`
- `role`
- `team`
- `skill_level`
- `status`
- `created_at`
- `updated_at`

### Optional fields
- `email`
- `coach_id`
- `tenure_weeks`
- `qa_band`
- `feature_flags`

### Relationships
- one Agent can own many Call Sessions
- one Agent can receive many Competency Signals
- one Agent can receive many QA Reviews

### Status values
- `active`
- `training`
- `restricted`
- `inactive`

---

## 5.2 Resident
### Purpose
Represents the caller or the person the enquiry relates to.

### Required fields
- `id`
- `display_label`
- `caller_role`
- `authentication_status`
- `data_origin`
- `created_at`
- `updated_at`

### Optional fields
- `account_reference`
- `liable_party_name`
- `address_line_1`
- `postcode`
- `contact_phone`
- `contact_email`
- `preferred_contact_method`
- `communication_needs`
- `representative_name`
- `representative_relationship`
- `known_support_flags`
- `notes_summary`

### Relationships
- one Resident can appear in many Call Sessions over time
- one Resident can have many Vulnerability Signals
- one Resident can have many Evidence Records

### Status-like fields
Authentication is modeled through `authentication_status`:
- `unknown`
- `partial`
- `authenticated`
- `authenticated_via_representative`

### Data origin values
- `synthetic`
- `mocked_live_like`
- `future_live`

---

## 5.3 Scenario
### Purpose
Represents a synthetic or demo case used to run the MVP without live system integrations.

### Required fields
- `id`
- `title`
- `description`
- `scenario_type`
- `resident_profile_json`
- `account_context_json`
- `expected_primary_path`
- `status`
- `created_at`
- `updated_at`

### Optional fields
- `expected_overlay_paths_json`
- `expected_outcome_code`
- `difficulty_level`
- `tags`
- `seed_transcript`
- `expected_escalation_codes_json`
- `expected_support_codes_json`

### Relationships
- one Scenario can be used by many Call Sessions

### Status values
- `draft`
- `active`
- `archived`

---

## 5.4 Call Session
### Purpose
Represents one guided call-handling instance.

### Required fields
- `id`
- `agent_id`
- `resident_id`
- `session_mode`
- `stage`
- `classification_status`
- `workflow_version_id`
- `content_version_id`
- `prompt_version_id`
- `started_at`
- `created_at`
- `updated_at`

### Optional fields
- `scenario_id`
- `primary_enquiry_type_id`
- `call_channel`
- `ended_at`
- `end_reason`
- `session_confidence_score`
- `current_path_code`
- `overlay_path_codes_json`
- `agent_notes_draft`

### Relationships
- one Call Session has many Intent Signals
- one Call Session has many Question Responses
- one Call Session has many Decision Point Results
- one Call Session can surface many Guidance Cards
- one Call Session can surface many Support Options
- one Call Session can raise many Escalation Flags
- one Call Session can capture many Vulnerability Signals
- one Call Session has one final Call Outcome
- one Call Session has one Case Note
- one Call Session has many Analytics Events

### Session mode values
- `demo_guided`
- `scenario_replay`
- `manual_test`
- `future_live_call`

### Stage values
- `intake`
- `classification`
- `fact_gathering`
- `path_determination`
- `support_and_explanation`
- `escalation_review`
- `wrap_up`
- `closed`

### Classification status values
- `unclassified`
- `provisional`
- `confirmed`
- `overridden`

---

## 5.5 Enquiry Type
### Purpose
Represents a supported enquiry taxonomy node.

### Required fields
- `id`
- `code`
- `label`
- `description`
- `category`
- `is_overlay`
- `status`
- `version`
- `created_at`
- `updated_at`

### Optional fields
- `parent_code`
- `sort_order`
- `handling_notes`

### Relationships
- one Enquiry Type can be assigned to many Call Sessions
- one Enquiry Type can be referenced by many rules

### Status values
- `active`
- `deprecated`
- `draft`

---

## 5.6 Intent Signal
### Purpose
Represents a detected or manually selected cue that indicates likely call intent.

### Required fields
- `id`
- `call_session_id`
- `signal_type`
- `signal_value`
- `source`
- `confidence`
- `created_at`

### Optional fields
- `raw_text_snippet`
- `detected_by`
- `dismissed_by_agent`

### Source values
- `agent_selected`
- `typed_note`
- `scenario_seed`
- `future_transcript`
- `workflow_inference`

---

## 5.7 Question Step Definition
### Purpose
Represents a reusable workflow question definition.

### Required fields
- `id`
- `code`
- `stage`
- `question_text`
- `question_type`
- `mandatory`
- `active`
- `workflow_version_id`
- `created_at`
- `updated_at`

### Optional fields
- `help_text`
- `why_it_matters_text`
- `sensitivity_warning`
- `answer_options_json`
- `trigger_conditions_json`
- `skip_conditions_json`
- `sort_order`

### Question type values
- `single_select`
- `multi_select`
- `free_text`
- `boolean`
- `numeric`
- `date`

---

## 5.8 Question Response
### Purpose
Represents an answer captured against a question definition during a call session.

### Required fields
- `id`
- `call_session_id`
- `question_step_definition_id`
- `response_status`
- `created_at`
- `updated_at`

### Optional fields
- `answer_text`
- `answer_boolean`
- `answer_number`
- `answer_json`
- `captured_by`
- `confidence`
- `source`

### Response status values
- `answered`
- `skipped`
- `not_applicable`
- `overridden`

### Source values
- `agent_input`
- `scenario_seed`
- `future_transcript_inference`
- `system_default`

---

## 5.9 Decision Point Result
### Purpose
Represents the evaluation of a rule or decision node during the session.

### Required fields
- `id`
- `call_session_id`
- `decision_code`
- `decision_type`
- `result_status`
- `triggered`
- `workflow_version_id`
- `created_at`

### Optional fields
- `trigger_facts_json`
- `result_payload_json`
- `trace_text`
- `confidence`

### Decision type values
- `classification`
- `path_selection`
- `support_trigger`
- `escalation_trigger`
- `outcome_constraint`
- `warning_trigger`

### Result status values
- `evaluated`
- `pending`
- `superseded`

---

## 5.10 Guidance Card
### Purpose
Represents a concise guidance item shown to the agent.

### Required fields
- `id`
- `code`
- `title`
- `summary`
- `source_domain`
- `content_version_id`
- `status`
- `created_at`
- `updated_at`

### Optional fields
- `body_markdown`
- `do_say_text`
- `do_not_say_text`
- `warning_text`
- `applicable_contexts_json`
- `source_reference_url`
- `tags`

### Source domain values
- `public_policy`
- `acme_operations`

### Status values
- `active`
- `draft`
- `archived`

---

## 5.11 Guidance Card View
### Purpose
Tracks when a card is surfaced or viewed in a call session.

### Required fields
- `id`
- `call_session_id`
- `guidance_card_id`
- `view_type`
- `created_at`

### Optional fields
- `trigger_code`
- `display_context`

### View type values
- `auto_surfaced`
- `manually_opened`
- `pinned`

---

## 5.12 Support Option
### Purpose
Represents a possible support, signposting, or review route.

### Required fields
- `id`
- `code`
- `label`
- `category`
- `resident_explanation`
- `internal_handling_note`
- `status`
- `created_at`
- `updated_at`

### Optional fields
- `trigger_conditions_json`
- `requires_specialist_follow_up`
- `source_domain`
- `urgency`
- `handoff_target`

### Category values
- `payment_difficulty`
- `council_tax_reduction_signpost`
- `discount_exemption_signpost`
- `debt_advice`
- `specialist_review`
- `communication_support`

### Status values
- `active`
- `draft`
- `archived`

---

## 5.13 Surfaced Support Option
### Purpose
Tracks that a support option was surfaced or discussed during a call session.

### Required fields
- `id`
- `call_session_id`
- `support_option_id`
- `state`
- `created_at`

### Optional fields
- `trigger_code`
- `notes`
- `accepted_by_resident`

### State values
- `surfaced`
- `discussed`
- `offered`
- `accepted`
- `declined`
- `referred`

---

## 5.14 Escalation Flag
### Purpose
Represents a structured indication that safer or specialist handling is needed.

### Required fields
- `id`
- `call_session_id`
- `code`
- `category`
- `severity`
- `state`
- `reason_text`
- `created_at`

### Optional fields
- `trigger_facts_json`
- `handoff_target`
- `sla_band`
- `resident_wording_text`
- `evidence_gap_text`

### Category values
- `higher_risk_recovery_stage`
- `liability_dispute`
- `representation_unclear`
- `vulnerability_sensitive`
- `breathing_space_related`
- `specialist_review_required`

### Severity values
- `low`
- `medium`
- `high`
- `critical`

### State values
- `raised`
- `acknowledged`
- `routed`
- `resolved`

---

## 5.15 Vulnerability Signal
### Purpose
Represents a support-sensitive indicator captured during or before the call.

### Required fields
- `id`
- `call_session_id`
- `category`
- `source`
- `confidence`
- `requires_sensitive_handling`
- `created_at`

### Optional fields
- `resident_stated_text`
- `temporary_or_ongoing`
- `consent_to_record_detail`
- `specialist_review_recommended`

### Category values
- `physical_health`
- `mental_health`
- `disability_or_access_need`
- `bereavement`
- `caring_responsibility`
- `learning_or_cognitive_need`
- `language_or_communication_difficulty`
- `acute_financial_crisis`
- `third_party_support_dependency`
- `other_crisis`

### Source values
- `resident_stated`
- `scenario_seed`
- `agent_selected`
- `future_system_flag`

---

## 5.16 Suggested Wording
### Purpose
Represents approved or generated wording shown to the agent.

### Required fields
- `id`
- `context_code`
- `tone_type`
- `text`
- `source_type`
- `status`
- `created_at`
- `updated_at`

### Optional fields
- `content_version_id`
- `prompt_version_id`
- `reading_level`
- `prohibited_use_notes`
- `applicable_contexts_json`

### Source type values
- `curated`
- `generated`
- `templated`

### Status values
- `active`
- `draft`
- `retired`

---

## 5.17 Call Outcome
### Purpose
Represents the structured disposition of the call.

### Required fields
- `id`
- `call_session_id`
- `primary_outcome_code`
- `disposition`
- `owner_next_step`
- `created_at`
- `updated_at`

### Optional fields
- `secondary_outcome_codes_json`
- `callback_required`
- `follow_up_due_at`
- `resident_commitment_text`
- `internal_action_text`

### Primary outcome code values
- `info_only`
- `support_signposted`
- `specialist_review_referred`
- `debt_advice_signposted`
- `vulnerability_flag_raised`
- `callback_required`
- `pending_further_evidence`
- `redirected`

### Disposition values
- `completed`
- `pending`
- `escalated`
- `redirected`

---

## 5.18 Case Note
### Purpose
Represents the structured internal summary produced at wrap-up.

### Required fields
- `id`
- `call_session_id`
- `summary_text`
- `facts_json`
- `actions_json`
- `status`
- `created_by`
- `created_at`
- `updated_at`

### Optional fields
- `resident_commitments_json`
- `follow_up_json`
- `editing_history_json`
- `ai_generated_draft`

### Status values
- `draft`
- `accepted`
- `edited`
- `locked`

---

## 5.19 Evidence Record
### Purpose
Represents a structured evidence item or fact source referenced in the call.

### Required fields
- `id`
- `call_session_id`
- `evidence_type`
- `source`
- `status`
- `created_at`

### Optional fields
- `reference_value`
- `summary_text`
- `document_link_placeholder`
- `captured_from_question_response_id`

### Evidence type values
- `account_reference`
- `notice_stage_statement`
- `benefit_or_income_statement`
- `support_worker_or_representative_statement`
- `communication_need_statement`
- `other_fact`

### Source values
- `resident_stated`
- `scenario_seed`
- `future_system_lookup`

### Status values
- `unverified`
- `resident_stated`
- `scenario_verified`
- `future_system_verified`
- `disputed`

---

## 5.20 Competency Signal
### Purpose
Represents an inferred signal about agent capability or learning progress.

### Required fields
- `id`
- `agent_id`
- `signal_type`
- `score_delta`
- `source`
- `created_at`

### Optional fields
- `call_session_id`
- `dimension_code`
- `explanation_text`
- `confidence`
- `window_start`
- `window_end`

### Signal type values
- `positive`
- `negative`
- `neutral`
- `trend`

### Source values
- `workflow_rules`
- `qa_review`
- `coaching_engine`

---

## 5.21 QA Review
### Purpose
Represents a quality or coaching review of a handled call.

### Required fields
- `id`
- `call_session_id`
- `reviewer_id`
- `rubric_version`
- `overall_score`
- `status`
- `created_at`
- `updated_at`

### Optional fields
- `classification_score`
- `fact_gathering_score`
- `clarity_score`
- `support_handling_score`
- `escalation_score`
- `note_quality_score`
- `missed_steps_json`
- `coaching_notes`

### Status values
- `pending`
- `completed`
- `calibrated`
- `reopened`

---

## 5.22 Analytics Event
### Purpose
Represents a structured product event used for analytics and QA.

### Required fields
- `id`
- `event_name`
- `occurred_at`
- `call_session_id`
- `workflow_version_id`
- `created_at`

### Optional fields
- `agent_id`
- `scenario_id`
- `content_version_id`
- `prompt_version_id`
- `payload_json`

---

## 5.23 Workflow Version
### Purpose
Represents a versioned workflow configuration.

### Required fields
- `id`
- `version_label`
- `status`
- `published_at`
- `created_at`
- `updated_at`

### Optional fields
- `description`
- `change_summary`

### Status values
- `draft`
- `active`
- `superseded`
- `archived`

---

## 5.24 Content Version
### Purpose
Represents a versioned content bundle for guidance and wording.

### Required fields
- `id`
- `version_label`
- `status`
- `published_at`
- `created_at`
- `updated_at`

### Optional fields
- `description`
- `change_summary`

---

## 5.25 Prompt Version
### Purpose
Represents a versioned prompt bundle for AI functions.

### Required fields
- `id`
- `version_label`
- `status`
- `published_at`
- `created_at`
- `updated_at`

### Optional fields
- `description`
- `change_summary`

---

## 6. Relationship summary
### Core relationship flow
Agent → Call Session → Question Responses / Decisions / Guidance / Support / Escalation / Outcome / Case Note

Resident → Call Session → Vulnerability Signals / Evidence Records

Scenario → Call Session

Workflow Version / Content Version / Prompt Version → Call Session

Call Session → Analytics Events

Call Session → QA Review

Agent → Competency Signal

---

## 7. Suggested relational table model
The MVP can be implemented as a modular monolith backed by PostgreSQL.
The following initial tables are recommended:

- `agents`
- `residents`
- `scenarios`
- `enquiry_types`
- `workflow_versions`
- `content_versions`
- `prompt_versions`
- `call_sessions`
- `intent_signals`
- `question_step_definitions`
- `question_responses`
- `decision_point_results`
- `guidance_cards`
- `guidance_card_views`
- `support_options`
- `surfaced_support_options`
- `escalation_flags`
- `vulnerability_signals`
- `suggested_wording`
- `call_outcomes`
- `case_notes`
- `evidence_records`
- `competency_signals`
- `qa_reviews`
- `analytics_events`

---

## 8. JSON field usage guidance
For MVP, some fields may be stored as JSON to reduce over-modeling.
This is acceptable for:
- trigger conditions
- applicable contexts
- editing history
- outcome secondary codes
- facts and actions blocks
- event payloads
- scenario profile blocks

However, these should still follow stable internal shapes.

### Recommended rule
Use normal columns for:
- identifiers
- statuses
- core relationships
- timestamps
- primary codes

Use JSON for:
- extensible metadata
- condition blocks
- UI context payloads
- trace details

---

## 9. Frontend state shape guidance
The frontend should be able to assemble a working call view from these state buckets:

### Session state
- session ID
- current stage
- current classification
- current primary path
- active overlays

### Facts state
- answered mandatory questions
- optional clarifiers
- vulnerability signals
- evidence items

### Guidance state
- surfaced guidance cards
- surfaced support options
- active warnings
- suggested wording

### Resolution state
- escalation flags
- wrap-up draft
- outcome draft
- coaching output

This state can be hydrated from a session API response rather than derived entirely in the client.

---

## 10. Workflow engine input model
The workflow engine should operate over a normalized input object with this approximate shape:

- `callSession`
- `residentContext`
- `scenarioContext`
- `capturedFacts`
- `intentSignals`
- `vulnerabilitySignals`
- `currentClassification`
- `currentStage`
- `workflowVersion`

The engine output should include:
- `primaryPath`
- `overlayPaths`
- `nextRequiredQuestion`
- `optionalClarifiers`
- `supportOptions`
- `escalationFlags`
- `warnings`
- `trace`

---

## 11. Initial API contract guidance
The following API shapes should map cleanly to this schema:

### Session APIs
- create session
- get session by ID
- update session stage

### Workflow APIs
- classify enquiry
- submit fact/response
- get next step
- override classification/path

### Guidance APIs
- get guidance cards for session state
- get wording suggestions

### Wrap-up APIs
- generate summary draft
- save case note
- save outcome
- generate coaching feedback

### Admin APIs
- list scenarios
- list workflow versions
- list guidance content
- publish workflow/content/prompt versions

---

## 12. Constraints and future-proofing notes
### MVP constraints
- synthetic residents only by default
- synthetic scenarios are first-class inputs
- no live resident account integration required
- no live telephony requirement

### Future extension points
The schema should allow later addition of:
- real account lookup identifiers
- telephony metadata
- transcript chunks
- callback tasks
- specialist team work items
- external case references

These should be added through new tables or optional fields rather than forcing a redesign of the MVP entities.

---

## 13. Implementation guidance for Cursor + Claude Code
When this schema is taken into the build repo, it should drive:
- ORM models
- database migrations
- TypeScript types
- validation schemas
- API request/response types
- frontend session state models

Recommended implementation pattern:
1. define canonical TypeScript types
2. define DB schema from those types
3. define validation schemas for inputs/outputs
4. generate shared types for frontend/backend reuse

This document should become one of the core source-of-truth docs in `/docs`.

---

## 14. MVP completion criteria for schema
The schema is sufficient for MVP when it can support:
- one full call session from intake to wrap-up
- question/answer capture
- path and decision traceability
- guidance and support surfacing
- escalation tracking
- case note generation and saving
- QA and coaching linkage
- analytics event capture
- scenario-driven demo sessions

---

## 15. Immediate next assets
The next assets to create after this are:
1. Screen-by-Screen UX Specification
2. AI Prompt Architecture
3. Analytics and QA Specification
4. MVP Backlog and Delivery Plan
5. Repo Structure and Implementation Plan

---

## 16. Status
Status: Draft v0.1  
Intended use: Canonical domain and data reference for MVP implementation

