export type AnswerReviewItem = {
  questionId: number;
  originalText: string;
  isMeaningful: boolean;
  reason: string;
  keptForAnalysis: boolean;
};

export type ParsedAnalysis = {
  answerReview: AnswerReviewItem[];
  usefulAnswersCount: number;
  discardedAnswersCount: number;
  enoughForAnalysis: boolean;
  patterns: string[];
  hook: string;
  mainReading: string;
  deepInterpretation: string;
  suggestedTraits: string[];
};

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isAnswerReviewItem(value: unknown): value is AnswerReviewItem {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.questionId === "number" &&
    typeof candidate.originalText === "string" &&
    typeof candidate.isMeaningful === "boolean" &&
    typeof candidate.reason === "string" &&
    typeof candidate.keptForAnalysis === "boolean"
  );
}

function isAnswerReviewArray(value: unknown): value is AnswerReviewItem[] {
  return Array.isArray(value) && value.every(isAnswerReviewItem);
}

function isValidAnalysis(data: unknown): data is ParsedAnalysis {
  if (!data || typeof data !== "object") return false;

  const candidate = data as Record<string, unknown>;

  return (
    isAnswerReviewArray(candidate.answerReview) &&
    typeof candidate.usefulAnswersCount === "number" &&
    typeof candidate.discardedAnswersCount === "number" &&
    typeof candidate.enoughForAnalysis === "boolean" &&
    isStringArray(candidate.patterns) &&
    typeof candidate.hook === "string" &&
    typeof candidate.mainReading === "string" &&
    typeof candidate.deepInterpretation === "string" &&
    isStringArray(candidate.suggestedTraits)
  );
}

export function parseAnalysis(raw: string): ParsedAnalysis | null {
  try {
    const parsed = JSON.parse(raw);

    if (!isValidAnalysis(parsed)) {
      console.warn("⚠️ Estructura inválida del análisis:", parsed);
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("❌ Error parseando JSON de IA:", error);
    return null;
  }
}