/**
 * Quiz ludique : points de gratitude, stockage localStorage.
 */

const STORAGE_KEYS = {
  totalGratitude: "stopharam_quiz_gratitude_total",
  lastDate: "stopharam_quiz_last_date",
} as const;

export function getQuizGratitudeTotal(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(STORAGE_KEYS.totalGratitude);
  const n = raw != null ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

export function addQuizGratitude(points: number): number {
  if (typeof window === "undefined") return 0;
  const current = getQuizGratitudeTotal();
  const next = Math.max(0, current + points);
  window.localStorage.setItem(STORAGE_KEYS.totalGratitude, String(next));
  window.localStorage.setItem(STORAGE_KEYS.lastDate, new Date().toISOString().slice(0, 10));
  return next;
}

export function getQuizLastDate(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEYS.lastDate);
}
