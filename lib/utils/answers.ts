import type { AnswersMap } from "@/types/test";

export function getAnswer(
  answers: AnswersMap,
  questionId: number
): string {
  return answers[questionId] ?? "";
}

export function hasAnswer(
  answers: AnswersMap,
  questionId: number
): boolean {
  const value = answers[questionId];

  if (!value) return false;

  const trimmed = value.trim();

  if (trimmed.length < 3) return false;

  const hasLetters = /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(trimmed);
  if (!hasLetters) return false;

  const onlyNumbersAndSymbols = /^[^a-zA-ZáéíóúÁÉÍÓÚñÑ]*$/.test(trimmed);
  if (onlyNumbersAndSymbols) return false;

  return true;
}