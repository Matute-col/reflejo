"use client";

import { motion } from "framer-motion";
import ScreenLayout from "@/components/layout/ScreenLayout";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useTestContext } from "@/components/reflejo/TestContext";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 18,
    filter: "blur(6px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function FinalScreen() {
  const { state, dispatch } = useTestContext();

  const hasAnalysis = state.analysisResult?.enoughForAnalysis ?? false;
  const usefulAnswers = state.answersQuality?.usefulAnswers ?? 0;
  const hasError = state.analysisError !== null;

  const handleRestart = () => {
    dispatch({ type: "RESET_TEST" });
  };

  return (
    <ScreenLayout className="justify-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto flex w-full max-w-[860px] flex-col items-center px-4 text-center md:px-0"
      >
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center gap-2 md:gap-3"
        >
          <img
            src="/images/logos/logo_kioto.webp"
            alt="Logo Kioto"
            className="h-[42px] w-auto opacity-90 md:h-[48px]"
          />

          <p className="text-[11px] uppercase tracking-[0.3em] text-white/40 md:text-sm md:tracking-[0.35em]">
            KIOTO
          </p>

          <p className="text-[10px] tracking-[0.2em] text-white/30 md:text-[11px] md:tracking-[0.25em]">
            EXPERIENCIA REFLEJO
          </p>

          <p className="text-[10px] text-white/30 md:text-[11px]">
            Diseñado por Mateo Bernal
          </p>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="mt-4 text-[28px] font-light leading-[1.08] tracking-tight text-white md:text-[62px]"
        >
          {hasError
            ? "Algo interrumpió el reflejo."
            : hasAnalysis
            ? "Tu reflejo ya habló."
            : "Tu reflejo quedó inconcluso."}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-5 max-w-[680px] text-[16px] leading-[1.6] text-white/72 md:mt-6 md:text-[21px] md:leading-[1.65]"
        >
          {hasError
            ? "Ocurrió un problema al intentar interpretar tus respuestas. No es un error tuyo. Puedes intentarlo nuevamente y reconstruir la experiencia desde el inicio."
            : hasAnalysis
            ? "Lo que viste no fue solo una forma. También fue una manera de llenar de sentido lo incierto. Ya recorriste la experiencia. Ahora puedes dejarla atrás... o volver a entrar y descubrir otra lectura."
            : `Esta vez no hubo suficiente material con significado para construir una lectura final. Solo ${usefulAnswers} respuesta${
                usefulAnswers === 1 ? "" : "s"
              } aportó${
                usefulAnswers === 1 ? "" : "aron"
              } algo interpretable. Puedes intentarlo de nuevo y responder con más intención, más imagen y más intuición.`}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-8 w-full rounded-[20px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:mt-10 md:rounded-[22px] md:p-8"
        >
          <p className="text-[15px] leading-[1.65] text-white/78 md:text-[20px] md:leading-[1.7]">
            {hasError
              ? "Reflejo no pudo completarse esta vez, pero la experiencia sigue disponible para ti."
              : hasAnalysis
              ? "Reflejo no intenta decirte quién eres. Solo te devuelve una versión intensa de cómo reaccionas cuando el sentido no está dado y tienes que inventarlo."
              : "Reflejo no necesita respuestas largas, pero sí respuestas con significado. Una palabra puede bastar, si realmente dice algo."}
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-8 flex w-full justify-center md:mt-10"
        >
          <PrimaryButton
            className="w-full max-w-[320px] md:w-auto"
            onClick={handleRestart}
          >
            Volver a empezar
          </PrimaryButton>
        </motion.div>
      </motion.div>
    </ScreenLayout>
  );
}