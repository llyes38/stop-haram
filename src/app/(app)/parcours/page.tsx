"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, saveUser, getDayNumber, getSinLabel, hasDefiStarted } from "@/lib/storage";
import { getLevelFromDay, LEVEL_NAMES, LEVEL_EMOJIS, getLevelBounds } from "@/lib/defiLevels";
import { ACTION_1 } from "@/lib/programEngine";
import type { SelectedSin } from "@/lib/storage";

export default function ParcoursPage() {
  const router = useRouter();
  const [days, setDays] = useState<Array<{ day: number; intentionTitle: string; focusTitle: string; baseTitle: string }>>([]);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [selectedSins, setSelectedSins] = useState<SelectedSin[]>([]);
  const [focusSin, setFocusSin] = useState<SelectedSin | null>(null);
  const [baseSin, setBaseSin] = useState<SelectedSin | null>(null);
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);

  useEffect(() => {
    const u = getUser();
    setUser(u);
    if (!u?.plan?.days?.length) {
      setDays([]);
      setCurrentDay(1);
      setSelectedSins(u?.selectedSins ?? []);
      setFocusSin(u?.plan?.focusSin ?? null);
      setBaseSin(u?.plan?.baseSin ?? null);
      return;
    }
    setSelectedSins(u.selectedSins ?? []);
    if (!hasDefiStarted(u)) {
      setFocusSin(u.plan.focusSin ?? null);
      setBaseSin(u.plan.baseSin ?? null);
      setDays(u.plan.days.slice(0, 7).map((d) => {
        const action1List = ACTION_1[u.plan.focusSin ?? "autre"] ?? ACTION_1.autre;
        const actionsPerDay = u.profileInfo?.actionsPerDay ?? 3;
        let intentionTitle = d.intention?.title;
        if (!intentionTitle || intentionTitle === "Faire mon intention du jour" || intentionTitle?.startsWith("Intention :")) {
          const actionIdx = (d.day - 1) % action1List.length;
          intentionTitle = action1List[actionIdx]?.title ?? "Faire mon intention du jour";
        }
        const additionalTitles = d.additionalActions?.map(a => a.title) ?? [];
        return {
          day: d.day,
          intentionTitle,
          focusTitle: d.focus.title,
          baseTitle: d.base.title,
          additionalTitles: additionalTitles.length > 0 ? additionalTitles : undefined,
        };
      }));
      setCurrentDay(1);
      return;
    }
    setFocusSin(u.plan.focusSin ?? null);
    setBaseSin(u.plan.baseSin ?? null);
    const dayNum = getDayNumber(u.startDateISO);
    const start = Math.min(Math.max(dayNum - 1, 0), u.plan.days.length - 1);
    const focusSin: SelectedSin = u.plan.focusSin ?? "autre";
    const action1List = ACTION_1[focusSin] ?? ACTION_1.autre;
    const actionsPerDay = u.profileInfo?.actionsPerDay ?? 3;
    const next7 = u.plan.days.slice(start, start + 7).map((d) => {
      // Si pas d'intention ou ancienne intention fixe, utiliser ACTION_1 basé sur le numéro du jour
      let intentionTitle = d.intention?.title;
      if (!intentionTitle || intentionTitle === "Faire mon intention du jour" || intentionTitle.startsWith("Intention :")) {
        const actionIdx = (d.day - 1) % action1List.length;
        intentionTitle = action1List[actionIdx]?.title ?? "Faire mon intention du jour";
      }
      const additionalTitles = d.additionalActions?.map(a => a.title) ?? [];
      return {
        day: d.day,
        intentionTitle,
        focusTitle: d.focus.title,
        baseTitle: d.base.title,
        additionalTitles: additionalTitles.length > 0 ? additionalTitles : undefined,
      };
    });
    setDays(next7);
    setCurrentDay(Math.min(dayNum, 30));
  }, []);

  return (
    <div className="w-full flex flex-col px-6 pt-8 pb-8 text-white">
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-white">
          Parcours quotidien
        </h1>
        <p className="text-white/60 text-sm mt-1">Ton plan personnalisé au jour le jour</p>
      </header>

      {/* Rappel des péchés sur lesquels le client travaille */}
      {selectedSins.length > 0 && (
        <div className="rounded-2xl bg-amber-500/10 border border-amber-400/25 px-5 py-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-amber-200/90 text-sm font-semibold">
              🎯 Tu travailles sur {selectedSins.length > 1 ? "ces péchés" : "ce péché"} :
            </p>
            <button
              type="button"
              onClick={() => router.push("/quiz?from=parcours")}
              className="text-xs text-amber-200/90 hover:text-amber-200 underline font-medium transition-colors"
            >
              Modifier
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedSins.map((sin) => (
              <span
                key={sin}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  sin === focusSin
                    ? "bg-amber-500/30 text-amber-100 border border-amber-400/40"
                    : "bg-white/10 text-white/80 border border-white/20"
                }`}
              >
                {getSinLabel(sin)}
                {sin === focusSin && " (priorité)"}
              </span>
            ))}
          </div>
          {focusSin && (
            <div className="space-y-2 text-sm">
              <p className="text-white/90">
                <span className="text-amber-200 font-medium">Focus principal :</span>{" "}
                {getSinLabel(focusSin)} — les actions du jour ciblent ce péché en priorité.
              </p>
              {baseSin && baseSin !== focusSin && (
                <p className="text-white/70">
                  <span className="text-white/80 font-medium">Base :</span>{" "}
                  {getSinLabel(baseSin)} — action complémentaire chaque jour.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Encadré : défi 30 jours — COMMENCER ou affichage normal */}
      <div className="rounded-2xl bg-emerald-500/10 border border-emerald-400/25 px-5 py-5 mb-6">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-bold">30</span>
            <h2 className="text-emerald-200 font-semibold text-base">Défi 30 jours</h2>
          </div>
          {hasDefiStarted(user) && currentDay >= 1 && (
            <div className="flex items-center gap-2 rounded-xl bg-amber-500/20 border border-amber-400/40 px-3 py-1.5">
              <span className="text-xl" aria-hidden>{LEVEL_EMOJIS[getLevelFromDay(currentDay)] ?? "⭐"}</span>
              <span className="text-amber-200 font-bold text-sm">Niv. {getLevelFromDay(currentDay)}</span>
              <span className="text-amber-200/80 text-xs">{LEVEL_NAMES[getLevelFromDay(currentDay)] ?? ""}</span>
            </div>
          )}
        </div>
        {!hasDefiStarted(user) ? (
          <div className="space-y-4">
            <p className="text-white/95 text-sm">
              Tu as ton plan personnalisé. <strong className="text-white">Choisis le moment où tu es prêt</strong> pour démarrer ton défi de 30 jours.
            </p>
            <p className="text-emerald-200/90 text-sm">
              Quand tu commences, le jour 1 sera compté à partir d&apos;aujourd&apos;hui.
            </p>
            <button
              type="button"
              onClick={() => {
                if (!user) return;
                const today = new Date().toISOString().slice(0, 10);
                const updated = { ...user, startDateISO: today };
                saveUser(updated);
                setUser(updated);
                const dayNum = getDayNumber(today);
                const start = Math.min(Math.max(dayNum - 1, 0), user.plan.days.length - 1);
                const focusSinVal: SelectedSin = user.plan.focusSin ?? "autre";
                const action1List = ACTION_1[focusSinVal] ?? ACTION_1.autre;
                const actionsPerDay = user.profileInfo?.actionsPerDay ?? 3;
                const next7 = user.plan.days.slice(start, start + 7).map((d) => {
                  let intentionTitle = d.intention?.title;
                  if (!intentionTitle || intentionTitle === "Faire mon intention du jour" || intentionTitle.startsWith("Intention :")) {
                    const actionIdx = (d.day - 1) % action1List.length;
                    intentionTitle = action1List[actionIdx]?.title ?? "Faire mon intention du jour";
                  }
                  const additionalTitles = d.additionalActions?.map(a => a.title) ?? [];
                  return {
                    day: d.day,
                    intentionTitle,
                    focusTitle: d.focus.title,
                    baseTitle: d.base.title,
                    additionalTitles: additionalTitles.length > 0 ? additionalTitles : undefined,
                  };
                });
                setDays(next7);
                setCurrentDay(Math.min(dayNum, 30));
              }}
              className="w-full rounded-xl bg-emerald-500 py-4 text-white font-bold text-lg hover:bg-emerald-600 transition-colors"
            >
              Commencer mon défi
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-sm leading-relaxed">
            {(() => {
              const actionsPerDay = user?.profileInfo?.actionsPerDay ?? 3;
              const currentLevel = getLevelFromDay(currentDay);
              const bounds = getLevelBounds(currentLevel);
              return (
                <>
                  <p className="text-white/95">
                    Ton défi dure <strong className="text-white">30 jours</strong>, un pas après l&apos;autre.
                    <strong className="text-white"> Chaque jour = {actionsPerDay} actions</strong> personnalisées selon tes péchés.
                    <button
                      type="button"
                      onClick={() => router.push("/account?tab=plan")}
                      className="ml-1.5 text-emerald-300 hover:text-emerald-200 text-xs underline font-medium"
                    >
                      Modifier (3, 5 ou 10) →
                    </button>
                  </p>
                  <p className="text-amber-200/95 font-medium">
                    📈 <strong>Niveau {currentLevel}</strong> — Jours {bounds.start} à {bounds.end}. Les actions deviennent plus exigeantes à chaque niveau (tous les 5 jours).
                  </p>
                  <p className="text-emerald-200/90 font-medium">
                    Tu valides ta journée en accomplissant les {actionsPerDay}. Si tu rechutes, tu perds la validation du jour.
                  </p>
                </>
              );
            })()}
            <p className="text-white/90">
              Qu&apos;il y ait des réussites ou des rechutes, le parcours continue.
              <span className="block mt-1 text-emerald-200/80 italic">Allah regarde l&apos;effort sincère, pas la perfection.</span>
            </p>
          </div>
        )}
      </div>

      <section className="flex-1 space-y-4">
        <p className="text-white/80 text-sm">
          {hasDefiStarted(user) && currentDay >= 1
            ? `Niveau ${getLevelFromDay(currentDay)} — Jours ${getLevelBounds(getLevelFromDay(currentDay)).start} à ${getLevelBounds(getLevelFromDay(currentDay)).end}`
            : "Les 7 prochains jours"} — {user?.profileInfo?.actionsPerDay ?? 3} actions par jour
        </p>
        {days.length === 0 ? (
          <p className="text-white/60 text-sm">
            Ton parcours du jour sera ici. Complète le questionnaire pour générer ton plan.
          </p>
        ) : (
          <ul className="space-y-3">
            {days.map((d) => {
              const dayLevel = getLevelFromDay(d.day);
              const currentLevel = getLevelFromDay(currentDay);
              const isFutureLevel = dayLevel > currentLevel;
              return (
                <li
                  key={d.day}
                  className={`rounded-xl px-4 py-4 border text-left transition-all ${
                    d.day === currentDay
                      ? "bg-white/10 border-white/30 text-white"
                      : isFutureLevel
                      ? "bg-white/5 border-white/10 text-white/60 select-none overflow-hidden"
                      : "bg-white/5 border-white/10 text-white/90"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/60 text-xs font-medium">Jour {d.day}/30</span>
                    {isFutureLevel && (
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-amber-200/80 text-xs font-medium">
                        🔒 Niveau {dayLevel} — Surprise
                      </span>
                    )}
                    {d.day === currentDay && !isFutureLevel && (
                      <span className="rounded-full bg-emerald-500/25 px-2 py-0.5 text-emerald-200 text-xs font-medium">
                        Aujourd&apos;hui
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {(() => {
                      if (isFutureLevel) {
                        return (
                          <div>
                            <div className="blur-[4px] select-none space-y-1">
                              <p className="text-white/40 text-sm">???</p>
                              <p className="text-white/40 text-sm">???</p>
                              <p className="text-white/40 text-sm">???</p>
                            </div>
                            <p className="text-amber-200/80 text-xs mt-2 font-medium">🔒 Débloque en validant le niveau {currentLevel}</p>
                          </div>
                        );
                      }
                      const actionsPerDay = user?.profileInfo?.actionsPerDay ?? 3;
                      const allActions = [
                        { title: d.intentionTitle, num: 1, color: "bg-white/10 text-white/70" },
                        { title: d.focusTitle, num: 2, color: "bg-amber-500/25 text-amber-200", sin: focusSin },
                        { title: d.baseTitle, num: 3, color: "bg-emerald-500/20 text-emerald-200", sin: baseSin },
                        ...(d.additionalTitles?.map((title, idx) => ({
                          title,
                          num: 4 + idx,
                          color: "bg-white/10 text-white/70",
                        })) ?? []),
                      ].slice(0, actionsPerDay);
                      
                      return allActions.map((action) => (
                        <div key={action.num} className="flex items-start gap-2">
                          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${action.color} text-xs font-bold`}>
                            {action.num}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-white/95">{action.title}</p>
                            {action.sin && (
                              <p className={`text-xs mt-0.5 ${action.num === 2 ? "text-amber-200/70" : "text-emerald-200/70"}`}>
                                → {getSinLabel(action.sin)}
                              </p>
                            )}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </li>
              );
            })}
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
