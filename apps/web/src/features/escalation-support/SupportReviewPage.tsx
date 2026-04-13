import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSession, getSupportOptions } from '../../lib/api';
import type { SessionDetailResponse, SupportOptionsResponse } from '../../lib/api';
import { PathBadge } from '../../components/PathBadge';
import { WarningBanner } from '../../components/WarningBanner';
import { StageProgress } from '../../components/StageProgress';
import { AppHeader } from '../../components/AppHeader';
import { SessionNav } from '../../components/SessionNav';
import { EscalationFlagCard, SEVERITY_SORT } from '../../components/EscalationFlagCard';
import { SupportOptionCard } from '../../components/SupportOptionCard';
import {
  CLASSIFICATION_STATUS_LABELS,
  SOURCE_DOMAIN_LABEL,
  SOURCE_DOMAIN_COLORS,
} from '../../lib/labels';
import type { WorkflowEscalationFlag } from '@ctcc/shared-types';

export function SupportReviewPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [sessionData, setSessionData] = useState<SessionDetailResponse | null>(null);
  const [supportData, setSupportData] = useState<SupportOptionsResponse | null>(null);
  const [supportUnavailable, setSupportUnavailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [traceExpanded, setTraceExpanded] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    const load = async () => {
      const [sessionResult, supportResult] = await Promise.allSettled([
        getSession(sessionId),
        getSupportOptions(sessionId),
      ]);

      if (sessionResult.status === 'rejected') {
        setError(String(sessionResult.reason));
        return;
      }
      setSessionData(sessionResult.value);

      if (supportResult.status === 'fulfilled') {
        setSupportData(supportResult.value);
      } else {
        setSupportData({ support_options: [] });
        setSupportUnavailable(true);
      }
    };
    load().catch((e: unknown) => setError(String(e)));
  }, [sessionId]);

  if (error) {
    return (
      <div className="min-h-screen bg-govuk-light-grey flex items-center justify-center">
        <div className="rounded-sm border border-govuk-mid-grey border-l-4 border-l-govuk-red bg-red-50 px-6 py-4 text-govuk-black max-w-md">
          <p className="font-bold text-govuk-red mb-1">Error loading support review</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => navigate(`/session/${sessionId}/live`)}
            className="mt-3 text-sm text-govuk-blue hover:text-govuk-blue-dark underline"
          >
            ← Back to guidance
          </button>
        </div>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-govuk-light-grey flex items-center justify-center text-gray-500">
        Loading…
      </div>
    );
  }

  const { session, workflow } = sessionData;

  const sortedEscalations = [...workflow.escalationFlags].sort(
    (a, b) => (SEVERITY_SORT[a.severity] ?? 9) - (SEVERITY_SORT[b.severity] ?? 9),
  );

  const policyOptions = (supportData?.support_options ?? []).filter(
    (o) => o.source_domain === 'public_policy',
  );
  const opsOptions = (supportData?.support_options ?? []).filter(
    (o) => o.source_domain === 'acme_operations',
  );
  const ungroupedOptions = (supportData?.support_options ?? []).filter(
    (o) => !o.source_domain,
  );

  const decisionsByType = workflow.trace.decisions.reduce<
    Record<string, typeof workflow.trace.decisions>
  >((acc, d) => {
    const group = acc[d.decision_type] ?? [];
    group.push(d);
    acc[d.decision_type] = group;
    return acc;
  }, {});

  const typeOrder = ['classification', 'support_trigger', 'escalation_trigger'];
  const orderedTypes = [
    ...typeOrder.filter((t) => decisionsByType[t]),
    ...Object.keys(decisionsByType).filter((t) => !typeOrder.includes(t)),
  ];

  return (
    <div className="min-h-screen bg-govuk-light-grey">
      <AppHeader
        pageTitle={session.scenario?.title ?? 'Manual call'}
        right={
          <div className="flex items-center gap-4">
            <StageProgress currentStage={session.stage} />
            <button
              onClick={() => navigate(`/session/${sessionId}/live`)}
              className="text-sm text-blue-200 hover:text-white font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-govuk-yellow"
            >
              ← Back to guidance
            </button>
          </div>
        }
      />

      {sessionId && <SessionNav sessionId={sessionId} current="support" />}

      {/* Page title strip */}
      <div className="bg-white border-b border-govuk-mid-grey">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Support &amp; Escalation Review
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-6 space-y-5">
        {/* Classification summary */}
        <div className="rounded-sm border border-govuk-mid-grey bg-white px-4 py-3 flex items-center gap-3 flex-wrap shadow-sm text-sm">
          <span className="text-gray-500 text-xs font-bold uppercase tracking-wide">
            Classification
          </span>
          <span className="text-xs text-gray-400">
            ({CLASSIFICATION_STATUS_LABELS[workflow.classificationStatus] ?? workflow.classificationStatus})
          </span>
          {workflow.primaryPath ? (
            <PathBadge code={workflow.primaryPath} variant="primary" />
          ) : (
            <span className="text-sm text-gray-400 italic">Not yet classified</span>
          )}
          {workflow.overlayPaths.map((p) => (
            <PathBadge key={p} code={p} variant="overlay" />
          ))}
        </div>

        {/* Active warnings */}
        <Section
          title="Active Warnings"
          count={workflow.warnings.length}
          emptyText="No warnings active at current stage."
        >
          <WarningBanner warnings={workflow.warnings} />
        </Section>

        {/* Escalation flags */}
        <Section
          title="Escalation Flags"
          count={sortedEscalations.length}
          emptyText="No escalation flags triggered."
          highlight={sortedEscalations.length > 0}
        >
          <div className="space-y-2">
            {sortedEscalations.map((f: WorkflowEscalationFlag) => (
              <EscalationFlagCard key={f.code} flag={f} />
            ))}
          </div>
        </Section>

        {/* Support options */}
        <Section
          title="Support Options"
          subtitle="Surfaced by workflow engine for current call state"
          count={(supportData?.support_options ?? []).length}
          emptyText="No support options triggered at current stage."
        >
          {supportUnavailable && (
            <div className="mb-3 rounded-sm border-l-4 border-l-govuk-orange bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-govuk-black">
              Support option details unavailable — restart the API server to activate this route.
            </div>
          )}

          {policyOptions.length > 0 && (
            <div className="mb-4">
              <DomainHeading domain="public_policy" />
              <div className="space-y-2">
                {policyOptions.map((o) => (
                  <SupportOptionCard key={o.code} option={o} />
                ))}
              </div>
            </div>
          )}

          {opsOptions.length > 0 && (
            <div className="mb-4">
              <DomainHeading domain="acme_operations" />
              <div className="space-y-2">
                {opsOptions.map((o) => (
                  <SupportOptionCard key={o.code} option={o} />
                ))}
              </div>
            </div>
          )}

          {ungroupedOptions.length > 0 && (
            <div className="space-y-2">
              {ungroupedOptions.map((o) => (
                <SupportOptionCard key={o.code} option={o} />
              ))}
            </div>
          )}
        </Section>

        {/* Decision trace */}
        <div className="rounded-sm border border-govuk-mid-grey bg-white shadow-sm overflow-hidden">
          <button
            onClick={() => setTraceExpanded((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-govuk-light-grey focus:outline-none focus:ring-4 focus:ring-govuk-yellow"
          >
            <span className="text-sm font-bold text-govuk-black">
              Workflow Decision Trace
            </span>
            <span className="text-xs text-gray-500">
              {traceExpanded ? '▲ Hide' : '▼ Show'} ({workflow.trace.decisions.length} rules evaluated)
            </span>
          </button>

          {traceExpanded && (
            <div className="border-t border-govuk-mid-grey px-4 pb-4 pt-3">
              {orderedTypes.map((type) => (
                <div key={type} className="mb-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    {type.replace(/_/g, ' ')}
                  </p>
                  <div className="space-y-1">
                    {(decisionsByType[type] ?? []).map((d) => (
                      <div
                        key={d.rule_code}
                        className={`rounded-sm px-3 py-2 text-xs flex items-start gap-2 ${
                          d.triggered
                            ? 'border-l-4 border-l-govuk-green bg-green-50'
                            : 'bg-govuk-light-grey border border-govuk-mid-grey opacity-60'
                        }`}
                      >
                        <span className={`flex-shrink-0 mt-0.5 font-bold ${d.triggered ? 'text-govuk-green' : 'text-gray-400'}`}>
                          {d.triggered ? '✓' : '–'}
                        </span>
                        <div className="min-w-0">
                          <span className="font-mono font-semibold text-govuk-black">{d.rule_code}</span>
                          <span className="text-gray-500 ml-2">→ {d.result}</span>
                          <p className="text-gray-500 mt-0.5">{d.explanation}</p>
                          {d.trigger_facts.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {d.trigger_facts.map((f) => (
                                <span
                                  key={f}
                                  className="font-mono bg-white border border-govuk-mid-grey rounded-sm px-1"
                                >
                                  {f}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-400 mt-2">
                Evaluated at {workflow.trace.evaluated_at}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── Local sub-components ─────────────────────────────────────────────────────

function Section({
  title,
  subtitle,
  count,
  emptyText,
  highlight = false,
  children,
}: {
  title: string;
  subtitle?: string;
  count: number;
  emptyText: string;
  highlight?: boolean;
  children?: React.ReactNode;
}) {
  const highlightBorder = highlight && count > 0 ? 'border-l-4 border-l-govuk-red' : '';
  return (
    <div
      className={`rounded-sm border border-govuk-mid-grey bg-white px-4 py-4 shadow-sm ${highlightBorder}`}
    >
      <div className="flex items-baseline gap-2 mb-3">
        <h2 className="text-sm font-bold text-govuk-black">{title}</h2>
        {count > 0 && (
          <span
            className={`text-xs font-bold rounded-full px-2 py-0.5 ${
              highlight ? 'bg-govuk-red text-white' : 'bg-govuk-light-grey text-gray-700 border border-govuk-mid-grey'
            }`}
          >
            {count}
          </span>
        )}
        {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
      </div>
      {count === 0 ? (
        <p className="text-sm text-gray-400 italic">{emptyText}</p>
      ) : (
        children
      )}
    </div>
  );
}

function DomainHeading({ domain }: { domain: string }) {
  const color = SOURCE_DOMAIN_COLORS[domain] ?? 'bg-gray-50 border-gray-300 text-gray-700';
  const label = SOURCE_DOMAIN_LABEL[domain] ?? domain;
  const subtitle =
    domain === 'public_policy'
      ? 'Statutory / regulatory guidance'
      : domain === 'acme_operations'
        ? 'Acme-specific procedures'
        : '';

  return (
    <div className="flex items-center gap-2 mb-2">
      <span className={`text-xs rounded-full border px-2.5 py-0.5 font-bold ${color}`}>
        {label}
      </span>
      {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
    </div>
  );
}
