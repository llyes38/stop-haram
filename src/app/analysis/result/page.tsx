"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateLastRoute } from "@/lib/authState";

interface QuizAnswers {
  [key: string]: string | string[];
}

function calculateScore(answers: QuizAnswers, domains: string[]): number {
  let score = 0;
  const q1 = answers.q1;
  if (q1 === "Plusieurs fois par jour") score += 30;
  else if (q1 === "Une fois par jour") score += 22;
  else if (q1 === "Quelques fois par semaine") score += 14;
  else if (q1 === "Rarement") score += 6;

  const q4 = answers.q4;
  if (q4 === "Plus de 3 ans") score += 20;
  else if (q4 === "1 à 3 ans") score += 14;
  else if (q4 === "6 à 12 mois") score += 10;
  else if (q4 === "Moins de 6 mois") score += 6;

  const q5 = answers.q5;
  if (Array.isArray(q5)) {
    if (q5.includes("Je craque trop vite")) score += 10;
    if (q5.includes("Je n'arrive pas à tenir quand je suis seul")) score += 10;
  } else {
    if (q5 === "Je craque trop vite") score += 10;
    if (q5 === "Je n'arrive pas à tenir quand je suis seul") score += 10;
  }

  const q8 = answers.q8;
  if (q8 === "J'ai déjà rechuté plusieurs fois malgré mes efforts") score += 12;
  else if (q8 === "J'ai déjà suivi des conseils ou un programme") score += 8;
  else if (q8 === "J'ai tenu quelques jours / semaines") score += 4;

  if (domains.length >= 3) score += 10;

  return Math.min(100, Math.max(0, score));
}

const bgStyle = {
  background:
    "linear-gradient(to bottom, #0a1f12 0%, #0d2818 30%, #0f2d22 60%, #0d2435 85%, #0a1c2e 100%)",
};

const stars = (
  <div className="absolute inset-0 pointer-events-none" aria-hidden>
    <span className="absolute top-[12%] left-[10%] w-1 h-1 rounded-full bg-white/40" />
    <span className="absolute top-[18%] left-[78%] w-1 h-1 rounded-full bg-white/30" />
    <span className="absolute top-[25%] left-[22%] w-1.5 h-1.5 rounded-full bg-white/35" />
    <span className="absolute top-[8%] left-[55%] w-1 h-1 rounded-full bg-white/25" />
    <span className="absolute top-[22%] left-[88%] w-1 h-1 rounded-full bg-white/30" />
    <span className="absolute top-[35%] left-[65%] w-1 h-1 rounded-full bg-white/30" />
    <span className="absolute top-[45%] left-[15%] w-1 h-1 rounded-full bg-white/25" />
  </div>
);

const averageScore = 45;

export default function AnalysisResultPage() {
  const router = useRouter();
  const [userScore, setUserScore] = useState<number | null>(null);

  useEffect(() => {
    updateLastRoute("/analysis/result");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedQuiz = window.localStorage.getItem("stopharam_quiz");
    const savedDomains = window.localStorage.getItem("stopharam_domains");
    const domains: string[] = savedDomains ? JSON.parse(savedDomains) : [];
    if (savedQuiz) {
      const answers: QuizAnswers = JSON.parse(savedQuiz);
      setUserScore(calculateScore(answers, domains));
    }
  }, []);

  const score = userScore ?? 0;

  return (
    <main
      className="min-h-screen w-full flex flex-col px-6 pt-10 pb-8 relative overflow-hidden"
      style={bgStyle}
    >
      {stars}

      <div className="w-full max-w-[420px] mx-auto flex flex-col flex-1 relative z-10">
        {/* Bouton Back */}
        <div className="mb-6">
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

        {/* Contenu principal - centré verticalement */}
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          {/* Titre principal avec icône check */}
          <h1 className="text-white text-3xl sm:text-4xl font-bold mb-6 flex items-center justify-center gap-3">
            Analyse terminée
            <span className="text-3xl" aria-hidden>
              ✅
            </span>
          </h1>

          {/* Sous-texte */}
          <p className="text-white/90 text-base sm:text-lg mb-6 max-w-[360px] leading-relaxed">
            À partir de tes réponses, nous avons identifié certaines habitudes et
            schémas.
          </p>

          {/* Texte principal */}
          <p className="text-white text-lg sm:text-xl font-semibold mb-8 max-w-[380px] leading-relaxed">
            La prochaine étape consiste à mieux comprendre comment cela se manifeste
            concrètement dans ton quotidien.
          </p>

          {/* Graphique - 2 barres */}
          <div className="flex items-end justify-center gap-8 mb-8" style={{ minHeight: "220px" }}>
            <div className="flex flex-col items-center h-full justify-end">
              <div className="text-white text-xl font-bold mb-2">{score}%</div>
              <div
                className="w-20 rounded-t-lg transition-all duration-500 ease-out"
                style={{
                  height: `${(score / 100) * 180}px`,
                  minHeight: "20px",
                  background: "linear-gradient(to top, #f97316 0%, #ea580c 100%)",
                }}
              />
              <div className="text-white/90 text-sm mt-2 text-center">Ton score</div>
            </div>
            <div className="flex flex-col items-center h-full justify-end">
              <div className="text-white text-xl font-bold mb-2">{averageScore}%</div>
              <div
                className="w-20 rounded-t-lg transition-all duration-500 ease-out"
                style={{
                  height: `${(averageScore / 100) * 180}px`,
                  minHeight: "20px",
                  background: "linear-gradient(to top, #10b981 0%, #059669 100%)",
                }}
              />
              <div className="text-white/90 text-sm mt-2 text-center">Moyenne</div>
            </div>
          </div>
        </div>

        {/* Bouton principal et sous-texte */}
        <div className="mt-auto mb-6">
          <button
            onClick={() => router.push("/symptoms")}
            className="w-full py-3.5 rounded-2xl bg-teal-500 text-white font-semibold text-base shadow-lg hover:bg-teal-600 active:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-colors"
          >
            Explorer tes symptômes
          </button>
          <p className="text-white/70 text-sm text-center mt-3">
            Une étape pour mieux comprendre, pas pour juger.
          </p>
        </div>

        {/* Disclaimer */}
        <p className="text-white/60 text-xs text-center leading-relaxed">
          *Ces indications sont fournies à titre informatif et ne constituent pas un
          diagnostic médical.
        </p>
      </div>
    </main>
  );
}
