import { $, component$, useSignal, useStore } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { getQuestion, type QuizQuestion } from "./get-question";
import { QuestionDisplay } from "../../../components/quiz/QuestionDisplay";
import { ResultsReview } from "../../../components/quiz/ResultsReview";
import { allCourses } from "../../../lib/course-data";

const BATCH_SIZE = 10;
const PREFETCH_OFFSET = 6; // Prefetch when 6 questions left

export default component$(() => {
  const loc = useLocation();
  const courseId = loc.params.courseId;
  const submitted = useSignal(false);
  const loading = useSignal(false);
  const started = useSignal(false);
  const error = useSignal<string | null>(null);

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
    try {
      error.value = null;
      return await getQuestion(topic, count, exclude);
    } catch (err) {
      noMoreQuestions.value = true;
      error.value = "Failed to fetch questions. Please try again later.";
      return [];
    }
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
    error.value = null;
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

  const course = allCourses.find((c) => c.id === courseId);
  const name = course?.name || courseId;
  const desc = course?.description || "Start your certification journey.";

  // Helper to count correct answers and answered questions
  const answeredIndexes = Object.keys(state.answers).map(Number);
  const answeredCount = answeredIndexes.length;
  const correctCount = answeredIndexes.filter(
    (idx) => state.feedback[idx]?.correct,
  ).length;

  // Prefetch next batch when reaching question PREFETCH_OFFSET of the current batch
  if (
    !submitted.value &&
    started.value &&
    !loading.value &&
    state.questions.length > 0 &&
    currentQuestion.value === state.questions.length - PREFETCH_OFFSET &&
    !prefetched.value &&
    !noMoreQuestions.value &&
    !prefetching.value
  ) {
    prefetching.value = true;
    fetchQuestions(state.questions.map((q) => q.question)).then((next) => {
      prefetched.value = next.length > 0 ? next : null;
      prefetching.value = false;
      if (!next.length) {
        noMoreQuestions.value = true;
      }
    });
  }

  return (
    <div class="animate-fade-in flex items-start justify-start px-4 pt-2 pb-8">
      <div class="mb-6 flex w-full flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div class="mb-4 flex w-full items-center justify-between">
          <div class="flex w-full items-center gap-2">
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
            <div
              class="marquee w-full text-lg font-semibold text-slate-800"
              title={name}
            >
              <span class="marquee-content">{name}</span>
            </div>
          </div>
          {/* Submit All icon button in header */}
        </div>

        <div class="mb-6 h-[0.5px] w-full rounded-full bg-gray-300"></div>
        {!started.value && (
          <p class="mb-6 text-center text-slate-600">{desc}</p>
        )}

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
            <ResultsReview
              questions={state.questions}
              answers={state.answers}
              feedback={state.feedback}
            />
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
            {error.value && (
              <div class="mb-4 rounded border border-red-400 bg-red-50 px-4 py-3 text-red-700">
                {error.value}
              </div>
            )}
            {!started.value && (
              <button
                class="w-full rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow transition hover:bg-blue-700 disabled:opacity-60"
                onClick$={fetchInitialQuestions}
                disabled={loading.value}
              >
                Start Quiz
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
                  <div class="flex items-center justify-between">
                    <div>Question {currentQuestion.value + 1}</div>
                    {started.value && !loading.value && !submitted.value && (
                      <button
                        type="button"
                        class="ml-2 border-none font-bold text-green-800 transition disabled:cursor-not-allowed disabled:opacity-50"
                        title="Submit All"
                        disabled={Object.keys(state.answers).length === 0}
                        onClick$={() => handleSubmit()}
                      >
                        Check Answers
                      </button>
                    )}
                  </div>
                </div>
                <QuestionDisplay
                  question={state.questions[currentQuestion.value].question}
                  options={state.questions[currentQuestion.value].options}
                  selected={state.answers[currentQuestion.value]}
                  onSelect$={$(
                    (opt) => (state.answers[currentQuestion.value] = opt),
                  )}
                  disabled={submitted.value}
                />
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
