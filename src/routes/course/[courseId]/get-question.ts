import { server$ } from "@builder.io/qwik-city";

// --- Types ---
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string | string[]; // string for single, string[] for multiple-two
  // Optionally, add explanation or other fields if needed
  explanation?: string;
  type: "single" | "multiple-two"; // Indicates question type
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
const prompts: Record<
  string,
  {
    questionPrompt: (topic: string, count: number, exclude: string[]) => string;
  }
> = {
  en: {
    questionPrompt: (topic: string, count: number, exclude: string[]) =>
      `You are a professional certification quiz generator.

Task: Generate exactly ${count} brand new, exam-level multiple-choice questions for the “${topic}” certification exam. Each question should be EITHER:
  • A single-answer question (4 options, only 1 correct answer, type: "single")
  • OR a multiple-answer question (4 options, exactly 2 correct answers, type: "multiple-two")

For each question:
  • Specify the type as either "single" or "multiple-two".
  • For single-answer, return correctAnswer as a string. For multiple-two, return correctAnswer as an array of exactly 2 strings.
  • Each must have a short explanation after the answer, matching the style of official rationale.
  • Avoid these previous questions:
  ${exclude.length > 0 ? exclude.join("\n") : "None"}

Rules:
  • Use authentic exam language such as “What is the MOST appropriate…”, “Which TWO options BEST meet the requirement…”, or “What should the professional do FIRST…”.
  • Use real terminology and professional exam phrasing—avoid generic, simple, or easy questions.
  • Return ONLY valid JSON as shown below. Do NOT include extra text or formatting.

Example output:
[
  {
    "question": "Which TWO of the following are best practices for securing cloud resources?",
    "options": [
      "Enable multi-factor authentication",
      "Use default passwords",
      "Regularly update software",
      "Share credentials with team"
    ],
    "correctAnswer": [
      "Enable multi-factor authentication",
      "Regularly update software"
    ],
    "explanation": "MFA and regular updates are best practices; default passwords and sharing credentials are not.",
    "type": "multiple-two"
  },
  {
    "question": "What is the MOST appropriate way to restrict access to sensitive data in a cloud environment?",
    "options": [
      "Use IAM roles",
      "Share credentials",
      "Disable logging",
      "Allow public access"
    ],
    "correctAnswer": "Use IAM roles",
    "explanation": "IAM roles provide fine-grained access control, which is best for restricting access.",
    "type": "single"
  }
]

Strictly return ONLY a JSON array. No markdown, no extra commentary.`,
  },
};

export const getQuestion = server$(async function (
  topic: string,
  count: number,
  exclude: string[] = [],
  locale: string = "en",
): Promise<QuizQuestion[]> {
  const token = import.meta.env.PUBLIC_HUGGINGFACE_TOKEN;
  if (!token) throw new Error("PUBLIC_HUGGINGFACE_TOKEN token not set");

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
            max_tokens: 8092,
            temperature: 1.0,
            messages: [
              {
                role: "user",
                content: prompts[locale].questionPrompt(topic, count, exclude),
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
        return JSON.parse(cleaned) as QuizQuestion[];
      } catch (error) {
        console.error("Error parsing question JSON:", error);
        throw error;
      }
    },
    3,
    500,
  );
});
