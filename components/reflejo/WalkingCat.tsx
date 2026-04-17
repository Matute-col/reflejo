"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";

const frames = [
  "/images/sprites/cat-walk/catwalk-01.webp",
  "/images/sprites/cat-walk/catwalk-02.webp",
  "/images/sprites/cat-walk/catwalk-03.webp",
  "/images/sprites/cat-walk/catwalk-04.webp",
  "/images/sprites/cat-walk/catwalk-05.webp",
  "/images/sprites/cat-walk/catwalk-06.webp",
  "/images/sprites/cat-walk/catwalk-07.webp",
  "/images/sprites/cat-walk/catwalk-08.webp",
  "/images/sprites/cat-walk/catwalk-09.webp",
  "/images/sprites/cat-walk/catwalk-10.webp",
  "/images/sprites/cat-walk/catwalk-11.webp",
  "/images/sprites/cat-walk/catwalk-12.webp",
  "/images/sprites/cat-walk/catwalk-13.webp",
  "/images/sprites/cat-walk/catwalk-14.webp",
];

// Configuración de velocidad: 
// A mayor número, más lento camina el gato (ms entre cuadros).
const FRAME_SPEED = 400; 

type WalkingCatProps = {
  className?: string;
};

export default function WalkingCat({ className = "" }: WalkingCatProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const requestRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  useEffect(() => {
    const animate = (time: number) => {
      if (!lastUpdateTimeRef.current) {
        lastUpdateTimeRef.current = time;
      }

      const deltaTime = time - lastUpdateTimeRef.current;

      // Solo cambiamos de cuadro si ha pasado el tiempo definido en FRAME_SPEED
      if (deltaTime >= FRAME_SPEED) {
        setFrameIndex((prevIndex) => (prevIndex + 1) % frames.length);
        lastUpdateTimeRef.current = time;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  const currentFrame = frames[frameIndex];

  if (!currentFrame) return null;

  return (
    <div className="flex h-[130px] items-start justify-center overflow-hidden md:h-[160px]">
      <Image
        src={currentFrame}
        alt="Gato Reflejo caminando"
        width={220}
        height={140}
        priority
        // Nota: He mantenido tus estilos originales de Tailwind
        className={`h-auto w-[180px] -mb-6 md:w-[220px] md:-mb-7 object-contain ${className}`}
      />
    </div>
  );
}