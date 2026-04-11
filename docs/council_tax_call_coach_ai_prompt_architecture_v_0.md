# Council Tax Call Coach — AI Prompt Architecture v0.1

## 1. Document purpose
This document defines the AI prompt architecture for the **Council Tax Call Coach MVP**.

It translates the Product PRD, Technical PRD, Workflow Specification, Domain Model, and Screen Specification into a build-ready AI design.

This document defines:
- the role of AI in the product
- the boundaries of AI behavior
- the prompt stack and prompt layers
- the supported AI tasks in MVP
- the required input and output contracts
- the source and retrieval rules
- safety and fallback behavior
- versioning and observability requirements

This is the canonical source of truth for how AI is used in the MVP.

---

## 2. Why this document exists
The product is **not** a generic council tax chatbot.
It is a **rules-led workflow coach** with AI as a bounded assistance layer.

Without a clear prompt architecture, the build could drift into:
- generic copilot behavior
- invented local authority rules
- unsupported policy claims
- inconsistent wording quality
- untraceable outputs

This architecture prevents that drift.

---

## 3. AI role in the MVP
AI is used to assist the agent, not replace the workflow engine.

### AI may
- explain why a suggested question matters
- simplify a policy concept for the agent
- draft empathetic resident-facing wording
- generate a structured call summary draft
- generate after-call coaching feedback
- highlight likely missed support or signposting opportunities based on captured facts and workflow data

### AI must not
- decide legal entitlement
- decide Council Tax Reduction eligibility
- invent local council policy rules
- invent debt recovery powers
- override escalation logic
- confirm outcomes that were not captured
- fabricate facts missing from the session
- present guesses as confirmed policy

---

## 4. AI design principles
1. **Rules first, AI second**  
   Workflow state and pathing come from the rules engine, not the model.

2. **Single-purpose prompts**  
   Each AI task should have its own prompt contract rather than one all-purpose assistant prompt.

3. **Structured outputs only**  
   AI responses should be schema-bound and parseable.

4. **Source-bounded generation**  
   The model should only use supplied approved content and session state.

5. **Transparent uncertainty**  
   Where the model lacks sufficient information, it must say so in a constrained way.

6. **Graceful fallback**  
   The product must remain usable with AI degraded or unavailable.

7. **Version traceability**  
   Prompt version must be traceable for every AI-assisted output.

---

## 5. Supported AI jobs in MVP
The MVP should use separate AI jobs for the following functions:

1. **Question Rationale Generator**
2. **Policy Simplifier**
3. **Suggested Wording Generator**
4. **Wrap-Up Summary Generator**
5. **Coaching Feedback Generator**
6. **Missed Support Opportunity Detector**

These jobs may be implemented as separate prompt templates and API routes, even if they use the same underlying model.

---

## 6. Overall prompt stack
Each AI interaction should be built from layered inputs.

### Layer 1 — System boundary prompt
Defines:
- product identity
- role boundaries
- forbidden behaviors
- requirement to use supplied data only
- requirement to respect rules and escalation logic

### Layer 2 — Task prompt
Defines:
- the exact job being asked
- allowed output fields
- style/tone constraints
- what to do when information is missing

### Layer 3 — Session state payload
Includes:
- current workflow stage
- current classification/path
- captured facts
- support options surfaced
- escalation flags
- vulnerability signals
- resident goal

### Layer 4 — Source payload
Includes:
- approved public-policy snippets if relevant
- approved Acme operational snippets if relevant
- content IDs and source domain tags

### Layer 5 — Output schema contract
Defines:
- exact response fields
- confidence field
- uncertainty/warning field where needed
- prohibited fields

---

## 7. Global system prompt requirements
All AI jobs should inherit a common system boundary prompt.

### Global instructions must include
- You are assisting a contact-centre agent inside Council Tax Call Coach.
- Acme City Council is fictional.
- Public-policy-derived guidance and Acme operational guidance are distinct and must not be conflated.
- You may only use the provided session facts and approved source snippets.
- Do not invent account facts, legal outcomes, eligibility decisions, or local policy rules.
- Do not override the workflow engine or escalation rules.
- If needed facts are missing, say that the answer is limited and identify the missing information.
- Return only the structured fields requested.

### Global style expectations
- concise
- plain English
- professional
- supportive
- operationally useful

---

## 8. Shared prompt input model
All AI jobs should operate from a normalized payload with the following blocks, as applicable:

- `session_context`
- `workflow_context`
- `captured_facts`
- `support_context`
- `escalation_context`
- `vulnerability_context`
- `source_snippets`
- `task_parameters`

### Session context example fields
- `call_session_id`
- `current_stage`
- `primary_path`
- `overlay_paths`
- `classification_status`

### Captured facts example fields
- `recovery_stage_estimate`
- `income_changed`
- `benefits_or_low_income_flag`
- `resident_goal`
- `notice_mentions`
- `vulnerability_categories`
- `existing_arrears_help_request`

### Source snippet example fields
- `source_id`
- `source_domain`
- `title`
- `snippet_text`
- `applicability_reason`

---

## 9. AI job specification: Question Rationale Generator

## 9.1 Purpose
Explain to the agent why the currently recommended question matters.

## 9.2 Inputs
- current question text
- stage
- primary path
- captured facts so far
- sensitivity warnings if any

## 9.3 Output requirements
Return:
- `rationale_text`
- `focus_area`
- `warning_text`
- `confidence`

### Output constraints
- 1–3 short sentences maximum for `rationale_text`
- must not introduce new facts
- must not claim that an outcome is certain

## 9.4 Example use
Displayed under the “Why this matters” area on the Live Call Guidance Screen.

## 9.5 Fallback
If AI fails, show the curated `why_it_matters_text` stored in the question definition.

---

## 10. AI job specification: Policy Simplifier

## 10.1 Purpose
Convert a policy or guidance concept into a clearer explanation for the agent.

## 10.2 Inputs
- concept code or concept label
- approved source snippets
- current path/stage
- optional reading level parameter

## 10.3 Output requirements
Return:
- `plain_english_explanation`
- `source_domain_summary`
- `important_limitations`
- `confidence`

### Output constraints
- must only summarize supplied source snippets
- must mention local variation or uncertainty where relevant
- must not convert a signposting route into an entitlement decision

## 10.4 Example uses
- explaining reminder-stage meaning
n- explaining that support routes may exist but must be checked
- simplifying why a specialist review is safer

## 10.5 Fallback
Use the stored summary/body from the relevant guidance card.

---

## 11. AI job specification: Suggested Wording Generator

## 11.1 Purpose
Draft safe, empathetic wording the agent can use with the resident.

## 11.2 Inputs
- current stage
- primary path
- support options surfaced
- escalation state
- vulnerability-sensitive flags
- tone style parameter
- approved wording examples if available

## 11.3 Output requirements
Return:
- `suggested_wording_text`
- `tone_label`
- `usage_note`
- `warning_text`
- `confidence`

### Output constraints
- resident-facing wording only
- must be plain, supportive, and concise
- must not promise an outcome
- must not state legal certainty unless explicitly supplied in source material
- must not include process steps outside current workflow state

## 11.4 Example uses
- acknowledging distress
- explaining that the agent is checking the right next step
- explaining referral to specialist review
- sensitively signposting support or debt advice

## 11.5 Fallback
Use curated template wording from the content bundle.

---

## 12. AI job specification: Wrap-Up Summary Generator

## 12.1 Purpose
Generate a structured internal case note draft from the session data.

## 12.2 Inputs
- captured facts
- primary and overlay paths
- surfaced support options
- escalation flags
- selected outcome if already chosen
- resident commitments
- internal next actions

## 12.3 Output requirements
Return:
- `summary_text`
- `facts_structured`
- `actions_structured`
- `missing_information_warning`
- `confidence`

### Output constraints
- must not invent any facts
- must distinguish confirmed facts from uncertain or resident-stated facts where relevant
- must be suitable for internal case notes
- must reflect only captured session data

## 12.4 Example use
Prefill the note editor on the Wrap-Up Screen.

## 12.5 Fallback
Use a rule-based note template populated from captured fields.

---

## 13. AI job specification: Coaching Feedback Generator

## 13.1 Purpose
Generate short after-call coaching feedback for the agent.

## 13.2 Inputs
- session outcome
- mandatory questions completed or missed
- support routes surfaced and discussed
- escalation decisions
- override usage
- selected facts and workflow events

## 13.3 Output requirements
Return:
- `what_went_well`
- `missed_opportunity`
- `next_time_tip`
- `confidence`

### Output constraints
- concise
- actionable
- non-punitive
- must reference workflow/session evidence rather than general advice
- must not judge the agent on facts not available in the session data

## 13.4 Example use
Displayed after wrap-up and stored for review.

## 13.5 Fallback
Use simple rule-based coaching templates based on missed mandatory steps and support/escalation triggers.

---

## 14. AI job specification: Missed Support Opportunity Detector

## 14.1 Purpose
Identify whether the session data suggests a support or signposting opportunity that may have been missed.

## 14.2 Inputs
- captured facts
- surfaced support options
- support options discussed state
- vulnerability signals
- outcome selected
- approved support route definitions

## 14.3 Output requirements
Return:
- `missed_opportunity_detected`
- `opportunity_type`
- `reason_text`
- `evidence_points`
- `confidence`

### Output constraints
- must only flag opportunities grounded in captured facts
- must not claim that a resident is eligible for a scheme
- must be phrased as a likely opportunity, not a certainty

## 14.4 Example use
Feeds coaching and QA insight.

## 14.5 Fallback
Use deterministic rule checks against known support trigger conditions.

---

## 15. Retrieval and source discipline
AI generation must be **source-bounded**.

### Allowed source domains
1. `public_policy`
2. `acme_operations`
3. `session_facts`
4. `workflow_trace`

### Rules
- The model must not rely on its own unstated background knowledge for policy or local operational rules.
- Public policy and Acme operations must be supplied separately and labeled.
- Session facts must be treated as the highest-priority live context.
- If a needed source is missing, the output must acknowledge that limitation in the allowed warning field.

### Retrieval behavior by task
- Question rationale may not need retrieval beyond session/workflow context.
- Policy simplifier requires explicit source snippets.
- Suggested wording may use session state plus approved wording examples.
- Wrap-up summary uses session state, not policy retrieval.
- Coaching uses session data, rule traces, and event data.

---

## 16. Model selection approach for MVP
The MVP should assume budget-conscious model usage.

### Recommended approach
- use a lower-cost model tier for most assistive tasks
- reserve more expensive reasoning only if clearly needed later
- keep prompts short and structured
- avoid unnecessary long context windows

### Task suitability
- Question rationale: low-cost model suitable
- Policy simplifier: low-cost model suitable if source snippets are tightly bounded
- Suggested wording: low-cost model suitable
- Wrap-up summary: low-cost model suitable
- Coaching feedback: low-cost model suitable
- Missed opportunity detection: low-cost model or deterministic logic first

The product should be designed so model upgrades are optional, not foundational.

---

## 17. Prompt versioning strategy
Prompt templates must be versioned as first-class configuration.

### Prompt version bundle should include
- global system prompt version
- task prompt template versions
- output schema versions
- model identifier used
- rollout status
- change summary

### Traceability requirement
Every AI-generated output must be traceable to:
- `prompt_version_id`
- `model_name`
- `call_session_id`
- `workflow_version_id`
- `content_version_id` where relevant

---

## 18. Structured output schema guidance
All AI jobs should return machine-validated structured JSON or equivalent typed objects.

### General schema expectations
- required fields only
- no extra commentary
- no markdown formatting in structured fields unless explicitly allowed
- optional `warning_text` where useful
- `confidence` represented in a bounded consistent form

### Confidence guidance
Use one consistent format for MVP, for example:
- `low`
- `medium`
- `high`

Avoid pseudo-precision unless there is a real calibrated basis.

---

## 19. Safety and guardrail rules
The AI layer must be constrained by explicit guardrails before output reaches the UI.

### Guardrail checks should include
- no invented entitlement claims
- no invented Acme policy rules
- no contradiction of escalation logic
- no unsupported legal certainty
- no fabricated facts
- no unsupported procedural promises

### Output handling
If the output fails validation or guardrails:
- do not show raw model output
- fall back to curated or rule-based alternative
- log the failure for debugging

---

## 20. Observability and logging requirements
The system should log the following for each AI request:
- ai job name
- call session ID
- prompt version ID
- model identifier
- request timestamp
- success/failure status
- validation success/failure
- latency
- fallback used or not

### Important note
For MVP, logs should focus on metadata and safe debugging context.
Do not log more sensitive content than necessary.

---

## 21. UX placement guidance by AI job
### Question Rationale Generator
Displayed inline under the current question.

### Policy Simplifier
Displayed in the side panel guidance area when requested or triggered.

### Suggested Wording Generator
Displayed in the side panel wording tab or inline wording box.

### Wrap-Up Summary Generator
Displayed in the call wrap-up editor as an editable draft.

### Coaching Feedback Generator
Displayed after wrap-up and in QA review context.

### Missed Support Opportunity Detector
Usually hidden from the agent during the call; surfaced in coaching or QA contexts unless explicitly designed otherwise.

---

## 22. Failure and fallback behavior
### If the AI service is unavailable
- continue with rule-based workflow
- use curated question rationale text
- use curated wording templates
- use rule-based case note template
- use rule-based coaching prompts

### If retrieval content is missing
- do not generate a policy simplification output from memory
- use the stored guidance card if available
- otherwise show a controlled “guidance unavailable” state

### If the output is low confidence
- allow it to surface only if it remains within guardrails and usefulness thresholds
- otherwise suppress or replace with curated content

---

## 23. Testing requirements for prompts
Each prompt job should be tested against:
- normal case scenarios
- incomplete fact scenarios
- escalation scenarios
- vulnerability-sensitive scenarios
- misleading or sparse inputs
- prompt injection or irrelevant text attempts where applicable

### Test expectations
The prompt layer should be evaluated for:
- factual containment
- compliance with source boundaries
- schema validity
- tone suitability
- fallback correctness

---

## 24. Implementation guidance for Cursor + Claude Code
When this prompt architecture is taken into the build repo, it should drive:
- task-specific AI service modules
- shared system prompt config
- prompt template files
- typed request/response schemas
- validation middleware
- fallback logic
- observability hooks

### Recommended repo structure for prompts
- `/docs/prompt-architecture.md`
- `/src/ai/system-prompt.ts`
- `/src/ai/tasks/question-rationale.ts`
- `/src/ai/tasks/policy-simplifier.ts`
- `/src/ai/tasks/suggested-wording.ts`
- `/src/ai/tasks/wrap-up-summary.ts`
- `/src/ai/tasks/coaching-feedback.ts`
- `/src/ai/tasks/missed-support-opportunity.ts`
- `/src/ai/schemas/...`
- `/src/ai/guards/...`

This keeps the AI layer modular and inspectable.

---

## 25. MVP completion criteria for AI architecture
The AI layer is considered implemented successfully when:
- each AI function is task-specific and schema-bound
- outputs are source-bounded and traceable
- the workflow remains usable without AI
- fallback behavior exists for each AI task
- AI does not override rules or invent policy
- prompt and model versions are recorded with outputs

---

## 26. Immediate next assets
The next assets to create after this are:
1. Analytics and QA Specification
2. MVP Backlog and Delivery Plan
3. Repo Structure and Implementation Plan

---

## 27. Status
Status: Draft v0.1  
Intended use: Canonical AI design for MVP implementation

