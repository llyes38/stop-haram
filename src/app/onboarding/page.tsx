"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Screen = {
  icon: string;
  title: string;
  text: string;
  rappel: string;
  /** Nom d'Allah en rapport avec la slide — pour montrer l'accompagnement */
  asmaAllah: string;
  asmaAllahAr: string;
};

const SCREENS: Screen[] = [
  {
    icon: "👋",
    title: "Bienvenue sur StopHaram",
    text: "Introspection, reprendre le contrôle, avancer pas à pas.\nDiscret et bienveillant.",
    rappel: "Allah ouvre toujours une porte : chaque retour compte.",
    asmaAllah: "Al-Fattâh — Celui qui ouvre",
    asmaAllahAr: "ٱلْفَتَّاحُ",
  },
  {
    icon: "🧠",
    title: "Rééduque ton nafs",
    text: "Des exercices simples pour remplacer l'automatisme par un choix.\nMoins d'impulsivité, plus de maîtrise.",
    rappel: "Le cœur se nourrit de ce qu'on répète.",
    asmaAllah: "Al-Hakîm — Le Sage",
    asmaAllahAr: "ٱلْحَكِيمُ",
  },
  {
    icon: "🧭",
    title: "Continue d'avancer",
    text: "Un suivi quotidien te rappelle ton intention et t'aide à tenir.\nRégularité, pas perfection.",
    rappel: "Ne te décourage pas : la progression se fait par étapes.",
    asmaAllah: "Al-Hâdî — Le Guide",
    asmaAllahAr: "ٱلْهَادِي",
  },
  {
    icon: "🛡️",
    title: "Anticipe la tentation",
    text: "Reconnais tes déclencheurs et prépare des protections\navant que la tentation arrive.",
    rappel: "Fuir la tentation au début est plus facile que lutter au milieu.",
    asmaAllah: "Al-Hafîz — Le Protecteur",
    asmaAllahAr: "ٱلْحَفِيظُ",
  },
  {
    icon: "💪",
    title: "Comprends tes forces et tes faiblesses",
    text: "Comprends tes forces et faiblesses.\nSuis ta progression, bâtis une discipline stable.",
    rappel: "Le vrai combat est intérieur : il se gagne avec patience.",
    asmaAllah: "Al-Qawiyy — Le Fort",
    asmaAllahAr: "ٱلْقَوِيُّ",
  },
  {
    icon: "🌱",
    title: "Améliore ta vie, pas à pas",
    text: "En reprenant le contrôle, tu gagnes en paix intérieure,\nen énergie et en sérénité.",
    rappel: "Chaque pas vers Allah est précieux, même petit.",
    asmaAllah: "As-Salâm — La Paix",
    asmaAllahAr: "ٱلسَّلَامُ",
  },
];

const bgStyle = {
  background:
    "linear-gradient(to bottom, #0a1628 0%, #0d1f35 25%, #0f2438 50%, #0d2835 75%, #0a1c2e 100%)",
};

export default function OnboardingPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const screen = SCREENS[currentIndex];
  const isLast = currentIndex === SCREENS.length - 1;

  const handleNext = () => {
    if (isLast) {
      router.push("/testimonials");
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    } else {
      router.back();
    }
  };

  const lines = screen.text.split("\n");
  const isLastScreen = currentIndex === SCREENS.length - 1;

  return (
    <main
      className="relative flex min-h-screen w-full flex-col items-center overflow-hidden px-6 py-12"
      style={bgStyle}
    >
      {/* Texture étoiles */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <span className="absolute top-[10%] left-[8%] h-1 w-1 rounded-full bg-white/35" />
        <span className="absolute top-[15%] left-[85%] h-1 w-1 rounded-full bg-white/30" />
        <span className="absolute top-[28%] left-[18%] h-1.5 w-1.5 rounded-full bg-white/30" />
        <span className="absolute top-[6%] left-[52%] h-1 w-1 rounded-full bg-white/25" />
        <span className="absolute top-[24%] left-[92%] h-1 w-1 rounded-full bg-white/28" />
        <span className="absolute top-[45%] left-[5%] h-1 w-1 rounded-full bg-white/20" />
        <span className="absolute top-[55%] left-[88%] h-1 w-1 rounded-full bg-white/22" />
        <span className="absolute top-[72%] left-[12%] h-1 w-1 rounded-full bg-white/25" />
        <span className="absolute top-[80%] left-[78%] h-1.5 w-1.5 rounded-full bg-white/28" />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes onboarding-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.05); }
        }
        @keyframes onboarding-glow {
          0%, 100% { opacity: 0.9; filter: drop-shadow(0 0 8px rgba(255,255,255,0.3)); }
          50% { opacity: 1; filter: drop-shadow(0 0 16px rgba(255,255,255,0.5)); }
        }
        .onboarding-icon-float { animation: onboarding-float 2.5s ease-in-out infinite; }
        .onboarding-icon-glow { animation: onboarding-glow 2s ease-in-out infinite; }
      `,
        }}
      />

      {/* Bouton retour */}
      <button
        type="button"
        onClick={handleBack}
        className="absolute top-6 left-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Retour"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="relative z-0 mx-auto flex w-full max-w-[420px] flex-1 flex-col items-center justify-center text-center">
        {/* Nom d'Allah — en grand (arabe + français), pour montrer qu'Allah accompagne l'utilisateur */}
        <div className="mb-4 text-center">
          <p className="text-3xl sm:text-4xl font-bold text-amber-200 mb-1" dir="rtl" lang="ar">
            {screen.asmaAllahAr}
          </p>
          <p className="text-lg sm:text-xl font-semibold text-amber-200/90 tracking-wide">
            {screen.asmaAllah}
          </p>
        </div>

        {/* Icône */}
        <div
          className={`mb-4 text-6xl sm:text-7xl ${isLastScreen ? "onboarding-icon-glow" : "onboarding-icon-float"}`}
          role="img"
          aria-hidden
        >
          {screen.icon}
        </div>

        {/* Titre */}
        <h1 className="mb-6 text-2xl font-semibold leading-tight text-white sm:text-3xl">
          {screen.title}
        </h1>

        {/* Texte */}
        <div className="mb-6 space-y-3">
          {lines.map((line, i) => (
            <p
              key={i}
              className="text-base leading-relaxed text-white/95 sm:text-lg"
            >
              {line}
            </p>
          ))}
        </div>

        {/* Rappel islamique */}
        <p className="mb-10 max-w-[320px] text-center text-sm italic leading-snug text-white/75">
          {screen.rappel}
        </p>

        {/* Dots */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {SCREENS.map((_, i) => (
            <span
              key={i}
              className={`inline-block h-2.5 w-2.5 rounded-full transition-colors ${i === currentIndex ? "bg-white" : "bg-white/40"}`}
              aria-hidden
            />
          ))}
        </div>

        {/* Bouton */}
        <button
          type="button"
          onClick={handleNext}
          className="flex w-full max-w-[320px] items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-base font-semibold text-gray-900 shadow-lg transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 active:bg-gray-200"
        >
          {isLast ? "Continuer" : "Suivant"}
          {!isLast && (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>
    </main>
  );
}
