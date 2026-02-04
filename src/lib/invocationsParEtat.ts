/**
 * Invocations selon l'état de l'utilisateur (stress, tristesse, tentation, etc.).
 * Utilisé par la page /checkin : l'user choisit comment il se sent → on affiche l'invocation adaptée.
 */

export type EtatCheckin =
  | "bien"
  | "stresse"
  | "triste"
  | "tentation"
  | "anxieux"
  | "fatigue";

export interface InvocationPourEtat {
  label: string;
  shortText: string;
  fullText: string;
  arabic?: string;
  reference?: string;
}

const INVOCATIONS: Record<EtatCheckin, InvocationPourEtat> = {
  bien: {
    label: "Je vais bien",
    shortText: "Al-hamdu li-llâh.",
    fullText: "Louange à Allah. Al-hamdu li-llâh.",
    arabic: "الحَمْدُ للهِ",
    reference: "Dhikr de remerciement.",
  },
  stresse: {
    label: "Stressé",
    shortText: "Hasbuna-llâhu wa ni'mal wakîl.",
    fullText: "Allah nous suffit, Il est le meilleur des garants. « Et quiconque place sa confiance en Allah, Il lui suffit. » (At-Talaq, 65-3)",
    arabic: "حَسْبُنَا اللهُ وَ نِعْمَ الوَكِيلُ",
    reference: "Sourate Âl 'Imrân, 3-173 ; At-Talaq, 65-3.",
  },
  triste: {
    label: "Triste",
    shortText: "Lâ hawla wa lâ quwwata illâ bi-llâh.",
    fullText: "Il n'y a de force ni de puissance qu'en Allah. « N'est-ce pas par l'évocation d'Allah que s'apaisent les cœurs ? » (Ar-Ra'd, 13-28)",
    arabic: "لاَ حَوْلَ وَ لاَ قُوَّةَ إِلاَّ بِاللهِ",
    reference: "Ar-Ra'd, 13-28.",
  },
  tentation: {
    label: "Tentation",
    shortText: "A'ûdhu bi-llâhi mina-sh-shaytâni-r-rajîm.",
    fullText: "Je cherche refuge auprès d'Allah contre Satan le lapidé. Puis récite Âyatu-l-Kursî (2:255) et les sourates Al-Falaq et An-Nâs. « Celui qui récite Âyatu-l-Kursî ne sera pas approché par un démon jusqu'au matin. »",
    arabic: "أَعُوذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
    reference: "Sahîh Al-Bukhârî.",
  },
  anxieux: {
    label: "Anxieux",
    shortText: "Allâhumma innî a'ûdhu bika mina-l-hammi wa-l-huzn.",
    fullText: "Ô Allah, je cherche refuge auprès de Toi contre le souci et la tristesse. Le Prophète (saws) enseignait cette invocation pour l'angoisse.",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الهَمِّ وَ الحُزْنِ",
    reference: "Sahîh Al-Bukhârî.",
  },
  fatigue: {
    label: "Fatigué",
    shortText: "Allâhumma lâ sahla illâ mâ ja'altahu sahlan.",
    fullText: "Ô Allah, il n'y a de facilité que celle que Tu as rendue facile. « Certes, avec la difficulté il y a une facilité. » (Ash-Sharh, 94-6)",
    arabic: "اللَّهُمَّ لاَ سَهْلَ إِلاَّ مَا جَعَلْتَهُ سَهْلاً",
    reference: "Ash-Sharh, 94-5/6.",
  },
};

export const ETATS_CHECKIN: { id: EtatCheckin; label: string; emoji: string }[] = [
  { id: "bien", label: "Je vais bien", emoji: "😊" },
  { id: "stresse", label: "Stressé", emoji: "😤" },
  { id: "anxieux", label: "Anxieux", emoji: "😰" },
  { id: "triste", label: "Triste", emoji: "😢" },
  { id: "tentation", label: "Tentation", emoji: "🛡️" },
  { id: "fatigue", label: "Fatigué", emoji: "😴" },
];

export function getInvocationPourEtat(etat: EtatCheckin): InvocationPourEtat {
  return INVOCATIONS[etat] ?? INVOCATIONS.bien;
}
