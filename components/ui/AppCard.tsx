import { ReactNode } from "react";

type AppCardProps = {
  children: ReactNode;
  className?: string;
};

export default function AppCard({ children, className = "" }: AppCardProps) {
  return (
    <section
      className={`
        w-full max-w-[1400px]
        min-h-[92vh]
        rounded-[24px]
        border border-white/80
        px-4 py-6
        md:px-8 md:py-8
        flex flex-col
        ${className}
      `}
    >
      {children}
    </section>
  );
}