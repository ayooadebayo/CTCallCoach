# CTCallCoach — Global Search Feature
## Cursor prompt to add search to the demo and admin views

This is a self-contained additive feature. Run it at any point — before or after
deployment. It does not change any routes, workflow logic, or database schema.
All search is client-side against data already loaded on the page.

---

## What this adds

**In the demo (ScenarioListPage at /app):**
A search bar that filters the visible scenario cards in real time as you type.
Matches against scenario title and description text.
Useful for demos with multiple scenarios — lets you jump to the right one instantly.

**In the admin view (/admin):**
A single search bar at the top of the page that filters across all three catalog
sections simultaneously — escalation rules, support options, and enquiry types.
Matches against rule codes, descriptions, labels, and category names.
Useful for investors and council leaders exploring "what does it know about X?"

---

## Cursor prompt — paste this entire block into Claude Code

```
Read apps/web/src/features/scenarios/ScenarioListPage.tsx,
apps/web/src/features/admin-demo/AdminPage.tsx, and
apps/web/src/components/AppHeader.tsx before starting.

Add a global search feature to two views. All search is client-side — filter
data that is already loaded. No new API routes. No database changes.
No changes to the workflow engine or session logic.

─────────────────────────────────────────────────────────────
PART 1 — Scenario search on ScenarioListPage (/app)
─────────────────────────────────────────────────────────────

Create apps/web/src/components/SearchBar.tsx.
Props:
  value: string
  onChange: (value: string) => void
  placeholder?: string
  resultCount?: number  (optional — shows "N results" when a query is active)

Render:
  A full-width input field with a search icon (🔍 or an SVG magnifier) on the left.
  Input: border 2px solid govuk-mid-grey (#b1b4b6), border-radius 2px, padding 10px 14px
    padding-left 40px (to make room for icon), font-size 16px, width 100%.
  Focus: border-color govuk-blue (#1d70b8), outline 3px solid govuk-yellow (#ffdd00),
    outline-offset 0.
  If value is not empty and resultCount is provided:
    Show a small govuk-dark-grey text below the input: "{resultCount} result(s)"
    If resultCount is 0: "No results for "{value}"" in govuk-red, font-size 14px.
  A clear (✕) button inside the right edge of the input when value is not empty.
    Clicking it calls onChange('').

In ScenarioListPage.tsx:
  Add state: searchQuery: string = ''
  Add the filtered list:
    const filteredScenarios = scenarios.filter(s =>
      searchQuery.trim() === '' ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  Place <SearchBar /> above the scenario cards grid, below the page heading.
    Pass value={searchQuery}, onChange={setSearchQuery},
    placeholder="Search scenarios...",
    resultCount={searchQuery.trim() ? filteredScenarios.length : undefined}
  Replace the scenario cards map from `scenarios.map` to `filteredScenarios.map`.
  If filteredScenarios.length === 0 and searchQuery is not empty:
    Show a centred grey message: "No scenarios match "{searchQuery}". Try a different term."
    with a "Clear search" link that calls setSearchQuery('').

─────────────────────────────────────────────────────────────
PART 2 — Catalog search on AdminPage (/admin)
─────────────────────────────────────────────────────────────

In AdminPage.tsx:
  Add state: adminSearchQuery: string = ''

  Add the filtered catalogs derived from the existing catalog state:

  const filteredEscalationRules = (catalog?.escalation_rules ?? []).filter(r =>
    adminSearchQuery.trim() === '' ||
    r.escalation_code?.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
    r.description?.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
    r.category?.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
    r.severity?.toLowerCase().includes(adminSearchQuery.toLowerCase())
  )

  const filteredSupportOptions = (catalog?.support_options ?? []).filter(o =>
    adminSearchQuery.trim() === '' ||
    o.label?.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
    o.description?.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
    o.source_domain?.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
    o.category?.toLowerCase().includes(adminSearchQuery.toLowerCase())
  )

  const filteredEnquiryTypes = (catalog?.enquiry_types ?? []).filter(e =>
    adminSearchQuery.trim() === '' ||
    e.code?.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
    e.label?.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
    e.description?.toLowerCase().includes(adminSearchQuery.toLowerCase())
  )

  Check the actual field names on the catalog response types — use the real field
  names from the AdminCatalogResponse type in shared-types or wherever it is defined.
  Adjust the filter field names above to match what actually exists.

  Place <SearchBar /> at the top of the admin page content area, below the page
  heading and version cards section, above the catalog sections.
    Pass value={adminSearchQuery}, onChange={setAdminSearchQuery},
    placeholder="Search rules, support options, enquiry types..."

  Replace all three catalog section maps to use the filtered versions:
    escalation_rules → filteredEscalationRules
    support_options  → filteredSupportOptions
    enquiry_types    → filteredEnquiryTypes

  For each section, when the filtered list is empty and a query is active:
    Show a small grey italic message inside that section:
    "No {section name} match this search."
    Do not hide the section heading — keep it visible so the user knows the
    section exists even when no results are showing.

  Add a total result count below the search bar when a query is active:
    const totalAdminResults = filteredEscalationRules.length
      + filteredSupportOptions.length
      + filteredEnquiryTypes.length
    Show: "{totalAdminResults} result(s) across all sections"
    If totalAdminResults === 0: "Nothing found for "{adminSearchQuery}"" in govuk-red.

─────────────────────────────────────────────────────────────
PART 3 — Highlight matched text (optional enhancement)
─────────────────────────────────────────────────────────────

If time allows, add a highlight helper:

Create apps/web/src/lib/highlight.tsx:
  export function HighlightMatch({
    text,
    query,
  }: {
    text: string;
    query: string;
  }): React.ReactElement {
    if (!query.trim()) return <>{text}</>;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part)
            ? <mark key={i} className="bg-govuk-yellow text-govuk-black px-0.5 rounded-sm">{part}</mark>
            : <span key={i}>{part}</span>
        )}
      </>
    );
  }

Use <HighlightMatch text={item.label} query={adminSearchQuery} /> in place of
plain text rendering for the label and description fields in the admin catalog
rows, and for scenario title/description in the scenario list.
Only apply this if Part 1 and Part 2 are working correctly first.

─────────────────────────────────────────────────────────────
After all parts, run: cd apps/web && pnpm build
Fix all TypeScript errors before finishing.
Do not change any backend files, API routes, or workflow engine files.
─────────────────────────────────────────────────────────────
```

---

## What to expect

**Time:** 20–35 minutes in Cursor.

**Files created:** `SearchBar.tsx`, optionally `highlight.tsx`

**Files modified:** `ScenarioListPage.tsx`, `AdminPage.tsx`

**Files not touched:** Everything in `apps/api/`, all workflow files, all page
components other than the two above.

## How to verify it worked

**Scenario search:**
1. Go to `/app` — a search bar should appear above the scenario cards
2. Type "arrears" — only scenarios with "arrears" in title or description should show
3. Clear the search — all scenarios reappear
4. Type something with no matches — "No scenarios match" message appears

**Admin search:**
1. Go to `/admin` — a search bar should appear above the catalog sections
2. Type "payment" — only escalation rules and support options containing "payment"
   should remain visible in their respective sections
3. Type a rule code (e.g. "ESC001" or whatever code exists) — it should surface
   that specific rule with all others hidden
4. The total result count below the search bar should update as you type
5. Clear the search — everything reappears

**Highlight (if implemented):**
The matched portion of text in each result should have a yellow background,
matching the govuk-yellow focus colour. It should not affect surrounding text.

---

## When to run this prompt

**Before deployment:** Run it as part of your remaining prompts (after 3B, before 4).
Add it between Prompt 3B and Prompt 4 in your CURSOR_PROMPTS.md sequence.

**After deployment:** Run it locally, verify it works, then `git push`.
Vercel and Railway will redeploy automatically. The live site updates within
2–3 minutes of the push.

Either approach is fine. The feature is purely additive and zero-risk.

---

*Global search feature — CTCallCoach LITFOW Project — April 2026*
