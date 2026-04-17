import type { ParsedAnalysis, AnswerReviewItem } from "./parse-analysis";

export type FinalProfile = {
  title: string;
  hook: string;
  mainReading: string;
  deepInterpretation: string;
  suggestedTraits: string[];
  patterns: string[];
  answerReview: AnswerReviewItem[];
  usefulAnswersCount: number;
  discardedAnswersCount: number;
  enoughForAnalysis: boolean;
};

function cleanText(text: string): string {
  return text.trim();
}

function cleanList(items: string[]): string[] {
  return items.map(cleanText).filter(Boolean);
}

export function buildProfile(parsedAnalysis: ParsedAnalysis): FinalProfile {
  return {
    title: "Tu reflejo interpretativo",
    hook: cleanText(parsedAnalysis.hook),
    mainReading: cleanText(parsedAnalysis.mainReading),
    deepInterpretation: cleanText(parsedAnalysis.deepInterpretation),
    suggestedTraits: cleanList(parsedAnalysis.suggestedTraits),
    patterns: cleanList(parsedAnalysis.patterns),
    answerReview: parsedAnalysis.answerReview,
    usefulAnswersCount: parsedAnalysis.usefulAnswersCount,
    discardedAnswersCount: parsedAnalysis.discardedAnswersCount,
    enoughForAnalysis: parsedAnalysis.enoughForAnalysis,
  };
}