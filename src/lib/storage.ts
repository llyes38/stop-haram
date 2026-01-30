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
  intention?: { title: string; desc: string };
  focus: { title: string; desc: string };
  base: { title: string; desc: string };
  optional?: { title: string; desc: string };
  /** Actions supplémentaires pour les plans avec 5 ou 10 actions par jour */
  additionalActions?: Array<{ title: string; desc: string }>;
}

export type SituationFamiliale = "marie" | "celibataire" | "divorce" | "veuf" | "autre" | "";
export type StatutPro = "etudiant" | "activite" | "sans_emploi" | "retraite" | "autre" | "";
export type Genre = "homme" | "femme" | "";
export type PratiqueJour = "oui" | "parfois" | "non" | "";
export type Voilee = "oui" | "non" | "";
export type TypeLogement = "seul" | "famille" | "colocation" | "";
export type Converti = "oui" | "non" | "";

export interface ProfileInfo {
  genre?: Genre;
  situation?: SituationFamiliale;
  statut?: StatutPro;
  age?: number | null;
  ville?: string;
  prie?: PratiqueJour;
  voilee?: Voilee;
  logement?: TypeLogement;
  converti?: Converti;
  /** "Mon but en arrêtant mes péchés est de..." — motivation personnelle */
  whyStop?: string;
  /** Forfait choisi au début (checkout) : mensuel ou annuel */
  forfait?: "mensuel" | "annuel";
}

export interface StopHaramUser {
  name: string;
  selectedSins: SelectedSin[];
  profileInfo?: ProfileInfo;
  answers?: Record<string, unknown>;
  scores: Record<string, number>;
  startDateISO: string;
  lastCheckinISO?: string;
  streakDays: number;
  perSinStreak?: Record<string, number>;
  plan: {
    durationDays: 30;
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
  let profileInfo = partial.profileInfo ?? existing?.profileInfo;
  if (typeof window !== "undefined") {
    const pending = window.localStorage.getItem("stopharam_forfait");
    if ((pending === "mensuel" || pending === "annuel") && !profileInfo?.forfait) {
      profileInfo = { ...profileInfo, forfait: pending };
      window.localStorage.removeItem("stopharam_forfait");
    }
  }
  const baseUser: StopHaramUser = {
    name: partial.name ?? existing?.name ?? "",
    selectedSins,
    profileInfo,
    answers: partial.answers ?? existing?.answers,
    scores,
    startDateISO,
    lastCheckinISO: partial.lastCheckinISO ?? existing?.lastCheckinISO,
    streakDays: partial.streakDays ?? existing?.streakDays ?? 0,
    perSinStreak: partial.perSinStreak ?? existing?.perSinStreak,
    plan: plan ?? {
      durationDays: 30,
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

const SITUATION_LABELS: Record<Exclude<SituationFamiliale, "">, string> = {
  marie: "Marié(e)",
  celibataire: "Célibataire",
  divorce: "Divorcé(e)",
  veuf: "Veuf(ve)",
  autre: "Autre",
};

const STATUT_LABELS: Record<Exclude<StatutPro, "">, string> = {
  etudiant: "Étudiant(e)",
  activite: "En activité",
  sans_emploi: "Sans emploi",
  retraite: "Retraité(e)",
  autre: "Autre",
};

export function getSituationLabel(s: SituationFamiliale): string {
  return (s && SITUATION_LABELS[s]) || "—";
}

export function getStatutLabel(s: StatutPro): string {
  return (s && STATUT_LABELS[s]) || "—";
}

import { ACTION_1 } from "./programEngine";

/** Labels des actions du jour : retourne toutes les actions selon actionsPerDay. */
export function getDailyActionLabels(user: StopHaramUser | null): string[] {
  const defaultFocus = "Lire un rappel ou une invocation";
  const defaultBase = "Une action concrète vers mon objectif";
  const defaultIntention = "Faire mon intention du jour";

  if (!user?.plan?.days?.length || !user.startDateISO) {
    return [defaultIntention, defaultFocus, defaultBase];
  }

  const dayNum = getDayNumber(user.startDateISO);
  const idx = Math.min(Math.max(dayNum - 1, 0), user.plan.days.length - 1);
  const d = user.plan.days[idx];
  if (!d) {
    return [defaultIntention, defaultFocus, defaultBase];
  }

  // Si pas d'intention dans le plan ou si c'est l'ancienne intention fixe, générer une action variée depuis ACTION_1
  let action1Title = d.intention?.title;
  if (!action1Title || action1Title === "Faire mon intention du jour" || action1Title.startsWith("Intention :")) {
    const focusSin: SelectedSin = user.plan.focusSin ?? "autre";
    const action1List = ACTION_1[focusSin] ?? ACTION_1.autre;
    const dayNum = d.day;
    const actionIdx = (dayNum - 1) % action1List.length;
    action1Title = action1List[actionIdx]?.title ?? defaultIntention;
  }
  
  const actionsPerDay = user.profileInfo?.actionsPerDay ?? 3;
  const baseActions = [
    action1Title,
    d.focus?.title ?? defaultFocus,
    d.base?.title ?? defaultBase,
  ];
  
  const additionalActions = d.additionalActions?.map(a => a.title) ?? [];
  const allActions = [...baseActions, ...additionalActions].slice(0, actionsPerDay);
  
  return allActions;
}
