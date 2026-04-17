"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import ScreenLayout from "@/components/layout/ScreenLayout";

const loadingMessages = [
  "Interpretando tus respuestas...",
  "Separando lo significativo de lo descartable...",
  "Buscando patrones dentro de lo ambiguo...",
  "Construyendo una lectura con sentido...",
];

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

export default function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMessageIndex((current) =>
        current < loadingMessages.length - 1 ? current + 1 : 0
      );
    }, 1800);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <ScreenLayout className="justify-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto flex w-full max-w-[760px] flex-col items-center px-4 text-center md:px-0"
      >
        <motion.div
          variants={itemVariants}
          className="h-14 w-14 animate-pulse rounded-full border border-[#7c5cff]/40 bg-[radial-gradient(circle,_rgba(124,92,255,0.35)_0%,_rgba(124,92,255,0.08)_45%,_transparent_75%)] md:h-16 md:w-16"
        />

        <motion.h1
          variants={itemVariants}
          className="mt-6 text-[28px] font-light leading-[1.08] tracking-tight text-white md:mt-8 md:text-[56px]"
        >
          Tu reflejo se está formando
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-4 max-w-[620px] text-[15px] leading-[1.6] text-white/72 md:mt-5 md:text-[20px] md:leading-[1.65]"
        >
          La experiencia está revisando cada respuesta, separando lo que tiene
          significado de lo que no, y construyendo una lectura final solo si
          encuentra suficiente material interpretable.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-8 w-full max-w-[640px] rounded-[20px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:mt-10 md:rounded-[22px] md:p-6"
        >
          <div className="min-h-[24px] md:min-h-[30px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="text-[16px] text-white/82 md:text-[20px]"
              >
                {loadingMessages[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="mt-5 h-[6px] w-full overflow-hidden rounded-full bg-white/10 md:mt-6">
            <div className="h-full w-[28%] animate-[loadingBar_1.8s_ease-in-out_infinite] rounded-full bg-white" />
          </div>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="mt-5 text-[12px] text-white/45 md:mt-6 md:text-sm"
        >
          Esto puede tardar unos segundos.
        </motion.p>
      </motion.div>
    </ScreenLayout>
  );
}