import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getSession,
  submitResponse,
  advanceStage,
  getGuidance,
  getQuestionRationale,
} from '../../lib/api';
import type {
  SessionDetailResponse,
  GuidanceResponse,
  SubmitResponseBody,
  QuestionRationaleResponse,
} from '../../lib/api';
import { QuestionCard } from '../../components/QuestionCard';
import { PathBadge } from '../../components/PathBadge';
import { WarningBanner } from '../../components/WarningBanner';
import { StageProgress } from '../../components/StageProgress';
import { AppHeader } from '../../components/AppHeader';
import { SessionNav } from '../../components/SessionNav';
import {
  STAGE_LABELS,
  SUPPORT_OPTION_CODE_LABELS,
  SOURCE_DOMAIN_COLORS,
  SOURCE_DOMAIN_LABEL,
} from '../../lib/labels';
import type { WorkflowQuestion } from '@ctcc/shared-types';

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

  // AI question rationale — fetched fire-and-forget when question changes
  const [aiRationale, setAiRationale] = useState<QuestionRationaleResponse | null>(null);

  const load = useCallback(async () => {
    if (!sessionId) return;
    const result = await getSession(sessionId);
    setData(result);

    const paths: string[] = [];
    if (result.workflow.primaryPath) paths.push(result.workflow.primaryPath);
    result.workflow.overlayPaths.forEach((p) => paths.push(p));
    if (paths.length > 0) {
      try {
        const g = await getGuidance(paths);
        setGuidance(g);
      } catch {
        // Guidance cards are non-critical.
      }
    } else {
      setGuidance(null);
    }
  }, [sessionId]);

  useEffect(() => {
    load().catch((e: unknown) => setError(String(e)));
  }, [load]);

  // Fetch AI rationale when the next question changes.
  useEffect(() => {
    if (!sessionId || !data?.workflow.nextRequiredQuestion) {
      setAiRationale(null);
      return;
    }
    const code = data.workflow.nextRequiredQuestion.code;
    // Fire-and-forget — does not block question rendering.
    getQuestionRationale(code, sessionId)
      .then((r) => setAiRationale(r))
      .catch(() => setAiRationale(null));
  }, [sessionId, data?.workflow.nextRequiredQuestion?.code]);

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
    setAiRationale(null); // clear stale rationale immediately
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
      <div className="min-h-screen bg-govuk-light-grey flex items-center justify-center">
        <div className="rounded-sm border border-govuk-mid-grey border-l-4 border-l-govuk-red bg-red-50 px-6 py-4 text-govuk-black max-w-md">
          <p className="font-bold text-govuk-red mb-1">Error</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => { setError(null); load().catch(() => undefined); }}
            className="mt-3 text-sm text-govuk-blue hover:text-govuk-blue-dark underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-govuk-light-grey flex items-center justify-center text-gray-500">
        Loading…
      </div>
    );
  }

  const { session, workflow } = data;
  const nextQuestion = workflow.nextRequiredQuestion;
  const canAdvance = !nextQuestion && !!STAGE_PROGRESSION[session.stage];

  return (
    <div className="min-h-screen bg-govuk-light-grey">
      <AppHeader
        pageTitle={session.scenario?.title ?? 'Manual call'}
        right={<StageProgress currentStage={session.stage} />}
      />
      {sessionId && <SessionNav sessionId={sessionId} current="live" />}

      <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-3 gap-6">
        {/* ── Main column ── */}
        <div className="col-span-2 space-y-5">
          {/* Classification status */}
          <div className="rounded-sm border border-govuk-mid-grey bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Classification
              </span>
              <span className="text-xs text-gray-400">({workflow.classificationStatus})</span>
              <span className="text-xs text-gray-500">
                Stage:{' '}
                <strong className="text-govuk-black">
                  {STAGE_LABELS[session.stage] ?? session.stage}
                </strong>
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
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                {STAGE_LABELS[nextQuestion.stage] ?? nextQuestion.stage} question
              </p>
              <QuestionCard
                question={nextQuestion}
                onSubmit={(v) => handleAnswer(nextQuestion, v)}
                submitting={submitting}
                aiRationale={aiRationale}
              />
            </div>
          ) : canAdvance ? (
            <div className="rounded-sm border border-govuk-mid-grey border-l-4 border-l-govuk-blue bg-sky-50 p-4 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-sm font-bold text-govuk-black">
                  All {STAGE_LABELS[session.stage] ?? session.stage} questions answered
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Ready to advance to{' '}
                  <strong>
                    {STAGE_LABELS[STAGE_PROGRESSION[session.stage] ?? ''] ??
                      STAGE_PROGRESSION[session.stage]}
                  </strong>
                </p>
              </div>
              <button
                onClick={handleAdvanceStage}
                disabled={advancing}
                className="rounded-[2px] bg-govuk-blue px-4 py-2 text-sm font-bold text-white hover:bg-govuk-blue-dark disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-govuk-yellow"
              >
                {advancing ? 'Advancing…' : 'Next Stage →'}
              </button>
            </div>
          ) : null}

          {/* Support options */}
          {workflow.supportOptions.length > 0 && (
            <div className="rounded-sm border border-govuk-mid-grey bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Support options triggered
                </p>
                <button
                  onClick={() => navigate(`/session/${sessionId}/support`)}
                  className="text-xs text-govuk-blue hover:text-govuk-blue-dark font-bold underline focus:outline-none focus:ring-2 focus:ring-govuk-yellow whitespace-nowrap"
                >
                  Support &amp; Escalation Review →
                </button>
              </div>
              <div className="space-y-1.5">
                {workflow.supportOptions.map((code) => (
                  <div
                    key={code}
                    className="flex items-center gap-2 text-xs rounded-sm border-l-4 border-l-govuk-green bg-green-50 border border-green-200 px-3 py-2"
                  >
                    <span className="font-semibold text-govuk-black">
                      {SUPPORT_OPTION_CODE_LABELS[code] ?? code.replace(/_/g, ' ')}
                    </span>
                    <span className="text-gray-400 font-mono text-xs opacity-70">{code}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar: guidance cards ── */}
        <aside className="col-span-1 space-y-4">
          {guidance &&
          (guidance.public_policy.length > 0 || guidance.acme_operations.length > 0) ? (
            <>
              {guidance.public_policy.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <p className="text-xs font-bold text-govuk-blue uppercase tracking-wide">
                      Policy guidance
                    </p>
                    <span className="text-xs text-gray-400">Statutory / regulatory</span>
                  </div>
                  <div className="space-y-2">
                    {guidance.public_policy.map((c) => (
                      <GuidanceCardWidget key={c.code} card={c} />
                    ))}
                  </div>
                </div>
              )}
              {guidance.acme_operations.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <p className="text-xs font-bold text-govuk-orange uppercase tracking-wide">
                      Operations guidance
                    </p>
                    <span className="text-xs text-gray-400">Acme-specific</span>
                  </div>
                  <div className="space-y-2">
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

const DOMAIN_LEFT: Record<string, string> = {
  public_policy: 'border-l-govuk-blue',
  acme_operations: 'border-l-govuk-orange',
};

function GuidanceCardWidget({ card }: { card: GuidanceCardData }) {
  const [expanded, setExpanded] = useState(false);
  const domainLeft = card.source_domain
    ? (DOMAIN_LEFT[card.source_domain] ?? 'border-l-govuk-mid-grey')
    : 'border-l-govuk-mid-grey';

  return (
    <div className={`rounded-sm border border-govuk-mid-grey border-l-4 bg-white shadow-sm text-sm ${domainLeft}`}>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-3 py-2.5 flex items-start justify-between gap-2 focus:outline-none focus:ring-4 focus:ring-govuk-yellow rounded-sm"
      >
        <div className="flex flex-col gap-1 min-w-0">
          <span className="font-semibold text-govuk-black text-xs leading-snug">{card.title}</span>
          {card.source_domain && (
            <span className={`self-start text-xs rounded-full border px-1.5 py-0.5 font-medium ${SOURCE_DOMAIN_COLORS[card.source_domain] ?? 'bg-gray-50 border-gray-300 text-gray-700'}`}>
              {SOURCE_DOMAIN_LABEL[card.source_domain] ?? card.source_domain}
            </span>
          )}
        </div>
        <span className="text-gray-400 text-xs flex-shrink-0 mt-0.5">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-govuk-mid-grey pt-2">
          <p className="text-xs text-govuk-black">{card.summary}</p>
          {card.warning_text && (
            <div className="rounded-sm border-l-4 border-l-govuk-red bg-red-50 px-2 py-1.5">
              <p className="text-xs text-govuk-black">
                <strong className="text-govuk-red">Warning: </strong>
                {card.warning_text}
              </p>
            </div>
          )}
          {card.do_say_text && (
            <div className="rounded-sm border-l-4 border-l-govuk-green bg-green-50 px-2 py-1.5">
              <p className="text-xs font-bold text-govuk-green-dark mb-0.5">Do say:</p>
              <p className="text-xs text-govuk-black italic">"{card.do_say_text}"</p>
            </div>
          )}
          {card.do_not_say_text && (
            <div className="rounded-sm border-l-4 border-l-govuk-red bg-red-50 px-2 py-1.5">
              <p className="text-xs font-bold text-govuk-red mb-0.5">Do not say:</p>
              <p className="text-xs text-govuk-black italic">"{card.do_not_say_text}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
