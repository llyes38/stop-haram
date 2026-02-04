/**
 * Invocations du matin — structure inspirée de Hisnii (phonétique, arabe, référence, audio).
 * Pour l'audio : option 1) ajouter une URL MP3 dans audioUrl (hébergement propre ou source autorisée) ;
 * option 2) lien vers Hisnii pour écouter en ligne : https://hisnii.com/invocations-matin/
 */

export type DhikrItem = {
  id: string;
  title: string;
  arabic?: string;
  french: string;
  /** Transcription phonétique (ex. Bi-smi-llâhi-lladhî lâ yadurru…) */
  phonetic?: string;
  repeat?: number;
  source: string;
  /** Référence hadith / livre (ex. Sahîh Al-Bukhârî, Sourate Al-Baqarah 2:255) */
  reference?: string;
  /** Court texte sur le mérite (optionnel) */
  merit?: string;
  /** URL d'un fichier audio MP3 (si hébergé ou source autorisée). Sinon, proposer le lien Hisnii. */
  audioUrl?: string;
};

/** Lien externe pour écouter les invocations avec audio (phonétique + récitation). */
export const INVOCATIONS_MATIN_AUDIO_SOURCE = "https://hisnii.com/invocations-matin/";

export const dhikrMatin: DhikrItem[] = [
  {
    id: "ayat-kursi",
    title: "Âyatu-l-Kursî",
    arabic: "اللهُ لاَ إِلَهَ إِلاَّ هُوَ الحَيُّ القَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَ لاَ نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَ مَا فِي الأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَ مَا خَلْفَهُمْ وَ لاَ يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلاَّ بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَ الأَرْضَ وَ لاَ يَئُودُهُ حِفْظُهُمَا وَ هُوَ العَلَيُّ العَظِيمُ",
    french: "Allah ! Point de divinité à part Lui, le Vivant, Celui qui n'a besoin de rien et dont toute chose dépend (al-Qayyûm). Ni somnolence ni sommeil ne Le saisissent. À Lui appartient tout ce qui est dans les cieux et sur la Terre. Qui peut intercéder auprès de Lui sans Sa permission ? Il connaît leur passé et leur futur. Et, de Sa science, ils n'embrassent que ce qu'Il veut. Son Kursî déborde les cieux et la Terre et leur garde ne Lui coûte aucune peine. Et Il est le Très Haut, l'Immense.",
    source: "Sourate Al-Baqarah, verset 255",
    reference: "Sahîh Al-Kalim At-Tayyib n° 22",
    merit: "Celui qui le récite au matin sera protégé jusqu'au soir, et au soir jusqu'au matin.",
  },
  {
    id: "trois-sourates",
    title: "Les trois dernières sourates (Al-Ikhlâs, Al-Falaq, An-Nâs)",
    arabic: "قُلْ هُوَ اللهُ أَحَدٌ ۞ اللهُ الصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ — ثم الفلق ثم الناس",
    french: "Réciter Al-Ikhlâs (112), Al-Falaq (113), An-Nâs (114). Chacune 3 fois. Celui qui les récite au matin et au soir, elles lui suffiront contre tout mal.",
    repeat: 3,
    source: "Sourates 112, 113, 114",
    reference: "Sahîh At-Tirmidhî n° 3575",
  },
  {
    id: "bismillah-protection",
    title: "Au nom d'Allah (protection)",
    arabic: "بِسْمِ اللهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَ لاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ العَلِيمُ",
    french: "Au nom d'Allah, tel qu'en compagnie de Son Nom rien sur Terre ni au ciel ne peut nuire, Lui l'Audient, l'Omniscient.",
    phonetic: "Bi-smi-llâhi-lladhî lâ yadurru ma'a-smihi shay'un fi-l-ardi wa lâ fi-s-samâi wa huwa-s-Samî'-ul-'Alîm.",
    repeat: 3,
    source: "Invocation",
    reference: "Sahîh At-Tirmidhî n° 3388",
    merit: "Celui qui la récite le matin, rien ne lui nuira jusqu'au soir ; le soir, rien ne lui nuira jusqu'au matin.",
  },
  {
    id: "allahumma-bika-asbahna",
    title: "Ô Allah, c'est par Toi que nous nous retrouvons au matin",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَ بِكَ أَمْسَيْنَا، وَ بِكَ نَحْيَا وَ بِكَ نَمُوتُ وَ إِلَيْكَ النُّشُورُ",
    french: "Ô Allah ! C'est par Toi que nous nous retrouvons au matin et c'est par Toi que nous nous retrouvons au soir. C'est par Toi que nous vivons et c'est par Toi que nous mourons et c'est vers Toi que se fera la Résurrection.",
    phonetic: "Allâhumma bika asbahnâ, wa bika amsaynâ, wa bika nahyâ, wa bika namût, wa ilayka-n-nushûr.",
    source: "Invocation",
    reference: "As-Sahîhah n° 262",
  },
  {
    id: "asbahna-wa-asbaha-l-mulk",
    title: "Nous voilà au matin et le règne appartient à Allah",
    arabic: "أَصْبَحْنَا وَ أَصْبَحَ المُلْكُ للهِ وَ الحَمْدُ للهِ ، لاَ إلَهَ إلاَّ اللهُ وَحدَهُ لاَشَرِيكَ لَهُ، لَهُ المُلْكُ وَ لَهُ الحَمْدُ، وَ هُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا اليَوْمِ وَ خَيْرَ مَا بَعْدَهُ، وَ أَعُوذُ بِكَ مِنْ شَرِّ هَذَا اليَوْمِ وَ شَرِّ مَا بَعْدَهُ",
    french: "Nous voilà au matin et le règne appartient à Allah. Louange à Allah. Il n'y a aucune divinité [digne d'être adorée] en dehors d'Allah, Seul, sans associé. À Lui la royauté, à Lui la louange et Il est capable de toute chose. Seigneur ! Je Te demande le bien de ce jour et le bien qui vient après. Et je cherche refuge auprès de Toi contre le mal de ce jour et le mal qui vient après.",
    phonetic: "Asbahnâ wa asbaha-l-mulku li-llâhi wa-l-hamduli-llâh. Lâ ilâha illâ llâhu wahdahu lâ sharîka lah, lahu-l-mulku wa lahu-l-hamdu wa huwa 'alâ kulli shayin Qadîr. Rabbi, asaluka khayra mâ fî hâdha-l-yawmi wa khayra mâ ba'dah. Wa a'ûdhu bika min sharri mâ fî hâdha-l-yawmi wa sharri mâ ba'dah.",
    source: "Invocation",
    reference: "Sahîh Muslim n° 2723",
  },
  {
    id: "allahumma-anta-rabbi",
    title: "Ô Allah, Tu es mon Seigneur (demande de pardon)",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَ أَنَا عَبْدُكَ، وَ أَنَا عَلَى عَهْدِكَ وَ وَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَ أَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ",
    french: "Ô Allah ! Tu es mon Seigneur. Il n'y a aucune divinité en dehors de Toi. Tu m'as créé et je suis Ton serviteur. Je me conforme autant que je peux à mon engagement et à ma promesse vis-à-vis de Toi. Je cherche refuge auprès de Toi contre le mal que j'ai commis. Je reconnais Ton bienfait à mon égard et je reconnais mon péché. Pardonne-moi donc, en effet nul autre que Toi ne pardonne les péchés.",
    phonetic: "Allâhumma anta Rabbî, lâ ilâha illâ ant. Khalaqtanî wa ana 'abduk, wa ana 'alâ 'ahdika wa wa'dika mâ stata't. A'ûdhu bika min sharri mâ sana't. Abûu laka bi-ni'matika 'alayya wa abûu bi-dhanbî fa-ghfir lî, fa-innahu lâ yaghfiru-dh-dhunûba illâ ant.",
    source: "Invocation",
    reference: "Sahîh Al-Bukhârî n° 5947",
    merit: "Le Prophète (saws) a dit que ceci est la demande de pardon par excellence.",
  },
  {
    id: "la-ilaha-illa-llah-wahdahu",
    title: "Il n'y a de divinité qu'Allah, Seul, sans associé",
    arabic: "لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَشَرِيكَ لَهُ، لَهُ المُلْكُ وَ لَهُ الحَمْدُ، وَ هُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    french: "Il n'y a aucune divinité [digne d'être adorée] en dehors d'Allah, Seul, sans associé. À Lui la royauté, à Lui la louange et Il est capable de toute chose.",
    phonetic: "Lâ ilâha illa-llâhu wahdahu lâ sharîka lah. Lahu-l-mulku wa lahu-l-hamdu, wa huwa 'alâ kulli shayin Qadîr.",
    source: "Invocation",
    reference: "Sahîh Abû Dâwûd n° 5077",
    merit: "Celui qui la prononce au matin aura la récompense de l'affranchissement d'un esclave, dix bonnes actions, dix péchés effacés, et sera protégé contre le diable jusqu'au soir.",
  },
  {
    id: "allahumma-inni-asaluka-ilman",
    title: "Ô Allah, je Te demande un savoir utile",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْماً نَافِعاً، وَ رِزْقاً طَيِّباً، وَ عَمَلاً مُتَقَبَّلاً",
    french: "Ô Allah ! Je Te demande [de m'accorder] un savoir utile, une subsistance licite et des œuvres que Tu agrées.",
    phonetic: "Allâhumma innî asaluka 'ilman nâfi'â, wa rizqan tayyibâ, wa 'amalan mutaqabbalâ.",
    source: "Invocation",
    reference: "Sahîh Ibn Mâjah n° 925",
  },
  {
    id: "raditu-billahi",
    title: "J'agrée Allah comme Seigneur",
    arabic: "رَضِيتُ بِاللهِ رَبّاً وَ بِالإِسْلاَمِ دِيناً وَ بِمُحَمَّدٍ نَبِيّاً",
    french: "J'agrée Allah comme Seigneur, l'Islam comme religion et Muhammad comme prophète.",
    phonetic: "Radîtu bi-llâhi rabban wa bi-l-islâmi dînan wa bi-Muhammadin nabiyyâ.",
    source: "Invocation",
    reference: "As-Sahîhah n° 334",
    merit: "Celui qui récite cette invocation aura droit au Paradis.",
  },
  {
    id: "istighfar",
    title: "Istighfâr",
    arabic: "أَسْتَغْفِرُ اللهَ",
    french: "Je demande pardon à Allah.",
    phonetic: "Astaghfiru-llâh.",
    repeat: 100,
    source: "Dhikr",
    reference: "Sahîh At-Targhîb wa-t-Tarhîb n° 658",
    merit: "Le Prophète (saws) disait : Pas une matinée ne passe sans que je ne demande pardon à Allah cent fois.",
  },
  {
    id: "tasbih",
    title: "SubhanAllah, Alhamdulillah, Allahu Akbar",
    arabic: "سُبْحَانَ ٱللَّٰهِ — ٱلْحَمْدُ لِلَّٰهِ — ٱللَّٰهُ أَكْبَرُ — لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَشَرِيكَ لَهُ",
    french: "SubhanAllah (33), Alhamdulillah (33), Allahu Akbar (33), puis La ilaha illa Allah wahdahu la sharika lah (34).",
    repeat: 100,
    source: "Dhikr après prière",
    reference: "Sahîh Muslim, dhikr du matin",
  },
  {
    id: "hasbunallah",
    title: "HasbiAllahu…",
    arabic: "حَسْبِيَ ٱللَّٰهُ لَا إِلَٰهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ، وَهُوَ رَبُّ ٱلْعَرْشِ ٱلْعَظِيمِ",
    french: "HasbiAllahu la ilaha illa Huwa, 'alayhi tawakkaltu, wa Huwa Rabbul-'Arshil-'Azim. (7 fois)",
    phonetic: "Hasbiyallâhu lâ ilâha illâ Huwa, 'alayhi tawakkaltu, wa Huwa Rabbul-'Arshil-'Azîm.",
    repeat: 7,
    source: "Sourate At-Tawbah 9:129",
  },
];
