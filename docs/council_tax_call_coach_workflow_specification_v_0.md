# Council Tax Call Coach — Workflow Specification v0.1

## 1. Document purpose
This workflow specification defines the operational call-handling logic for the **Council Tax Call Coach MVP**.

It translates the product PRD and technical PRD into a build-ready workflow backbone for the first supported scenario:

**council tax payment difficulty / arrears**

This document defines:
- the supported call types in MVP
- the workflow stages
- the mandatory and optional question logic
- decision points
- support/signposting triggers
- escalation triggers
- stop conditions
- call outcomes
- rule trace expectations

This is the canonical workflow asset for the MVP.

---

## 2. Workflow objective
The workflow must help an agent:
- classify the likely call type quickly
- gather the right facts in the right order
- determine the likely handling path
- explain options clearly and safely
- identify support or signposting opportunities
- identify escalation needs
- complete a structured wrap-up
- receive learning feedback after the call

---

## 3. Scope of this workflow
### In scope
The workflow covers inbound council tax calls where the resident is:
- struggling to pay
- already behind on payments
- responding to a reminder or final notice
- worried about court or liability-order stage
- asking for help, more time, or what happens next
- potentially showing vulnerability or support needs

### Out of scope
This workflow does not provide full handling for:
- liability disputes as a full end-to-end process
- full discount/exemption decisioning
- full Council Tax Reduction eligibility assessment
- full change-of-circumstance handling
- full payment-processing support
- outbound debt recovery workflow

These may be signposted or escalated but are not fully resolved in this MVP workflow.

---

## 4. Core workflow model
The workflow is structured in seven stages:

1. Intake and orientation
2. Enquiry classification
3. Essential fact gathering
4. Path determination
5. Support / signposting / explanation
6. Escalation decision
7. Wrap-up and outcome capture

The workflow must operate as a **guided flow**, where the system recommends one next best question or action at a time, while still allowing the agent to review facts and context in parallel.

---

## 5. Interaction model
The MVP workflow experience is **not** a passive side panel only.
It is a **primary guided-call interface** with supporting panels.

### Primary interaction mode for MVP
- guided screen-led workflow
- agent-led input and selection
- structured fact capture
- recommended next question
- visible workflow stage and pathing

### Optional enhancement path
Voice/audio can be added later as an enhancement through:
- microphone capture for demo mode
- uploaded or simulated transcripts
- transcription-assisted fact suggestions

However, the workflow must remain fully usable without voice input.

---

## 6. Supported enquiry taxonomy for MVP
The workflow supports the following handling paths:

### PD1 — Current-year payment difficulty
Resident is struggling to keep up with current-year instalments and no formal recovery stage is yet clear.

### PD2 — Missed instalment / reminder-stage difficulty
Resident has missed one or more instalments or mentions a reminder notice.

### PD3 — Final notice concern
Resident says they have lost the right to instalments or have been told the whole year’s balance is due.

### PD4 — Summons / liability-order-stage concern
Resident mentions summons, court, liability order, or similar higher-risk recovery stage.

### PD5 — Existing arrears with request for help
Resident acknowledges arrears and wants help, an arrangement, or a clearer next step.

### PD6 — Payment difficulty with likely support route
Resident’s answers suggest support-related signposting may be relevant, such as Council Tax Reduction, discounts, or debt advice.

### PD7 — Payment difficulty with vulnerability-sensitive handling need
Resident’s answers suggest the call should be handled with extra care and potentially routed differently.

### PD8 — Wrong queue / outside scope
The issue is not primarily a council tax payment-difficulty call and should be redirected or ended safely.

---

## 7. Workflow stages in detail

## Stage 1 — Intake and orientation
### Goal
Get the agent oriented fast and establish the initial reason for the call.

### Required data captured
- caller role
- account known or unknown
- initial reason for call
- any immediately visible account or scenario alerts

### Agent-visible options
- struggling to pay
- missed a payment
- got a reminder
- got a final notice
- got a summons or court letter
- wants an arrangement
- asks about help or reduction
- something else / unclear

### Outputs
- initial classification candidate
- recommended start question
- context summary card

---

## Stage 2 — Enquiry classification
### Goal
Place the call into the safest likely handling path as early as possible.

### Mandatory classification questions
1. Are you calling because you’re struggling to pay, because you’ve missed a payment, or because you’ve received a notice?
2. Is this about your current council tax bill?
3. Have you received a reminder, final notice, summons, or liability order?
4. Are you looking for help with payments, to understand what happens next, or both?

### Classification rules
- If the caller says they are struggling to pay but mentions no notice, classify as **PD1** unless other evidence indicates a later stage.
- If the caller mentions a reminder, classify as **PD2**.
- If the caller says the whole year is now due or instalments have been lost, classify as **PD3**.
- If the caller mentions summons, court, or liability order, classify as **PD4**.
- If the caller mainly wants help dealing with known arrears, classify as **PD5**.
- If benefits, low income, or possible support routes emerge, add **PD6** as an overlay signal.
- If vulnerability-sensitive signals emerge, add **PD7** as an overlay signal.
- If the enquiry is clearly out of scope, classify as **PD8**.

### Outputs
- primary path
- optional overlays: support route, vulnerability-sensitive route
- confidence level
- required next stage

---

## Stage 3 — Essential fact gathering
### Goal
Capture the minimum facts needed for safe handling.

### Mandatory fact categories
1. **Recovery stage**
2. **Payment difficulty context**
3. **Support / affordability indicators**
4. **Vulnerability-sensitive indicators**
5. **Resident’s immediate goal**

### Mandatory questions
1. What stage do you think you are at: worried about paying, already behind, or already in formal recovery?
2. Has your income changed recently or has something happened that has made payments harder?
3. Are you receiving benefits, on a low income, or likely to need support with the bill?
4. Is there anything affecting your ability to manage this right now, such as illness, disability, bereavement, caring responsibilities, or mental health difficulty?
5. Are you calling mainly to ask for time to pay, to understand what the notice means, or to check what help might be available?

### Optional clarifiers
- Do you know roughly how many instalments you have missed?
- Have you spoken to the council about this before?
- Are you already working with a debt adviser, support worker, or carer?
- Do you think you may qualify for help with council tax costs?
- Is there anything making it difficult for you to communicate or manage the process today?

### Data outputs
- current stage estimate
- affordability change marker
- support possibility marker
- vulnerability signal
- resident intent

---

## Stage 4 — Path determination
### Goal
Use captured facts to determine the likely next handling path.

### Path logic
The workflow may output one primary path plus supporting overlays.

### Primary path options
- current-year payment difficulty path
- reminder-stage explanation path
- final-notice explanation path
- summons/liability-order safer-handling path
- existing arrears support path
- wrong queue path

### Overlay path options
- support and signposting overlay
- vulnerability-sensitive handling overlay
- debt advice overlay

### Requirements
The system must:
- show the current primary path
- show any overlay paths
- explain which facts triggered the path
- allow an agent override with reason capture

---

## Stage 5 — Support / signposting / explanation
### Goal
Surface the appropriate support, explanation, or signposting based on the path.

### Support/signposting categories
- payment-difficulty guidance
- explanation of reminder/final-notice stage
- support route such as Council Tax Reduction signposting
- possible discount/exemption route signposting
- debt advice signposting
- Acme specialist-team review referral
- communication/access support

### Trigger examples
- If the resident reports low income or benefit reliance, surface possible support route signposting.
- If the resident reports multiple debts or inability to meet essentials, surface debt advice signposting.
- If the resident is at reminder stage, surface reminder-stage explanation plus safer next-step guidance.
- If the resident is at final-notice stage, surface final-notice explanation plus specialist review prompt if appropriate.
- If the resident needs more tailored help than first-line can offer, surface Acme specialist referral.

### Guidance requirements
Each surfaced option must include:
- what it is
- why it may be relevant
- what the agent can say
- what the agent must not promise
- whether it is public-guidance-based or Acme-operational

---

## Stage 6 — Escalation decision
### Goal
Determine whether the call should remain in first-line handling or move to a higher-safety route.

### Immediate escalation triggers
- resident mentions summons, court, or liability order and the workflow marks the case as higher-risk
- resident disputes liability or named person responsibility
- third-party authority or representation is unclear
- serious vulnerability or safeguarding concern appears
- possible breathing-space-related issue is mentioned
- the agent lacks the required safe next action within first-line scope

### Specialist review triggers
- likely arrangement or affordability review beyond first-line scope
- mixed issue involving arrears plus support plus notice-stage complexity
- repeated failed contact or prior arrangement history in scenario data
- vulnerability-sensitive case needing specialist handling
- resident needs tailored follow-up rather than information only

### Escalation outputs
- escalation flag type
- reason for escalation
- suggested resident wording
- next internal action
- evidence or facts still missing

### Rule requirement
Escalation rules must always take precedence over freeform AI suggestions.

---

## Stage 7 — Wrap-up and outcome capture
### Goal
Close the call with a consistent structured summary and clear next steps.

### Required wrap-up fields
- reason for call
- stage reached
- key facts captured
- support/signposting discussed
- escalation/referral action taken if any
- resident commitments
- internal next steps
- selected outcome

### Allowed outcome types
- information provided only
- support route signposted
- specialist review referred
- debt advice signposted
- vulnerability flag raised
- callback required
- unresolved pending further evidence
- redirected to correct service

### Wrap-up outputs
- structured case note draft
- selected outcome record
- call-completion state
- input for coaching feedback generation

---

## 8. Stop conditions
The workflow should stop or change handling mode when:
- the enquiry is out of scope
- the account or caller context is too uncertain for more than generic guidance
- the caller becomes abusive and operational policy requires ending the call
- the system determines that only specialist or later handling is safe
- key information is unavailable and first-line should not continue beyond generic signposting

Stop conditions must result in a visible reason code.

---

## 9. Safe wording requirements
At key points the workflow must surface safe, supportive wording.

### Example categories
- acknowledging distress
- explaining uncertainty
- describing next step without overpromising
- signposting support sensitively
- escalating to a specialist team

### Example safe patterns
- “You’ve done the right thing by getting in touch now.”
- “I can guide you to the right next step, but I can’t confirm the final outcome from this call.”
- “I want to understand what stage your account is at so I can point you correctly.”
- “Based on what you’ve told me, I’m going to take the safer route and arrange the right follow-up.”

### Prohibited behavior
The workflow must warn against wording that:
- guarantees a payment arrangement
- guarantees a reduction or discount
- states legal outcomes as confirmed without authority
- dismisses vulnerability or support concerns

---

## 10. Vulnerability-sensitive handling model
The workflow must support vulnerability-sensitive handling through signals rather than final determinations.

### Vulnerability signal categories
- physical health
- mental health
- disability or access need
- bereavement
- caring responsibility
- cognitive or learning difficulty
- language or communication difficulty
- acute financial crisis
- dependency on third-party support
- other significant temporary crisis

### Workflow effect of vulnerability signals
When a vulnerability signal is present, the workflow should:
- slow and simplify the call path
- surface additional supportive wording
- increase likelihood of specialist referral where configured
- encourage clearer note capture of support-sensitive handling
- avoid overly compressed or punitive explanation patterns

### Required fields
- category
- resident-stated or scenario-known
- confidence level
- whether specialist handling is recommended

---

## 11. Support and signposting model
The workflow must surface support routes as **possible next steps**, not entitlement decisions.

### Support route catalogue for MVP
- general payment-difficulty support route
- Council Tax Reduction signposting route
- discount or exemption check route
- debt advice route
- specialist revenues review route
- communication/access support route

### Minimum rule requirement
Each support route must define:
- trigger conditions
- plain-English label
- resident-facing explanation
- internal handling note
- whether specialist follow-up is required

---

## 12. Rule traceability requirements
For every significant workflow decision, the system must be able to show:
- which rule fired
- which fact(s) triggered it
- what output it produced
- what version of the workflow was active

This applies at minimum to:
- classification
- path change
- support option surfacing
- escalation
- outcome constraints

---

## 13. Agent override requirements
The system should allow an agent to override:
- the suggested classification
- the suggested next question
- the suggested primary path

Overrides must require:
- reason selection or note
- logging of original recommendation
- logging of replacement selection

Overrides are important both for realism and later QA analysis.

---

## 14. Error and fallback behavior
### If key scenario data is missing
The workflow should:
- continue using a minimum safe generic path
- warn the agent that context is incomplete
- bias toward signposting or safer escalation where needed

### If AI assistance fails
The workflow should:
- continue using rule-based next steps
- use canned wording and standard note templates

### If a path cannot be resolved confidently
The workflow should:
- present the safer of the plausible paths
- explain uncertainty
- encourage clarification or specialist routing

---

## 15. Workflow analytics requirements
The workflow must emit structured events for:
- classification made
- classification changed
- mandatory question answered
- optional clarifier answered
- path determined
- support route surfaced
- escalation triggered
- vulnerability signal captured
- outcome selected
- override used
- wrap-up completed

These events must support both product analytics and QA review.

---

## 16. MVP completion criteria for workflow
The workflow specification is considered implemented successfully when the MVP can:
- support a full payment-difficulty call start to finish
- classify the likely call type
- require the core mandatory facts
- shift paths appropriately when new facts are captured
- surface support and escalation options correctly
- capture an allowed outcome
- produce traceable rule outputs
- remain usable without live AI assistance or live telephony

---

## 17. Immediate next assets
The next assets that should be created from this workflow spec are:
1. Domain Model and Data Schema
2. Screen-by-Screen UX Specification
3. AI Prompt Architecture
4. Analytics and QA Specification
5. MVP Backlog and Delivery Plan

---

## 18. Status
Status: Draft v0.1  
Intended use: Workflow backbone for MVP implementation and design

