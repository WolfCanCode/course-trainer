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
const prompts: Record<
  string,
  {
    questionPrompt: (topic: string, count: number, exclude: string[]) => string;
  }
> = {
  en: {
    questionPrompt: (topic: string, count: number, exclude: string[]) =>
      `You are a professional certification quiz generator.

Task: Generate exactly ${count} brand new, exam-level multiple-choice questions for the “${topic}” certification exam.
	•	Questions must closely mirror the style, scenario-based complexity, and phrasing used in actual “${topic}” exams.
	•	Include a realistic mix: conceptual, scenario-based, best practices, security, pricing/cost, troubleshooting, and service limitation questions—depending on the real exam content.
	•	Use authentic exam language such as “What is the MOST appropriate…”, “Which option BEST meets the requirement…”, or “What should the professional do FIRST…”.
	•	Avoid these previous questions:
  ${exclude.length > 0 ? exclude.join("\n") : "None"}

Rules:
	•	Each question MUST have 4 options, only 1 correct answer, and realistic distractors.
	•	Each must have a short explanation after the answer, matching the style of official rationale.
	•	Use real terminology and professional exam phrasing—avoid generic, simple, or easy questions.
	•	Return ONLY valid JSON as shown below. Do NOT include extra text or formatting.

Example output:
[
{
“question”: “A company needs to ensure compliance with data residency requirements in its cloud environment. Which control is MOST appropriate to address this need?”,
“options”: [
“Enable encryption at rest”,
“Use region-specific resources”,
“Implement multi-factor authentication”,
“Configure security groups”
],
“correctAnswer”: “Use region-specific resources”,
“explanation”: “Using region-specific resources ensures data is stored and processed within specific geographic regions, addressing data residency requirements.”
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
