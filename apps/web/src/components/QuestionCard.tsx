import { useState } from 'react';
import { labelFor } from '../lib/labels';
import type { WorkflowQuestion } from '@ctcc/shared-types';
import type { QuestionRationaleResponse } from '../lib/api';

interface QuestionCardProps {
  question: WorkflowQuestion;
  onSubmit: (value: { answer_text?: string; answer_boolean?: boolean; answer_number?: number }) => void;
  submitting?: boolean;
  /** AI-generated rationale — shown in the "why it matters" box when available */
  aiRationale?: QuestionRationaleResponse | null;
  /**
   * Pre-fill values for edit mode (when reviewing a historical answer).
   * Pass a new `key` prop alongside this to force remount when the question changes.
   */
  initialValue?: {
    text?: string;
    selectedOption?: string;
    number?: number;
  };
}

const inputClass =
  'w-full border-2 border-govuk-black bg-white px-3 py-2 text-sm text-govuk-black rounded-sm focus:outline-none focus:ring-4 focus:ring-govuk-yellow';

const btnPrimary =
  'rounded-[2px] bg-govuk-green px-5 py-2 text-sm font-bold text-white hover:bg-govuk-green-dark disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-govuk-yellow';

export function QuestionCard({ question, onSubmit, submitting = false, aiRationale, initialValue }: QuestionCardProps) {
  const [textValue, setTextValue] = useState(initialValue?.text ?? '');
  const [selectedOption, setSelectedOption] = useState<string | null>(initialValue?.selectedOption ?? null);
  const [numberValue, setNumberValue] = useState(
    initialValue?.number != null ? String(initialValue.number) : '',
  );
  const [showRationale, setShowRationale] = useState(false);

  function handleSubmit() {
    if (question.question_type === 'boolean') return;
    if (question.question_type === 'single_select') {
      if (!selectedOption) return;
      onSubmit({ answer_text: selectedOption });
    } else if (question.question_type === 'numeric') {
      const n = parseFloat(numberValue);
      if (isNaN(n)) return;
      onSubmit({ answer_number: n });
    } else {
      if (!textValue.trim()) return;
      onSubmit({ answer_text: textValue.trim() });
    }
  }

  const rationaleText = aiRationale?.rationale ?? question.why_it_matters_text;
  const hasRationale = !!rationaleText;

  return (
    <div className="rounded-sm border border-govuk-mid-grey border-l-4 border-l-govuk-blue bg-white p-5 shadow-sm">
      {/* Sensitivity warning */}
      {question.sensitivity_warning && (
        <div className="mb-4 rounded-sm border-l-4 border-l-govuk-orange bg-amber-50 px-3 py-2 text-xs text-govuk-black">
          <span className="font-semibold mr-1">Sensitivity:</span>
          {question.sensitivity_warning}
        </div>
      )}

      {/* Question text */}
      <p className="mb-2 text-base font-semibold leading-snug text-govuk-black sm:text-[17px]">
        {question.question_text}
      </p>

      {/* Why it matters — prefer AI rationale when available, fall back to curated text */}
      {hasRationale && (
        <>
          <div className="mb-4 rounded-sm bg-govuk-light-grey px-3 py-2 md:hidden">
            <button
              type="button"
              onClick={() => setShowRationale((v) => !v)}
              className="flex w-full items-center justify-between text-left text-xs font-semibold text-govuk-blue focus:outline-none focus:ring-2 focus:ring-govuk-yellow"
            >
              Why we ask this
              <span className="text-gray-500">{showRationale ? '▲' : '▼'}</span>
            </button>
            {showRationale && (
              <div className="mt-2 space-y-1.5">
                <p className="text-xs italic leading-relaxed text-govuk-black">{rationaleText}</p>
                {aiRationale?.learning_tip && (
                  <p className="text-xs leading-relaxed text-govuk-blue">
                    <span className="font-semibold not-italic">Tip: </span>
                    {aiRationale.learning_tip}
                  </p>
                )}
                {aiRationale?.rationale && (
                  <p className="text-xs text-gray-400">AI-assisted</p>
                )}
              </div>
            )}
          </div>
          <div className="mb-4 hidden rounded-sm bg-govuk-light-grey px-3 py-2 md:block">
            <p className="text-xs italic leading-relaxed text-govuk-black">{rationaleText}</p>
            {aiRationale?.learning_tip && (
              <p className="mt-1 text-xs leading-relaxed text-govuk-blue">
                <span className="font-semibold not-italic">Tip: </span>
                {aiRationale.learning_tip}
              </p>
            )}
            {aiRationale?.rationale && (
              <p className="mt-1 text-xs text-gray-400">AI-assisted</p>
            )}
          </div>
        </>
      )}

      {/* Boolean */}
      {question.question_type === 'boolean' && (
        <div className="flex gap-3 mt-3">
          <button
            onClick={() => onSubmit({ answer_boolean: true })}
            disabled={submitting}
            className="flex-1 rounded-[2px] bg-govuk-green py-2.5 text-sm font-bold text-white hover:bg-govuk-green-dark disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-govuk-yellow"
          >
            Yes
          </button>
          <button
            onClick={() => onSubmit({ answer_boolean: false })}
            disabled={submitting}
            className="flex-1 rounded-[2px] bg-govuk-red py-2.5 text-sm font-bold text-white hover:bg-red-800 disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-govuk-yellow"
          >
            No
          </button>
        </div>
      )}

      {/* Single select */}
      {question.question_type === 'single_select' && question.answer_options && (
        <div className="mt-3 space-y-2">
          {question.answer_options.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelectedOption(opt === selectedOption ? null : opt)}
              className={`w-full text-left rounded-sm border-2 px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-4 focus:ring-govuk-yellow ${
                selectedOption === opt
                  ? 'border-govuk-blue bg-govuk-blue text-white font-semibold'
                  : 'border-govuk-mid-grey bg-white text-govuk-black hover:border-govuk-blue hover:bg-sky-50'
              }`}
            >
              {labelFor(opt)}
            </button>
          ))}
          {selectedOption && (
            <div className="pt-1">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={btnPrimary}
              >
                {submitting ? 'Saving…' : 'Confirm →'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Numeric */}
      {question.question_type === 'numeric' && (
        <div className="mt-3 flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
          <input
            type="number"
            value={numberValue}
            onChange={(e) => setNumberValue(e.target.value)}
            className="w-full rounded-sm border-2 border-govuk-black bg-white px-3 py-2 text-sm text-govuk-black focus:outline-none focus:ring-4 focus:ring-govuk-yellow sm:w-36"
            placeholder="Enter number"
          />
          <button
            onClick={handleSubmit}
            disabled={submitting || !numberValue}
            className={btnPrimary}
          >
            {submitting ? 'Saving…' : 'Confirm →'}
          </button>
        </div>
      )}

      {/* Free text */}
      {question.question_type === 'free_text' && (
        <div className="mt-3 space-y-3">
          <textarea
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            rows={3}
            className={inputClass}
            placeholder="Type response…"
          />
          <button
            onClick={handleSubmit}
            disabled={submitting || !textValue.trim()}
            className={btnPrimary}
          >
            {submitting ? 'Saving…' : 'Confirm →'}
          </button>
        </div>
      )}
    </div>
  );
}
