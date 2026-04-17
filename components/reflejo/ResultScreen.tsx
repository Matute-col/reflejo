"use client";

import { motion } from "framer-motion";
import ScreenLayout from "@/components/layout/ScreenLayout";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useTestContext } from "@/components/reflejo/TestContext";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 16,
    filter: "blur(6px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function ResultScreen() {
  const { state, dispatch } = useTestContext();

  const result = state.analysisResult;
  const quality = state.answersQuality;

  if (!result || !quality) {
    return (
      <ScreenLayout className="justify-center">
        <p className="text-white">No hay métricas disponibles.</p>
      </ScreenLayout>
    );
  }

  const handleContinue = () => {
    dispatch({ type: "SET_STEP", payload: "final" });
  };

  return (
    <ScreenLayout className="justify-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto flex w-full max-w-[1100px] flex-col px-4 md:px-0"
      >
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-[26px] font-light tracking-tight text-white md:text-[42px]">
            Así respondió tu reflejo
          </h1>

          <p className="mt-3 text-[15px] leading-[1.5] text-white/70 md:mt-4 md:text-[20px]">
            Qué respuestas aportaron significado y cuáles quedaron fuera del análisis.
          </p>
        </motion.div>

        <motion.section
          variants={itemVariants}
          className="mt-8 rounded-[22px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:mt-10 md:p-6"
        >
          <h2 className="text-center text-[20px] font-semibold text-white md:text-[24px]">
            Lectura de tus respuestas
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 md:mt-6 md:gap-4">
            <div className="rounded-[16px] border border-white/10 bg-black/20 p-4 text-center md:p-5">
              <p className="text-[12px] text-white/55 md:text-sm">
                Respuestas totales
              </p>
              <p className="mt-2 text-[26px] font-semibold text-white md:mt-3 md:text-[34px]">
                {quality.totalAnswers}
              </p>
            </div>

            <div className="rounded-[16px] border border-[#86efac]/20 bg-black/20 p-4 text-center md:p-5">
              <p className="text-[12px] text-white/55 md:text-sm">
                Respuestas útiles
              </p>
              <p className="mt-2 text-[26px] font-semibold text-[#d9ffe8] md:mt-3 md:text-[34px]">
                {quality.usefulAnswers}
              </p>
            </div>

            <div className="rounded-[16px] border border-[#fca5a5]/20 bg-black/20 p-4 text-center md:p-5">
              <p className="text-[12px] text-white/55 md:text-sm">
                Respuestas descartadas
              </p>
              <p className="mt-2 text-[26px] font-semibold text-[#ffd6d6] md:mt-3 md:text-[34px]">
                {quality.discardedAnswers}
              </p>
            </div>

            <div className="rounded-[16px] border border-white/10 bg-black/20 p-4 text-center md:p-5">
              <p className="text-[12px] text-white/55 md:text-sm">
                Estado del análisis
              </p>
              <p className="mt-2 text-[14px] font-semibold text-white md:mt-3 md:text-[18px]">
                {quality.enoughForAnalysis ? "Suficiente" : "Insuficiente"}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-[16px] border border-white/10 bg-black/20 p-4 text-center md:mt-5 md:p-5">
            <p className="text-[12px] text-white/55 md:text-sm">
              Material suficiente para análisis
            </p>

            <div className="mt-3 flex justify-center md:mt-4">
              <span
                className={`rounded-full px-3 py-1.5 text-[12px] font-medium md:px-4 md:py-2 md:text-sm ${
                  quality.enoughForAnalysis
                    ? "border border-[#86efac]/35 bg-[#86efac]/10 text-[#d9ffe8]"
                    : "border border-[#fca5a5]/35 bg-[#fca5a5]/10 text-[#ffd6d6]"
                }`}
              >
                {quality.enoughForAnalysis
                  ? "Sí, fue suficiente"
                  : "No fue suficiente"}
              </span>
            </div>
          </div>
        </motion.section>

        <motion.section
          variants={itemVariants}
          className="mt-5 rounded-[22px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:mt-6 md:p-6"
        >
          <h2 className="text-center text-[20px] font-semibold text-white md:text-[24px]">
            Revisión respuesta por respuesta
          </h2>

          <div className="mt-5 flex flex-col gap-3 md:mt-6 md:gap-4">
            {quality.details.map((item) => (
              <motion.div
                key={item.questionId}
                variants={itemVariants}
                className="rounded-[16px] border border-white/10 bg-black/20 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:justify-between">
                  <div className="md:max-w-[70%]">
                    <p className="text-[12px] text-white/45 md:text-sm">
                      Pregunta {item.questionId}
                    </p>

                    <p className="mt-1 text-[15px] text-white md:mt-2 md:text-[17px]">
                      {item.originalText || "Sin respuesta"}
                    </p>

                    <p className="mt-2 text-[13px] leading-[1.4] text-white/60 md:mt-3 md:text-sm">
                      {item.reason}
                    </p>
                  </div>

                  <div className="md:ml-6">
                    <span
                      className={`inline-flex rounded-full px-3 py-1.5 text-[12px] font-medium md:px-4 md:py-2 md:text-sm ${
                        item.isMeaningful
                          ? "border border-[#86efac]/35 bg-[#86efac]/10 text-[#d9ffe8]"
                          : "border border-[#fca5a5]/35 bg-[#fca5a5]/10 text-[#ffd6d6]"
                      }`}
                    >
                      {item.isMeaningful ? "Útil" : "Descartada"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.div
          variants={itemVariants}
          className="mt-8 flex justify-center md:mt-10"
        >
          <PrimaryButton
            className="w-full max-w-[320px] md:w-auto"
            onClick={handleContinue}
          >
            Siguiente
          </PrimaryButton>
        </motion.div>
      </motion.div>
    </ScreenLayout>
  );
}