/**
 * Scores pour le graphique radar StopHaram (6 dimensions, 0–100).
 * Utilise les données existantes : streak, versets, tentations, défi, actions, dons.
 */

import { getUser } from "@/lib/storage";
import { getDayNumber } from "@/lib/storage";
import { getTemptationStats } from "@/lib/temptationStats";
import { getProgressStats } from "@/lib/progressStats";
import { getDons } from "@/lib/sadaqaStorage";
import { getDefiDaysStatus } from "@/lib/defiDaysStatus";
import { getActionHistoryLastDays } from "@/lib/dailyActions";

const DEFI_JOURS = 30;

export type RadarDimension =
  | "spiritualite"
  | "discipline"
  | "actions"
  | "resistance"
  | "generosite"
  | "defi";

export type RadarScores = Record<RadarDimension, number>;

export const RADAR_LABELS: Record<RadarDimension, string> = {
  spiritualite: "Spiritualité",
  discipline: "Discipline",
  actions: "Actions",
  resistance: "Résistance",
  generosite: "Générosité",
  defi: "Défi 30j",
};

/** Ordre des axes sur le radar (haut puis sens horaire). */
export const RADAR_ORDER: RadarDimension[] = [
  "spiritualite",
  "discipline",
  "actions",
  "resistance",
  "generosite",
  "defi",
];

function clamp(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

/**
 * Calcule les 6 scores (0–100) pour le radar StopHaram.
 */
export function getRadarScores(): RadarScores {
  const u = getUser();
  const stats = getTemptationStats();
  const progressStats = getProgressStats();
  const dons = getDons();
  const defiStatus = getDefiDaysStatus();

  const streakDays = u?.streakDays ?? 0;
  const startDateISO = u?.startDateISO;
  const challengeDay = startDateISO
    ? Math.min(DEFI_JOURS, Math.max(1, getDayNumber(startDateISO)))
    : 0;
  const validatedCount = Object.values(defiStatus).filter((s) => s === "validated").length;

  const versets = progressStats?.versetsTotal ?? 0;
  const invocations = progressStats?.invocationsTotal ?? 0;
  const spiritualiteRaw = Math.min(50, versets / 2) + Math.min(50, invocations / 2);
  const spiritualite = clamp(spiritualiteRaw);

  const discipline = clamp((streakDays / 30) * 100);

  const history7 = getActionHistoryLastDays(7);
  const totalActions7 = history7.reduce((s, d) => s + d.count, 0);
  const maxPossible7 = 7 * 5;
  const actions = clamp((totalActions7 / maxPossible7) * 100);

  const resistance =
    stats.tempted > 0
      ? clamp((stats.resisted / stats.tempted) * 100)
      : 50;

  const generosite = clamp(dons.length * 15);

  const defi = clamp((validatedCount / DEFI_JOURS) * 100);

  return {
    spiritualite,
    discipline,
    actions,
    resistance,
    generosite,
    defi,
  };
}

/** Pourcentage global (moyenne des 6 dimensions). */
export function getRadarOverallPercent(scores: RadarScores): number {
  const sum = RADAR_ORDER.reduce((s, dim) => s + scores[dim], 0);
  return Math.round(sum / 6);
}
