# Council Tax Call Coach — Technical Product Requirements Document (TPRD) v0.1

## 1. Document purpose
This technical PRD defines the system truth for the **Council Tax Call Coach MVP**.

It describes:
- the technical architecture
- the system boundaries
- the core services and responsibilities
- the domain model at a system level
- the workflow engine design
- the AI integration design
- the data model expectations
- the integration strategy
- the environments, security, analytics, and governance requirements

This document is intentionally separate from the product PRD.
The product PRD defines **what the product must achieve**.
The technical PRD defines **how the system should be designed and assembled to achieve it**.

---

## 2. Product and deployment context
The product is a **browser-based, demo-first MVP** for a fictional local authority called **Acme City Council**.

The MVP is not assumed to have:
- live telephony integration
- enterprise contact-centre platform integration
- access to real council revenues systems
- access to real resident data
- mandatory live transcription

The system must therefore be designed to:
- run standalone in the browser
- use synthetic or mocked operational data
- support simulated call sessions
- allow later integration with telephony, CRM, and revenues systems without redesigning the core workflow model

---

## 3. Technical goals
The MVP technical design should:
- support a coherent guided-call workflow for one scenario
- make workflow logic explicit and versioned
- separate rules from generated AI text
- separate public policy content from Acme operational content
- allow explainable outputs and traceability
- support fast interaction during a live or simulated call
- be inexpensive to build and operate
- be extensible to future real integrations

---

## 4. High-level architecture
The MVP architecture should be composed of the following layers:

1. **Frontend application**
2. **Application backend/API**
3. **Workflow and decision layer**
4. **Guidance/content layer**
5. **AI assistance layer**
6. **Persistence layer**
7. **Analytics and QA layer**
8. **Admin/configuration layer**

### Logical flow
Agent UI  
→ Backend session API  
→ Workflow engine  
→ Guidance/content service  
→ AI assistance service  
→ Persistence + analytics

---

## 5. Recommended MVP stack
### Frontend
- React
- TypeScript
- Tailwind CSS
- component library for fast internal tooling style UI

### Backend
- Node.js
- TypeScript
- Express, Fastify, or equivalent lightweight API framework

### Database
- PostgreSQL

### Workflow rules
- JSON or YAML rule definitions stored in versioned config
- server-side workflow orchestration in TypeScript

### AI layer
- external LLM API for constrained assistance tasks only
- prompt templates stored as versioned config
- structured outputs required

### Analytics
- event table in PostgreSQL for MVP
- derived dashboards or lightweight admin reporting later

### Hosting
- Vercel, Netlify, Railway, Render, Fly.io, or equivalent low-cost hosting stack
- choose based on team familiarity and simplicity rather than enterprise-scale concerns

---

## 6. System boundaries
### In scope for MVP system
- call-session creation and management
- guided workflow progression
- fact capture during the call
- guidance-card retrieval
- support/signposting prompts
- escalation flagging
- structured wrap-up generation
- coaching feedback generation
- scenario playback / synthetic case support
- admin-editable rules/content in a limited MVP form
- analytics event logging

### Out of scope for MVP system
- direct payment processing
- legal determination engine
- live integration with external council tax system of record
- live arrangement calculation engine
- resident portal
- outbound contact orchestration
- real telephony dependency
- real identity-provider integration as a hard MVP requirement

---

## 7. Core technical principles
1. **Rules-first execution**  
   Workflow state, decisions, and escalation must be driven by explicit rules, not freeform model reasoning.

2. **AI as bounded assistance**  
   AI may assist with wording, summarization, simplification, and coaching, but must not become the system of record for workflow logic.

3. **Separation of content domains**  
   Public policy content and fictional Acme operational content must be stored, tagged, and retrieved separately.

4. **Traceability**  
   The system must be able to explain why a question, path, support option, or escalation flag was surfaced.

5. **Graceful degradation**  
   The workflow should remain usable at a basic level if the AI assistance layer is unavailable.

6. **Extensibility without rewrite**  
   External integrations should be added later through adapter interfaces without redesigning core domain logic.

---

## 8. Core services and responsibilities

## 8.1 Frontend application
Responsibilities:
- render the agent UI
- manage screen state and local interaction state
- display workflow steps, facts, prompts, and warnings
- call backend APIs
- show explanation and provenance panels
- support demo scenarios and simulated data selection

## 8.2 Session service
Responsibilities:
- create and maintain call sessions
- associate sessions to scenario data, resident context, and agent context
- store session progression and timestamps
- manage session stage changes

## 8.3 Workflow engine
Responsibilities:
- classify enquiry types
- determine required questions
- evaluate decision points
- determine next question candidates
- surface support options
- trigger escalation flags
- enforce stop conditions
- compute allowed next states

## 8.4 Guidance/content service
Responsibilities:
- retrieve guidance cards relevant to current context
- separate public-source content from Acme operational content
- retrieve suggested wording and “why this matters” content
- version and expose active content

## 8.5 AI assistance service
Responsibilities:
- generate next-question explanation text if allowed
- simplify policy concepts for the agent
- draft empathetic wording
- generate structured wrap-up summaries
- generate after-call coaching feedback
- return structured outputs only

## 8.6 Case note/outcome service
Responsibilities:
- assemble structured note drafts
- persist final note content
- store call outcomes, actions, and commitments
- support human editing before finalization

## 8.7 Analytics service
Responsibilities:
- capture product and workflow events
- store event metadata
- generate derived competency or usage signals
- support QA and reporting views

## 8.8 Admin/config service
Responsibilities:
- manage workflow versions
- manage guidance-card versions
- manage prompt versions
- manage scenario library entries
- manage support option definitions
- manage escalation catalog definitions

---

## 9. Domain model responsibilities
The MVP domain includes the following primary entities:
- Agent
- Resident
- CallSession
- EnquiryType
- IntentSignal
- QuestionStep
- DecisionPoint
- GuidanceCard
- SupportOption
- EscalationFlag
- VulnerabilitySignal
- SuggestedWording
- CallOutcome
- CaseNote
- EvidenceRecord
- CompetencySignal
- QAReview

### Technical requirement
Each entity should have:
- canonical identifier
- timestamps
- source/version metadata where applicable
- authoring/ownership metadata where applicable
- status field where appropriate

The domain schema should be implemented in a way that supports future API and database evolution.

---

## 10. Workflow engine design
The workflow engine is the core of the MVP.
It should be implemented as explicit structured logic rather than hidden prompt behavior.

### Workflow engine inputs
- selected or inferred enquiry type
- captured facts
- resident context
- scenario context
- known support flags
- vulnerability signals
- current workflow stage
- current workflow version

### Workflow engine outputs
- next required question(s)
- optional clarifying question(s)
- likely path classification
- guidance-card triggers
- support-option triggers
- escalation triggers
- stop conditions
- allowed outcomes

### Workflow representation
For MVP, the workflow should be represented as:
- versioned JSON or YAML files
- rule tables for decisioning
- ordered question definitions
- condition blocks for branching

### Technical behavior
The engine must:
- allow deterministic replay of the same scenario
- log which rule caused a branch or trigger
- support UI explanation of why a path was chosen
- support versioning and safe fallback to previous workflow versions

---

## 11. Guidance/content architecture
The guidance/content layer must be separated into at least two source domains:

### A. Public policy source domain
Contains:
- public guidance summaries
- source excerpts or paraphrased guidance points
- source references
- policy concept summaries

### B. Acme operational source domain
Contains:
- internal handling instructions
- escalation routes
- queue logic
- note templates
- approved wording patterns
- synthetic operational rules

### Content requirements
Every guidance asset should carry:
- content ID
- title
- summary/body
- source domain
- version
- active status
- applicable workflow contexts
- tags
- optional warning or prohibition text

The frontend must be able to display source domain clearly.

---

## 12. AI assistance architecture
The AI layer must be constrained and modular.

### AI-supported functions in MVP
- explain why the suggested question matters
- simplify a policy concept for the agent
- draft empathetic wording
- generate structured wrap-up summary
- generate after-call coaching feedback

### AI constraints
The AI layer must not:
- decide legal entitlement
- invent local authority rules
- override workflow engine decisions
- fabricate escalation authority
- infer uncaptured facts without flagging uncertainty

### Prompt architecture
Each AI function should have its own prompt template, including:
- role and boundary instructions
- allowed source domains
- structured input schema
- required structured output schema
- disallowed claims
- confidence or warning field

### AI fallback
If the AI layer is unavailable:
- the workflow engine remains available
- canned wording and guidance remain available
- summary generation can degrade to rule-based templates

---

## 13. Data storage design
### Primary database
PostgreSQL should store:
- call sessions
- captured facts
- workflow progress
- outcomes
- case notes
- scenario library metadata
- guidance content metadata
- support options
- escalation definitions
- prompt versions
- analytics events
- QA reviews
- competency signals

### Optional content storage approach
For MVP, guidance text and prompt templates may be stored in:
- database tables
- structured files checked into source control
- or a hybrid approach

A hybrid approach is acceptable for MVP if version discipline is preserved.

---

## 14. Suggested backend module structure
Suggested service boundaries:
- `auth` (minimal or mocked for MVP)
- `agents`
- `residents`
- `scenarios`
- `call-sessions`
- `workflow`
- `guidance`
- `support-options`
- `escalations`
- `case-notes`
- `ai-assist`
- `analytics`
- `qa`
- `admin-config`

This structure may be implemented in a modular monolith for MVP.
A microservice architecture is not required.

---

## 15. API design expectations
The backend should expose APIs for:
- session creation
- scenario loading
- enquiry classification
- fact submission
- next-step retrieval
- guidance retrieval
- support option retrieval
- escalation retrieval
- wrap-up summary generation
- coaching generation
- event logging
- admin read/write for configuration

### API style
REST is sufficient for MVP.
Strong typing and schema validation should be used throughout.

---

## 16. Validation and schema requirements
All requests and responses should use explicit schema validation.

Validation should apply to:
- API payloads
- workflow config files
- guidance content objects
- AI input payloads
- AI output payloads
- analytics events

This helps ensure the system remains explainable and resistant to malformed AI output.

---

## 17. Scenario library design
The MVP should include a scenario library for demo and test purposes.

Each scenario should define:
- scenario ID
- title
- short description
- resident profile
- account state
- recovery stage
- likely path
- vulnerability markers if any
- expected support or escalation outputs
- expected successful outcome

The scenario library enables:
- demo walkthroughs
- regression testing
- QA review calibration
- prompt testing

---

## 18. State management requirements
The system must maintain state for:
- active call session
- captured facts
- current workflow stage
- surfaced guidance cards
- surfaced support options
- raised escalation flags
- draft case note
- outcome selection
- AI assist history within session

Frontend state can be managed with local app state and server synchronization.
Server state should remain the source of truth for persisted session data.

---

## 19. Analytics and event model requirements
The MVP must log at least the following event types:
- call_started
- enquiry_classified
- question_presented
- question_answered
- guidance_card_viewed
- support_option_surfaced
- escalation_triggered
- vulnerability_signal_detected
- summary_generated
- summary_accepted
- call_outcome_selected
- coaching_feedback_generated
- qa_review_completed

Each event should include:
- event ID
- timestamp
- call session ID
- agent ID if available
- workflow version
- content version where relevant
- scenario ID if synthetic
- event metadata payload

---

## 20. QA and competency requirements
The system must support:
- storage of QA reviews
- storage of missed-step markers
- generation of competency signals
- visibility into repeated agent error patterns
- linkage between call session and coaching outputs

For MVP, competency signals may be derived from simple rule-based logic rather than advanced modeling.

---

## 21. Integration strategy
The MVP should use adapter interfaces for future external integrations.

### Future adapter categories
- telephony adapter
- CRM/account adapter
- revenues-system adapter
- identity-provider adapter
- case-management adapter
- document/evidence adapter

### MVP requirement
These adapters do not need live implementations yet.
However, interface contracts should be defined so that the demo system is not architecturally trapped.

---

## 22. Security and privacy posture
Even as a demo product, the system should adopt a privacy-conscious structure.

The MVP should:
- avoid storing real personal data by default
- support synthetic resident data
- distinguish synthetic from future real data clearly
- provide auditability for admin changes
- restrict admin functions from agent functions
- avoid sending unnecessary sensitive context to the AI layer

If future real deployments are considered, security, retention, and lawful-processing requirements will need expansion beyond MVP.

---

## 23. Environments
At minimum, the system should support:
- local development
- demo/test environment
- production-like preview environment

Configuration should be environment-driven.
Workflow versions, guidance versions, and prompt versions should be inspectable per environment.

---

## 24. Logging and observability
The MVP should include:
- application error logging
- API request logging
- workflow decision logging
- AI invocation logging (metadata only where appropriate)
- event pipeline health logging
- admin change logging

At minimum, the team should be able to inspect:
- what failed
- where it failed
- which rule or prompt version was active
- which scenario/session was affected

---

## 25. Versioning strategy
The system must version at least:
- workflow definitions
- guidance content
- prompt templates
- scenario definitions
- QA rubric version

A call session should be traceable to the exact workflow/content/prompt version used when it ran.

---

## 26. Failure and fallback behavior
### If workflow config fails validation
- do not publish the broken config
- fall back to the last valid active version

### If AI assistance fails
- continue call workflow without AI assist
- show canned guidance and wording
- allow manual wrap-up note completion

### If scenario data is incomplete
- allow session start with warning
- default to minimal safe guidance path

---

## 27. MVP delivery assumptions
The MVP assumes:
- a modular monolith is sufficient
- synthetic scenarios are acceptable
- live integration is optional
- admin tooling may be lightweight initially
- AI usage should be scoped to low-cost, bounded calls

---

## 28. MVP completion criteria
The technical MVP is complete when the system can:
- run standalone in the browser
- load a synthetic call scenario
- guide a user through the workflow
- show rule-driven next questions and branch changes
- surface guidance, support, and escalation prompts
- generate a structured wrap-up and coaching output
- persist session and outcome data
- log analytics events
- expose enough internal state to explain how the system behaved

---

## 29. Immediate follow-on technical assets
After this technical PRD, the next technical build assets should be created separately as standalone documents:
1. Workflow specification
2. Domain model and data schema
3. Screen-by-screen UX specification
4. AI prompt architecture
5. Analytics and QA specification
6. MVP backlog and delivery plan
7. Repo structure and implementation plan

---

## 30. Status
Status: Draft v0.1  
Intended use: Technical alignment for MVP implementation, architecture planning, and engineering handoff

