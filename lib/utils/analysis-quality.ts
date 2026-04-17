import type { AnswersMap } from "@/types/test";

export type AnswerQualityDetail = {
  questionId: number;
  originalText: string;
  trimmedText: string;
  characterCount: number;
  wordCount: number;
  hasLetters: boolean;
  looksLikeNaturalText: boolean;
  isRepetitiveNoise: boolean;
  isUseful: boolean;
};

export type AnswersQualityResult = {
  details: AnswerQualityDetail[];
  totalAnswers: number;
  usefulAnswers: number;
  averageCharacterCount: number;
  averageWordCount: number;
  enoughForAnalysis: boolean;
};

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function hasLetters(text: string): boolean {
  return /[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/.test(text);
}

function normalizeWord(word: string): string {
  return word
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zñü]/g, "");
}

function hasTooManyRepeatedChars(word: string): boolean {
  const normalized = normalizeWord(word);

  if (!normalized) return true;

  const counts = new Map<string, number>();

  for (const char of normalized) {
    counts.set(char, (counts.get(char) ?? 0) + 1);
  }

  const maxRepeat = Math.max(...counts.values());

  if (normalized.length === 4 && maxRepeat > 2) return true;
  if (normalized.length === 5 && maxRepeat >= 4) return true;
  if (normalized.length >= 6 && maxRepeat >= normalized.length - 1) return true;

  return false;
}

function hasRepeatedSyllablePattern(word: string): boolean {
  const normalized = normalizeWord(word);

  if (normalized.length < 4) return false;

  if (/^(..)\1+$/.test(normalized)) return true;
  if (/^(...)\1+$/.test(normalized)) return true;
  if (/^(ja)+$/.test(normalized)) return true;
  if (/^(ha)+$/.test(normalized)) return true;
  if (/^(sa)+$/.test(normalized)) return true;
  if (/^(na)+$/.test(normalized)) return true;
  if (/^(la)+$/.test(normalized)) return true;

  return false;
}

function hasSuspiciousConsonantCluster(word: string): boolean {
  const normalized = normalizeWord(word);

  if (normalized.length < 5) return false;

  return /[bcdfghjklmnpqrstvwxyz]{5,}/i.test(normalized);
}

function hasVeryLowVowelRatio(word: string): boolean {
  const normalized = normalizeWord(word);

  if (normalized.length < 5) return false;

  const vowels = (normalized.match(/[aeiou]/g) ?? []).length;
  const ratio = vowels / normalized.length;

  return ratio < 0.2;
}

function isKeyboardSmash(word: string): boolean {
  const normalized = normalizeWord(word);

  if (normalized.length < 6) return false;

  return (
    hasSuspiciousConsonantCluster(normalized) ||
    hasVeryLowVowelRatio(normalized)
  );
}

function isNoiseWord(word: string): boolean {
  const normalized = normalizeWord(word);

  if (!normalized) return true;

  if (normalized.length === 1) return true;

  if (hasTooManyRepeatedChars(normalized)) return true;
  if (hasRepeatedSyllablePattern(normalized)) return true;
  if (isKeyboardSmash(normalized)) return true;

  return false;
}

function looksLikeNaturalText(text: string): boolean {
  const words = text
    .trim()
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);

  if (words.length === 0) return false;

  const usefulWords = words.filter((word) => !isNoiseWord(word));

  if (words.length === 1) {
    return usefulWords.length === 1;
  }

  return usefulWords.length >= Math.ceil(words.length / 2);
}

export function evaluateAnswersQuality(
  answers: AnswersMap
): AnswersQualityResult {
  const details: AnswerQualityDetail[] = Object.entries(answers).map(
    ([questionId, content]) => {
      const trimmedText = content.trim();
      const characterCount = trimmedText.length;
      const wordCount = countWords(trimmedText);
      const containsLetters = hasLetters(trimmedText);

      const naturalText = containsLetters && looksLikeNaturalText(trimmedText);
      const repetitiveNoise = !naturalText;

      const isUseful =
        containsLetters &&
        characterCount >= 3 &&
        naturalText;

      return {
        questionId: Number(questionId),
        originalText: content,
        trimmedText,
        characterCount,
        wordCount,
        hasLetters: containsLetters,
        looksLikeNaturalText: naturalText,
        isRepetitiveNoise: repetitiveNoise,
        isUseful,
      };
    }
  );

  const totalAnswers = details.length;

  const usefulAnswers = details.filter((detail) => detail.isUseful).length;

  const totalCharacters = details.reduce(
    (acc, detail) => acc + detail.characterCount,
    0
  );

  const totalWords = details.reduce(
    (acc, detail) => acc + detail.wordCount,
    0
  );

  const averageCharacterCount =
    totalAnswers > 0 ? totalCharacters / totalAnswers : 0;

  const averageWordCount =
    totalAnswers > 0 ? totalWords / totalAnswers : 0;

  const enoughForAnalysis = usefulAnswers >= 5;

  return {
    details,
    totalAnswers,
    usefulAnswers,
    averageCharacterCount,
    averageWordCount,
    enoughForAnalysis,
  };
}