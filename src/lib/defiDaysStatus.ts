/**
 * Statut de chaque jour du défi 30 jours : validé (✓) ou échoué (✗).
 */

const KEY = "stopharam_defi_days";

export type DayStatus = "validated" | "failed";

export function getDefiDaysStatus(): Record<number, DayStatus> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const p = JSON.parse(raw) as Record<string, string>;
    const out: Record<number, DayStatus> = {};
    Object.entries(p).forEach(([k, v]) => {
      const n = parseInt(k, 10);
      if (Number.isFinite(n) && (v === "validated" || v === "failed")) {
        out[n] = v;
      }
    });
    return out;
  } catch {
    return {};
  }
}

export function setDefiDayStatus(day: number, status: DayStatus): void {
  if (typeof window === "undefined" || day < 1 || day > 30) return;
  const current = getDefiDaysStatus();
  current[day] = status;
  window.localStorage.setItem(KEY, JSON.stringify(current));
}

export function clearDefiDaysStatus(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
