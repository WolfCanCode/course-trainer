import { server$ } from "@builder.io/qwik-city";

// --- Types ---
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  // Optionally, add explanation or other fields if needed
  explanation?: string;
}

// Simple retry utility
async function retry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 500,
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 1) throw err;
    await new Promise((res) => setTimeout(res, delay));
    return retry(fn, retries - 1, delay);
  }
}

// Simple prompt generator (customize as needed)
const prompts: Record<string, { questionPrompt: (topic: string) => string }> = {
  en: {
    questionPrompt: (topic: string) =>
      `Generate a multiple-choice question for the ${topic} certificate exam. Return *ONLY* *JSON* like the following:
      {
        "question": string,
        "options": string[],
        "correctAnswer": string,
        "explanation": string
      }`,
  },
};

export const getQuestion = server$(async function (
  topic: string,
  locale: string = "en",
): Promise<QuizQuestion> {
  const token = process.env.PUBLIC_HUGGINGFACE_TOKEN;
  if (!token) throw new Error("HuggingFace token not set");

  return retry(
    async () => {
      const response = await fetch(
        "https://router.huggingface.co/novita/v3/openai/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-4-maverick-17b-128e-instruct-fp8",
            stream: false,
            max_tokens: 1024,
            temperature: 1.0,
            messages: [
              {
                role: "user",
                content: prompts[locale].questionPrompt(topic),
              },
            ],
          }),
        },
      );

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content ?? "";
      const cleaned = raw
        .replace(/```json/gi, "")
        .replace(/```/gi, "")
        .replace(/\\\*/g, "*")
        .trim();
      try {
        return JSON.parse(cleaned) as QuizQuestion;
      } catch (error) {
        console.error("Error parsing question JSON:", error);
        throw error;
      }
    },
    3,
    500,
  );
});
