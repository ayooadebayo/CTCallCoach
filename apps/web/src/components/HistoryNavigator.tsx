// HistoryNavigator — Ocelot-style back/forward navigation bar.
//
// Shows the current position in the answered-question history and provides
// ← / → arrows to move through it. When in live mode the forward arrow is
// disabled. When reviewing history the "Jump to current question" link is shown.

interface HistoryNavigatorProps {
  /** Total number of answered questions (session_responses.length). */
  totalAnswered: number;
  /** True when there is an unanswered live question being shown. */
  hasCurrentQuestion: boolean;
  /**
   * null  = live mode (showing next unanswered question or stage-advance prompt)
   * 0..N-1 = reviewing answered question at that index
   */
  historyIndex: number | null;
  /** Human-readable stage label for the step currently being displayed. */
  currentStepStage: string;
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  onJumpToLive: () => void;
}

export function HistoryNavigator({
  totalAnswered,
  hasCurrentQuestion,
  historyIndex,
  currentStepStage,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  onJumpToLive,
}: HistoryNavigatorProps) {
  const isLive = historyIndex === null;
  const totalSteps = totalAnswered + (hasCurrentQuestion ? 1 : 0);
  const stepPosition = isLive
    ? totalSteps
    : historyIndex! + 1;

  const borderColor = isLive ? '#1d70b8' : '#f47738';

  return (
    <div
      className="bg-white rounded-[2px] border border-govuk-mid-grey shadow-sm flex items-center gap-3 px-4 py-2.5"
      style={{ borderLeft: `4px solid ${borderColor}` }}
      role="navigation"
      aria-label="Question history navigation"
    >
      {/* Back arrow */}
      <button
        onClick={onBack}
        disabled={!canGoBack}
        aria-label="Previous answered question"
        className="rounded-[2px] px-3 py-1.5 text-xs font-bold border border-govuk-mid-grey text-govuk-black hover:bg-govuk-light-grey disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-govuk-yellow"
      >
        ← Back
      </button>

      {/* Step indicator */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className="text-xs font-bold text-govuk-black">
          {isLive ? 'Current question' : `Reviewing step ${stepPosition} of ${totalSteps}`}
        </span>
        <span className="text-xs text-gray-400">·</span>
        <span className="text-xs font-medium text-gray-600">{currentStepStage}</span>
        {!isLive && (
          <>
            <span className="text-xs text-gray-400">·</span>
            <button
              onClick={onJumpToLive}
              className="text-xs text-govuk-blue underline hover:opacity-80 font-semibold focus:outline-none focus:ring-2 focus:ring-govuk-yellow"
            >
              ▸ Jump to current question
            </button>
          </>
        )}
      </div>

      {/* Forward arrow */}
      <button
        onClick={onForward}
        disabled={!canGoForward}
        aria-label="Next answered question"
        className="rounded-[2px] px-3 py-1.5 text-xs font-bold border border-govuk-mid-grey text-govuk-black hover:bg-govuk-light-grey disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-govuk-yellow"
      >
        Next →
      </button>
    </div>
  );
}
