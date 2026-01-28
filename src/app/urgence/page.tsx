"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, saveUser, getSinLabel } from "@/lib/storage";
import { getAideForSin } from "@/lib/urgenceAide";
import { incrementResisted } from "@/lib/temptationStats";
import { clearTodayActions } from "@/lib/dailyActions";
import type { SelectedSin, StopHaramUser } from "@/lib/storage";

const LAST_STREAK_START_KEY = "last_streak_start_iso";
const LAST_RECHUTE_KEY = "last_rechute_check";

function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

type ViewState = "selectSinCraquer" | "aide" | "selectSin" | "confirm";

export default function UrgencePage() {
  const router = useRouter();
  const [view, setView] = useState<ViewState>("selectSinCraquer");
  const [user, setUser] = useState<StopHaramUser | null>(null);
  /** Péché dans lequel il va craquer → contenu d'aide personnalisé */
  const [selectedSinCraquer, setSelectedSinCraquer] = useState<SelectedSin | null>(null);
  /** Péché dans lequel il a rechuté → confirmation + reset */
  const [selectedSinRechute, setSelectedSinRechute] = useState<SelectedSin | null>(null);

  useEffect(() => {
    const u = getUser();
    setUser(u);
    if (u?.selectedSins?.length === 1) {
      setSelectedSinCraquer(u.selectedSins[0]);
      setView("aide");
    } else if (!u?.selectedSins?.length) {
      setSelectedSinCraquer("autre");
      setView("aide");
    }
  }, []);

  /** Vibration répétée tant que l'utilisateur est sur /urgence — s'arrête à la sortie */
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.vibrate) return;
    const pattern = [80, 60, 80, 60, 80];
    const id = setInterval(() => {
      navigator.vibrate(pattern);
    }, 400);
    return () => {
      clearInterval(id);
      navigator.vibrate(0);
    };
  }, []);

  const handleSelectSinCraquer = (sin: SelectedSin) => {
    setSelectedSinCraquer(sin);
    setView("aide");
  };

  const handleRechute = () => {
    setView("selectSin");
  };

  const handleSelectSinRechute = (sin: SelectedSin) => {
    setSelectedSinRechute(sin);
    setView("confirm");
  };

  const handleConfirmRechute = () => {
    if (!user || !selectedSinRechute) return;
    const updatedUser: StopHaramUser = {
      ...user,
      streakDays: 0,
      lastCheckinISO: getTodayISO(),
      perSinStreak: {
        ...user.perSinStreak,
        [selectedSinRechute]: 0,
      },
    };
    saveUser(updatedUser);
    const user = getUser();
    const labels = getDailyActionLabels(user);
    clearTodayActions(labels.length);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LAST_STREAK_START_KEY, new Date().toISOString());
      window.localStorage.setItem(LAST_RECHUTE_KEY, getTodayISO());
      window.localStorage.setItem("days_clean", "0");
    }
    router.replace("/home");
  };

  const handleCancel = () => {
    if (view === "confirm") {
      setView("selectSin");
      setSelectedSinRechute(null);
    } else if (view === "selectSin") {
      setView("aide");
    } else if (view === "aide") {
      if (user?.selectedSins?.length && user.selectedSins.length > 1) {
        setView("selectSinCraquer");
        setSelectedSinCraquer(null);
      } else {
        router.back();
      }
    } else {
      router.back();
    }
  };

  const sins = user?.selectedSins?.length ? user.selectedSins : (["autre"] as SelectedSin[]);
  const aide = selectedSinCraquer ? getAideForSin(selectedSinCraquer) : null;

  return (
    <main className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e] text-white">
      <div className="w-full max-w-[420px] mx-auto flex flex-col flex-1 px-6 pt-8 pb-8">
        <header className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={handleCancel}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/90 hover:bg-white/20 transition-colors"
            aria-label="Retour"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold tracking-tight text-white">
            {view === "selectSinCraquer" && "Dans quel péché vas-tu craquer ?"}
            {view === "aide" && "O Allah aide-moi 🤲"}
            {view === "selectSin" && "Dans quel péché as-tu rechuté ?"}
            {view === "confirm" && "Confirmer la rechute"}
          </h1>
        </header>

        {/* Vue: Sélection du péché (je vais craquer) */}
        {view === "selectSinCraquer" && (
          <section className="flex-1 flex flex-col gap-6">
            <p className="text-white/80 text-base leading-relaxed">
              Sélectionne le domaine pour recevoir des aides adaptées.
            </p>
            <div className="space-y-3">
              {sins.map((sin) => (
                <button
                  key={sin}
                  type="button"
                  onClick={() => handleSelectSinCraquer(sin)}
                  className="w-full rounded-xl bg-white/10 border border-white/20 py-4 px-4 text-white/90 font-medium text-left hover:bg-white/15 transition-colors flex items-center justify-between"
                >
                  <span>{getSinLabel(sin)}</span>
                  <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => router.back()}
              className="mt-auto w-full rounded-xl bg-white/5 border border-white/10 py-3.5 text-white/70 font-medium hover:bg-white/10 transition-colors"
            >
              Annuler
            </button>
          </section>
        )}

        {/* Vue: Aide personnalisée au péché */}
        {view === "aide" && aide && selectedSinCraquer && (
          <section className="flex-1 flex flex-col gap-6">
            <div className="rounded-2xl bg-emerald-500/15 border border-emerald-400/30 px-5 py-6 text-center">
              <p className="text-3xl mb-3">🤲</p>
              <p className="text-xl font-semibold text-white mb-2">
                O Allah aide-moi
              </p>
              <p className="text-emerald-200/90 text-sm">
                {aide.rappel}
              </p>
              {user?.selectedSins?.length && user.selectedSins.length > 1 && (
                <p className="text-emerald-300/70 text-xs mt-2">
                  Aide pour : {getSinLabel(selectedSinCraquer)}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <p className="text-white/90 text-base leading-relaxed">
                Tu n&apos;es pas seul. Respire. Chaque instant est une nouvelle chance.
              </p>
              <blockquote className="text-white/70 text-sm leading-relaxed italic pl-4 border-l-2 border-emerald-400/40">
                {aide.verset.texte}
                <span className="block text-white/50 text-xs mt-1">— {aide.verset.ref}</span>
              </blockquote>
              <ul className="text-white/80 text-sm space-y-2 pl-4">
                {aide.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto space-y-3 pt-6">
              <button
                type="button"
                onClick={() => {
                  incrementResisted();
                  router.push("/home");
                }}
                className="w-full rounded-xl bg-emerald-500/20 border border-emerald-400/40 py-3.5 text-emerald-200 font-semibold hover:bg-emerald-500/30 transition-colors"
              >
                Je tiens bon, retour à l&apos;accueil
              </button>
              <button
                type="button"
                onClick={handleRechute}
                className="w-full rounded-xl bg-red-500/15 border border-red-400/30 py-3.5 text-red-200/90 font-medium hover:bg-red-500/25 transition-colors"
              >
                Malheureusement je suis faible, je rechute
              </button>
            </div>
          </section>
        )}

        {/* Vue: Sélection du péché (rechute) */}
        {view === "selectSin" && user && (
          <section className="flex-1 flex flex-col gap-6">
            <p className="text-white/80 text-base leading-relaxed">
              Dans quel domaine as-tu rechuté ?
            </p>
            <div className="space-y-3">
              {user.selectedSins.map((sin) => (
                <button
                  key={sin}
                  type="button"
                  onClick={() => handleSelectSinRechute(sin)}
                  className="w-full rounded-xl bg-white/10 border border-white/20 py-4 px-4 text-white/90 font-medium text-left hover:bg-white/15 transition-colors flex items-center justify-between"
                >
                  <span>{getSinLabel(sin)}</span>
                  <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setView("aide")}
              className="mt-auto w-full rounded-xl bg-white/5 border border-white/10 py-3.5 text-white/70 font-medium hover:bg-white/10 transition-colors"
            >
              Annuler
            </button>
          </section>
        )}

        {/* Vue: Confirmation rechute */}
        {view === "confirm" && selectedSinRechute && (
          <section className="flex-1 flex flex-col gap-6">
            <div className="rounded-2xl bg-red-500/15 border border-red-400/30 px-5 py-6 text-center">
              <p className="text-white/90 text-base mb-2">
                Tu confirmes avoir rechuté dans :
              </p>
              <p className="text-xl font-semibold text-red-200">
                {getSinLabel(selectedSinRechute)}
              </p>
            </div>

            <p className="text-white/70 text-sm leading-relaxed text-center">
              Ton compteur sera remis à zéro. Chaque chute est une occasion de se relever plus fort. Allah aime ceux qui reviennent à Lui.
            </p>

            <div className="mt-auto space-y-3 pt-6">
              <button
                type="button"
                onClick={handleConfirmRechute}
                className="w-full rounded-xl bg-red-500/25 border border-red-400/40 py-3.5 text-red-200 font-semibold hover:bg-red-500/35 transition-colors"
              >
                Confirmer et recommencer
              </button>
              <button
                type="button"
                onClick={() => { setView("selectSin"); setSelectedSinRechute(null); }}
                className="w-full rounded-xl bg-white/5 border border-white/10 py-3.5 text-white/70 font-medium hover:bg-white/10 transition-colors"
              >
                Annuler
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
