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
  additionalActions?: Array<{ title: string; desc: string; sin?: SelectedSin }>;
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
  /** Nombre d'enfants filles */
  enfantsFilles?: number;
  /** Nombre d'enfants garçons */
  enfantsGarcons?: number;
  /** Si l'utilisateur a choisi "autre", il peut décrire son péché — utilisé pour l'affichage et la personnalisation */
  customSinDescription?: string;
  /** Cache des actions générées par IA pour péchés personnalisés non prédéfinis — clé = péché en minuscules */
  customSinActionsCache?: Record<string, { action1: Array<{ title: string; desc: string }>; focus: Array<{ title: string; desc: string }> }>;
  /** Photo de profil en base64 (data URL) — stockée localement, sans base de données */
  profilePhoto?: string;
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
  if (!startDateISO || startDateISO.trim() === "") return 0;
  const start = new Date(startDateISO);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff + 1);
}

export function hasDefiStarted(user: StopHaramUser | null): boolean {
  return !!(user?.startDateISO && user.startDateISO.trim() !== "");
}

export function ensureUserDefaults(partial: Partial<StopHaramUser>): StopHaramUser {
  const existing = getUser();
  const startDateISO = partial.startDateISO ?? existing?.startDateISO ?? "";
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

export function getSinLabel(sin: SelectedSin, user?: StopHaramUser | null): string {
  const labels: Record<SelectedSin, string> = {
    porno: "Relations illicites",
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
  if (sin === "autre" && user?.profileInfo?.customSinDescription?.trim()) {
    return user.profileInfo.customSinDescription.trim();
  }
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
  return getDailyActionsWithSins(user).map((a) => a.title);
}

/** Actions du jour avec le péché associé et la description (pour affichage et détail). */
export function getDailyActionsWithSins(user: StopHaramUser | null): Array<{ title: string; desc?: string; sin?: SelectedSin }> {
  const defaultFocus = "Lire un rappel ou une invocation";
  const defaultFocusDesc = "Choisis un rappel ou une invocation du Coran pour te recentrer.";
  const defaultBase = "Une action concrète vers mon objectif";
  const defaultBaseDesc = "Choisis une action en lien avec ton objectif.";
  const defaultIntention = "Faire mon intention du jour";
  const defaultIntentionDesc = "Formule en ton cœur l'intention de passer la journée sans succomber à tes péchés.";
  const focusSin: SelectedSin = user?.plan?.focusSin ?? "autre";
  const baseSin: SelectedSin | undefined = user?.plan?.baseSin;

  const invocationsMatinDefault = {
    title: "Invocations du matin",
    desc: "SubhanAllah 33, Alhamdulillah 33, Allahu Akbar 34. Touche pour compter.",
  };
  const invocationsSoirDefault = {
    title: "Invocations avant de dormir",
    desc: "SubhanAllah 33, Alhamdulillah 33, Allahu Akbar 34. Touche pour compter.",
  };

  const nDefault = user?.profileInfo?.actionsPerDay ?? 3;
  const defList = [
    { title: defaultIntention, desc: defaultIntentionDesc, sin: focusSin },
    { title: defaultFocus, desc: defaultFocusDesc, sin: focusSin },
    { title: defaultBase, desc: defaultBaseDesc, sin: baseSin },
  ];

  if (!user?.plan?.days?.length || !user.startDateISO) {
    return [invocationsMatinDefault, ...defList.slice(0, nDefault), invocationsSoirDefault];
  }

  const dayNum = getDayNumber(user.startDateISO);
  const idx = Math.min(Math.max(dayNum - 1, 0), user.plan.days.length - 1);
  const d = user.plan.days[idx];
  if (!d) {
    return [invocationsMatinDefault, ...defList.slice(0, user.profileInfo?.actionsPerDay ?? 3), invocationsSoirDefault];
  }

  let action1Title = d.intention?.title;
  let action1Desc = d.intention?.desc;
  if (!action1Title || action1Title === "Faire mon intention du jour" || action1Title.startsWith("Intention :")) {
    const action1List = ACTION_1[focusSin] ?? ACTION_1.autre;
    const actionIdx = (d.day - 1) % action1List.length;
    const item = action1List[actionIdx];
    action1Title = item?.title ?? defaultIntention;
    action1Desc = item?.desc ?? defaultIntentionDesc;
  }

  const actionsPerDay = user.profileInfo?.actionsPerDay ?? 3;
  /** Actions de base communes à tout le monde : invocations du matin + invocations avant de dormir. */
  const invocationsMatinAction: { title: string; desc?: string; sin?: SelectedSin } = {
    title: "Invocations du matin",
    desc: "SubhanAllah 33, Alhamdulillah 33, Allahu Akbar 34. Touche pour compter.",
  };
  const invocationsSoirAction: { title: string; desc?: string; sin?: SelectedSin } = {
    title: "Invocations avant de dormir",
    desc: "SubhanAllah 33, Alhamdulillah 33, Allahu Akbar 34. Touche pour compter.",
  };
  const additionalItems =
    d.additionalActions?.map((a) => ({ title: a.title, desc: a.desc, sin: a.sin })) ?? [];
  const itemsSansInvocations = [
    { title: action1Title, desc: action1Desc, sin: focusSin },
    { title: d.focus?.title ?? defaultFocus, desc: d.focus?.desc ?? defaultFocusDesc, sin: focusSin },
    { title: d.base?.title ?? defaultBase, desc: d.base?.desc ?? defaultBaseDesc, sin: baseSin },
  ];
  const n = Math.max(actionsPerDay, 1);
  const personnalisees = [...itemsSansInvocations, ...additionalItems].slice(0, n);
  /** Matin en premier, actions du jour au milieu, invocations avant de dormir en dernier. */
  return [invocationsMatinAction, ...personnalisees, invocationsSoirAction];
}
