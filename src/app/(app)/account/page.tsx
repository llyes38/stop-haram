"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getUser,
  ensureUserDefaults,
  saveUser,
  getDayNumber,
  getSinLabel,
  getScoreLabel,
} from "@/lib/storage";
import { generatePlan } from "@/lib/programEngine";
import type { StopHaramUser } from "@/lib/storage";
import { getState, setAuth, resetOnboarding } from "@/lib/authState";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<StopHaramUser | null>(null);

  useEffect(() => {
    let u = getUser();
    if (!u || !u.plan?.days?.length) {
      u = ensureUserDefaults(u ? { ...u } : {});
      if (!u.plan?.days?.length) {
        u = { ...u, plan: generatePlan(u) };
        saveUser(u);
      }
      setUser(u);
    } else {
      setUser(u);
    }
  }, []);

  if (!user) {
    return (
      <div className="w-full flex flex-col px-6 pt-8 pb-8 text-white">
        <p className="text-white/70 text-sm">Chargement du profil…</p>
      </div>
    );
  }

  const dayNum = getDayNumber(user.startDateISO);
  const currentDayIndex = Math.min(Math.max(dayNum - 1, 0), user.plan.days.length - 1);
  const dayPlan = user.plan.days[currentDayIndex];

  return (
    <div className="w-full flex flex-col px-6 pt-8 pb-8 text-white">
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-white">Compte</h1>
        <p className="text-white/90 text-lg mt-2">
          Salam {user.name || "toi"}
        </p>
        <p className="text-white/60 text-sm mt-1">
          Voici ton profil basé sur tes réponses.
        </p>
      </header>

      {/* Badges objectifs */}
      <section className="mb-6">
        <h2 className="text-white/80 text-sm font-medium mb-3">Tes objectifs</h2>
        <div className="flex flex-wrap gap-2">
          {user.selectedSins.map((sin) => (
            <span
              key={sin}
              className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-sm text-white/90"
            >
              {getSinLabel(sin)}
            </span>
          ))}
        </div>
      </section>

      {/* Niveau par objectif */}
      <section className="mb-6">
        <h2 className="text-white/80 text-sm font-medium mb-3">Ton niveau par objectif</h2>
        <ul className="space-y-3">
          {user.selectedSins.map((sin) => {
            const score = user.scores[sin] ?? 50;
            const label = getScoreLabel(score);
            return (
              <li key={sin} className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-white/90 text-sm font-medium">{getSinLabel(sin)}</span>
                  <span className="text-white/60 text-xs">{label}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-teal-400/80 transition-all"
                    style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Ton plan */}
      <section className="mb-6">
        <h2 className="text-white/80 text-sm font-medium mb-3">Ton plan</h2>
        <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-4 space-y-3">
          <p className="text-white/90 text-sm">Plan : 28 jours</p>
          <p className="text-white/80 text-sm">
            Focus actuel : {getSinLabel(user.plan.focusSin)}
          </p>
          <p className="text-white/80 text-sm">
            Jour actuel : {Math.min(dayNum, 28)}/28
          </p>
          {dayPlan && (
            <div className="pt-2 space-y-3 border-t border-white/10">
              <div>
                <p className="text-white/60 text-xs font-medium mb-0.5">Focus</p>
                <p className="text-white/90 text-sm font-medium">{dayPlan.focus.title}</p>
                <p className="text-white/60 text-xs">{dayPlan.focus.desc}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs font-medium mb-0.5">Base</p>
                <p className="text-white/90 text-sm font-medium">{dayPlan.base.title}</p>
                <p className="text-white/60 text-xs">{dayPlan.base.desc}</p>
              </div>
              {dayPlan.optional && (
                <div>
                  <p className="text-white/60 text-xs font-medium mb-0.5">Optionnel</p>
                  <p className="text-white/90 text-sm font-medium">{dayPlan.optional.title}</p>
                  <p className="text-white/60 text-xs">{dayPlan.optional.desc}</p>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 mt-3">
          <button
            type="button"
            onClick={() => router.push(getState()?.lastRoute || "/parcours")}
            className="w-full rounded-xl bg-white py-3 text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-colors"
          >
            Continuer mon parcours
          </button>
          <button
            type="button"
            onClick={() => router.push("/parcours")}
            className="w-full rounded-xl bg-white/10 py-3 text-white/90 font-medium text-sm hover:bg-white/15 transition-colors border border-white/10"
          >
            Voir tout le plan
          </button>
          <button
            type="button"
            onClick={() => router.push("/quiz?from=account")}
            className="w-full rounded-xl bg-white/10 py-3 text-white/90 font-medium text-sm hover:bg-white/15 transition-colors border border-white/10"
          >
            Modifier mes réponses
          </button>
          <button
            type="button"
            onClick={() => {
              resetOnboarding();
              router.replace("/profile");
            }}
            className="w-full rounded-xl bg-amber-500/20 py-3 text-amber-200 font-medium text-sm hover:bg-amber-500/30 transition-colors border border-amber-400/30"
          >
            Refaire le parcours complet
          </button>
        </div>
      </section>

      <button
        type="button"
        onClick={() => {
          setAuth({ isLoggedIn: false });
          router.replace("/start");
        }}
        className="w-full rounded-xl bg-white/10 py-3.5 text-white/70 text-sm font-medium hover:bg-white/15 transition-colors border border-white/10 mt-4"
      >
        Se déconnecter
      </button>
    </div>
  );
}
