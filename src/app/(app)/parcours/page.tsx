"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, getDayNumber } from "@/lib/storage";

export default function ParcoursPage() {
  const router = useRouter();
  const [days, setDays] = useState<Array<{ day: number; focusTitle: string }>>([]);
  const [currentDay, setCurrentDay] = useState<number>(1);

  useEffect(() => {
    const user = getUser();
    if (!user?.plan?.days?.length) {
      setDays([]);
      setCurrentDay(1);
      return;
    }
    const dayNum = getDayNumber(user.startDateISO);
    const start = Math.min(Math.max(dayNum - 1, 0), user.plan.days.length - 1);
    const next7 = user.plan.days.slice(start, start + 7).map((d) => ({
      day: d.day,
      focusTitle: d.focus.title,
    }));
    setDays(next7);
    setCurrentDay(Math.min(dayNum, 28));
  }, []);

  return (
    <div className="w-full flex flex-col px-6 pt-8 pb-8 text-white">
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-white">
          Parcours quotidien
        </h1>
        <p className="text-white/60 text-sm mt-1">Parcours (bientôt)</p>
      </header>

      {/* Encadré : défi 30 jours — ton et UX soignés */}
      <div className="rounded-2xl bg-emerald-500/10 border border-emerald-400/25 px-5 py-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-bold">30</span>
          <h2 className="text-emerald-200 font-semibold text-base">Défi 30 jours</h2>
        </div>
        <div className="space-y-4 text-sm leading-relaxed">
          <p className="text-white/95">
            Ton défi dure <strong className="text-white">30 jours</strong>, un pas après l&apos;autre.
            Qu&apos;il y ait des réussites ou des rechutes, le parcours continue jusqu&apos;au bout.
          </p>
          <p className="text-emerald-200/90 italic">
            Allah regarde l&apos;effort sincère, pas la perfection.
            Chaque jour compte, chaque intention compte.
          </p>
          <p className="text-white/90">
            Avance avec honnêteté, sans te juger.
            <span className="block mt-1 text-emerald-200/80 italic">Allah voit ce que personne ne voit.</span>
          </p>
        </div>
      </div>

      <section className="flex-1 space-y-4">
        <p className="text-white/80 text-sm">
          Les 7 prochains jours de ton plan :
        </p>
        {days.length === 0 ? (
          <p className="text-white/60 text-sm">
            Ton parcours du jour sera ici. Complète le questionnaire pour générer ton plan.
          </p>
        ) : (
          <ul className="space-y-2">
            {days.map((d) => (
              <li
                key={d.day}
                className={`rounded-xl px-4 py-3 border text-left ${
                  d.day === currentDay
                    ? "bg-white/10 border-white/30 text-white"
                    : "bg-white/5 border-white/10 text-white/90"
                }`}
              >
                <span className="text-white/60 text-xs font-medium">Jour {d.day}/28</span>
                <p className="text-sm font-medium mt-0.5">{d.focusTitle}</p>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          onClick={() => router.push("/account")}
          className="rounded-xl bg-white/10 py-3 px-4 text-white/90 text-sm font-medium hover:bg-white/20 transition-colors mt-4"
        >
          Voir mon plan complet
        </button>
      </section>
    </div>
  );
}
