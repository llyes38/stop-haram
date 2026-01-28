"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getUser, saveUser, getDayNumber } from "@/lib/storage";
import { getTemptationStats, incrementTempted } from "@/lib/temptationStats";

const DEFI_JOURS = 30;

const LAST_STREAK_START_KEY = "last_streak_start_iso";

function formatElapsed(ms: number): { days: number; hours: number; minutes: number; seconds: number } {
  const sec = Math.floor(ms / 1000) % 60;
  const min = Math.floor(ms / 60000) % 60;
  const hours = Math.floor(ms / 3600000) % 24;
  const days = Math.floor(ms / 86400000);
  return { days, hours, minutes: min, seconds: sec };
}

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const [name, setName] = useState("");
  const [streakDays, setStreakDays] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [streakStartIso, setStreakStartIso] = useState<string | null>(null);
  const [stats, setStats] = useState<{ tempted: number; resisted: number }>({ tempted: 0, resisted: 0 });
  const [whyStop, setWhyStop] = useState("");
  const [whyStopEditing, setWhyStopEditing] = useState(false);
  const [whyStopDraft, setWhyStopDraft] = useState("");
  const [challengeDay, setChallengeDay] = useState<number>(0);

  useEffect(() => {
    const u = getUser();
    setWhyStop(u?.profileInfo?.whyStop?.trim() || "");
    if (u?.startDateISO) {
      const day = getDayNumber(u.startDateISO);
      setChallengeDay(Math.min(Math.max(1, day), DEFI_JOURS));
    } else {
      setChallengeDay(0);
    }
  }, [pathname]);

  useEffect(() => {
    setStats(getTemptationStats());
  }, [pathname]);

  useEffect(() => {
    const user = getUser();
    const legacyName = typeof window === "undefined" ? null : window.localStorage.getItem("user_name");
    const legacyDays = typeof window === "undefined" ? null : window.localStorage.getItem("days_clean");
    setName(user?.name?.trim() || legacyName?.trim() || "");
    setStreakDays(user?.streakDays ?? (legacyDays != null && legacyDays !== "" ? parseInt(legacyDays, 10) : null));
    if (typeof window !== "undefined") {
      let start = window.localStorage.getItem(LAST_STREAK_START_KEY);
      const days = user?.streakDays ?? (legacyDays != null && legacyDays !== "" ? parseInt(legacyDays, 10) : null);
      if (!start && days != null && days > 0) {
        const approx = new Date(Date.now() - days * 86400000).toISOString();
        window.localStorage.setItem(LAST_STREAK_START_KEY, approx);
        start = approx;
      }
      setStreakStartIso(start || null);
      if (start) {
        const tick = () => {
          const startDate = new Date(start!).getTime();
          setElapsed(formatElapsed(Date.now() - startDate));
        };
        tick();
        const t = setInterval(tick, 1000);
        return () => clearInterval(t);
      } else {
        setElapsed(null);
      }
    }
  }, []);

  const displayName = name || null;
  const messageText = displayName ? `${displayName}, tu es toujours debout.` : "Tu es sur le bon chemin.";
  const hasStreak = streakDays != null && Number.isFinite(streakDays) && streakDays >= 0;

  const ratio = stats.tempted > 0 ? Math.round((100 * stats.resisted) / stats.tempted) : null;

  const handleJeVaisCraquer = () => {
    incrementTempted();
    router.push("/urgence");
  };

  const startEditWhyStop = () => {
    setWhyStopDraft(whyStop);
    setWhyStopEditing(true);
  };

  const saveWhyStop = () => {
    const user = getUser();
    if (!user) return;
    const text = whyStopDraft.trim();
    const updated = {
      ...user,
      profileInfo: { ...user.profileInfo, whyStop: text || undefined },
    };
    saveUser(updated);
    setWhyStop(text);
    setWhyStopEditing(false);
  };

  const cancelEditWhyStop = () => {
    setWhyStopEditing(false);
    setWhyStopDraft("");
  };

  return (
    <div className="w-full flex flex-col px-6 pt-12 pb-12 text-white">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes stress-shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          20% { transform: translateX(-2px) rotate(-3deg); }
          40% { transform: translateX(2px) rotate(3deg); }
          60% { transform: translateX(-1px) rotate(-2deg); }
          80% { transform: translateX(1px) rotate(2deg); }
        }
        .stress-emoji { display: inline-block; animation: stress-shake 0.8s ease-in-out infinite; }
      `}} />

      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">StopHaram</h1>
        <p className="text-white/60 text-sm mt-1">Un pas à la fois</p>
      </header>

      <section className="flex flex-col gap-6 pb-28">
        <p className="text-xl sm:text-2xl font-medium text-white leading-snug">{messageText}</p>

        {/* Bloc : Défi 30 jours */}
        <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/80 text-sm font-semibold">Défi 30 jours</span>
            <span className="text-white font-bold tabular-nums">{challengeDay}/{DEFI_JOURS}</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-400/80 transition-all duration-500"
              style={{ width: `${(challengeDay / DEFI_JOURS) * 100}%` }}
            />
          </div>
          <p className="text-white/50 text-xs mt-1.5">
            {challengeDay >= DEFI_JOURS ? "Challenge terminé 🎉" : challengeDay === 0 ? "Commence ton parcours pour lancer le défi" : `Jour ${challengeDay} sur ${DEFI_JOURS}`}
          </p>
        </div>

        {/* Bloc : Vous êtes sur la bonne voie depuis */}
        <div className="rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/40 px-5 py-5 shadow-lg">
          <p className="text-emerald-200 text-sm font-semibold text-center mb-3">
            Vous êtes sur la bonne voie depuis
          </p>
          <div className="text-center">
            {hasStreak && (
              <p className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
                {streakDays === 0 ? "Jour 0" : `${streakDays} jour${streakDays > 1 ? "s" : ""}`}
              </p>
            )}
            {elapsed != null && (
              <p className="text-xl sm:text-2xl font-bold text-white/95 tabular-nums mt-2">
                {elapsed.days > 0 && `${elapsed.days}j `}
                {String(elapsed.hours).padStart(2, "0")}h {String(elapsed.minutes).padStart(2, "0")}min {String(elapsed.seconds).padStart(2, "0")}s
              </p>
            )}
            {!hasStreak && !elapsed && (
              <p className="text-white/90 text-lg">Chaque effort compte.</p>
            )}
          </div>
          <p className="text-emerald-200/90 text-xs text-center mt-2">sans rechute</p>
        </div>

        {/* Bloc : Mon but en arrêtant mes péchés */}
        <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 text-sm font-medium" aria-hidden>?</span>
              <span className="text-white/80 text-sm font-medium">Mon but en arrêtant mes péchés est …</span>
            </div>
            {!whyStopEditing && (
              <button
                type="button"
                onClick={startEditWhyStop}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white/80 transition-colors"
                aria-label="Modifier la phrase"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
          </div>
          {whyStopEditing ? (
            <div className="space-y-3">
              <textarea
                value={whyStopDraft}
                onChange={(e) => setWhyStopDraft(e.target.value)}
                placeholder="Ex. me rapprocher d'Allah et devenir une meilleure personne."
                rows={4}
                className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 resize-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={saveWhyStop}
                  className="flex-1 rounded-xl bg-emerald-500/20 border border-emerald-400/40 py-2.5 text-emerald-200 text-sm font-medium hover:bg-emerald-500/30 transition-colors"
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={cancelEditWhyStop}
                  className="rounded-xl bg-white/10 py-2.5 px-4 text-white/70 text-sm font-medium hover:bg-white/15 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap min-h-[2.5rem]">
              {whyStop || "Ex. me rapprocher d'Allah. Clique sur le crayon pour modifier."}
            </p>
          )}
        </div>

        {/* Bloc : Tenté / Résisté — motivation */}
        <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-5">
          <p className="text-white/80 text-sm font-semibold mb-4 text-center">
            Tes victoires face à la tentation
          </p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="rounded-xl bg-amber-500/15 border border-amber-400/30 py-3 px-4 text-center">
              <p className="text-2xl font-bold text-amber-200 tabular-nums">{stats.tempted}</p>
              <p className="text-amber-200/80 text-xs mt-0.5">fois tenté</p>
            </div>
            <div className="rounded-xl bg-emerald-500/20 border border-emerald-400/40 py-3 px-4 text-center">
              <p className="text-2xl font-bold text-emerald-200 tabular-nums">{stats.resisted}</p>
              <p className="text-emerald-200/80 text-xs mt-0.5">fois résisté</p>
            </div>
          </div>
          {stats.tempted > 0 ? (
            <div className="space-y-2">
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-400/80 transition-all duration-500"
                  style={{ width: `${Math.min(100, ratio ?? 0)}%` }}
                />
              </div>
              <p className="text-white/70 text-xs text-center">
                Tu tiens bon dans <span className="font-semibold text-emerald-300">{ratio}%</span> des cas
              </p>
            </div>
          ) : (
            <p className="text-white/50 text-xs text-center">
              Tu n&apos;as pas encore eu besoin d&apos;aide — continue comme ça.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => router.push("/parcours")}
          className="w-full rounded-xl bg-white py-4 text-gray-900 font-semibold text-base hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
        >
          Continuer mon parcours
        </button>

        <p className="text-white/50 text-sm leading-relaxed max-w-[320px]">
          Allah voit tes efforts, même ceux que personne ne voit.
        </p>
      </section>

      {/* Bouton Je vais craquer — fixe, reste visible au scroll (rouge alerte mais pas fort, type bouton panique) */}
      <div className="fixed bottom-20 left-0 right-0 z-20 flex justify-center px-6 max-w-[420px] mx-auto">
        <button
          type="button"
          onClick={handleJeVaisCraquer}
          className="w-full rounded-2xl bg-red-900/50 border-2 border-red-500/60 py-3.5 text-white font-semibold text-base hover:bg-red-900/60 hover:border-red-500/70 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all shadow-lg flex flex-col items-center gap-0.5"
        >
          <span className="text-base flex items-center gap-2">
            <span className="stress-emoji">😰</span>
            Je vais craquer
          </span>
          <span className="text-red-200 font-medium text-xs">O Allah aide-moi 🤲</span>
        </button>
      </div>
    </div>
  );
}
