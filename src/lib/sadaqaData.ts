/**
 * Sadaqa : hadith, verset et liste des causes de dons.
 * « La sadaqa efface le péché comme l'eau éteint le feu. »
 */

export const SADAQA_HADITH = {
  ar: "الصَّدَقَةُ تُطْفِئُ الْخَطِيئَةَ كَمَا يُطْفِئُ الْمَاءُ النَّارَ",
  fr: "La sadaqa éteint le péché comme l'eau éteint le feu.",
  ref: "Ibn Mâjah, 3973 — authentifié par Al-Albânî",
};

export const SADAQA_VERSE = {
  text: "Prélève de leurs biens une aumône (sadaqa) par laquelle tu les purifies et les amendes.",
  ref: "Sourate At-Tawbah, 9 — v. 103",
};

export type CauseId = string;

export interface SadaqaCause {
  id: CauseId;
  label: string;
  description: string;
  icon: string;
  /** Lien externe vers un partenaire pour donner pour de vrai (ex. Ummah Charity). */
  externalUrl?: string;
  /** Nom du partenaire affiché (ex. "Ummah Charity"). */
  partnerLabel?: string;
  /** URL du logo de l'association partenaire (affiché sur le don). Si absent, un favicon du domaine est utilisé. */
  partnerLogoUrl?: string;
}

/** Liste des causes de dons (construct. puits, orphelins, etc.). À enrichir plus tard. */
export const SADAQA_CAUSES: SadaqaCause[] = [
  {
    id: "puits",
    label: "Construction de puits / forages",
    description: "Eau potable pour des communautés. Forages durables (OMS).",
    icon: "💧",
    externalUrl: "https://ummahcharity.org/forage/",
    partnerLabel: "Ummah Charity",
    partnerLogoUrl: "https://ummahcharity.org/favicon.ico",
  },
  {
    id: "orphelins",
    label: "Aider des orphelins",
    description: "Parrainage, éducation, soins.",
    icon: "🧒",
    externalUrl: "https://souriredorphelins.org/faire-un-don/",
    partnerLabel: "Sourire d'Orphelins",
    partnerLogoUrl: "https://souriredorphelins.org/favicon.ico",
  },
  {
    id: "nourriture",
    label: "Nourriture (Ramadan, quotidien)",
    description: "Paniers, repas, soupes populaires.",
    icon: "🫒",
    externalUrl: "https://muslimhands.fr/campagnes/fourchette-fraternelle",
    partnerLabel: "Muslim Hands France — La Fourchette Fraternelle",
    partnerLogoUrl: "https://muslimhands.fr/favicon.ico",
  },
    {
    id: "santé",
    label: "Santé et soins",
    description: "Médicaments, opérations, hôpitaux.",
    icon: "🏥",
    externalUrl: "https://www.secours-islamique.org/",
    partnerLabel: "Secours Islamique France",
    partnerLogoUrl: "https://www.secours-islamique.org/favicon.ico",
  },
    {
    id: "éducation",
    label: "Éducation et Coran",
    description: "Écoles, madrasas, apprentissage du Coran.",
    icon: "📖",
    externalUrl: "https://humanappeal.fr/faire-un-don/projets/orphelins-education/fonds-education",
    partnerLabel: "Human Appeal France — Fonds Éducation",
    partnerLogoUrl: "https://humanappeal.fr/favicon.ico",
  },
  { id: "mosquée", label: "Mosquée et lieu de culte", description: "Chaque mois on choisit un projet mosquée en France et on s'y consacre.", icon: "🕋" },
  { id: "urgence", label: "Urgences et catastrophes", description: "Chaque mois on choisit un projet urgence en France et on s'y consacre.", icon: "🆘" },
  { id: "autre", label: "Autre cause", description: "Toute autre œuvre de bienfaisance.", icon: "🤲" },
];
