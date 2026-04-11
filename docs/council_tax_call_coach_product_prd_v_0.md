# Council Tax Call Coach — Product Requirements Document (PRD) v0.1

## 1. Document purpose
This PRD defines the product truth for the **Council Tax Call Coach MVP**.

It describes:
- what the product is
- who it is for
- the problem it solves
- the exact MVP scope
- the key workflows and outcomes
- the user experience requirements
- the product constraints and success criteria

This PRD is intentionally separate from the technical PRD.
The product PRD defines **what must be true from a user and service perspective**.
The technical PRD will define **how the system is built to support that truth**.

---

## 2. Product name
**Council Tax Call Coach**

---

## 3. Product definition
Council Tax Call Coach is an **AI-assisted workflow coach for council tax contact-centre handling**, built for a fictional authority called **Acme City Council**.

It is a guided execution product that helps a contact-centre agent handle a live council tax enquiry correctly, clearly, and confidently while learning in the flow of work.

It is not a legal authority, not a generic chatbot, and not a call summarizer only.

---

## 4. Positioning

### This product is not
- a generic agent copilot
- a script reader
- a knowledge base chatbot
- a legal decision engine
- a full debt-recovery system
- a compliance content library

### This product is
- an AI-assisted workflow coach
- a guided task-execution system
- a performance-support tool
- a contact-centre handling aid
- a learning-in-the-flow-of-work product

---

## 5. Scenario
The product is designed around a fictional local authority:

**Acme City Council**

Acme City Council is fictional.
Its screens, internal teams, routing logic, workflow design, and operating model are fictionalized for buildability.

However, policy-sensitive guidance must be grounded where possible in public UK guidance and clearly separated from fictional Acme operational design.

---

## 6. Problem statement
New or lightly experienced contact-centre agents handling council tax calls often struggle to:
- identify the correct enquiry path quickly
- ask the right next question in the right order
- understand when the issue is simple vs higher risk
- explain options clearly and empathetically
- recognize likely support or signposting needs
- know when escalation is appropriate
- leave a clear and structured case note
- build confidence through repeated exposure

This leads to inconsistency, avoidable escalation, weak case notes, variable resident experience, and slower agent confidence-building.

---

## 7. Product goal
The product should help an agent:
- identify the likely enquiry type quickly
- gather the right facts in the right order
- follow the right guidance path
- explain options clearly and supportively
- spot when escalation or signposting is needed
- capture a structured wrap-up
- improve future performance through feedback and repetition

---

## 8. Primary user
### Primary user
- contact-centre agent
- revenues adviser

### Secondary users
- team leader
- QA coach
- service manager
- training lead

---

## 9. Primary user job to be done
“Help me handle this council tax enquiry correctly, clearly, and confidently while I’m on the call.”

---

## 10. MVP definition
### Succinct MVP definition
The MVP is a **browser-based, rules-led call guidance product for one council tax call type only: payment difficulty / arrears**, where an agent can:
- start a call session
- classify the enquiry
- follow guided next questions
- see support and escalation prompts
- finish with a structured case note and coaching summary

### MVP promise
The MVP should prove that the product can:
1. guide the agent through a coherent call path
2. surface the next right question
3. support safe support/signposting and escalation handling
4. improve note quality
5. teach the agent while they work

---

## 11. Exact MVP scope
### In scope
Single inbound call scenario:
- resident is struggling to pay council tax or has fallen into arrears

V1 handling includes:
- current-year payment difficulty
- missed instalment or reminder-stage concern
- final-notice concern
- liability-order-stage concern as a routed/escalated path
- possible support/signposting need
- possible Council Tax Reduction or discount route as signposting, not decisioning
- possible debt advice route
- vulnerability-sensitive handling prompts
- structured wrap-up and note generation
- after-call coaching feedback

### Out of scope
- final entitlement decisions
- automated legal determination
- full debt-recovery processing
- automated arrangement calculation engine
- full council-tax lifecycle support across all enquiry types
- real telephony dependency for MVP
- mandatory integration with live council systems
- resident self-service

---

## 12. Policy and operating model boundary
The product must preserve this distinction:

### A. Public-source-derived policy logic
This includes policy-sensitive guidance such as:
- arrears stage concepts
- reminder/final notice pathway concepts
- early contact and payment difficulty guidance
- signposting to debt advice
- the existence of Council Tax Reduction and related support routes
- vulnerability-sensitive collection principles

### B. Fictional Acme operational design
This includes:
- team structure
- routing queues
- internal escalation thresholds
- callback rules
- note templates
- first-line agent permissions
- specialist team SLAs
- guidance card design
- QA model

The system must never present fictional Acme internal rules as if they were public policy.

---

## 13. Core product principles
1. **Rules first, AI second**  
   The backbone is structured workflow logic, not freeform AI generation.

2. **Guidance and triage, not legal authority**  
   The product supports handling and routing. It does not determine legal outcomes.

3. **Supportive and fair by design**  
   The product should support empathy, clarity, proportionality, and signposting.

4. **Explain while guiding**  
   The product should teach the agent why a question matters, not just what to ask.

5. **Operationally credible**  
   The MVP should feel like a realistic contact-centre tool, not a static prototype.

6. **Demoable without enterprise dependency**  
   The MVP should be convincing even without live telephony or live back-office integrations.

---

## 14. User outcomes
By the end of a successful use of the product, the agent should be able to:
- identify the likely type of payment-difficulty call
- understand the likely stage of the account issue
- ask the right core questions
- communicate a clear next step
- identify likely support or signposting needs
- recognize when specialist routing is appropriate
- complete a structured case note
- receive actionable coaching feedback

---

## 15. Resident outcomes
The resident should experience:
- clearer explanations
- less confusing questioning
- more appropriate signposting
- more supportive handling where relevant
- fewer incorrect promises
- a more consistent service experience

---

## 16. Core entities in the product domain
The product is structured around these entities:
- Agent
- Resident
- Call Session
- Enquiry Type
- Intent Signal
- Question Step
- Decision Point
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

The technical PRD will define the canonical schema and system responsibilities for these entities.

---

## 17. Core screens
The MVP must include the following screens:

### 1. Call Intake Screen
Purpose:
- orient the agent quickly
- identify the likely reason for call
- surface key context and alerts

### 2. Live Call Guidance Screen
Purpose:
- guide the call in real time
- recommend the next question
- show captured facts and likely paths

### 3. Knowledge / Guidance Side Panel
Purpose:
- show concise official guidance summaries
- show Acme internal handling guidance
- show support and signposting options

### 4. Escalation and Support Screen
Purpose:
- clarify when specialist routing is needed
- clarify when support or debt advice should be raised
- handle vulnerability-sensitive routing prompts

### 5. Call Wrap-Up Screen
Purpose:
- generate a structured summary
- capture next steps, actions, and commitments
- close the call consistently

### 6. Team Lead / QA View
Purpose:
- review handling quality
- identify missed steps
- track growing competence
- support manager coaching

---

## 18. Core workflow
The MVP workflow is:
1. classify enquiry
2. gather essential facts
3. determine likely path
4. provide support/signposting/explanation
5. identify escalation needs
6. capture outcome
7. generate learning feedback

### Workflow requirements
The workflow must include:
- mandatory questions
- optional clarifiers
- stop conditions
- escalation conditions
- safe wording prompts
- compliance or sensitivity warnings
- structured wrap-up outputs

---

## 19. Supported enquiry taxonomy for MVP
The MVP should support these primary handling paths:
- current-year payment difficulty
- missed instalment / reminder-stage difficulty
- final notice concern
- liability-order-stage concern requiring safer handling and likely escalation
- payment difficulty with likely support/signposting route
- payment difficulty with vulnerability-sensitive handling need
- wrong queue / out-of-scope case

---

## 20. AI role in the product
### AI may
- suggest the next question
- explain a policy concept more simply for the agent
- draft empathetic and clear wording
- summarize the call
- generate after-call coaching feedback
- identify likely missed support or signposting opportunities

### AI must not
- decide legal entitlement by itself
- fabricate council rules
- invent debt-recovery powers
- override escalation logic
- present guesses as confirmed policy

---

## 21. Non-AI backbone requirements
The MVP must include these non-AI backbone components:
- enquiry taxonomy
- decision trees / workflow rules
- support/signposting rules
- escalation logic
- vulnerability markers
- call outcome types
- QA rubric
- evidence schema
- versioned guidance content

The product should still be partially usable if the AI layer is unavailable.

---

## 22. Learning and coaching requirements
This product must teach while helping.

The MVP must include:
- “why this question matters” guidance
- common call-handling mistake prompts
- after-call feedback
- repeated error pattern visibility
- confidence / competency signals
- manager-facing coaching prompts

This is not a long training course.
This is performance support embedded in the call workflow.

---

## 23. Functional requirements
The system must allow the user to:
- start a call session
- identify or classify the enquiry
- move through guided question steps
- view facts captured so far
- view likely next paths
- access guidance cards
- access suggested wording
- raise or view escalation prompts
- record vulnerability-sensitive handling signals
- select or confirm a call outcome
- generate and edit a structured case note
- generate and review after-call coaching feedback

Managers or QA users must be able to:
- review call handling markers
- identify missed mandatory steps
- view coaching suggestions
- inspect signs of improving or weakening competence

---

## 24. Non-functional requirements
The MVP must be:
- fast enough to use during a live call
- easy to understand at a glance
- clear about source provenance
- clear about what is guidance vs confirmed fact
- auditable in terms of rule and content versioning
- able to run as a standalone browser-based demo
- buildable without expensive enterprise dependencies

---

## 25. Success metrics
The MVP should be evaluated against:
- classification accuracy
- completion of mandatory handling steps
- signposting rate where appropriate
- escalation appropriateness rate
- summary acceptance/edit rate
- QA adherence score
- time to confident handling for new agents
- repeated error patterns by agent cohort
- perceived handling confidence improvement

---

## 26. MVP constraints
The MVP must assume:
- limited budget
- low dependency on expensive external APIs
- no required enterprise contact-centre platform integration at first
- no required live speech processing at first
- no required access to real council data

The MVP should therefore use:
- synthetic Acme operational data
- synthetic account scenarios
- synthetic resident cases
- simulated call sessions
- low-cost or limited AI usage patterns

---

## 27. Risks
Key risks include:
- drift into general copilot behavior
- overclaiming local policy or entitlement logic
- overbuilding integrations before proving workflow value
- excessive reliance on AI instead of rules
- weak separation between public guidance and Acme operations
- trying to support too many council tax call types too early

---

## 28. Release definition for MVP
The MVP is complete when a demo user can run through a realistic synthetic payment-difficulty call and the system can:
- classify the call
- guide the next questions
- surface support and escalation options
- generate a structured wrap-up note
- generate coaching feedback
- show the internal rule and source trail behind its guidance

---

## 29. Immediate follow-on assets
After this product PRD, the next assets should be produced separately as distinct build documents:
1. Technical PRD
2. Workflow specification
3. Domain model and data schema
4. Screen-by-screen UX specification
5. AI prompt architecture
6. Analytics and QA specification
7. MVP backlog and phased delivery plan

---

## 30. Status
Status: Draft v0.1  
Intended use: Product definition for MVP scoping, design alignment, and technical handoff

