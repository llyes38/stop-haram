"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

function SplashScreen({ onSkip }: { onSkip: () => void }) {
  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 relative"
      style={{
        background:
          "linear-gradient(to right, #0a1f12 0%, #0d2818 35%, #143a22 70%, #1a4d2e 100%)",
      }}
    >
      <div className="w-full max-w-[420px] flex flex-col items-center justify-center flex-1 py-12">
        <h1
          className="text-[2.75rem] sm:text-[3.25rem] font-extrabold tracking-[0.08em] text-white text-center mb-12"
          style={{
            textShadow:
              "0 1px 0 rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.25)",
          }}
        >
          StopHaram
        </h1>

        <p className="text-white text-center text-lg sm:text-xl font-medium leading-relaxed tracking-tight mb-4">
          Fais une pause.
        </p>
        <p className="text-white text-center text-lg sm:text-xl font-medium leading-relaxed tracking-tight mb-16">
          Reviens à l'essentiel.
        </p>

        <div
          className="flex items-center justify-center mb-20"
          aria-hidden
        >
          <svg
            width="120"
            height="32"
            viewBox="0 0 120 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-amber-200/90"
          >
            <path
              d="M14 6 C 6 6 6 26 14 26"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M106 6 C 114 6 114 26 106 26"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="48" cy="16" r="1.8" fill="currentColor" />
            <circle cx="56" cy="16" r="1.8" fill="currentColor" />
            <circle cx="60" cy="16" r="2.2" fill="currentColor" />
            <circle cx="64" cy="16" r="1.8" fill="currentColor" />
            <circle cx="72" cy="16" r="1.8" fill="currentColor" />
          </svg>
        </div>

        <p className="text-white/70 text-sm font-normal text-center tracking-wide font-serif">
          Un accompagnement discret et bienveillant
        </p>
      </div>

      {/* Bouton "Passer" en bas à droite */}
      <button
        onClick={onSkip}
        className="absolute bottom-6 right-6 text-white/60 text-sm font-normal hover:text-white/90 focus:outline-none focus:underline transition-colors"
      >
        Passer
      </button>
    </main>
  );
}

function WelcomeScreen() {
  return (
    <main
      className="min-h-screen w-full flex flex-col px-6 pt-10 pb-8 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, #0a1f12 0%, #0d2818 30%, #0f2d22 60%, #0d2435 85%, #0a1c2e 100%)",
      }}
    >
      {/* Légères étoiles en arrière-plan */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <span className="absolute top-[12%] left-[10%] w-1 h-1 rounded-full bg-white/40" />
        <span className="absolute top-[18%] left-[78%] w-1 h-1 rounded-full bg-white/30" />
        <span className="absolute top-[25%] left-[22%] w-1.5 h-1.5 rounded-full bg-white/35" />
        <span className="absolute top-[8%] left-[55%] w-1 h-1 rounded-full bg-white/25" />
        <span className="absolute top-[22%] left-[88%] w-1 h-1 rounded-full bg-white/30" />
      </div>

      <div className="w-full max-w-[420px] mx-auto flex flex-col flex-1 relative z-10">
        {/* Logo */}
        <header className="text-center mb-10">
          <h1
            className="text-2xl font-extrabold tracking-[0.06em] text-white"
            style={{
              textShadow:
                "0 1px 0 rgba(255,255,255,0.35), 0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            StopHaram
          </h1>
        </header>

        {/* Contenu principal — aligné à gauche */}
        <section className="flex-1">
          <h2 className="text-white text-2xl sm:text-3xl font-bold text-left mb-4">
            Bienvenue
          </h2>
          <p className="text-white/95 text-base sm:text-lg font-normal leading-relaxed text-left max-w-[360px] mb-10">
            Commençons par comprendre ce qui te fait parfois perdre le contrôle.
          </p>

          {/* Icône décorative (lauriers + étoiles) */}
          <div
            className="flex items-center justify-start mb-14"
            aria-hidden
          >
            <svg
              width="100"
              height="28"
              viewBox="0 0 100 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-amber-200/80"
            >
              <path
                d="M14 5 C 6 5 6 23 14 23"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M86 5 C 94 5 94 23 86 23"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="38" cy="14" r="1.6" fill="currentColor" />
              <circle cx="46" cy="14" r="1.6" fill="currentColor" />
              <circle cx="50" cy="14" r="2" fill="currentColor" />
              <circle cx="54" cy="14" r="1.6" fill="currentColor" />
              <circle cx="62" cy="14" r="1.6" fill="currentColor" />
            </svg>
          </div>
        </section>

        {/* Actions */}
        <footer className="flex flex-col items-end gap-4 mt-auto">
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-gray-900 font-semibold text-base shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
          >
            Commencer l'introspection
            <span aria-hidden className="text-lg leading-none">→</span>
          </Link>
          <Link
            href="/login"
            className="text-white/70 text-sm font-normal hover:text-white/90 focus:outline-none focus:underline transition-colors"
          >
            Déjà inscrit ?
          </Link>
        </footer>
      </div>
    </main>
  );
}

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const transitionToWelcome = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setOpacity(0);
    setTimeout(() => {
      setShowWelcome(true);
      setOpacity(1);
    }, 300);
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      transitionToWelcome();
    }, 3200);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen">
      {!showWelcome ? (
        <div
          style={{
            opacity,
            transition: "opacity 300ms ease-in-out",
          }}
        >
          <SplashScreen onSkip={transitionToWelcome} />
        </div>
      ) : (
        <div
          style={{
            opacity,
            transition: "opacity 300ms ease-in-out",
          }}
        >
          <WelcomeScreen />
        </div>
      )}
    </div>
  );
}
