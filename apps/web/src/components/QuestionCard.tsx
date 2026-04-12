import { useState } from 'react';
import { labelFor } from '../lib/labels';
import type { WorkflowQuestion } from '@ctcc/shared-types';

interface QuestionCardProps {
  question: WorkflowQuestion;
  onSubmit: (value: { answer_text?: string; answer_boolean?: boolean; answer_number?: number }) => void;
  submitting?: boolean;
}

export function QuestionCard({ question, onSubmit, submitting = false }: QuestionCardProps) {
  const [textValue, setTextValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [numberValue, setNumberValue] = useState('');

  function handleSubmit() {
    if (question.question_type === 'boolean') return; // booleans submit immediately
    if (question.question_type === 'single_select') {
      if (!selectedOption) return;
      onSubmit({ answer_text: selectedOption });
    } else if (question.question_type === 'numeric') {
      const n = parseFloat(numberValue);
      if (isNaN(n)) return;
      onSubmit({ answer_number: n });
    } else {
      // free_text
      if (!textValue.trim()) return;
      onSubmit({ answer_text: textValue.trim() });
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      {question.sensitivity_warning && (
        <div className="mb-3 rounded bg-yellow-50 border border-yellow-300 px-3 py-2 text-xs text-yellow-800">
          <span className="font-semibold">Sensitivity: </span>
          {question.sensitivity_warning}
        </div>
      )}

      <p className="text-base font-medium text-gray-900 mb-1">{question.question_text}</p>

      {question.why_it_matters_text && (
        <p className="text-xs text-gray-500 mb-3 italic">{question.why_it_matters_text}</p>
      )}

      {/* Boolean */}
      {question.question_type === 'boolean' && (
        <div className="flex gap-3 mt-3">
          <button
            onClick={() => onSubmit({ answer_boolean: true })}
            disabled={submitting}
            className="flex-1 rounded-md bg-green-50 border border-green-300 py-2 text-sm font-medium text-green-800 hover:bg-green-100 disabled:opacity-50"
          >
            Yes
          </button>
          <button
            onClick={() => onSubmit({ answer_boolean: false })}
            disabled={submitting}
            className="flex-1 rounded-md bg-red-50 border border-red-300 py-2 text-sm font-medium text-red-800 hover:bg-red-100 disabled:opacity-50"
          >
            No
          </button>
        </div>
      )}

      {/* Single select — chip buttons */}
      {question.question_type === 'single_select' && question.answer_options && (
        <div className="mt-3 flex flex-wrap gap-2">
          {question.answer_options.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelectedOption(opt === selectedOption ? null : opt)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                selectedOption === opt
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400'
              }`}
            >
              {labelFor(opt)}
            </button>
          ))}
          {selectedOption && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="ml-2 rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Confirm →'}
            </button>
          )}
        </div>
      )}

      {/* Numeric */}
      {question.question_type === 'numeric' && (
        <div className="mt-3 flex gap-2">
          <input
            type="number"
            value={numberValue}
            onChange={(e) => setNumberValue(e.target.value)}
            className="w-36 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter number"
          />
          <button
            onClick={handleSubmit}
            disabled={submitting || !numberValue}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Confirm →'}
          </button>
        </div>
      )}

      {/* Free text */}
      {question.question_type === 'free_text' && (
        <div className="mt-3 space-y-2">
          <textarea
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Type response…"
          />
          <button
            onClick={handleSubmit}
            disabled={submitting || !textValue.trim()}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Confirm →'}
          </button>
        </div>
      )}
    </div>
  );
}
