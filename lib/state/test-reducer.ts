import type { TestAction, TestState } from "@/types/test";

export const initialTestState: TestState = {
  currentStep: "welcome",
  currentQuestionIndex: 0,
  answers: {},
  analysisResult: null,
  answersQuality: null,
  isSubmittingAnalysis: false,
  analysisError: null,
};

export function testReducer(
  state: TestState,
  action: TestAction
): TestState {
  switch (action.type) {
    case "SET_STEP":
      return {
        ...state,
        currentStep: action.payload,
      };

    case "SET_CURRENT_QUESTION_INDEX":
      return {
        ...state,
        currentQuestionIndex: action.payload,
      };

    case "SAVE_ANSWER":
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: action.payload.content,
        },
      };

    case "SET_ANALYSIS_LOADING":
      return {
        ...state,
        isSubmittingAnalysis: action.payload,
      };

    case "SET_ANALYSIS_RESULT":
      return {
        ...state,
        analysisResult: action.payload,
      };

    case "SET_ANSWERS_QUALITY":
      return {
        ...state,
        answersQuality: action.payload,
      };

    case "SET_ANALYSIS_ERROR":
      return {
        ...state,
        analysisError: action.payload,
      };

    case "RESET_TEST":
      return initialTestState;

    default:
      return state;
  }
}