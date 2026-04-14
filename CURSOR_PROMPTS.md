# CTCallCoach — Cursor Prompts (Copy-Paste Sequence)

Run these in order. Wait for each one to fully complete and verify before starting the next.
Prompt 3 (Admin) is already done — start from Prompt 1 if UI is not yet styled,
or jump to Prompt 3B if UI and AI are both done.

---

## Status at time of writing

| Prompt | What it does | Status |
|--------|-------------|--------|
| Prompt 1 | GDS UI overhaul | ❌ Run this |
| Prompt 2 | OpenAI AI layer | ❌ Run this |
| Prompt 3 | Admin transparency view | ✅ Already done |
| Prompt 3B | Ocelot-style UX additions | ❌ Run this |
| Prompt 4 | Deployment config | ❌ Run this |
| Prompt 5 | Landing page | ❌ Run this |
| Prompt 6 | Final verification | ❌ Run this last |

---

## PROMPT 1 — GDS Design System + Full UI Overhaul

> Paste this entire block into Claude Code in Cursor.
> Expected time: 30–60 minutes.
> Verify: `cd apps/web && pnpm dev` then open http://localhost:5173

```
Read every file in docs/ before starting. Then read:
- apps/web/src/App.tsx
- apps/web/src/features/scenarios/ScenarioListPage.tsx
- apps/web/src/features/call-intake/CallIntakePage.tsx
- apps/web/src/features/live-guidance/LiveGuidancePage.tsx
- apps/web/src/features/escalation-support/SupportReviewPage.tsx
- apps/web/src/features/wrap-up/WrapUpPage.tsx
- apps/web/tailwind.config.ts (or tailwind.config.js)

Apply the UK Government Design System (GDS) visual language across the entire frontend. Use Tailwind CSS only — do not install the govuk-frontend npm package.

STEP 1 — Tailwind colour tokens
In tailwind.config.ts, extend theme.colors with:
  govuk-blue: '#1d70b8'
  govuk-blue-hover: '#003078'
  govuk-green: '#00703c'
  govuk-green-hover: '#005a30'
  govuk-red: '#d4351c'
  govuk-orange: '#f47738'
  govuk-yellow: '#ffdd00'
  govuk-black: '#0b0c0c'
  govuk-dark-grey: '#505a5f'
  govuk-mid-grey: '#b1b4b6'
  govuk-light-grey: '#f3f2f1'
  govuk-white: '#ffffff'
  govuk-focus: '#ffdd00'

In tailwind.config.ts, extend theme.fontFamily with:
  sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']

In apps/web/index.html, add inside <head>:
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

STEP 2 — Global base styles
In apps/web/src/index.css (or globals.css), set:
  body { background-color: #f3f2f1; color: #0b0c0c; font-family: Inter, sans-serif; }
  * { box-sizing: border-box; }
  a { color: #1d70b8; }
  a:hover { color: #003078; }

STEP 3 — Shared app shell
Create apps/web/src/components/AppHeader.tsx:
  Full-width govuk-black (#0b0c0c) header bar, height 60px.
  Left side: "Acme City Council" in white, font-weight 700, font-size 18px, with a small
  white crown/shield emoji (👑) before the name.
  Right side: navigation links — "Demo" (links to /app), "Admin" (links to /admin) —
  in white, font-size 14px, with underline on hover.
  Below the black bar: a 4px govuk-blue (#1d70b8) accent strip, full width.

Create apps/web/src/components/PageWrapper.tsx:
  Wraps page content with max-width 1200px, margin auto, padding 24px 16px.
  Accepts a `children` prop.

STEP 4 — ScenarioListPage
Wrap the page in AppHeader + PageWrapper.
Page heading: "Council Tax Call Coach" in govuk-black, font-size 32px, font-weight 700,
  margin-bottom 4px.
Subheading: "Select a scenario to begin a simulated call" in govuk-dark-grey, font-size 18px,
  margin-bottom 32px.
Agent selector: render as a row of pill buttons. Selected agent: govuk-blue background,
  white text. Unselected: white background, govuk-blue border, govuk-blue text.
Scenario cards: white background, border 1px solid #b1b4b6, border-radius 4px, padding 20px,
  shadow-sm. On hover: border-color govuk-blue.
  Card heading: govuk-black, font-weight 600, font-size 16px.
  Card description: govuk-dark-grey, font-size 14px.
  Start button: govuk-green background, white text, font-weight 600, padding 10px 20px,
  border-radius 2px. Hover: govuk-green-hover background.

STEP 5 — CallIntakePage
Wrap in AppHeader + PageWrapper.
Show a breadcrumb strip: "Scenarios → [Scenario Title] → Intake" in govuk-dark-grey,
  font-size 14px, margin-bottom 24px.
Stage progress bar: horizontal strip, govuk-light-grey background, showing stage labels
  as steps. Active step: govuk-blue text + bottom border 3px govuk-blue.
  Completed steps: govuk-green text + checkmark.
Question card: white background, border-left 4px solid govuk-blue, padding 24px,
  border-radius 2px.
  Question text: govuk-black, font-size 20px, font-weight 600.
  Answer options: render as govuk-style radio buttons —
    each option is a full-width row with a white background, border 2px solid #b1b4b6,
    border-radius 2px, padding 12px 16px, cursor pointer.
    Selected: border-color govuk-blue, background #e8f0fe.
    Hover: border-color govuk-blue.
  Submit/Next button: govuk-blue background, white text, font-weight 600,
    padding 10px 24px, border-radius 2px. Hover: govuk-blue-hover.

STEP 6 — LiveGuidancePage
Wrap in AppHeader. Use a two-column layout inside PageWrapper:
  Left column (65%): question area + classification panel + warning banners.
  Right column (35%): guidance cards sidebar.

Classification panel (top of left column): white card, padding 16px, border-radius 2px,
  border 1px solid #b1b4b6.
  Label: "Current classification" in govuk-dark-grey, font-size 12px, uppercase.
  Primary path: govuk-blue background pill badge, white text, font-weight 600.
  Overlay paths: govuk-orange background pill badges.
  If unclassified: govuk-mid-grey pill badge, text "Classifying...".

Warning banners: full-width, border-left 4px solid govuk-orange, govuk-orange background
  at 10% opacity, padding 12px 16px, font-size 14px, govuk-black text.
  Escalation banners: border-left 4px solid govuk-red, govuk-red background at 10% opacity.

Question card: same style as CallIntakePage question card above.
  Below question text: a "why it matters" box — govuk-light-grey background, padding 10px 12px,
  font-size 13px, govuk-dark-grey italic text. Show ai rationale here if available,
  else show static why_it_matters_text. Always show something.

Stage progress strip: horizontal strip below the header, govuk-light-grey background,
  padding 8px 16px, showing stages as labelled pills.
  Current stage: govuk-blue pill. Completed stages: govuk-green pill. Upcoming: grey pill.

Support & Escalation button: secondary style — white background, govuk-blue border 2px,
  govuk-blue text, padding 8px 16px. Float this at the bottom of the left column.

Right column — guidance cards sidebar:
  Section heading: "Guidance" in govuk-dark-grey, font-size 12px, uppercase, margin-bottom 8px.
  Each card: white background, padding 16px, border-radius 2px, margin-bottom 8px.
  Public policy cards: border-left 3px solid govuk-blue.
  Acme operations cards: border-left 3px solid govuk-orange.
  Card label: govuk-black, font-weight 600, font-size 14px.
  Card description: govuk-dark-grey, font-size 13px.

STEP 7 — SupportReviewPage
Wrap in AppHeader + PageWrapper.
Page heading: "Support & Escalation Review" in govuk-black, font-size 28px, font-weight 700.
Back button: govuk-blue text link with ← arrow, no background.

Escalation flags section: if any flags exist, show a govuk-red banner at the top:
  "⚠ Escalation required — [N] flag(s) triggered" in white text on govuk-red background,
  padding 12px 16px, border-radius 2px, margin-bottom 24px.
Each escalation flag card: border-left 4px solid govuk-red, white background, padding 16px.

Support options: grouped by source_domain. Each group has a heading:
  "GOV.UK Guidance" (for public_policy) and "Acme Internal" (for acme_operations)
  in govuk-dark-grey, font-size 12px, uppercase, border-bottom 1px solid #b1b4b6,
  padding-bottom 4px, margin-bottom 12px.
Each support option card: white background, border 1px solid #b1b4b6, padding 16px,
  border-radius 2px.

Decision trace panel: collapsible, white background, border 1px solid #b1b4b6.
  Header: "Decision trace (N rules evaluated)" with ▼/▲ toggle.
  Each rule row: two columns — rule code/description left, triggered status right.
  Triggered: govuk-green text + ✓. Not triggered: govuk-mid-grey text + –.

STEP 8 — WrapUpPage
Wrap in AppHeader + PageWrapper.
Heading: "Wrap up call" in govuk-black, font-size 28px, font-weight 700.

Outcome selector: govuk-style select or large radio buttons.
  Each option: white background, border 2px solid #b1b4b6, padding 12px 16px,
  full-width, border-radius 2px. Selected: border-color govuk-green, background #e3f5e1.

Case note textarea: full-width, min-height 120px, border 2px solid #b1b4b6, padding 12px,
  border-radius 2px. Focus: border-color govuk-blue, outline 3px solid govuk-focus.
"Generate draft" button (below the label): govuk-blue secondary style.

Submit button: govuk-green background, white text, font-weight 700, padding 12px 28px,
  border-radius 2px. Full width on mobile.

Done/complete state: show a govuk-green panel — border-left 4px solid govuk-green,
  green background at 10% opacity, heading "Call complete", session summary text below.

After all changes, run: cd apps/web && pnpm build
Fix all TypeScript errors before finishing. Do not change any backend files.
```

---

## PROMPT 2 — OpenAI AI Assistance Layer

> Paste this entire block into Claude Code in Cursor.
> Expected time: 45–90 minutes.
> You need OPENAI_API_KEY in apps/api/.env before testing.
> Verify: start API and web, run a scenario, check for rationale below each question.

```
Read every file in docs/ before starting. Then read:
- apps/web/src/features/live-guidance/LiveGuidancePage.tsx
- apps/web/src/features/wrap-up/WrapUpPage.tsx
- apps/api/src/server/index.ts
- apps/api/src/modules/sessions/service.ts
All ai/ subdirectories in apps/api/src/ai/ currently contain only .gitkeep files.

Implement the AI assistance layer using the OpenAI SDK. AI is always optional —
every task must have a fallback that works without OpenAI. Never let an AI failure
break the UI or block the call flow.

STEP 1 — Install and configure the OpenAI client

Run: cd apps/api && pnpm add openai

Create apps/api/src/ai/clients/openai.ts:
  import OpenAI from 'openai';
  let client: OpenAI | null = null;
  export function getOpenAIClient(): OpenAI {
    if (!process.env['OPENAI_API_KEY']) throw new Error('OPENAI_API_KEY is not set');
    if (!client) client = new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] });
    return client;
  }
  export function isOpenAIAvailable(): boolean {
    return !!process.env['OPENAI_API_KEY'];
  }

Create apps/api/src/ai/system/system-prompt.ts:
  export const SYSTEM_PROMPT = `You are a specialist assistant for a council tax
  contact-centre call coaching tool built for Acme City Council (a fictional local
  authority). Your role is strictly assistive. You explain, summarise, and coach —
  you never determine legal eligibility, invent council policy, or make decisions
  that belong to the rules-led workflow engine. All workflow path decisions are made
  by a deterministic engine. You support the agent after those decisions are made.
  Keep outputs concise, specific, and grounded in what actually happened in the call.
  Respond in UK English. Always return valid JSON matching the schema you are given.`;

STEP 2 — Question rationale task

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
  - Call client.chat.completions.create({ model: 'gpt-4o-mini', max_tokens: 200,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `The agent is being asked: "${questionText}"
          (code: ${questionCode}). Current call classification:
          ${primaryPath ?? 'not yet determined'}.
          Return JSON with: "rationale" (why this question matters right now,
          max 150 chars) and "learning_tip" (one practical tip for the agent, max 180 chars).` }
      ]
    })
  - Parse response.choices[0]?.message?.content with JSON.parse
  - Validate with QuestionRationaleSchema.safeParse — return parsed data or null
  - Wrap entire function in try/catch — return null on any error, never throw

Add route GET /ai/question-rationale?question_code=&session_id= in a new file
apps/api/src/routes/ai.ts:
  - Load session from DB to get current_path_code and workflow_version_id
  - Load question text from QuestionStepDefinition where code = question_code
    and workflow_version_id matches session
  - Call getQuestionRationale(code, text, path)
  - Return { rationale, learning_tip } — both may be null, never error

Wire into LiveGuidancePage.tsx:
  - Add state: aiRationale: { rationale: string | null; learning_tip: string | null } | null
  - useEffect on nextQuestion?.code: when it changes, fire fetch to
    GET /ai/question-rationale?question_code=CODE&session_id=ID
  - Store result in aiRationale — do not await before rendering the question
  - In the question card "why it matters" box: if aiRationale?.rationale exists
    show it, else show question.why_it_matters_text. Always show one or the other.

STEP 3 — Wrap-up summary generator

Create apps/api/src/ai/schemas/wrap-up-summary.ts:
  import { z } from 'zod';
  export const WrapUpSummarySchema = z.object({
    summary_text: z.string().max(600),
    suggested_next_step: z.string().max(200),
    flags: z.array(z.string()).max(3),
  });

Create apps/api/src/ai/tasks/wrap-up-summary.ts:
  Export async function generateWrapUpSummary(sessionId: string):
    Promise<{ summary_text: string; suggested_next_step: string;
              flags: string[]; source: 'ai' | 'template' } | null>

  Load from DB:
    - session.current_path_code, session.overlay_path_codes_json
    - QuestionResponse records with question_step_definition.question_text
    - SurfacedSupportOption records with support_option.label
    - EscalationFlag records (code, severity)

  Build context string from this data.

  If isOpenAIAvailable():
    Call gpt-4o-mini asking for JSON matching WrapUpSummarySchema.
    On success: return { ...parsed, source: 'ai' }
    On any failure: fall through to template

  Template fallback (always available):
    const path = session.current_path_code ?? 'council tax payment difficulty'
    const supportLabels = surfaced support option labels joined by ', ' or 'none identified'
    summary_text = `Resident called regarding ${path} concern.
      ${responses.length} question(s) answered. Support options identified: ${supportLabels}.`
    suggested_next_step = escalations.length > 0
      ? 'Refer to specialist team — escalation flag raised.'
      : 'Follow up with resident as agreed.'
    flags = escalation codes
    return { summary_text, suggested_next_step, flags, source: 'template' }

Add POST /ai/wrapup-summary to apps/api/src/routes/ai.ts:
  Body: { call_session_id: string }
  Return: { summary_text, suggested_next_step, flags, source }

Wire into WrapUpPage.tsx:
  - Add state: aiDraft: WrapUpSummary | null, generating: boolean
  - Add "Generate draft" button (secondary govuk-blue style) below the case note label
  - On click: setGenerating(true), POST /ai/wrapup-summary,
    on success: setCaseNote(result.summary_text), setNextStep(result.suggested_next_step),
    setAiDraft(result), setGenerating(false)
  - If source === 'ai': show small amber text "AI draft — edit before saving"
  - If source === 'template': show small grey text "Template draft — edit before saving"
  - On error: show small red text "Could not generate — please write manually."

STEP 4 — Coaching feedback

Create apps/api/src/ai/schemas/coaching-feedback.ts:
  import { z } from 'zod';
  export const CoachingFeedbackSchema = z.object({
    well_handled: z.array(z.string()).max(2),
    could_improve: z.array(z.string()).max(2),
    learning_recommendation: z.string().max(250),
  });
  export type CoachingFeedback = z.infer<typeof CoachingFeedbackSchema>;

Create apps/api/src/ai/tasks/coaching-feedback.ts:
  Export async function generateCoachingFeedback(sessionId: string):
    Promise<CoachingFeedback | null>
  - Load completed session: path, responses, outcome, support options, escalation flags
  - Build a context string describing the call
  - Call gpt-4o-mini asking for JSON matching CoachingFeedbackSchema
  - Return parsed result or null on any failure — wrap in try/catch, never throw

Add GET /ai/coaching/:sessionId to apps/api/src/routes/ai.ts.
Return the coaching feedback object or { well_handled: [], could_improve: [],
  learning_recommendation: null } if session not found or AI unavailable.

Register the AI routes: in apps/api/src/server/index.ts, import aiRoute from
'./routes/ai' and register it with fastify.register(aiRoute, { prefix: '/ai' }).

Wire into WrapUpPage.tsx done screen:
  - After done=true renders, useEffect fires GET /ai/coaching/:sessionId
  - State: coaching: CoachingFeedback | null, coachingLoading: boolean
  - Render collapsible panel below the success message:
    Header: "Coaching feedback" with ▼/▲ toggle, govuk-light-grey background
    When open:
      Green section: "What went well" — bullet list of well_handled items
      Amber section: "To consider next time" — bullet list of could_improve items
      Blue highlighted box: "Learning recommendation" — learning_recommendation text
    If coachingLoading: show small spinner inside panel
    If coaching is null after loading: "Coaching feedback unavailable for this session."

Create apps/api/.env.example with:
  DATABASE_URL=postgresql://user:password@localhost:5432/ctcallcoach
  OPENAI_API_KEY=
  # Get your key at platform.openai.com — gpt-4o-mini model is used (low cost)
  PORT=3001
  NODE_ENV=development
  CORS_ALLOWED_ORIGINS=http://localhost:5173

After all steps, run: cd apps/api && pnpm build
Fix all TypeScript errors before finishing.
```

---

## PROMPT 3B — Ocelot-Style Guidance UX Additions

> Paste this entire block into Claude Code in Cursor.
> Expected time: 30–50 minutes.
> Verify: stage checkpoint card appears when advancing stages; answers panel
> accumulates in sidebar; guidance cards show "View source guidance →" links;
> /admin shows Ocelot section at the bottom.

```
Read every file in docs/ before starting. Then read:
- apps/web/src/features/live-guidance/LiveGuidancePage.tsx
- apps/web/src/features/admin/AdminPage.tsx (wherever AdminPage lives)
- apps/api/src/routes/workflow.ts
- packages/shared-types/src/index.ts (or wherever shared types are defined)
- packages/content-bundles/src/versions/v1/ (find the support options / guidance catalog JSON)

Implement the following four additions. Make no changes to the workflow engine,
session service, or database schema.

ADDITION 1 — Stage completion checkpoint card

Create apps/web/src/components/StageCheckpointCard.tsx.
Props: stageLabel: string, primaryPath: string | null, overlayPaths: string[],
  questionsAnswered: number, onContinue: () => void

Render: full-width card, border-left 4px solid govuk-blue (#1d70b8), white background,
  padding 24px, border-radius 2px.
  Heading: "Stage complete: {stageLabel}" — govuk-black, font-weight 600, font-size 20px.
  Below: classification row — green pill badge for primaryPath (or grey "Classifying..."
  if null), orange pill badges for each overlayPath.
  Below: small govuk-dark-grey text: "{questionsAnswered} question(s) answered in this stage."
  Below: govuk-blue "Continue to next stage →" button that calls onContinue().

In LiveGuidancePage.tsx:
  Add state: stageJustCompleted: boolean = false, completedStageLabel: string = '',
    prevStage: string = '', completedStageResponseCount: number = 0.
  After each successful GET /workflow/:sessionId/next response, check whether
  the current_stage (or equivalent field in the response) has changed vs prevStage.
  If it has changed AND prevStage is not empty:
    setStageJustCompleted(true)
    setCompletedStageLabel(prevStage)
    setCompletedStageResponseCount(count of session_responses belonging to prevStage)
  Update prevStage to the new stage value on every response.
  In render: if stageJustCompleted is true, render <StageCheckpointCard /> in place of
  the question card. Pass onContinue={() => setStageJustCompleted(false)}.

ADDITION 2 — Answers captured panel

Create apps/web/src/components/AnswersCapturedPanel.tsx.
Props: responses: Array<{ stage: string; questionText: string; answerValue: string }>,
  isOpen: boolean, onToggle: () => void

Render: collapsible panel.
  Header row: "Answers so far ({responses.length})" — govuk-light-grey background,
  padding 12px 16px, cursor pointer, chevron ▼/▲ on the right, onClick = onToggle.
  When open and responses.length > 0:
    Group by stage. For each stage: a small grey stage label row (uppercase, 11px,
    letter-spacing 0.05em). For each response: two columns — questionText truncated
    to 75 chars with "..." if longer (left, 14px govuk-dark-grey), answerValue in a
    grey monospace pill (right). Each row: border-bottom 1px solid #e8e8e8, padding 8px 16px.
  When open and responses.length === 0: "No answers recorded yet." grey italic 14px.

Check whether GET /workflow/:sessionId/next response already includes a session_responses
array. If it does: map to { stage, questionText, answerValue } and store in state.
If it does not: update apps/api/src/routes/workflow.ts in the GET /:sessionId/next handler.
  Add to the response body:
    session_responses: await prisma.questionResponse.findMany({
      where: { call_session_id: sessionId },
      include: { question_step_definition: true },
      orderBy: { created_at: 'asc' }
    })
  Map to { stage: qr.question_step_definition.stage_code (or equivalent),
           questionText: qr.question_step_definition.question_text,
           answerValue: qr.answer_value }
  This is read-only and safe — no engine changes.

Add <AnswersCapturedPanel /> to the right sidebar of LiveGuidancePage, below the
guidance cards section. Pass: responses from state, isOpen=answersOpen,
onToggle={() => setAnswersOpen(!answersOpen)}.

ADDITION 3 — Guidance card source links

In packages/shared-types/src/index.ts (or wherever guidance/support types are defined),
add source_url?: string | null to the SupportOption or GuidanceItem type.

In the content-bundles guidance catalog JSON
(packages/content-bundles/src/versions/v1/), add "source_url" to each item:

For source_domain: "public_policy" items — use real GOV.UK URLs matched by topic:
  - Payment / arrears / bill / account → "https://www.gov.uk/council-tax/pay-your-council-tax"
  - Council Tax Reduction / CTR / hardship / discount → "https://www.gov.uk/apply-council-tax-reduction"
  - Debt / enforcement / liability order → "https://www.gov.uk/options-for-paying-off-your-debts/council-tax-arrears"
  - Benefits / Universal Credit → "https://www.gov.uk/universal-credit"
  - General council tax enquiry → "https://www.gov.uk/council-tax"
  Use your best judgement to assign the most relevant GOV.UK URL to each card.

For source_domain: "acme_operations" items — set source_url to:
  "https://intranet.acme.gov.uk/revenues/guidance/[slug]"
  where slug = item label lowercased with spaces replaced by hyphens, special chars removed.
  These are fictional illustrative URLs — they do not need to resolve.

In the guidance card render in LiveGuidancePage (or its child component), after the
description text, add:
  {item.source_url && (
    <a href={item.source_url} target="_blank" rel="noopener noreferrer"
       className="text-sm text-govuk-blue underline mt-2 inline-block hover:opacity-80">
      View source guidance →
    </a>
  )}

ADDITION 4 — Ocelot positioning section in AdminPage

In AdminPage.tsx, add a new section after the existing "About this system" section.

Section heading: "How this relates to Ocelot-style guidance" — same heading style
as other sections on the page.

Below the heading, a div with border-left: 4px solid #1d70b8, padding-left: 24px,
containing three paragraphs:

Para 1: "Ocelot is HMRC's interactive guidance delivery platform — the system
behind CEST (Check Employment Status for Tax) and other task-based tools used
across central government. It embodies a UX philosophy: one question at a time,
explicit stage outcomes, reviewable answers at each checkpoint, and transparent
links to the underlying policy that drives each recommendation."

Para 2: "CTCallCoach applies the same philosophy to a contact centre context.
The guided question sequence surfaces one decision at a time during a live call.
Stage checkpoint cards summarise what has been established before the workflow
advances. The answers panel lets the advisor review the full call record in one
glance without leaving the screen. Guidance cards link directly to the GOV.UK
manual pages and fictional internal operating guidance that underpin each
recommendation."

Para 3: "The key difference from Ocelot is the operational layer. CTCallCoach
serves a call advisor navigating a live resident interaction under time pressure,
not a self-service user completing a tax status check at their own pace. The
pacing, language, and layout are tuned for speed and confidence under call
conditions. The underlying philosophy — structured, transparent, auditable,
policy-grounded — is the same."

After all four additions, run: cd apps/web && pnpm build
Fix any TypeScript errors before finishing.
Do not change any workflow engine files, session service files, or database schema.
```

---

## PROMPT 4 — Deployment Configuration

> Paste this entire block into Claude Code in Cursor.
> Expected time: 20–30 minutes.
> This prompt creates config files only — no business logic changes.
> After this prompt you will manually set up Railway, Vercel, and Cloudflare
> using the steps in BUILD_GUIDE.md.

```
Read apps/web/src/lib/api.ts (or wherever the API base URL is configured).
Read apps/api/src/server/index.ts.
Read the root package.json and apps/api/package.json.

Create the following deployment configuration files. Make no changes to business
logic, workflow engine, or component files.

STEP 1 — Vercel config for frontend SPA routing

Create apps/web/vercel.json:
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
This is required so that React Router routes (like /session/:id/live) work
correctly when the user refreshes the page or navigates directly to a deep URL.

STEP 2 — Environment-aware API base URL

In apps/web/src/lib/api.ts (or wherever the API base URL is set):
  Replace any hardcoded 'http://localhost:3001' with:
  const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
  Export API_BASE_URL and use it as the base for all fetch calls.

If there is no central api.ts file and fetch calls are scattered across components,
create apps/web/src/lib/api.ts:
  export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
  export async function apiFetch(path: string, options?: RequestInit) {
    return fetch(`${API_BASE_URL}${path}`, options);
  }
Then update all fetch calls in page components to import and use apiFetch or API_BASE_URL.

STEP 3 — Dockerfile for Railway API deployment

Create apps/api/Dockerfile:
  FROM node:20-alpine AS base
  RUN npm install -g pnpm
  WORKDIR /app

  # Copy workspace config
  COPY pnpm-workspace.yaml ./
  COPY package.json ./
  COPY pnpm-lock.yaml ./

  # Copy all package.json files for dependency resolution
  COPY apps/api/package.json ./apps/api/
  COPY packages/shared-types/package.json ./packages/shared-types/
  COPY packages/shared-schemas/package.json ./packages/shared-schemas/
  COPY packages/workflow-config/package.json ./packages/workflow-config/
  COPY packages/content-bundles/package.json ./packages/content-bundles/

  # Install all dependencies
  RUN pnpm install --frozen-lockfile

  # Copy source files
  COPY apps/api/ ./apps/api/
  COPY packages/ ./packages/

  # Generate Prisma client
  RUN cd apps/api && pnpm exec prisma generate

  # Build all packages then the API
  RUN pnpm --filter @ctcc/shared-types build
  RUN pnpm --filter @ctcc/shared-schemas build
  RUN pnpm --filter @ctcc/workflow-config build
  RUN pnpm --filter @ctcc/content-bundles build
  RUN pnpm --filter api build

  EXPOSE 3001
  CMD ["node", "apps/api/dist/server/index.js"]

Adjust the CMD path if the compiled output is in a different location —
check apps/api/tsconfig.json for the outDir setting.

STEP 4 — CORS update for production domain

In apps/api/src/server/index.ts, update the CORS configuration to read from
an environment variable:
  const allowedOrigins = process.env['CORS_ALLOWED_ORIGINS']
    ? process.env['CORS_ALLOWED_ORIGINS'].split(',').map(s => s.trim())
    : ['http://localhost:5173'];

  fastify.register(cors, {
    origin: allowedOrigins,
    credentials: true,
  });

If @fastify/cors is not already installed, run: cd apps/api && pnpm add @fastify/cors

STEP 5 — Environment variable documentation

Create apps/api/.env.example (update if it already exists):
  # Database — provided automatically by Railway PostgreSQL plugin
  DATABASE_URL=postgresql://user:password@localhost:5432/ctcallcoach

  # OpenAI — get your key at platform.openai.com
  # gpt-4o-mini is used — low cost, fast
  OPENAI_API_KEY=

  # Server
  PORT=3001
  NODE_ENV=development

  # CORS — comma-separated list of allowed frontend origins
  # Production: https://cc.vantforge.com
  # Local: http://localhost:5173
  CORS_ALLOWED_ORIGINS=http://localhost:5173

Create apps/web/.env.example:
  # API URL — set to your Railway deployment URL in production
  # Example: https://ctcallcoach-production.up.railway.app
  VITE_API_URL=http://localhost:3001

STEP 6 — README deployment section

In the root README.md, add a "Deployment" section (or update it if one exists):

  ## Deployment

  **Frontend → Vercel (free tier)**
  1. Connect the repo to Vercel. Set Root Directory: `apps/web`. Framework: Vite.
  2. Add environment variable: `VITE_API_URL` = your Railway API URL.
  3. Add custom domain: `cc.vantforge.com`.

  **API → Railway (free tier)**
  1. Connect the repo to Railway. Use Dockerfile: `apps/api/Dockerfile`.
  2. Add PostgreSQL plugin (auto-generates DATABASE_URL).
  3. Add environment variables: `OPENAI_API_KEY`, `CORS_ALLOWED_ORIGINS`, `NODE_ENV=production`.
  4. After first deploy, open Railway shell and run: `pnpm db:migrate && pnpm db:seed`

  **DNS → Cloudflare**
  1. Add CNAME record: name `cc`, target `cname.vercel-dns.com`, proxied.

After all changes, run: pnpm build (from repo root, or build each app individually).
Fix all TypeScript errors before finishing.
```

---

## PROMPT 5 — Landing Page

> Paste this entire block into Claude Code in Cursor.
> Expected time: 30–50 minutes.
> Verify: http://localhost:5173 shows the landing page, not the scenario list.
> "Launch Demo" navigates to /app. All session routes still work.

```
Read apps/web/src/App.tsx before starting.
Read apps/web/src/features/scenarios/ScenarioListPage.tsx to understand the demo entry point.

The current routing has ScenarioListPage at /. This must move to /app.
A new LandingPage will take the / route.

STEP 1 — Update App.tsx routing

In apps/web/src/App.tsx:
  - Import LandingPage from './features/landing/LandingPage' (will create next)
  - Change the existing / route from ScenarioListPage to LandingPage
  - Add a new route: path="/app" element={<ScenarioListPage />}
  - If there is a /scenarios route, keep it as an alias pointing to ScenarioListPage
  - All /session/:id/* routes and /admin remain exactly as they are

STEP 2 — Create the landing page

Create apps/web/src/features/landing/LandingPage.tsx.

The landing page uses the same govuk-blue, govuk-black, govuk-light-grey, govuk-green
Tailwind tokens established in Prompt 1. No additional libraries needed.
The page is a single scrollable document — no sidebar.

--- SECTION 1: NAVIGATION BAR ---
Full-width govuk-black bar, height 56px, padding 0 24px.
Left: "Acme City Council" in white, font-weight 700, font-size 16px.
Right: two links — "Launch Demo" (govuk-blue background, white text, padding 8px 16px,
  border-radius 2px, links to /app) and "Admin" (white text, no background, links to /admin).

--- SECTION 2: HERO ---
Full-width govuk-blue (#1d70b8) background, padding 80px 24px, text centred.
Main headline (white, font-size 48px, font-weight 700, line-height 1.15, max-width 720px, margin auto):
  "Guided call coaching for council tax advisors"

Subheading (white, opacity 90%, font-size 20px, max-width 600px, margin: 20px auto 0):
  "Rules-led. AI-assisted. Built for the pressure of a live resident call."

Two CTA buttons, centred, margin-top 40px, gap 16px:
  Primary: "Launch Demo →" — white background, govuk-blue text, font-weight 700,
    padding 14px 32px, border-radius 2px, links to /app
  Secondary: "View system transparency" — transparent background, white border 2px,
    white text, padding 14px 32px, border-radius 2px, links to /admin

Small caption below buttons (white, opacity 70%, font-size 14px, margin-top 16px):
  "No login required · Free to use · Built for Acme City Council (demo)"

--- SECTION 3: PROBLEM ---
White background, padding 72px 24px. Max-width 1100px, margin auto.
Section label (govuk-blue, font-size 12px, font-weight 700, uppercase, letter-spacing 0.1em,
  margin-bottom 12px): "THE PROBLEM"
Heading (govuk-black, font-size 32px, font-weight 700, margin-bottom 16px):
  "Contact centre advisors carry too much in their heads"
Subtext (govuk-dark-grey, font-size 18px, max-width 680px, margin-bottom 48px):
  "Council tax calls involve complex rules, multiple support options, and residents
  in financial difficulty — all at once, under time pressure. Advisors shouldn't
  have to memorise the policy manual."

Three-column card row (flex, gap 24px, flex-wrap for mobile):
  Card 1 — amber left border (4px solid govuk-orange):
    Heading: "Inconsistent advice"
    Body: "Without a structured guide, different agents handle the same situation
    differently — leading to resident confusion and compliance risk."
  Card 2 — red left border (4px solid govuk-red):
    Heading: "Slow call handling"
    Body: "Advisors pause to check manuals, ask colleagues, or escalate unnecessarily
    — adding time and cost to every interaction."
  Card 3 — blue left border (4px solid govuk-blue):
    Heading: "No in-call learning"
    Body: "Traditional training happens before the task. By the time the call arrives,
    the learning has faded. There is no guide available during the call itself."
  Each card: white background, border 1px solid #e8e8e8, padding 24px, border-radius 2px.

--- SECTION 4: HOW IT WORKS ---
govuk-light-grey (#f3f2f1) background, padding 72px 24px. Max-width 1100px, margin auto.
Section label: "HOW IT WORKS" (same style as Section 3 label, govuk-blue)
Heading: "The workflow guides the call. The AI supports the advisor."
  (govuk-black, font-size 32px, font-weight 700, margin-bottom 48px)

Four numbered steps in a row (or 2x2 grid on mobile), each step:
  Large number (govuk-blue, font-size 40px, font-weight 700, margin-bottom 8px)
  Step heading (govuk-black, font-weight 600, font-size 18px)
  Step body (govuk-dark-grey, font-size 15px)

  Step 1: "Start the call" — "Select the scenario type and agent. The system loads
    the relevant workflow rules for this call type."
  Step 2: "Answer guided questions" — "One question at a time. The workflow engine
    determines the path — no AI involved in routing decisions."
  Step 3: "Receive real-time guidance" — "As the path becomes clear, relevant
    policy guidance and support options appear alongside the call."
  Step 4: "Wrap up with confidence" — "AI drafts the case note. Coaching feedback
    appears after the call. The advisor learns from every interaction."

--- SECTION 5: CAPABILITIES ---
White background, padding 72px 24px. Max-width 1100px, margin auto.
Section label: "WHAT MAKES IT DIFFERENT" (govuk-blue, same style)
Heading: "Rules-led decisions. AI-assisted support. Always auditable."
  (govuk-black, font-size 32px, font-weight 700, margin-bottom 48px)

Four cards in a 2x2 grid:
  Card 1 — "Deterministic workflow engine"
    "Every routing decision is made by a rules engine loaded from versioned JSON config.
    AI never determines what question comes next or what outcome applies."
  Card 2 — "Policy and operations separated"
    "GOV.UK statutory guidance and Acme City Council operating guidance are kept in
    separate content bundles — clearly labelled on every guidance card."
  Card 3 — "AI that explains and coaches"
    "OpenAI explains why each question matters, drafts the case note from call data,
    and delivers specific after-call coaching. It supports — never decides."
  Card 4 — "Learning in the flow of work"
    "Guidance appears at the moment of need, not in a training room three months
    earlier. Advisors build expertise through every real and simulated call."
  Each card: white background, border 1px solid #e8e8e8, border-top 3px solid govuk-blue,
    padding 24px, border-radius 2px.
    Card heading: govuk-black, font-weight 600, font-size 16px, margin-bottom 8px.
    Card body: govuk-dark-grey, font-size 14px, line-height 1.6.

--- SECTION 6: SECOND CTA ---
govuk-blue background, padding 64px 24px, text centred.
Heading (white, font-size 32px, font-weight 700): "See it in action"
Subtext (white, opacity 85%, font-size 18px, margin-top 12px, margin-bottom 40px):
  "Run a simulated council tax arrears call and see the full guided workflow,
  AI assistance, and transparency features."
Two buttons (same style as hero):
  Primary: "Launch Demo →" links to /app
  Secondary: "View system admin →" links to /admin

--- SECTION 7: FOOTER ---
govuk-black background, padding 40px 24px.
Max-width 1100px, margin auto. Two columns:
  Left: "CTCallCoach" in white, font-weight 700, font-size 16px.
    Below: govuk-mid-grey text, font-size 14px:
    "A Learning in the Flow of Work (LITFOW) proof of concept.
    Built for Acme City Council — a fictional local authority used for demonstration."
  Right: small links in govuk-mid-grey — "Launch Demo" (/app) · "Admin" (/admin)

After writing the component, run: cd apps/web && pnpm build
Fix all TypeScript errors. Do not change any backend files or workflow logic.
```

---

## PROMPT 6 — Final Verification and Demo Readiness Check

> Paste this entire block into Claude Code in Cursor.
> Expected time: 20–40 minutes.
> This is an audit and fix prompt — not a build prompt.
> Run it after all other prompts are done and the app is deployed to the live URL.

```
Read the entire docs/ folder before starting.
Read apps/web/src/App.tsx and apps/api/src/server/index.ts.

This is a verification and fix pass. Do not add new features.
Your job is to confirm every part of the product is wired correctly and fix
anything that is broken or missing.

STEP 1 — TypeScript build check (both apps)
Run: pnpm build (from repo root, or run each individually)
  cd apps/api && pnpm build
  cd apps/web && pnpm build
Fix every TypeScript error before proceeding. Do not suppress errors with
// @ts-ignore or casting to `any` unless there is no alternative — and if you
do use a cast, add a comment explaining why.

STEP 2 — Route completeness check
Verify the following routes exist and return non-error responses:

Backend (apps/api):
  POST   /sessions              → creates a session, returns session id
  GET    /scenarios             → returns list of available scenarios
  GET    /workflow/:id/next     → returns next question and workflow state
  POST   /workflow/respond      → records an answer, returns updated state
  POST   /workflow/override     → records an agent override
  GET    /support/:sessionId    → returns support options and escalation flags
  POST   /wrapup                → saves outcome and case note, closes session
  GET    /admin/versions        → returns active workflow/content versions
  GET    /admin/catalog         → returns escalation rules and support catalog
  GET    /ai/question-rationale → returns { rationale, learning_tip } or nulls
  POST   /ai/wrapup-summary     → returns { summary_text, suggested_next_step, flags, source }
  GET    /ai/coaching/:id       → returns coaching feedback or graceful null
  GET    /health                → returns { status: 'ok' }

If /health does not exist, create it in apps/api/src/server/index.ts:
  fastify.get('/health', async () => ({ status: 'ok' }));

Frontend (apps/web):
  /              → LandingPage
  /app           → ScenarioListPage
  /admin         → AdminPage
  /session/:id/intake   → CallIntakePage
  /session/:id/live     → LiveGuidancePage
  /session/:id/support  → SupportReviewPage
  /session/:id/wrap-up  → WrapUpPage

STEP 3 — Demo flow walkthrough check
Start both the API and web app locally. Run through this sequence and fix
anything that produces an error or broken UI:

1. Visit / — does the landing page render with govuk-blue hero and all sections?
2. Click "Launch Demo" — does it navigate to /app (ScenarioListPage)?
3. Select an agent and start a scenario — does it advance to /session/:id/intake?
4. Answer the intake question — does it auto-advance to /session/:id/live?
5. On the live guidance screen:
   - Does the stage progress strip show the current stage?
   - Does the question card display with the "why it matters" text?
   - After a few answers, does a classification badge appear?
   - Does a stage checkpoint card appear when advancing to the next stage?
   - Do guidance cards appear in the sidebar after classification?
   - Do guidance cards show "View source guidance →" links?
   - Does the answers panel in the sidebar accumulate responses?
6. Click "Support & Escalation Review" — does it show support options and decision trace?
7. Return and advance to wrap-up:
   - Does "Generate draft" populate the case note?
   - Does submitting the wrap-up show the "Call complete" screen?
   - Does the coaching feedback panel appear and expand?
8. Visit /admin — do all three sections (versions, escalation rules, catalog) populate?
9. Does the Ocelot positioning section appear at the bottom of /admin?

STEP 4 — Console and network error check
In the browser, open DevTools (F12) → Console tab.
Run through steps 3–8 again. Note every red error or yellow warning.
Fix all red errors (these are broken calls or missing imports).
Fix any 404 API errors (these mean a route is missing or misregistered).
CORS errors mean CORS_ALLOWED_ORIGINS is not set correctly — fix the config.

STEP 5 — Mobile layout check
In DevTools → Toggle device toolbar. Set width to 375px (iPhone SE).
Check these pages at mobile width:
  - Landing page: hero text should not overflow; CTAs should stack vertically
  - ScenarioListPage: cards should stack to full width
  - LiveGuidancePage: guidance sidebar may collapse to below the question — this is acceptable
  - WrapUpPage: form should be full width and usable

Fix any obvious overflow or truncation issues. Do not spend more than 30 minutes
on mobile layout polish — the product is primarily desktop-oriented for advisors
using workstations.

STEP 6 — Seed data confirmation
Run: cd apps/api && pnpm db:seed (if not already seeded locally)
Confirm: at least 3 scenarios appear on the ScenarioListPage.
Confirm: at least 2 agents are selectable in the agent picker.
If scenarios are missing, check the seed scripts in apps/api/prisma/seed/
and confirm they ran without error.

STEP 7 — Final build and summary
Run pnpm build from the repo root one final time.
Confirm: zero TypeScript errors. Zero unhandled promise rejections in the API startup log.
Report a summary of:
  - What was fixed in this pass
  - Any known issues that remain (and why they are acceptable for demo)
  - Confirmation that the product is demo-ready
```

---

## Quick reference: verification after each prompt

| Prompt | Primary check |
|--------|--------------|
| 1 — GDS UI | govuk-blue header appears on every page |
| 2 — AI layer | Question rationale shows under each question; "Generate draft" works |
| 3B — Ocelot UX | Stage checkpoint card appears between stages; answers panel fills |
| 4 — Deployment | `pnpm build` clean; vercel.json exists; Dockerfile exists |
| 5 — Landing page | / shows landing page; /app shows scenario list |
| 6 — Verification | Zero console errors on full demo run |

---

*Sequence aligned with BUILD_GUIDE.md — April 2026*
