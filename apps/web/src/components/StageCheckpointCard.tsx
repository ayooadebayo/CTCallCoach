import { PATH_LABELS } from '../lib/labels';

interface StageCheckpointCardProps {
  stageLabel: string;
  primaryPath: string | null;
  overlayPaths: string[];
  questionsAnswered: number;
  onContinue: () => void;
}

export function StageCheckpointCard({
  stageLabel,
  primaryPath,
  overlayPaths,
  questionsAnswered,
  onContinue,
}: StageCheckpointCardProps) {
  return (
    <div
      className="w-full bg-white rounded-[2px]"
      style={{ borderLeft: '4px solid #1d70b8', padding: '24px' }}
    >
      <h2
        className="text-govuk-black font-semibold mb-3"
        style={{ fontSize: '20px' }}
      >
        Stage complete: {stageLabel}
      </h2>

      <div className="flex flex-wrap gap-2 mb-3">
        {primaryPath ? (
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-govuk-green text-white">
            {primaryPath} — {PATH_LABELS[primaryPath] ?? primaryPath}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-govuk-mid-grey text-white">
            Classifying…
          </span>
        )}
        {overlayPaths.map((p) => (
          <span
            key={p}
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-govuk-orange text-white"
          >
            + {p} — {PATH_LABELS[p] ?? p}
          </span>
        ))}
      </div>

      <p className="text-sm text-gray-600 mb-4">
        {questionsAnswered} question(s) answered in this stage.
      </p>

      <button
        onClick={onContinue}
        className="rounded-[2px] bg-govuk-blue px-4 py-2 text-sm font-bold text-white hover:bg-govuk-blue-dark focus:outline-none focus:ring-4 focus:ring-govuk-yellow"
      >
        Continue to next stage →
      </button>
    </div>
  );
}
