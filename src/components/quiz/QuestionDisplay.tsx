import { component$, type QRL } from "@builder.io/qwik";

interface QuestionDisplayProps {
  question: string;
  options: string[];
  selected: string | undefined;
  onSelect$: QRL<(opt: string) => void>;
  disabled?: boolean;
  checked?: boolean;
  correctAnswer?: string;
  explanation?: string;
  instantFeedback?: {
    correct: boolean;
    explanation?: string;
    correctAnswer: string;
  } | null;
}

export const QuestionDisplay = component$<QuestionDisplayProps>(
  ({
    question,
    options,
    selected,
    onSelect$,
    disabled,
    checked,
    correctAnswer,
    explanation,
    instantFeedback,
  }) => {
    // After 'Check', only show user's choice and correct answer
    let displayOptions = options;
    if (checked && selected && correctAnswer) {
      displayOptions = [selected];
      if (selected !== correctAnswer) displayOptions.push(correctAnswer);
      displayOptions = Array.from(new Set(displayOptions));
    }
    return (
      <div>
        <div class="mb-4 text-lg font-bold text-slate-800">{question}</div>
        <div class="mb-8 flex flex-col gap-3">
          {displayOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              disabled={disabled}
              onClick$={() => onSelect$(opt)}
              class={`flex w-full items-center justify-start rounded-xl border px-4 py-3 text-base font-medium transition-all ${
                checked && correctAnswer
                  ? opt === correctAnswer
                    ? "border-green-500 bg-green-50 text-green-900"
                    : opt === selected
                      ? instantFeedback?.correct
                        ? "border-green-500 bg-green-50 text-green-900"
                        : "border-red-500 bg-red-50 text-red-900"
                      : "border-slate-200 bg-white text-slate-700"
                  : selected === opt
                    ? "border-purple-500 bg-purple-50 text-purple-900 shadow"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50"
              } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
            >
              <span class="flex-1 text-left">{opt}</span>
              {checked && correctAnswer && opt === correctAnswer && (
                <span class="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              )}
              {checked && selected && opt === selected && (
                <span class="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="8"
                      r="4"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <path
                      d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </span>
              )}
              {!checked && selected === opt && (
                <span class="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-white">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
        {checked && explanation && (
          <div class="mb-6 rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <strong>Explanation:</strong> <span>{explanation}</span>
          </div>
        )}
      </div>
    );
  },
);
