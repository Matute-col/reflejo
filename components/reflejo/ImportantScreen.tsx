"use client";

import { motion } from "framer-motion";
import ScreenLayout from "@/components/layout/ScreenLayout";
import PrimaryButton from "@/components/ui/PrimaryButton";

type ImportantScreenProps = {
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

export default function ImportantScreen({
  onContinue,
}: ImportantScreenProps) {
  return (
    <ScreenLayout className="justify-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto flex w-full max-w-[760px] flex-col items-center px-4 text-center md:px-0"
      >
        <motion.h1
          variants={itemVariants}
          className="text-[30px] font-light leading-[1.05] tracking-tight text-white md:text-[64px]"
        >
          ¡Importante!
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="mt-7 w-full max-w-[660px] rounded-[22px] border border-white/10 bg-white/5 px-5 py-6 backdrop-blur-sm md:mt-10 md:px-8 md:py-8"
        >
          <div className="text-[16px] leading-[1.6] text-white/88 md:text-[24px] md:leading-[1.5]">
            <p>
              Este test{" "}
              <span className="font-semibold text-white">
                no es una herramienta clínica
              </span>{" "}
              ni busca ofrecer diagnósticos psicológicos.
            </p>

            <p className="mt-4 md:mt-5">
              Reflejo es una experiencia creada con fines{" "}
              <span className="font-semibold text-white">
                exploratorios y de entretenimiento
              </span>
              , pensada para que descubras posibles formas en las que interpretas
              el mundo, de una manera simple, intuitiva y sin etiquetas complejas.
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8 md:mt-12">
          <PrimaryButton
            className="w-full max-w-[320px] md:w-auto"
            onClick={onContinue}
          >
            Comencemos
          </PrimaryButton>
        </motion.div>
      </motion.div>
    </ScreenLayout>
  );
}