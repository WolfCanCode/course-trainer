import {
  component$,
  useSignal,
  useStore,
  useResource$,
  Resource,
} from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { getQuestion, type QuizQuestion } from "./get-question";

export default component$(() => {
  const loc = useLocation();
  const courseId = loc.params.courseId;
  const selected = useSignal<string | null>(null);
  const submitted = useSignal(false);
  const feedback = useStore<{ correct: boolean | null; explanation?: string }>({
    correct: null,
  });

  // Fetch question on load
  const questionResource = useResource$<QuizQuestion>(async () => {
    // Use courseId as topic
    return getQuestion(courseId.replace(/-/g, " "));
  });

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <Resource
        value={questionResource}
        onPending={() => <p>Loading question...</p>}
        onRejected={() => <p>Failed to load question.</p>}
        onResolved={(question) => (
          <div>
            <h1>Quiz: {courseId.replace(/-/g, " ")}</h1>
            <div
              style={{
                margin: "2rem 0",
                padding: "1rem",
                background: "#222",
                borderRadius: "8px",
                color: "#fff",
              }}
            >
              <p style={{ fontWeight: "bold" }}>{question.question}</p>
              <form
                preventdefault:submit
                onSubmit$={() => {
                  submitted.value = true;
                  feedback.correct = selected.value === question.correctAnswer;
                  feedback.explanation = question.explanation;
                }}
              >
                {question.options.map((opt) => (
                  <div key={opt} style={{ margin: "0.5rem 0" }}>
                    <label>
                      <input
                        type="radio"
                        name="answer"
                        value={opt}
                        checked={selected.value === opt}
                        disabled={submitted.value}
                        onInput$={() => (selected.value = opt)}
                      />
                      {opt}
                    </label>
                  </div>
                ))}
                <button
                  type="submit"
                  style={{
                    padding: "0.75rem 1.5rem",
                    fontSize: "1rem",
                    marginTop: "1.5rem",
                  }}
                  disabled={submitted.value || !selected.value}
                >
                  Submit Answer
                </button>
              </form>
              {submitted.value && (
                <div style={{ marginTop: "1.5rem" }}>
                  {feedback.correct ? (
                    <p style={{ color: "#0f0" }}>Correct! 🎉</p>
                  ) : (
                    <p style={{ color: "#f00" }}>Incorrect. 😢</p>
                  )}
                  {feedback.explanation && (
                    <div style={{ marginTop: "1rem" }}>
                      <strong>Explanation:</strong>
                      <div>{feedback.explanation}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      />
    </div>
  );
});
