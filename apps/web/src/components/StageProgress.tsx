import { STAGE_LABELS, PROGRESS_STAGES } from '../lib/labels';

interface StageProgressProps {
  currentStage: string;
}

export function StageProgress({ currentStage }: StageProgressProps) {
  const stages = PROGRESS_STAGES;
  const currentIndex = stages.indexOf(currentStage as typeof stages[number]);

  return (
    <nav aria-label="Call progress" className="flex items-center gap-0">
      {stages.map((stage, i) => {
        const isDone = i < currentIndex;
        const isActive = stage === currentStage;

        return (
          <div key={stage} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  isDone
                    ? 'bg-govuk-green text-white'
                    : isActive
                      ? 'bg-white text-govuk-blue ring-2 ring-govuk-yellow ring-offset-govuk-blue ring-offset-1'
                      : 'bg-govuk-mid-grey text-white'
                }`}
              >
                {isDone ? '✓' : i + 1}
              </div>
              <span
                className={`mt-1 text-xs whitespace-nowrap font-medium ${
                  isActive
                    ? 'text-white font-bold'
                    : isDone
                      ? 'text-blue-200'
                      : 'text-blue-300'
                }`}
              >
                {STAGE_LABELS[stage] ?? stage}
              </span>
            </div>
            {i < stages.length - 1 && (
              <div
                className={`mx-1 mb-4 h-0.5 w-8 flex-shrink-0 ${isDone ? 'bg-govuk-green' : 'bg-govuk-mid-grey'}`}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
