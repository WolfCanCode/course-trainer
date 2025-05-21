import { component$, type QRL } from "@builder.io/qwik";

interface QuestionDisplayProps {
  question: string;
  options: string[];
  selected: string | string[];
  onSelect$: QRL<(opt: string) => void>;
  type: "single" | "multiple-two";
  disabled?: boolean;
  checked?: boolean;
  correctAnswer?: string | string[];
  explanation?: string;
  currentIndex?: number; // For progress bar (optional)
  totalQuestions?: number; // For progress bar (optional)
}

export const QuestionDisplay = component$<QuestionDisplayProps>(
  ({
    question,
    options,
    selected,
    onSelect$,
    type,
    disabled,
    checked,
    correctAnswer,
    explanation,
    currentIndex,
    totalQuestions,
  }) => {
    // For checked state, show only selected and correct answers
    let displayOptions = options;
    if (checked && selected && correctAnswer) {
      if (type === "multiple-two") {
        const sel = Array.isArray(selected) ? selected : [];
        const corr = Array.isArray(correctAnswer) ? correctAnswer : [];
        displayOptions = Array.from(new Set([...sel, ...corr]));
      } else {
        displayOptions = [selected as string];
        if (selected !== correctAnswer)
          displayOptions.push(correctAnswer as string);
        displayOptions = Array.from(new Set(displayOptions));
      }
    }
    // Helper for multiple-two
    const isChecked = (opt: string) =>
      Array.isArray(selected) && selected.includes(opt);
    const selectedCount = Array.isArray(selected) ? selected.length : 0;
    // Helper for feedback
    const isCorrect = (opt: string) =>
      type === "multiple-two"
        ? Array.isArray(correctAnswer) && correctAnswer.includes(opt)
        : correctAnswer === opt;
    const isIncorrect = (opt: string) =>
      type === "multiple-two"
        ? Array.isArray(selected) &&
          selected.includes(opt) &&
          !(Array.isArray(correctAnswer) && correctAnswer.includes(opt))
        : selected === opt && correctAnswer !== opt;
    const isSelected = (opt: string) =>
      type === "multiple-two"
        ? Array.isArray(selected) && selected.includes(opt)
        : selected === opt;
    return (
      <div>
        {/* Progress Bar (optional) */}
        {typeof currentIndex === "number" &&
          typeof totalQuestions === "number" && (
            <div class="mb-4 h-2 w-full rounded-full bg-slate-200">
              <div
                class="h-2 rounded-full bg-purple-500 transition-all"
                style={{
                  width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                }}
              ></div>
            </div>
          )}
        {/* Question Type Badge */}
        <div class="mb-2 flex items-center gap-2">
          {type === "multiple-two" ? (
            <span class="rounded bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
              Select TWO
            </span>
          ) : (
            <span class="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
              Single Choice
            </span>
          )}
        </div>
        <div class="mb-4 text-base font-bold text-slate-800">{question}</div>
        {type === "multiple-two" && (
          <div class="mb-2 text-xs font-medium text-blue-700">
            Select exactly two options.
          </div>
        )}
        <div class="mb-8 flex flex-col gap-3">
          {displayOptions.map((opt) => (
            <label
              key={opt}
              class={`group flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-2 text-sm font-medium shadow-sm transition-all ${isSelected(opt) ? "scale-105 border-purple-600 bg-purple-50" : "border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50"} ${checked && isCorrect(opt) ? "border-green-500 bg-green-50" : ""} ${checked && isIncorrect(opt) ? "border-red-500 bg-red-50" : ""} `}
              style={{ transition: "all 0.15s" }}
            >
              {type === "multiple-two" ? (
                <input
                  type="checkbox"
                  checked={isChecked(opt)}
                  disabled={
                    disabled ||
                    (!isChecked(opt) && selectedCount >= 2 && !checked)
                  }
                  onChange$={() => onSelect$(opt)}
                  class="h-5 w-5 accent-purple-600"
                />
              ) : (
                <input
                  type="radio"
                  checked={selected === opt}
                  disabled={disabled}
                  onChange$={() => onSelect$(opt)}
                  class="h-5 w-5 accent-purple-600"
                />
              )}
              <span class="flex-1 text-left">{opt}</span>
              {/* Feedback icons */}
              {checked && isCorrect(opt) && (
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
              {checked && isSelected(opt) && (
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
              {!checked && isSelected(opt) && (
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
            </label>
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
