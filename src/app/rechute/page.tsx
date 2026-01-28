"use client";

import { useRouter } from "next/navigation";
import { completeOnboarding, updateLastRoute } from "@/lib/authState";
import { clearTodayActions } from "@/lib/dailyActions";
import { getUser, getDailyActionLabels } from "@/lib/storage";

const STORAGE_KEYS = {
  last_rechute_check: "last_rechute_check",
  days_clean: "days_clean",
  last_streak_start_iso: "last_streak_start_iso",
} as const;

const COMMUNITY_COUNT = "13 933";

function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function RechutePage() {
  const router = useRouter();

  const markRechuteDone = (stillStrong: boolean) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEYS.last_rechute_check, getTodayISO());
    const raw = window.localStorage.getItem(STORAGE_KEYS.days_clean);
    const current = raw !== null && raw !== "" ? parseInt(raw, 10) : 0;
    const num = Number.isFinite(current) ? current : 0;
    const nowIso = new Date().toISOString();
    if (stillStrong) {
      window.localStorage.setItem(STORAGE_KEYS.days_clean, String(num + 1));
      const existingStart = window.localStorage.getItem(STORAGE_KEYS.last_streak_start_iso);
      if (!existingStart || num === 0) window.localStorage.setItem(STORAGE_KEYS.last_streak_start_iso, nowIso);
    } else {
      window.localStorage.setItem(STORAGE_KEYS.days_clean, "0");
      window.localStorage.setItem(STORAGE_KEYS.last_streak_start_iso, nowIso);
      const user = getUser();
      const labels = getDailyActionLabels(user);
      clearTodayActions(labels.length);
    }
    try {
      const raw = window.localStorage.getItem("stopharam_user");
      if (raw) {
        const u = JSON.parse(raw) as { streakDays?: number };
        const next = stillStrong ? (u.streakDays ?? 0) + 1 : 0;
        window.localStorage.setItem("stopharam_user", JSON.stringify({ ...u, streakDays: next, lastCheckinISO: getTodayISO() }));
      }
    } catch (_) {}
    completeOnboarding();
    updateLastRoute("/rechute");
    router.replace("/home");
  };

  const handleStillStrong = () => markRechuteDone(true);
  const handleRelapsed = () => markRechuteDone(false);
  const handleClose = () => markRechuteDone(true);

  return (
    <main className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#1a0a2e] via-[#0f172a] to-[#050818] text-white">
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <span className="absolute top-[10%] left-[8%] h-1 w-1 rounded-full bg-white/50" />
        <span className="absolute top-[18%] left-[88%] h-1.5 w-1.5 rounded-full bg-white/40" />
        <span className="absolute top-[35%] left-[12%] h-1 w-1 rounded-full bg-white/30" />
        <span className="absolute top-[55%] left-[85%] h-1 w-1 rounded-full bg-white/35" />
        <span className="absolute top-[75%] left-[20%] h-1.5 w-1.5 rounded-full bg-white/25" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen max-w-[420px] mx-auto w-full px-5 pt-6 pb-12">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold tracking-tight text-white">
            StopHaram
          </h1>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/90 hover:bg-white/20 transition-colors"
            aria-label="Fermer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </header>

        <div className="flex justify-center my-6">
          <div
            className="w-40 h-40 rounded-full border-4 border-white/20 shadow-2xl"
            style={{
              background: "radial-gradient(circle at 30% 30%, #e8e8e8, #a0a0a0 40%, #606060 70%, #303030)",
              boxShadow: "inset 0 2px 8px rgba(255,255,255,0.3), inset 0 -4px 8px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.5)",
            }}
          />
        </div>
        <div className="h-px w-16 mx-auto bg-white/20 mb-8" />

        <section className="flex flex-col items-center text-center mb-8">
          <p className="text-4xl mb-2" aria-hidden>👀</p>
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-4 max-w-[320px]">
            As-tu rechuté ? Informe la communauté
          </h2>
          <p className="text-4xl sm:text-5xl font-bold text-white mb-1 tabular-nums">
            {COMMUNITY_COUNT}
          </p>
          <p className="text-sm text-white/80 mb-8">
            tiennent encore bon
          </p>

          <div className="w-full max-w-[320px] space-y-3">
            <button
              type="button"
              onClick={handleStillStrong}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-500 py-4 text-white font-semibold text-base hover:bg-indigo-600 active:bg-indigo-700 transition-colors shadow-lg border border-white/10"
            >
              Non, je tiens encore bon 💪
            </button>
            <button
              type="button"
              onClick={handleRelapsed}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600/90 py-4 text-white font-semibold text-base hover:bg-red-600 active:bg-red-700 transition-colors border border-red-500/30"
            >
              Oui, j&apos;ai rechuté ⚠️
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
