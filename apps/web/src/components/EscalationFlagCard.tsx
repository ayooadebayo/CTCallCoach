import { SEVERITY_COLORS, ESCALATION_CATEGORY_LABELS } from '../lib/labels';
import type { WorkflowEscalationFlag } from '@ctcc/shared-types';

interface EscalationFlagCardProps {
  flag: WorkflowEscalationFlag;
}

const SEVERITY_SORT: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export { SEVERITY_SORT };

export function EscalationFlagCard({ flag }: EscalationFlagCardProps) {
  const severityClass =
    SEVERITY_COLORS[flag.severity] ?? 'bg-gray-50 border-gray-300 text-gray-800';
  const categoryLabel =
    ESCALATION_CATEGORY_LABELS[flag.category] ?? flag.category.replace(/_/g, ' ');

  return (
    <div className={`rounded-lg border px-4 py-3 space-y-2 ${severityClass}`}>
      {/* Header row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold uppercase tracking-wide">
          {flag.severity}
        </span>
        <span className="text-xs font-mono bg-white bg-opacity-60 rounded px-1.5 py-0.5 border border-current border-opacity-30">
          {flag.code}
        </span>
        <span className="text-xs opacity-75">{categoryLabel}</span>
      </div>

      {/* Reason */}
      <p className="text-sm">{flag.reason}</p>

      {/* Trigger facts */}
      {flag.trigger_facts.length > 0 && (
        <div>
          <p className="text-xs font-semibold opacity-70 mb-1">Triggered by:</p>
          <div className="flex flex-wrap gap-1">
            {flag.trigger_facts.map((fact) => (
              <span
                key={fact}
                className="text-xs font-mono bg-white bg-opacity-50 rounded px-1.5 py-0.5 border border-current border-opacity-20"
              >
                {fact}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
