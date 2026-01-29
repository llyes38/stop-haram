import type { SelectedSin } from "./storage";

export interface QuizQuestion {
  id: string;
  sin: SelectedSin;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation?: string;
}

/** Pool de questions par péché : islam + mental. Au moins 2 par sin pour pouvoir tirer 10 questions. */
const QUESTIONS_BY_SIN: Record<SelectedSin, QuizQuestion[]> = {
  porno: [
    {
      id: "porno-1",
      sin: "porno",
      question: "Que dit l'Islam sur la préservation du regard ?",
      choices: [
        "Le regard est permis tant qu'on ne passe pas à l'acte.",
        "Le premier regard est pardonné, le second est un péché.",
        "Seules les femmes doivent baisser le regard.",
      ],
      correctIndex: 1,
      explanation: "Le Prophète (ﷺ) a dit : « Le premier regard est pour toi, le second est contre toi. »",
    },
    {
      id: "porno-2",
      sin: "porno",
      question: "Quel effet la dopamine a-t-elle sur le cerveau face à ce type de contenu ?",
      choices: [
        "Elle diminue avec le temps et on s'en lasse.",
        "Elle crée une accoutumance et on en veut toujours plus.",
        "Elle n'a aucun effet à long terme.",
      ],
      correctIndex: 1,
      explanation: "Le cerveau s'habitue et demande des stimuli plus forts. S'en éloigner permet de retrouver l'équilibre.",
    },
    {
      id: "porno-3",
      sin: "porno",
      question: "Quelle invocation peut aider à se préserver ?",
      choices: [
        "« Allah suffit, Il est le meilleur garant. »",
        "« Louange à Allah en toute circonstance. »",
        "Les deux sont des rappels forts.",
      ],
      correctIndex: 2,
      explanation: "Les deux formules renforcent le cœur et la confiance en Allah.",
    },
  ],
  musique: [
    {
      id: "musique-1",
      sin: "musique",
      question: "Pourquoi beaucoup de savants déconseillent la musique ?",
      choices: [
        "Parce qu'elle est toujours haram sans exception.",
        "Elle peut détourner le cœur du dhikr et des paroles bénéfiques.",
        "Seule la musique instrumentale est concernée.",
      ],
      correctIndex: 1,
      explanation: "Elle occupe le cœur et le temps. La remplacer par du Coran ou des nasheeds permis renforce la foi.",
    },
    {
      id: "musique-2",
      sin: "musique",
      question: "Quel bienfait mental à remplacer la musique par du Coran ?",
      choices: [
        "Aucun, c'est juste une règle religieuse.",
        "Le Coran apaise le cœur et apporte une sérénité durable.",
        "Le Coran est plus ennuyeux que la musique.",
      ],
      correctIndex: 1,
      explanation: "Allah dit : « Ce sont ceux qui ont cru et dont les cœurs se tranquillisent au rappel d'Allah. » (Ar-Ra'd)",
    },
  ],
  priere: [
    {
      id: "priere-1",
      sin: "priere",
      question: "Que dit le Prophète (ﷺ) sur la prière et les péchés ?",
      choices: [
        "La prière efface tous les péchés sans effort.",
        "Entre cinq prières, Allah efface les péchés si on évite les grands péchés.",
        "La prière n'a pas de lien avec les péchés.",
      ],
      correctIndex: 1,
      explanation: "Comme les cinq prières lavent les impuretés, les péchés sont expiés entre elles.",
    },
    {
      id: "priere-2",
      sin: "priere",
      question: "Pourquoi fixer une heure précise pour la prière aide mentalement ?",
      choices: [
        "Cela n'a pas d'effet particulier.",
        "Cela structure la journée et renforce la discipline.",
        "C'est seulement pour obéir à l'Islam.",
      ],
      correctIndex: 1,
      explanation: "La routine et la discipline aident le cerveau à ancrer les bonnes habitudes.",
    },
    {
      id: "priere-3",
      sin: "priere",
      question: "Quel est le premier acte sur lequel on sera jugé ?",
      choices: [
        "Le jeûne.",
        "La prière.",
        "L'aumône.",
      ],
      correctIndex: 1,
      explanation: "La prière est le pilier central : si elle est acceptée, le reste suit.",
    },
  ],
  colere: [
    {
      id: "colere-1",
      sin: "colere",
      question: "Que conseille le Prophète (ﷺ) quand on est en colère ?",
      choices: [
        "Crier pour évacuer.",
        "S'asseoir si on est debout, ou se taire, ou faire le wudu.",
        "Se venger pour se calmer.",
      ],
      correctIndex: 1,
      explanation: "Changer de position et se rafraîchir (wudu) coupe la montée de la colère.",
    },
    {
      id: "colere-2",
      sin: "colere",
      question: "Quelle phrase peut-on dire pour se maîtriser ?",
      choices: [
        "« Je suis plus fort que ça. »",
        "« Je cherche refuge auprès d'Allah contre Satan le lapidé. » (A'udhu billahi minash-shaytanir-rajim)",
        "« La colère est une force. »",
      ],
      correctIndex: 1,
      explanation: "L'istighfar et la recherche de refuge auprès d'Allah apaisent le cœur.",
    },
  ],
  drogue: [
    {
      id: "drogue-1",
      sin: "drogue",
      question: "Pourquoi l'Islam interdit-il les substances intoxicantes ?",
      choices: [
        "Seulement pour la santé physique.",
        "Elles voilent la raison, qui est un don d'Allah pour distinguer le bien du mal.",
        "Seule l'alcool est interdite.",
      ],
      correctIndex: 1,
      explanation: "La raison doit rester claire pour adorer Allah et faire les bons choix.",
    },
    {
      id: "drogue-2",
      sin: "drogue",
      question: "Quel principe mental aide à tenir bon ?",
      choices: [
        "Penser qu'un seul écart ne compte pas.",
        "Un jour à la fois : aujourd'hui je reste sobre.",
        "Éviter toute aide extérieure.",
      ],
      correctIndex: 1,
      explanation: "Se concentrer sur « aujourd'hui » réduit l'angoisse et renforce la volonté.",
    },
  ],
  alcool: [
    {
      id: "alcool-1",
      sin: "alcool",
      question: "Que dit le Coran sur l'alcool et les jeux de hasard ?",
      choices: [
        "Ils sont permis avec modération.",
        "Il y a un grand mal en eux et un bien, mais le mal est plus grand.",
        "Seul l'alcool est interdit.",
      ],
      correctIndex: 1,
      explanation: "Allah nous avertit du mal qu'ils causent à l'âme et à la société.",
    },
    {
      id: "alcool-2",
      sin: "alcool",
      question: "Quelle attitude renforce l'arrêt ?",
      choices: [
        "Garder de l'alcool chez soi « au cas où ».",
        "Éviter les situations à risque et s'entourer de soutien.",
        "Ne jamais en parler à personne.",
      ],
      correctIndex: 1,
      explanation: "L'environnement et le soutien sont essentiels pour tenir sur la durée.",
    },
  ],
  jeux: [
    {
      id: "jeux-1",
      sin: "jeux",
      question: "Comment l'Islam voit-il le temps passé sur les écrans ?",
      choices: [
        "Tout écran est interdit.",
        "Le temps est une responsabilité : on sera interrogé sur comment on l'a utilisé.",
        "Seuls les jeux vidéo sont concernés.",
      ],
      correctIndex: 1,
      explanation: "Le Prophète (ﷺ) a dit : « Deux bienfaits dont beaucoup de gens sont dupes : la santé et le temps libre. »",
    },
    {
      id: "jeux-2",
      sin: "jeux",
      question: "Quel truc mental pour réduire le temps d'écran ?",
      choices: [
        "Supprimer tout d'un coup sans préparation.",
        "Fixer des créneaux sans écran (ex. 1h après le réveil) et les respecter.",
        "Jouer seulement la nuit.",
      ],
      correctIndex: 1,
      explanation: "Des règles claires et progressives aident le cerveau à changer d'habitude.",
    },
  ],
  mensonge: [
    {
      id: "mensonge-1",
      sin: "mensonge",
      question: "Que dit le Prophète (ﷺ) sur la sincérité ?",
      choices: [
        "Le mensonge est permis pour éviter un conflit.",
        "La sincérité mène au bien, le bien mène au Paradis.",
        "Seuls les grands mensonges sont interdits.",
      ],
      correctIndex: 1,
      explanation: "La sidq (sincérité) est une clé du cœur et de la confiance en Allah.",
    },
    {
      id: "mensonge-2",
      sin: "mensonge",
      question: "Pourquoi le mensonge fatigue mentalement ?",
      choices: [
        "Il ne fatigue pas.",
        "On doit garder en tête plusieurs « versions » et on perd la paix intérieure.",
        "Seule la personne à qui on ment souffre.",
      ],
      correctIndex: 1,
      explanation: "Vivre en vérité allège le cœur et renforce l'estime de soi.",
    },
  ],
  regard: [
    {
      id: "regard-1",
      sin: "regard",
      question: "Quel ordre Allah donne-t-Il aux croyants et aux croyantes ?",
      choices: [
        "Seuls les hommes doivent baisser le regard.",
        "« Dis aux croyants de baisser leur regard et de préserver leur chasteté » (et aux croyantes pareil).",
        "Le regard n'est pas mentionné dans le Coran.",
      ],
      correctIndex: 1,
      explanation: "Sourate An-Nur : préserver le regard protège le cœur et la pudeur.",
    },
    {
      id: "regard-2",
      sin: "regard",
      question: "Quel bienfait à détourner le regard ?",
      choices: [
        "Aucun, c'est juste une règle.",
        "On préserve son cœur et on évite la spirale des pensées.",
        "C'est plus difficile que de regarder.",
      ],
      correctIndex: 1,
      explanation: "Chaque regard évité renforce la maîtrise de soi et la sérénité.",
    },
  ],
  autre: [
    {
      id: "autre-1",
      sin: "autre",
      question: "Que dit l'Islam sur le repentir ?",
      choices: [
        "Allah ne pardonne pas après un certain nombre de rechutes.",
        "Allah aime celui qui se repent, même s'il rechute et se repent cent fois par jour.",
        "Le repentir doit être fait une seule fois dans la vie.",
      ],
      correctIndex: 1,
      explanation: "Ne jamais désespérer de la miséricorde d'Allah. Le repentir sincère efface les péchés.",
    },
    {
      id: "autre-2",
      sin: "autre",
      question: "Qu'est-ce qui renforce la volonté selon la sunna ?",
      choices: [
        "Éviter toute difficulté.",
        "Le jeûne : il discipline l'âme et renforce la patience.",
        "Seul le sport compte.",
      ],
      correctIndex: 1,
      explanation: "Le Prophète (ﷺ) a recommandé le jeûne pour celui qui ne peut se marier, pour maîtriser ses désirs.",
    },
    {
      id: "autre-3",
      sin: "autre",
      question: "Quelle attitude avoir après une rechute ?",
      choices: [
        "Se considérer comme « fini » et abandonner.",
        "Se repentir, reprendre la prière et les bonnes habitudes, et continuer.",
        "Cacher la rechute à tout le monde et ne pas en parler.",
      ],
      correctIndex: 1,
      explanation: "La rechute ne supprime pas la valeur du chemin. Reprendre montre à Allah notre sincérité.",
    },
  ],
};

/** Retourne les questions pour un ou plusieurs péchés (pour mélanger). */
export function getQuestionsForSins(sins: SelectedSin[]): QuizQuestion[] {
  const pool: QuizQuestion[] = [];
  const sinList = sins.length > 0 ? sins : (["autre"] as SelectedSin[]);
  for (const sin of sinList) {
    const list = QUESTIONS_BY_SIN[sin];
    if (list) pool.push(...list);
  }
  if (pool.length === 0) pool.push(...QUESTIONS_BY_SIN.autre);
  return pool;
}

/** Mélange un tableau (Fisher-Yates). */
function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Tire 10 questions pour le quiz, basées sur les péchés choisis par l'utilisateur. */
export function pickQuizQuestions(selectedSins: SelectedSin[]): QuizQuestion[] {
  const pool = getQuestionsForSins(selectedSins);
  const shuffled = shuffle(pool);
  return shuffled.slice(0, 10);
}
