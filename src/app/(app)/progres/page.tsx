"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, getDailyActionsWithSins } from "@/lib/storage";
import { getCompletedActionTitlesForToday } from "@/lib/dailyActions";
import { getDons } from "@/lib/sadaqaStorage";
import { todayKey } from "@/lib/date";

function formatDateIso(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  const today = todayKey();
  if (iso === today) return "Aujourd'hui";
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (iso === yesterday.toISOString().slice(0, 10)) return "Hier";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

const STORAGE_KEYS = { days_clean: "days_clean" } as const;

function getDaysClean(): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEYS.days_clean);
  if (raw === null || raw === "") return null;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}

function isDhikrOrInvocation(title: string): boolean {
  return /dhikr|invocation|rappel/i.test(title);
}

function isInvocationsMatin(title: string): boolean {
  return title === "Invocations du matin";
}

export default function ProgresPage() {
  const router = useRouter();
  const [daysClean, setDaysClean] = useState<number | null>(null);
  const [actionItems, setActionItems] = useState<Array<{ title: string; desc?: string }>>([]);
  const [completedTitles, setCompletedTitles] = useState<string[]>([]);
  const [dhikrMatinDoneToday, setDhikrMatinDoneToday] = useState(false);
  const [donsToday, setDonsToday] = useState(0);
  const [recentDons, setRecentDons] = useState<Array<{ label: string; amount: number; date: string }>>([]);

  useEffect(() => {
    setDaysClean(getDaysClean());
    const u = getUser();
    const items = getDailyActionsWithSins(u ?? null);
    setActionItems(items);
    setCompletedTitles(getCompletedActionTitlesForToday());
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem("dhikr_matin_done");
      setDhikrMatinDoneToday(raw === todayKey());
    }
    const dons = getDons();
    const today = todayKey();
    setDonsToday(dons.filter((d) => d.dateIso === today).length);
    setRecentDons(
      dons
        .slice()
        .reverse()
        .map((d) => ({ label: d.causeLabel, amount: d.amountEur, date: d.dateIso }))
    );
  }, []);

  const isActionDone = (title: string): boolean => {
    if (isInvocationsMatin(title)) return dhikrMatinDoneToday;
    if (isDhikrOrInvocation(title)) return dhikrMatinDoneToday || completedTitles.includes(title);
    return completedTitles.includes(title);
  };

  const statusText = daysClean !== null ? `Jour ${daysClean} sans rechute` : "Chaque effort compte";

  return (
    <div className="w-full flex flex-col px-6 pt-8 pb-8 text-white max-w-[420px] mx-auto">
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-white">
          Progrès
        </h1>
        <p className="text-white/60 text-sm mt-1">
          Ta continuité et tes efforts sont enregistrés ici.
        </p>
      </header>

      <section className="flex-1 space-y-4">
        {/* Carte : Jours sans rechute */}
        <div className="rounded-xl bg-emerald-500/15 border border-emerald-400/30 px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/30 text-emerald-200 text-lg font-bold">
              {daysClean != null ? daysClean : "—"}
            </span>
            <div>
              <p className="font-semibold text-white">{statusText}</p>
              <p className="text-white/60 text-xs">Jours consécutifs sans rechute</p>
            </div>
          </div>
        </div>

        {/* Cartes : Actions du jour (réalisées ou à faire) */}
        {actionItems.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-white/90 text-sm font-semibold">Actions du jour</h2>
            <div className="space-y-2">
              {actionItems.map((item, i) => {
                const done = isActionDone(item.title);
                const isBase = isInvocationsMatin(item.title);
                return (
                  <div
                    key={i}
                    className={`rounded-xl border px-4 py-3 flex items-center gap-3 ${
                      done
                        ? "bg-emerald-500/10 border-emerald-400/30"
                        : isBase
                          ? "bg-amber-500/10 border-amber-400/25"
                          : "bg-white/5 border-white/10"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        done ? "bg-emerald-500/30 text-emerald-200" : isBase ? "bg-amber-500/20 text-amber-200" : "bg-white/10 text-white/70"
                      }`}
                    >
                      {done ? "✓" : isBase ? "★" : i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${done ? "text-white/80 line-through" : "text-white"}`}>
                        {item.title}
                      </p>
                    </div>
                    {done && (
                      <span className="text-emerald-200 text-xs font-medium shrink-0">Fait</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Partie : Dons que l'utilisateur a enregistrés */}
        <div className="space-y-2">
          <h2 className="text-white/90 text-sm font-semibold">Dons que tu as enregistrés</h2>
          <div className="rounded-xl bg-amber-500/10 border border-amber-400/25 px-4 py-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-lg">
                🤲
              </span>
              <div>
                <p className="font-semibold text-white">
                  {recentDons.length > 0
                    ? `${recentDons.length} don${recentDons.length > 1 ? "s" : ""} enregistré${recentDons.length > 1 ? "s" : ""}`
                    : "Aucun don enregistré"}
                </p>
                <p className="text-white/60 text-xs">
                  {donsToday > 0
                    ? `${donsToday} don${donsToday > 1 ? "s" : ""} aujourd'hui`
                    : "Tes dons apparaîtront ici quand tu en enregistreras un."}
                </p>
              </div>
            </div>
            {recentDons.length > 0 && (
              <ul className="space-y-2.5 border-t border-amber-400/20 pt-3 max-h-64 overflow-y-auto">
                {recentDons.map((d, i) => (
                  <li key={i} className="flex justify-between items-start gap-2 text-sm">
                    <div className="min-w-0 flex-1">
                      <span className="text-white/90 block truncate">{d.label}</span>
                      <span className="text-white/50 text-xs">{formatDateIso(d.date)}</span>
                    </div>
                    <span className="text-amber-200 font-semibold shrink-0">{d.amount} €</span>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={() => router.push("/sadaqa")}
              className="mt-3 w-full rounded-lg bg-amber-500/20 border border-amber-400/30 py-2 text-amber-200 text-sm font-medium hover:bg-amber-500/25 transition-colors"
            >
              Faire un don
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
