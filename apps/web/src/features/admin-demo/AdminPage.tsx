import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAdminVersions,
  getAdminCatalog,
} from '../../lib/api';
import type {
  AdminVersionsResponse,
  AdminCatalogResponse,
  AdminVersionEntry,
} from '../../lib/api';
import { AppHeader } from '../../components/AppHeader';

// ── severity colour helpers ───────────────────────────────────────────────────

const SEVERITY_COLOURS: Record<string, string> = {
  critical: 'bg-red-100 border border-red-300 text-red-800',
  high: 'bg-orange-100 border border-orange-300 text-orange-800',
  medium: 'bg-yellow-100 border border-yellow-300 text-yellow-800',
  low: 'bg-sky-100 border border-sky-300 text-sky-800',
};

const DOMAIN_BADGE: Record<string, string> = {
  public_policy: 'bg-sky-50 border-sky-300 text-sky-800',
  acme_operations: 'bg-amber-50 border-amber-300 text-amber-800',
};

const DOMAIN_LABEL: Record<string, string> = {
  public_policy: 'Public Policy',
  acme_operations: 'Acme Ops',
};

// ── sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold text-govuk-black">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-sm border border-govuk-mid-grey bg-white px-5 py-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function VersionRow({ entry, label }: { entry: AdminVersionEntry; label: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-govuk-mid-grey last:border-0 flex-wrap">
      <span className="text-xs font-bold text-gray-500 uppercase tracking-wide w-36 flex-shrink-0">
        {label}
      </span>
      <span className="font-mono text-sm font-semibold text-govuk-black">{entry.version_label}</span>
      <span className="text-xs rounded-full px-2 py-0.5 border font-bold bg-govuk-green text-white border-govuk-green">
        {entry.status}
      </span>
      {entry.description && (
        <span className="text-xs text-gray-500 flex-1 min-w-0 truncate">{entry.description}</span>
      )}
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-sm border border-govuk-mid-grey bg-white px-4 py-3 text-center shadow-sm">
      <p className="text-2xl font-bold text-govuk-blue">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5 font-medium">{label}</p>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────

export function AdminPage() {
  const navigate = useNavigate();

  const [versions, setVersions] = useState<AdminVersionsResponse | null>(null);
  const [catalog, setCatalog] = useState<AdminCatalogResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminVersions(), getAdminCatalog()])
      .then(([v, c]) => {
        setVersions(v);
        setCatalog(c);
      })
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-govuk-light-grey flex items-center justify-center text-gray-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-govuk-light-grey">
      <AppHeader
        pageTitle="Admin / Demo Transparency"
        right={
          <button
            onClick={() => navigate('/app')}
            className="text-sm text-blue-200 hover:text-white font-medium focus:outline-none focus:ring-2 focus:ring-govuk-yellow"
          >
            ← Scenarios
          </button>
        }
      />

      {/* Page title strip */}
      <div className="bg-white border-b border-govuk-mid-grey">
        <div className="max-w-5xl mx-auto px-4 py-3 sm:px-6 flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              System Transparency View
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Read-only. Shows the internal logic of CTCallCoach — for technical and investor audiences.
            </p>
          </div>
          <span className="text-xs rounded-full border border-govuk-green bg-green-50 text-govuk-green font-bold px-3 py-1">
            No login required
          </span>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8 sm:px-6">

        {error && (
          <div className="rounded-sm border border-govuk-mid-grey border-l-4 border-l-govuk-red bg-red-50 px-4 py-3 text-sm text-govuk-black">
            <p className="font-bold text-govuk-red mb-1">Error loading admin data</p>
            {error}
          </div>
        )}

        {/* ── 1. Active Versions ─────────────────────────────────────────── */}
        <section>
          <SectionHeader
            title="Active Versions"
            subtitle="Currently loaded workflow, content, and prompt versions"
          />
          <Card>
            {versions ? (
              <div>
                {versions.workflow_versions.map((v) => (
                  <VersionRow key={v.id} entry={v} label="Workflow" />
                ))}
                {versions.content_versions.map((v) => (
                  <VersionRow key={v.id} entry={v} label="Content" />
                ))}
                {versions.prompt_versions.map((v) => (
                  <VersionRow key={v.id} entry={v} label="Prompts" />
                ))}
                {versions.workflow_versions.length === 0 &&
                  versions.content_versions.length === 0 &&
                  versions.prompt_versions.length === 0 && (
                    <p className="text-sm text-gray-400 italic">
                      No active versions found — run the database seed.
                    </p>
                  )}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">Unavailable.</p>
            )}
          </Card>
        </section>

        {/* ── 2. Catalog stats ───────────────────────────────────────────── */}
        {catalog && (
          <section>
            <SectionHeader title="Catalog at a Glance" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatPill label="Active scenarios" value={catalog.scenario_count} />
              <StatPill label="Enquiry types" value={catalog.enquiry_types.length} />
              <StatPill label="Escalation rules" value={catalog.escalation_rules.length} />
              <StatPill label="Support options" value={catalog.support_options.length} />
            </div>
          </section>
        )}

        {/* ── 3. Enquiry Types ───────────────────────────────────────────── */}
        {catalog && (
          <section>
            <SectionHeader
              title="Enquiry Types"
              subtitle="Classification paths the workflow engine can assign to a call"
            />
            <Card className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-sm">
                  <thead>
                    <tr className="bg-govuk-light-grey border-b border-govuk-mid-grey">
                      <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Code</th>
                      <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Label</th>
                      <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Category</th>
                      <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Overlay?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {catalog.enquiry_types.map((et) => (
                      <tr key={et.id} className="border-b border-govuk-mid-grey last:border-0 hover:bg-govuk-light-grey">
                        <td className="px-4 py-2.5 font-mono text-xs font-semibold text-govuk-black">{et.code}</td>
                        <td className="px-4 py-2.5 font-semibold text-govuk-black">{et.label}</td>
                        <td className="px-4 py-2.5 text-gray-500 text-xs">{et.category ?? '—'}</td>
                        <td className="px-4 py-2.5">
                          {et.is_overlay ? (
                            <span className="text-xs font-bold rounded-full px-2 py-0.5 bg-govuk-blue text-white">
                              Overlay
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">Primary</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {catalog.enquiry_types.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-4 text-sm text-gray-400 italic">
                          No enquiry types seeded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        )}

        {/* ── 4. Escalation Rules ────────────────────────────────────────── */}
        {catalog && (
          <section>
            <SectionHeader
              title="Escalation Rules"
              subtitle="Conditions that trigger mandatory escalation flags during a call"
            />
            <div className="space-y-3">
              {catalog.escalation_rules.map((r) => (
                <Card key={r.rule_code} className={`border-l-4 ${
                  r.severity === 'critical' ? 'border-l-govuk-red' :
                  r.severity === 'high' ? 'border-l-govuk-orange' :
                  r.severity === 'medium' ? 'border-l-govuk-yellow' :
                  'border-l-govuk-blue'
                }`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-xs font-bold text-govuk-black">{r.rule_code}</span>
                      <span className="font-mono text-xs text-gray-500">{r.escalation_code}</span>
                      <span className={`text-xs font-bold rounded-full px-2 py-0.5 border ${SEVERITY_COLOURS[r.severity] ?? 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                        {r.severity}
                      </span>
                    </div>
                    <p className="text-sm text-govuk-black">{r.description}</p>
                    {r.trigger_condition_keys.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-xs text-gray-500 font-medium">Trigger conditions:</span>
                        {r.trigger_condition_keys.map((k) => (
                          <span
                            key={k}
                            className="font-mono text-xs bg-govuk-light-grey border border-govuk-mid-grey rounded-sm px-1.5 py-0.5 text-govuk-black"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
              {catalog.escalation_rules.length === 0 && (
                <p className="text-sm text-gray-400 italic">No escalation rules defined.</p>
              )}
            </div>
          </section>
        )}

        {/* ── 5. Support Options ─────────────────────────────────────────── */}
        {catalog && (
          <section>
            <SectionHeader
              title="Support Options"
              subtitle="Options surfaced by the workflow engine when trigger conditions are met"
            />
            <div className="space-y-2">
              {catalog.support_options.map((o) => (
                <div
                  key={o.code}
                  className="rounded-sm border border-govuk-mid-grey bg-white px-4 py-3 shadow-sm flex items-start gap-3 flex-wrap"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-mono text-xs font-semibold text-govuk-black">{o.code}</span>
                      {o.source_domain && (
                        <span className={`text-xs font-bold rounded-full border px-2 py-0.5 ${DOMAIN_BADGE[o.source_domain] ?? 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                          {DOMAIN_LABEL[o.source_domain] ?? o.source_domain}
                        </span>
                      )}
                      {o.requires_specialist_follow_up && (
                        <span className="text-xs font-bold rounded-full border border-govuk-red text-govuk-red px-2 py-0.5 bg-red-50">
                          Specialist required
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-govuk-black font-semibold">{o.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{o.category}</p>
                  </div>
                </div>
              ))}
              {catalog.support_options.length === 0 && (
                <p className="text-sm text-gray-400 italic">No support options in content bundle.</p>
              )}
            </div>
          </section>
        )}

        {/* ── 6. About This System ───────────────────────────────────────── */}
        <section>
          <SectionHeader
            title="About This System"
            subtitle="Architecture and design principles"
          />
          <Card>
            <div className="space-y-4 text-sm text-govuk-black">
              <AboutRow label="Product">
                CTCallCoach — a council tax call coaching tool for frontline advisors handling
                payment difficulty and arrears calls.
              </AboutRow>
              <AboutRow label="Architecture">
                Monorepo (pnpm workspaces): React + Vite frontend, Fastify + Prisma + PostgreSQL
                backend, shared-types, shared-schemas, workflow-config, and content-bundles packages.
              </AboutRow>
              <AboutRow label="Workflow engine">
                Rules-based engine evaluating question responses against JSON rule files.
                Classification, path determination, support triggers, and escalation triggers are all
                data-driven — no hardcoded logic in route handlers.
              </AboutRow>
              <AboutRow label="Content separation">
                Public policy guidance (statutory/regulatory) is stored and served separately from
                Acme operational procedures. Each content item carries a{' '}
                <code className="font-mono text-xs bg-govuk-light-grey px-1">source_domain</code> tag.
              </AboutRow>
              <AboutRow label="AI layer">
                Optional OpenAI gpt-4o-mini integration. Three narrow tasks: question rationale
                (contextual coaching tip per question), wrap-up draft (AI-generated case note), and
                post-call coaching feedback. All AI responses are schema-validated (Zod). All AI
                features degrade gracefully to null / template fallback when the API key is absent.
              </AboutRow>
              <AboutRow label="No live telephony">
                This MVP does not include live audio or telephony integration. All calls are
                simulated via scenario replays and manual sessions.
              </AboutRow>
            </div>
          </Card>
        </section>

        {/* ── 7. How this relates to Ocelot-style guidance ──────────────── */}
        <section>
          <SectionHeader
            title="How this relates to Ocelot-style guidance"
          />
          <Card>
            <div
              className="space-y-4 text-sm text-govuk-black leading-relaxed text-gray-700"
              style={{ borderLeft: '4px solid #1d70b8', paddingLeft: '24px' }}
            >
              <p>
                Ocelot is HMRC's interactive guidance delivery platform — the system behind CEST
                (Check Employment Status for Tax) and other task-based tools used across central
                government. It embodies a UX philosophy: one question at a time, explicit stage
                outcomes, reviewable answers at each checkpoint, and transparent links to the
                underlying policy that drives each recommendation.
              </p>
              <p>
                CTCallCoach applies the same philosophy to a contact centre context. The guided
                question sequence surfaces one decision at a time during a live call. Stage
                checkpoint cards summarise what has been established before the workflow advances.
                The answers panel lets the advisor review the full call record in one glance without
                leaving the screen. Guidance cards link directly to the GOV.UK manual pages and
                fictional internal operating guidance that underpin each recommendation.
              </p>
              <p>
                The key difference from Ocelot is the operational layer. CTCallCoach serves a call
                advisor navigating a live resident interaction under time pressure, not a
                self-service user completing a tax status check at their own pace. The pacing,
                language, and layout are tuned for speed and confidence under call conditions. The
                underlying philosophy — structured, transparent, auditable, policy-grounded — is
                the same.
              </p>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}

function AboutRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 border-b border-govuk-mid-grey pb-4 last:border-0 last:pb-0 flex-wrap">
      <span className="text-xs font-bold text-gray-500 uppercase tracking-wide w-36 flex-shrink-0 mt-0.5">
        {label}
      </span>
      <div className="flex-1 min-w-0 leading-relaxed text-gray-700">{children}</div>
    </div>
  );
}
