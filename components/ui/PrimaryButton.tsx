type PrimaryButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
};

export default function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        min-w-[180px] h-[50px] md:h-[52px]
        rounded-full
        border border-[#8c78ff]/70
        bg-[#f4f4f5]
        px-6
        text-[16px] font-semibold tracking-[0.08em] text-[#1f1f1f] md:text-[18px]
        shadow-[0_10px_30px_rgba(124,92,255,0.18)]
        transition-all duration-300
        hover:-translate-y-[1px] hover:scale-[1.015]
        hover:border-[#9a88ff]
        hover:shadow-[0_14px_34px_rgba(124,92,255,0.28)]
        active:translate-y-0 active:scale-[0.985]
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-[#a78bfa]/70
        focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
        disabled:cursor-not-allowed disabled:scale-100
        disabled:border-[#8c78ff]/35
        disabled:opacity-45 disabled:shadow-none
        ${className}
      `}
    >
      <span className="translate-y-[0.5px]">{children}</span>
    </button>
  );
}