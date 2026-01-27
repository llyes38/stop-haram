"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface QuizAnswers {
  [key: string]: string | string[];
}

function calculateScore(answers: QuizAnswers, domains: string[]): number {
  let score = 0;

  // Q1 - Fréquence
  const q1 = answers.q1;
  if (q1 === "Plusieurs fois par jour") score += 30;
  else if (q1 === "Une fois par jour") score += 22;
  else if (q1 === "Quelques fois par semaine") score += 14;
  else if (q1 === "Rarement") score += 6;

  // Q4 - Durée
  const q4 = answers.q4;
  if (q4 === "Plus de 3 ans") score += 20;
  else if (q4 === "1 à 3 ans") score += 14;
  else if (q4 === "6 à 12 mois") score += 10;
  else if (q4 === "Moins de 6 mois") score += 6;

  // Q5 - Blocage principal (peut être un array pour multi-select)
  const q5 = answers.q5;
  if (Array.isArray(q5)) {
    if (q5.includes("Je craque trop vite")) score += 10;
    if (q5.includes("Je n'arrive pas à tenir quand je suis seul")) score += 10;
  } else {
    if (q5 === "Je craque trop vite") score += 10;
    if (q5 === "Je n'arrive pas à tenir quand je suis seul") score += 10;
  }

  // Q8 - Niveau d'aide (besoin de déterminer le niveau)
  const q8 = answers.q8;
  if (q8 === "J'ai déjà rechuté plusieurs fois malgré mes efforts") score += 12;
  else if (q8 === "J'ai déjà suivi des conseils ou un programme") score += 8;
  else if (q8 === "J'ai tenu quelques jours / semaines") score += 4;

  // Domaines sélectionnés
  if (domains.length >= 3) score += 10;

  // Clamp entre 0 et 100
  return Math.min(100, Math.max(0, score));
}

function getRiskLevel(score: number): string {
  if (score >= 70) return "élevé";
  if (score >= 40) return "moyen";
  return "faible";
}

export default function AnalysisResultPage() {
  const router = useRouter();
  const [score, setScore] = useState<number | null>(null);
  const [riskLevel, setRiskLevel] = useState<string>("");
  const [domains, setDomains] = useState<string[]>([]);

  useEffect(() => {
    // Charger les réponses du quiz et les domaines
    const savedQuiz = localStorage.getItem("stopharam_quiz");
    const savedDomains = localStorage.getItem("stopharam_domains");

    let parsedDomains: string[] = [];
    if (savedDomains) {
      parsedDomains = JSON.parse(savedDomains);
      setDomains(parsedDomains);
    }

    if (savedQuiz) {
      const answers: QuizAnswers = JSON.parse(savedQuiz);
      const calculatedScore = calculateScore(answers, parsedDomains);
      setScore(calculatedScore);
      setRiskLevel(getRiskLevel(calculatedScore));
    }
  }, []);

  const averageScore = 45;
  const userScore = score || 0;

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
        <span className="absolute top-[35%] left-[65%] w-1 h-1 rounded-full bg-white/30" />
        <span className="absolute top-[45%] left-[15%] w-1 h-1 rounded-full bg-white/25" />
      </div>

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

        {/* Titre */}
        <div className="text-center mb-8">
          <h1 className="text-white text-3xl sm:text-4xl font-bold mb-3 flex items-center justify-center gap-2">
            Analyse terminée{" "}
            <span className="text-3xl" aria-hidden>
              ✅
            </span>
          </h1>
          <p className="text-white/90 text-base sm:text-lg mb-2">
            On a une bonne nouvelle à t&apos;annoncer…
          </p>
          <p className="text-white text-lg sm:text-xl font-semibold">
            Tes réponses montrent que tu as surtout besoin d&apos;un cadre clair
            et de rappels adaptés.
          </p>
        </div>

        {/* Graphique - Barres */}
        <div className="mb-8">
          <div className="flex items-end justify-center gap-8 mb-4" style={{ minHeight: "240px" }}>
            {/* Barre Ton score */}
            <div className="flex flex-col items-center h-full justify-end">
              <div className="text-white text-xl font-bold mb-2">
                {userScore}%
              </div>
              <div
                className="w-20 rounded-t-lg transition-all duration-500 ease-out"
                style={{
                  height: `${(userScore / 100) * 180}px`,
                  minHeight: "20px",
                  background:
                    "linear-gradient(to top, #f97316 0%, #ea580c 100%)",
                }}
              />
              <div className="text-white/90 text-sm mt-2 text-center">
                Ton score
              </div>
            </div>

            {/* Barre Moyenne */}
            <div className="flex flex-col items-center h-full justify-end">
              <div className="text-white text-xl font-bold mb-2">
                {averageScore}%
              </div>
              <div
                className="w-20 rounded-t-lg transition-all duration-500 ease-out"
                style={{
                  height: `${(averageScore / 100) * 180}px`,
                  minHeight: "20px",
                  background:
                    "linear-gradient(to top, #10b981 0%, #059669 100%)",
                }}
              />
              <div className="text-white/90 text-sm mt-2 text-center">
                Moyenne
              </div>
            </div>
          </div>

          {/* Niveau de risque */}
          <div className="text-center mt-6">
            <p className="text-white/90 text-base">
              Niveau de risque :{" "}
              <span className="font-semibold text-white">
                {riskLevel || "calcul..."}
              </span>
            </p>
          </div>
        </div>

        {/* Bouton principal */}
        <div className="mt-auto mb-6">
          <button
            onClick={() => router.push("/profile")}
            className="w-full py-3.5 rounded-xl bg-teal-500 text-white font-semibold text-base shadow-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-colors"
          >
            Voir mon plan
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-white/60 text-xs text-center leading-relaxed">
          Indication uniquement. StopHaram ne remplace pas un avis médical ou
          religieux.
        </p>
      </div>
    </main>
  );
}
