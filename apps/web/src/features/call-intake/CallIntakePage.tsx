import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSession, submitResponse, advanceStage } from '../../lib/api';
import type { SessionDetailResponse, SubmitResponseBody } from '../../lib/api';
import { QuestionCard } from '../../components/QuestionCard';
import { StageProgress } from '../../components/StageProgress';
import type { WorkflowQuestion } from '@ctcc/shared-types';

// Intake handles the 'intake' stage questions.
// When there are no more intake questions (nextRequiredQuestion is null while stage is intake),
// it auto-advances to classification and redirects to /live.

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

  // After loading, check if intake is complete.
  useEffect(() => {
    if (!data || !sessionId) return;
    const stage = data.session.stage;
    const nextQ = data.workflow.nextRequiredQuestion;

    if (stage === 'intake' && !nextQ) {
      // Intake done — advance to classification, then go to live guidance.
      advanceStage(sessionId, 'classification')
        .then(() => navigate(`/session/${sessionId}/live`, { replace: true }))
        .catch((e: unknown) => setError(String(e)));
    } else if (stage !== 'intake') {
      // Already past intake.
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="rounded-md bg-red-50 border border-red-300 px-6 py-4 text-red-800 max-w-md">
          <p className="font-semibold mb-1">Error</p>
          <p className="text-sm">{error}</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Call Intake
            </span>
            <h1 className="text-base font-semibold text-gray-900 mt-0.5">
              {session.scenario?.title ?? 'Manual call'}
            </h1>
          </div>
          <StageProgress currentStage={session.stage} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Resident info */}
        <div className="rounded-lg bg-white border border-gray-200 p-4 text-sm">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-gray-500">Caller: </span>
              <span className="font-medium text-gray-900">{session.resident.display_label}</span>
            </div>
            {session.scenario && (
              <div>
                <span className="text-gray-500">Scenario: </span>
                <span className="font-medium text-gray-900">{session.scenario.title}</span>
              </div>
            )}
          </div>
        </div>

        {/* Question */}
        {nextQuestion ? (
          <div>
            <p className="text-sm text-gray-500 mb-2 font-medium">Intake question</p>
            <QuestionCard
              question={nextQuestion}
              onSubmit={(v) => handleAnswer(nextQuestion, v)}
              submitting={submitting}
            />
          </div>
        ) : (
          <div className="rounded-lg bg-green-50 border border-green-300 px-4 py-3 text-sm text-green-800">
            Intake complete — advancing to call guidance…
          </div>
        )}
      </main>
    </div>
  );
}
