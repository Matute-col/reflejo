"use client";

import { motion } from "framer-motion";
import ScreenLayout from "@/components/layout/ScreenLayout";
import PrimaryButton from "@/components/ui/PrimaryButton";

type BeforeStartScreenProps = {
  onContinue?: () => void;
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
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
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function BeforeStartScreen({
  onContinue,
}: BeforeStartScreenProps) {
  return (
    <ScreenLayout className="justify-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto flex w-full max-w-[900px] flex-col items-center px-4 text-center md:px-0"
      >
        <motion.h1
          variants={itemVariants}
          className="text-[28px] font-medium leading-[1.08] tracking-tight text-white md:text-[64px]"
        >
          Antes de comenzar...
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="mt-7 w-full max-w-[820px] rounded-[22px] border border-white/10 bg-white/5 px-5 py-6 backdrop-blur-sm md:mt-10 md:px-8 md:py-8"
        >
          <div className="space-y-5 text-[16px] leading-[1.55] text-white/82 md:space-y-6 md:text-[24px] md:leading-[1.55]">
            <p>
              Este test está inspirado en el Test de Rorschach, una técnica que
              presenta imágenes abiertas a interpretación.
            </p>

            <p>
              Verás una serie de imágenes y deberás responder con lo primero que
              venga a tu mente.
            </p>

            <p>No hay respuestas correctas o incorrectas.</p>

            <p className="font-medium text-white">
              No se trata de lo que ves...
              <br />
              sino de cómo lo ves.
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8 md:mt-12">
          <PrimaryButton
            className="w-full max-w-[320px] md:w-auto"
            onClick={onContinue}
          >
            Comprendo
          </PrimaryButton>
        </motion.div>
      </motion.div>
    </ScreenLayout>
  );
}