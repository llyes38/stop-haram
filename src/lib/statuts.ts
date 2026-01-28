export interface Statut {
  minDays: number;
  id: string;
  label: string;
  description: string;
  emoji: string;
}

/** Degrés de réussite de 0 à 90 jours. Le statut actuel = plus haut dont streakDays >= minDays. */
export const STATUTS: Statut[] = [
  { minDays: 0, id: "nouveau-ne", label: "Nouveau né", description: "Tu viens de commencer. Chaque instant compte.", emoji: "🌱" },
  { minDays: 2, id: "graine", label: "Graine", description: "Reste sobre 2 jours.", emoji: "🌿" },
  { minDays: 3, id: "pousse", label: "Pousse", description: "Reste sobre 3 jours.", emoji: "🪴" },
  { minDays: 5, id: "pionnier", label: "Pionnier", description: "Reste sobre 5 jours.", emoji: "⛳" },
  { minDays: 7, id: "elan", label: "Élan", description: "Reste sobre 7 jours.", emoji: "💪" },
  { minDays: 10, id: "forteresse", label: "Forteresse", description: "Reste sobre 10 jours.", emoji: "🛡️" },
  { minDays: 14, id: "gardien", label: "Gardien", description: "Reste sobre 14 jours.", emoji: "🌟" },
  { minDays: 21, id: "ancrage", label: "Ancrage", description: "Reste sobre 21 jours.", emoji: "🏔️" },
  { minDays: 30, id: "defi-30", label: "Défi 30", description: "Reste sobre 30 jours.", emoji: "🎯" },
  { minDays: 45, id: "ferme", label: "Ferme", description: "Reste sobre 45 jours.", emoji: "🌳" },
  { minDays: 60, id: "rocher", label: "Rocher", description: "Reste sobre 60 jours.", emoji: "🪨" },
  { minDays: 90, id: "phare", label: "Phare", description: "Reste sobre 90 jours.", emoji: "🔱" },
];

export function getCurrentStatut(streakDays: number | null): Statut {
  if (streakDays == null || !Number.isFinite(streakDays) || streakDays < 0) {
    return STATUTS[0];
  }
  const d = Math.floor(streakDays);
  let current = STATUTS[0];
  for (const s of STATUTS) {
    if (d >= s.minDays) current = s;
  }
  return current;
}

export function isStatutUnlocked(statut: Statut, streakDays: number | null): boolean {
  if (streakDays == null || !Number.isFinite(streakDays) || streakDays < 0) {
    return statut.minDays === 0;
  }
  return Math.floor(streakDays) >= statut.minDays;
}
