/**
 * Logique de vérification quotidienne (ex-page rechute).
 * Marque le check du jour et met à jour la série.
 */

import { completeOnboarding, updateLastRoute } from "@/lib/authState";
import { clearTodayActions } from "@/lib/dailyActions";
import { getUser, getDailyActionLabels } from "@/lib/storage";

const LAST_RECHUTE_KEY = "last_rechute_check";
const DAYS_CLEAN_KEY = "days_clean";
const LAST_STREAK_START_KEY = "last_streak_start_iso";

function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function hasRechuteCheckedToday(): boolean {
  if (typeof window === "undefined") return false;
  const raw = window.localStorage.getItem(LAST_RECHUTE_KEY);
  if (!raw) return false;
  return raw === getTodayISO();
}

/**
 * Marque le check du jour et met à jour streak / actions.
 * stillStrong: true = pas rechuté, false = rechute déclarée.
 */
export function markRechuteDoneForToday(stillStrong: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LAST_RECHUTE_KEY, getTodayISO());
  const raw = window.localStorage.getItem(DAYS_CLEAN_KEY);
  const current = raw !== null && raw !== "" ? parseInt(raw, 10) : 0;
  const num = Number.isFinite(current) ? current : 0;
  const nowIso = new Date().toISOString();
  if (stillStrong) {
    window.localStorage.setItem(DAYS_CLEAN_KEY, String(num + 1));
    const existingStart = window.localStorage.getItem(LAST_STREAK_START_KEY);
    if (!existingStart || num === 0) window.localStorage.setItem(LAST_STREAK_START_KEY, nowIso);
  } else {
    window.localStorage.setItem(DAYS_CLEAN_KEY, "0");
    window.localStorage.setItem(LAST_STREAK_START_KEY, nowIso);
    const user = getUser();
    const labels = getDailyActionLabels(user);
    clearTodayActions(labels.length);
  }
  try {
    const rawUser = window.localStorage.getItem("stopharam_user");
    if (rawUser) {
      const u = JSON.parse(rawUser) as { streakDays?: number };
      const next = stillStrong ? (u.streakDays ?? 0) + 1 : 0;
      window.localStorage.setItem("stopharam_user", JSON.stringify({ ...u, streakDays: next, lastCheckinISO: getTodayISO() }));
    }
  } catch {
    /* ignore */
  }
  completeOnboarding();
  updateLastRoute("/home");
}
