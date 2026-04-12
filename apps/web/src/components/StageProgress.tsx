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
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  isDone
                    ? 'bg-green-600 text-white'
                    : isActive
                      ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isDone ? '✓' : i + 1}
              </div>
              <span
                className={`mt-1 text-xs whitespace-nowrap ${
                  isActive ? 'text-blue-700 font-semibold' : isDone ? 'text-green-700' : 'text-gray-400'
                }`}
              >
                {STAGE_LABELS[stage] ?? stage}
              </span>
            </div>
            {i < stages.length - 1 && (
              <div
                className={`mx-1 h-0.5 w-8 flex-shrink-0 ${isDone ? 'bg-green-500' : 'bg-gray-200'}`}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
