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
      className="rounded-[2px] border border-govuk-mid-grey bg-white px-4 py-2.5 shadow-sm"
      style={{ borderLeft: `4px solid ${borderColor}` }}
      role="navigation"
      aria-label="Question history navigation"
    >
      <div className="flex items-center gap-2">
        {/* Back arrow */}
        <button
          onClick={onBack}
          disabled={!canGoBack}
          aria-label="Previous answered question"
          className="min-h-[44px] rounded-[2px] border border-govuk-mid-grey px-3 py-1.5 text-xs font-bold text-govuk-black hover:bg-govuk-light-grey disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-4 focus:ring-govuk-yellow"
        >
          ← Back
        </button>

        {/* Step indicator */}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-govuk-black">
            {isLive ? 'Current question' : `Reviewing step ${stepPosition} of ${totalSteps}`}
          </p>
          <p className="text-xs font-medium text-gray-600">{currentStepStage}</p>
        </div>

        {/* Forward arrow */}
        <button
          onClick={onForward}
          disabled={!canGoForward}
          aria-label="Next answered question"
          className="min-h-[44px] rounded-[2px] border border-govuk-mid-grey px-3 py-1.5 text-xs font-bold text-govuk-black hover:bg-govuk-light-grey disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-4 focus:ring-govuk-yellow"
        >
          Next →
        </button>
      </div>

      {!isLive && (
        <div className="pt-2 sm:pt-1">
          <button
            onClick={onJumpToLive}
            className="min-h-[44px] w-full rounded-[2px] border border-govuk-mid-grey bg-govuk-light-grey px-3 text-xs font-semibold text-govuk-blue underline hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-govuk-yellow sm:min-h-0 sm:w-auto sm:border-0 sm:bg-transparent sm:p-0"
          >
            Jump to current question
          </button>
        </div>
      )}
    </div>
  );
}
