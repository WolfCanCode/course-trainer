import { component$, type QRL } from "@builder.io/qwik";

interface QuestionDisplayProps {
  question: string;
  options: string[];
  selected: string | undefined;
  onSelect$: QRL<(opt: string) => void>;
  disabled?: boolean;
}

export const QuestionDisplay = component$<QuestionDisplayProps>(
  ({ question, options, selected, onSelect$, disabled }) => {
    return (
      <div>
        <div class="mb-4 text-lg font-bold text-slate-800">{question}</div>
        <div class="mb-8 flex flex-col gap-3">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              disabled={disabled}
              onClick$={() => onSelect$(opt)}
              class={`flex w-full items-center justify-start rounded-xl border px-4 py-3 text-base font-medium transition-all ${
                selected === opt
                  ? "border-purple-500 bg-purple-50 text-purple-900 shadow"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50"
              } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
            >
              <span class="flex-1 text-left">{opt}</span>
              {selected === opt && (
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
      </div>
    );
  },
);
