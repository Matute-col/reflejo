import OpenAI from "openai";
import { buildAnalysisPrompt } from "./build-analysis-prompt";
import type { AnswersMap } from "@/types/test";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function runAnalysis(answers: AnswersMap) {
  const prompt = buildAnalysisPrompt(answers);

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  const response = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  const content = response.choices?.[0]?.message?.content ?? "";

  return content;
}