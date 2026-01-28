"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, getSinLabel, getDayNumber } from "@/lib/storage";
import { getTemptationStats } from "@/lib/temptationStats";
import { getCurrentStatut } from "@/lib/statuts";

const DEFI_JOURS = 30;

export default function ProgressPage() {
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [stats, setStats] = useState<{ tempted: number; resisted: number }>({ tempted: 0, resisted: 0 });

  useEffect(() => {
    setUser(getUser());
    setStats(getTemptationStats());
  }, []);

  const streakDays = user?.streakDays ?? null;
  const focusSin = user?.plan?.focusSin ? getSinLabel(user.plan.focusSin) : null;
  const challengeDay = user?.startDateISO
    ? Math.min(Math.max(getDayNumber(user.startDateISO), 1), DEFI_JOURS)
    : 0;
  const currentStatut = getCurrentStatut(streakDays);
  const ratio = stats.tempted > 0 ? Math.round((100 * stats.resisted) / stats.tempted) : null;

  return (
    <div className="w-full flex flex-col px-6 pt-8 pb-8 text-white">
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-white">Progrès</h1>
        <p className="text-white/60 text-sm mt-1">Où tu en es, en temps réel</p>
      </header>

      <section className="flex-1 space-y-6">
        {/* Série sans rechute */}
        <div className="rounded-2xl bg-emerald-500/15 border border-emerald-400/30 px-5 py-4">
          <p className="text-emerald-200 font-semibold text-sm mb-1">Série sans rechute</p>
          <p className="text-2xl font-bold text-white tabular-nums">
            {streakDays != null && Number.isFinite(streakDays)
              ? `${streakDays} jour${streakDays !== 1 ? "s" : ""}`
              : "—"}
          </p>
        </div>

        {/* Statut actuel */}
        <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4">
          <p className="text-white/70 font-medium text-sm mb-2">Ton statut</p>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentStatut.emoji}</span>
            <div>
              <p className="font-semibold text-white">{currentStatut.label}</p>
              <p className="text-white/60 text-xs mt-0.5">{currentStatut.description}</p>
            </div>
          </div>
        </div>

        {/* Défi 30 jours */}
        <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4">
          <p className="text-white/70 font-medium text-sm mb-2">Défi 30 jours</p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/90 text-sm">Jour actuel</span>
            <span className="font-bold tabular-nums text-white">{challengeDay}/{DEFI_JOURS}</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-400/80 transition-all"
              style={{ width: `${(challengeDay / DEFI_JOURS) * 100}%` }}
            />
          </div>
        </div>

        {/* Focus + tenté / résisté */}
        {focusSin && (
          <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4">
            <p className="text-white/70 font-medium text-sm mb-1">Focus actuel</p>
            <p className="text-white font-medium">{focusSin}</p>
          </div>
        )}

        <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4">
          <p className="text-white/70 font-medium text-sm mb-3">Face à la tentation</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-amber-200 tabular-nums">{stats.tempted}</p>
              <p className="text-amber-200/80 text-xs">fois tenté</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-200 tabular-nums">{stats.resisted}</p>
              <p className="text-emerald-200/80 text-xs">fois résisté</p>
            </div>
          </div>
          {stats.tempted > 0 && ratio != null && (
            <p className="text-white/60 text-xs mt-3">
              Tu tiens bon dans <span className="font-semibold text-emerald-300">{ratio}%</span> des cas
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => router.push("/parcours")}
          className="rounded-xl bg-white/10 py-3 px-4 text-white/90 text-sm font-medium hover:bg-white/20 transition-colors w-full"
        >
          Voir le parcours
        </button>
      </section>
    </div>
  );
}
