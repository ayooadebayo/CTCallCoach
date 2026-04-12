import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSession, submitResponse, advanceStage, getGuidance } from '../../lib/api';
import type { SessionDetailResponse, GuidanceResponse, SubmitResponseBody } from '../../lib/api';
import { QuestionCard } from '../../components/QuestionCard';
import { PathBadge } from '../../components/PathBadge';
import { WarningBanner } from '../../components/WarningBanner';
import { StageProgress } from '../../components/StageProgress';
import { STAGE_LABELS, SUPPORT_OPTION_CODE_LABELS, SOURCE_DOMAIN_COLORS, SOURCE_DOMAIN_LABEL } from '../../lib/labels';
import type { WorkflowQuestion } from '@ctcc/shared-types';

// Stage order for advancement.
const STAGE_PROGRESSION: Record<string, string> = {
  classification: 'fact_gathering',
  fact_gathering: 'path_determination',
  path_determination: 'support_and_explanation',
  support_and_explanation: 'wrap_up',
};

export function LiveGuidancePage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<SessionDetailResponse | null>(null);
  const [guidance, setGuidance] = useState<GuidanceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [advancing, setAdvancing] = useState(false);

  const load = useCallback(async () => {
    if (!sessionId) return;
    const result = await getSession(sessionId);
    setData(result);

    // Load guidance cards for active paths.
    const paths: string[] = [];
    if (result.workflow.primaryPath) paths.push(result.workflow.primaryPath);
    result.workflow.overlayPaths.forEach((p) => paths.push(p));
    if (paths.length > 0) {
      try {
        const g = await getGuidance(paths);
        setGuidance(g);
      } catch {
        // Guidance cards are non-critical — show nothing if they fail.
      }
    } else {
      setGuidance(null);
    }
  }, [sessionId]);

  useEffect(() => {
    load().catch((e: unknown) => setError(String(e)));
  }, [load]);

  // Redirect to wrap-up when stage reaches wrap_up.
  useEffect(() => {
    if (data?.session.stage === 'wrap_up') {
      navigate(`/session/${sessionId}/wrap-up`, { replace: true });
    }
    if (data?.session.stage === 'closed') {
      navigate('/', { replace: true });
    }
  }, [data, sessionId, navigate]);

  async function handleAnswer(
    question: WorkflowQuestion,
    value: { answer_text?: string; answer_boolean?: boolean; answer_number?: number },
  ) {
    if (!sessionId) return;
    setSubmitting(true);
    try {
      const body: SubmitResponseBody = {
        call_session_id: sessionId,
        question_code: question.code,
        response_status: 'answered',
        source: 'agent_input',
        ...value,
      };
      await submitResponse(body);
      await load();
    } catch (e: unknown) {
      setError(String(e));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAdvanceStage() {
    if (!sessionId || !data) return;
    const currentStage = data.session.stage;
    const nextStage = STAGE_PROGRESSION[currentStage];
    if (!nextStage) return;
    setAdvancing(true);
    try {
      await advanceStage(sessionId, nextStage);
      await load();
    } catch (e: unknown) {
      setError(String(e));
    } finally {
      setAdvancing(false);
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="rounded-md bg-red-50 border border-red-300 px-6 py-4 text-red-800 max-w-md">
          <p className="font-semibold mb-1">Error</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => { setError(null); load().catch(() => undefined); }}
            className="mt-3 text-sm underline text-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
        Loading…
      </div>
    );
  }

  const { session, workflow } = data;
  const nextQuestion = workflow.nextRequiredQuestion;
  const canAdvance = !nextQuestion && !!STAGE_PROGRESSION[session.stage];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Live Guidance
            </span>
            <h1 className="text-base font-semibold text-gray-900 mt-0.5">
              {session.scenario?.title ?? 'Manual call'}
            </h1>
          </div>
          <StageProgress currentStage={session.stage} />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-3 gap-6">
        {/* Main column */}
        <div className="col-span-2 space-y-5">
          {/* Classification status */}
          <div className="rounded-lg bg-white border border-gray-200 p-4">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Classification
              </span>
              <span className="text-xs text-gray-400">({workflow.classificationStatus})</span>
              <span className="text-xs text-gray-500">
                Stage: <strong>{STAGE_LABELS[session.stage] ?? session.stage}</strong>
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {workflow.primaryPath ? (
                <PathBadge code={workflow.primaryPath} variant="primary" />
              ) : (
                <span className="text-sm text-gray-400 italic">Not yet classified</span>
              )}
              {workflow.overlayPaths.map((p) => (
                <PathBadge key={p} code={p} variant="overlay" />
              ))}
            </div>
          </div>

          {/* Warnings & escalations */}
          <WarningBanner
            warnings={workflow.warnings}
            escalationFlags={workflow.escalationFlags}
          />

          {/* Next question */}
          {nextQuestion ? (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">
                {STAGE_LABELS[nextQuestion.stage] ?? nextQuestion.stage} question
              </p>
              <QuestionCard
                question={nextQuestion}
                onSubmit={(v) => handleAnswer(nextQuestion, v)}
                submitting={submitting}
              />
            </div>
          ) : canAdvance ? (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">
                  All {STAGE_LABELS[session.stage] ?? session.stage} questions answered
                </p>
                <p className="text-xs text-blue-600 mt-0.5">
                  Ready to advance to{' '}
                  <strong>
                    {STAGE_LABELS[STAGE_PROGRESSION[session.stage] ?? ''] ?? STAGE_PROGRESSION[session.stage]}
                  </strong>
                </p>
              </div>
              <button
                onClick={handleAdvanceStage}
                disabled={advancing}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {advancing ? 'Advancing…' : 'Next Stage →'}
              </button>
            </div>
          ) : null}

          {/* Support options */}
          {workflow.supportOptions.length > 0 && (
            <div className="rounded-lg bg-white border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Support options triggered
                </p>
                <button
                  onClick={() => navigate(`/session/${sessionId}/support`)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
                >
                  Support &amp; Escalation Review →
                </button>
              </div>
              <div className="space-y-1.5">
                {workflow.supportOptions.map((code) => (
                  <div
                    key={code}
                    className="flex items-center gap-2 text-xs bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-md px-3 py-1.5"
                  >
                    <span className="font-medium">
                      {SUPPORT_OPTION_CODE_LABELS[code] ?? code.replace(/_/g, ' ')}
                    </span>
                    <span className="text-indigo-400 font-mono text-xs opacity-70">{code}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar — guidance cards */}
        <aside className="col-span-1 space-y-4">
          {guidance && (guidance.public_policy.length > 0 || guidance.acme_operations.length > 0) ? (
            <>
              {guidance.public_policy.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <p className="text-xs font-semibold text-sky-700 uppercase tracking-wide">
                      Policy guidance
                    </p>
                    <span className="text-xs text-gray-400">Statutory / regulatory</span>
                  </div>
                  <div className="space-y-3">
                    {guidance.public_policy.map((c) => (
                      <GuidanceCardWidget key={c.code} card={c} />
                    ))}
                  </div>
                </div>
              )}
              {guidance.acme_operations.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                      Operations guidance
                    </p>
                    <span className="text-xs text-gray-400">Acme-specific</span>
                  </div>
                  <div className="space-y-3">
                    {guidance.acme_operations.map((c) => (
                      <GuidanceCardWidget key={c.code} card={c} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-xs text-gray-400 italic">
              {workflow.primaryPath
                ? 'No guidance cards matched current path.'
                : 'Guidance cards will appear once classification is established.'}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

// ─── Inline guidance card widget ─────────────────────────────────────────────

interface GuidanceCardData {
  code: string;
  title: string;
  summary: string;
  source_domain?: string;
  do_say_text?: string;
  do_not_say_text?: string;
  warning_text?: string;
}

function GuidanceCardWidget({ card }: { card: GuidanceCardData }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-md border border-gray-200 bg-white text-sm shadow-sm">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-3 py-2.5 flex items-center justify-between gap-2"
      >
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          <span className="font-medium text-gray-800 text-xs leading-snug">{card.title}</span>
          {card.source_domain && (
            <span className={`text-xs rounded-full border px-1.5 py-0.5 flex-shrink-0 ${SOURCE_DOMAIN_COLORS[card.source_domain] ?? 'bg-gray-50 border-gray-300 text-gray-700'}`}>
              {SOURCE_DOMAIN_LABEL[card.source_domain] ?? card.source_domain}
            </span>
          )}
        </div>
        <span className="text-gray-400 text-xs flex-shrink-0">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-gray-100 pt-2">
          <p className="text-xs text-gray-600">{card.summary}</p>
          {card.warning_text && (
            <p className="text-xs text-red-700 bg-red-50 rounded px-2 py-1 border border-red-200">
              <strong>⚠ </strong>
              {card.warning_text}
            </p>
          )}
          {card.do_say_text && (
            <div>
              <p className="text-xs font-semibold text-green-700 mb-0.5">Do say:</p>
              <p className="text-xs text-gray-700 italic">"{card.do_say_text}"</p>
            </div>
          )}
          {card.do_not_say_text && (
            <div>
              <p className="text-xs font-semibold text-red-700 mb-0.5">Do not say:</p>
              <p className="text-xs text-gray-700 italic">"{card.do_not_say_text}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
