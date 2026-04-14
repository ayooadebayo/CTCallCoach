# Council Tax Call Coach

An AI-assisted workflow coach for council tax contact-centre handling, built for a fictional authority called **Acme City Council**.

The product helps contact-centre agents handle payment difficulty / arrears calls correctly, clearly, and confidently — guiding the next best question, surfacing support and escalation options, and generating structured wrap-up notes and coaching feedback.

---

## What the MVP supports

- Single inbound call scenario: resident struggling to pay council tax or in arrears
- Enquiry classification across seven payment-difficulty paths (PD1–PD8)
- Guided question flow with mandatory and optional clarifiers
- Support and signposting surfaces (Council Tax Reduction, debt advice, specialist review)
- Escalation detection and safer routing
- Structured wrap-up and case note generation
- After-call coaching feedback
- Team lead / QA review view
- Rule trace and version visibility for explainability

---

## Canonical docs

All product and technical specifications live in `/docs`. Read these before making changes.

| File | Purpose |
|---|---|
| `docs/council_tax_call_coach_product_prd_v_0.md` | Product PRD |
| `docs/council_tax_call_coach_technical_prd_v_0.md` | Technical PRD |
| `docs/council_tax_call_coach_workflow_specification_v_0.md` | Workflow spec |
| `docs/council_tax_call_coach_domain_model_and_data_schema_v_0.md` | Domain model and schema |
| `docs/council_tax_call_coach_screen_by_screen_ux_specification_v_0.md` | Screen-by-screen UX spec |
| `docs/council_tax_call_coach_ai_prompt_architecture_v_0.md` | AI prompt architecture |
| `docs/council_tax_call_coach_analytics_and_qa_specification_v_0.md` | Analytics and QA spec |
| `docs/council_tax_call_coach_mvp_backlog_and_delivery_plan_v_0.md` | MVP backlog and delivery plan |
| `docs/council_tax_call_coach_repo_structure_and_implementation_plan_v_0.md` | Repo structure and implementation plan |

---

## Repo structure

```
ct-call-coach/
  apps/
    web/          React + TypeScript + Vite + Tailwind frontend
    api/          Node.js + TypeScript + Fastify backend (modular monolith)
  packages/
    shared-types/     Canonical TypeScript types shared by web and api
    shared-schemas/   Zod validation schemas mirroring shared-types
    workflow-config/  Versioned workflow rule definitions (JSON)
    content-bundles/  Versioned guidance and wording content
  docs/             Canonical product and technical specifications
  .cursor/rules/    Cursor AI coding rules
  scripts/          Dev and seed utility scripts
  infra/            Lightweight deployment config
```

---

## How to run locally

> Prerequisites: Node.js ≥ 20, pnpm ≥ 9, PostgreSQL

```bash
# Install dependencies
pnpm install

# Copy and configure environment
cp apps/api/.env.example apps/api/.env
# Edit DATABASE_URL and other vars

# Run database migrations and seed
pnpm --filter @ctcc/api db:migrate
pnpm --filter @ctcc/api db:seed

# Start both apps in development mode
pnpm dev:api   # http://localhost:3001
pnpm dev:web   # http://localhost:5173
```

---

## How the repo is structured

- **`apps/web`** contains the agent-facing browser UI organized by feature area
- **`apps/api`** contains all backend logic: session, workflow, guidance, AI, analytics, QA
- **`packages/shared-types`** is the single source of truth for domain TypeScript types
- **`packages/shared-schemas`** holds Zod schemas for API payloads, workflow config, AI I/O, and events
- **`packages/workflow-config`** holds versioned JSON rule definitions loaded by the workflow engine
- **`packages/content-bundles`** holds versioned guidance cards and wording, separated by source domain

---

## Workflow and content versions

Versioned workflow and content are stored in:

```
packages/workflow-config/src/versions/v1/
packages/content-bundles/src/versions/v1/
```

Every call session records the `workflow_version_id`, `content_version_id`, and `prompt_version_id` it ran under. Do not edit version directories in place — create a new version.

---

## Scenarios

Synthetic demo scenarios are seeded via:

```bash
pnpm --filter @ctcc/api db:seed
```

Scenario definitions live in `apps/api/src/db/seeds/`. Each scenario defines a resident profile, account state, expected path, and expected support/escalation outputs.

---

## AI layer

The AI layer is optional and modular. The workflow engine runs without it. AI jobs are in `apps/api/src/ai/tasks/`. Each job is independently testable and has a fallback.

---

## Working with Cursor and Claude Code

- Always read the `/docs` files before making changes
- `CLAUDE.md` at repo root provides the persistent project instruction set
- `.cursor/rules/` contains coding constraint rules
- The workflow engine is primary — do not move path decision logic into the UI or AI layer
- Public policy content and Acme operational content must remain in separate source domains

---

## Deployment

**Frontend → Vercel (free tier)**
1. Connect the repo to Vercel. Set Root Directory: `apps/web`. Framework: Vite.
2. Add environment variable: `VITE_API_URL` = your Railway API URL.
3. Add custom domain: `cc.vantforge.com`.

**API → Railway (free tier)**
1. Connect the repo to Railway. Use Dockerfile: `apps/api/Dockerfile`.
2. Add PostgreSQL plugin (auto-generates `DATABASE_URL`).
3. Add environment variables: `OPENAI_API_KEY`, `CORS_ALLOWED_ORIGINS`, `NODE_ENV=production`.
4. After first deploy, open Railway shell and run: `pnpm db:migrate && pnpm db:seed`

**DNS → Cloudflare**
1. Add CNAME record: name `cc`, target `cname.vercel-dns.com`, proxied.

---

## Status

MVP build in progress — Phase 0 (repo foundation) complete.
