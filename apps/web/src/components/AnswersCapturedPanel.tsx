import { STAGE_LABELS } from '../lib/labels';

export interface SessionResponseItem {
  stage: string;
  questionText: string;
  answerValue: string;
}

interface AnswersCapturedPanelProps {
  responses: SessionResponseItem[];
  isOpen: boolean;
  onToggle: () => void;
}

export function AnswersCapturedPanel({
  responses,
  isOpen,
  onToggle,
}: AnswersCapturedPanelProps) {
  // Group responses by stage, preserving insertion order.
  const stageOrder: string[] = [];
  const grouped: Record<string, SessionResponseItem[]> = {};
  for (const r of responses) {
    if (!grouped[r.stage]) {
      grouped[r.stage] = [];
      stageOrder.push(r.stage);
    }
    grouped[r.stage]!.push(r);
  }

  return (
    <div className="rounded-[2px] border border-govuk-mid-grey overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left bg-govuk-light-grey px-4 py-3 flex items-center justify-between cursor-pointer focus:outline-none focus:ring-4 focus:ring-govuk-yellow"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-bold text-govuk-black">
          Answers so far ({responses.length})
        </span>
        <span className="text-gray-500 text-xs">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div>
          {responses.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500 italic">
              No answers recorded yet.
            </p>
          ) : (
            stageOrder.map((stage) => (
              <div key={stage}>
                {/* Stage label row */}
                <div className="px-4 py-1.5 bg-govuk-light-grey">
                  <span
                    className="text-gray-500 font-bold uppercase"
                    style={{ fontSize: '11px', letterSpacing: '0.05em' }}
                  >
                    {STAGE_LABELS[stage] ?? stage.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Response rows */}
                {(grouped[stage] ?? []).map((r, i) => {
                  const truncated =
                    r.questionText.length > 75
                      ? r.questionText.slice(0, 75) + '...'
                      : r.questionText;
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3 px-4 py-2"
                      style={{ borderBottom: '1px solid #e8e8e8' }}
                    >
                      <span className="text-sm text-gray-600 flex-1 min-w-0">
                        {truncated}
                      </span>
                      <span className="font-mono text-xs bg-govuk-light-grey border border-govuk-mid-grey rounded-sm px-2 py-0.5 text-govuk-black flex-shrink-0">
                        {r.answerValue}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
