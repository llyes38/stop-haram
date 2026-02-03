/**
 * Stockage des dons (sadaqa) — enregistrement pour le suivi personnel. Les vrais dons se font sur le site du partenaire.
 */

const KEY = "stopharam_sadaqa_dons";

export interface SadaqaDon {
  causeId: string;
  causeLabel: string;
  amountEur: number;
  dateIso: string;
}

function load(): SadaqaDon[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SadaqaDon[];
  } catch {
    return [];
  }
}

function save(dons: SadaqaDon[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(dons));
}

export function addDon(don: Omit<SadaqaDon, "dateIso">): void {
  const list = load();
  list.push({ ...don, dateIso: new Date().toISOString().slice(0, 10) });
  save(list);
}

export function getDons(): SadaqaDon[] {
  return load();
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function hasDonToday(): boolean {
  return load().some((d) => d.dateIso === todayKey());
}
