import type { SelectedSin } from "./storage";

export interface AideContenu {
  rappel: string;
  verset: { texte: string; ref: string };
  tips: string[];
}

const AIDE_PAR_PECHE: Record<SelectedSin, AideContenu> = {
  regard: {
    rappel: "Détourne le regard. C'est le premier rempart.",
    verset: {
      texte: "« Dis aux croyants de baisser leur regard et de préserver leur chasteté. »",
      ref: "Sourate An-Nour, 24-30",
    },
    tips: [
      "Ferme l'onglet ou l'écran tout de suite, sans réfléchir.",
      "Lève-toi et change de pièce.",
      "Fais tes ablutions, même partielles.",
      "Répète « Astaghfirullah » et « La hawla wa la quwwata illa billah ».",
      "Appelle quelqu'un ou envoie un message à un proche de confiance.",
      "Sors marcher 5 minutes, même autour du pâté de maisons.",
    ],
  },
  porno: {
    rappel: "Chaque minute où tu résistes compte.",
    verset: {
      texte: "« Et ceux qui préservent leur chasteté… Allah les récompensera au-delà de ce qu'ils ont œuvré. »",
      ref: "Sourate An-Nour, 24-33",
    },
    tips: [
      "Ferme tout et range ton téléphone dans une autre pièce.",
      "Fais tes ablutions et prie 2 raka'at si tu peux.",
      "Douche froide ou eau froide sur le visage et les avant-bras.",
      "Sors dehors : marche, course, vélo.",
      "Écoute du dhikr ou une lecture islamique.",
      "Rappelle-toi pourquoi tu as arrêté : écris une phrase sur ton téléphone.",
    ],
  },
  priere: {
    rappel: "La prochaine prière est une nouvelle chance.",
    verset: {
      texte: "« Récite ce qui t'est révélé du Livre et accomplis la prière. La prière préserve de la turpitude et du blâmable. »",
      ref: "Sourate Al-Ankabout, 29-45",
    },
    tips: [
      "Fais la prière tout de suite, même en retard : n'attends pas la suivante.",
      "Prépare l'eau des ablutions maintenant.",
      "Mets une alarme pour la prochaine prière.",
      "Écoute l’adhan ou une sourate courte pour te recentrer.",
      "Place un rappel visible (post-it, écran) : « La prière d'abord ».",
    ],
  },
  colere: {
    rappel: "Se taire et se retirer, c'est déjà gagner.",
    verset: {
      texte: "« Ceux qui dépensent dans l'aisance et dans l'adversité, qui dominent leur colère et pardonnent aux gens. »",
      ref: "Sourate Ali 'Imran, 3-134",
    },
    tips: [
      "Fais wudhu : le Prophète a dit que la colère vient du chaytan, et le chaytan est de feu ; l'eau l'éteint.",
      "Assieds-toi si tu es debout, allonge-toi si tu es assis.",
      "Garde le silence : ne réponds pas tout de suite.",
      "Sors de la pièce quelques minutes.",
      "Répète « A'udhu billahi min ach-chaytan ar-rajim ».",
    ],
  },
  musique: {
    rappel: "Remplace par du dhikr ou une lecture du Coran.",
    verset: {
      texte: "« Et lorsqu'ils entendent ce qui a été descendu sur le Messager, tu vois leurs yeux déborder de larmes. »",
      ref: "Sourate Al-Maidah, 5-83",
    },
    tips: [
      "Coupe la musique tout de suite. Ne finis pas la chanson.",
      "Mets du Coran, du dhikr ou une conférence islamique.",
      "Sors marcher sans écouteurs.",
      "Appelle quelqu'un pour parler.",
      "Écris ce que tu ressens : souvent l'envie de musique vient de l'ennui ou du vide.",
    ],
  },
  jeux: {
    rappel: "Pose le téléphone. Le jeu peut attendre.",
    verset: {
      texte: "« Ceux qui, debout, assis, couchés, invoquent Allah et méditent sur la création des cieux et de la terre. »",
      ref: "Sourate Ali 'Imran, 3-191",
    },
    tips: [
      "Pose le téléphone dans une autre pièce, écran vers le bas.",
      "Active le mode « Ne pas déranger » ou « Concentration ».",
      "Fais une tâche courte (vaisselle, rangement, 10 min de marche).",
      "Remplace par une activité manuelle : lecture, dessin, sport.",
      "Rappelle-toi l'objectif du jour : une action du plan StopHaram.",
    ],
  },
  mensonge: {
    rappel: "La vérité libère. Un seul mot suffit pour rectifier.",
    verset: {
      texte: "« Ô vous qui avez cru, craignez Allah et soyez avec les véridiques. »",
      ref: "Sourate At-Tawbah, 9-119",
    },
    tips: [
      "Arrête-toi. Ne complique pas le mensonge par un autre.",
      "Respire. Dis « Je me suis trompé » ou « En fait, la vérité c’est… ».",
      "Répète « Astaghfirullah » et fais une intention ferme de ne plus mentir là-dessus.",
      "Si tu as menti à quelqu'un, corrige dès que possible, même par message.",
    ],
  },
  drogue: {
    rappel: "Chaque heure sans est une victoire. Tu peux tenir encore un peu.",
    verset: {
      texte: "« Et ne vous jetez pas par vos propres mains dans la perdition. »",
      ref: "Sourate Al-Baqarah, 2-195",
    },
    tips: [
      "Éloigne-toi des lieux et des personnes associés à la consommation.",
      "Appelle quelqu'un de confiance tout de suite : ami, famille, groupe de soutien.",
      "Sors marcher ou fais du sport pour évacuer la tension.",
      "Rappelle-toi les conséquences que tu as vécues et celles que tu veux éviter.",
      "Fais tes prières et invoque Allah : « Allahumma inni a'udhu bika min al-hammi wal-huzn ».",
    ],
  },
  alcool: {
    rappel: "Un verre de moins, c'est déjà gagner.",
    verset: {
      texte: "« Le vin, les jeux de hasard, les pierres dressées et les flèches divinatoires sont une abomination, œuvre du diable. »",
      ref: "Sourate Al-Maidah, 5-90",
    },
    tips: [
      "Quitte le lieu (bar, soirée) tout de suite si tu sens la tentation.",
      "Appelle un proche ou un groupe de soutien.",
      "Rappelle-toi les dégâts passés : santé, famille, dignité.",
      "Remplace par une boisson sans alcool que tu aimes (jus, eau gazeuse, thé).",
      "Fais wudhu et prie, même 2 raka'at.",
    ],
  },
  autre: {
    rappel: "Allah sait ce que tu vis. Chaque effort compte.",
    verset: {
      texte: "« Et quiconque craint Allah, Il lui donnera une issue et lui accordera des dons par des moyens sur lesquels il ne comptait pas. »",
      ref: "Sourate At-Talaq, 65-2",
    },
    tips: [
      "Fais tes ablutions si tu peux.",
      "Change de pièce ou sors marcher.",
      "Répète « Astaghfirullah » jusqu'à ce que ça passe.",
      "Rappelle-toi pourquoi tu as commencé.",
      "Appelle ou écris à quelqu'un de confiance.",
    ],
  },
};

export function getAideForSin(sin: SelectedSin): AideContenu {
  return AIDE_PAR_PECHE[sin] ?? AIDE_PAR_PECHE.autre;
}
