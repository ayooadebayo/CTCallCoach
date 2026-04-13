import { ESCALATION_CATEGORY_LABELS } from '../lib/labels';
import type { WorkflowEscalationFlag } from '@ctcc/shared-types';

interface EscalationFlagCardProps {
  flag: WorkflowEscalationFlag;
}

export const SEVERITY_SORT: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

// Left accent border colour per severity.
const SEVERITY_LEFT: Record<string, string> = {
  critical: 'border-l-govuk-red',
  high: 'border-l-govuk-orange',
  medium: 'border-l-amber-400',
  low: 'border-l-gray-400',
  high_risk: 'border-l-govuk-red',
};

// Severity badge style per severity.
const SEVERITY_BADGE: Record<string, string> = {
  critical: 'bg-govuk-red text-white',
  high: 'bg-govuk-orange text-white',
  medium: 'bg-amber-100 text-amber-900 border border-amber-400',
  low: 'bg-gray-100 text-gray-600 border border-gray-300',
  high_risk: 'bg-govuk-red text-white',
};

export function EscalationFlagCard({ flag }: EscalationFlagCardProps) {
  const leftBorder = SEVERITY_LEFT[flag.severity] ?? 'border-l-gray-400';
  const badgeClass = SEVERITY_BADGE[flag.severity] ?? 'bg-gray-100 text-gray-700 border border-gray-300';
  const categoryLabel =
    ESCALATION_CATEGORY_LABELS[flag.category] ?? flag.category.replace(/_/g, ' ');

  return (
    <div
      className={`rounded-sm border border-govuk-mid-grey border-l-4 bg-white shadow-sm px-4 py-3 space-y-2 ${leftBorder}`}
    >
      {/* Header row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs font-bold uppercase tracking-wide rounded-full px-2.5 py-0.5 ${badgeClass}`}>
          {flag.severity}
        </span>
        <span className="text-xs font-mono bg-govuk-light-grey rounded px-1.5 py-0.5 border border-govuk-mid-grey text-govuk-black">
          {flag.code}
        </span>
        <span className="text-xs text-gray-500">{categoryLabel}</span>
      </div>

      {/* Reason */}
      <p className="text-sm text-govuk-black">{flag.reason}</p>

      {/* Trigger facts */}
      {flag.trigger_facts.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-1">Triggered by:</p>
          <div className="flex flex-wrap gap-1">
            {flag.trigger_facts.map((fact) => (
              <span
                key={fact}
                className="text-xs font-mono bg-govuk-light-grey border border-govuk-mid-grey rounded px-1.5 py-0.5 text-govuk-black"
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
