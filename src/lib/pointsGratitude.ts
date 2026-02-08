/**
 * Points de gratitude unifiés : quiz ludique + défis validés.
 * Permettent d'offrir 1 mois gratuit à un proche à partir d'un seuil.
 */

import { getQuizGratitudeTotal, addQuizGratitude } from "./quizLudique";

const KEYS = {
  defiAwarded: "stopharam_points_defi_awarded",
  introQuizAwarded: "stopharam_points_intro_quiz_awarded",
  pointsSpent: "stopharam_points_spent",
  actionAwardedPrefix: "stopharam_points_action_",
} as const;

function getTodayDateKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Points requis pour débloquer "offrir 1 mois gratuit" */
export const POINTS_FOR_FREE_MONTH = 100;

/** Points donnés par jour de défi validé (désactivé : on ne donne que +1 pt par action) */
export const POINTS_PER_DEFI_DAY = 0;

/** Points donnés à la fin du quiz d'intro (analyse) */
export const POINTS_INTRO_QUIZ = 20;

function getPointsSpent(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(KEYS.pointsSpent);
  const n = raw != null ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

function addPointsSpent(amount: number): void {
  if (typeof window === "undefined") return;
  const current = getPointsSpent();
  window.localStorage.setItem(KEYS.pointsSpent, String(current + amount));
}

function getDefiAwardedDays(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEYS.defiAwarded);
    if (!raw) return [];
    const arr = JSON.parse(raw) as number[];
    return Array.isArray(arr) ? arr.filter((n) => Number.isFinite(n) && n >= 1 && n <= 30) : [];
  } catch {
    return [];
  }
}

function setDefiAwardedDays(days: number[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS.defiAwarded, JSON.stringify([...new Set(days)].sort((a, b) => a - b)));
}

/** Total brut (avant déduction des offres utilisées) */
function getRawTotal(): number {
  const quiz = getQuizGratitudeTotal();
  const defiDays = getDefiAwardedDays();
  const defiPoints = defiDays.length * POINTS_PER_DEFI_DAY;
  return quiz + defiPoints;
}

/** Total des points de gratitude (quiz + défis - dépensés) */
export function getTotalPoints(): number {
  return Math.max(0, getRawTotal() - getPointsSpent());
}

/** +1 pt par action réalisée (une seule fois par action par jour). Retourne true si un point a été ajouté. */
export function addActionPoint(title: string): boolean {
  if (typeof window === "undefined") return false;
  const key = KEYS.actionAwardedPrefix + getTodayDateKey();
  try {
    const raw = window.localStorage.getItem(key);
    const awarded: string[] = raw ? (JSON.parse(raw) as string[]) : [];
    if (awarded.includes(title)) return false;
    awarded.push(title);
    window.localStorage.setItem(key, JSON.stringify(awarded));
  } catch {
    return false;
  }
  addQuizGratitude(1);
  window.dispatchEvent(new CustomEvent("stopharam-points-updated"));
  return true;
}

/** Déclencher l'animation +1 pt vers la cagnotte (depuis la position fromX, fromY). */
export function flyPointToBadge(fromX: number, fromY: number): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("stopharam-fly-point", { detail: { fromX, fromY } })
  );
}

/** Ajouter des points pour un jour de défi validé (une seule fois par jour) */
export function addDefiDayPoints(day: number): number {
  if (typeof window === "undefined" || day < 1 || day > 30) return getTotalPoints();
  const awarded = getDefiAwardedDays();
  if (awarded.includes(day)) return getTotalPoints();
  setDefiAwardedDays([...awarded, day]);
  window.dispatchEvent(new CustomEvent("stopharam-points-updated"));
  return getTotalPoints();
}

/** Vérifier si on a déjà donné les points du quiz d'intro */
export function hasIntroQuizPointsAwarded(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEYS.introQuizAwarded) === "1";
}

/** Donner les points du quiz d'intro (une seule fois) */
export function awardIntroQuizPoints(): number {
  if (typeof window === "undefined") return getTotalPoints();
  if (hasIntroQuizPointsAwarded()) return getTotalPoints();
  window.localStorage.setItem(KEYS.introQuizAwarded, "1");
  addQuizGratitude(POINTS_INTRO_QUIZ);
  return getTotalPoints();
}

/** Peut-il offrir 1 mois gratuit ? */
export function canOfferFreeMonth(): boolean {
  return getTotalPoints() >= POINTS_FOR_FREE_MONTH;
}

const FREE_MONTH_UNTIL_KEY = "stopharam_free_month_until";

/** Pour le bénéficiaire : a-t-il un mois gratuit actif ? */
export function hasActiveFreeMonth(): boolean {
  if (typeof window === "undefined") return false;
  const raw = window.localStorage.getItem(FREE_MONTH_UNTIL_KEY);
  if (!raw) return false;
  const until = new Date(raw).getTime();
  return Number.isFinite(until) && until > Date.now();
}

/** Pour le bénéficiaire : activer 1 mois gratuit (appelé depuis le lien ?offer=CODE, points gratitude) */
export function activateFreeMonthFromLink(): void {
  if (typeof window === "undefined") return;
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  window.localStorage.setItem(FREE_MONTH_UNTIL_KEY, d.toISOString());
  window.localStorage.setItem("stopharam_forfait", "gratuit_1mois");
}

const GIFT_ANNUAL_UNTIL_KEY = "stopharam_gift_annual_until";

/**
 * Pour le bénéficiaire : activer un cadeau Stripe (1 mois gratuit ou annuel) sur CE téléphone.
 * À appeler après validation + redeem du code (lien partagé par le donneur).
 */
export function activateGiftFromStripeCode(plan: "monthly" | "annual"): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("stopharam_paid", "true");
  if (plan === "monthly") {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    window.localStorage.setItem(FREE_MONTH_UNTIL_KEY, d.toISOString());
    window.localStorage.setItem("stopharam_forfait", "gratuit_1mois");
  } else {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    window.localStorage.setItem(GIFT_ANNUAL_UNTIL_KEY, d.toISOString());
    window.localStorage.setItem("stopharam_forfait", "annuel");
  }
}

/** Utiliser 100 points pour générer un lien "1 mois gratuit". Retourne l'URL ou null. */
export function usePointsForFreeMonth(): string | null {
  if (typeof window === "undefined") return null;
  if (!canOfferFreeMonth()) return null;

  addPointsSpent(POINTS_FOR_FREE_MONTH);
  window.dispatchEvent(new CustomEvent("stopharam-points-updated"));

  const code = "FM" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 8).toUpperCase();
  const url = `${window.location.origin}/start?offer=${code}`;
  window.localStorage.setItem("stopharam_last_free_month_code", code);
  window.localStorage.setItem("stopharam_last_free_month_url", url);
  return url;
}
