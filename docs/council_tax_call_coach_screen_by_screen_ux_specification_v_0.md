# Council Tax Call Coach — Screen-by-Screen UX Specification v0.1

## 1. Document purpose
This document defines the screen-by-screen UX specification for the **Council Tax Call Coach MVP**.

It translates the Product PRD, Technical PRD, Workflow Specification, and Domain Model into build-ready screen contracts.

Each screen contract is intended to support:
- product and UX alignment
- frontend implementation in React
- optional design tooling such as Figma prompting
- API integration planning
- screen-level QA and acceptance testing

This document is the canonical source of truth for the MVP screen designs.

---

## 2. UX design principles
The MVP screen design must follow these principles:

1. **Guide the call, do not distract from the call**  
   The interface should reduce cognitive load during live handling.

2. **One next best action at a time**  
   The agent should always know the recommended next step.

3. **Context stays visible**  
   Captured facts, path state, and warnings should remain visible without excessive navigation.

4. **Guidance supports, it does not overwhelm**  
   Guidance cards and wording should be concise and contextual.

5. **Operational confidence matters**  
   The interface should make the system’s reasoning legible through trace and “why this matters” cues.

6. **The workflow is primary; the side panel is supporting**  
   The side panel is important, but the main experience is the guided call flow.

7. **Design for partial information**  
   The screens must remain usable even when account or scenario context is incomplete.

---

## 3. Global experience model
The MVP is a **guided-flow desktop/web application** with supporting side panels.

### Global layout model
Most in-call screens should follow a three-region pattern:
- **Top bar** for session status and persistent controls
- **Main workflow column** for the next question and primary actions
- **Right-side panel** for guidance, facts, warnings, support options, and trace

### Global persistent elements
The following elements should be consistently available during active sessions where relevant:
- session header
- current stage indicator
- resident/context summary
- primary path label
- overlay path labels
- current warnings
- help/provenance toggle
- save/continue control

### Responsive priority
The MVP is optimized primarily for desktop/laptop usage.
Mobile support is not a primary requirement for V1.

---

## 4. Screen list
The MVP includes these primary screens:
1. Call Intake Screen
2. Live Call Guidance Screen
3. Guidance / Knowledge Side Panel behavior
4. Escalation and Support Screen
5. Call Wrap-Up Screen
6. Team Lead / QA View
7. Optional lightweight Admin/Config View for demo visibility

The side panel is treated as a reusable pattern, but its behavior is also specified as its own UX contract because it is critical to the product.

---

# 5. Screen contract: Call Intake Screen

## 5.1 Purpose
The Call Intake Screen helps the agent:
- orient quickly
- understand who is calling
- identify the likely reason for the call
- start the correct workflow path
- see any known context or alerts before deeper questioning begins

## 5.2 Primary user
- contact-centre agent

## 5.3 Entry conditions
This screen is shown when:
- a new session starts
- a demo scenario is opened
- a manual test session is launched

## 5.4 Exit conditions
The screen is complete when:
- a starting call reason is captured
- the initial classification candidate is established
- the agent continues into the live guidance flow

## 5.5 Layout regions
### Top bar
- product name
- active session indicator
- agent name
- scenario selector or scenario label
- save draft / reset session actions

### Left context panel
- resident identity summary
- caller role
- authentication status
- account reference if present
- known alerts or support flags

### Central intake form
- reason-for-call selection
- optional free-text summary
- initial context questions
- primary action button: “Start guided handling”

### Right context/alert panel
- account/recovery summary if known
- existing note summary if seeded from scenario
- warnings or flagged context

## 5.6 Components
### Resident summary card
Fields:
- resident display label
- liable party name if available
- address/postcode if available
- caller role
- authentication state badge

### Call reason selector
Input type:
- selectable chips or cards

Recommended options:
- struggling to pay
- missed a payment
- received a reminder
- received a final notice
- received summons/court letter
- wants arrangement/help
- asks about reduction/help available
- unclear/other

### Optional quick note field
Purpose:
- capture the agent’s initial typed summary

### Known context panel
Possible fields:
- current balance status (synthetic/demo)
- recovery stage if seeded
- existing arrangement marker
- known support flag
- prior contact marker

## 5.7 Behaviors
- Selecting a call reason should immediately update the initial classification candidate.
- If the scenario has seeded data, the right panel should surface it automatically.
- If no context exists, the screen should remain usable with a minimal safe path.
- The “Start guided handling” button should be disabled until a call reason is selected.

## 5.8 Data dependencies
Reads:
- scenario
- resident
- call session draft
- known synthetic account context

Writes:
- call session start
- initial intent signal
- initial classification candidate
- optional intake note

## 5.9 Analytics events
- `call_started`
- `intake_reason_selected`
- `intake_note_added`
- `initial_classification_generated`

## 5.10 Empty, error, and edge states
### Empty state
- no scenario selected
- prompt agent to select or launch a scenario

### Incomplete context state
- no account context available
- show “Limited context available — start with safe generic questions”

### Error state
- session failed to initialize
- show retry and restart options

## 5.11 Acceptance criteria
- Agent can start a new guided session in under 30 seconds.
- A call reason can be selected without needing any other data.
- The screen can operate with or without seeded account context.
- Starting the flow creates a session with initial classification state.

---

# 6. Screen contract: Live Call Guidance Screen

## 6.1 Purpose
This is the primary in-call working screen.
It helps the agent:
- see the current stage of the call
- ask the next best question
- capture facts in structured form
- understand likely pathing
- access relevant guidance and safe wording

## 6.2 Primary user
- contact-centre agent

## 6.3 Entry conditions
This screen is shown after intake when guided handling begins.

## 6.4 Exit conditions
The screen flows forward until:
- the session reaches wrap-up
- or a stop condition/escalation path ends the current guidance path

## 6.5 Layout regions
### Top bar
- current session title
- timer or elapsed session duration
- current stage badge
- primary path badge
- overlay badges
- save and exit controls

### Main workflow column
- current stage summary
- recommended next question card
- answer controls
- why-this-matters expandable block
- recommended next action controls

### Secondary facts rail
- captured facts summary
- unanswered mandatory items
- surfaced warnings

### Right panel
- guidance tabs
- suggested wording
- support options
- escalation markers
- trace/provenance

## 6.6 Components
### Stage progress strip
Displays:
- Intake
- Classification
- Facts
- Path
- Support
- Escalation
- Wrap-up

Current stage is highlighted.
Past stages are marked complete.
Future stages are inactive.

### Current question card
Fields:
- question text
- mandatory/optional badge
- short rationale
- sensitivity warning if applicable
- answer component

### Answer component region
Must support:
- single-select answer buttons
- multi-select chips
- boolean choices
- free text field
- numeric field if needed

### Captured facts panel
Displays the structured facts already captured, such as:
- likely recovery stage
- income changed
- benefits/low income marker
- possible support route
- vulnerability signal
- resident goal

### Missing essentials indicator
Highlights unanswered mandatory questions for the current stage.

### Path confidence card
Displays:
- current primary path
- overlays
- confidence level
- agent override option

### Warning strip
Examples:
- do not promise final outcome
- likely later-stage recovery path
- vulnerability-sensitive handling advised

## 6.7 Behaviors
- After each answer, the next recommended question should update.
- The right panel should refresh contextually without replacing the main question area.
- If a rule triggers support or escalation, a non-blocking notification should appear.
- The system should always keep at least one primary next action visible.
- The agent should be able to override the path or question recommendation with reason capture.

## 6.8 Key interactions
### Answer and continue
- save answer
- update facts state
- evaluate rules
- surface next question/path changes

### Skip or mark not applicable
- allowed where configured
- requires reason if skipping a mandatory item

### Override suggested path
- opens lightweight modal or inline reason selection
- writes override event

### Open guidance card
- opens guidance content in side panel
- logs card view

### Pin support option
- keeps surfaced support option visible during the rest of the call

## 6.9 Data dependencies
Reads:
- call session
- question step definitions
- question responses
- guidance cards
- support options
- escalation flags
- vulnerability signals
- workflow trace

Writes:
- question response
- decision point result
- intent signal update
- vulnerability signal
- override event
- surfaced support option state

## 6.10 Analytics events
- `question_presented`
- `question_answered`
- `mandatory_question_skipped`
- `guidance_card_viewed`
- `support_option_surfaced`
- `path_changed`
- `classification_overridden`
- `warning_shown`

## 6.11 Empty, error, and edge states
### No question available
- show safe fallback action: review facts or proceed to wrap-up if allowed

### Workflow uncertainty state
- display “Safer path selected while details remain uncertain”
- bias toward clarification or escalation

### AI unavailable state
- keep static rationale and curated wording available

## 6.12 Acceptance criteria
- The screen always shows one recommended next question or next action.
- Facts captured remain visible during the call.
- Support and escalation prompts surface without interrupting the workflow.
- The agent can continue the call even if AI assistance is unavailable.
- Overrides are possible and traceable.

---

# 7. Screen contract: Guidance / Knowledge Side Panel

## 7.1 Purpose
The side panel provides contextual guidance without forcing the agent away from the live workflow.

## 7.2 Primary user
- contact-centre agent

## 7.3 Use model
This panel is persistent or collapsible during in-call screens.
It updates based on the current session state.

## 7.4 Tabs / sections
Recommended tabs:
- Guidance
- Wording
- Support
- Warnings
- Trace

## 7.5 Guidance tab
Shows:
- concise official guidance summary
- Acme internal handling guidance
- stage-specific explanation
- do / do not say notes

Requirements:
- clearly label source domain: Public Policy or Acme Operations
- allow pinning a card
- allow opening full detail without losing call context

## 7.6 Wording tab
Shows:
- safe empathetic wording prompts
- clearer plainer-language explanations
- escalation wording suggestions
- optional generated wording

Requirements:
- generated wording must be labeled
- curated wording must be distinguishable from generated wording

## 7.7 Support tab
Shows:
- surfaced support routes
- why each route may be relevant
- what the agent can say
- whether specialist follow-up is required

## 7.8 Warnings tab
Shows:
- compliance/sensitivity reminders
- vulnerability handling notes
- stage-specific cautions

## 7.9 Trace tab
Shows:
- why the current path was selected
- which facts triggered key outputs
- workflow version
- content version
- prompt version where relevant

The trace must be readable by a non-technical user.

## 7.10 Behaviors
- The panel should update contextually but not jump tabs unexpectedly.
- The user’s chosen tab should remain sticky unless a critical warning must be surfaced.
- Cards can be pinned so they remain visible as context changes.

## 7.11 Data dependencies
Reads:
- guidance cards
- suggested wording
- support options
- warnings
- workflow trace

Writes:
- card view event
- pin/unpin state
- wording copied/used event if needed later

## 7.12 Analytics events
- `guidance_card_viewed`
- `wording_viewed`
- `support_tab_opened`
- `trace_opened`
- `card_pinned`

## 7.13 Acceptance criteria
- Guidance is visible without leaving the call flow.
- Public policy and Acme operations are clearly distinguished.
- The side panel helps explain the workflow without becoming the primary interaction surface.

---

# 8. Screen contract: Escalation and Support Screen

## 8.1 Purpose
This screen helps the agent understand when a call should remain in first-line handling and when safer or specialist routing is needed.

## 8.2 Primary user
- contact-centre agent

## 8.3 Entry conditions
Shown when:
- escalation rules fire
- the agent explicitly opens escalation review
- support complexity requires a more deliberate routing decision

## 8.4 Exit conditions
The screen is complete when:
- escalation is confirmed or dismissed with reason
- support route is selected or documented
- next internal action is captured

## 8.5 Layout regions
### Top header
- escalation review title
- severity badge
- current path and overlays

### Main decision area
- active escalation flags
- triggered facts summary
- recommended internal action
- resident-facing wording

### Secondary support area
- support routes surfaced
- signposting reminders
- communication handling notes

### Side explanation area
- why this screen was triggered
- missing facts or evidence gaps
- trace information

## 8.6 Components
### Escalation flag cards
Display:
- escalation category
- severity
- reason summary
- recommended next step
- missing information

### Support route cards
Display:
- route label
- why it may be relevant
- specialist follow-up required or not

### Decision action controls
Actions may include:
- confirm specialist review
- mark info-only and continue
- capture callback requirement
- return to guidance flow
- redirect to another service

### Resident wording panel
Shows suggested wording such as:
- why the issue needs specialist review
- how to explain next steps without overpromising

## 8.7 Behaviors
- Critical escalation flags should visually dominate lower-priority support content.
- If the agent chooses not to follow the recommended escalation, a reason is required.
- The screen should preserve the current session state and allow return to the main flow.

## 8.8 Data dependencies
Reads:
- escalation flags
- support options
- decision trace
- surfaced warnings

Writes:
- escalation confirmation/dismissal
- override reason
- callback required flag
- routed action

## 8.9 Analytics events
- `escalation_screen_opened`
- `escalation_triggered`
- `escalation_confirmed`
- `escalation_dismissed`
- `callback_marked`

## 8.10 Acceptance criteria
- The agent can see why escalation is recommended.
- Specialist routing and support options are clearly distinguished.
- Ignoring or downgrading an escalation is traceable.

---

# 9. Screen contract: Call Wrap-Up Screen

## 9.1 Purpose
This screen closes the call in a consistent, structured way.
It helps the agent:
- review the facts captured
- confirm the call outcome
- generate and edit a case note
- record next steps and commitments
- trigger coaching feedback

## 9.2 Primary user
- contact-centre agent

## 9.3 Entry conditions
Shown when:
- the workflow reaches completion
- the agent manually ends the call path
- escalation has been routed and call handling is effectively complete

## 9.4 Exit conditions
The screen is complete when:
- an outcome is selected
- a case note is saved
- required next steps are recorded
- the session is marked closed

## 9.5 Layout regions
### Summary header
- session complete badge
- primary path
- overlays
- outcome status

### Left column
- structured facts recap
- support/escalation recap
- missing fields checklist

### Main center column
- generated case note draft
- editable summary field
- actions and commitments section

### Right column
- outcome selection
- callback/follow-up controls
- coaching preview

## 9.6 Components
### Facts recap card
Shows:
- reason for call
- likely stage
- key changes in circumstances
- support and vulnerability markers
- escalation markers

### Outcome selector
Allowed values:
- information provided only
- support signposted
- specialist review referred
- debt advice signposted
- vulnerability flag raised
- callback required
- pending further evidence
- redirected

### Case note editor
Must support:
- generated starting draft
- manual editing
- copy/save actions
- note status indicator

### Resident commitments section
Examples:
- awaiting callback
- will gather evidence
- will seek advice
- no commitment recorded

### Internal actions section
Examples:
- specialist review referral
- callback task needed
- note only
- redirect completed

### Coaching preview card
Shows concise feedback:
- what went well
- one missed opportunity
- one next-call suggestion

## 9.7 Behaviors
- The case note draft should be prefilled where possible.
- If AI summary generation fails, a rule-based note template should appear instead.
- Required outcome fields must be completed before closing the session.
- Coaching preview can be shown immediately after a valid outcome is chosen.

## 9.8 Data dependencies
Reads:
- captured facts
- support options discussed
- escalation flags
- outcome constraints
- generated note draft
- coaching output

Writes:
- call outcome
- case note
- resident commitment
- internal follow-up markers
- session closed state

## 9.9 Analytics events
- `summary_generated`
- `summary_edited`
- `summary_accepted`
- `call_outcome_selected`
- `coaching_feedback_generated`
- `session_closed`

## 9.10 Acceptance criteria
- The agent can finish the session without leaving the product.
- A structured note is always available, generated or templated.
- The chosen outcome is explicit and saved.
- The wrap-up shows enough context to validate the note before closing.

---

# 10. Screen contract: Team Lead / QA View

## 10.1 Purpose
This screen supports quality review and coaching.
It helps the team lead or QA coach:
- review handled sessions
- inspect missed steps
- see support/escalation handling
- review case-note quality
- identify growing competence or repeated mistakes

## 10.2 Primary user
- team lead
- QA coach
- training lead

## 10.3 Entry conditions
Shown when a reviewer opens a completed session or review queue item.

## 10.4 Exit conditions
The screen is complete when:
- a review is saved
- feedback is recorded
- competency signals are updated or queued

## 10.5 Layout regions
### Header
- reviewed session identifier
- agent name
- scenario name
- overall status

### Left review summary column
- session metadata
- path taken
- outcome selected
- escalation/support summary

### Main review column
- QA rubric sections
- missed steps list
- note quality review
- coaching notes editor

### Right insight column
- event timeline
- workflow trace
- competency trend snippets
- generated coaching summary

## 10.6 Components
### Session summary card
Displays:
- agent
- session date/time
- scenario
- primary path
- overlays
- outcome

### QA rubric section
Dimensions:
- classification accuracy
- fact gathering completeness
- clarity of explanation
- support/signposting handling
- escalation judgment
- note quality

### Missed steps panel
Shows:
- skipped mandatory questions
- missed support route
- escalation missed or overridden
- unclear wording risk

### Coaching notes editor
Allows reviewer to add:
- strengths
- improvement points
- micro-coaching note

### Competency trend summary
Shows:
- repeated error patterns
- improving skill areas
- at-risk areas

## 10.7 Behaviors
- Reviewers should be able to score quickly without re-reading everything manually.
- The system should pre-surface likely missed steps from workflow/event data.
- Coaching notes should be linked to the reviewed session.

## 10.8 Data dependencies
Reads:
- completed call session
- analytics events
- case note
- outcome
- rubric version
- competency signals

Writes:
- QA review
- coaching note
- competency signal

## 10.9 Analytics events
- `qa_view_opened`
- `qa_review_started`
- `qa_review_completed`
- `coaching_note_saved`

## 10.10 Acceptance criteria
- Reviewers can evaluate a session without accessing raw backend data.
- Missed workflow steps are visible and traceable.
- A QA review can be completed and stored from this screen.

---

# 11. Screen contract: Optional lightweight Admin / Config View

## 11.1 Purpose
This optional MVP screen provides internal demo visibility into how the product is configured.
It is not a full production admin console.

## 11.2 Primary user
- product/demo owner
- internal reviewer
- future service admin

## 11.3 Goals
- show workflow versions
- show active guidance/content bundle
- show scenario library
- show prompt/version labels
- demonstrate explainability of the system

## 11.4 Minimum sections
- active workflow version
- active content version
- active prompt version
- scenario list
- support option catalog
- escalation catalog

## 11.5 Acceptance criteria
- A demo audience can see that the system is rules-led and versioned.
- Public-policy-derived content and Acme operational content can be visibly distinguished.

---

## 12. Cross-screen interaction patterns

## 12.1 Save behavior
The system should autosave lightweight interaction state where possible.
Visible save indicators should avoid distracting the agent.

## 12.2 Progression behavior
Primary buttons should reflect the workflow state:
- Start guided handling
- Save answer and continue
- Review escalation
- Continue to wrap-up
- Save outcome and close

## 12.3 Warning behavior
Warnings should be shown in three severities:
- informational
- caution
- high-risk

High-risk warnings should persist until acknowledged or the trigger is resolved.

## 12.4 Override behavior
Any override of:
- classification
- path
- escalation
- mandatory skip

must capture a reason and be available in QA review.

---

## 13. Visual design guidance for implementation
This document is not a visual design system, but it provides the direction needed for code and optional design tooling.

### Recommended visual qualities
- clean internal-tool aesthetic
- high readability
- strong information hierarchy
- restrained color usage for meaning only
- clear stage markers
- obvious distinction between public-policy and Acme-operational content
- supportive but professional tone

### UI density guidance
The UI should feel information-rich but not crowded.
Key rule:
- the next question must always visually dominate secondary information.

---

## 14. Figma and coding-tool handoff guidance
This UX spec should be the **single source of truth** for screen behavior.

### If using Figma
Use this document to derive:
- low-fidelity layouts
- interaction wireframes
- component priorities
- state variations

### If using Cursor + Claude Code
Use this document to derive:
- route structure
- page components
- shared layout components
- screen-specific state models
- API hooks
- interaction tests

No separate contradictory screen brief should be created.

---

## 15. MVP completion criteria for screens
The screen layer is considered implemented successfully when:
- all core screens are navigable end-to-end
- the user can complete a full guided call session
- support and escalation logic are visible in the UI
- the case note and coaching outputs are reviewable in-product
- the side panel supports the workflow rather than replacing it
- the QA screen can review completed sessions

---

## 16. Immediate next assets
The next assets to create after this are:
1. AI Prompt Architecture
2. Analytics and QA Specification
3. MVP Backlog and Delivery Plan
4. Repo Structure and Implementation Plan

---

## 17. Status
Status: Draft v0.1  
Intended use: Build-ready screen contract for design and implementation

