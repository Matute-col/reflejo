import { ReactNode } from "react";

type ScreenLayoutProps = {
  children: ReactNode;
  className?: string;
};

export default function ScreenLayout({
  children,
  className = "",
}: ScreenLayoutProps) {
  return (
    <div
      className={`
        flex flex-1 flex-col items-center justify-center
        text-center
        ${className}
      `}
    >
      {children}
    </div>
  );
}