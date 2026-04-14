// HistoryReviewCard — shows a previously answered question with its recorded answer.
//
// The advisor can review the answer and optionally click "Edit this answer" to
// replace it. Submitting from the QuestionCard inside this component calls
// onEditSubmit, which re-evaluates the workflow.

import { useState } from 'react';
import { QuestionCard } from './QuestionCard';
import { STAGE_LABELS } from '../lib/labels';
import type { SessionResponseItem } from '../lib/api';
import type { WorkflowQuestion } from '@ctcc/shared-types';

// Derive the correct QuestionCard initialValue from the stored string answer.
function getInitialValue(step: SessionResponseItem) {
  switch (step.questionType) {
    case 'boolean':
      // Boolean questions don't need pre-fill — the user just clicks Yes/No again.
      return undefined;
    case 'single_select':
      return { selectedOption: step.answerValue };
    case 'numeric': {
      const n = parseFloat(step.answerValue);
      return isNaN(n) ? undefined : { number: n };
    }
    default:
      return { text: step.answerValue };
  }
}

interface HistoryReviewCardProps {
  step: SessionResponseItem;
  /** 1-indexed position of this step. */
  stepNumber: number;
  /** Total number of answered questions in the session. */
  totalAnswered: number;
  /** Called when the advisor submits a new answer in edit mode. */
  onEditSubmit: (value: {
    answer_text?: string;
    answer_boolean?: boolean;
    answer_number?: number;
  }) => void;
  editSubmitting: boolean;
}

export function HistoryReviewCard({
  step,
  stepNumber,
  totalAnswered,
  onEditSubmit,
  editSubmitting,
}: HistoryReviewCardProps) {
  const [editMode, setEditMode] = useState(false);

  // Reconstruct a minimal WorkflowQuestion so QuestionCard can render.
  // Use conditional spread for answer_options to satisfy exactOptionalPropertyTypes.
  const syntheticQuestion: WorkflowQuestion = {
    code: step.questionCode,
    // Cast: we trust the string coming from the DB is a valid SessionStage / QuestionType.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stage: step.stage as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    question_type: step.questionType as any,
    question_text: step.questionText,
    mandatory: true,
    ...(step.answerOptions ? { answer_options: step.answerOptions } : {}),
  };

  const initialValue = getInitialValue(step);
  const stageLabel = STAGE_LABELS[step.stage] ?? step.stage.replace(/_/g, ' ');

  function handleEditSubmit(value: {
    answer_text?: string;
    answer_boolean?: boolean;
    answer_number?: number;
  }) {
    setEditMode(false);
    onEditSubmit(value);
  }

  return (
    <div className="rounded-sm border border-govuk-mid-grey border-l-4 border-l-govuk-orange bg-amber-50 p-5 shadow-sm">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-govuk-orange uppercase tracking-widest">
            Reviewing past answer
          </span>
          <span className="text-xs rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-semibold px-2 py-0.5">
            {stageLabel}
          </span>
        </div>
        <span className="text-xs text-gray-500 font-medium">
          Step {stepNumber} of {totalAnswered}
        </span>
      </div>

      {/* Question text */}
      <p className="text-[17px] font-semibold text-govuk-black mb-4 leading-snug">
        {step.questionText}
      </p>

      {!editMode ? (
        /* Read-only view */
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-white border border-govuk-mid-grey rounded-sm px-3 py-2">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Recorded answer:
            </span>
            <span className="text-sm font-bold text-govuk-black">{step.answerValue}</span>
          </div>
          <button
            onClick={() => setEditMode(true)}
            className="text-sm text-govuk-blue underline font-semibold hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-govuk-yellow"
          >
            Edit this answer
          </button>
        </div>
      ) : (
        /* Edit mode — QuestionCard with pre-filled value */
        <div className="space-y-3">
          <p className="text-xs font-semibold text-govuk-orange">
            Editing — submitting a new answer will re-evaluate the workflow from this point.
          </p>
          <QuestionCard
            key={step.questionCode}
            question={syntheticQuestion}
            onSubmit={handleEditSubmit}
            submitting={editSubmitting}
            {...(initialValue !== undefined ? { initialValue } : {})}
          />
          <button
            onClick={() => setEditMode(false)}
            className="text-xs text-gray-500 underline hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-govuk-yellow"
          >
            Cancel edit
          </button>
        </div>
      )}
    </div>
  );
}
