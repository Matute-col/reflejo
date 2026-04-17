type ResultCardProps = {
  title: string;
  value: number;
  description: string;
  color: string;
};

function hexToRgba(hex: string, alpha: number) {
  const cleanHex = hex.replace("#", "");

  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function ResultCard({
  title,
  value,
  description,
  color,
}: ResultCardProps) {
  const softBg = hexToRgba(color, 0.14);
  const borderColor = hexToRgba(color, 0.38);
  const titleStart = hexToRgba(color, 1);
  const titleEnd = "#ffffff";

  return (
    <div
      className="w-[260px] rounded-xl border p-4 backdrop-blur-[2px]"
      style={{
        backgroundColor: softBg,
        borderColor,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className="text-left text-[17px] font-bold leading-[1.15]"
          style={{
            backgroundImage: `linear-gradient(90deg, ${titleStart} 0%, ${titleEnd} 90%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {title}
        </span>

        <span className="shrink-0 text-right text-[16px] font-bold leading-none text-white">
          {value}%
        </span>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <div
          className="relative h-[46px] w-[46px] shrink-0 rounded-full"
          style={{
            background: `conic-gradient(${color} 0% ${value}%, rgba(255,255,255,0.18) ${value}% 100%)`,
          }}
        >
          <div className="absolute inset-[9px] rounded-full bg-[#161616]/95" />
        </div>

        <p className="text-left text-[12px] leading-[1.35] text-white/82">
          {description}
        </p>
      </div>
    </div>
  );
}