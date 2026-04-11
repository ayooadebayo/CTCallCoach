# Council Tax Call Coach — Analytics and QA Specification v0.1

## 1. Document purpose
This document defines the analytics, QA, and coaching measurement layer for the **Council Tax Call Coach MVP**.

It translates the Product PRD, Technical PRD, Workflow Specification, Domain Model, Screen Specification, and AI Prompt Architecture into a build-ready measurement and review framework.

This document defines:
- the product event model
- event payload guidance
- core MVP metrics
- QA rubric structure
- review workflows
- competency signal logic
- repeated error pattern tracking
- coaching output handling
- dashboard/reporting expectations

This is the canonical source of truth for how the MVP measures usage, quality, learning, and coaching value.

---

## 2. Why this document exists
The Council Tax Call Coach is not only a guided workflow product.
It is also a **learning-in-the-flow-of-work** product.

That means the MVP must measure two things at the same time:
- whether the workflow is being used correctly
- whether agents are improving through repeated use

Without a defined analytics and QA layer, the product would be able to guide calls but not show:
- whether it is helping
- where agents struggle
- what support is being missed
- whether escalation is working appropriately
- whether confidence and competence are growing

---

## 3. Measurement principles
1. **Measure the workflow, not just clicks**  
   The analytics model should reflect meaningful handling steps and decisions.

2. **Measure learning, not just throughput**  
   The product should be able to show signs of developing competence over time.

3. **Keep QA explainable**  
   QA outputs should be traceable to visible workflow events and session data.

4. **Use events plus review, not events alone**  
   System events are valuable, but some quality judgments require human QA review.

5. **Favor useful MVP metrics over overbuilt dashboards**  
   The first version should track what matters most to proving product value.

6. **Agent coaching should be supportive, not punitive**  
   The system should help identify improvement opportunities without creating opaque scoring anxiety.

---

## 4. Measurement scope for MVP
### In scope
- session progression events
- workflow usage events
- support and escalation events
- wrap-up quality events
- QA scoring
- coaching signal generation
- competency trend indicators
- repeated mistake detection
- scenario-level performance reporting

### Out of scope
- workforce management metrics
- telephony efficiency metrics such as handle time from live telecom systems
- production-grade BI warehouse design
- advanced predictive performance modeling
- formal HR performance scoring

---

## 5. Core event model
The MVP must capture structured product events from the guided workflow.

### Event categories
1. session lifecycle events
2. workflow progression events
3. guidance usage events
4. support and escalation events
5. wrap-up events
6. AI assistance events
7. QA and coaching events
8. admin/config visibility events

---

## 6. Session lifecycle events
### `call_started`
Purpose:
- marks the beginning of a guided session

Recommended payload:
- `call_session_id`
- `agent_id`
- `scenario_id`
- `session_mode`
- `started_at`
- `workflow_version_id`
- `content_version_id`
- `prompt_version_id`

### `session_closed`
Purpose:
- marks the end of a session

Recommended payload:
- `call_session_id`
- `ended_at`
- `duration_seconds`
- `end_reason`
- `primary_outcome_code`
- `primary_path`
- `overlay_paths`

---

## 7. Workflow progression events
### `intake_reason_selected`
Purpose:
- records the intake choice that starts the workflow path

Payload examples:
- `selected_reason_code`
- `initial_classification_candidate`

### `enquiry_classified`
Purpose:
- records the first or updated classification outcome

Payload examples:
- `classification_code`
- `confidence_level`
- `classification_status`
- `source`

### `classification_overridden`
Purpose:
- records an agent override of classification

Payload examples:
- `from_classification_code`
- `to_classification_code`
- `override_reason`

### `question_presented`
Purpose:
- records that a question was surfaced

Payload examples:
- `question_code`
- `stage`
- `mandatory`
- `primary_path`

### `question_answered`
Purpose:
- records structured fact capture

Payload examples:
- `question_code`
- `response_status`
- `source`
- `fact_key`

### `mandatory_question_skipped`
Purpose:
- records a skipped mandatory item

Payload examples:
- `question_code`
- `skip_reason`
- `stage`

### `path_changed`
Purpose:
- records meaningful path transitions during the call

Payload examples:
- `from_path`
- `to_path`
- `overlay_changes`
- `trigger_code`

### `override_used`
Purpose:
- generalized event for key agent overrides

Payload examples:
- `override_type`
- `original_value`
- `replacement_value`
- `reason`

---

## 8. Guidance usage events
### `guidance_card_viewed`
Purpose:
- records guidance consumption during handling

Payload examples:
- `guidance_card_id`
- `source_domain`
- `view_type`
- `trigger_code`

### `wording_viewed`
Purpose:
- records access to suggested wording

Payload examples:
- `wording_id`
- `source_type`
- `context_code`

### `trace_opened`
Purpose:
- indicates the agent or reviewer inspected workflow reasoning

Payload examples:
- `screen`
- `trace_context`

---

## 9. Support and escalation events
### `support_option_surfaced`
Purpose:
- records that a support or signposting route was shown

Payload examples:
- `support_option_code`
- `category`
- `trigger_code`
- `requires_specialist_follow_up`

### `support_option_discussed`
Purpose:
- records that the agent actively discussed a surfaced option

Payload examples:
- `support_option_code`
- `discussion_state`

### `vulnerability_signal_detected`
Purpose:
- records capture of a vulnerability-sensitive indicator

Payload examples:
- `category`
- `source`
- `requires_sensitive_handling`

### `escalation_triggered`
Purpose:
- records that escalation logic fired

Payload examples:
- `escalation_code`
- `category`
- `severity`
- `trigger_code`

### `escalation_confirmed`
Purpose:
- records that the recommended escalation action was taken

Payload examples:
- `escalation_code`
- `handoff_target`

### `escalation_dismissed`
Purpose:
- records that the agent chose not to follow the escalation recommendation

Payload examples:
- `escalation_code`
- `dismiss_reason`

### `callback_marked`
Purpose:
- records that a callback or follow-up requirement was captured

Payload examples:
- `callback_required`
- `follow_up_type`

---

## 10. Wrap-up events
### `summary_generated`
Purpose:
- records creation of the wrap-up note draft

Payload examples:
- `generation_method` (`ai` or `template`)
- `prompt_version_id`

### `summary_edited`
Purpose:
- records that the draft summary was changed by the agent

Payload examples:
- `edit_type`
- `summary_status`

### `summary_accepted`
Purpose:
- marks acceptance of the case note

Payload examples:
- `summary_status`
- `edit_count`

### `call_outcome_selected`
Purpose:
- records the chosen structured outcome

Payload examples:
- `primary_outcome_code`
- `disposition`

---

## 11. AI assistance events
### `ai_job_requested`
Purpose:
- records that an AI task was invoked

Payload examples:
- `job_name`
- `prompt_version_id`
- `model_name`

### `ai_job_completed`
Purpose:
- records successful AI response handling

Payload examples:
- `job_name`
- `latency_ms`
- `validation_status`
- `fallback_used`

### `ai_job_failed`
Purpose:
- records failure and fallback behavior

Payload examples:
- `job_name`
- `failure_type`
- `fallback_used`

---

## 12. QA and coaching events
### `qa_view_opened`
Purpose:
- records reviewer access to a completed session

### `qa_review_started`
Purpose:
- records beginning of a QA review

### `qa_review_completed`
Purpose:
- records completion of a review

Payload examples:
- `qa_review_id`
- `overall_score`
- `rubric_version`
- `reviewer_id`

### `coaching_feedback_generated`
Purpose:
- records generation of agent-facing coaching feedback

Payload examples:
- `generation_method`
- `confidence_level`

### `coaching_note_saved`
Purpose:
- records reviewer-added coaching notes

Payload examples:
- `qa_review_id`
- `note_type`

---

## 13. Admin/config events
### `workflow_version_viewed`
### `content_version_viewed`
### `prompt_version_viewed`
### `scenario_opened`

These are optional but useful in a demo/admin context to show that versioned configuration is visible and inspectable.

---

## 14. Event payload standards
All events should include a common base structure.

### Required base fields
- `event_id`
- `event_name`
- `occurred_at`
- `call_session_id`
- `workflow_version_id`
- `created_at`

### Optional base fields
- `agent_id`
- `scenario_id`
- `content_version_id`
- `prompt_version_id`
- `screen_name`
- `payload_json`

### Standards
- timestamps must be ISO-compatible
- enumerated fields should use stable codes
- optional event metadata should live in `payload_json`
- event names should remain consistent across releases where possible

---

## 15. Core MVP metrics
The MVP should report a focused set of metrics proving workflow quality and learning value.

### 15.1 Classification accuracy
Definition:
- percentage of sessions where classification was judged correct against expected scenario path or QA review

Inputs:
- `enquiry_classified`
- QA review
- scenario expected path

### 15.2 Mandatory step completion rate
Definition:
- percentage of required questions completed before wrap-up

Inputs:
- question definitions
- `question_answered`
- `mandatory_question_skipped`

### 15.3 Guidance usage rate
Definition:
- average number of guidance interactions per session

Inputs:
- `guidance_card_viewed`
- `wording_viewed`
- `trace_opened`

### 15.4 Support surfacing rate
Definition:
- percentage of relevant sessions where at least one support route was surfaced

Inputs:
- `support_option_surfaced`
- path and trigger conditions

### 15.5 Support discussion rate
Definition:
- percentage of surfaced support routes that were actively discussed

Inputs:
- `support_option_surfaced`
- `support_option_discussed`

### 15.6 Escalation rate
Definition:
- percentage of sessions where escalation logic fired

Inputs:
- `escalation_triggered`

### 15.7 Escalation appropriateness rate
Definition:
- percentage of escalations judged correct by QA or scenario expectation

Inputs:
- escalation events
- QA review
- scenario expectation

### 15.8 Summary acceptance rate
Definition:
- percentage of generated summaries accepted with minimal edits

Inputs:
- `summary_generated`
- `summary_edited`
- `summary_accepted`

### 15.9 QA adherence score
Definition:
- average QA score across rubric dimensions

Inputs:
- QA Review records

### 15.10 Time to confident handling
Definition:
- number of sessions until an agent consistently reaches a defined competency threshold on the supported scenario

Inputs:
- QA review score trend
- override frequency trend
- mandatory step completion trend
- coaching/competency signals

### 15.11 Repeat error pattern rate
Definition:
- frequency with which the same mistake recurs by agent or cohort

Inputs:
- missed steps
- override misuse
- escalation misses
- missed support opportunities

---

## 16. QA rubric structure
The MVP should use a lightweight but meaningful QA rubric.

### Rubric dimensions
1. classification accuracy
2. fact gathering completeness
3. clarity of explanation
4. support/signposting handling
5. escalation judgment
6. note quality
7. policy-safe handling

### Scoring approach
Recommended MVP approach:
- 1–5 score for each dimension
- overall score derived from weighted average or simple average

### Rubric notes
Reviewers should also be able to record:
- missed mandatory steps
- notable strengths
- coaching notes
- follow-up needed

---

## 17. QA review workflow
### Step 1
Reviewer opens completed session.

### Step 2
System surfaces summary information:
- path taken
- outcome
- support and escalation actions
- skipped mandatory items
- note content
- event timeline

### Step 3
Reviewer scores rubric dimensions.

### Step 4
Reviewer records:
- missed steps
- coaching note
- strengths
- improvement priorities

### Step 5
System saves review and updates competency signals.

---

## 18. Competency signal model
Competency signals are lightweight derived indicators that describe agent development over time.

### Competency dimensions
- classification
- recovery-stage recognition
- support/signposting recognition
- vulnerability-sensitive handling
- escalation judgment
- wrap-up quality
- workflow adherence

### Example signal types
- `positive`
- `negative`
- `neutral`
- `trend`

### Example signal triggers
- consistent completion of mandatory questions → positive workflow adherence signal
- repeated missed reminder/final-notice differentiation → negative classification signal
- repeated appropriate escalation in higher-risk scenarios → positive escalation signal
- repeated missed support opportunity when benefits/low income marker present → negative support-handling signal

### MVP approach
Signals can initially be rule-based rather than model-based.

---

## 19. Repeated error pattern tracking
The system must identify repeated mistakes that matter for coaching.

### Error pattern categories
- recurring skipped mandatory question
- repeated misclassification
- repeated failure to surface or discuss relevant support route
- repeated escalation dismissal in higher-risk cases
- repeated weak note quality
- repeated overreliance on override behavior

### Tracking levels
- per agent
- by skill cohort
- by scenario type

### Output form
For MVP, repeated patterns can be surfaced as simple counters and trend labels rather than advanced analytics.

---

## 20. Coaching output handling
### Agent-facing coaching
After wrap-up, the product should provide concise feedback such as:
- what went well
- one missed opportunity
- one next-time tip

### Reviewer-facing coaching
QA reviewers should be able to add a short human coaching note.

### Storage requirements
Store:
- generated coaching output
- reviewer coaching notes
- associated session ID
- competency dimensions referenced if applicable

---

## 21. Dashboard/reporting expectations
The MVP does not need an enterprise BI suite, but it should support a lightweight reporting layer.

### Minimum useful reporting views
1. **Session performance summary**
   - sessions completed
   - outcomes selected
   - support and escalation rates

2. **Workflow adherence view**
   - mandatory completion rate
   - override rate
   - path changes

3. **QA summary view**
   - average rubric scores
   - most common missed steps
   - note quality trend

4. **Competency/coaching view**
   - signals by agent
   - repeated error patterns
   - time to confident handling trend

5. **Scenario comparison view**
   - how agents perform across different demo scenarios

---

## 22. Data derivation guidance
Not every metric needs its own table.

### Store directly
- raw events
- QA reviews
- competency signals
- coaching outputs

### Derive from stored data
- mandatory completion rate
- support discussion rate
- escalation appropriateness rate
- summary edit rate
- repeated error counts
- trend summaries

This keeps the MVP implementation simpler.

---

## 23. QA and analytics UI placement guidance
### Agent-facing surfaces
- coaching preview in wrap-up
- minimal confidence/progress indicators later if needed

### Reviewer-facing surfaces
- Team Lead / QA screen
- optional lightweight summary dashboard

### Admin/demo-facing surfaces
- scenario and version visibility
- simple session and event summaries

---

## 24. Failure and data quality considerations
### If events are missing
- the product should still function
- QA view should indicate incomplete event trace
- derived metrics should flag data incompleteness

### If QA review is absent
- competency signals should still derive partially from workflow rules
- QA-dependent metrics should remain explicitly labeled as partial

### If AI coaching fails
- use rule-based coaching fallback
- still emit coaching generation event with failure/fallback status

---

## 25. Privacy and sensitivity guidance
The MVP should avoid unnecessary exposure of sensitive resident-like details in reporting.

### Recommended approach
- use synthetic data by default
- keep dashboards focused on workflow behavior and agent development
- avoid displaying more resident-identifying detail than needed for the demo

---

## 26. Implementation guidance for Cursor + Claude Code
When this document moves into the build repo, it should drive:
- analytics event schemas
- event logging utilities
- QA review types and API routes
- competency signal derivation logic
- reviewer dashboard queries
- summary reporting components

### Suggested repo areas
- `/docs/analytics-qa.md`
- `/src/analytics/events.ts`
- `/src/analytics/schema.ts`
- `/src/qa/rubric.ts`
- `/src/qa/reviews.ts`
- `/src/coaching/signals.ts`
- `/src/coaching/rules.ts`
- `/src/reporting/...`

---

## 27. MVP completion criteria for analytics and QA
The analytics and QA layer is considered implemented successfully when:
- key workflow and wrap-up events are captured
- QA reviews can be completed and stored
- core MVP metrics can be derived
- coaching outputs can be generated and saved
- repeated error patterns can be surfaced at least at a simple rule-based level
- reviewer screens can inspect missed steps and quality markers

---

## 28. Immediate next assets
The next assets to create after this are:
1. MVP Backlog and Delivery Plan
2. Repo Structure and Implementation Plan

---

## 29. Status
Status: Draft v0.1  
Intended use: Measurement, QA, and coaching reference for MVP build

