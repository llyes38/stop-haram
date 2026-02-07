/**
 * Progression du défi 30 jours — pour la Communauté (classement, score).
 */

import { getUser, getDayNumber } from "@/lib/storage";
import { getDefiDaysStatus } from "@/lib/defiDaysStatus";

export type ChallengeProgress = {
  streakDays: number;
  completedDays: number;
  lastDayCompletedAt: string | null;
  hadRelapse: boolean;
  startDateISO: string | null;
  challengeDay: number;
  isCompleted: boolean;
};

/**
 * Retourne la progression du défi 30 jours (localStorage / user).
 */
export function getChallengeProgress(): ChallengeProgress {
  if (typeof window === "undefined") {
    return {
      streakDays: 0,
      completedDays: 0,
      lastDayCompletedAt: null,
      hadRelapse: false,
      startDateISO: null,
      challengeDay: 0,
      isCompleted: false,
    };
  }

  const user = getUser();
  const startDateISO = user?.startDateISO?.trim() || null;
  const challengeDay = startDateISO ? Math.min(Math.max(1, getDayNumber(startDateISO)), 30) : 0;

  const defiStatus = getDefiDaysStatus();
  const validatedDays = Object.entries(defiStatus)
    .filter(([, v]) => v === "validated")
    .map(([k]) => parseInt(k, 10))
    .filter((n) => Number.isFinite(n) && n >= 1 && n <= 30);
  const completedDays = validatedDays.length;
  const lastValidated = validatedDays.length > 0 ? Math.max(...validatedDays) : 0;
  const lastDayCompletedAt =
    lastValidated > 0 && startDateISO
      ? (() => {
          const d = new Date(startDateISO);
          d.setDate(d.getDate() + lastValidated - 1);
          return d.toISOString();
        })()
      : null;

  const streakDays = user?.streakDays ?? 0;

  const hadRelapse = false;

  const isCompleted = completedDays >= 30;

  return {
    streakDays,
    completedDays,
    lastDayCompletedAt,
    hadRelapse,
    startDateISO,
    challengeDay,
    isCompleted,
  };
}

/**
 * Score pour le classement Communauté (MVP simple).
 * - 1 jour complété = 10 points
 * - +50 si 7 jours d'affilée (streak >= 7)
 * - +150 si 30 jours terminés
 * - -20 si rechute (non utilisé pour l'instant)
 */
export function computeCommunityScore(progress: ChallengeProgress): number {
  let score = progress.completedDays * 10;
  if (progress.streakDays >= 7) score += 50;
  if (progress.completedDays >= 30) score += 150;
  if (progress.hadRelapse) score = Math.max(0, score - 20);
  return score;
}
