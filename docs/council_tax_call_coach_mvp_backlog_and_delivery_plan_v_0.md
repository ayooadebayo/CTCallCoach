# Council Tax Call Coach — MVP Backlog and Delivery Plan v0.1

## 1. Document purpose
This document defines the MVP backlog and delivery plan for the **Council Tax Call Coach**.

It translates the Product PRD, Technical PRD, Workflow Specification, Domain Model, Screen Specification, AI Prompt Architecture, and Analytics/QA Specification into a build-sequenced implementation plan.

This document defines:
- what must be built for MVP
- what order the work should happen in
- how to phase delivery
- what should be stubbed or mocked first
- what is intentionally deferred
- how to move from specification into implementation in Cursor + Claude Code

This is the canonical source of truth for delivery sequencing and MVP execution.

---

## 2. Delivery philosophy
The MVP should be built as a **demo-first, workflow-first, integration-light product**.

That means:
- prove the guided call workflow before deep integrations
- build the core screens before advanced polish
- build the rules engine before sophisticated AI behavior
- use synthetic data and scenarios before live council data
- keep the AI layer narrow and assistive
- make the product explainable internally as well as usable externally

The product should be **robust enough to demonstrate real operational thinking**, without requiring enterprise dependencies to work.

---

## 3. MVP definition for delivery purposes
For delivery planning, the MVP is complete when a user can:
- open a synthetic council tax payment-difficulty scenario
- start a guided call session
- classify the enquiry
- answer structured questions
- see the workflow path change based on captured facts
- see support/signposting and escalation prompts
- complete a wrap-up summary and structured outcome
- receive coaching feedback
- review the session in a basic QA/reviewer view
- inspect that the system is rules-led and version-aware

Anything beyond that is optional for first release.

---

## 4. Delivery tracks
The work should be managed across six coordinated tracks:

1. **Workflow and content backbone**
2. **Core product UI**
3. **Backend and persistence**
4. **AI assistance layer**
5. **Analytics, QA, and coaching**
6. **Demo and implementation readiness**

These tracks should not be treated as isolated silos.
The delivery plan below sequences them into a practical implementation path.

---

## 5. MVP epic list

## Epic 1 — Project foundation and repo setup
Goal:
Establish the codebase, shared types, and implementation scaffolding.

### Scope
- initialize repo structure
- set up frontend app
- set up backend app
- set up shared TypeScript package or shared types layer
- configure database and migrations
- add environment configuration
- add linting, formatting, and test scaffolding
- add docs folder with canonical product assets
- add Cursor rules and `CLAUDE.md`

### Deliverables
- working monorepo or clearly structured app repo
- local dev environment
- CI basics
- docs synced into repo

### Priority
Critical

---

## Epic 2 — Domain model and persistence layer
Goal:
Implement the canonical data model and storage layer for the MVP.

### Scope
- define ORM schema or SQL schema
- create migrations
- implement models/tables for sessions, scenarios, responses, decisions, guidance, support, escalation, notes, QA, events
- seed initial workflow/content versions
- create seed data for synthetic scenarios

### Deliverables
- database schema in place
- seed scripts
- shared type contracts

### Priority
Critical

---

## Epic 3 — Workflow engine and rule execution
Goal:
Implement the rules-led call flow backbone.

### Scope
- implement enquiry taxonomy
- implement stage model
- implement question step definitions
- implement mandatory/optional question logic
- implement classification logic
- implement path change logic
- implement support trigger logic
- implement escalation trigger logic
- implement override behavior
- implement workflow trace output

### Deliverables
- executable workflow engine
- versioned workflow config files
- deterministic behavior across seeded scenarios

### Priority
Critical

---

## Epic 4 — Scenario library and synthetic data
Goal:
Make the MVP demoable without real integrations.

### Scope
- create scenario library model
- author 10–15 synthetic scenarios
- include reminder-stage, final-notice, arrears-help, support-route, vulnerability-sensitive, and escalation-heavy cases
- seed resident/account context per scenario
- define expected path and outcome per scenario

### Deliverables
- usable demo scenarios
- regression-testable expected results

### Priority
Critical

---

## Epic 5 — Call Intake and session start UX
Goal:
Enable a user to start a guided session from a scenario or manual setup.

### Scope
- implement Call Intake Screen
- scenario selection/start flow
- resident/context summary card
- intake reason capture
- initial classification generation
- session creation API integration

### Deliverables
- usable entry flow into guided handling

### Priority
Critical

---

## Epic 6 — Live Call Guidance experience
Goal:
Implement the core guided handling experience.

### Scope
- stage progress strip
- current question card
- answer controls
- facts rail
- warnings strip
- primary path / overlays display
- next question progression
- mandatory skip handling
- path override handling

### Deliverables
- fully usable main call-handling screen

### Priority
Critical

---

## Epic 7 — Guidance side panel and contextual support UI
Goal:
Implement the supporting knowledge and reasoning surface.

### Scope
- guidance tab
- wording tab
- support tab
- warnings tab
- trace tab
- card pinning behavior
- source-domain labeling

### Deliverables
- contextual guidance panel working inside live call flow

### Priority
High

---

## Epic 8 — Escalation and support handling flow
Goal:
Make support and escalation decisions visible and actionable.

### Scope
- escalation screen
- escalation flag cards
- support route cards
- confirm/dismiss escalation flows
- callback/follow-up capture
- safer routing behavior

### Deliverables
- support/escalation review experience

### Priority
High

---

## Epic 9 — Wrap-up, case note, and call outcome flow
Goal:
Enable strong structured closure of the call.

### Scope
- wrap-up screen
- facts recap
- outcome selector
- case note editor
- resident commitments and internal actions
- summary generation fallback template
- session close flow

### Deliverables
- end-to-end guided call closure

### Priority
Critical

---

## Epic 10 — AI assistance layer
Goal:
Add bounded assistive intelligence without changing the rules-led backbone.

### Scope
- question rationale generator
- policy simplifier
- suggested wording generator
- wrap-up summary generator
- coaching feedback generator
- missed support opportunity detector
- prompt version tracking
- validation and guardrail layer
- fallback logic

### Deliverables
- modular AI service layer
- schema-bound AI outputs

### Priority
High

---

## Epic 11 — Analytics, QA, and coaching
Goal:
Measure usage, support review, and demonstrate learning value.

### Scope
- event logging layer
- analytics event emission from core flows
- QA review model and UI
- competency signal generation
- repeated error pattern logic
- coaching output persistence
- basic reporting queries/components

### Deliverables
- reviewer/QA functionality
- usable measurement layer

### Priority
High

---

## Epic 12 — Demo/admin visibility layer
Goal:
Show that the product is configurable, versioned, and explainable.

### Scope
- lightweight admin/config visibility view
- active workflow/content/prompt version display
- scenario browser
- support option catalog visibility
- escalation catalog visibility

### Deliverables
- internal/demo explainability layer

### Priority
Medium

---

## 6. User story framing by epic
This MVP does not need a huge agile story library, but each epic should be broken down into clear implementation stories.

### Example story shape
“As an agent, I want to see the next best question and why it matters so that I can handle the call correctly without having to remember the workflow from training.”

### Story types that should exist for each epic
- functional story
- data/API story
- event/analytics story
- acceptance/test story

---

## 7. Suggested phased delivery plan

## Phase 0 — Build foundation
Goal:
Get the repo, shared types, database, docs, and dev setup ready.

### Includes
- Epic 1
- baseline of Epic 2

### Exit criteria
- repo runs locally
- database available
- seed system available
- docs imported into repo

---

## Phase 1 — Workflow skeleton without AI
Goal:
Prove the product works end-to-end with rules and synthetic data only.

### Includes
- Epic 2
- Epic 3
- Epic 4
- Epic 5
- core of Epic 6
- core of Epic 9

### What should work by end of phase
- choose a scenario
- start a session
- answer questions
- see path changes
- complete wrap-up
- save session and outcome

### Why this phase matters
This proves the actual product, even before AI.

---

## Phase 2 — Contextual guidance and explainability
Goal:
Make the product feel like a real workflow coach rather than a form.

### Includes
- Epic 7
- Epic 8
- trace visibility from Epic 3
- basic admin visibility from Epic 12

### What should work by end of phase
- contextual guidance cards
- support options surfaced
- escalation flow visible and actionable
- rule trace visible

---

## Phase 3 — Bounded AI assistance
Goal:
Add assistive intelligence without changing the core behavior.

### Includes
- Epic 10
- fallback logic
- prompt version logging

### What should work by end of phase
- rationale generation
- wording suggestions
- AI-generated wrap-up draft
- coaching output
- graceful fallback if AI fails

---

## Phase 4 — QA, coaching, and measurement
Goal:
Prove the learning and review value of the product.

### Includes
- Epic 11
- fuller Epic 12

### What should work by end of phase
- QA review flow
- competency signals
- repeated error patterns
- basic reporting

---

## Phase 5 — MVP hardening and demo polish
Goal:
Make the MVP stable, understandable, and presentable.

### Includes
- UX polish
- scenario refinement
- improved empty/error states
- demo scripting
- acceptance testing
- setup docs

### What should work by end of phase
- reliable demo-ready product
- clean walkthrough for stakeholders
- clear explanation of internal logic and value

---

## 8. What must be built vs stubbed

## Must be built for MVP
- workflow engine
- scenario library
- intake flow
- live guidance flow
- side panel
- support/escalation behavior
- wrap-up flow
- case note persistence
- analytics events
- QA review basics
- prompt architecture implementation
- rule trace visibility

## Can be stubbed or mocked first
- live telephony
- microphone/audio input
- transcript ingestion
- real council account lookup
- real payment history lookup
- callback integration with external systems
- real SSO
- advanced admin authoring tools
- advanced dashboards

## Must not become hidden manual workarounds
Anything that is core to the product promise should not be faked forever.
For example:
- if the product promises next-question guidance, that must come from the workflow engine, not manual hardcoding in the UI
- if it promises coaching, that must come from actual session data, not a static message

---

## 9. Definition of robust enough MVP
The MVP is robust enough when it can:
- handle multiple realistic synthetic scenarios reliably
- maintain coherent path changes as facts change
- surface support and escalation prompts in the right places
- generate a usable wrap-up note every time
- stay functional when AI is unavailable
- show enough internal trace to build trust in the demo
- support basic QA review and coaching

The MVP does **not** need:
- real-time speech processing
- production-scale integrations
- every possible council tax scenario
- enterprise-grade admin tooling

---

## 10. Deferred items after MVP
These should be explicitly deferred unless needed later:
- live telephony integration
- real-time transcript guidance
- browser mic capture
- full Council Tax Reduction handling flow
- discounts/exemptions full handling flow
- real callback/work-item integration
- advanced admin rule editor
- multi-authority configuration
- full reporting suite
- multi-channel case handling

These are natural post-MVP extensions, not MVP requirements.

---

## 11. Acceptance and validation plan
Each phase should have explicit acceptance criteria.

### Product-level acceptance
- a complete guided call can be run start to finish
- the system behavior matches the workflow spec
- the UI matches the screen contracts
- the AI remains within bounds
- the metrics and QA layer produce usable outputs

### Engineering-level acceptance
- typed contracts compile and validate
- key flows are test-covered
- seeded scenarios work deterministically
- failure/fallback states are handled safely

### Demo-level acceptance
- a first-time reviewer can understand what the product does
- the system’s internal logic is visible enough to be credible
- the walkthrough can be completed without hidden operator workarounds

---

## 12. Suggested implementation order inside Cursor + Claude Code
This is the practical coding order.

### Step 1
Set up repo, docs, shared types, database, seeds.

### Step 2
Implement domain schema and seed scenarios.

### Step 3
Implement workflow engine with deterministic rule outputs.

### Step 4
Implement intake screen and session creation flow.

### Step 5
Implement live guidance screen with question progression and facts rail.

### Step 6
Implement side panel with guidance, support, warnings, and trace.

### Step 7
Implement escalation/support screen.

### Step 8
Implement wrap-up screen and note persistence.

### Step 9
Implement AI jobs one by one with validation and fallback.

### Step 10
Implement event logging, QA review, and coaching/competency views.

### Step 11
Add admin/demo visibility, polish, and testing.

This order avoids building fancy features on top of an unstable core.

---

## 13. Indicative sprint grouping
The project may not need formal enterprise sprinting, but this grouping is useful.

### Sprint group A — Foundation
- repo
- schema
- seeds
- docs

### Sprint group B — Core flow
- intake
- guidance screen
- wrap-up
- workflow engine

### Sprint group C — Context and trust
- side panel
- trace
- support/escalation

### Sprint group D — AI assist
- rationale
- wording
- summary
- coaching

### Sprint group E — QA and polish
- event logging
- QA view
- competency signals
- demo polish

---

## 14. Risks to delivery
### Risk 1 — Overbuilding integrations too early
Mitigation:
- keep to synthetic/demo-first scope

### Risk 2 — AI drift into generic copilot behavior
Mitigation:
- follow prompt architecture strictly
- keep rules engine primary

### Risk 3 — Too many scenarios too early
Mitigation:
- focus on the payment-difficulty scenario family only

### Risk 4 — Scattered spec-to-build translation
Mitigation:
- keep these artefacts as canonical docs in repo
- do not create competing brief documents

### Risk 5 — UI complexity during call handling
Mitigation:
- preserve next question as the dominant screen element

---

## 15. Team working model with AI coding tools
The intended working model is:

### Human role
- maintain product truth
- review implementation
- correct drift
- approve behavior and UX choices

### Cursor + Claude Code role
- scaffold code
- implement modules from specs
- generate typed contracts
- build screens and services
- write tests and refactors

### Rule
The AI coding tools should always build **from the artefacts**, not from ad hoc conversational memory.

---

## 16. Deliverables at MVP-ready state
By the time MVP build is considered ready, the repo should contain:
- working frontend app
- working backend app
- database schema and seeds
- workflow config and engine
- demo scenarios
- core screens
- AI service layer
- analytics event logging
- QA review flow
- docs folder with the canonical artefacts
- setup and run instructions

---

## 17. Immediate next asset after this
After this backlog and delivery plan, the final core implementation asset should be:

1. **Repo Structure and Implementation Plan**

That document will translate the delivery plan into concrete folders, modules, file boundaries, and first implementation steps for Cursor + Claude Code.

---

## 18. Status
Status: Draft v0.1  
Intended use: Canonical MVP delivery plan for implementation sequencing and build management

