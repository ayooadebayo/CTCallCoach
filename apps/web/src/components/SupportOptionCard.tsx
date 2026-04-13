import { useState } from 'react';
import {
  SUPPORT_CATEGORY_LABELS,
  SOURCE_DOMAIN_LABEL,
  SOURCE_DOMAIN_COLORS,
} from '../lib/labels';
import type { ResolvedSupportOption } from '../lib/api';

interface SupportOptionCardProps {
  option: ResolvedSupportOption;
}

export function SupportOptionCard({ option }: SupportOptionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const categoryLabel =
    SUPPORT_CATEGORY_LABELS[option.category] ?? option.category.replace(/_/g, ' ');

  return (
    <div className="rounded-sm border border-govuk-mid-grey border-l-4 border-l-govuk-green bg-white shadow-sm">
      {/* Collapsed header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 focus:outline-none focus:ring-4 focus:ring-govuk-yellow rounded-sm"
      >
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="font-semibold text-sm text-govuk-black truncate">
            {option.label}
          </span>
          <span className="text-xs text-gray-600 bg-govuk-light-grey border border-govuk-mid-grey rounded-full px-2 py-0.5 flex-shrink-0">
            {categoryLabel}
          </span>
          {option.source_domain && (
            <span
              className={`text-xs rounded-full border px-2 py-0.5 flex-shrink-0 font-medium ${SOURCE_DOMAIN_COLORS[option.source_domain] ?? 'bg-gray-100 text-gray-600 border-gray-300'}`}
            >
              {SOURCE_DOMAIN_LABEL[option.source_domain] ?? option.source_domain}
            </span>
          )}
          {option.requires_specialist_follow_up && (
            <span className="text-xs bg-govuk-red text-white rounded-full px-2 py-0.5 flex-shrink-0 font-bold">
              Specialist required
            </span>
          )}
        </div>
        <span className="text-gray-400 text-xs flex-shrink-0">{expanded ? '▲' : '▼'}</span>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="border-t border-govuk-mid-grey px-4 pb-4 pt-3 space-y-3">
          {/* What to say to the resident */}
          <div className="rounded-sm border-l-4 border-l-govuk-green bg-green-50 px-3 py-2.5">
            <p className="text-xs font-bold text-govuk-green-dark mb-1 uppercase tracking-wide">
              What to say to the resident
            </p>
            <p className="text-sm text-govuk-black">{option.resident_explanation}</p>
          </div>

          {/* Internal handling note */}
          <div className="rounded-sm border-l-4 border-l-govuk-orange bg-amber-50 px-3 py-2.5">
            <p className="text-xs font-bold text-amber-900 mb-1 uppercase tracking-wide">
              Internal handling note
            </p>
            <p className="text-sm text-govuk-black">{option.internal_handling_note}</p>
          </div>
        </div>
      )}
    </div>
  );
}
