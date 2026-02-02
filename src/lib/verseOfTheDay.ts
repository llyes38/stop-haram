/**
 * Verset du jour : liste fixe, un verset différent par jour (rotation par jour de l'année).
 * Utilisé par le cron daily-reminder pour la notification "un verset par jour".
 */

const VERSETS: { texte: string; ref: string }[] = [
  { texte: "« Dis aux croyants de baisser leur regard et de préserver leur chasteté. »", ref: "An-Nour, 24-30" },
  { texte: "« Et ceux qui préservent leur chasteté… Allah les récompensera au-delà de ce qu'ils ont œuvré. »", ref: "An-Nour, 24-33" },
  { texte: "« Récite ce qui t'est révélé du Livre et accomplis la prière. La prière préserve de la turpitude. »", ref: "Al-Ankabout, 29-45" },
  { texte: "« Ceux qui dominent leur colère et pardonnent aux gens. Allah aime les bienfaisants. »", ref: "Ali 'Imran, 3-134" },
  { texte: "« N'est-ce pas par l'évocation d'Allah que s'apaisent les cœurs ? »", ref: "Ar-Ra'd, 13-28" },
  { texte: "« Et ne vous jetez pas par vos propres mains dans la perdition. »", ref: "Al-Baqarah, 2-195" },
  { texte: "« Et quiconque craint Allah, Il lui donnera une issue. »", ref: "At-Talaq, 65-2" },
  { texte: "« Ô vous qui avez cru, craignez Allah et soyez avec les véridiques. »", ref: "At-Tawbah, 9-119" },
  { texte: "« Le vin et les jeux de hasard sont une abomination, œuvre du diable. »", ref: "Al-Maidah, 5-90" },
  { texte: "« Et mangez et buvez mais ne gaspillez pas. »", ref: "Al-A'raf, 7-31" },
  { texte: "« Invoque ton Seigneur quand tu oublies. »", ref: "Al-Kahf, 18-24" },
  { texte: "« Et Nous n'avons créé les djinns et les hommes que pour qu'ils M'adorent. »", ref: "Adh-Dhariyat, 51-56" },
  { texte: "« Certes, avec la difficulté il y a une facilité. »", ref: "Ash-Sharh, 94-6" },
  { texte: "« Et ton Seigneur n'oublie pas. »", ref: "Maryam, 19-64" },
  { texte: "« Dis : Il est Allah, Unique. »", ref: "Al-Ikhlas, 112-1" },
];

/** Retourne le verset du jour (déterminé par le jour de l'année). */
export function getVerseOfTheDay(date: Date = new Date()): { texte: string; ref: string } {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 86400000;
  const dayOfYear = Math.floor(diff / oneDay);
  const index = dayOfYear % VERSETS.length;
  return VERSETS[index] ?? VERSETS[0];
}
