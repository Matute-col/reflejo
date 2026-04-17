"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import type { ISourceOptions } from "@tsparticles/engine";

export default function ParticlesBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: "transparent" },
      fpsLimit: 120,
      detectRetina: true,
      particles: {
        number: {
          value: 140,
        },
        color: {
          value: "#8b5cf6",
        },
        links: {
          enable: true,
          color: "#6366f1",
          distance: 140,
          opacity: 0.4,
          width: 2,
        },
        move: {
          enable: true,
          speed: 0.5,
        },
        size: {
          value: 2,
        },
        opacity: {
          value: 0.6,
        },
      },
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          repulse: {
            distance: 70,
          },
        },
      },
    }),
    []
  );

  if (!init) return null;

  return <Particles id="tsparticles" options={options} className="absolute inset-0 z-0" />;
}