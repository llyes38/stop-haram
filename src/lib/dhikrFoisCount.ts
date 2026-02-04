/**
 * Compteur vibreur pour les actions "Réciter … X fois" (100 fois, 50 fois, etc.).
 */

import { todayKey } from "@/lib/date";

const STORAGE_KEY_PREFIX = "dhikr_fois_";

function storageKey(actionTitle: string): string {
  const slug = actionTitle.replace(/\s+/g, "_").slice(0, 60);
  return `${STORAGE_KEY_PREFIX}${todayKey()}_${slug}`;
}

/** Extrait le nombre cible du titre ou de la description (ex. "100 fois" -> 100). */
export function getFoisTarget(title: string, desc?: string): number | null {
  const text = `${title} ${desc ?? ""}`;
  const m = text.match(/(\d+)\s*fois/);
  return m ? parseInt(m[1], 10) : null;
}

export function getDhikrFoisCount(actionTitle: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(storageKey(actionTitle));
    if (raw == null) return 0;
    return parseInt(raw, 10) || 0;
  } catch {
    return 0;
  }
}

/** Incrémente le compteur pour cette action aujourd'hui. Retourne le nouveau count. */
export function incrementDhikrFoisCount(actionTitle: string, target: number): number {
  if (typeof window === "undefined") return 0;
  const current = getDhikrFoisCount(actionTitle);
  const next = Math.min(current + 1, target);
  window.localStorage.setItem(storageKey(actionTitle), String(next));
  return next;
}

/** Remet le compteur à zéro pour cette action aujourd'hui. */
export function resetDhikrFoisCount(actionTitle: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(storageKey(actionTitle));
}
