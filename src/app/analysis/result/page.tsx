"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateLastRoute, isOnboardingComplete } from "@/lib/authState";
import ShareCard from "@/components/ShareCard";
import { APP_URL } from "@/lib/share";
import { awardIntroQuizPoints } from "@/lib/pointsGratitude";
import { useSupabaseAuth } from "@/components/auth/AuthProvider";
import { saveQuizResult } from "@/lib/results";
import { incrementGuestActions } from "@/lib/authNudge";

interface QuizAnswers {
  [key: string]: string | string[];
}

function toArray(v: string | string[] | undefined): string[] {
  if (Array.isArray(v)) return v;
  return v ? [v] : [];
}

function getTeaser(answers: QuizAnswers, domains: string[]): { pointSensible: string; pointFort: string } {
  const q5 = toArray(answers.q5)[0];
  const q7 = toArray(answers.q7)[0];
  const q6 = toArray(answers.q6);
  const q2 = toArray(answers.q2)[0];
  const domainLabel = domains[0] || "ce qui te préoccupe";

  const POINT_SENSIBLE_MAP: Record<string, string> = {
    "Manque de plan": "Tu manques surtout d'un cadre clair pour avancer.",
    "Je craque trop vite": "La tentation te fait craquer avant que tu aies le temps de réfléchir.",
    "Je culpabilise puis je recommence": "La culpabilité t'enferme dans un cycle dont tu veux sortir.",
    "Je suis entouré de tentations": "Ton environnement te met souvent à l'épreuve.",
    "Je n'arrive pas à tenir quand je suis seul": "C'est quand tu es seul que c'est le plus difficile.",
  };

  const POINT_FORT_MAP: Record<string, string> = {
    "Arrêter complètement": "Tu as une volonté claire d'arrêter — c'est une vraie force.",
    "Réduire fortement": "Tu vises une réduction réaliste — c'est un bon début.",
    "Reprendre le contrôle": "Tu veux reprendre la main — ta détermination te portera.",
    "Progresser spirituellement": "Ta soif de progression spirituelle est un moteur puissant.",
    "Mieux gérer mes émotions": "Tu as compris que les émotions sont au cœur du problème — excellente prise de conscience.",
  };

  const pointSensible = (q5 && POINT_SENSIBLE_MAP[q5]) || (q2 ? "Les moments difficiles, tu les connais bien." : `On a bien compris ta situation avec ${domainLabel}.`);
  const pointFort = (q7 && POINT_FORT_MAP[q7]) || (q6.includes("Motivé à changer") ? "Tu gardes l'envie de changer même après une rechute — c'est précieux." : "Ta démarche montre que tu es prêt à avancer.");

  return { pointSensible, pointFort };
}

function calculateScore(answers: QuizAnswers, domains: string[]): number {
  let score = 0;
  const q1arr = toArray(answers.q1);
  if (q1arr.includes("Plusieurs fois par jour")) score += 30;
  else if (q1arr.includes("Une fois par jour")) score += 22;
  else if (q1arr.includes("Quelques fois par semaine")) score += 14;
  else if (q1arr.includes("Rarement")) score += 6;

  const q4arr = toArray(answers.q4);
  if (q4arr.includes("Plus de 3 ans")) score += 20;
  else if (q4arr.includes("1 à 3 ans")) score += 14;
  else if (q4arr.includes("6 à 12 mois")) score += 10;
  else if (q4arr.includes("Moins de 6 mois")) score += 6;

  const q5arr = toArray(answers.q5);
  if (q5arr.includes("Je craque trop vite")) score += 10;
  if (q5arr.includes("Je n'arrive pas à tenir quand je suis seul")) score += 10;

  const q8arr = toArray(answers.q8);
  if (q8arr.includes("J'ai déjà rechuté plusieurs fois malgré mes efforts")) score += 12;
  else if (q8arr.includes("J'ai déjà suivi des conseils ou un programme")) score += 8;
  else if (q8arr.includes("J'ai tenu quelques jours / semaines")) score += 4;

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
  const { user: supabaseUser } = useSupabaseAuth();
  const [userScore, setUserScore] = useState<number | null>(null);
  const [teaser, setTeaser] = useState<{ pointSensible: string; pointFort: string } | null>(null);
  const [savedToCloud, setSavedToCloud] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);

  useEffect(() => {
    setShowSavePrompt(isOnboardingComplete());
  }, []);

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
      setTeaser(getTeaser(answers, domains));
      awardIntroQuizPoints();
    }
  }, []);

  useEffect(() => {
    if (savedToCloud) return;
    const savedQuiz = typeof window !== "undefined" ? window.localStorage.getItem("stopharam_quiz") : null;
    const savedDomains = typeof window !== "undefined" ? window.localStorage.getItem("stopharam_domains") : null;
    const domains: string[] = savedDomains ? JSON.parse(savedDomains) : [];
    if (savedQuiz) {
      const answers: QuizAnswers = JSON.parse(savedQuiz);
      const score = calculateScore(answers, domains);
      saveQuizResult({
        answers,
        analysis: { score },
        sin_categories: domains,
      }).then(({ ok }) => {
        if (ok) {
          setSavedToCloud(true);
          if (!supabaseUser) incrementGuestActions();
        }
      });
    }
  }, [savedToCloud, supabaseUser]);

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
            Tes réponses révèlent des comportements où le péché et les tentations te
            touchent. Sans jugement — Allah est Ar-Rahîm, Il aime celui qui se repent
            — on est là pour t&apos;aider à avancer, pas pour te juger.
          </p>

          {/* Texte principal */}
          <p className="text-white text-lg sm:text-xl font-semibold mb-6 max-w-[380px] leading-relaxed">
            La prochaine étape consiste à mieux comprendre comment cela se manifeste
            concrètement dans ton quotidien.
          </p>

          {/* Teaser personnalisé — point sensible + point fort */}
          {teaser && (
            <div className="w-full max-w-[360px] mb-8 space-y-3">
              <div className="rounded-xl bg-amber-500/15 border border-amber-400/30 px-4 py-3 text-left">
                <p className="text-amber-200/90 text-xs font-semibold uppercase tracking-wide mb-1">Ton point sensible</p>
                <p className="text-white/95 text-sm leading-relaxed">{teaser.pointSensible}</p>
              </div>
              <div className="rounded-xl bg-emerald-500/15 border border-emerald-400/30 px-4 py-3 text-left">
                <p className="text-emerald-200/90 text-xs font-semibold uppercase tracking-wide mb-1">Ton point fort</p>
                <p className="text-white/95 text-sm leading-relaxed">{teaser.pointFort}</p>
              </div>
            </div>
          )}

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

        {/* Bloc Sauvegarde — si non connecté et parcours terminé (pas pendant l'onboarding) */}
        {!supabaseUser && showSavePrompt && (
          <div className="w-full max-w-[420px] mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 px-5 py-5">
            <h3 className="text-white font-semibold text-base mb-2">Sauvegarde tes résultats</h3>
            <p className="text-white/80 text-sm mb-4">Connecte-toi pour retrouver tes résultats sur tous tes appareils.</p>
            <button
              type="button"
              onClick={() => router.push("/login?redirect=/analysis/result")}
              className="w-full rounded-xl bg-emerald-500/30 border border-emerald-400/50 py-3 text-emerald-200 font-semibold text-sm hover:bg-emerald-500/40 transition-colors"
            >
              Se connecter pour sauvegarder
            </button>
          </div>
        )}

        {supabaseUser && savedToCloud && (
          <p className="text-emerald-300/90 text-sm text-center mb-4">✓ Résultats sauvegardés</p>
        )}

        {/* Bloc Défi à 2 : partage du résultat */}
        <div className="w-full max-w-[420px] mx-auto mb-6">
          <ShareCard
            title="🔥 Défi à 2"
            description="Partage ton résultat à un proche pour vous entraider. Fixez-vous un défi à 2 et tenez bon ensemble."
            shareTitle="Mon résultat StopHaram"
            shareText={`J'ai fait mon introspection sur StopHaram. Si tu veux, on se lance un défi à 2 pour s'entraider et tenir bon.\n➡️ Installe l'app ici : ${APP_URL}`}
            primaryLabel="Partager à un proche"
            secondaryLabel="Copier le message"
            copyLinkLabel="Copier le lien"
            shareTextExtra={teaser ? `Mon point à améliorer : ${teaser.pointSensible}` : undefined}
          />
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
