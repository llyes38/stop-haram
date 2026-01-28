import type { SelectedSin, StopHaramUser, PlanDay } from "./storage";

const FOCUS_ACTIONS: Record<SelectedSin, Array<{ title: string; desc: string }>> = {
  porno: [
    { title: "Éviter les déclencheurs", desc: "Identifie et évite un lieu ou une situation à risque aujourd'hui." },
    { title: "Rappel du pourquoi", desc: "Écris une phrase sur ce que tu veux protéger (foi, estime, paix)." },
    { title: "Couper les accès", desc: "Désactive ou limite un accès (réseaux, appareil) pendant 1h." },
    { title: "Respiration avant l'acte", desc: "Si tentation: 4 temps inspire, 4 retiens, 4 expire. Répète 3 fois." },
    { title: "Sortir de la pièce", desc: "Dès la première pensée, quitte la pièce et fais 2 min d'autre chose." },
    { title: "Dhikr court", desc: "Répète « Astaghfirullah » 10 fois quand la pensée vient." },
  ],
  musique: [
    { title: "Jour sans musique", desc: "Passe la journée sans écouter de musique." },
    { title: "Remplacer par Coran/nasheed", desc: "Écoute 10 min de Coran ou nasheed halal à la place." },
    { title: "Pause écoute", desc: "Désactive les suggestions musicales sur une app aujourd'hui." },
    { title: "Intentions", desc: "Écris pourquoi tu veux réduire la musique dans ta vie." },
    { title: "Alternative", desc: "Choisis une activité (marche, lecture) à la place de la musique." },
    { title: "Rappel", desc: "Rappelle-toi un bienfait de réduire les distractions sonores." },
  ],
  priere: [
    { title: "Une prière à l'heure", desc: "Fais au moins une prière à son heure aujourd'hui." },
    { title: "Réveil Fajr", desc: "Lève-toi pour Fajr (ou la prière la plus difficile pour toi)." },
    { title: "Préparer l'espace", desc: "Prépare ton tapis ou ton coin prière le matin." },
    { title: "Dhikr après prière", desc: "Reste 1 min après une prière pour du dhikr." },
    { title: "Repentir", desc: "Demande pardon à Allah pour une prière manquée récente." },
    { title: "Complice", desc: "Dis à une personne de te rappeler une prière aujourd'hui." },
  ],
  colere: [
    { title: "Pause avant de parler", desc: "Avant de répondre quand tu es énervé, compte jusqu'à 5." },
    { title: "Wudu", desc: "Fais les ablutions dès que tu sens la colère monter." },
    { title: "Changer de posture", desc: "Si debout, assieds-toi. Si assis, lève-toi et sors." },
    { title: "Rappel du hadith", desc: "« Le fort n'est pas celui qui vainc par la force… » Médite 1 min." },
    { title: "Écrire", desc: "Écris ce qui t'énerve au lieu de le dire (puis jette ou garde)." },
    { title: "Demander de l'aide", desc: "Dis « Allahumma inni a'udhu bika min hamazati chayatine » 3 fois." },
  ],
  drogue: [
    { title: "Jour clean", desc: "Un jour sans substance. Note comment tu te sens ce soir." },
    { title: "Éviter le lieu", desc: "Évite un lieu ou une personne déclencheur aujourd'hui." },
    { title: "Alternative saine", desc: "Remplace le moment à risque par sport ou marche 15 min." },
    { title: "Parler à quelqu'un", desc: "Envoie un message ou appelle une personne de confiance." },
    { title: "Rappel santé", desc: "Relis une raison (santé, foi, famille) pour laquelle tu arrêtes." },
    { title: "Dua", desc: "« Allahumma a'inni ala dhikrika wa chukrika wa husni 'ibadatika »." },
  ],
  alcool: [
    { title: "Refuser un verre", desc: "Si proposé, refuse une fois en disant non merci." },
    { title: "Soirée sans alcool", desc: "Choisis une soirée ou un repas sans alcool." },
    { title: "Remplacer", desc: "Bois eau ou boisson sans alcool dans un contexte social." },
    { title: "Rappel des dégâts", desc: "Écris une conséquence négative vécue (santé, honte, etc.)." },
    { title: "Dua", desc: "« Rabbi adkhilni mudkhala sidqin wa akhrijni mukhraja sidqin »." },
    { title: "Complice", desc: "Dis à une personne que tu ne bois pas aujourd'hui." },
  ],
  jeux: [
    { title: "Limite de temps", desc: "Fixe 30 min max de jeux (ou 0) et respecte." },
    { title: "Désinstaller une app", desc: "Désinstalle une app de jeu ou de scroll aujourd'hui." },
    { title: "Remplacer", desc: "À l'heure habituelle de jeu, fais 15 min de marche ou lecture." },
    { title: "Rappel", desc: "Note ce que tu pourrais faire de mieux avec ce temps." },
    { title: "Bloquer", desc: "Active le mode concentration ou bloque les jeux 2h." },
    { title: "Dua", desc: "« Allahumma naqqina min adh-dhunub… » Demande la purification du temps." },
  ],
  mensonge: [
    { title: "Un jour sans mensonge", desc: "Fais un effort conscient pour ne pas mentir aujourd'hui." },
    { title: "Corriger un mensonge", desc: "Si tu as menti récemment, corrige auprès de la personne." },
    { title: "Réfléchir avant de parler", desc: "Avant de répondre, pause 2 sec: est-ce vrai ?" },
    { title: "Hadith", desc: "« La vérité mène à la piété… » Relis ce hadith ce matin." },
    { title: "Petite vérité", desc: "Dis une vérité que tu cachais à quelqu'un (si approprié)." },
    { title: "Dua", desc: "« Allahumma ihdini li-ahsani al-akhlaq »." },
  ],
  regard: [
    { title: "Baisser le regard", desc: "Dès qu'une image ou une personne attire le regard, détourne." },
    { title: "Pas de scroll", desc: "Évite le scroll sur les réseaux ou les contenus visuels 1h." },
    { title: "Filtre", desc: "Active un filtre ou mode safe sur un appareil." },
    { title: "Rappel", desc: "« Le regard est une flèche empoisonnée » – médite 1 min." },
    { title: "Éviter le lieu", desc: "Évite un écran ou un lieu à risque aujourd'hui." },
    { title: "Dua", desc: "« Allahumma inna naj'aluka fi nuhurihim… » (protège nos regards)." },
  ],
  autre: [
    { title: "Identifier le déclencheur", desc: "Note un déclencheur de ta lutte aujourd'hui." },
    { title: "Une action de remplacement", desc: "Remplace l'habitude par une action positive (5 min)." },
    { title: "Rappel spirituel", desc: "Lis ou écoute 1 verset ou 1 hadith qui te parle." },
    { title: "Pardon", desc: "Demande pardon à Allah pour une chute récente." },
    { title: "Complice", desc: "Parle à quelqu'un de ton objectif du jour." },
    { title: "Dua", desc: "« Rabbi charrah li sadri wa yassir li amri »." },
  ],
};

const BASE_ACTIONS_PRIERE: Array<{ title: string; desc: string }> = [
  { title: "Prière à l'heure", desc: "Fais au moins une prière à son heure." },
  { title: "Dhikr matin", desc: "Répète « Subhanallah, Alhamdulillah, Allahu akbar » 10 fois." },
  { title: "Dua du matin", desc: "Récite une dua du réveil (ou « Bismillah » pour la journée)." },
  { title: "Prière sur le Prophète", desc: "Envoie 10 salawat sur le Prophète (saws)." },
  { title: "Court rappel", desc: "Lis ou écoute 1 min de Coran ou rappel." },
  { title: "Gratitude", desc: "Note 3 choses pour lesquelles tu es reconnaissant envers Allah." },
];

function getBaseActions(sin: SelectedSin): Array<{ title: string; desc: string }> {
  if (sin === "priere") return FOCUS_ACTIONS.priere;
  return BASE_ACTIONS_PRIERE;
}

function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length];
}

export function generatePlan(user: StopHaramUser): StopHaramUser["plan"] {
  const { selectedSins, scores } = user;
  const sins = selectedSins.length > 0 ? selectedSins : (["autre"] as SelectedSin[]);

  const withScores = sins
    .map((sin) => ({ sin, score: scores[sin] ?? 50 }))
    .sort((a, b) => b.score - a.score);

  const focusSin = withScores[0]?.sin ?? "autre";
  let baseSin: SelectedSin | undefined =
    sins.includes("priere") ? "priere" : withScores[1]?.sin ?? focusSin;
  if (baseSin === focusSin && withScores[1]) baseSin = withScores[1].sin;

  const focusActions = FOCUS_ACTIONS[focusSin] ?? FOCUS_ACTIONS.autre;
  const baseActions = getBaseActions(baseSin);
  const hasOptional = sins.length > 1;

  const days: PlanDay[] = [];
  for (let d = 1; d <= 28; d++) {
    const focus = pick(focusActions, d - 1);
    const base = pick(baseActions, d - 1);
    const optional =
      hasOptional && (d % 7 === 3 || d % 7 === 6)
        ? { title: "Action optionnelle", desc: "Choisis une action parmi tes objectifs secondaires." }
        : undefined;
    days.push({ day: d, focus, base, optional });
  }

  return {
    durationDays: 28,
    focusSin,
    baseSin,
    days,
  };
}
