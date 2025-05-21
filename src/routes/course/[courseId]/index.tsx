import {
  $,
  component$,
  useSignal,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";
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
    answers: Record<number, string | string[]>;
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

  const instantFeedback = useSignal<null | {
    correct: boolean;
    explanation?: string;
    correctAnswer: string;
  }>(null);

  const checked = useSignal(false);

  const marqueeRef = useSignal<HTMLDivElement>();
  const marqueeContentRef = useSignal<HTMLSpanElement>();
  const shouldAnimate = useSignal(false);
  const marqueeDistance = useSignal(0);

  const isMobile = useSignal(false);

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
    state.feedback = state.questions.map((q, idx) => {
      const userAnswer = state.answers[idx];
      if (q.type === "multiple-two") {
        // Compare arrays (order-insensitive)
        const a = Array.isArray(userAnswer) ? [...userAnswer].sort() : [];
        const b = Array.isArray(q.correctAnswer)
          ? [...q.correctAnswer].sort()
          : [];
        const correct =
          a.length === 2 && b.length === 2 && a[0] === b[0] && a[1] === b[1];
        return { correct, explanation: q.explanation };
      } else {
        return {
          correct: userAnswer === q.correctAnswer,
          explanation: q.explanation,
        };
      }
    });
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

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }: { track: any }) => {
    track(() => currentQuestion.value);
    checked.value = false;
    instantFeedback.value = null;
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    setTimeout(() => {
      const container = marqueeRef.value;
      const content = marqueeContentRef.value;
      if (container && content) {
        const containerWidth = container.offsetWidth;
        const contentWidth = content.scrollWidth;
        if (contentWidth > containerWidth) {
          shouldAnimate.value = true;
          marqueeDistance.value = contentWidth - containerWidth;
        } else {
          shouldAnimate.value = false;
          marqueeDistance.value = 0;
        }
      }
    }, 0);
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 640;
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    cleanup(() => window.removeEventListener("resize", checkMobile));
  });

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
            <div class="min-w-0 flex-1">
              {isMobile.value ? (
                <div
                  ref={marqueeRef}
                  class="relative flex w-full flex-col justify-center overflow-hidden text-lg font-semibold whitespace-nowrap text-slate-800"
                  title={name}
                  style={{ height: "2.5rem" }}
                >
                  <span
                    ref={marqueeContentRef}
                    class={
                      shouldAnimate.value
                        ? "animate-marquee-x inline-block will-change-transform"
                        : "inline-block"
                    }
                    style={
                      shouldAnimate.value
                        ? {
                            animationDuration: `${Math.max(4, marqueeDistance.value / 40)}s`,
                            "--marquee-x": `-${marqueeDistance.value}px`,
                          }
                        : {}
                    }
                  >
                    {name}
                  </span>
                </div>
              ) : (
                <div
                  class="w-full truncate text-lg font-semibold text-slate-800"
                  title={name}
                >
                  {name}
                </div>
              )}
            </div>
            {Object.keys(state.answers).length > 0 && (
              <button
                class="ml-2 flex items-center gap-1 rounded border border-green-200 bg-white px-3 py-1 text-xs font-semibold text-green-700 transition hover:bg-green-50"
                type="button"
                onClick$={() => handleSubmit()}
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Finish
              </button>
            )}
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
              questions={state.questions.map((q) => ({
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
                type: q.type,
              }))}
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
                {/* Responsive Quiz Header */}
                <div class="mb-4 flex flex-col gap-2 px-2 py-2 sm:flex-row sm:items-center sm:justify-between">
                  <div class="flex flex-row flex-wrap items-center gap-2">
                    <span class="text-sm font-bold text-purple-700">
                      Question {currentQuestion.value + 1}
                    </span>
                    {state.questions[currentQuestion.value].type ===
                    "multiple-two" ? (
                      <span class="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                        <svg
                          class="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <rect
                            x="4"
                            y="4"
                            width="16"
                            height="16"
                            rx="2"
                            stroke-width="2"
                          />
                          <path
                            d="M9 12l2 2 4-4"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        Select TWO
                      </span>
                    ) : (
                      <span class="inline-flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                        <svg
                          class="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="12" cy="12" r="6" stroke-width="2" />
                        </svg>
                        Single Choice
                      </span>
                    )}
                  </div>
                </div>
                <QuestionDisplay
                  question={state.questions[currentQuestion.value].question}
                  options={state.questions[currentQuestion.value].options}
                  selected={
                    state.answers[currentQuestion.value] ??
                    (state.questions[currentQuestion.value].type ===
                    "multiple-two"
                      ? []
                      : "")
                  }
                  type={state.questions[currentQuestion.value].type}
                  onSelect$={$((opt: string) => {
                    const q = state.questions[currentQuestion.value];
                    if (q.type === "multiple-two") {
                      const prev = Array.isArray(
                        state.answers[currentQuestion.value],
                      )
                        ? [
                            ...(state.answers[
                              currentQuestion.value
                            ] as string[]),
                          ]
                        : [];
                      if (prev.includes(opt)) {
                        state.answers[currentQuestion.value] = prev.filter(
                          (o) => o !== opt,
                        );
                      } else if (prev.length < 2) {
                        state.answers[currentQuestion.value] = [...prev, opt];
                      }
                    } else {
                      state.answers[currentQuestion.value] = opt;
                    }
                  })}
                  disabled={checked.value}
                  checked={checked.value}
                  correctAnswer={
                    state.questions[currentQuestion.value].correctAnswer
                  }
                  explanation={
                    state.questions[currentQuestion.value].explanation
                  }
                />
                {state.questions.length > 0 &&
                  currentQuestion.value < state.questions.length && (
                    <div class="mt-6">
                      {!checked.value ? (
                        <button
                          type="button"
                          class="flex w-full items-center justify-center rounded-lg bg-black px-8 py-3 text-lg font-semibold text-white shadow transition hover:bg-slate-800 disabled:opacity-60"
                          disabled={(() => {
                            const ans = state.answers[currentQuestion.value];
                            const q = state.questions[currentQuestion.value];
                            if (q.type === "multiple-two") {
                              return !Array.isArray(ans) || ans.length !== 2;
                            } else {
                              return !ans;
                            }
                          })()}
                          onClick$={() => {
                            checked.value = true;
                          }}
                        >
                          Check
                        </button>
                      ) : (
                        <button
                          type="button"
                          class="flex w-full items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow transition hover:bg-blue-700 disabled:opacity-60"
                          onClick$={() => {
                            instantFeedback.value = null;
                            checked.value = false;
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
                          Next &rarr;
                        </button>
                      )}
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
