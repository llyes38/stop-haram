"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SCREENS = [
  {
    bg: "linear-gradient(180deg, #b91c1c 0%, #991b1b 50%, #7f1d1d 100%)",
    icon: "💔",
    title: "Les péchés répétés fragilisent les relations",
    text: "Quand une mauvaise habitude s'installe,\nelle éloigne des autres, crée des tensions\net affaiblit les liens sincères.",
    citation: "« Le musulman est celui dont les musulmans sont à l'abri de sa langue et de sa main. » — Rapporté par Al-Bukhârî",
  },
  {
    bg: "linear-gradient(180deg, #b91c1c 0%, #991b1b 50%, #7f1d1d 100%)",
    icon: "⚖️",
    title: "Le cœur s'habitue au déséquilibre",
    text: "Répéter un péché banalise l'acte.\nCe qui choquait au début devient normal,\net l'effort pour s'en éloigner diminue.",
    citation: "« Quand le serviteur commet un péché, une tache noire apparaît sur son cœur. S'il persiste, elle s'étend jusqu'à le couvrir. » — Rapporté par At-Tirmidhî",
  },
  {
    bg: "linear-gradient(180deg, #b91c1c 0%, #991b1b 50%, #7f1d1d 100%)",
    icon: "📉",
    title: "La motivation et la discipline diminuent",
    text: "Beaucoup ressentent moins d'élan,\nplus de paresse, de distraction\net une difficulté à rester constant.",
    citation: "« Deux bienfaits dont beaucoup de gens sont perdants : la santé et le temps libre. » — Rapporté par Al-Bukhârî",
  },
  {
    bg: "linear-gradient(180deg, #b91c1c 0%, #991b1b 50%, #7f1d1d 100%)",
    icon: "💭",
    title: "Tu te sens souvent mal sans savoir pourquoi ?",
    text: "Le péché répété alourdit le cœur,\nmême quand on ne s'en rend pas compte.\nCela crée un vide intérieur silencieux.",
    citation: "« Non ! Mais ce qu'ils ont commis a rouillé leurs cœurs. » — Sourate Al-Mutaffifîn, v.14",
  },
  {
    bg: "linear-gradient(180deg, #1e3a5f 0%, #1e40af 40%, #1d4ed8 100%)",
    icon: "🌱",
    title: "Le retour à l'équilibre est possible",
    text: "En s'éloignant progressivement des péchés,\nle cœur s'apaise, la clarté revient\net la constance redevient possible.",
    citation: "« Dis : Ô Mes serviteurs qui avez commis des excès ! Ne désespérez pas de la miséricorde d'Allah. Car Allah pardonne tous les péchés. » — Sourate Az-Zumar, v.53",
  },
];

export default function AwarenessPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const screen = SCREENS[index];
  const isLast = index === SCREENS.length - 1;

  const handleNext = () => {
    if (isLast) {
      router.push("/onboarding");
    } else {
      setIndex((i) => i + 1);
    }
  };

  const handleBack = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  const lines = screen.text.split("\n");

  const isHope = index === 4;

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center px-6 py-12 relative"
      style={{ background: screen.bg }}
    >
      {index > 0 && (
        <button
          type="button"
          onClick={handleBack}
          className="absolute top-6 left-6 flex items-center justify-center w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 z-10"
          aria-label="Slide précédente"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes awareness-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.05); }
        }
        @keyframes awareness-glow {
          0%, 100% { opacity: 0.9; filter: drop-shadow(0 0 8px rgba(255,255,255,0.3)); }
          50% { opacity: 1; filter: drop-shadow(0 0 16px rgba(255,255,255,0.5)); }
        }
        .awareness-icon-float { animation: awareness-float 2.5s ease-in-out infinite; }
        .awareness-icon-glow { animation: awareness-glow 2s ease-in-out infinite; }
      `}} />
      <div className="w-full max-w-[420px] mx-auto flex flex-col flex-1 justify-center items-center text-center">
        <div
          className={`text-6xl sm:text-7xl mb-6 ${isHope ? "awareness-icon-glow" : "awareness-icon-float"}`}
          role="img"
          aria-hidden
        >
          {screen.icon}
        </div>
        <h1 className="text-white text-2xl sm:text-3xl font-semibold mb-6 leading-tight">
          {screen.title}
        </h1>
        <div className="space-y-3 mb-6">
          {lines.map((line, i) => (
            <p key={i} className="text-white/95 text-base sm:text-lg leading-relaxed">
              {line}
            </p>
          ))}
        </div>

        {screen.citation && (
          <blockquote className="mb-10 px-4 py-3 rounded-xl bg-white/10 border-l-4 border-white/40 text-white/90 text-sm sm:text-base italic leading-relaxed text-left max-w-[360px]">
            {screen.citation}
          </blockquote>
        )}

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {SCREENS.map((_, i) => (
            <span
              key={i}
              className={`inline-block w-2.5 h-2.5 rounded-full transition-colors ${
                i === index ? "bg-white" : "bg-white/40"
              }`}
              aria-hidden
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full max-w-[320px] py-3.5 rounded-2xl bg-white text-gray-900 font-semibold text-base shadow-lg hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors flex items-center justify-center gap-2"
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
