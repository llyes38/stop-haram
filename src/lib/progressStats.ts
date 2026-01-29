/**
 * Stats de progrès : versets lus, invocations faites.
 * Liées aux actions quotidiennes (Coran, dhikr, etc.).
 */

const KEY = "stopharam_progress_stats";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export interface ProgressStats {
  versetsTotal: number;
  versetsToday: number;
  invocationsTotal: number;
  invocationsToday: number;
}

function load(): ProgressStats & { date?: string } {
  if (typeof window === "undefined") {
    return { versetsTotal: 0, versetsToday: 0, invocationsTotal: 0, invocationsToday: 0 };
  }
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { versetsTotal: 0, versetsToday: 0, invocationsTotal: 0, invocationsToday: 0 };
    return JSON.parse(raw) as ProgressStats & { date?: string };
  } catch {
    return { versetsTotal: 0, versetsToday: 0, invocationsTotal: 0, invocationsToday: 0 };
  }
}

function save(s: ProgressStats & { date: string }): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(s));
}

/** Retourne les stats du jour et au total. Réinitialise versetsToday/invocationsToday si nouveau jour. */
export function getProgressStats(): ProgressStats {
  const today = todayKey();
  const data = load();
  if (data.date !== today) {
    const out: ProgressStats = {
      versetsTotal: data.versetsTotal ?? 0,
      versetsToday: 0,
      invocationsTotal: data.invocationsTotal ?? 0,
      invocationsToday: 0,
    };
    save({ ...out, date: today });
    return out;
  }
  return {
    versetsTotal: data.versetsTotal ?? 0,
    versetsToday: data.versetsToday ?? 0,
    invocationsTotal: data.invocationsTotal ?? 0,
    invocationsToday: data.invocationsToday ?? 0,
  };
}

/** Ajoute n versets (aujourd’hui + total). */
export function addVersets(n: number): void {
  const today = todayKey();
  const data = load();
  if (data.date !== today) {
    data.versetsToday = 0;
    data.invocationsToday = 0;
    data.date = today;
  }
  data.versetsTotal = (data.versetsTotal ?? 0) + n;
  data.versetsToday = (data.versetsToday ?? 0) + n;
  save({ ...data, date: today });
}

/** Ajoute n invocations / séances de dhikr (aujourd’hui + total). */
export function addInvocations(n: number): void {
  const today = todayKey();
  const data = load();
  if (data.date !== today) {
    data.versetsToday = 0;
    data.invocationsToday = 0;
    data.date = today;
  }
  data.invocationsTotal = (data.invocationsTotal ?? 0) + n;
  data.invocationsToday = (data.invocationsToday ?? 0) + n;
  save({ ...data, date: today });
}

/** Nombre de versets à ajouter selon l’intitulé d’une action quotidienne (Coran, sourate, etc.). */
export function versetsFromActionLabel(label: string): number {
  const t = label.toLowerCase();
  const m = t.match(/apprendre\s*(?:par\s*cœur\s*)?(\d+)\s*verset/i);
  if (m) return Math.max(1, parseInt(m[1], 10));
  if (/\b(?:réciter|lis?|lire|écouter)\s+coran\b|\bcoran\s+(?:à\s+voix|10|15|20)\s*min/i.test(t)) return 10;
  if (/\b(?:réciter|lis?|lire)\s+sourate\b|sourate\s+al-|sourate\s+ya-sin|sourate\s+an-nas/i.test(t)) return 10;
  if (/\b(?:réciter|lis?|lire)\s+ayat\s+al-kursi|\bverset\b|quelques\s+versets/i.test(t)) return 5;
  return 0;
}

/** True si l’action correspond à des versets (Coran, sourate, etc.). */
export function isVerseAction(label: string): boolean {
  return versetsFromActionLabel(label) > 0;
}
