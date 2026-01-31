const KEY = "stopharam_temptation_stats";

export interface TemptationStats {
  tempted: number;
  resisted: number;
}

export function getTemptationStats(): TemptationStats {
  if (typeof window === "undefined") return { tempted: 0, resisted: 0 };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { tempted: 0, resisted: 0 };
    const p = JSON.parse(raw) as { tempted?: number; resisted?: number };
    return {
      tempted: Math.max(0, Number(p.tempted) || 0),
      resisted: Math.max(0, Number(p.resisted) || 0),
    };
  } catch {
    return { tempted: 0, resisted: 0 };
  }
}

function setTemptationStats(s: TemptationStats): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(s));
}

export function incrementTempted(): void {
  const s = getTemptationStats();
  s.tempted += 1;
  setTemptationStats(s);
}

export function incrementResisted(): void {
  const s = getTemptationStats();
  s.resisted += 1;
  setTemptationStats(s);
}

/** Réinitialise les stats (nouveau profil). */
export function resetTemptationStats(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
