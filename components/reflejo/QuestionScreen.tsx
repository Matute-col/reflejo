"use client";

import { motion } from "framer-motion";
import ScreenLayout from "@/components/layout/ScreenLayout";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Question } from "@/types/test";

type QuestionScreenProps = {
  question: Question;
  answer: string;
  onAnswerChange: (value: string) => void;
  onContinue?: () => void;
  disabled?: boolean;
  currentQuestionNumber: number;
  totalQuestions: number;
};

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: {
    transcript?: string;
  };
};

type SpeechRecognitionEventLike = {
  resultIndex?: number;
  results?: {
    length: number;
    [key: number]: SpeechRecognitionResultLike;
  };
};

type SpeechRecognitionErrorEventLike = {
  error?: string;
};

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

function mergeTextParts(parts: string[]) {
  return parts
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function QuestionScreen({
  question,
  answer,
  onAnswerChange,
  onContinue,
  disabled,
  currentQuestionNumber,
  totalQuestions,
}: QuestionScreenProps) {
  const progressPercentage =
    (currentQuestionNumber / totalQuestions) * 100;

  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const baseAnswerRef = useRef("");
  const finalTranscriptRef = useRef("");

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const startSilenceTimer = () => {
    clearSilenceTimer();

    silenceTimerRef.current = setTimeout(() => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    }, 3000);
  };

  const stopListening = () => {
    clearSilenceTimer();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // no hacemos nada si ya estaba detenido
      }
    }
  };

  const startListening = () => {
    if (typeof window === "undefined") return;

    setVoiceError(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError(
        "Tu navegador no soporta reconocimiento de voz. Prueba escribiendo manualmente o usando Chrome en Android."
      );
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();

      recognition.lang = "es-ES";
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
        startSilenceTimer();
      };

      recognition.onend = () => {
        setIsListening(false);
        clearSilenceTimer();
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
        if (event?.error === "not-allowed") {
          setVoiceError(
            "Debes permitir el acceso al micrófono para usar el reconocimiento de voz."
          );
        } else if (event?.error === "no-speech") {
          setVoiceError(
            "No detecté voz. Intenta hablar más cerca del micrófono."
          );
        } else if (event?.error === "audio-capture") {
          setVoiceError(
            "No se detectó un dispositivo de audio disponible."
          );
        } else if (event?.error === "network") {
          setVoiceError(
            "Hubo un problema de red durante el reconocimiento."
          );
        } else {
          setVoiceError(
            "Ocurrió un problema al intentar reconocer la voz."
          );
        }

        setIsListening(false);
        clearSilenceTimer();
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        if (!event.results) return;

        let interimTranscript = "";

        for (
          let i = event.resultIndex ?? 0;
          i < event.results.length;
          i += 1
        ) {
          const result = event.results[i];
          const transcript = result?.[0]?.transcript?.trim() ?? "";

          if (!transcript) continue;

          if (result.isFinal) {
            finalTranscriptRef.current = mergeTextParts([
              finalTranscriptRef.current,
              transcript,
            ]);
          } else {
            interimTranscript = mergeTextParts([
              interimTranscript,
              transcript,
            ]);
          }
        }

        const fullText = mergeTextParts([
          baseAnswerRef.current,
          finalTranscriptRef.current,
          interimTranscript,
        ]);

        onAnswerChange(fullText);
        setVoiceError(null);
        startSilenceTimer();
      };

      recognitionRef.current = recognition;
    }

    if (isListening) return;

    baseAnswerRef.current = answer.trim();
    finalTranscriptRef.current = "";

    try {
      recognitionRef.current.start();
    } catch {
      setVoiceError(
        "No se pudo iniciar el reconocimiento de voz. Intenta nuevamente."
      );
      setIsListening(false);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
      return;
    }

    startListening();
  };

  useEffect(() => {
    return () => {
      clearSilenceTimer();

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return (
    <ScreenLayout className="justify-start md:justify-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto flex w-full max-w-[1120px] flex-col px-4 pb-6 pt-4 md:px-0 md:pb-0 md:pt-0"
      >
        <motion.div variants={itemVariants} className="mb-4 md:mb-8">
          <div className="flex items-center justify-between text-[11px] text-white/50 md:text-sm">
            <span className="tracking-[0.15em] uppercase">
              {currentQuestionNumber}/{totalQuestions}
            </span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>

          <div className="mt-2 h-[6px] w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#86efac] to-[#7c5cff] transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </motion.div>

        <div className="flex flex-col gap-5 md:grid md:grid-cols-[1.1fr_0.9fr] md:items-start md:gap-12">
          <div className="flex w-full flex-col md:pt-2">
            <motion.div
              variants={itemVariants}
              className="w-full text-center md:text-left"
            >
              <h1 className="mx-auto max-w-[300px] text-[20px] font-light leading-[1.08] tracking-tight text-white sm:max-w-[340px] sm:text-[24px] md:mx-0 md:max-w-[520px] md:text-[59px]">
                {question.prompt}
              </h1>

              <p className="mx-auto mt-3 max-w-[310px] text-[14px] leading-[1.4] text-white/75 sm:max-w-[360px] sm:text-[16px] md:mx-0 md:mt-4 md:max-w-[500px] md:text-[18px] md:leading-[1.4]">
                No hay respuestas correctas. Solo lo que tú percibes.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-4 flex flex-col items-center gap-4 md:hidden"
            >
              <div className="relative h-[180px] w-[180px] sm:h-[210px] sm:w-[210px]">
                <Image
                  src={question.imageSrc}
                  alt={`Pregunta ${question.id}`}
                  fill
                  className="object-contain"
                />
              </div>

              <motion.div
                variants={itemVariants}
                className="w-full max-w-[320px]"
              >
                <div className="relative">
                  <textarea
                    value={answer}
                    onChange={(e) => onAnswerChange(e.target.value)}
                    placeholder={question.placeholder}
                    className="
                      h-[80px] w-full
                      rounded-[18px]
                      border border-white/10
                      bg-[rgba(60,20,120,0.26)]
                      px-4 py-4 pr-16
                      text-[16px] text-white
                      placeholder:text-white/40
                      shadow-[0_8px_30px_rgba(124,92,255,0.10)]
                      outline-none
                      resize-none
                      backdrop-blur-[6px]
                      transition-all duration-300
                      hover:border-[#8c78ff]/40 hover:bg-[rgba(60,20,120,0.30)]
                      focus:border-[#a78bfa]/65
                      focus:bg-[rgba(60,20,120,0.34)]
                      focus:shadow-[0_12px_36px_rgba(124,92,255,0.18)]
                    "
                  />

                  <button
                    type="button"
                    aria-label={
                      isListening ? "Detener micrófono" : "Activar micrófono"
                    }
                    onClick={handleMicClick}
                    className={`
                      absolute bottom-3 right-3 z-10
                      flex h-11 w-11 items-center justify-center rounded-full
                      border transition-all duration-300 touch-manipulation
                      ${
                        isListening
                          ? "scale-110 border-red-400/80 bg-red-500 shadow-[0_0_24px_rgba(239,68,68,0.45)] animate-pulse"
                          : "border-white/10 bg-white/5 opacity-90 hover:opacity-100"
                      }
                    `}
                  >
                    <Image
                      src="/icons/mic.png"
                      alt="Micrófono"
                      width={22}
                      height={22}
                      draggable={false}
                      className="pointer-events-none select-none invert"
                    />
                  </button>
                </div>

                <div className="mt-2 min-h-[24px]">
                  {isListening && (
                    <p className="text-sm font-medium text-red-300">
                      🔴 Escuchando... deja de hablar y en 3 segundos se cerrará.
                    </p>
                  )}

                  {!isListening && voiceError && (
                    <p className="text-sm leading-[1.4] text-[#fca5a5]">
                      {voiceError}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex justify-center">
                  <PrimaryButton
                    className="w-full max-w-[260px]"
                    onClick={onContinue}
                    disabled={disabled}
                  >
                    Siguiente
                  </PrimaryButton>
                </div>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-10 hidden md:block">
              <div className="relative md:max-w-[510px]">
                <textarea
                  value={answer}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  placeholder={question.placeholder}
                  className="
                    h-[150px] w-full
                    rounded-[18px]
                    border border-white/10
                    bg-[rgba(60,20,120,0.26)]
                    px-5 py-5 pr-20
                    text-[20px] text-white
                    placeholder:text-white/40
                    shadow-[0_10px_34px_rgba(124,92,255,0.10)]
                    outline-none
                    resize-none
                    backdrop-blur-[6px]
                    transition-all duration-300
                    hover:border-[#8c78ff]/40 hover:bg-[rgba(60,20,120,0.30)]
                    focus:border-[#a78bfa]/65
                    focus:bg-[rgba(60,20,120,0.34)]
                    focus:shadow-[0_14px_42px_rgba(124,92,255,0.18)]
                  "
                />

                <button
                  type="button"
                  aria-label={
                    isListening ? "Detener micrófono" : "Activar micrófono"
                  }
                  onClick={handleMicClick}
                  className={`
                    absolute bottom-4 right-4 z-10
                    flex h-14 w-14 items-center justify-center rounded-full
                    border transition-all duration-300 touch-manipulation
                    ${
                      isListening
                        ? "scale-110 border-red-400/80 bg-red-500 shadow-[0_0_28px_rgba(239,68,68,0.45)] animate-pulse"
                        : "border-white/10 bg-white/5 opacity-90 hover:opacity-100"
                    }
                  `}
                >
                  <Image
                    src="/icons/mic.png"
                    alt="Micrófono"
                    width={28}
                    height={28}
                    draggable={false}
                    className="pointer-events-none select-none invert"
                  />
                </button>
              </div>

              <div className="mt-3 min-h-[24px]">
                {isListening && (
                  <p className="text-sm font-medium text-red-300">
                    🔴 Escuchando... deja de hablar y en 3 segundos se cerrará.
                  </p>
                )}

                {!isListening && voiceError && (
                  <p className="text-sm leading-[1.4] text-[#fca5a5]">
                    {voiceError}
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="hidden md:flex md:flex-col md:items-center md:pt-2"
          >
            <div className="relative h-[340px] w-[340px]">
              <Image
                src={question.imageSrc}
                alt={`Pregunta ${question.id}`}
                fill
                className="object-contain"
              />
            </div>

            <PrimaryButton
              className="mt-12"
              onClick={onContinue}
              disabled={disabled}
            >
              Siguiente
            </PrimaryButton>
          </motion.div>
        </div>
      </motion.div>
    </ScreenLayout>
  );
}