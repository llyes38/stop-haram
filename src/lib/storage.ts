export type SelectedSin =
  | "porno"
  | "musique"
  | "priere"
  | "colere"
  | "drogue"
  | "alcool"
  | "jeux"
  | "mensonge"
  | "regard"
  | "autre";

export interface PlanDay {
  day: number;
  focus: { title: string; desc: string };
  base: { title: string; desc: string };
  optional?: { title: string; desc: string };
}

export interface StopHaramUser {
  name: string;
  selectedSins: SelectedSin[];
  answers?: Record<string, unknown>;
  scores: Record<string, number>;
  startDateISO: string;
  lastCheckinISO?: string;
  streakDays: number;
  perSinStreak?: Record<string, number>;
  plan: {
    durationDays: 28;
    focusSin: SelectedSin;
    baseSin?: SelectedSin;
    days: PlanDay[];
  };
}

const STORAGE_KEY = "stopharam_user";

const DOMAIN_TO_SIN: Record<string, SelectedSin> = {
  "Prière / retard / négligence": "priere",
  "Regards / contenu explicite": "regard",
  "Relations illicites": "porno",
  "Alcool / drogues": "drogue",
  "Mensonge / double vie": "mensonge",
  "Colère / insultes": "colere",
  "Musique / temps perdu": "musique",
  "Réseaux sociaux / addiction téléphone": "jeux",
  "Autre / je ne sais pas encore": "autre",
};

export function getUser(): StopHaramUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StopHaramUser;
  } catch {
    return null;
  }
}

export function saveUser(user: StopHaramUser): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function getDayNumber(startDateISO: string): number {
  const start = new Date(startDateISO);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff + 1);
}

export function ensureUserDefaults(partial: Partial<StopHaramUser>): StopHaramUser {
  const existing = getUser();
  const startDateISO = partial.startDateISO ?? existing?.startDateISO ?? new Date().toISOString().slice(0, 10);
  const selectedSins = partial.selectedSins ?? existing?.selectedSins ?? [];
  const scores: Record<string, number> = { ...existing?.scores, ...partial.scores };
  selectedSins.forEach((sin) => {
    if (scores[sin] === undefined) scores[sin] = 50;
  });
  const plan = partial.plan ?? existing?.plan;
  const baseUser: StopHaramUser = {
    name: partial.name ?? existing?.name ?? "",
    selectedSins,
    answers: partial.answers ?? existing?.answers,
    scores,
    startDateISO,
    lastCheckinISO: partial.lastCheckinISO ?? existing?.lastCheckinISO,
    streakDays: partial.streakDays ?? existing?.streakDays ?? 0,
    perSinStreak: partial.perSinStreak ?? existing?.perSinStreak,
    plan: plan ?? {
      durationDays: 28,
      focusSin: selectedSins[0] ?? "autre",
      baseSin: selectedSins[1],
      days: [],
    },
  };
  return baseUser;
}

export function domainsToSins(domainLabels: string[]): SelectedSin[] {
  const sins: SelectedSin[] = [];
  const seen = new Set<SelectedSin>();
  domainLabels.forEach((label) => {
    const sin = DOMAIN_TO_SIN[label];
    if (sin && !seen.has(sin)) {
      seen.add(sin);
      sins.push(sin);
    }
  });
  if (sins.length === 0) sins.push("autre");
  return sins;
}

export function getSinLabel(sin: SelectedSin): string {
  const labels: Record<SelectedSin, string> = {
    porno: "Porno",
    musique: "Musique",
    priere: "Prière",
    colere: "Colère",
    drogue: "Drogue",
    alcool: "Alcool",
    jeux: "Jeux",
    mensonge: "Mensonge",
    regard: "Regard",
    autre: "Autre",
  };
  return labels[sin] ?? sin;
}

export function getScoreLabel(score: number): string {
  if (score <= 30) return "Stable";
  if (score <= 60) return "À surveiller";
  return "Prioritaire";
}
