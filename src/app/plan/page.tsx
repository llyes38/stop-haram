"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateLastRoute } from "@/lib/authState";

type Profile = {
  firstName?: string;
  age?: number;
};

function getFirstNameFromProfile(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("stopharam_profile");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Profile;
    const name = typeof parsed.firstName === "string" ? parsed.firstName.trim() : "";
    if (!name) return null;
    // Sécurise un peu l’affichage (1er mot, capitalisé)
    const [firstWord] = name.split(/\s+/);
    if (!firstWord) return null;
    return firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
  } catch {
    return null;
  }
}

function getObjectiveDate(): string {
  try {
    const now = new Date();
    // Objectif dans ~90 jours
    const target = new Date(now);
    target.setDate(target.getDate() + 90);
    return target.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Dans quelques mois";
  }
}

export default function PlanPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState<string | null>(null);
  const [objectiveDate, setObjectiveDate] = useState<string>(() => getObjectiveDate());

  useEffect(() => {
    updateLastRoute("/plan");
    setFirstName(getFirstNameFromProfile());
  }, []);

  const title = firstName
    ? `${firstName}, nous avons créé ton plan personnalisé.`
    : "Nous avons créé ton plan personnalisé.";

  const handleUnlock = () => {
    router.push("/checkout");
  };

  const handleBismillah = () => {
    // Page d'offre promo Ramadan -50%
    router.push("/offer");
  };

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center bg-gradient-to-b from-[#0b1f3a] via-[#050818] to-black text-white px-5 py-8"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes plan-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes plan-pulse { 0%, 100% { opacity: 0.9; } 50% { opacity: 1; } }
        .plan-logo-float { animation: plan-float 3s ease-in-out infinite; }
        .plan-logo-pulse { animation: plan-pulse 2.5s ease-in-out infinite; }
      `}} />
      {/* Texture légère d'étoiles */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <span className="absolute top-[10%] left-[8%] h-1 w-1 rounded-full bg-white/40" />
        <span className="absolute top-[18%] left-[80%] h-1 w-1 rounded-full bg-white/30" />
        <span className="absolute top-[30%] left-[20%] h-1.5 w-1.5 rounded-full bg-white/25" />
        <span className="absolute top-[55%] left-[12%] h-1 w-1 rounded-full bg-white/20" />
        <span className="absolute top-[70%] left-[75%] h-1.5 w-1.5 rounded-full bg-white/30" />
      </div>

      <div className="relative z-10 w-full max-w-[420px] flex flex-col gap-8 pb-8">
        {/* SECTION 1 – HEADER */}
        <section className="flex flex-col items-center text-center gap-3 mt-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-400/60 text-emerald-300">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold leading-snug">
            {title}
          </h1>
          <p className="text-sm text-white/80">
            Bismillah. Tu as fait un pas sincère. Ce pas compte.
          </p>
          <p className="mt-3 px-4 py-3 rounded-xl bg-amber-500/20 border border-amber-400/40 text-sm font-semibold text-amber-100 text-center">
            Ton plan est établi selon la science islamique, le Coran et la Sunna.
          </p>
        </section>

        {/* SECTION 2 – OBJECTIF */}
        <section className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4 space-y-3">
          <div className="flex justify-center plan-logo-pulse">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 text-amber-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
          </div>
          <p className="text-sm text-white/85 text-center">
            Tu reprends le contrôle d’ici :
          </p>
          <div className="inline-flex items-center justify-center rounded-full bg-white text-gray-900 px-4 py-2 font-semibold text-sm">
            {objectiveDate}
          </div>
          <p className="text-xs text-white/70 leading-relaxed">
            Un objectif clair apaise l’esprit.
            <br />
            Allah facilite à celui qui avance avec une intention sincère.
          </p>
        </section>

        {/* SECTION 3 – PROMESSE PRINCIPALE */}
        <section className="space-y-3">
          <div className="flex justify-center plan-logo-float">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/20 text-violet-300 text-2xl">✨</div>
          </div>
          <h2 className="text-xl font-semibold text-center">
            Deviens la meilleure version de toi-même avec StopHaram
          </h2>
          <p className="text-sm text-center text-white/80">
            Plus fort. Plus pur. Plus serein.
          </p>
          <p className="text-sm text-white/85 leading-relaxed text-center">
            Ce parcours n’est pas une promesse vide.
            <br />
            C’est une méthode simple, progressive et alignée avec tes valeurs.
          </p>
        </section>

        {/* SECTION 4 – MAÎTRISE DE SOI (logo animé + icônes) */}
        <section className="space-y-4">
          <div className="flex flex-col items-center gap-3">
            <div className="plan-logo-float flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal-500/30 to-violet-500/30 border border-white/15 text-3xl" aria-hidden>
              🧘
            </div>
            <h3 className="text-lg font-semibold text-center">La maîtrise de soi</h3>
          </div>
          <ul className="space-y-3">
            {[
              { text: "Construis une maîtrise de toi, même quand tu es seul", color: "bg-blue-500", icon: "padlock" },
              { text: "Deviens plus confiant, sans arrogance", color: "bg-violet-500", icon: "person" },
              { text: "Remplis tes journées de fierté plutôt que de regret", color: "bg-amber-500", icon: "smiley" },
            ].map(({ text, color, icon }) => (
              <li key={text} className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${color} text-white`}>
                  {icon === "padlock" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  )}
                  {icon === "person" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>
                  )}
                  {icon === "smiley" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                  )}
                </div>
                <span className="text-sm text-white/95 flex-1">{text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
            <p className="text-xs italic text-white/80 leading-relaxed">
              « La vraie force n’est pas de vaincre les autres,
              mais de se maîtriser au moment de la tentation. »
            </p>
          </div>
        </section>

        {/* SECTION 6 – TÉMOIGNAGE */}
        <section className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-amber-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <h3 className="text-sm font-semibold text-white/90">Témoignage</h3>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
            <p className="text-sm text-white/90 leading-relaxed mb-3">
              « Tout ce temps, mon anxiété venait de la honte silencieuse.
              Aujourd’hui, je veux reprendre le contrôle. »
            </p>
            <p className="text-xs text-white/60">
              Témoignage anonyme – StopHaram
            </p>
          </div>
        </section>

        {/* SECTION 7 – RAPPEL SPIRITUEL */}
        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </div>
            <h3 className="text-sm font-semibold text-white/90">
              Rappel
            </h3>
          </div>
          <p className="text-sm text-white/85 leading-relaxed">
            Allah n’attend pas la perfection.
            Il aime celui qui revient, encore et encore.
            Chaque chute peut devenir un tournant,
            si tu n’abandonnes pas.
          </p>
        </section>

        {/* SECTION 8 – CONTENU DU PLAN */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-500/20 text-teal-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h3 className="text-sm font-semibold text-white/90">
              Ce que ton plan inclut
            </h3>
          </div>
          <ul className="space-y-2.5 text-sm text-white/85">
            {[
              "Un parcours quotidien (5 à 10 min)",
              "Des rappels adaptés à tes moments à risque",
              "Un système anti-rechute immédiat",
              "Un suivi clair de tes progrès",
              "Un accompagnement discret et bienveillant",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/30 text-emerald-300">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-white/70 leading-relaxed">
            Tu avances à ton rythme.
            L’essentiel, c’est la constance.
          </p>
        </section>

        {/* SECTION 9 – OFFRE EXCLUSIVE + CTA PAYANT + SECTION 10 – FOOTER (en bas après scroll) */}
        <section className="space-y-3 pt-4 pb-8">
          {/* Offre exclusive style Quittr */}
          <div className="rounded-2xl border-2 border-amber-400/60 bg-gradient-to-br from-amber-500/20 to-amber-600/10 px-4 py-3 text-center">
            <p className="text-sm font-semibold text-amber-200">
              Spécial Ramadan -50%
            </p>
            <button
              type="button"
              onClick={handleBismillah}
              className="mt-2 w-full rounded-xl bg-amber-400 py-3 text-base font-semibold text-gray-900 shadow-lg hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/60 active:bg-amber-500 transition-colors"
            >
              Bismillah
            </button>
          </div>
          <button
            type="button"
            onClick={handleUnlock}
            className="w-full rounded-2xl bg-white py-3.5 text-base font-semibold text-gray-900 shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/60 active:bg-gray-200 transition-colors"
          >
            Débloquer mon parcours
          </button>
          <p className="text-xs text-center text-white/70">
            Paiement discret – Annulable à tout moment
          </p>
          <p className="pt-1 text-[11px] text-center text-white/50 leading-relaxed">
            StopHaram n’est pas un jugement.
            C’est un chemin.
            Tu n’es pas seul.
          </p>
        </section>
      </div>
    </main>
  );
}

