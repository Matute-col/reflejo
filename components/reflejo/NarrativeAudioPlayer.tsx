"use client";

import { useEffect, useRef, useState } from "react";

type NarrativeAudioPlayerProps = {
  text: string;
  onPlay?: () => void;
  onStop?: () => void;
  onEnd?: () => void;
};

export default function NarrativeAudioPlayer({
  text,
  onPlay,
  onStop,
  onEnd,
}: NarrativeAudioPlayerProps) {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const supported =
      "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

    setIsSupported(supported);

    if (!supported) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();

      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const getBestSpanishVoice = () => {
    const voices = window.speechSynthesis.getVoices();

    const preferredVoice =
      voices.find(
        (voice) =>
          /microsoft|google/i.test(voice.name) &&
          voice.lang.toLowerCase().startsWith("es")
      ) ||
      voices.find((voice) => voice.lang.toLowerCase().startsWith("es")) ||
      voices.find((voice) => voice.lang.toLowerCase().includes("es")) ||
      voices[0];

    return preferredVoice ?? null;
  };

  const handlePlay = () => {
    if (!isSupported || !text.trim()) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const bestVoice = getBestSpanishVoice();

    if (bestVoice) {
      utterance.voice = bestVoice;
      utterance.lang = bestVoice.lang;
    } else {
      utterance.lang = "es-ES";
    }

    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    utterance.onend = () => {
      setIsPlaying(false);
      onEnd?.();
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      onStop?.();
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (!isSupported) return;

    window.speechSynthesis.cancel();
    setIsPlaying(false);
    onStop?.();
  };

  const handleReplay = () => {
    handlePlay();
  };

  if (!isSupported) {
    return (
      <div className="rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-center text-[12px] text-white/60">
        Tu navegador no soporta reproducción de voz para esta experiencia.
      </div>
    );
  }

  return (
    <div className="rounded-[16px] border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm md:px-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={handlePlay}
          disabled={!text.trim() || isPlaying || !voicesLoaded}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-medium text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Escuchar
        </button>

        <button
          type="button"
          onClick={handlePause}
          disabled={!isPlaying}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-medium text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Detener
        </button>

        <button
          type="button"
          onClick={handleReplay}
          disabled={!text.trim() || !voicesLoaded}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-medium text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Repetir
        </button>
      </div>

      <p className="mt-2 text-center text-[11px] text-white/40">
        Audio opcional
      </p>
    </div>
  );
}