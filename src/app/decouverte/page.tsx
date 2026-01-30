"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { setDecouverteSeen } from "@/lib/decouverteStorage";

const SWIPE_THRESHOLD = 50;

const SLIDES = [
  {
    title: "Bienvenue sur StopHaram",
    subtitle: "Tu es sur la bonne voie",
    text: "Chaque jour, tu vois ton avancée et tes actions personnalisées.",
    mockup: (
      <div className="w-full max-w-[280px] mx-auto rounded-xl bg-emerald-500/15 border border-emerald-400/30 px-4 py-4 scale-90">
        <p className="text-emerald-200 text-xs font-semibold text-center mb-2">Tu es sur la bonne voie depuis</p>
        <p className="text-2xl font-bold text-white text-center tabular-nums">5 jours</p>
        <p className="text-emerald-200/80 text-xs text-center mt-1">sans rechute</p>
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-white/70 text-xs font-medium">Défi 30 jours</p>
          <div className="h-1.5 rounded-full bg-white/10 mt-1 overflow-hidden">
            <div className="h-full bg-emerald-400/80 rounded-full" style={{ width: "17%" }} />
          </div>
          <p className="text-white/50 text-xs mt-1">Jour 5/30</p>
        </div>
      </div>
    ),
  },
  {
    title: "Actions du jour",
    subtitle: "Valide ta journée",
    text: "3 à 10 actions personnalisées selon tes péchés. Dhikr, sadaqa, Coran…",
    mockup: (
      <div className="w-full max-w-[280px] mx-auto rounded-xl bg-white/5 border border-white/10 px-4 py-4 scale-90">
        <p className="text-emerald-200/90 text-xs font-semibold mb-3">3 actions du jour</p>
        <div className="space-y-2">
          {["Faire mon intention du jour", "Lire un rappel ou une invocation", "Une action concrète"].map((a, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-bold">✓</span>
              <span className="text-white/90 text-xs line-through">{a}</span>
            </div>
          ))}
        </div>
        <p className="text-emerald-200/70 text-xs mt-2">+ Faire une sadaqa (don)</p>
      </div>
    ),
  },
  {
    title: "Parcours & Progrès",
    subtitle: "Ton plan 30 jours",
    text: "Parcours détaillé, versets lus, invocations, statuts à débloquer.",
    mockup: (
      <div className="w-full max-w-[280px] mx-auto rounded-xl bg-white/5 border border-white/10 px-4 py-4 scale-90">
        <p className="text-white/80 text-xs font-semibold mb-2">Parcours quotidien</p>
        <div className="flex gap-2 mb-2">
          {["Porno", "Musique"].map((s, i) => (
            <span key={i} className="rounded-full bg-amber-500/20 px-2 py-0.5 text-amber-200 text-xs">🎯 {s}</span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="rounded-lg bg-emerald-500/15 px-2 py-2 text-center">
            <p className="text-lg font-bold text-emerald-200 tabular-nums">12</p>
            <p className="text-emerald-200/80 text-xs">versets lus</p>
          </div>
          <div className="rounded-lg bg-emerald-500/15 px-2 py-2 text-center">
            <p className="text-lg font-bold text-emerald-200 tabular-nums">3</p>
            <p className="text-emerald-200/80 text-xs">invocations</p>
          </div>
        </div>
        <p className="text-white/50 text-xs mt-2">Statuts : Nouveau-né → Débutant → …</p>
      </div>
    ),
  },
  {
    title: "Allah est avec toi",
    subtitle: "Tu n'es pas seul",
    text: "Bouton « Je vais craquer » + Se confier (IA) dans le menu. Urgence, invocations, conseils.",
    mockup: (
      <div className="w-full max-w-[280px] mx-auto space-y-2 scale-90">
        <div className="rounded-xl bg-red-500/15 border border-red-400/30 px-4 py-3 flex items-center gap-3">
          <span className="text-xl">😰</span>
          <div>
            <p className="text-red-200 font-semibold text-sm">Je vais craquer</p>
            <p className="text-red-200/70 text-xs">O Allah aide-moi 🤲</p>
          </div>
        </div>
        <div className="rounded-xl bg-violet-500/15 border border-violet-400/25 px-4 py-3 flex items-center gap-3">
          <span className="text-xl">🤲</span>
          <div>
            <p className="text-violet-200 font-semibold text-sm">Se confier</p>
            <p className="text-violet-200/70 text-xs">Menu central — IA bienveillante</p>
          </div>
        </div>
      </div>
    ),
  },
];

export default function DecouvertePage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  const handleNext = useCallback(() => {
    if (isLast) {
      setDecouverteSeen();
      router.replace("/home");
    } else {
      setIndex((i) => i + 1);
    }
  }, [isLast, router]);

  const handlePrev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const handleSkip = () => {
    setDecouverteSeen();
    router.replace("/home");
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (touchStart == null || touchEnd == null) return;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) < SWIPE_THRESHOLD) return;
    if (diff > 0) handleNext();
    else handlePrev();
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <main
      className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e] text-white overflow-hidden touch-pan-y"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <p className="text-emerald-200/80 text-sm font-medium mb-2">{slide.subtitle}</p>
        <h1 className="text-xl sm:text-2xl font-bold text-white text-center mb-4">{slide.title}</h1>
        <p className="text-white/85 text-sm text-center max-w-[320px] mb-6 leading-relaxed">{slide.text}</p>
        <div className="w-full flex justify-center mb-8 min-h-[180px]">{slide.mockup}</div>
        <div className="flex gap-2 mb-8">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={`inline-block h-2 w-2 rounded-full transition-colors ${i === index ? "bg-emerald-400 w-4" : "bg-white/30"}`}
              aria-hidden
            />
          ))}
        </div>
        <div className="flex flex-col gap-3 w-full max-w-[320px]">
          <button
            type="button"
            onClick={handleNext}
            className="w-full rounded-xl bg-emerald-500 py-3.5 text-white font-semibold text-base hover:bg-emerald-600 transition-colors"
          >
            {isLast ? "C'est parti 💚" : "Suivant"}
          </button>
          {!isLast && (
            <button
              type="button"
              onClick={handleSkip}
              className="text-white/50 text-sm hover:text-white/70 transition-colors"
            >
              Passer
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
