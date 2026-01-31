/**
 * Système de niveaux pour le défi 30 jours.
 * Un nouveau niveau tous les 5 jours. Actions de plus en plus difficiles.
 */

export const DAYS_PER_LEVEL = 5;
export const TOTAL_LEVELS = 6; // 30 jours / 5 = 6 niveaux

export const LEVEL_NAMES: Record<number, string> = {
  1: "Débutant",
  2: "Initiation",
  3: "Persévérant",
  4: "Régulier",
  5: "Avancé",
  6: "Maître",
};

export const LEVEL_EMOJIS: Record<number, string> = {
  1: "🌱",
  2: "🌿",
  3: "🌳",
  4: "⭐",
  5: "🔥",
  6: "👑",
};

/** Retourne le niveau (1-6) pour un jour donné (1-30). */
export function getLevelFromDay(day: number): number {
  if (day < 1) return 1;
  if (day > 30) return 6;
  return Math.ceil(day / DAYS_PER_LEVEL);
}

/** Jours couverts par un niveau : { start, end } */
export function getLevelBounds(level: number): { start: number; end: number } {
  const start = (level - 1) * DAYS_PER_LEVEL + 1;
  const end = Math.min(level * DAYS_PER_LEVEL, 30);
  return { start, end };
}

/** Décalage pour sélectionner des actions plus difficiles (utilisé dans programEngine). */
export function getLevelDifficultyOffset(level: number): number {
  return (level - 1) * 4;
}
