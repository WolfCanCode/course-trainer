import { $, component$, useSignal, useStore } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { getQuestion, type QuizQuestion } from "./quiz/get-question";

const certificateQuestionCounts: Record<string, number> = {
  "aws-cloud-practitioner": 65,
  "aws-solutions-architect": 75,
  "azure-fundamentals": 40,
  "azure-administrator": 60,
};
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
  const totalQuestions = certificateQuestionCounts[courseId] || 10;
  const submitted = useSignal(false);
  const loadingNext = useSignal(false);
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
  const setCurrentQuestion = $((v: number) => (currentQuestion.value = v));

  const fetchInitialQuestions = $(async () => {
    loading.value = true;
    started.value = true;
    const topic = courseId.replace(/-/g, " ");
    try {
      const initialQuestions = await getQuestion(topic, BATCH_SIZE, []);
      state.questions.push(...initialQuestions);
    } catch (e) {
      // Optionally handle error
    }
    loading.value = false;
  });

  const fetchNextBatch = $(async () => {
    loadingNext.value = true;
    submitted.value = false;
    state.feedback = [];
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

  // Helper to count correct answers
  const correctCount = state.feedback.filter((f) => f?.correct).length;

  return (
    <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-2 py-8">
      <div class="mx-auto w-full max-w-md">
        <div class="mb-6 flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
          <div class="mb-4 flex w-full items-center justify-between">
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
            <div class="flex items-center gap-1 text-sm text-slate-500">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <path
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  d="M12 6v6l4 2"
                />
              </svg>
              2:00
            </div>
          </div>
          <div class="mb-6 h-1 w-full rounded-full bg-slate-200">
            <div
              class="h-1 rounded-full bg-blue-500 transition-all"
              style={{
                width: `${((currentQuestion.value + 1) / state.questions.length) * 100 || 0}%`,
              }}
            ></div>
          </div>
          <h2 class="mb-2 text-center text-xl font-bold text-blue-700">
            {name}
          </h2>
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
                {correctCount} / {state.questions.length}
              </div>
              <button
                type="button"
                class="w-full rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow transition hover:bg-blue-700"
                onClick$={() => (window.location.href = "/")}
              >
                Back to Home
              </button>
            </div>
          )}

          {/* Quiz UI (only show if not submitted) */}
          {!submitted.value && (
            <>
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
                <div class="flex h-60 flex-col items-center justify-center">
                  <div class="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
                  <p class="text-lg font-medium text-slate-600">
                    Loading questions...
                  </p>
                </div>
              )}
              {started.value &&
                !loading.value &&
                state.questions.length > 0 && (
                  <div class="w-full">
                    <div class="mb-4 text-sm font-medium text-purple-700">
                      Question {currentQuestion.value + 1} of{" "}
                      {state.questions.length}
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
                            class={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-base font-medium transition-all ${
                              state.answers[currentQuestion.value] === opt
                                ? "border-purple-500 bg-purple-50 text-purple-900 shadow"
                                : "border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50"
                            } ${submitted.value ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                          >
                            <span>{opt}</span>
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
                    {submitted.value && (
                      <div class="mb-4">
                        {state.feedback[currentQuestion.value]?.correct ? (
                          <div class="rounded border border-green-400 bg-green-100 px-4 py-2 text-green-700">
                            Correct! 🎉
                          </div>
                        ) : (
                          <div class="rounded border border-red-400 bg-red-100 px-4 py-2 text-red-700">
                            Incorrect. 😢
                          </div>
                        )}
                        {state.feedback[currentQuestion.value]?.explanation && (
                          <div class="mt-2 rounded border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700">
                            <strong>Explanation:</strong>
                            <div>
                              {
                                state.feedback[currentQuestion.value]
                                  .explanation
                              }
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <div class="mt-6">
                      {currentQuestion.value < state.questions.length - 1 ? (
                        <button
                          type="button"
                          class="w-full rounded-lg bg-black px-8 py-3 text-lg font-semibold text-white shadow transition hover:bg-slate-800 disabled:opacity-60"
                          disabled={!state.answers[currentQuestion.value]}
                          onClick$={() =>
                            setCurrentQuestion(currentQuestion.value + 1)
                          }
                        >
                          Next &rarr;
                        </button>
                      ) : (
                        <button
                          type="button"
                          class="w-full rounded-lg bg-black px-8 py-3 text-lg font-semibold text-white shadow transition hover:bg-slate-800 disabled:opacity-60"
                          disabled={
                            submitted.value ||
                            Object.keys(state.answers).length <
                              state.questions.length
                          }
                          onClick$={() => handleSubmit()}
                        >
                          Submit All
                        </button>
                      )}
                    </div>
                    {state.questions.length < totalQuestions &&
                      currentQuestion.value === state.questions.length - 1 && (
                        <button
                          type="button"
                          class="mt-4 w-full rounded-lg bg-slate-700 px-8 py-3 font-semibold text-white shadow transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={loadingNext.value}
                          onClick$={fetchNextBatch}
                        >
                          {loadingNext.value
                            ? "Loading..."
                            : `Next ${Math.min(BATCH_SIZE, totalQuestions - state.questions.length)} Questions`}
                        </button>
                      )}
                    {state.questions.length >= totalQuestions &&
                      currentQuestion.value === state.questions.length - 1 && (
                        <div class="mt-8 text-center font-semibold text-blue-700">
                          <strong>All questions loaded.</strong>
                        </div>
                      )}
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
});
