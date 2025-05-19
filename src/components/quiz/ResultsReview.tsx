import { component$ } from "@builder.io/qwik";

interface ResultsReviewProps {
  questions: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
  }[];
  answers: Record<number, string>;
  feedback: { correct: boolean; explanation?: string }[];
}

export const ResultsReview = component$<ResultsReviewProps>(
  ({ questions, answers, feedback }) => {
    return (
      <div class="mt-4 w-full">
        <h3 class="mb-4 text-lg font-bold text-slate-800">Review Answers</h3>
        <div class="flex flex-col gap-6">
          {questions.map((q, idx) => {
            const userAnswer = answers[idx];
            if (!userAnswer) return null;
            // Only show user's answer and correct answer (if different)
            const showOptions = [userAnswer];
            if (userAnswer !== q.correctAnswer)
              showOptions.push(q.correctAnswer);
            // Remove duplicates
            const uniqueOptions = Array.from(new Set(showOptions));
            return (
              <div
                key={idx}
                class={`rounded-xl border bg-slate-50 p-4 shadow-sm ${
                  feedback[idx]?.correct === true
                    ? "border-emerald-500"
                    : feedback[idx]?.correct === false
                      ? "border-rose-500"
                      : "border-slate-200"
                }`}
              >
                <div class="mb-2 flex flex-row items-start gap-2">
                  <div class="text-base leading-snug font-semibold text-slate-800">
                    {idx + 1}. {q.question}
                  </div>
                </div>
                <div class="mb-3 flex flex-col gap-2">
                  {uniqueOptions.map((opt) => (
                    <div
                      key={opt}
                      class={`flex items-center gap-2 rounded-lg border px-3 py-2 text-base font-medium ${
                        opt === q.correctAnswer
                          ? "border-blue-500 bg-blue-50 text-blue-900"
                          : opt === userAnswer
                            ? feedback[idx]?.correct
                              ? "border-green-500 bg-green-50 text-green-900"
                              : "border-red-500 bg-red-50 text-red-900"
                            : "border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                      <span class="flex-1 text-left">{opt}</span>
                      {opt === q.correctAnswer && (
                        <span class="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700">
                          <svg
                            width="18"
                            height="18"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
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
                      {opt === userAnswer && (
                        <span class="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                          <svg
                            width="18"
                            height="18"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
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
                    </div>
                  ))}
                </div>
                {q.explanation && (
                  <div class="mt-2 rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                    <strong>Explanation:</strong> <span>{q.explanation}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
