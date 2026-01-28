"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/storage";

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
  const [name, setName] = useState("");
  const [streakDays, setStreakDays] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [streakStartIso, setStreakStartIso] = useState<string | null>(null);

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

  return (
    <div className="w-full flex flex-col px-6 pt-12 pb-8 text-white">
      <header className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-white">StopHaram</h1>
        <p className="text-white/60 text-sm mt-1">Un pas à la fois</p>
      </header>

      <section className="flex-1 space-y-6">
        <p className="text-xl sm:text-2xl font-medium text-white leading-snug">{messageText}</p>

        {/* Bloc visible : Vous êtes sur la bonne voie depuis + compteur + minuteur */}
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
          <p className="text-emerald-200/90 text-xs text-center mt-2">
            sans rechute
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => router.push("/parcours")}
            className="w-full rounded-xl bg-white py-4 text-gray-900 font-semibold text-base hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
          >
            Continuer mon parcours
          </button>
        </div>

        <p className="text-white/50 text-sm leading-relaxed max-w-[320px]">
          Allah voit tes efforts, même ceux que personne ne voit.
        </p>
      </section>

      <footer className="mt-auto pt-12">
        <button
          type="button"
          onClick={() => router.push("/urgence")}
          className="w-full rounded-xl bg-white/10 py-3.5 text-white/90 font-medium text-sm hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors border border-white/10 flex flex-col items-center gap-1"
        >
          <span>Besoin d&apos;aide maintenant</span>
          <span className="text-white/95 font-semibold">O Allah aide-moi 🤲</span>
        </button>
      </footer>
    </div>
  );
}
