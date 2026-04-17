import type { FinalProfile } from "./build-profile";
import type { AnswerReviewItem } from "./parse-analysis";

export type FinalResponse = {
  title: string;
  narrative: string;
  suggestedTraits: string[];
  patterns: string[];
  answerReview: AnswerReviewItem[];
  usefulAnswersCount: number;
  discardedAnswersCount: number;
  enoughForAnalysis: boolean;
};

export function buildNarrative(profile: FinalProfile): FinalResponse {
  const narrative = profile.enoughForAnalysis
    ? `
${profile.hook}

${profile.mainReading}

${profile.deepInterpretation}
`.trim()
    : "";

  return {
    title: profile.title,
    narrative,
    suggestedTraits: profile.suggestedTraits,
    patterns: profile.patterns,
    answerReview: profile.answerReview,
    usefulAnswersCount: profile.usefulAnswersCount,
    discardedAnswersCount: profile.discardedAnswersCount,
    enoughForAnalysis: profile.enoughForAnalysis,
  };
}