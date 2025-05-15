import {
  component$,
  useSignal,
  useStore,
  useResource$,
  Resource,
  $,
} from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { getQuestion, type QuizQuestion } from "./get-question";
import { courseGroups } from "~/routes";

// Number of questions per certificate
const certificateQuestionCounts: Record<string, number> = {
  "aws-cloud-practitioner": 65,
  "aws-solutions-architect": 75,
  "azure-fundamentals": 40,
  "azure-administrator": 60,
};
const BATCH_SIZE = 10;

export default component$(() => {
  const loc = useLocation();
  const courseId = loc.params.courseId;
  const totalQuestions = certificateQuestionCounts[courseId] || 10;
  const submitted = useSignal(false);
  const loadingNext = useSignal(false);

  // Store all questions, answers, and feedback
  const state = useStore<{
    questions: QuizQuestion[];
    answers: Record<number, string>;
    feedback: { correct: boolean; explanation?: string }[];
    batch: number; // 0-based
  }>({
    questions: [],
    answers: {},
    feedback: [],
    batch: 0,
  });

  // Initial batch fetch
  const initialQuestionsResource = useResource$<QuizQuestion[]>(async () => {
    const topic = courseId.replace(/-/g, " ");
    return getQuestion(topic, BATCH_SIZE, []);
  });

  // Handler to fetch next batch
  const fetchNextBatch = $(async () => {
    loadingNext.value = true;
    const topic = courseId.replace(/-/g, " ");
    const exclude = state.questions.map((q) => q.question);
    const remaining = totalQuestions - state.questions.length;
    const count = Math.min(BATCH_SIZE, remaining);
    if (count <= 0) {
      loadingNext.value = false;
      return;
    }
    const nextQuestions = await getQuestion(topic, count, exclude);
    state.questions.push(...nextQuestions);
    state.batch++;
    loadingNext.value = false;
  });

  // Submit handler
  const handleSubmit = $(() => {
    submitted.value = true;
    state.feedback = state.questions.map((q, idx) => ({
      correct: state.answers[idx] === q.correctAnswer,
      explanation: q.explanation,
    }));
  });

  const courseName = courseGroups.find((group) =>
    group.courses.some((course) => course.id === courseId),
  )?.name;

  return (
    <div class="flex min-h-screen justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-2 py-8">
      <div class="w-full max-w-3xl">
        <Resource
          value={initialQuestionsResource}
          onPending={() => (
            <div class="flex h-96 flex-col items-center justify-center">
              <div class="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
              <p class="text-lg font-medium text-slate-600">
                Loading questions...
              </p>
            </div>
          )}
          onRejected={() => (
            <div class="relative mt-8 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
              Failed to load questions.
            </div>
          )}
          onResolved={(initialQuestions) => {
            if (state.questions.length === 0) {
              state.questions.push(...initialQuestions);
            }
            return (
              <div>
                <div class="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h1 class="text-3xl font-bold text-slate-800">
                    {courseName}
                  </h1>
                  <div class="text-base font-medium text-slate-600">
                    Progress:{" "}
                    <span class="font-bold text-blue-600">
                      {state.questions.length}
                    </span>{" "}
                    / {totalQuestions}
                  </div>
                </div>
                <form
                  preventdefault:submit
                  onSubmit$={handleSubmit}
                  class="space-y-8"
                >
                  {state.questions.map((question, idx) => (
                    <div
                      key={idx}
                      class="rounded-xl border border-slate-200 bg-white p-6 shadow-lg"
                    >
                      <div class="mb-2 text-lg font-semibold text-slate-800">
                        {idx + 1}. {question.question}
                      </div>
                      <div class="mt-2 flex flex-col gap-2">
                        {question.options.map((opt: string) => (
                          <label
                            key={opt}
                            class="group flex cursor-pointer items-center gap-3"
                          >
                            <input
                              type="radio"
                              name={`answer-${idx}`}
                              value={opt}
                              checked={state.answers[idx] === opt}
                              disabled={submitted.value}
                              onInput$={(_e: any, el: HTMLInputElement) =>
                                (state.answers[idx] = el.value)
                              }
                              class="h-5 w-5 rounded-full border-2 border-slate-300 accent-blue-600 transition focus:ring-2 focus:ring-blue-400"
                            />
                            <span class="text-slate-700 transition group-hover:text-blue-700">
                              {opt}
                            </span>
                          </label>
                        ))}
                      </div>
                      {submitted.value && (
                        <div class="mt-4">
                          {state.feedback[idx]?.correct ? (
                            <div class="mb-2 rounded border border-green-400 bg-green-100 px-4 py-2 text-green-700">
                              Correct! 🎉
                            </div>
                          ) : (
                            <div class="mb-2 rounded border border-red-400 bg-red-100 px-4 py-2 text-red-700">
                              Incorrect. 😢
                            </div>
                          )}
                          {state.feedback[idx]?.explanation && (
                            <div class="rounded border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700">
                              <strong>Explanation:</strong>
                              <div>{state.feedback[idx].explanation}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  <div class="mt-8 flex flex-col gap-4 sm:flex-row">
                    <button
                      type="submit"
                      class="w-full rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      disabled={
                        submitted.value ||
                        Object.keys(state.answers).length <
                          state.questions.length
                      }
                    >
                      Submit All
                    </button>
                    {state.questions.length < totalQuestions && (
                      <button
                        type="button"
                        class="w-full rounded-lg bg-slate-700 px-8 py-3 font-semibold text-white shadow transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                        disabled={loadingNext.value}
                        onClick$={fetchNextBatch}
                      >
                        {loadingNext.value
                          ? "Loading..."
                          : `Next ${Math.min(BATCH_SIZE, totalQuestions - state.questions.length)} Questions`}
                      </button>
                    )}
                  </div>
                  {state.questions.length >= totalQuestions && (
                    <div class="mt-8 text-center font-semibold text-blue-700">
                      <strong>All questions loaded.</strong>
                    </div>
                  )}
                </form>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
});
