import type { SelectedSin, StopHaramUser } from "./storage";

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
    rappel: "Chaque minute où tu préserves ta chasteté compte.",
    verset: {
      texte: "« Et ceux qui préservent leur chasteté… Allah les récompensera au-delà de ce qu'ils ont œuvré. »",
      ref: "Sourate An-Nour, 24-33",
    },
    tips: [
      "Quitte la situation immédiatement : sors de la pièce, change de lieu.",
      "Fais tes ablutions et prie 2 raka'at si tu peux.",
      "Évite d'être seul(e) avec la personne : va dans un lieu public ou appelle quelqu'un.",
      "Coupe la conversation ou les messages : ne prolonge pas l'échange.",
      "Écoute du dhikr ou une lecture islamique pour recentrer ton cœur.",
      "Rappelle-toi : le seul cadre permis est le mariage halal. Tout le reste est haram.",
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
  parents: {
    rappel: "Un mot doux, une obéissance : le Paradis est aux pieds des mères.",
    verset: {
      texte: "« Et ton Seigneur a décrété de n'adorer que Lui, et d'être bienfaisant envers les père et mère. Ne leur dis pas Ouf et ne les repousse pas ; dis-leur des paroles respectueuses. »",
      ref: "Sourate Al-Isra, 17-23-24",
    },
    tips: [
      "Arrête-toi. Ne réponds pas sur le ton de la colère.",
      "Respire. Dis « Désolé(e) » ou « Tu as raison » si tu viens de les contredire.",
      "Fais une chose qu'ils te demandent tout de suite, sans rouspéter.",
      "Récite « Astaghfirullah » et invoque pour eux : « Rabbi ghfir li wa li walidayya ».",
      "Rappelle-toi : après l'adoration d'Allah, la bienfaisance envers les parents est la meilleure œuvre.",
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

/** Rappel lié aux enfants du profil pour sensibiliser (je vais craquer). Retourne null si pas d'enfants. */
export function getRappelEnfant(sin: SelectedSin, user: StopHaramUser | null): string | null {
  if (!user?.profileInfo) return null;
  const filles = user.profileInfo.enfantsFilles ?? 0;
  const garcons = user.profileInfo.enfantsGarcons ?? 0;
  const total = filles + garcons;
  if (total <= 0) return null;

  const hasFille = filles > 0;
  const hasFils = garcons > 0;
  const enfant = total === 1 ? "ton enfant" : "tes enfants";
  const taFille = hasFille ? "ta fille" : null;
  const tonFils = hasFils ? "ton fils" : null;
  const filsOuFille = taFille && tonFils ? "ton fils ou ta fille" : taFille ?? tonFils ?? "ton enfant";

  const messages: Record<SelectedSin, string> = {
    porno: `Aimerais-tu qu'on fasse subir cela à ${filsOuFille} ? Protège ${enfant} en te protégeant.`,
    regard: `Aimerais-tu qu'on regarde ${taFille ?? "ton enfant"} ainsi ? Détourne le regard.`,
    colere: `Aimerais-tu qu'on élève la voix sur ${enfant} comme tu t'apprêtes à le faire ?`,
    drogue: `Aimerais-tu que ${filsOuFille} tombe dans la même chose ?`,
    alcool: `Aimerais-tu que ${filsOuFille} tombe dans la même chose ?`,
    jeux: `Aimerais-tu que ${enfant} perde son temps ainsi ?`,
    mensonge: `Aimerais-tu qu'on mente à ${enfant} ?`,
    priere: `Quel exemple pour ${enfant} si tu délaisses la prière ?`,
    musique: `Quel exemple pour ${enfant} ?`,
    parents: `Quel exemple pour ${enfant} si tu désobéis à tes propres parents ? Obéis pour qu'ils t'obéissent.`,
    autre: `Pense à ${enfant}. Quel exemple leur donnes-tu ?`,
  };

  return messages[sin] ?? messages.autre;
}

/** "ta conjointe" si homme, "ton conjoint" si femme (pour les rappels marié). */
function getConjointLabel(user: StopHaramUser): string {
  return user?.profileInfo?.genre === "homme" ? "ta conjointe" : "ton conjoint";
}

/** Rappel lié au fait d'être marié(e). Retourne null si pas marié. */
export function getRappelMarie(sin: SelectedSin, user: StopHaramUser | null): string | null {
  if (!user?.profileInfo || user.profileInfo.situation !== "marie") return null;

  const c = getConjointLabel(user);
  const present = user.profileInfo.genre === "homme" ? "sois présent" : "sois présente";
  const seul = user.profileInfo.genre === "homme" ? "seul" : "seule";

  const messages: Record<SelectedSin, string> = {
    porno: `Tu as fait une promesse à ${c} devant Allah. Reste fidèle — la fidélité protège ton foyer et ton nikah.`,
    regard: `${c.charAt(0).toUpperCase() + c.slice(1)} mérite ton regard et ta pudeur. Détourne-toi de ce qui n'est pas pour toi.`,
    colere: "Pense à ton couple. La colère brise ce qu'on a bâti. Le Prophète (saws) a dit : le meilleur d'entre vous est celui qui est meilleur envers sa famille.",
    drogue: `${c.charAt(0).toUpperCase() + c.slice(1)} et ta famille comptent sur toi. Tiens bon pour eux — tu es un pilier du foyer.`,
    alcool: `${c.charAt(0).toUpperCase() + c.slice(1)} et ta famille comptent sur toi. Un verre de moins, c'est les garder et honorer ton engagement.`,
    jeux: `${c.charAt(0).toUpperCase() + c.slice(1)} mérite ton temps et ta présence. Pose l'écran et ${present} — le mariage est une amana.`,
    mensonge: `La confiance de ${c} mérite la vérité. Ne la brise pas ; la sincérité fortifie le couple.`,
    priere: "Ton foyer a besoin de ta prière. Prie ensemble quand tu peux — la prière en couple bénit la maison.",
    musique: `Quel exemple pour ${c} ? Remplace par du dhikr ou du Coran et construisez un foyer pieux.`,
    parents: "Honorer tes parents honore ton foyer. Le Prophète (saws) a dit : le meilleur d'entre vous est celui qui est meilleur envers sa famille — et cela commence par les parents.",
    autre: `Pense à ${c}. Tu n'es pas ${seul} — tiens bon pour votre foyer et votre engagement devant Allah.`,
  };

  return messages[sin] ?? messages.autre;
}

/** Sous-rappel affiché sous le bloc marié (renforcement). */
export function getRappelMarieSousTexte(user: StopHaramUser | null): string {
  if (!user) return "Pense à ton foyer.";
  const c = getConjointLabel(user);
  return `Pense à ton foyer. ${c.charAt(0).toUpperCase() + c.slice(1)} compte sur toi.`;
}

/** Rappel lié au fait d'être converti(e). Retourne null si pas converti. */
export function getRappelConverti(sin: SelectedSin, user: StopHaramUser | null): string | null {
  if (!user?.profileInfo || user.profileInfo.converti !== "oui") return null;

  const messages: Record<SelectedSin, string> = {
    porno: "Allah t'a guidé jusqu'ici. Ne gâche pas ce don — la chasteté honore ton chahada et ton nouveau départ.",
    regard: "Tu as choisi l'Islam. Baisser le regard fait partie de ce que tu as accepté — c'est une protection pour toi.",
    colere: "Le Prophète (saws) a dit : « Le fort n'est pas celui qui terrasse, mais celui qui se maîtrise. » Tu as choisi cette voie.",
    drogue: "Allah t'a sorti des ténèbres. Ne reviens pas en arrière — tu es une preuve vivante de Sa miséricorde.",
    alcool: "Tu as quitté l'alcool pour Allah. Chaque heure sans est une victoire sur ton passé et une preuve de ta foi.",
    jeux: "Tu as choisi l'Islam. Ton temps a une valeur — ne le gaspille pas ; chaque instant peut être un acte d'adoration.",
    mensonge: "Tu as embrassé la vérité en embrassant l'Islam. Reste fidèle à la vérité — les convertis sont des phares.",
    priere: "La prière est le pilier de ta nouvelle vie. Ne le laisse pas tomber — elle est ton lien direct avec Allah.",
    musique: "Tu as choisi le Coran et le dhikr. Remplace la musique par ce qui t'a guidé vers la lumière.",
    parents: "L'Islam place le respect des parents juste après l'adoration d'Allah. Chaque geste de bienfaisance envers eux honore ton chahada.",
    autre: "Allah t'a guidé jusqu'ici. Chaque effort honore ton choix de converti. Tu peux tenir — Il ne t'abandonne pas.",
  };

  return messages[sin] ?? messages.autre;
}

/** Sous-rappel affiché sous le bloc converti (renforcement). */
export function getRappelConvertiSousTexte(): string {
  return "Allah t'a guidé jusqu'ici. Chaque effort compte.";
}
