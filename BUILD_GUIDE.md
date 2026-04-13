# CTCallCoach — Guided Build Reference
## From Current State to Live Demo: Understanding Every Step

> Keep this file open in Cursor alongside your code while running prompts.
> Each section tells you WHY, WHAT, WHAT TO EXPECT, HOW TO VERIFY, and WHAT CAN GO WRONG.

---

## The Mental Model: How the Layers Stack

Before touching anything, understand the architecture as a whole.

```
BROWSER (React + Tailwind)
    ↓ HTTP calls to
API SERVER (Fastify / Node.js)
    ↓ reads rules from
WORKFLOW ENGINE (deterministic, no AI)
    ↓ queries
DATABASE (PostgreSQL via Prisma)
    ↓ optionally calls
AI SERVICE (OpenAI — assistive only, never decision-making)
    ↓ reads content from
CONFIG PACKAGES (workflow-config + content-bundles — versioned JSON files)
```

**The golden rule:** The workflow engine is the brain. AI is a helpful assistant.
If OpenAI goes down, the product still works. If the workflow engine breaks, nothing works.
This ordering is not accidental — it is the entire product philosophy.

**Why this matters for you:** When something goes wrong, you always ask:
1. Is the database connected and seeded?
2. Is the workflow engine returning the right output?
3. Is the API route wired correctly?
4. Is the frontend calling the right endpoint?
5. Is AI involved, and is it failing gracefully?

---

## Current Build Status Snapshot

As of your current codebase state:

| Layer | Status | What exists |
|-------|--------|-------------|
| Repo structure | ✅ Complete | Monorepo, pnpm workspace, all packages |
| Prisma schema | ✅ Complete | Full domain model, migration applied |
| Seed scripts | ✅ Complete | 9 seed files (versions → scenarios) |
| Workflow engine | ✅ Complete | Full deterministic engine in modules/workflow/engine.ts |
| Sessions service | ✅ Complete | Create, seed signals, advance, close |
| All API routes | ✅ Complete | sessions, workflow, scenarios, guidance, support, wrapup, agents |
| ScenarioListPage | ✅ Complete | Agent selector, scenario cards, starts sessions |
| CallIntakePage | ✅ Complete | Intake questions, auto-advances |
| LiveGuidancePage | ✅ Complete | Full guidance, stage progress, guidance cards sidebar |
| SupportReviewPage | ✅ Complete | Escalations, warnings, full decision trace |
| WrapUpPage | ✅ Complete | Outcome, case note, closes session |
| UI design | ⚠️ Functional only | Plain white, minimal styling, no brand |
| AI layer | ❌ Not started | All folders empty (.gitkeep only) |
| Landing page | ❌ Not started | Does not exist |
| Admin view | ❌ Not started | Route stub only |
| Deployment config | ❌ Not started | No Dockerfile, no Vercel config |
| Tests | ❌ Not started | Intentionally deferred for now |

**What this means:** You can run a full call right now, but it looks rough and
there is no public-facing home, no AI intelligence visible, and nowhere to host it.
The 6 prompts below fix all of that.

---

## The 6-Prompt Journey: Overview

```
Prompt 1 → GDS UI overhaul          (makes it look like a real civic tool)
Prompt 2 → OpenAI AI layer          (makes it feel intelligent)
Prompt 3 → Admin transparency view  (makes it explainable to investors/leaders)
Prompt 4 → Deployment config        (makes it hostable)
Prompt 5 → Landing page             (makes it presentable to the world)
Prompt 6 → Final verification       (makes it demo-ready and catches issues)
```

Each builds on the last. Do not skip or reorder them.

---

## PROMPT 1 — GDS Design System + Full UI Overhaul

### Why we run this first

The current UI is functional but stark. For call advisors, a plain white screen
during a live call is cognitively tiring and offers no visual hierarchy to guide
attention. For your secondary audience (council chief executives, GovTech investors,
civil service leaders), a plain prototype signals "unfinished" immediately.

The UK Government Design System (GDS) is the right design language because:
- Every person in your target commissioning audience has seen it on GOV.UK
- It signals compliance with UK public sector digital standards
- It is specifically designed for high-cognitive-load operational contexts
- It uses colour functionally (green = proceed, amber = caution, red = escalate)
  which maps directly to the product's workflow logic

This prompt changes only presentation — zero business logic changes.

### What it does technically

- Extends the Tailwind config with GDS colour tokens
- Rebuilds the app shell (header, layout, navigation) across all pages
- Redesigns component styling: QuestionCard, PathBadge, WarningBanner,
  StageProgress, EscalationFlagCard, SupportOptionCard, GuidanceCardWidget
- Adds Acme City Council branding to the header
- Changes the page background from white to govuk-light-grey (#f3f2f1)
- Applies Inter font (open-source, close to GDS Transport)

### What to expect

This will be a large change touching 8+ files. Claude Code in Cursor will:
1. Update tailwind.config.ts with colour extensions
2. Update globals.css with font and base styles
3. Rebuild headers across all 5 page components
4. Redesign component files in src/components/
5. Run pnpm build to verify no TypeScript errors

Time to complete: 30–60 minutes in Cursor.

### How to verify it worked

After the prompt completes:
1. Run `cd apps/web && pnpm dev`
2. Open http://localhost:5173
3. You should see the ScenarioListPage with a govuk-blue header bar
4. The header should say "Acme City Council" on the left with agent selector on the right
5. Scenario cards should have white backgrounds with coloured borders
6. Start any scenario — the intake, live guidance, and wrap-up screens should all
   have the govuk-blue header bar and warm gray page background
7. On the live guidance page, check: classification badge (blue pill), warning
   banners (amber left border), guidance cards in the sidebar (blue/orange accents)
8. On the support review page, check: escalation cards (red left border),
   trace panel (green rows for triggered rules, grey for non-triggered)

### What can go wrong

**Tailwind classes not applying:** If you see plain HTML without styles, check that
tailwind.config.ts content paths include all TSX files
(`./src/**/*.{ts,tsx}`). Restart the dev server after config changes.

**TypeScript errors on colour tokens:** If Tailwind doesn't recognise custom colours
in JSX (`bg-govuk-blue`), check that the extend.colors block in tailwind.config.ts
uses the exact key names referenced in the JSX. Case-sensitive.

**Build fails:** Run `pnpm build` from apps/web. If it fails, share the error —
it is almost always a JSX type mismatch or a missing import, not a colour problem.

**Looks wrong on certain screens:** This is normal for a first pass. Note what
looks off (e.g. "the stage progress strip is too small on the intake screen")
and add it to the next iteration. Do not stop the build to pixel-perfect — get
it working first.

### Critical thinking checkpoint

After Prompt 1, ask yourself:
- Does the header give a call advisor immediate orientation about where they are?
- Does the next question feel visually dominant on the live guidance screen?
- Do warnings and escalations feel urgent without being alarming?
- Would a council chief exec looking at a screenshot think this is a real tool?

If any answer is no, note it. We can refine the UI after the build is complete.

---

## PROMPT 2 — OpenAI AI Assistance Layer

### Why we run this second (and why OpenAI, not Anthropic)

The workflow engine already makes the product correct. AI makes it feel intelligent
and supportive. For a call advisor, the most valuable moments are:
- "Why am I asking this question right now?" (question rationale)
- "Write my case note for me" (wrap-up summary generator)
- "How did I do on that call?" (coaching feedback)

We use OpenAI because that is your current API key arrangement.
The model we use is `gpt-4o-mini` — fast, cheap, and more than capable for
short structured text generation tasks like these.

**Critical rule:** AI is always optional. Every task must have a fallback that
returns sensible static content if the API call fails, times out, or returns
invalid output. The product must never break because OpenAI is unavailable.

### What it does technically

1. Installs `openai` npm package in apps/api
2. Creates `ai/clients/openai.ts` — singleton client reading `OPENAI_API_KEY`
3. Creates `ai/system/system-prompt.ts` — shared system prompt establishing
   the AI's role (assistive, not authoritative, not inventing policy)
4. Creates three task files, each with its own Zod validation schema and fallback:
   - `ai/tasks/question-rationale.ts` — WHY does this question matter right now?
   - `ai/tasks/wrap-up-summary.ts` — generate a draft case note from session data
   - `ai/tasks/coaching-feedback.ts` — after-call learning feedback
5. Creates three new API endpoints:
   - `GET /ai/question-rationale?session_id=&question_code=`
   - `POST /ai/wrapup-summary` body: `{ call_session_id }`
   - `GET /ai/coaching/:sessionId`
6. Wires UI changes:
   - LiveGuidancePage: loads question rationale non-blockingly when question appears
   - WrapUpPage: adds "Generate draft" button that pre-populates case note
   - WrapUpPage done screen: adds collapsible coaching feedback panel

### What to expect

This will touch apps/api/src/ai/ (new files) and apps/api/src/server/index.ts
(registering new routes) plus two frontend pages.

Time to complete: 45–90 minutes in Cursor.

You will need your OPENAI_API_KEY in apps/api/.env for local testing.
Format: `OPENAI_API_KEY=sk-...`

### How to verify it worked

**Step 1 — Verify the AI client loads:**
Start the API server. In the terminal, if the key is missing, you should see a
clear error: "OPENAI_API_KEY is not set". If set, server starts normally.

**Step 2 — Verify question rationale:**
Run a scenario through to the live guidance screen. When a question card appears,
wait 1–2 seconds. Below the question text, a small italic rationale should
appear (e.g. "This tells us how urgent the situation is — reminder vs final
notice determines the available paths."). If OpenAI is not configured, the
static `why_it_matters_text` from the question definition should show instead.
The question card must never be blank.

**Step 3 — Verify wrap-up summary:**
Reach the wrap-up screen. Click "Generate draft summary". A loading spinner
should appear on the button. Within 3–5 seconds, the case note textarea should
fill with a 2–3 sentence summary. The "Next step" field should also pre-populate.
If OpenAI fails, a template-based summary should appear instead
(e.g. "Resident called regarding [path] stage concern. Questions answered: X.").
The button should never leave the screen in a broken state.

**Step 4 — Verify coaching feedback:**
Complete a call through to the "Call Complete" screen. A collapsed
"Coaching feedback" panel should appear. On expand, you should see:
- Green tick items: things handled well (up to 2)
- Amber items: things to improve (up to 2)
- A highlighted learning recommendation (1 item)
If OpenAI fails, the panel should show "Coaching feedback unavailable for this session."

**Step 5 — Verify fallback:**
Temporarily set `OPENAI_API_KEY=invalid_key` in .env and restart the API.
Run through the same flow. The question card should still show, the wrap-up
should generate a template summary, and the coaching panel should gracefully
say unavailable. Restore the correct key after testing.

### What can go wrong

**"Cannot find module 'openai'":** Run `cd apps/api && pnpm add openai` manually
if the prompt didn't install it. Then restart the API server.

**OpenAI returns JSON but validation fails:** The Zod schemas check specific
field names. If Claude Code wrote the schema expecting `{ rationale: string }`
but the prompt asked OpenAI for `{ text: string }`, validation fails and
the fallback triggers. Check the schema file and the prompt template match.

**Question rationale flickers or delays visibly:** It should load
asynchronously after the question appears. If it feels jarring, the UI
implementation can add a subtle fade-in. Note this for UI polish.

**Wrap-up button hangs:** Usually means the API call is timing out. Check
the Railway/local API is running. The OpenAI call should have a 15-second
timeout set explicitly in the task file.

### Understanding what the AI is and is not doing

This is important to be able to explain to your audiences:

The AI is NOT:
- Making any workflow decisions (what question comes next, what path to follow)
- Determining eligibility for support or escalation
- Inventing policy or council rules
- Running without guardrails

The AI IS:
- Explaining in natural language why the current question matters
- Drafting a summary of what already happened in structured form
- Offering coaching observations based on what the agent actually did

This is the LITFOW principle in action: the AI teaches and supports in context,
while the rules engine maintains correctness and auditability.

### Critical thinking checkpoint

After Prompt 2, ask yourself:
- Does the question rationale add genuine value, or is it just noise?
- Does the wrap-up draft actually save the advisor time, or is it worse than writing from scratch?
- Is the coaching feedback specific to what happened in the call, not generic?
- If OpenAI was down right now, would the product still be usable?

If the AI outputs feel generic, the system prompt or task prompt may need tuning.
This is normal — AI prompt quality improves with iteration.

---

## PROMPT 3 — Admin / Demo Transparency View

### Why we build this

For your primary users (call advisors), this view is invisible — they never need it.
For your secondary audiences (GovTech investors, council leaders, civil service digital
leads, L&D experts), this view is the most important thing in the product.

It answers the question every technically-aware commissioning audience will ask:
"How does it actually work? Is this just a chatbot making it up?"

The transparency view shows:
- Active workflow, content, and prompt versions (proves the system is versioned)
- Every escalation rule with its code, category, severity, and description
  (proves decisions are rule-based, not black-box)
- Every support option in the catalog, separated by source domain
  (proves the public policy / Acme operations separation is real)
- A plain-English explanation of the AI role (builds trust by being honest about limits)

### What it does technically

Backend: implements `GET /admin/versions` and `GET /admin/catalog` in routes/admin.ts
and registers them in server/index.ts.

Frontend: creates `AdminPage.tsx` at `/admin` route. Five sections: active versions,
enquiry types, escalation rules, support options catalog, about-this-system prose.

### What to expect

Smaller change than Prompt 1 or 2. Mostly new files, minimal changes to existing ones.
Time: 20–35 minutes in Cursor.

### How to verify it worked

1. Navigate to http://localhost:5173/admin
2. You should see three version cards showing active workflow/content/prompt versions
3. The escalation rules table should show all rules from the JSON config file in
   packages/workflow-config/src/versions/v1/escalation-rules.json
4. The support options catalog should show all options from
   packages/content-bundles/src/versions/v1/support-options/catalog.json
   grouped by source_domain
5. The "About this system" section should show the prose explanation

**Test the link from ScenarioListPage:** The header should have an "Admin" link
(small, secondary style) that navigates to /admin.

### What can go wrong

**Empty tables:** If the escalation rules or support options table is empty,
the route is not loading the JSON config. Check that `loadV1WorkflowConfig()`
and `loadV1ContentBundle()` are being called in the route handler.

**404 at /admin:** The route is not registered in App.tsx or the server route
is not registered in server/index.ts. Check both.

### Critical thinking checkpoint

Imagine showing this screen to a GovTech investor for 60 seconds.
Can they see: (a) that the system is versioned and auditable, (b) that AI is
narrow and bounded, (c) that policy and operations are separated?
If yes — this screen is doing its job.

---

## PROMPT 4 — Deployment Configuration

### Why we do this before the landing page

The landing page will contain a "Launch Demo" link. That link must go somewhere
real — not localhost. So deployment configuration must be done before the landing
page is finalised, because you need to know the live URLs.

### What the hosting architecture looks like

```
User's browser
    ↓ visits cc.vantforge.com
Cloudflare (DNS + CDN + HTTPS + WAF — all free)
    ↓ routes to
Vercel (static React build — free tier)
    ↓ JavaScript calls to
Railway API URL (e.g. ctcallcoach.up.railway.app — free tier)
    ↓ queries
Railway PostgreSQL (managed database — free tier)
    ↓ calls
OpenAI API (pay-as-you-go, very cheap for this volume)
```

Everything except OpenAI is free. OpenAI at demo-level traffic costs
pennies per day.

### What it does technically

1. Creates `apps/web/vercel.json` — tells Vercel to route all paths to index.html
   (required for React Router to work on page refresh)
2. Updates `apps/web/src/lib/api.ts` — reads API URL from `VITE_API_URL` env var
   instead of hardcoded localhost
3. Creates `apps/api/Dockerfile` — packages the API for Railway deployment
4. Updates CORS in `apps/api/src/server/index.ts` — allows cc.vantforge.com
5. Creates `.env.example` files with all required variables documented
6. Updates README.md with deployment instructions

### What to expect

Config files and documentation updates — minimal actual code changes.
Time: 20–30 minutes in Cursor.

### The actual deployment steps (you do these manually after the prompt)

**Railway setup:**
1. Go to railway.app, sign up/log in with GitHub
2. New Project → Deploy from GitHub repo → select CTCallCoach
3. Add a service → Dockerfile → path: `apps/api/Dockerfile`
4. Add a plugin → PostgreSQL (auto-generates DATABASE_URL)
5. In the service Variables tab, add:
   - `OPENAI_API_KEY` = your key
   - `CORS_ALLOWED_ORIGINS` = `https://cc.vantforge.com`
   - `NODE_ENV` = `production`
6. Deploy — Railway builds the Docker image and starts the server
7. After first deploy: open Railway terminal → run `pnpm db:migrate && pnpm db:seed`
8. Note the Railway-generated URL (e.g. `ctcallcoach-production.up.railway.app`)

**Vercel setup:**
1. Go to vercel.com, log in with GitHub
2. New Project → Import CTCallCoach repo
3. Framework: Vite; Root Directory: `apps/web`
4. Environment Variables: `VITE_API_URL` = `https://[your-railway-url]`
5. Deploy — Vercel builds the React app and gives you a preview URL
6. In Project Settings → Domains → Add `cc.vantforge.com`
7. Vercel gives you a CNAME value to add to DNS

**Cloudflare DNS (on vantforge.com):**
1. Log into Cloudflare dashboard
2. Select vantforge.com domain
3. DNS → Add Record:
   - Type: CNAME
   - Name: `cc`
   - Target: `cname.vercel-dns.com`
   - Proxy status: Proxied (orange cloud = Cloudflare protection active)
4. Within 1–5 minutes, cc.vantforge.com resolves to your Vercel deployment

### How to verify deployment worked

1. Visit https://cc.vantforge.com — you should see your app (landing page after Prompt 5)
2. In browser DevTools → Network tab → check that API calls go to your Railway URL
   and return 200 responses (not CORS errors, not 404)
3. Visit https://[railway-url]/health — should return `{ "status": "ok" }`
4. Start a scenario on the live site and complete a full call

### What can go wrong

**CORS error in browser console:** The Railway API is rejecting requests from
cc.vantforge.com. Check that `CORS_ALLOWED_ORIGINS` env var on Railway matches
exactly (no trailing slash, correct https://).

**React Router shows 404 on page refresh:** The `vercel.json` rewrite rule
is missing or wrong. Check the file exists in apps/web and contains the
correct rewrite configuration.

**Database empty on Railway:** The seed script was not run after first deploy.
Use Railway's shell or run from your local machine pointing at the Railway DB URL.

**Docker build fails on Railway:** Check the Dockerfile paths are correct relative
to the repo root. Railway builds from the repo root, so all COPY commands must
reference the correct relative paths.

### Critical thinking checkpoint

After deployment:
- Can you complete a full call end-to-end on the live URL?
- Is the API responding at the Railway URL?
- Is HTTPS showing a valid certificate on cc.vantforge.com?
- Would you be comfortable sharing this URL with someone right now?

If yes to all — you have a live product on the internet.

---

## PROMPT 5 — Landing Page

### Why the landing page is last in development (but first for users)

The landing page depends on:
- The live URL being known (Prompt 4)
- The product being visually polished (Prompt 1)
- The AI features being real (Prompt 2)
- The admin transparency view existing (Prompt 3)

Only then can the landing page honestly describe what the product does
and link to something real.

### The audience and what each section must achieve

**Primary audience of the landing page:** Your secondary stakeholder group —
council leaders, GovTech investors, L&D professionals, civil service digital leads.
These people are not the call advisors. They are the people who decide whether to
commission, fund, or learn from this product.

**Your primary users (call advisors)** go directly to the demo — they don't need
the landing page. The landing page is for people who need to understand why the
product matters before they try it.

**The page must achieve these things in order:**

1. In 5 seconds: communicate what the product is (not a chatbot, not a database,
   a coaching tool for call advisors)
2. In 30 seconds: communicate the problem it solves and why it matters
3. In 2 minutes: show how it works and what makes it different
4. At any point: offer a clear path to the demo

### The demo page link structure

The landing page lives at `/` (the root URL: cc.vantforge.com).
The demo app lives at `/app` (cc.vantforge.com/app — the ScenarioListPage).

When a user clicks "Launch Demo" on the landing page:
- They navigate to `/app`
- They see the ScenarioListPage with the agent selector and scenario cards
- From there, the existing flow takes over

This means the App.tsx routing changes:
- `/` → LandingPage (new)
- `/app` or `/scenarios` → ScenarioListPage (moved from `/`)
- All `/session/:id/...` routes stay unchanged
- `/admin` stays unchanged

### What it does technically

Creates `apps/web/src/features/landing/LandingPage.tsx` with:
- Hero section (govuk-blue full-width, headline, subheading, CTA buttons)
- Problem section (three-column problem cards)
- How it works section (numbered step flow)
- Capabilities section (four feature cards)
- CTA section (second "Launch Demo" button)
- Footer (product context, LITFOW attribution)

Updates App.tsx to add the `/` and `/app` routes.

### What to expect

This is the longest single file — the landing page has many sections.
Claude Code will generate the full component in one pass.
Time: 30–50 minutes in Cursor.

### How to verify it worked

1. Navigate to http://localhost:5173
2. You should see the landing page hero with govuk-blue background and white text
3. Scroll down — all five sections should be visible and readable
4. Click "Launch Demo" — should navigate to /app showing the ScenarioListPage
5. Start a call from /app — all session routes should still work
6. Navigate to /admin — should still work
7. Go back to cc.vantforge.com after deployment — check the landing page
   on mobile width (the layout should stack gracefully)

### What can go wrong

**Clicking "Launch Demo" shows 404:** The `/app` route is not in App.tsx,
or the ScenarioListPage import path has changed. Check App.tsx routing.

**Previous `/` route (ScenarioListPage) is gone:** It is now at `/app`.
Update any internal links or bookmarks. The landing page hero link should
go to `/app`, not `/`.

**Landing page looks unstyled:** The GDS colour tokens from Prompt 1 are
used here. If Prompt 1 was not run first, the classes will be unrecognised.
Run Prompt 1 before Prompt 5.

### Critical thinking checkpoint

Imagine you are a council digital lead who has never heard of CTCallCoach.
You land on cc.vantforge.com for the first time.

- Do you understand in 5 seconds what this is?
- Does the problem description resonate with your experience of contact centres?
- Does "rules-led, AI-assisted" feel credible and differentiated?
- Do you want to click "Launch Demo"?

If you hesitate on any of these — the landing page copy needs adjustment.
The structure may be right but the words may need tuning.

---

## PROMPT 6 — Final Verification and Demo Readiness Check

### What this prompt does

This is not a building prompt — it is an audit prompt. Claude Code in Cursor
will run the seed scripts, walk through the full demo flow, check that every
screen works on the live URL, fix any broken wiring, and run the TypeScript
build across both apps to catch any type errors.

Think of this as the dress rehearsal before the actual demo.

### What "demo ready" means

The product is demo-ready when:
1. A first-time visitor to cc.vantforge.com can understand the product
   from the landing page
2. They can click "Launch Demo" and arrive at the scenario list
3. They can start any seeded scenario, answer guided questions, see the
   workflow path change, access the support/escalation review, complete
   the wrap-up, and receive coaching feedback
4. The admin view at /admin shows the internal logic clearly
5. No unhandled errors appear in the browser console
6. Both `pnpm build` commands complete without TypeScript errors

### What to test manually after Prompt 6

Run this exact sequence on the live URL (cc.vantforge.com):

**Step 1:** Land on the homepage. Read the hero. Scroll to the bottom.
Does every section make sense? Does the "Launch Demo" button work?

**Step 2:** On the scenario list, select "Agent 1" (or whichever agent appears).
Click "Start Call" on the first scenario. Note the scenario title.

**Step 3:** On the intake screen, answer the intake question. Observe:
- Does the page auto-advance to the live guidance screen?
- Does the stage progress strip update?

**Step 4:** On the live guidance screen, answer 2–3 questions. Observe:
- Does the classification panel update after each answer?
- Do guidance cards appear in the sidebar when a path is established?
- Does the question rationale appear below each question (slight delay is fine)?
- Do warnings or escalation prompts appear for the right scenario types?

**Step 5:** Click "Support & Escalation Review". Observe:
- Are support options listed with their source domain labels?
- Is the decision trace visible and expandable?
- Does each rule show triggered (green) or not triggered (grey)?

**Step 6:** Return to live guidance. Advance through all stages to wrap-up.
Observe:
- Does the "Generate draft summary" button work and pre-populate the case note?
- Can you edit the pre-populated text?
- Does saving the wrap-up show the "Call Complete" screen?
- Does the coaching feedback panel appear and expand correctly?

**Step 7:** Navigate to /admin.
- Do the version cards show active versions?
- Is the escalation rules table populated?
- Is the support options catalog populated?

**Step 8:** Open browser DevTools → Console tab.
Are there any red errors? Network errors? CORS errors? 404s on API calls?
Every one of these needs to be resolved before the demo.

### Known intentional gaps (do not treat these as failures)

These are not built yet and are consciously deferred:

- **No authentication** — guest mode is the design. Anyone with the URL can use it.
  This is intentional for the demo phase.
- **No QA review page** — the quality assurance and reviewer flow is a Phase 4 feature.
  The admin view covers transparency for now.
- **No analytics dashboard** — analytics events are not yet emitted. This is Phase 4.
- **No tests** — unit and integration tests are deferred after demo stability.
- **Single scenario type** — only payment difficulty / arrears scenarios exist.
  Other council tax scenario types (CTR, discounts, etc.) are post-MVP.

Be ready to explain these gaps confidently as deliberate design decisions,
not oversights. The LITFOW philosophy is: prove the workflow skeleton with
one scenario before extending to many.

---

## The OpenAI AI Task Prompt (Corrected from Anthropic)

The following is the corrected Prompt 2 for your Cursor session.
This version uses the OpenAI SDK and `gpt-4o-mini` model.

---

```
Implement the AI assistance layer in apps/api/src/ai/. Use the OpenAI SDK.
Read docs/council_tax_call_coach_ai_prompt_architecture_v_0.md before starting.

Step 1 — Install and configure the OpenAI client:
Run: cd apps/api && pnpm add openai
Create apps/api/src/ai/clients/openai.ts:
  import OpenAI from 'openai';
  let client: OpenAI | null = null;
  export function getOpenAIClient(): OpenAI {
    if (!process.env['OPENAI_API_KEY']) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    if (!client) client = new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] });
    return client;
  }
  export function isOpenAIAvailable(): boolean {
    return !!process.env['OPENAI_API_KEY'];
  }

Create apps/api/src/ai/system/system-prompt.ts:
  export const SYSTEM_PROMPT = `You are a specialist assistant for a council tax
  contact-centre call coaching tool built for Acme City Council (a fictional
  local authority). Your role is strictly assistive. You explain, summarise,
  and coach — you never determine legal eligibility, invent council policy,
  or make decisions that belong to the rules-led workflow engine. All workflow
  path decisions are made by a deterministic engine. You support the agent
  after those decisions are made. Keep outputs concise, specific, and grounded
  in what actually happened in the call. Respond in UK English.
  Always return valid JSON matching the schema you are given.`;

Step 2 — Question rationale task:
Create apps/api/src/ai/schemas/question-rationale.ts:
  import { z } from 'zod';
  export const QuestionRationaleSchema = z.object({
    rationale: z.string().max(150),
    learning_tip: z.string().max(180),
  });
  export type QuestionRationale = z.infer<typeof QuestionRationaleSchema>;

Create apps/api/src/ai/tasks/question-rationale.ts:
  - Import getOpenAIClient, isOpenAIAvailable, SYSTEM_PROMPT, QuestionRationaleSchema
  - Export async function getQuestionRationale(
      questionCode: string, questionText: string, primaryPath: string | null
    ): Promise<QuestionRationale | null>
  - If !isOpenAIAvailable() return null immediately
  - Call client.chat.completions.create with model 'gpt-4o-mini', max_tokens 200
  - Messages: [{ role: 'system', content: SYSTEM_PROMPT }, {
      role: 'user',
      content: `The agent is being asked: "${questionText}" (code: ${questionCode}).
      Current call classification: ${primaryPath ?? 'not yet determined'}.
      Return JSON with two fields: "rationale" (why this question matters right now,
      max 150 chars) and "learning_tip" (one practical tip for the agent, max 180 chars).`
    }]
  - response_format: { type: 'json_object' }
  - Parse response.choices[0]?.message?.content, JSON.parse, validate with
    QuestionRationaleSchema.safeParse. Return parsed data or null on any failure.
  - Wrap entire function in try/catch — return null on any error. Never throw.

Add GET /ai/question-rationale?question_code=&session_id= route:
  - Load session's current_path_code from DB
  - Load question_text from QuestionStepDefinition where code matches
    and workflow_version_id matches session's workflow_version_id
  - Call getQuestionRationale with these values
  - Return { rationale, learning_tip } or { rationale: null, learning_tip: null }

Wire into LiveGuidancePage:
  - When nextQuestion changes (useEffect on nextQuestion.code), fire a fetch to
    GET /ai/question-rationale?question_code=CODE&session_id=ID
  - Store result in state as aiRationale: { rationale: string | null; learning_tip: string | null } | null
  - Pass to QuestionCard as optional prop
  - In QuestionCard: if aiRationale?.rationale, show it in the "why it matters"
    box. Otherwise show question.why_it_matters_text. Either way always show something.
  - The fetch is fire-and-forget and must not delay rendering the question.

Step 3 — Wrap-up summary generator:
Create apps/api/src/ai/schemas/wrap-up-summary.ts:
  import { z } from 'zod';
  export const WrapUpSummarySchema = z.object({
    summary_text: z.string().max(600),
    suggested_next_step: z.string().max(200),
    flags: z.array(z.string()).max(3),
  });

Create apps/api/src/ai/tasks/wrap-up-summary.ts:
  - Export async function generateWrapUpSummary(sessionId: string):
      Promise<{ summary_text: string; suggested_next_step: string; flags: string[]; source: 'ai' | 'template' } | null>
  - Load from DB: session.current_path_code, session.overlay_path_codes_json,
    question_responses (with question_step_definition.question_text and answer values),
    surfaced_support_options (with support_option.label),
    escalation_flags (code, severity, reason)
  - Build a context string from this data
  - If !isOpenAIAvailable(), go straight to template fallback
  - Call gpt-4o-mini asking for JSON matching WrapUpSummarySchema
  - On AI success: return { ...parsed, source: 'ai' }
  - Template fallback (always works without AI):
    summary_text = `Resident called regarding ${path ?? 'council tax payment difficulty'}.
    ${responses.length} questions answered. Support options identified: ${supportLabels}.`
    suggested_next_step = escalations.length > 0
      ? 'Refer to specialist team — escalation flag raised.'
      : 'Follow up as agreed with resident.'
    flags = escalation codes
    return { summary_text, suggested_next_step, flags, source: 'template' }

Add POST /ai/wrapup-summary route accepting { call_session_id: string }
Return { summary_text, suggested_next_step, flags, source }

Wire into WrapUpPage:
  - Add state: aiDraft: { summary_text: string; suggested_next_step: string } | null
  - Add state: generating: boolean
  - Add a "Generate draft" button (govuk-blue secondary style) below the case note label
  - On click: setGenerating(true), POST /ai/wrapup-summary, on success
    setCaseNote(result.summary_text) and setOwnerNextStep(result.suggested_next_step)
    and setAiDraft(result), setGenerating(false)
  - Show "Generated by AI — edit before saving" in small amber text if source === 'ai'
  - Show "Template draft — edit before saving" if source === 'template'
  - On error: show small red text "Could not generate — please write manually."

Step 4 — Coaching feedback:
Create apps/api/src/ai/schemas/coaching-feedback.ts:
  import { z } from 'zod';
  export const CoachingFeedbackSchema = z.object({
    well_handled: z.array(z.string()).max(2),
    could_improve: z.array(z.string()).max(2),
    learning_recommendation: z.string().max(250),
  });

Create apps/api/src/ai/tasks/coaching-feedback.ts:
  - Export async function generateCoachingFeedback(sessionId: string):
      Promise<CoachingFeedbackSchema type | null>
  - Load completed session data: path, responses, outcome, support options,
    escalation flags, case note summary
  - Build context: what happened, what support was surfaced, what outcome was recorded
  - Call gpt-4o-mini asking for JSON matching CoachingFeedbackSchema
  - Return parsed result or null on any failure

Add GET /ai/coaching/:sessionId route returning the coaching feedback or null

Register all AI routes in apps/api/src/server/index.ts as a new aiRoute plugin.

Wire into WrapUpPage done screen:
  - After done=true renders, in a useEffect, fetch GET /ai/coaching/:sessionId
  - Store in state: coaching: CoachingFeedbackSchema type | null, coachingLoading: boolean
  - Render a collapsible panel below the success message:
    Header: "Coaching feedback" with a ▼/▲ toggle
    Content:
      - Green section: "What went well" — bullet list of well_handled items
      - Amber section: "To consider next time" — bullet list of could_improve items
      - Blue highlighted box: "Learning recommendation" — learning_recommendation text
    If coachingLoading: show a small spinner inside the panel
    If coaching is null after loading: "Coaching feedback unavailable for this session."

Add OPENAI_API_KEY= to apps/api/.env.example with comment:
  # Get your key at platform.openai.com — gpt-4o-mini is used (low cost)
```

---

## How to Communicate What You Have Built

### For call advisors (primary users)

Frame it as: "A tool that guides you through the call, tells you what to ask
and why, and writes your case note for you. It learns from the rules your council
already uses — it does not make things up."

Key things that matter to them:
- It tells me the next question clearly
- It explains why that question matters right now
- It does not slow me down — it runs alongside the call
- It saves me time on the case note at the end
- It gives me honest feedback after the call without judgment

### For council leaders and civil service

Frame it as: "A proof-of-concept for embedding guidance and learning directly
into the operational workflow of revenues contact centres — without requiring
agents to leave the call to look things up. Rules-led with AI assistance.
Fully auditable. Public policy guidance and internal operating guidance are
clearly separated throughout."

### For GovTech investors

Frame it as: "We built a configurable, rules-led, AI-assisted workflow coaching
engine for council tax payment difficulty calls as the first domain. The architecture
generalises to any structured contact centre scenario. The AI is bounded, auditable,
and fallback-safe. The product works without AI. The first scenario proves the
concept — the platform scales to multiple councils and multiple scenario types."

### For L&D professionals

Frame it as: "Learning in the Flow of Work. Traditional training happens before
or after the task. This embeds the training in the task itself — the agent learns
why each question matters as they ask it, and receives specific coaching feedback
after each real or simulated call. It shortens the time to confident independent
handling."

---

## The LITFOW Connection

This product is a concrete instantiation of Learning in the Flow of Work (LITFOW)
theory. The three LITFOW principles it demonstrates:

1. **Context-relevance:** Guidance appears at the moment it is needed — not in a
   training room three months earlier.
2. **Spaced reinforcement:** After-call coaching feedback repeats and reinforces
   the learning from the call just completed, in context.
3. **Decreasing scaffolding:** As agents build confidence, they rely less on the
   guided questions and more on their own judgement. The system accommodates this
   without forcing the guidance away.

This is the intellectual framing that elevates the product from "a call centre
tool" to a contribution to the broader question of how AI can support workplace
learning in public services.

---

## After the Demo: What Comes Next

### Immediate (post-demo stability)

- Make the GitHub repo public with a polished README and the live demo link
- Add a Typeform or simple feedback form to the landing page footer
- Share to LocalGovDigital Slack, GovTech community, LinkedIn

### Short-term (if interest is confirmed)

- Add Council Tax Reduction scenario family (the next most common call type)
- Implement basic analytics event emission (which questions are most skipped?
  which scenarios have highest escalation rates?)
- Add the QA review page for team leads and managers
- Consider a second fictional authority scenario to demonstrate configurability

### Medium-term (if commissioning interest emerges)

- Authentication with named agents and role-based access (team lead vs advisor)
- Real workflow authoring tools (edit rules without JSON files)
- Integration layer design for telephony platforms (Genesys, Cisco, Amazon Connect)
- GDPR assessment and data classification for production use with real residents
- Cyber Essentials compliance review

The architecture you have supports all of this without redesign.
The only layer that changes is configuration and integration — not the core engine.

---

*Last updated: April 2026 — CTCallCoach LITFOW Project*
*Build guide version aligned with 6-prompt Cursor build sequence*
