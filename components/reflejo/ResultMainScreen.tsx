"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import ScreenLayout from "@/components/layout/ScreenLayout";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useTestContext } from "@/components/reflejo/TestContext";
import NarrativeAudioPlayer from "@/components/reflejo/NarrativeAudioPlayer";

function splitNarrativeIntoChunks(text: string): string[] {
  return text
    .split(/\n+/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}

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

export default function ResultMainScreen() {
  const { state, dispatch } = useTestContext();
  const result = state.analysisResult;

  const [isKaraokeActive, setIsKaraokeActive] = useState(false);
  const [activeChunkIndex, setActiveChunkIndex] = useState(0);

  const narrativeChunks = useMemo(() => {
    if (!result?.narrative) return [];
    return splitNarrativeIntoChunks(result.narrative);
  }, [result?.narrative]);

  useEffect(() => {
    if (!isKaraokeActive || narrativeChunks.length === 0) return;

    const totalDurationMs = Math.max(result?.narrative.length ?? 0, 1) * 55;
    const chunkDurationMs = Math.max(
      Math.floor(totalDurationMs / narrativeChunks.length),
      1200
    );

    setActiveChunkIndex(0);

    let currentIndex = 0;

    const interval = window.setInterval(() => {
      currentIndex += 1;

      if (currentIndex >= narrativeChunks.length) {
        window.clearInterval(interval);
        setActiveChunkIndex(narrativeChunks.length - 1);
        return;
      }

      setActiveChunkIndex(currentIndex);
    }, chunkDurationMs);

    return () => {
      window.clearInterval(interval);
    };
  }, [isKaraokeActive, narrativeChunks, result?.narrative]);

  if (!result) {
    return (
      <ScreenLayout className="justify-center">
        <p className="text-white">No hay resultado disponible.</p>
      </ScreenLayout>
    );
  }

  const handleContinue = () => {
    dispatch({ type: "SET_STEP", payload: "result-metrics" });
  };

  const handleAudioPlay = () => {
    setActiveChunkIndex(0);
    setIsKaraokeActive(true);
  };

  const handleAudioStop = () => {
    setIsKaraokeActive(false);
    setActiveChunkIndex(0);
  };

  const handleAudioEnd = () => {
    setIsKaraokeActive(false);
    setActiveChunkIndex(0);
  };

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
          className="text-[26px] font-light leading-[1.2] tracking-tight text-white md:text-[42px]"
        >
          Es momento de conocer tus resultados
        </motion.h1>

        <motion.h2
          variants={itemVariants}
          className="mt-5 bg-gradient-to-r from-[#86efac] to-[#7c5cff] bg-clip-text text-[22px] font-semibold leading-[1.2] text-transparent md:text-[34px]"
        >
          {result.title}
        </motion.h2>

        <motion.div variants={itemVariants} className="mt-4 w-full">
          <NarrativeAudioPlayer
            text={result.narrative}
            onPlay={handleAudioPlay}
            onStop={handleAudioStop}
            onEnd={handleAudioEnd}
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-6 w-full rounded-[20px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm shadow-[0_16px_40px_rgba(0,0,0,0.12)] md:rounded-[22px] md:p-6"
        >
          <div className="flex flex-col gap-4 text-left md:gap-5">
            {narrativeChunks.map((chunk, index) => {
              const isActive = isKaraokeActive && index === activeChunkIndex;
              const isPassed = isKaraokeActive && index < activeChunkIndex;
              const isIdle = !isKaraokeActive;

              return (
                <p
                  key={`${chunk}-${index}`}
                  className={[
                    "rounded-[14px] px-3 py-2 text-[16px] leading-[1.65] transition-all duration-500 md:px-4 md:py-3 md:text-[18px]",
                    isIdle
                      ? "border border-transparent text-white/80"
                      : isActive
                      ? "scale-[1.01] border border-white/12 bg-white/10 text-white shadow-[0_12px_32px_rgba(124,92,255,0.18)]"
                      : isPassed
                      ? "border border-transparent text-white/55"
                      : "border border-transparent text-white/35",
                  ].join(" ")}
                >
                  {chunk}
                </p>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-8 w-full max-w-[320px] md:mt-10 md:w-auto"
        >
          <PrimaryButton
            className="w-full md:w-auto"
            onClick={handleContinue}
          >
            Siguiente
          </PrimaryButton>
        </motion.div>
      </motion.div>
    </ScreenLayout>
  );
}