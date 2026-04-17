"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { questions } from "@/lib/data/questions";
import { useTestContext } from "@/components/reflejo/TestContext";
import WelcomeScreen from "@/components/reflejo/WelcomeScreen";
import BeforeStartScreen from "@/components/reflejo/BeforeStartScreen";
import ImportantScreen from "@/components/reflejo/ImportantScreen";
import QuestionScreen from "@/components/reflejo/QuestionScreen";
import LoadingScreen from "@/components/reflejo/LoadingScreen";
import ResultMainScreen from "@/components/reflejo/ResultMainScreen";
import ResultScreen from "@/components/reflejo/ResultScreen";
import FinalScreen from "@/components/reflejo/FinalScreen";
import type {
  AnalyzeApiError,
  AnalyzeApiSuccess,
} from "@/types/test";
import { getAnswer, hasAnswer } from "@/lib/utils/answers";

export default function TestFlow() {
  const { state, dispatch } = useTestContext();

  const currentQuestion = questions[state.currentQuestionIndex];
  const currentAnswer = currentQuestion
    ? getAnswer(state.answers, currentQuestion.id)
    : "";
  const isValidAnswer = currentQuestion
    ? hasAnswer(state.answers, currentQuestion.id)
    : false;

  const goToStep = (step: typeof state.currentStep) => {
    dispatch({ type: "SET_STEP", payload: step });
  };

  const handleStartQuestions = () => {
    dispatch({ type: "SET_STEP", payload: "question" });
    dispatch({ type: "SET_CURRENT_QUESTION_INDEX", payload: 0 });
    dispatch({ type: "SET_ANALYSIS_ERROR", payload: null });
    dispatch({ type: "SET_ANALYSIS_RESULT", payload: null });
    dispatch({ type: "SET_ANSWERS_QUALITY", payload: null });
  };

  const handleQuestionAnswerChange = (value: string) => {
    if (!currentQuestion) return;

    dispatch({
      type: "SAVE_ANSWER",
      payload: {
        questionId: currentQuestion.id,
        content: value,
      },
    });
  };

  const handleNextQuestion = () => {
    if (!currentQuestion) return;

    const isValid = hasAnswer(state.answers, currentQuestion.id);

    if (!isValid) return;

    const isLastQuestion =
      state.currentQuestionIndex >= questions.length - 1;

    if (isLastQuestion) {
      dispatch({ type: "SET_STEP", payload: "loading" });
      return;
    }

    dispatch({
      type: "SET_CURRENT_QUESTION_INDEX",
      payload: state.currentQuestionIndex + 1,
    });
  };

  useEffect(() => {
    if (state.currentStep !== "loading") return;
    if (state.isSubmittingAnalysis) return;

    const analyzeAnswers = async () => {
      dispatch({ type: "SET_ANALYSIS_LOADING", payload: true });
      dispatch({ type: "SET_ANALYSIS_ERROR", payload: null });

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers: state.answers,
          }),
        });

        const data: AnalyzeApiSuccess | AnalyzeApiError =
          await response.json();

        if (!response.ok || !data.ok) {
          const errorMessage =
            data.message || "No se pudo completar el análisis.";
          const quality =
            "quality" in data ? data.quality ?? null : null;

          dispatch({ type: "SET_ANSWERS_QUALITY", payload: quality });
          dispatch({ type: "SET_ANALYSIS_ERROR", payload: errorMessage });
          dispatch({ type: "SET_STEP", payload: "final" });
          return;
        }

        dispatch({
          type: "SET_ANALYSIS_RESULT",
          payload: data.finalResponse,
        });

        dispatch({
          type: "SET_ANSWERS_QUALITY",
          payload: data.quality,
        });

        dispatch({
          type: "SET_STEP",
          payload: data.finalResponse.enoughForAnalysis
            ? "result-main"
            : "result-metrics",
        });
      } catch (error) {
        console.error("❌ Error consumiendo /api/analyze:", error);

        dispatch({
          type: "SET_ANALYSIS_ERROR",
          payload:
            "Ocurrió un problema inesperado al intentar analizar tus respuestas.",
        });

        dispatch({ type: "SET_STEP", payload: "final" });
      } finally {
        dispatch({ type: "SET_ANALYSIS_LOADING", payload: false });
      }
    };

    analyzeAnswers();
  }, [
    state.currentStep,
    state.isSubmittingAnalysis,
    state.answers,
    dispatch,
  ]);

  const renderScreen = () => {
    switch (state.currentStep) {
      case "welcome":
        return <WelcomeScreen onStart={() => goToStep("before-start")} />;

      case "before-start":
        return <BeforeStartScreen onContinue={() => goToStep("important")} />;

      case "important":
        return <ImportantScreen onContinue={handleStartQuestions} />;

      case "question":
        if (!currentQuestion) return null;

        return (
          <QuestionScreen
            question={currentQuestion}
            answer={currentAnswer}
            onAnswerChange={handleQuestionAnswerChange}
            onContinue={handleNextQuestion}
            disabled={!isValidAnswer}
            currentQuestionNumber={state.currentQuestionIndex + 1}
            totalQuestions={questions.length}
          />
        );

      case "loading":
        return <LoadingScreen />;

      case "result-main":
        return <ResultMainScreen />;

      case "result-metrics":
        return <ResultScreen />;

      case "final":
        return <FinalScreen />;

      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state.currentStep}
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full"
      >
        {renderScreen()}
      </motion.div>
    </AnimatePresence>
  );
}