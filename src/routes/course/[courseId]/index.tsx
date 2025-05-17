import { $, component$, useSignal, useStore } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { getQuestion, type QuizQuestion } from "./quiz/get-question";

const BATCH_SIZE = 10;

const courseNames: Record<string, string> = {
  "aws-cloud-practitioner": "AWS Cloud Practitioner",
  "aws-solutions-architect": "AWS Solutions Architect",
  "azure-fundamentals": "Azure Fundamentals",
  "azure-administrator": "Azure Administrator",
};
const courseDescriptions: Record<string, string> = {
  "aws-cloud-practitioner":
    "Prepare for the AWS Cloud Practitioner certification with foundational cloud concepts and AWS services.",
  "aws-solutions-architect":
    "Master AWS architecture and design for the Solutions Architect certification.",
  "azure-fundamentals":
    "Learn the basics of Microsoft Azure and cloud computing for the Azure Fundamentals exam.",
  "azure-administrator":
    "Get ready for the Azure Administrator certification with hands-on cloud management skills.",
};

export default component$(() => {
  const loc = useLocation();
  const courseId = loc.params.courseId;
  const submitted = useSignal(false);
  const loading = useSignal(false);
  const started = useSignal(false);

  const state = useStore<{
    questions: QuizQuestion[];
    answers: Record<number, string>;
    feedback: { correct: boolean; explanation?: string }[];
    batch: number;
  }>({
    questions: [],
    answers: {},
    feedback: [],
    batch: 0,
  });

  const currentQuestion = useSignal(0);

  const prefetched = useSignal<QuizQuestion[] | null>(null);
  const noMoreQuestions = useSignal(false);
  const prefetching = useSignal(false);

  const fetchQuestions = $(async (exclude: string[] = []) => {
    const topic = courseId.replace(/-/g, " ");
    const count = BATCH_SIZE;
    const questions = await getQuestion(topic, count, exclude);
    return questions;
  });

  const fetchInitialQuestions = $(async () => {
    loading.value = true;
    started.value = true;
    submitted.value = false;
    state.feedback = [];
    state.answers = {};
    state.questions.length = 0;
    prefetched.value = null;
    noMoreQuestions.value = false;
    currentQuestion.value = 0;
    const initialQuestions = await fetchQuestions();
    state.questions.push(...initialQuestions);
    loading.value = false;
  });

  const handleSubmit = $(() => {
    submitted.value = true;
    state.feedback = state.questions.map((q, idx) => ({
      correct: state.answers[idx] === q.correctAnswer,
      explanation: q.explanation,
    }));
  });

  const name = courseNames[courseId] || courseId;

  const desc =
    courseDescriptions[courseId] || "Start your certification journey.";

  // Helper to count correct answers and answered questions
  const answeredIndexes = Object.keys(state.answers).map(Number);
  const answeredCount = answeredIndexes.length;
  const correctCount = answeredIndexes.filter(
    (idx) => state.feedback[idx]?.correct,
  ).length;

  // Prefetch next batch when reaching question 5 of the current batch
  if (
    !submitted.value &&
    started.value &&
    !loading.value &&
    state.questions.length > 0 &&
    currentQuestion.value === state.questions.length - 6 &&
    !prefetched.value &&
    !noMoreQuestions.value &&
    !prefetching.value
  ) {
    prefetching.value = true;
    fetchQuestions(state.questions.map((q) => q.question)).then((next) => {
      prefetched.value = next.length > 0 ? next : null;
      prefetching.value = false;
      if (!next.length) noMoreQuestions.value = true;
    });
  }

  return (
    <div class="flex min-h-screen items-start justify-start px-2 py-8">
      <div class="mb-6 flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div class="mb-4 flex w-full items-center justify-between">
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="text-slate-400 transition hover:text-blue-600"
              onClick$={() => history.back()}
              aria-label="Back"
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div class="truncate text-lg font-semibold text-slate-800">
              {name}
            </div>
          </div>
          {/* Submit All icon button in header */}
          {started.value && !loading.value && !submitted.value && (
            <button
              type="button"
              class="ml-2 rounded-full bg-emerald-100 p-2 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
              title="Submit All"
              disabled={Object.keys(state.answers).length === 0}
              onClick$={() => handleSubmit()}
            >
              Submit
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#059669"
                  stroke-width="2"
                  fill="#34d399"
                />
                <path
                  d="M8 13l2.5 2.5L16 10"
                  stroke="#fff"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          )}
        </div>

        <div class="mb-6 h-1 w-full rounded-full bg-blue-500"></div>
        <p class="mb-6 text-center text-slate-600">{desc}</p>

        {/* Results screen */}
        {submitted.value && (
          <div class="flex flex-col items-center justify-center py-12">
            <div class="mb-4 flex items-center justify-center">
              <span class="inline-flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 text-purple-600 shadow-lg">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
            </div>
            <div class="mb-2 text-2xl font-bold text-purple-700">
              Congratulations!
            </div>
            <div class="mb-2 text-lg text-slate-700">You scored</div>
            <div class="mb-6 text-3xl font-extrabold text-blue-700">
              {correctCount} / {answeredCount}
            </div>
            <button
              type="button"
              class="mb-8 w-full rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow transition hover:bg-blue-700"
              onClick$={() => (window.location.href = "/")}
            >
              Back to Home
            </button>

            {/* Review Answers Section */}
            <div class="mt-4 w-full">
              <h3 class="mb-4 text-lg font-bold text-slate-800">
                Review Answers
              </h3>
              <div class="flex flex-col gap-6">
                {state.questions.map((q, idx) =>
                  state.answers[idx] ? (
                    <div
                      key={idx}
                      class={`rounded-xl border bg-slate-50 p-4 shadow-sm ${state.feedback[idx]?.correct === true ? "border-emerald-500" : state.feedback[idx]?.correct === false ? "border-rose-500" : "border-slate-200"}`}
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
                            state.feedback[idx]?.correct
                              ? "text-green-700"
                              : "text-red-700"
                          }
                        >
                          {state.answers[idx]}
                        </span>
                      </div>
                      <div class="mb-1 text-sm">
                        <span class="font-medium">Correct answer:</span>{" "}
                        <span class="text-blue-700">{q.correctAnswer}</span>
                      </div>
                      {q.explanation && (
                        <div class="mt-2 rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                          <strong>Explanation:</strong>{" "}
                          <span>{q.explanation}</span>
                        </div>
                      )}
                    </div>
                  ) : null,
                )}
              </div>
            </div>
            {/* Next 10 Questions button after submit if more questions available */}
            {noMoreQuestions.value &&
              currentQuestion.value === state.questions.length && (
                <div class="mt-8 text-center font-semibold text-blue-700">
                  <strong>
                    No more questions available. You have completed the quiz!
                  </strong>
                </div>
              )}
          </div>
        )}

        {/* Quiz UI (only show if not submitted) */}
        {!submitted.value && (
          <div class="w-full">
            {!started.value && (
              <button
                class="w-full rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow transition hover:bg-blue-700 disabled:opacity-60"
                onClick$={fetchInitialQuestions}
                disabled={loading.value}
              >
                {loading.value ? "Loading..." : "Start Quiz"}
              </button>
            )}
            {started.value && loading.value && (
              <div class="flex h-[400px] w-full flex-col items-center justify-center">
                {/* Question skeleton */}
                <div class="relative mb-8 h-7 w-3/4 overflow-hidden rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200">
                  <div class="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                </div>
                {/* Option skeletons */}
                <div class="mb-8 flex w-full flex-col gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      class="relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200"
                    >
                      <div class="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                    </div>
                  ))}
                </div>
                {/* Button skeleton */}
                <div class="relative h-12 w-1/2 overflow-hidden rounded-lg bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300">
                  <div class="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                </div>
              </div>
            )}
            {started.value && !loading.value && state.questions.length > 0 && (
              <div class="w-full">
                <div class="mb-4 text-sm font-medium text-purple-700">
                  Question {currentQuestion.value + 1}
                </div>
                <div class="mb-4 text-lg font-bold text-slate-800">
                  {state.questions[currentQuestion.value].question}
                </div>
                <div class="mb-8 flex flex-col gap-3">
                  {state.questions[currentQuestion.value].options.map(
                    (opt: string) => (
                      <button
                        key={opt}
                        type="button"
                        disabled={submitted.value}
                        onClick$={() =>
                          (state.answers[currentQuestion.value] = opt)
                        }
                        class={`flex w-full items-center justify-start rounded-xl border px-4 py-3 text-base font-medium transition-all ${
                          state.answers[currentQuestion.value] === opt
                            ? "border-purple-500 bg-purple-50 text-purple-900 shadow"
                            : "border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50"
                        } ${submitted.value ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                      >
                        <span class="flex-1 text-left">{opt}</span>
                        {state.answers[currentQuestion.value] === opt && (
                          <span class="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-white">
                            <svg
                              width="16"
                              height="16"
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
                      </button>
                    ),
                  )}
                </div>
                {state.questions.length > 0 &&
                  currentQuestion.value < state.questions.length && (
                    <div class="mt-6">
                      <button
                        type="button"
                        class="flex w-full items-center justify-center rounded-lg bg-black px-8 py-3 text-lg font-semibold text-white shadow transition hover:bg-slate-800 disabled:opacity-60"
                        disabled={
                          !state.answers[currentQuestion.value] ||
                          (currentQuestion.value ===
                            state.questions.length - 1 &&
                            prefetching.value)
                        }
                        onClick$={() => {
                          if (
                            currentQuestion.value ===
                              state.questions.length - 1 &&
                            prefetched.value
                          ) {
                            state.questions.push(...prefetched.value);
                            prefetched.value = null;
                            currentQuestion.value++;
                          } else {
                            currentQuestion.value++;
                          }
                        }}
                      >
                        {currentQuestion.value === state.questions.length - 1 &&
                        prefetching.value ? (
                          <svg
                            class="mr-2 h-5 w-5 animate-spin text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              class="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              stroke-width="4"
                            ></circle>
                            <path
                              class="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8z"
                            ></path>
                          </svg>
                        ) : null}
                        Next &rarr;
                      </button>
                    </div>
                  )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
