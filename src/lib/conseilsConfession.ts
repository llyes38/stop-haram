import type { SelectedSin } from "./storage";

/**
 * 1–2 conseils brefs et bienveillants par péché, pour la rubrique "Se confier".
 * Ton introspection / exutoire, pas crise. L’utilisateur se confie, on catégorise et on répond par 1–2 rappels.
 */
const CONSEILS_PAR_PECHE: Record<SelectedSin, string[]> = {
  regard: [
    "Détourne le regard dès que possible : c’est le premier rempart. Le Prophète (ﷺ) a dit : « Le premier regard est pour toi, le second est contre toi. »",
    "Fais wudhu et répète « Astaghfirullah ». Change de pièce ou sors marcher quelques minutes.",
  ],
  porno: [
    "Chaque minute où tu résistes compte. Fais tes ablutions, prie 2 raka'at si tu peux, et range ton téléphone dans une autre pièce.",
    "Rappelle-toi pourquoi tu as arrêté. Allah aime celui qui se repent : « Ô Mon serviteur, tant que tu M’invoques et M’implores, Je te pardonne. »",
  ],
  priere: [
    "La prochaine prière est une nouvelle chance. Fais-la tout de suite, même en retard ; n’attends pas la suivante.",
    "Le Coran dit : « La prière préserve de la turpitude et du blâmable. » Prépare l’eau des ablutions maintenant.",
  ],
  colere: [
    "Se taire et se retirer, c’est déjà gagner. Fais wudhu : le Prophète a dit que la colère vient du chaytan, l’eau l’éteint.",
    "Assieds-toi si tu es debout. Répète « A’udhu billahi min ach-chaytan ar-rajim » avant de répondre.",
  ],
  musique: [
    "Remplace par du dhikr ou une lecture du Coran. « Ceux qui entendent la Parole et la suivent : ce sont eux les bien-guidés. »",
    "Coupe tout de suite. Sors marcher sans écouteurs, ou appelle quelqu’un pour parler.",
  ],
  jeux: [
    "Pose le téléphone dans une autre pièce, écran vers le bas. Le jeu peut attendre.",
    "Remplace par une activité manuelle : lecture, marche, sport. Rappelle-toi l’action du jour de ton plan.",
  ],
  mensonge: [
    "La vérité libère. Un seul mot suffit : « Je me suis trompé » ou « En fait, la vérité c’est… ».",
    "Répète « Astaghfirullah » et prends l’intention ferme de ne plus mentir sur ce point. Corrige auprès de la personne si possible.",
  ],
  drogue: [
    "Éloigne-toi des lieux et des personnes liés. Appelle quelqu’un de confiance tout de suite : ami, famille, groupe de soutien.",
    "Rappelle-toi les conséquences que tu as vécues. Invoque Allah : « Allahumma inni a’udhu bika min al-hammi wal-huzn. »",
  ],
  alcool: [
    "Quitte le lieu si tu sens la tentation. Appelle un proche ou un groupe de soutien.",
    "Rappelle-toi les dégâts passés. Remplace par une boisson sans alcool que tu aimes ; fais wudhu et prie.",
  ],
  autre: [
    "Allah sait ce que tu vis. Chaque effort compte. « Quiconque craint Allah, Il lui donnera une issue. » (At-Talaq)",
    "Fais tes ablutions, change de pièce ou sors marcher. Répète « Astaghfirullah » et confie-toi à quelqu’un de confiance.",
  ],
};

/** Retourne 1–2 conseils pour la confession, selon le péché. */
export function getConseilsConfession(sin: SelectedSin): string[] {
  const conseils = CONSEILS_PAR_PECHE[sin] ?? CONSEILS_PAR_PECHE.autre;
  return conseils.slice(0, 2);
}
