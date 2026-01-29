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
}

/** Liste des causes de dons (construct. puits, orphelins, etc.). À enrichir plus tard. */
export const SADAQA_CAUSES: SadaqaCause[] = [
  { id: "puits", label: "Construction de puits", description: "Eau potable pour des communautés.", icon: "💧" },
  { id: "orphelins", label: "Aider des orphelins", description: "Parrainage, éducation, soins.", icon: "🧒" },
  { id: "nourriture", label: "Nourriture (Ramadan, quotidien)", description: "Paniers, repas, soupes populaires.", icon: "🫒" },
  { id: "santé", label: "Santé et soins", description: "Médicaments, opérations, hôpitaux.", icon: "🏥" },
  { id: "éducation", label: "Éducation et Coran", description: "Écoles, madrasas, apprentissage du Coran.", icon: "📖" },
  { id: "mosquée", label: "Mosquée et lieu de culte", description: "Construction, rénovation, entretien.", icon: "🕋" },
  { id: "urgence", label: "Urgences et catastrophes", description: "Séismes, inondations, conflits.", icon: "🆘" },
  { id: "autre", label: "Autre cause", description: "Toute autre œuvre de bienfaisance.", icon: "🤲" },
];
