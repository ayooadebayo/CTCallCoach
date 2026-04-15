import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSession, submitResponse, advanceStage } from '../../lib/api';
import type { SessionDetailResponse, SubmitResponseBody } from '../../lib/api';
import { QuestionCard } from '../../components/QuestionCard';
import { StageProgress } from '../../components/StageProgress';
import { AppHeader } from '../../components/AppHeader';
import { SessionNav } from '../../components/SessionNav';
import type { WorkflowQuestion } from '@ctcc/shared-types';

export function CallIntakePage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<SessionDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (!sessionId) return;
    try {
      const result = await getSession(sessionId);
      setData(result);
    } catch (e: unknown) {
      setError(String(e));
    }
  }, [sessionId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!data || !sessionId) return;
    const stage = data.session.stage;
    const nextQ = data.workflow.nextRequiredQuestion;

    if (stage === 'intake' && !nextQ) {
      advanceStage(sessionId, 'classification')
        .then(() => navigate(`/session/${sessionId}/live`, { replace: true }))
        .catch((e: unknown) => setError(String(e)));
    } else if (stage !== 'intake') {
      navigate(`/session/${sessionId}/live`, { replace: true });
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

  if (error) {
    return (
      <div className="min-h-screen bg-govuk-light-grey flex items-center justify-center">
        <div className="rounded-sm border border-govuk-mid-grey border-l-4 border-l-govuk-red bg-red-50 px-6 py-4 text-govuk-black max-w-md">
          <p className="font-bold text-govuk-red mb-1">Error</p>
          <p className="text-sm">{error}</p>
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

  return (
    <div className="min-h-screen bg-govuk-light-grey">
      <AppHeader
        pageTitle={session.scenario?.title ?? 'Manual call'}
        right={<StageProgress currentStage={session.stage} />}
      />
      {sessionId && <SessionNav sessionId={sessionId} current="intake" />}

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6 sm:px-6">
        {/* Caller info strip */}
        <div className="rounded-sm border border-govuk-mid-grey bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-6 flex-wrap text-sm">
            <div>
              <span className="text-gray-500 text-xs font-medium mr-1">
                Caller
              </span>
              <span className="font-semibold text-govuk-black">
                {session.resident.display_label}
              </span>
            </div>
            {session.scenario && (
              <div>
                <span className="text-gray-500 text-xs font-medium mr-1">
                  Scenario
                </span>
                <span className="font-semibold text-govuk-black">{session.scenario.title}</span>
              </div>
            )}
          </div>
        </div>

        {/* Stage label */}
        <p className="text-sm font-medium text-gray-600">
          Intake question
        </p>

        {nextQuestion ? (
          <QuestionCard
            question={nextQuestion}
            onSubmit={(v) => handleAnswer(nextQuestion, v)}
            submitting={submitting}
          />
        ) : (
          <div className="rounded-sm border border-govuk-mid-grey border-l-4 border-l-govuk-green bg-green-50 px-4 py-3 text-sm text-govuk-black">
            Intake complete — advancing to call guidance…
          </div>
        )}
      </main>
    </div>
  );
}
