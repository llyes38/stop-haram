"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AnalysisPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2500; // 2.5 secondes
    const steps = 100;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(currentStep, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(timer);
        // Rediriger vers /analysis/result après un court délai
        setTimeout(() => {
          router.push("/analysis/result");
        }, 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [router]);

  // Calculer l'angle pour le cercle SVG (0-360 degrés)
  const circumference = 2 * Math.PI * 90; // rayon = 90
  const offset = circumference - (progress / 100) * circumference;

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 relative overflow-hidden"
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
        <span className="absolute top-[35%] left-[65%] w-1 h-1 rounded-full bg-white/30" />
        <span className="absolute top-[45%] left-[15%] w-1 h-1 rounded-full bg-white/25" />
        <span className="absolute top-[60%] left-[80%] w-1 h-1 rounded-full bg-white/30" />
        <span className="absolute top-[70%] left-[30%] w-1 h-1 rounded-full bg-white/25" />
      </div>

      <div className="w-full max-w-[420px] mx-auto flex flex-col items-center justify-center flex-1 relative z-10">
        {/* Bouton Back */}
        <div className="absolute top-0 left-0 w-full">
          <button
            onClick={() => router.push("/quiz?from=analysis")}
            className="text-white/80 hover:text-white focus:outline-none transition-colors flex items-center gap-2"
            aria-label="Retour"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Retour</span>
          </button>
        </div>

        {/* Cercle de progression */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative w-64 h-64">
            <svg
              width="256"
              height="256"
              viewBox="0 0 200 200"
              className="transform -rotate-90"
            >
              {/* Cercle de fond */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="8"
              />
              {/* Cercle de progression */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-100 ease-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
            {/* Pourcentage au centre */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-5xl font-bold">{progress}%</span>
            </div>
          </div>
        </div>

        {/* Titre et sous-titre */}
        <div className="text-center">
          <h1 className="text-white text-3xl sm:text-4xl font-bold mb-3">
            Calcul en cours
          </h1>
          <p className="text-white/80 text-lg sm:text-xl">
            Construction de ton plan personnalisé
          </p>
        </div>
      </div>
    </main>
  );
}
