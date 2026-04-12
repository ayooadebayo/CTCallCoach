import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSession, getSupportOptions } from '../../lib/api';
import type { SessionDetailResponse, SupportOptionsResponse } from '../../lib/api';
import { PathBadge } from '../../components/PathBadge';
import { WarningBanner } from '../../components/WarningBanner';
import { StageProgress } from '../../components/StageProgress';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="rounded-md bg-red-50 border border-red-300 px-6 py-4 text-red-800 max-w-md">
          <p className="font-semibold mb-1">Error loading support review</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => navigate(`/session/${sessionId}/live`)}
            className="mt-3 text-sm underline"
          >
            ← Back to guidance
          </button>
        </div>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
        Loading…
      </div>
    );
  }

  const { session, workflow } = sessionData;

  // Sort escalations: critical → high → medium → low
  const sortedEscalations = [...workflow.escalationFlags].sort(
    (a, b) =>
      (SEVERITY_SORT[a.severity] ?? 9) - (SEVERITY_SORT[b.severity] ?? 9),
  );

  // Group support options by source_domain
  const policyOptions = (supportData?.support_options ?? []).filter(
    (o) => o.source_domain === 'public_policy',
  );
  const opsOptions = (supportData?.support_options ?? []).filter(
    (o) => o.source_domain === 'acme_operations',
  );
  const ungroupedOptions = (supportData?.support_options ?? []).filter(
    (o) => !o.source_domain,
  );

  // Trace: group decisions by type
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Support &amp; Escalation Review
            </span>
            <h1 className="text-base font-semibold text-gray-900 mt-0.5">
              {session.scenario?.title ?? 'Manual call'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <StageProgress currentStage={session.stage} />
            <button
              onClick={() => navigate(`/session/${sessionId}/live`)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
            >
              ← Back to guidance
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Classification summary */}
        <div className="rounded-lg bg-white border border-gray-200 px-4 py-3 flex items-center gap-3 flex-wrap text-sm">
          <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">
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
            <div className="mb-3 rounded bg-yellow-50 border border-yellow-300 px-3 py-2 text-xs text-yellow-800">
              Support option details unavailable — restart the API server to activate this route.
            </div>
          )}

          {/* Public policy options */}
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

          {/* Acme operations options */}
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

          {/* Options without a domain */}
          {ungroupedOptions.length > 0 && (
            <div className="space-y-2">
              {ungroupedOptions.map((o) => (
                <SupportOptionCard key={o.code} option={o} />
              ))}
            </div>
          )}
        </Section>

        {/* Decision trace */}
        <div className="rounded-lg bg-white border border-gray-200 overflow-hidden">
          <button
            onClick={() => setTraceExpanded((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-semibold text-gray-700">
              Workflow Decision Trace
            </span>
            <span className="text-xs text-gray-400">
              {traceExpanded ? '▲ Hide' : '▼ Show'} ({workflow.trace.decisions.length} rules evaluated)
            </span>
          </button>

          {traceExpanded && (
            <div className="border-t border-gray-100 px-4 pb-4 pt-2">
              {orderedTypes.map((type) => (
                <div key={type} className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    {type.replace(/_/g, ' ')}
                  </p>
                  <div className="space-y-1">
                    {(decisionsByType[type] ?? []).map((d) => (
                      <div
                        key={d.rule_code}
                        className={`rounded px-3 py-2 text-xs flex items-start gap-2 ${
                          d.triggered
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-gray-50 border border-gray-100 opacity-60'
                        }`}
                      >
                        <span className="flex-shrink-0 mt-0.5">
                          {d.triggered ? '✓' : '–'}
                        </span>
                        <div className="min-w-0">
                          <span className="font-mono font-medium">{d.rule_code}</span>
                          <span className="text-gray-500 ml-2">→ {d.result}</span>
                          <p className="text-gray-500 mt-0.5">{d.explanation}</p>
                          {d.trigger_facts.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {d.trigger_facts.map((f) => (
                                <span
                                  key={f}
                                  className="font-mono bg-white border border-gray-200 rounded px-1"
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
  return (
    <div
      className={`rounded-lg border bg-white px-4 py-4 ${
        highlight && count > 0 ? 'border-orange-300' : 'border-gray-200'
      }`}
    >
      <div className="flex items-baseline gap-2 mb-3">
        <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
        {count > 0 && (
          <span
            className={`text-xs font-medium rounded-full px-1.5 py-0.5 ${
              highlight ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {count}
          </span>
        )}
        {subtitle && (
          <span className="text-xs text-gray-400">{subtitle}</span>
        )}
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
      <span className={`text-xs rounded-full border px-2 py-0.5 font-medium ${color}`}>
        {label}
      </span>
      {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
    </div>
  );
}
