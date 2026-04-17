import ScreenLayout from "@/components/layout/ScreenLayout";
import PrimaryButton from "@/components/ui/PrimaryButton";

type WelcomeScreenProps = {
  onStart?: () => void;
};

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <ScreenLayout className="justify-center">
      <div className="mx-auto flex w-full max-w-[980px] flex-col items-center text-center px-4 md:px-0">
        <h1 className="max-w-[900px] text-[42px] md:text-[80px] font-medium leading-[1.05] tracking-tight text-white">
          Hola, Bienvenido a reflejo
        </h1>

        <p className="mt-4 text-[18px] font-light text-white/75 md:text-[32px]">
          Lo que ves... dice más de lo que imaginas.
        </p>

        <PrimaryButton className="mt-8 md:mt-10" onClick={onStart}>
          Comencemos
        </PrimaryButton>
      </div>
    </ScreenLayout>
  );
}