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
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Collapsed header — always visible */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-4 py-3 flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="font-semibold text-sm text-gray-900 truncate">
            {option.label}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5 flex-shrink-0">
            {categoryLabel}
          </span>
          {option.source_domain && (
            <span
              className={`text-xs rounded-full border px-2 py-0.5 flex-shrink-0 ${SOURCE_DOMAIN_COLORS[option.source_domain] ?? 'bg-gray-100 text-gray-600 border-gray-300'}`}
            >
              {SOURCE_DOMAIN_LABEL[option.source_domain] ?? option.source_domain}
            </span>
          )}
          {option.requires_specialist_follow_up && (
            <span className="text-xs bg-red-50 border border-red-300 text-red-700 rounded-full px-2 py-0.5 flex-shrink-0 font-medium">
              Specialist required
            </span>
          )}
        </div>
        <span className="text-gray-400 text-xs flex-shrink-0">{expanded ? '▲' : '▼'}</span>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">
          {/* What to say to the resident */}
          <div className="rounded-md bg-green-50 border border-green-200 px-3 py-2.5">
            <p className="text-xs font-semibold text-green-800 mb-1">
              What to say to the resident
            </p>
            <p className="text-sm text-green-900">{option.resident_explanation}</p>
          </div>

          {/* Internal handling note */}
          <div className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2.5">
            <p className="text-xs font-semibold text-amber-800 mb-1">
              Internal handling note
            </p>
            <p className="text-sm text-amber-900">{option.internal_handling_note}</p>
          </div>
        </div>
      )}
    </div>
  );
}
