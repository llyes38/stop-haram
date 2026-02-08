"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getUser, saveUser, getDayNumber, getSinLabel, hasDefiStarted, getDailyActionsWithSins } from "@/lib/storage";
import { generatePlan, ACTION_1 } from "@/lib/programEngine";
import { getLevelFromDay, LEVEL_NAMES, LEVEL_EMOJIS, getLevelBounds } from "@/lib/defiLevels";
import { clearDefiDaysStatus } from "@/lib/defiDaysStatus";
import { getTemptationStats } from "@/lib/temptationStats";
import { getCurrentStatut } from "@/lib/statuts";
import { getProgressStats, getInvocationsBreakdownToday, type ProgressStats } from "@/lib/progressStats";
import {
  getTotalPoints,
  canOfferFreeMonth,
  usePointsForFreeMonth,
  POINTS_FOR_FREE_MONTH,
} from "@/lib/pointsGratitude";
import { copyToClipboard } from "@/lib/share";
import { getDons } from "@/lib/sadaqaStorage";
import { getCompletedActionTitlesForToday, getActionHistoryLastDays } from "@/lib/dailyActions";
import { getFoisTarget, getDhikrFoisCount } from "@/lib/dhikrFoisCount";
import { todayKey } from "@/lib/date";
import { getRadarScores, getRadarOverallPercent, RADAR_ORDER, RADAR_LABELS } from "@/lib/radarScores";
import type { SelectedSin } from "@/lib/storage";

function formatDateIso(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  const today = todayKey();
  if (iso === today) return "Aujourd'hui";
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (iso === yesterday.toISOString().slice(0, 10)) return "Hier";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

const DEFI_JOURS = 30;
type Tab = "parcours" | "progres";

export default function ParcoursPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [days, setDays] = useState<Array<{
    day: number;
    intentionTitle: string;
    focusTitle: string;
    baseTitle: string;
    additionalItems?: Array<{ title: string; sin?: SelectedSin }>;
  }>>([]);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [selectedSins, setSelectedSins] = useState<SelectedSin[]>([]);
  const [focusSin, setFocusSin] = useState<SelectedSin | null>(null);
  const [baseSin, setBaseSin] = useState<SelectedSin | null>(null);
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [tab, setTab] = useState<Tab>("parcours");
  const [stats, setStats] = useState<{ tempted: number; resisted: number }>({ tempted: 0, resisted: 0 });
  const [progressStats, setProgressStats] = useState<ProgressStats | null>(null);
  const [invocationsBreakdown, setInvocationsBreakdown] = useState<{ total: number; items: Array<{ label: string; count: number }> }>({ total: 0, items: [] });
  const [points, setPoints] = useState(0);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerUrl, setOfferUrl] = useState<string | null>(null);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "progres") setTab("progres");
  }, [searchParams]);

  useEffect(() => {
    setStats(getTemptationStats());
    setProgressStats(getProgressStats());
    setPoints(getTotalPoints());
    if (tab === "progres") {
      const u = getUser();
      const actionItems = getDailyActionsWithSins(u ?? null);
      const completedTitles = getCompletedActionTitlesForToday();
      const dhikrMatinDone =
        typeof window !== "undefined" && window.localStorage.getItem("dhikr_matin_done") === todayKey();
      const dhikrSoirDone =
        typeof window !== "undefined" && window.localStorage.getItem("dhikr_soir_done") === todayKey();
      setInvocationsBreakdown(
        getInvocationsBreakdownToday({
          dhikrMatinDone,
          dhikrSoirDone,
          actionItems,
          completedTitles,
          getFoisTarget,
          getDhikrFoisCount,
        })
      );
    }
  }, [tab]);

  const handleOfferFreeMonth = () => {
    const url = usePointsForFreeMonth();
    if (url) {
      setOfferUrl(url);
      setShowOfferModal(true);
      setPoints(getTotalPoints());
    }
  };

  const handleCopyOfferLink = async () => {
    if (offerUrl && (await copyToClipboard(offerUrl))) {
      setToast(true);
      setTimeout(() => setToast(false), 2000);
    }
  };

  const closeOfferModal = () => {
    setShowOfferModal(false);
    setOfferUrl(null);
    setPoints(getTotalPoints());
  };

  const streakDays = user?.streakDays ?? null;

  const chartDataProgres = useMemo(() => {
    const raw = getActionHistoryLastDays(14);
    let sum = 0;
    return raw.map((d) => {
      sum += d.count;
      return { ...d, cumulative: sum };
    });
  }, [streakDays]);
  const focusSinLabel = user?.plan?.focusSin ? getSinLabel(user.plan.focusSin, user) : null;
  const challengeDay = user?.startDateISO
    ? Math.min(Math.max(getDayNumber(user.startDateISO), 1), DEFI_JOURS)
    : 0;
  const currentStatut = getCurrentStatut(streakDays);
  const ratio = stats.tempted > 0 ? Math.round((100 * stats.resisted) / stats.tempted) : null;

  useEffect(() => {
    let u = getUser();
    if (u?.plan && u?.selectedSins?.length) {
      u = { ...u, plan: generatePlan(u) };
      saveUser(u);
    }
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
        const additionalItems = d.additionalActions?.map(a => ({ title: a.title, sin: a.sin })) ?? [];
        return {
          day: d.day,
          intentionTitle,
          focusTitle: d.focus.title,
          baseTitle: d.base.title,
          additionalItems: additionalItems.length > 0 ? additionalItems : undefined,
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
      const additionalItems = d.additionalActions?.map(a => ({ title: a.title, sin: a.sin })) ?? [];
      return {
        day: d.day,
        intentionTitle,
        focusTitle: d.focus.title,
        baseTitle: d.base.title,
        additionalItems: additionalItems.length > 0 ? additionalItems : undefined,
      };
    });
    setDays(next7);
    setCurrentDay(Math.min(dayNum, 30));
  }, []);

  return (
    <div className="w-full flex flex-col px-6 pt-8 pb-8 text-white">
      {/* Onglets Parcours / Progrès */}
      <div className="flex rounded-xl bg-white/5 border border-white/10 p-1 mb-6">
        <button
          type="button"
          onClick={() => setTab("parcours")}
          className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
            tab === "parcours" ? "bg-white/15 text-white" : "text-white/60 hover:text-white/80"
          }`}
        >
          Parcours
        </button>
        <button
          type="button"
          onClick={() => setTab("progres")}
          className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
            tab === "progres" ? "bg-white/15 text-white" : "text-white/60 hover:text-white/80"
          }`}
        >
          Progrès
        </button>
      </div>

      {tab === "progres" ? (
        /* === CONTENU PROGRÈS === */
        <section className="flex-1 space-y-6">
          <header className="mb-4">
            <h1 className="text-lg font-bold text-white">Progrès</h1>
            <p className="text-white/60 text-sm mt-0.5">Où tu en es, en temps réel</p>
          </header>
          <div className="rounded-2xl bg-emerald-500/15 border border-emerald-400/30 px-5 py-4">
            <p className="text-emerald-200 font-semibold text-sm mb-1">Série sans rechute</p>
            <p className="text-2xl font-bold text-white tabular-nums">
              {streakDays != null && Number.isFinite(streakDays)
                ? `${streakDays} jour${streakDays !== 1 ? "s" : ""}`
                : "—"}
            </p>
          </div>
          {/* Radar StopHaram — 6 dimensions */}
          {(() => {
            const scores = getRadarScores();
            const overall = getRadarOverallPercent(scores);
            const cx = 100;
            const cy = 100;
            const R = 78;
            const angles = RADAR_ORDER.map((_, i) => (-90 + i * 60) * (Math.PI / 180));
            const axisPoints = angles.map((a) => ({
              x: cx + R * Math.cos(a),
              y: cy + R * Math.sin(a),
            }));
            const polygonPoints = RADAR_ORDER.map((dim, i) => {
              const r = (scores[dim] / 100) * R;
              const a = angles[i];
              return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
            });
            const polygonPath = polygonPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
            const labelOffset = R + 16;
            return (
              <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
                <p className="text-white font-semibold text-base mb-3 text-center">Ton profil StopHaram</p>
                <div className="relative w-full flex justify-center" style={{ height: 220 }}>
                  <svg viewBox="0 0 200 200" className="w-52 h-52 mx-auto" aria-hidden>
                    <defs>
                      <linearGradient id="radar-fill-stop" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgb(52, 211, 153)" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0.25" />
                      </linearGradient>
                    </defs>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <circle
                        key={level}
                        cx={cx}
                        cy={cy}
                        r={(level / 5) * R}
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="0.5"
                      />
                    ))}
                    {angles.map((a, i) => (
                      <line
                        key={i}
                        x1={cx}
                        y1={cy}
                        x2={axisPoints[i].x}
                        y2={axisPoints[i].y}
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="0.8"
                      />
                    ))}
                    <path d={polygonPath} fill="url(#radar-fill-stop)" stroke="rgb(52, 211, 153)" strokeWidth="1.5" strokeLinejoin="round" />
                    {RADAR_ORDER.map((dim, i) => {
                      const a = angles[i];
                      const lx = cx + labelOffset * Math.cos(a);
                      const ly = cy + labelOffset * Math.sin(a);
                      return (
                        <text
                          key={dim}
                          x={lx}
                          y={ly}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="rgba(255,255,255,0.85)"
                          style={{ fontSize: 10, fontWeight: 500 }}
                        >
                          {RADAR_LABELS[dim]}
                        </text>
                      );
                    })}
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      style={{ fontSize: 20, fontWeight: 700 }}
                    >
                      {overall}%
                    </text>
                  </svg>
                </div>
                <p className="text-white/50 text-xs text-center mt-1">Moyenne des 6 dimensions</p>
              </div>
            );
          })()}
          {/* Progression globale — graphique type QUITTTR */}
          <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className="text-white font-semibold text-base">Progression globale</p>
              {chartDataProgres.length > 0 && chartDataProgres[0].dateKey && (
                <span className="text-white/50 text-xs">
                  Depuis le {formatDateIso(chartDataProgres[0].dateKey)}
                </span>
              )}
            </div>
            <div className="relative w-full" style={{ height: 160 }}>
              <svg
                viewBox="0 0 280 120"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full"
                aria-hidden
              >
                <defs>
                  <linearGradient id="parcours-progres-area-fill" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="rgb(52, 211, 153)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="rgb(52, 211, 153)" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                {chartDataProgres.length >= 2 && (() => {
                  const w = 280;
                  const h = 120;
                  const maxVal = Math.max(1, ...chartDataProgres.map((d) => d.cumulative));
                  const pts = chartDataProgres.map((d, i) => {
                    const x = (i / Math.max(1, chartDataProgres.length - 1)) * w;
                    const y = h - (d.cumulative / maxVal) * (h - 12);
                    return { x, y };
                  });
                  const areaPath = `M ${pts[0].x} ${h} L ${pts.map((p) => `${p.x} ${p.y}`).join(" L ")} L ${pts[pts.length - 1].x} ${h} Z`;
                  const linePath = `M ${pts.map((p) => `${p.x} ${p.y}`).join(" L ")}`;
                  return (
                    <>
                      <path d={areaPath} fill="url(#parcours-progres-area-fill)" />
                      <path d={linePath} fill="none" stroke="rgb(52, 211, 153)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </>
                  );
                })()}
              </svg>
            </div>
            {chartDataProgres.length > 0 && (
              <p className="text-white/50 text-xs mt-1 text-right">
                {chartDataProgres[chartDataProgres.length - 1].cumulative} action{chartDataProgres[chartDataProgres.length - 1].cumulative > 1 ? "s" : ""} réalisée{chartDataProgres[chartDataProgres.length - 1].cumulative > 1 ? "s" : ""} sur 14 jours
              </p>
            )}
          </div>
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
          <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4">
            <p className="text-white/70 font-medium text-sm mb-2">Défi 30 jours</p>
            <div className="flex justify-between mb-2">
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
          {focusSinLabel && (
            <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4">
              <p className="text-white/70 font-medium text-sm mb-1">Focus actuel</p>
              <p className="text-white font-medium">{focusSinLabel}</p>
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
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-400/25 px-5 py-4">
            <p className="text-emerald-200 font-semibold text-sm mb-1">Versets & invocations</p>
            <p className="text-white/60 text-xs mb-4">Coran, rappels, dhikr du jour — tout ce que tu as récité</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                <p className="text-2xl font-bold text-emerald-200 tabular-nums">{progressStats?.versetsToday ?? 0}</p>
                <p className="text-emerald-200/80 text-xs">versets</p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                <p className="text-2xl font-bold text-emerald-200 tabular-nums">{invocationsBreakdown.total}</p>
                <p className="text-emerald-200/80 text-xs">invocations</p>
              </div>
            </div>
            {invocationsBreakdown.items.length > 0 && (
              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                <p className="text-emerald-200/90 text-xs font-medium mb-2">Détail (33, 34, 100…)</p>
                <ul className="space-y-1.5 max-h-32 overflow-y-auto">
                  {invocationsBreakdown.items.map((item, i) => (
                    <li key={i} className="flex justify-between items-center gap-2 text-xs">
                      <span className="text-white/80 truncate">{item.label}</span>
                      <span className="text-emerald-200 font-semibold tabular-nums shrink-0">{item.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="rounded-2xl bg-amber-500/15 border border-amber-400/30 px-5 py-4">
            <p className="text-amber-200 font-semibold text-sm mb-1">Points de gratitude</p>
            <p className="text-white/80 text-sm mb-3">
              Quiz + défis validés. À partir de {POINTS_FOR_FREE_MONTH} pts : offrir 1 mois gratuit.
            </p>
            <div className="flex items-center justify-between gap-4">
              <span className="text-2xl font-bold text-amber-200 tabular-nums">{points} pts</span>
              {canOfferFreeMonth() ? (
                <button type="button" onClick={handleOfferFreeMonth} className="rounded-xl bg-amber-500/40 border border-amber-400/60 py-2.5 px-4 text-amber-100 font-semibold text-sm hover:bg-amber-500/50 transition-colors">
                  Offrir 1 mois gratuit
                </button>
              ) : (
                <p className="text-amber-200/70 text-xs">Encore {POINTS_FOR_FREE_MONTH - points} pts</p>
              )}
            </div>
          </div>
          {/* Dons enregistrés */}
          {(() => {
            const dons = getDons().slice().reverse();
            const today = todayKey();
            const donsToday = dons.filter((d) => d.dateIso === today).length;
            return (
              <div className="rounded-2xl bg-amber-500/10 border border-amber-400/25 px-5 py-4">
                <p className="text-amber-200 font-semibold text-sm mb-1">Dons enregistrés</p>
                <p className="text-white/60 text-xs mb-3">
                  {dons.length > 0
                    ? donsToday > 0
                      ? `${donsToday} don${donsToday > 1 ? "s" : ""} aujourd'hui · ${dons.length} au total`
                      : `${dons.length} don${dons.length > 1 ? "s" : ""} enregistré${dons.length > 1 ? "s" : ""}`
                    : "Tes dons apparaîtront ici quand tu en enregistreras un."}
                </p>
                {dons.length > 0 && (
                  <ul className="space-y-2 border-t border-amber-400/20 pt-3 max-h-48 overflow-y-auto">
                    {dons.slice(0, 8).map((d, i) => (
                      <li key={i} className="flex justify-between items-start gap-2 text-sm">
                        <div className="min-w-0 flex-1">
                          <span className="text-white/90 block truncate">{d.causeLabel}</span>
                          <span className="text-white/50 text-xs">{formatDateIso(d.dateIso)}</span>
                        </div>
                        <span className="text-amber-200 font-semibold shrink-0">{d.amountEur} €</span>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  type="button"
                  onClick={() => router.push("/sadaqa")}
                  className="mt-3 w-full rounded-xl bg-amber-500/20 border border-amber-400/30 py-2.5 text-amber-200 text-sm font-medium hover:bg-amber-500/25 transition-colors"
                >
                  Faire un don
                </button>
              </div>
            );
          })()}
          <div className="rounded-2xl bg-violet-500/10 border border-violet-400/25 px-5 py-5">
            <p className="text-violet-200/95 text-sm font-medium text-center mb-1">Au fil de ta progression</p>
            <p className="text-white/90 text-sm text-center mb-3">Offre StopHaram à un proche — augmente ton bien et celui des autres.</p>
            <button type="button" onClick={() => router.push("/checkout?mode=offrir")} className="w-full rounded-xl bg-violet-500/30 border border-violet-400/50 py-3.5 text-violet-200 font-semibold text-sm hover:bg-violet-500/40 transition-colors">
              Offrir à un proche
            </button>
            <a href="/recuperer-lien-cadeau" className="block mt-2 text-center text-violet-300/80 text-xs hover:text-violet-200 underline">
              Tu viens de payer ? Récupère le lien à partager
            </a>
          </div>
        </section>
      ) : (
        /* === CONTENU PARCOURS === */
        <>
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-white">Parcours quotidien</h1>
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
                {getSinLabel(sin, user)}
                {sin === focusSin && " (priorité)"}
              </span>
            ))}
          </div>
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
                const nowIso = new Date().toISOString();
                const updated = {
                  ...user,
                  startDateISO: today,
                  streakDays: 0,
                  lastCheckinISO: today,
                };
                saveUser(updated);
                setUser(updated);
                if (typeof window !== "undefined") {
                  window.localStorage.setItem("last_streak_start_iso", nowIso);
                  window.localStorage.setItem("days_clean", "0");
                  clearDefiDaysStatus();
                }
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
                  const additionalItems = d.additionalActions?.map(a => ({ title: a.title, sin: a.sin })) ?? [];
                  return {
                    day: d.day,
                    intentionTitle,
                    focusTitle: d.focus.title,
                    baseTitle: d.base.title,
                    additionalItems: additionalItems.length > 0 ? additionalItems : undefined,
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
                        { title: d.intentionTitle, num: 1, color: "bg-white/10 text-white/70", sin: focusSin },
                        { title: d.focusTitle, num: 2, color: "bg-amber-500/25 text-amber-200", sin: focusSin },
                        { title: d.baseTitle, num: 3, color: "bg-emerald-500/20 text-emerald-200", sin: baseSin },
                        ...(d.additionalItems?.map((item, idx) => ({
                          title: item.title,
                          num: 4 + idx,
                          color: item.sin === focusSin ? "bg-amber-500/20 text-amber-200" : "bg-emerald-500/20 text-emerald-200",
                          sin: item.sin,
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
                                → {getSinLabel(action.sin, user)}
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
        </>
      )}

      {/* Modal : lien 1 mois gratuit */}
      {showOfferModal && offerUrl && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-8">
          <div className="w-full max-w-[420px] rounded-2xl bg-[#0a1f12] border border-amber-400/40 px-5 py-5 shadow-xl">
            <h3 className="text-amber-200 font-semibold text-lg mb-2">Cadeau généré !</h3>
            <p className="text-white/80 text-sm mb-4">Partage ce lien à un proche pour 1 mois gratuit.</p>
            <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 mb-4 break-all text-white/90 text-xs">{offerUrl}</div>
            <div className="flex gap-2">
              <button type="button" onClick={handleCopyOfferLink} className="flex-1 rounded-xl bg-amber-500/40 border border-amber-400/60 py-3 text-amber-100 font-semibold text-sm hover:bg-amber-500/50 transition-colors">Copier</button>
              <button type="button" onClick={closeOfferModal} className="rounded-xl bg-white/10 py-3 px-4 text-white/90 text-sm font-medium hover:bg-white/20 transition-colors">Fermer</button>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 rounded-full bg-emerald-500/90 text-white text-sm font-medium px-4 py-2 shadow-lg">Copié ✅</div>
      )}
    </div>
  );
}
