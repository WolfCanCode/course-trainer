import { component$ } from "@builder.io/qwik";

interface ResultsReviewProps {
  questions: {
    question: string;
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
          {questions.map((q, idx) =>
            answers[idx] ? (
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
                <div class="mb-1 text-sm">
                  <span class="font-medium">Your answer:</span>{" "}
                  <span
                    class={
                      feedback[idx]?.correct ? "text-green-700" : "text-red-700"
                    }
                  >
                    {answers[idx]}
                  </span>
                </div>
                <div class="mb-1 text-sm">
                  <span class="font-medium">Correct answer:</span>{" "}
                  <span class="text-blue-700">{q.correctAnswer}</span>
                </div>
                {q.explanation && (
                  <div class="mt-2 rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                    <strong>Explanation:</strong> <span>{q.explanation}</span>
                  </div>
                )}
              </div>
            ) : null,
          )}
        </div>
      </div>
    );
  },
);
