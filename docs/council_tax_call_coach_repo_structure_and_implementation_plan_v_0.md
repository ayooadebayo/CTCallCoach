# Council Tax Call Coach — Repo Structure and Implementation Plan v0.1

## 1. Document purpose

This document defines the recommended repository structure and implementation plan for the **Council Tax Call Coach MVP**.

It translates the Product PRD, Technical PRD, Workflow Specification, Domain Model, Screen Specification, AI Prompt Architecture, Analytics/QA Specification, and MVP Backlog into a concrete build structure for implementation.

This document defines:

- the recommended repo layout
- the app/module boundaries
- shared type and schema locations
- workflow/config storage locations
- AI module structure
- analytics and QA module structure
- docs placement
- Cursor and Claude Code project guidance placement
- the first implementation sequence inside the codebase

This is the final core bridge from specification into build execution.

---

## 2. Implementation philosophy

The MVP should be implemented as a **modular monolith**.

This is the right choice because:

- the product is still early and tightly coupled
- the domain is coherent enough not to require microservices
- a single deployable backend is cheaper and faster to manage
- the workflow, AI, QA, and analytics layers all need shared types and close coordination
- the goal is a robust demoable MVP, not a distributed enterprise platform

The frontend and backend should still be separated cleanly, but the backend should remain a modular service rather than a fleet of services.

---

## 3. Recommended top-level repo model

A monorepo-style layout is recommended for clarity and reuse.

### Recommended top-level directories

- `/apps`
- `/packages`
- `/docs`
- `/.cursor`
- `/scripts`
- `/infra` (optional lightweight deployment/config folder)

This structure works well for:

- shared types
- shared schema validation
- frontend/backend coordination
- AI module reuse
- keeping product artefacts near the codebase

---

## 4. Recommended repo structure

```text
council-tax-call-coach/
  apps/
    web/
    api/
  packages/
    shared-types/
    shared-schemas/
    workflow-config/
    content-bundles/
    ui/
  docs/
    product-prd.md
    technical-prd.md
    workflow-spec.md
    domain-schema.md
    screen-spec.md
    prompt-architecture.md
    analytics-qa.md
    backlog-delivery-plan.md
    repo-implementation-plan.md
  .cursor/
    rules/
  scripts/
  infra/
  CLAUDE.md
  package.json
  pnpm-workspace.yaml
  README.md
```

This structure assumes a workspace-based toolchain such as pnpm.

---

## 5. Recommended tooling baseline

### Package and workspace tooling

- `pnpm` for workspace management

### Frontend

- React
- TypeScript
- Vite or Next.js App Router
- Tailwind CSS

### Backend

- Node.js
- TypeScript
- Fastify or Express
- Zod or equivalent schema validation
- Prisma, Drizzle, or equivalent ORM/query layer

### Database

- PostgreSQL

### Testing

- Vitest or Jest for unit/integration tests
- Playwright for end-to-end UI tests if desired later

### Formatting and quality

- ESLint
- Prettier
- TypeScript strict mode

The exact library choices can vary, but the repo should preserve the same architectural structure regardless.

---

## 6. App-level structure

## 6.1 `apps/web`

### Purpose

Contains the browser-based MVP frontend.

### Responsibilities

- routing
- session creation and navigation
- screen rendering
- workflow interaction UI
- side panel UI
- wrap-up and QA screens
- lightweight admin/demo visibility views

### Suggested structure

```text
apps/web/
  src/
    app/
    routes/
    components/
    features/
    layouts/
    hooks/
    lib/
    state/
    styles/
    test/
```

### Feature-based structure inside `features/`

```text
features/
  call-intake/
  live-guidance/
  guidance-panel/
  escalation-support/
  wrap-up/
  qa-review/
  admin-demo/
```

Each feature folder should include:

- view components
- local feature hooks
- feature-specific types if needed
- acceptance-test helpers where useful

---

## 6.2 `apps/api`

### Purpose

Contains the backend API, workflow orchestration, persistence logic, AI service layer, analytics logging, and admin/config logic.

### Responsibilities

- session APIs
- workflow APIs
- scenario APIs
- wrap-up APIs
- QA APIs
- AI task APIs
- analytics logging
- content/version access

### Suggested structure

```text
apps/api/
  src/
    server/
    routes/
    modules/
    db/
    ai/
    analytics/
    qa/
    workflow/
    content/
    utils/
    test/
```

### Module-oriented structure inside `modules/`

```text
modules/
  agents/
  residents/
  scenarios/
  call-sessions/
  enquiry-types/
  question-steps/
  workflow/
  guidance/
  support-options/
  escalations/
  case-notes/
  call-outcomes/
  coaching/
  qa/
  admin-config/
```

---

## 7. Shared package structure

## 7.1 `packages/shared-types`

### Purpose

Holds canonical TypeScript types used by both frontend and backend.

### Contents

- domain entities
- session state types
- workflow output types
- analytics event types
- AI task request/response types

### Recommended substructure

```text
packages/shared-types/
  src/
    domain/
    workflow/
    analytics/
    ai/
    api/
```

---

## 7.2 `packages/shared-schemas`

### Purpose

Holds validation schemas that mirror shared types.

### Contents

- API payload validation
- workflow config validation
- event validation
- AI output schemas

### Recommended substructure

```text
packages/shared-schemas/
  src/
    api/
    workflow/
    analytics/
    ai/
    content/
```

This package is important for keeping Cursor + Claude Code from creating mismatched frontend/backend contracts.

---

## 7.3 `packages/workflow-config`

### Purpose

Holds versioned workflow definitions and question logic.

### Contents

- enquiry taxonomy config
- question step definitions
- path rules
- support trigger rules
- escalation trigger rules
- outcome constraints

### Recommended substructure

```text
packages/workflow-config/
  src/
    versions/
      v1/
        enquiry-types.json
        question-steps.json
        classification-rules.json
        path-rules.json
        support-rules.json
        escalation-rules.json
        outcome-rules.json
```

This package should be treated as configuration, not hidden application logic.

---

## 7.4 `packages/content-bundles`

### Purpose

Holds versioned guidance content, curated wording, and related content assets.

### Contents

- public policy summaries
- Acme operations guidance
- curated wording templates
- support option catalog content
- warning content

### Recommended substructure

```text
packages/content-bundles/
  src/
    versions/
      v1/
        public-policy/
        acme-operations/
        wording/
        support-options/
        warnings/
```

This preserves the separation between public guidance and Acme operational design.

---

## 7.5 `packages/ui`

### Purpose

Optional shared UI component package for reusable internal-tool-style components.

### Possible contents

- page shell
- stage progress strip
- cards
- badges
- side panel components
- table/list components
- empty/error states

This package is useful if the frontend grows, but it is optional for the first cut.

---

## 8. Docs placement inside repo

The artefacts created in canvas should be copied into `/docs` as markdown files.

### Required docs in repo

- `/docs/product-prd.md`
- `/docs/technical-prd.md`
- `/docs/workflow-spec.md`
- `/docs/domain-schema.md`
- `/docs/screen-spec.md`
- `/docs/prompt-architecture.md`
- `/docs/analytics-qa.md`
- `/docs/backlog-delivery-plan.md`
- `/docs/repo-implementation-plan.md`

### Rule

These docs are the canonical human-readable source of truth. No contradictory internal brief should be created elsewhere.

---

## 9. Cursor and Claude Code project guidance

## 9.1 Cursor rules placement

Use `/.cursor/rules/` for project-specific coding constraints.

### Recommended rule files

- `product-scope.mdc`
- `architecture-boundaries.mdc`
- `workflow-engine-rules.mdc`
- `ai-guardrails.mdc`
- `schema-validation-rules.mdc`
- `ui-implementation-rules.mdc`

### Example topics to include

- do not invent policy logic
- workflow engine is primary for path decisions
- public policy and Acme operations must remain separate
- keep AI jobs modular and schema-bound
- do not introduce ad hoc endpoints without shared types/schemas
- preserve traceability and version references

---

## 9.2 `CLAUDE.md` placement and purpose

Place `CLAUDE.md` at repo root.

### Purpose

Provide persistent repo-wide implementation instructions for Claude Code.

### Recommended contents

- product summary
- MVP scope boundaries
- architecture summary
- required docs to read first
- coding standards
- workflow engine priority rule
- AI safety/guardrail rule
- instructions not to create duplicate spec files
- test and validation expectations

---

## 10. Backend module plan

The backend should be implemented as a modular monolith with clearly separated modules.

### Recommended backend modules

- `agents`
- `residents`
- `scenarios`
- `callSessions`
- `workflow`
- `guidance`
- `supportOptions`
- `escalations`
- `caseNotes`
- `callOutcomes`
- `aiAssist`
- `analytics`
- `qa`
- `coaching`
- `adminConfig`

### Each module should ideally contain

- route handlers or controllers
- service layer
- repository/data access layer
- shared module-specific types/schemas where needed
- tests

---

## 11. Frontend feature plan

The frontend should be organized around feature boundaries rather than only raw component folders.

### Recommended feature areas

- `call-intake`
- `live-guidance`
- `guidance-panel`
- `escalation-support`
- `wrap-up`
- `qa-review`
- `admin-demo`

### Each feature should ideally contain

- screen container
- presentational components
- local data hooks
- feature test file(s)
- feature-specific UI states

This makes it easier for Cursor + Claude Code to work on one product surface at a time.

---

## 12. Database and ORM structure

### Suggested `db` folder contents

```text
apps/api/src/db/
  schema/
  migrations/
  seeds/
  client.ts
```

### Schema areas to model first

- scenarios
- residents
- call sessions
- question responses
- decision point results
- guidance cards
- support options
- escalation flags
- case notes
- call outcomes
- analytics events
- qa reviews
- competency signals

### Seed requirements

- workflow version seed
- content version seed
- prompt version seed
- enquiry type seed
- question step seed
- scenario seed
- support option seed
- escalation definition seed

---

## 13. Workflow engine implementation plan

The workflow engine should be treated as its own subsystem, even inside the modular monolith.

### Suggested location

```text
apps/api/src/workflow/
```

### Suggested internal structure

```text
workflow/
  engine/
  classifiers/
  evaluators/
  rules/
  traces/
  types/
```

### Responsibilities

- load workflow config bundle
- evaluate classification
- resolve next question
- detect support triggers
- detect escalation triggers
- compute warnings
- return normalized workflow result
- emit trace objects for the UI

### Important rule

Do not spread workflow decision logic across UI components. The UI should render outputs from the workflow layer, not re-implement logic.

---

## 14. AI implementation plan

The AI layer should be modular and task-oriented.

### Suggested location

```text
apps/api/src/ai/
```

### Suggested internal structure

```text
ai/
  system/
  tasks/
  schemas/
  guards/
  fallback/
  clients/
  logging/
```

### Task files

- `question-rationale.ts`
- `policy-simplifier.ts`
- `suggested-wording.ts`
- `wrap-up-summary.ts`
- `coaching-feedback.ts`
- `missed-support-opportunity.ts`

### Supporting files

- shared system prompt
- task prompt builders
- output validation
- guardrail evaluators
- fallback generators

### Important rule

Do not create one giant “assistant” module. Keep each job separate and testable.

---

## 15. Analytics and QA implementation plan

### Suggested locations

```text
apps/api/src/analytics/
apps/api/src/qa/
apps/api/src/coaching/
```

### Analytics structure

- event schema
- event emitters
- event repositories
- derived metric helpers

### QA structure

- rubric definitions
- review service
- missed-step derivation
- reviewer endpoints

### Coaching structure

- competency signal derivation
- repeated error detection
- coaching output persistence

This separation makes the learning layer legible and maintainable.

---

## 16. API route plan

### Recommended route groupings

```text
/apps/api/src/routes/
  sessions.ts
  scenarios.ts
  workflow.ts
  guidance.ts
  support.ts
  escalations.ts
  wrapup.ts
  qa.ts
  analytics.ts
  admin.ts
```

### Example endpoint families

#### Sessions

- create session
- get session
- close session

#### Workflow

- classify
- submit response
- get next step
- override path/classification

#### Guidance

- get contextual guidance
- get wording suggestions

#### Wrap-up

- generate summary
- save note
- save outcome
- generate coaching

#### QA

- get review queue
- get review details
- submit review

#### Admin

- list versions
- list scenarios
- list support/escalation catalogs

---

## 17. Frontend route plan

If using a route-based frontend, recommended pages include:

- `/`
- `/scenarios`
- `/session/:sessionId/intake`
- `/session/:sessionId/live`
- `/session/:sessionId/escalation`
- `/session/:sessionId/wrap-up`
- `/qa`
- `/qa/:sessionId`
- `/admin`

This supports both guided use and demo navigation.

---

## 18. Testing strategy inside repo

### Test layers

1. config/schema validation tests
2. workflow engine unit tests
3. module/service integration tests
4. frontend screen tests
5. end-to-end scenario tests

### Highest-priority tests first

- workflow classification tests
- path change tests
- support trigger tests
- escalation trigger tests
- summary fallback tests
- schema validation tests for AI outputs

### Recommended philosophy

Test the workflow core harder than the visual polish. The value of the MVP depends more on correct pathing than on perfect styling.

---

## 19. Implementation sequence in repo

The first implementation steps should happen in this order.

### Step 1 — Repo bootstrap

- initialize workspace
- add apps/packages structure
- configure TypeScript
- configure linting and formatting
- add docs
- add Cursor rules and `CLAUDE.md`

### Step 2 — Shared foundations

- implement shared types
- implement shared schemas
- decide ORM and DB setup
- create initial migrations

### Step 3 — Seed and config packages

- add workflow-config package
- add content-bundles package
- seed versions and demo scenarios

### Step 4 — Backend workflow core

- implement session module
- implement workflow engine
- implement scenario loading
- implement workflow APIs

### Step 5 — Frontend core screens

- build intake screen
- build live guidance screen
- build wrap-up screen
- connect to workflow/session APIs

### Step 6 — Contextual support surfaces

- build side panel
- build escalation/support screen
- expose trace and warnings

### Step 7 — AI layer

- implement one AI task at a time
- add validation and fallbacks
- wire to relevant screens

### Step 8 — QA and coaching layer

- implement event logging
- implement QA review flow
- implement competency signals and coaching summaries

### Step 9 — Demo/admin visibility and polish

- add admin/demo view
- improve empty/error states
- refine scenarios
- add acceptance tests

---

## 20. Recommended first deliverable milestone inside the repo

The first meaningful milestone should be:

### “Workflow skeleton milestone”

A user can:

- open a scenario
- start a session
- answer guided questions
- see path changes
- complete wrap-up
- save a note and outcome

This milestone should be achieved **before** AI integration.

That keeps the product grounded in the non-AI backbone.

---

## 21. Definition of done for the codebase

The codebase is ready for MVP demo use when:

- all core screens work end-to-end
- deterministic workflow behavior exists across seeded scenarios
- trace output is visible
- wrap-up and outcome saving work
- AI assistance is bounded and fallback-safe
- analytics and QA basics are functional
- setup instructions allow another person to run the system locally

---

## 22. README expectations

The root `README.md` should include:

- what the product is
- what the MVP supports
- how to run the repo locally
- how the repo is structured
- where the canonical docs live
- how scenarios are seeded
- where workflow/content/prompt versions are stored
- how Cursor and Claude Code should be used with the repo

This makes the repo immediately understandable to a future collaborator or reviewer.

---

## 23. What not to do in implementation

- do not bury workflow logic inside UI components
- do not make AI responsible for pathing
- do not create duplicate spec documents in random folders
- do not mix public-policy content and Acme operational content into one indistinct content bucket
- do not start with live audio or live telephony as a dependency
- do not optimize prematurely for enterprise-scale deployment

These mistakes would weaken the MVP and scatter effort.

---

## 24. Suggested immediate next move after this document

After this asset, the next practical step is no longer another core specification. The next step is to begin implementation preparation by:

1. creating the repo
2. copying the docs into `/docs`
3. drafting `.cursor/rules/*`
4. drafting `CLAUDE.md`
5. scaffolding the workspace structure
6. implementing shared types and schema first

That is the clean handoff point into build mode.

---

## 25. Status

Status: Draft v0.1\
Intended use: Final build-bridge document for repo setup and implementation execution

