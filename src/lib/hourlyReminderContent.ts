/**
 * Contenu des rappels horaires : versets/hadiths et messages de bienveillance.
 * Alternance : heures paires = verset/hadith, heures impaires = "comment vas-tu, on est là pour toi".
 */

const VERSETS_HADITHS: { texte: string; ref: string }[] = [
  { texte: "« N'est-ce pas par l'évocation d'Allah que s'apaisent les cœurs ? »", ref: "Ar-Ra'd, 13-28" },
  { texte: "« Certes, avec la difficulté il y a une facilité. »", ref: "Ash-Sharh, 94-6" },
  { texte: "« Et quiconque craint Allah, Il lui donnera une issue. »", ref: "At-Talaq, 65-2" },
  { texte: "« Et ton Seigneur n'oublie pas. »", ref: "Maryam, 19-64" },
  { texte: "« Invoque ton Seigneur quand tu oublies. »", ref: "Al-Kahf, 18-24" },
  { texte: "« Dis aux croyants de baisser leur regard et de préserver leur chasteté. »", ref: "An-Nour, 24-30" },
  { texte: "« Ceux qui dominent leur colère et pardonnent aux gens. Allah aime les bienfaisants. »", ref: "Ali 'Imran, 3-134" },
  { texte: "« Récite ce qui t'est révélé du Livre et accomplis la prière. La prière préserve de la turpitude. »", ref: "Al-Ankabout, 29-45" },
  { texte: "« Dis : Il est Allah, Unique. »", ref: "Al-Ikhlas, 112-1" },
  { texte: "« Et ne vous jetez pas par vos propres mains dans la perdition. »", ref: "Al-Baqarah, 2-195" },
  { texte: "Le Prophète a dit : « La meilleure des invocations est celle du jour de Arafat. »", ref: "Hadith" },
  { texte: "Le Prophète a dit : « Quiconque dit : Il n’y a de divinité qu’Allah, seul, sans associé… a le Paradis. »", ref: "Hadith" },
  { texte: "« Ô vous qui avez cru, craignez Allah et soyez avec les véridiques. »", ref: "At-Tawbah, 9-119" },
  { texte: "« Et Nous n'avons créé les djinns et les hommes que pour qu'ils M'adorent. »", ref: "Adh-Dhariyat, 51-56" },
  { texte: "Le Prophète a dit : « Celui qui se repent est comme celui qui n’a pas péché. »", ref: "Hadith" },
  { texte: "« Et mangez et buvez mais ne gaspillez pas. »", ref: "Al-A'raf, 7-31" },
  { texte: "Le Prophète a dit : « La prière est la lumière. »", ref: "Hadith" },
  { texte: "« Et ceux qui préservent leur chasteté… Allah les récompensera au-delà de ce qu'ils ont œuvré. »", ref: "An-Nour, 24-33" },
];

const BIENVEILLANCE: string[] = [
  "Comment vas-tu ? On est là pour toi. Khayr in cha Allah.",
  "Tu vas bien ? On pense à toi. N'hésite pas à ouvrir l'app si tu as besoin.",
  "Salam, tout va bien de ton côté ? On est avec toi.",
  "Petit check-in : comment tu te sens ? On est là si tu veux en parler.",
  "Tu tiens le coup ? Rappelle-toi qu'Allah est avec ceux qui patientent.",
  "On est là pour toi. Si tu as un moment, ouvre l'app — ça fait du bien de se recentrer.",
  "Comment va ta journée ? On t'envoie du soutien. Barakallahou fik.",
  "Petit rappel : tu n'es pas seul(e). On est là. Prends soin de toi.",
  "Tout va bien ? On pense à toi. Une petite pause dhikr peut faire du bien.",
  "Salam, on vérifie juste : tu vas bien ? On est avec toi.",
  "Comment tu te sens en ce moment ? On est là pour toi. Khayr in cha Allah.",
  "On est là. Si tu as besoin de te recentrer, ouvre l'app. Barakallahou fik.",
];

/** Index horaire : jour de l'année * 24 + heure, pour varier le contenu. */
function getHourlyIndex(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86400000);
  const hour = date.getUTCHours();
  return dayOfYear * 24 + hour;
}

/** Retourne un verset ou hadith pour l'heure donnée. */
export function getVerseOrHadithForHour(date: Date = new Date()): { texte: string; ref: string } {
  const index = getHourlyIndex(date) % VERSETS_HADITHS.length;
  return VERSETS_HADITHS[index] ?? VERSETS_HADITHS[0];
}

/** Retourne un message de bienveillance pour l'heure donnée. */
export function getBienveillanceForHour(date: Date = new Date()): string {
  const index = getHourlyIndex(date) % BIENVEILLANCE.length;
  return BIENVEILLANCE[index] ?? BIENVEILLANCE[0];
}

/** Heures paires (0, 2, 4, ...) = verset/hadith ; impaires (1, 3, 5, ...) = bienveillance. */
export function isVerseHour(date: Date = new Date()): boolean {
  return date.getUTCHours() % 2 === 0;
}
