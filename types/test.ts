export type Question = {
  id: number;
  imageSrc: string;
  prompt: string;
  placeholder: string;
};

export type Answer = {
  questionId: number;
  content: string;
};

export type AnswersMap = Record<number, string>;

export type FlowStep =
  | "welcome"
  | "before-start"
  | "important"
  | "question"
  | "loading"
  | "result-main"
  | "result-metrics"
  | "final";

export type AnswerReviewItem = {
  questionId: number;
  originalText: string;
  isMeaningful: boolean;
  reason: string;
  keptForAnalysis: boolean;
};

export type AnswersQualityResult = {
  details: AnswerReviewItem[];
  totalAnswers: number;
  usefulAnswers: number;
  discardedAnswers: number;
  enoughForAnalysis: boolean;
};

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

export type AnalyzeApiSuccess = {
  ok: true;
  message: string;
  received: {
    answers: Record<string, string>;
  };
  quality: AnswersQualityResult;
  rawAnalysis: string;
  parsedAnalysis: {
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
  finalProfile: {
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
  finalResponse: FinalResponse;
};

export type AnalyzeApiError = {
  ok: false;
  message: string;
  quality?: AnswersQualityResult;
  errors?: unknown;
  rawAnalysis?: string;
};

export type TestState = {
  currentStep: FlowStep;
  currentQuestionIndex: number;
  answers: AnswersMap;
  analysisResult: FinalResponse | null;
  answersQuality: AnswersQualityResult | null;
  isSubmittingAnalysis: boolean;
  analysisError: string | null;
};

export type TestAction =
  | { type: "SET_STEP"; payload: FlowStep }
  | { type: "SET_CURRENT_QUESTION_INDEX"; payload: number }
  | { type: "SAVE_ANSWER"; payload: { questionId: number; content: string } }
  | { type: "SET_ANALYSIS_LOADING"; payload: boolean }
  | { type: "SET_ANALYSIS_RESULT"; payload: FinalResponse | null }
  | { type: "SET_ANSWERS_QUALITY"; payload: AnswersQualityResult | null }
  | { type: "SET_ANALYSIS_ERROR"; payload: string | null }
  | { type: "RESET_TEST" };