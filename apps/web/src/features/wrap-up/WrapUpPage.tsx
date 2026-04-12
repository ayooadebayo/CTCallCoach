import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSession, submitWrapUp } from '../../lib/api';
import { PathBadge } from '../../components/PathBadge';
import { StageProgress } from '../../components/StageProgress';
import { OUTCOME_LABELS, OUTCOME_CODES } from '../../lib/labels';

export function WrapUpPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [sessionData, setSessionData] = useState<{
    stage: string;
    primaryPath: string | null;
    overlayPaths: string[];
    scenarioTitle: string | null;
    residentLabel: string;
  } | null>(null);

  const [outcomeCode, setOutcomeCode] = useState('support_signposted');
  const [ownerNextStep, setOwnerNextStep] = useState('');
  const [caseNote, setCaseNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    getSession(sessionId)
      .then((result) => {
        setSessionData({
          stage: result.session.stage,
          primaryPath: result.workflow.primaryPath,
          overlayPaths: result.workflow.overlayPaths,
          scenarioTitle: result.session.scenario?.title ?? null,
          residentLabel: result.session.resident.display_label,
        });
      })
      .catch((e: unknown) => setError(String(e)));
  }, [sessionId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!sessionId) return;
    if (!ownerNextStep.trim()) {
      setError('"Next step" is required.');
      return;
    }
    if (!caseNote.trim()) {
      setError('Case note summary is required.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await submitWrapUp({
        call_session_id: sessionId,
        primary_outcome_code: outcomeCode,
        owner_next_step: ownerNextStep.trim(),
        case_note_text: caseNote.trim(),
      });
      setDone(true);
    } catch (e: unknown) {
      setError(String(e));
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-4 p-8">
          <div className="text-5xl">✓</div>
          <h2 className="text-2xl font-bold text-gray-900">Call Complete</h2>
          <p className="text-gray-600">
            Outcome recorded. Case note saved. Session closed.
          </p>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Back to scenarios
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Call Wrap-Up
            </span>
            <h1 className="text-base font-semibold text-gray-900 mt-0.5">
              {sessionData?.scenarioTitle ?? 'Manual call'}
            </h1>
          </div>
          <StageProgress currentStage="wrap_up" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 rounded-md bg-red-50 border border-red-300 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Session summary */}
        {sessionData && (
          <div className="rounded-lg bg-white border border-gray-200 p-4 mb-6 text-sm">
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <span className="text-gray-500">Caller: </span>
                <span className="font-medium">{sessionData.residentLabel}</span>
              </div>
              {sessionData.primaryPath && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-gray-500">Classification:</span>
                  <PathBadge code={sessionData.primaryPath} variant="primary" />
                  {sessionData.overlayPaths.map((p) => (
                    <PathBadge key={p} code={p} variant="overlay" />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Outcome selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Call outcome <span className="text-red-500">*</span>
            </label>
            <select
              value={outcomeCode}
              onChange={(e) => setOutcomeCode(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {OUTCOME_CODES.map((code) => (
                <option key={code} value={code}>
                  {OUTCOME_LABELS[code] ?? code}
                </option>
              ))}
            </select>
          </div>

          {/* Owner next step */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Next step / owner action <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={ownerNextStep}
              onChange={(e) => setOwnerNextStep(e.target.value)}
              placeholder="e.g. Resident to call back with bank details; agent referred to revenues team"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Case note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Case note summary <span className="text-red-500">*</span>
            </label>
            <textarea
              value={caseNote}
              onChange={(e) => setCaseNote(e.target.value)}
              rows={5}
              placeholder="Summarise the call: what was discussed, what was offered, any relevant context…"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Save & Close Call'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/session/${sessionId}/live`)}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              ← Back to guidance
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
