"use client";

import { ReactNode } from "react";
import ParticlesBackground from "./ParticlesBackground";
import AppCard from "@/components/ui/AppCard";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <ParticlesBackground />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-3 md:p-6">
<AppCard>
  {children}
</AppCard>
      </div>
    </main>
  );
}