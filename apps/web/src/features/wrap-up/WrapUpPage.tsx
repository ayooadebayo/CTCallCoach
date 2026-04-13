import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSession, submitWrapUp } from '../../lib/api';
import { PathBadge } from '../../components/PathBadge';
import { StageProgress } from '../../components/StageProgress';
import { AppHeader } from '../../components/AppHeader';
import { OUTCOME_LABELS, OUTCOME_CODES } from '../../lib/labels';

const inputClass =
  'w-full border-2 border-govuk-black bg-white px-3 py-2 text-sm text-govuk-black rounded-sm focus:outline-none focus:ring-4 focus:ring-govuk-yellow';

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
      <div className="min-h-screen bg-govuk-light-grey">
        <AppHeader />
        <div className="max-w-md mx-auto px-6 py-16 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-govuk-green flex items-center justify-center mx-auto">
            <span className="text-white text-3xl font-bold">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-govuk-black">Call Complete</h2>
          <p className="text-gray-600">
            Outcome recorded. Case note saved. Session closed.
          </p>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="rounded-[2px] bg-govuk-green px-6 py-2.5 text-sm font-bold text-white hover:bg-govuk-green-dark focus:outline-none focus:ring-4 focus:ring-govuk-yellow"
          >
            Back to scenarios
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-govuk-light-grey">
      <AppHeader
        pageTitle={sessionData?.scenarioTitle ?? 'Manual call'}
        right={<StageProgress currentStage="wrap_up" />}
      />

      <main className="max-w-3xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 rounded-sm border border-govuk-mid-grey border-l-4 border-l-govuk-red bg-red-50 px-4 py-3 text-sm text-govuk-black">
            <p className="font-bold text-govuk-red mb-1">Error</p>
            {error}
          </div>
        )}

        {/* Session summary */}
        {sessionData && (
          <div className="rounded-sm border border-govuk-mid-grey bg-white px-4 py-3 mb-6 shadow-sm text-sm">
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wide mr-1">
                  Caller
                </span>
                <span className="font-semibold text-govuk-black">{sessionData.residentLabel}</span>
              </div>
              {sessionData.primaryPath && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
                    Classification:
                  </span>
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
            <label className="block text-sm font-bold text-govuk-black mb-1">
              Call outcome <span className="text-govuk-red">*</span>
            </label>
            <select
              value={outcomeCode}
              onChange={(e) => setOutcomeCode(e.target.value)}
              className={inputClass}
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
            <label className="block text-sm font-bold text-govuk-black mb-1">
              Next step / owner action <span className="text-govuk-red">*</span>
            </label>
            <input
              type="text"
              value={ownerNextStep}
              onChange={(e) => setOwnerNextStep(e.target.value)}
              placeholder="e.g. Resident to call back with bank details; agent referred to revenues team"
              className={inputClass}
            />
          </div>

          {/* Case note */}
          <div>
            <label className="block text-sm font-bold text-govuk-black mb-1">
              Case note summary <span className="text-govuk-red">*</span>
            </label>
            <textarea
              value={caseNote}
              onChange={(e) => setCaseNote(e.target.value)}
              rows={5}
              placeholder="Summarise the call: what was discussed, what was offered, any relevant context…"
              className={inputClass}
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-[2px] bg-govuk-green px-6 py-2.5 text-sm font-bold text-white hover:bg-govuk-green-dark disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-govuk-yellow"
            >
              {submitting ? 'Saving…' : 'Save & Close Call'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/session/${sessionId}/live`)}
              className="text-sm text-govuk-blue hover:text-govuk-blue-dark font-medium underline focus:outline-none focus:ring-2 focus:ring-govuk-yellow"
            >
              ← Back to guidance
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
