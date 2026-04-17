type TextInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function TextInput({
  value,
  onChange,
  placeholder = "Escribe lo que ves...",
}: TextInputProps) {
  return (
    <div
      className="
        w-full max-w-[600px]
        h-[80px]
        rounded-[12px]
        border border-white/20
        bg-[#1a1a2e]/60
        backdrop-blur-md
        px-4
        flex items-center
      "
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          bg-transparent
          outline-none
          text-white
          text-lg
          placeholder:text-white/40
        "
      />
    </div>
  );
}