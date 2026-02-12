import type { SelectedSin, StopHaramUser, PlanDay } from "./storage";
import { getLevelFromDay, getLevelDifficultyOffset } from "./defiLevels";

/** Actions concrètes variées pour la première action de chaque jour, adaptées au péché focus */
export const ACTION_1: Record<SelectedSin, Array<{ title: string; desc: string }>> = {
  porno: [
    { title: "Réciter les dhikr du matin", desc: "Récite les dhikr du matin (adhkar as-sabah) au réveil : « Subhanallah, Alhamdulillah, Allahu Akbar » 33 fois chacune, puis « La ilaha illa Allah wahdahu la sharika lahu... »" },
    { title: "Faire les ablutions avant Fajr", desc: "Fais les ablutions (wudu) avant la prière de Fajr. La propreté est la moitié de la foi et protège des tentations." },
    { title: "Réciter sourate Al-Mulk avant de dormir", desc: "Lis sourate Al-Mulk (67) avant de dormir. Cette sourate protège des châtiments de la tombe et renforce la foi." },
    { title: "Réciter Ayat al-Kursi 3 fois", desc: "Récite Ayat al-Kursi (2:255) 3 fois matin et soir. C'est une protection puissante contre Shaytan." },
    { title: "Réciter « La ilaha illa Allah » 100 fois", desc: "Répète « La ilaha illa Allah » 100 fois dans la journée. Le dhikr purifie le cœur et éloigne les mauvaises pensées." },
    { title: "Prier 2 raka'at de Duha", desc: "Prie 2 à 8 raka'at de Duha entre le lever du soleil et Dhuhr. C'est une sunna très méritoire." },
    { title: "Réciter sourate Al-Falaq et An-Nas", desc: "Récite sourate Al-Falaq (113) et An-Nas (114) 3 fois matin et soir. Ce sont des protections contre le mal." },
    { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah al-'azim » 100 fois. Le Prophète (saws) faisait istighfar 100 fois par jour." },
    { title: "Lire Coran 10 minutes minimum", desc: "Lis au moins 10 minutes de Coran chaque jour. Le Coran est une lumière qui chasse les ténèbres du cœur." },
    { title: "Réciter Subhanallah, Alhamdulillah, Allahu Akbar 33 fois avant de dormir", desc: "Avant de dormir, récite « Subhanallah, Alhamdulillah, Allahu Akbar » 33 fois chacune. Cela protège ta nuit." },
    { title: "Réciter sourate Al-Ikhlas 100 fois", desc: "Récite sourate Al-Ikhlas (112) 100 fois. C'est équivalent à réciter un tiers du Coran." },
    { title: "Prier Tahajjud (prière de nuit)", desc: "Lève-toi la dernière partie de la nuit pour prier 2 raka'at minimum. C'est le moment où Allah descend au ciel le plus bas." },
    { title: "Faire les ablutions complètes (ghusl)", desc: "Fais les ablutions complètes (ghusl) pour te purifier. La propreté est la moitié de la foi." },
    { title: "Réciter les dhikr après chaque prière", desc: "Après chaque prière obligatoire, récite les dhikr prescrits : « Astaghfirullah » 3 fois, puis les 33 tasbih." },
    { title: "Envoyer 100 salawat sur le Prophète", desc: "Envoie 100 salawat sur le Prophète (saws) : « Allahumma salli 'ala Muhammad wa 'ala ali Muhammad ». C'est une purification du cœur." },
    { title: "Réciter sourate Ya-Sin", desc: "Lis sourate Ya-Sin (36) chaque jour. Cette sourate a de nombreux mérites et remplace les distractions." },
    { title: "Marche 15 min en récitant du dhikr", desc: "Quand tu marches, récite « Subhanallah, Alhamdulillah, La ilaha illa Allah, Allahu Akbar ». Transforme chaque pas en dhikr." },
    { title: "Réciter Coran à voix haute", desc: "Récite le Coran à voix haute pendant 10 minutes. Le Prophète (saws) a dit que c'est meilleur que le dhikr silencieux." },
    { title: "Faire une aumône (sadaqa)", desc: "Donne une aumône, même petite. Le Prophète (saws) a dit : « L'aumône éteint le péché comme l'eau éteint le feu. »" },
    { title: "Réciter les dhikr du soir", desc: "Récite les dhikr du soir (adhkar al-masa') avant de dormir. C'est une protection pour la nuit." },
    { title: "Prier Witr avant de dormir", desc: "Prie la prière Witr (impair) avant de dormir. C'est une sunna importante que le Prophète (saws) ne délaissait jamais." },
    { title: "Réciter « La ilaha illa Allah » dans ton cœur 5 min", desc: "Répète « La ilaha illa Allah » dans ton cœur pendant tes activités. Le dhikr silencieux est puissant." },
    { title: "Réciter sourate Al-Kahf le vendredi", desc: "Lis sourate Al-Kahf (18) chaque vendredi. C'est une sunna et une lumière pour la semaine." },
    { title: "Réciter Subhanallah, Alhamdulillah 33 fois en conduisant", desc: "Quand tu conduis ou es dans les transports, récite du dhikr au lieu d'écouter de la musique ou de regarder ton téléphone." },
    { title: "Réciter les 99 noms d'Allah", desc: "Apprends et récite les 99 noms d'Allah (Asma' al-Husna). C'est un dhikr puissant." },
    { title: "Faire 20 min de sport en récitant du dhikr", desc: "Pendant le sport ou la marche, récite du dhikr. Transforme chaque activité en adoration." },
    { title: "Réciter Coran en famille", desc: "Lis ou écoute du Coran avec ta famille pendant 15 minutes. C'est une bénédiction pour la maison." },
    { title: "Réciter La ilaha illa Allah 50 fois pendant le ménage", desc: "Pendant les tâches ménagères, récite du dhikr. Transforme chaque action en adoration." },
    { title: "Va voir ton voisin et offre-lui un gâteau", desc: "Rends visite à ton voisin avec une petite attention. Le Prophète (saws) a dit : « Le meilleur des voisins auprès d'Allah est le meilleur envers son voisin. »" },
    { title: "Appelle un membre de ta famille", desc: "Appelle ta mère, ton père ou un proche pour prendre de leurs nouvelles. Maintenir les liens de parenté est une adoration." },
  ],
  musique: [
    { title: "Écouter Coran 15 minutes", desc: "Écoute 15 minutes de Coran récité au lieu de toute musique. Le Coran apaise les cœurs et élève l'âme." },
    { title: "Réciter les dhikr du matin", desc: "Récite les dhikr du matin (adhkar as-sabah) au réveil : « Subhanallah, Alhamdulillah, Allahu Akbar » 33 fois chacune." },
    { title: "Réciter Coran à voix haute", desc: "Récite le Coran à voix haute pendant 10 minutes. Le Prophète (saws) a dit que c'est meilleur que le dhikr silencieux." },
    { title: "Réciter « La ilaha illa Allah » 100 fois", desc: "Répète « La ilaha illa Allah » 100 fois dans la journée. Le dhikr purifie le cœur et remplace les distractions." },
    { title: "Écouter nasheed halal uniquement", desc: "Si tu dois écouter quelque chose, choisis uniquement des nasheed halal (sans instruments de musique)." },
    { title: "Réciter sourate Al-Mulk", desc: "Lis sourate Al-Mulk (67) avant de dormir. Cette sourate protège et renforce la foi." },
    { title: "Marche 15 min en récitant du dhikr", desc: "Quand tu marches, récite « Subhanallah, Alhamdulillah, La ilaha illa Allah, Allahu Akbar ». Transforme chaque pas en dhikr." },
    { title: "Réciter Ayat al-Kursi 3 fois", desc: "Récite Ayat al-Kursi (2:255) 3 fois matin et soir. C'est une protection puissante contre Shaytan." },
    { title: "Écouter des cours islamiques", desc: "Écoute 20 minutes de cours islamiques (tafsir, hadith, fiqh) au lieu de musique. C'est bénéfique pour ta foi." },
    { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah al-'azim » 100 fois. Le Prophète (saws) faisait istighfar 100 fois par jour." },
    { title: "Réciter sourate Al-Falaq et An-Nas", desc: "Récite sourate Al-Falaq (113) et An-Nas (114) 3 fois matin et soir. Ce sont des protections." },
    { title: "Réciter Subhanallah, Alhamdulillah, Allahu Akbar 33 fois avant de dormir", desc: "Avant de dormir, récite « Subhanallah, Alhamdulillah, Allahu Akbar » 33 fois chacune. Cela protège ta nuit." },
    { title: "Réciter sourate Al-Ikhlas 100 fois", desc: "Récite sourate Al-Ikhlas (112) 100 fois. C'est équivalent à réciter un tiers du Coran." },
    { title: "Prier Tahajjud (prière de nuit)", desc: "Lève-toi la dernière partie de la nuit pour prier 2 raka'at minimum. C'est le moment où Allah descend." },
    { title: "Faire les ablutions complètes (ghusl)", desc: "Fais les ablutions complètes (ghusl) pour te purifier. La propreté est la moitié de la foi." },
    { title: "Réciter les dhikr après chaque prière", desc: "Après chaque prière obligatoire, récite les dhikr prescrits : « Astaghfirullah » 3 fois, puis les 33 tasbih." },
    { title: "Envoyer 100 salawat sur le Prophète", desc: "Envoie 100 salawat sur le Prophète (saws) : « Allahumma salli 'ala Muhammad wa 'ala ali Muhammad »." },
    { title: "Réciter sourate Ya-Sin", desc: "Lis sourate Ya-Sin (36) chaque jour. Cette sourate a de nombreux mérites et remplace les distractions." },
    { title: "Faire une aumône (sadaqa)", desc: "Donne une aumône, même petite. Le Prophète (saws) a dit : « L'aumône éteint le péché comme l'eau éteint le feu. »" },
    { title: "Réciter les dhikr du soir", desc: "Récite les dhikr du soir (adhkar al-masa') avant de dormir. C'est une protection pour la nuit." },
    { title: "Prier Witr avant de dormir", desc: "Prie la prière Witr (impair) avant de dormir. C'est une sunna importante." },
    { title: "Réciter « La ilaha illa Allah » dans ton cœur 5 min", desc: "Répète « La ilaha illa Allah » dans ton cœur pendant tes activités. Le dhikr silencieux est puissant." },
    { title: "Réciter sourate Al-Kahf le vendredi", desc: "Lis sourate Al-Kahf (18) chaque vendredi. C'est une sunna et une lumière pour la semaine." },
    { title: "Réciter Subhanallah, Alhamdulillah 33 fois en conduisant", desc: "Quand tu conduis, récite du dhikr au lieu d'allumer la radio musicale. Transforme chaque trajet en dhikr." },
    { title: "Réciter les 99 noms d'Allah", desc: "Apprends et récite les 99 noms d'Allah (Asma' al-Husna). C'est un dhikr puissant." },
    { title: "Faire 20 min de sport en récitant du dhikr", desc: "Pendant le sport ou la marche, récite du dhikr au lieu d'écouter de la musique. Chaque pas devient une adoration." },
    { title: "Écouter Coran en famille", desc: "Écoute du Coran avec ta famille pendant 15 minutes. C'est une bénédiction pour la maison." },
    { title: "Apprendre par cœur 3 versets", desc: "Mémorise 3 nouveaux versets du Coran. La mémorisation du Coran est meilleure que toute musique." },
    { title: "Marche 15 min en récitant du dhikr", desc: "Sors marcher 15 minutes en récitant du dhikr. Le mouvement et l'évocation d'Allah purifient le cœur." },
  ],
  priere: [
    { title: "Faire les ablutions avant chaque prière", desc: "Renouvelle tes ablutions avant chaque prière, même si elles sont encore valides. C'est une purification supplémentaire." },
    { title: "Réciter les dhikr du matin", desc: "Récite les dhikr du matin (adhkar as-sabah) au réveil : « Subhanallah, Alhamdulillah, Allahu Akbar » 33 fois chacune." },
    { title: "Prier les sunan rawatib", desc: "Prie les prières sunna avant et après les prières obligatoires (2 avant Fajr, 4 avant Dhuhr, 2 après Maghrib, etc.)." },
    { title: "Réciter Ayat al-Kursi après chaque prière", desc: "Récite Ayat al-Kursi (2:255) après chaque prière obligatoire. C'est une protection contre Shaytan jusqu'à la prière suivante." },
    { title: "Faire dua après chaque prière", desc: "Fais une supplication (dua) sincère après chaque prière. C'est le moment où les duas sont acceptées." },
    { title: "Prier Duha (prière du matin)", desc: "Prie 2 à 8 raka'at de Duha entre le lever du soleil et Dhuhr. C'est une sunna très méritoire." },
    { title: "Prier Witr avant de dormir", desc: "Prie la prière Witr (impair) avant de dormir. C'est une sunna importante que le Prophète (saws) ne délaissait jamais." },
    { title: "Réciter sourate Al-Kahf le vendredi", desc: "Lis sourate Al-Kahf (18) chaque vendredi. C'est une sunna et une lumière pour la semaine." },
    { title: "Réciter Subhanallah, Alhamdulillah, Allahu Akbar 33 fois entre 2 prières", desc: "Entre chaque prière, récite du dhikr : « Subhanallah, Alhamdulillah, La ilaha illa Allah, Allahu Akbar »." },
    { title: "Réciter les dhikr après chaque prière", desc: "Après chaque prière, récite les dhikr prescrits : « Astaghfirullah » 3 fois, « Allahumma antas-salam... », puis les 33 tasbih." },
    { title: "Prier Tahajjud (prière de nuit)", desc: "Lève-toi la dernière partie de la nuit pour prier 2 raka'at minimum. C'est le moment où Allah descend au ciel le plus bas." },
    { title: "Faire les ablutions complètes (ghusl)", desc: "Fais les ablutions complètes (ghusl) si nécessaire. La propreté est la moitié de la foi." },
    { title: "Réciter les invocations de la prière", desc: "Récite toutes les invocations prescrites dans la prière : après takbir, dans le ruku', dans le sujud, etc." },
    { title: "Faire dua qunoot dans Witr", desc: "Dans la prière Witr, récite le dua qunoot. C'est une sunna importante." },
    { title: "Réciter les dhikr du soir", desc: "Récite les dhikr du soir (adhkar al-masa') avant de dormir. C'est une protection pour la nuit." },
    { title: "Aller à la mosquée à pied en récitant du dhikr", desc: "Quand tu vas à la mosquée, récite du dhikr. Chaque pas vers la mosquée efface un péché." },
    { title: "Réciter Coran avant la prière", desc: "Lis quelques versets du Coran avant de commencer la prière. Cela prépare ton cœur." },
    { title: "Réciter « La ilaha illa Allah » dans ton cœur 5 min", desc: "Répète « La ilaha illa Allah » dans ton cœur pendant tes activités. Le dhikr silencieux est puissant." },
    { title: "Réciter sourate Al-Ikhlas 100 fois", desc: "Récite sourate Al-Ikhlas (112) 100 fois. C'est équivalent à réciter un tiers du Coran." },
    { title: "Réciter Subhanallah, Alhamdulillah, Allahu Akbar 33 fois avant de dormir", desc: "Avant de dormir, récite « Subhanallah, Alhamdulillah, Allahu Akbar » 33 fois chacune." },
    { title: "Réciter sourate Al-Mulk avant de dormir", desc: "Lis sourate Al-Mulk (67) avant de dormir. Cette sourate protège des châtiments de la tombe." },
    { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah al-'azim » 100 fois. Le Prophète (saws) faisait istighfar 100 fois par jour." },
    { title: "Envoyer 100 salawat sur le Prophète", desc: "Envoie 100 salawat sur le Prophète (saws) : « Allahumma salli 'ala Muhammad wa 'ala ali Muhammad »." },
    { title: "Faire une aumône (sadaqa)", desc: "Donne une aumône, même petite. Le Prophète (saws) a dit : « L'aumône éteint le péché comme l'eau éteint le feu. »" },
    { title: "Réciter sourate Ya-Sin", desc: "Lis sourate Ya-Sin (36) chaque jour. Cette sourate a de nombreux mérites." },
    { title: "Marche 15 min en récitant du dhikr", desc: "Quand tu marches, récite « Subhanallah, Alhamdulillah, La ilaha illa Allah, Allahu Akbar »." },
    { title: "Réciter Coran à voix haute", desc: "Récite le Coran à voix haute pendant 10 minutes. Le Prophète (saws) a dit que c'est meilleur." },
    { title: "Réciter La ilaha illa Allah 50 fois pendant le ménage", desc: "Pendant les tâches ménagères, récite du dhikr. Transforme chaque action en adoration." },
  ],
  colere: [
    { title: "Faire les ablutions immédiatement", desc: "Dès que la colère monte, fais les ablutions (wudu) complètes. Le Prophète (saws) a dit : « La colère vient de Shaytan, et Shaytan est créé de feu. Le feu s'éteint avec l'eau. »" },
    { title: "Réciter la protection contre Shaytan", desc: "Récite immédiatement : « A'udhu billahi min ash-shaytan ar-rajim » plusieurs fois. C'est une protection." },
    { title: "Réciter « La ilaha illa Allah » 100 fois", desc: "Répète « La ilaha illa Allah » 100 fois. Le dhikr apaise le cœur et éloigne la colère." },
    { title: "Prier 2 raka'at de repentir", desc: "Si tu as exprimé ta colère de manière haram, prie 2 raka'at immédiatement et demande pardon." },
    { title: "Réciter sourate Al-Falaq", desc: "Récite sourate Al-Falaq (113) 3 fois. C'est une protection contre le mal, y compris la colère." },
    { title: "Marche 15 min en récitant du dhikr", desc: "Marche 15 minutes en récitant du dhikr. Le mouvement physique avec le dhikr aide à maîtriser la colère." },
    { title: "Réciter Coran pour apaiser", desc: "Lis quelques versets du Coran. Le Coran apaise les cœurs : « N'est-ce pas par l'évocation d'Allah que s'apaisent les cœurs ? »" },
    { title: "Faire une bonne action immédiate", desc: "Dès que la colère monte, fais une bonne action (aide quelqu'un, donne l'aumône). Cela transforme la colère en bien." },
    { title: "Réciter les noms d'Allah", desc: "Répète « Ya Halim, Ya Ghafur, Ya Rahim » (Ô Le Clément, Le Pardonneur, Le Miséricordieux). Imite les attributs d'Allah." },
    { title: "Prier en groupe", desc: "Va prier à la mosquée. La prière en groupe apaise et recentre." },
    { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah al-'azim » 100 fois. Le repentir purifie le cœur de la colère." },
    { title: "Réciter sourate An-Nas", desc: "Récite sourate An-Nas (114) 3 fois. C'est une protection contre les maux, y compris la colère." },
    { title: "Réciter « La ilaha illa Allah » dans ton cœur 5 min", desc: "Répète « Subhanallah, Alhamdulillah, La ilaha illa Allah, Allahu Akbar » dans ton cœur. Le dhikr silencieux est puissant." },
    { title: "Réciter les dhikr du matin", desc: "Récite les dhikr du matin (adhkar as-sabah). C'est une protection pour toute la journée contre la colère." },
    { title: "Faire une aumône", desc: "Donne une aumône, même petite. « L'aumône éteint le péché comme l'eau éteint le feu. »" },
    { title: "Réciter sourate Al-Ikhlas", desc: "Récite sourate Al-Ikhlas (112) 10 fois. Cette sourate apaise le cœur." },
    { title: "Prier avec concentration", desc: "Prie une prière avec une concentration totale. La prière recentre et apaise." },
    { title: "Réciter les dhikr du soir", desc: "Récite les dhikr du soir (adhkar al-masa'). C'est une protection pour la nuit." },
    { title: "Réciter Subhanallah, Alhamdulillah, Allahu Akbar 33 fois avant de dormir", desc: "Avant de dormir, récite « Subhanallah, Alhamdulillah, Allahu Akbar » 33 fois chacune. Cela purifie." },
    { title: "Réciter Ayat al-Kursi", desc: "Récite Ayat al-Kursi (2:255) 3 fois matin et soir. C'est une protection puissante." },
    { title: "Réciter Subhanallah, Alhamdulillah 33 fois en conduisant", desc: "Quand tu conduis, récite du dhikr. Le dhikr apaise et éloigne la colère." },
    { title: "Réciter sourate Al-Mulk", desc: "Lis sourate Al-Mulk (67) avant de dormir. Cette sourate protège et renforce la foi." },
    { title: "Faire les ablutions complètes (ghusl)", desc: "Fais les ablutions complètes (ghusl) pour te purifier. La propreté est la moitié de la foi." },
    { title: "Envoyer 100 salawat sur le Prophète", desc: "Envoie 100 salawat sur le Prophète (saws) : « Allahumma salli 'ala Muhammad wa 'ala ali Muhammad »." },
    { title: "Réciter sourate Ya-Sin", desc: "Lis sourate Ya-Sin (36) chaque jour. Cette sourate apaise le cœur." },
    { title: "Faire 20 min de sport en récitant du dhikr", desc: "Pendant le sport ou la marche, récite du dhikr. Le mouvement physique avec le dhikr aide." },
    { title: "Réciter Coran à voix haute", desc: "Récite le Coran à voix haute pendant 10 minutes. Le Prophète (saws) a dit que c'est meilleur." },
    { title: "Réciter La ilaha illa Allah 50 fois pendant le ménage", desc: "Pendant les tâches ménagères, récite du dhikr. Transforme chaque action en adoration." },
  ],
  drogue: [
    { title: "Faire les ablutions et prier", desc: "Dès que l'envie vient, fais les ablutions (wudu) et prie 2 raka'at. La prière éloigne les mauvaises pensées." },
    { title: "Réciter la protection contre Shaytan", desc: "Récite immédiatement : « A'udhu billahi min ash-shaytan ar-rajim » plusieurs fois. C'est une protection." },
    { title: "Réciter « La ilaha illa Allah » 100 fois", desc: "Répète « La ilaha illa Allah » 100 fois. Le dhikr purifie le cœur et éloigne les addictions." },
    { title: "Prier en groupe à la mosquée", desc: "Va prier à la mosquée. La prière en groupe renforce la foi et éloigne les tentations." },
    { title: "Réciter Coran pour apaiser", desc: "Lis ou écoute 15 minutes de Coran. Le Coran apaise les cœurs et élève l'âme." },
    { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah al-'azim » 100 fois. Le repentir purifie et renforce la volonté." },
    { title: "Faire une bonne action immédiate", desc: "Dès que l'envie vient, fais une bonne action (aide quelqu'un, appelle tes parents, donne l'aumône)." },
    { title: "Réciter sourate Al-Falaq et An-Nas", desc: "Récite sourate Al-Falaq (113) et An-Nas (114) 3 fois matin et soir. Ce sont des protections." },
    { title: "Marche 15 min en récitant du dhikr", desc: "Marche 15 minutes en récitant du dhikr. Le mouvement physique avec le dhikr aide à surmonter l'addiction." },
    { title: "Prier Tahajjud (prière de nuit)", desc: "Lève-toi la dernière partie de la nuit pour prier 2 raka'at. C'est le moment où Allah descend." },
    { title: "Réciter les dhikr du matin", desc: "Récite les dhikr du matin (adhkar as-sabah) au réveil. C'est une protection pour toute la journée." },
    { title: "Faire une aumône", desc: "Donne une aumône, même petite. « L'aumône éteint le péché comme l'eau éteint le feu. »" },
    { title: "Réciter sourate Al-Mulk", desc: "Lis sourate Al-Mulk (67) avant de dormir. Cette sourate protège et renforce la foi." },
    { title: "Réciter Subhanallah, Alhamdulillah, Allahu Akbar 33 fois avant de dormir", desc: "Avant de dormir, récite « Subhanallah, Alhamdulillah, Allahu Akbar » 33 fois chacune." },
    { title: "Écouter Coran au lieu de consommer", desc: "Quand l'envie vient, écoute du Coran récité pendant 20 minutes. Le Coran apaise et élève." },
    { title: "Faire les ablutions complètes (ghusl)", desc: "Fais les ablutions complètes (ghusl) pour te purifier. La propreté est la moitié de la foi." },
    { title: "Réciter la dua de protection", desc: "Récite : « Allahumma a'inni ala dhikrika wa chukrika wa husni 'ibadatika » (Ô Allah, aide-moi à T'évoquer...)." },
    { title: "Prier avec concentration", desc: "Prie une prière avec une concentration totale. La prière recentre et renforce la volonté." },
    { title: "Réciter « La ilaha illa Allah » dans ton cœur 5 min", desc: "Répète « La ilaha illa Allah » dans ton cœur pendant tes activités. Le dhikr silencieux est puissant." },
    { title: "Réciter sourate Al-Ikhlas", desc: "Récite sourate Al-Ikhlas (112) 100 fois. C'est équivalent à réciter un tiers du Coran." },
    { title: "Réciter les dhikr prescrits après chaque prière", desc: "Après chaque prière obligatoire, récite les dhikr prescrits. C'est une purification continue." },
    { title: "Réciter les dhikr du soir", desc: "Récite les dhikr du soir (adhkar al-masa') avant de dormir. C'est une protection pour la nuit." },
    { title: "Faire une supplication sincère", desc: "Fais une dua sincère : « Rabbi a'inni wa la tu'a'in 'alayya, wa unsurni wa la tansurni 'alayya »." },
    { title: "Réciter Coran à voix haute", desc: "Récite le Coran à voix haute pendant 10 minutes. Le Prophète (saws) a dit que c'est meilleur." },
    { title: "Faire du dhikr en faisant le sport", desc: "Pendant le sport ou la marche, récite du dhikr. Transforme chaque activité en adoration." },
    { title: "Prier les prières surérogatoires", desc: "Prie les prières surérogatoires (nafl) : Duha, Witr, Tahajjud. Ce sont des protections." },
    { title: "Réciter les 99 noms d'Allah", desc: "Apprends et récite les 99 noms d'Allah (Asma' al-Husna). C'est un dhikr puissant." },
    { title: "Réciter Subhanallah 33 fois pendant une attente", desc: "Pendant les moments d'attente, récite du dhikr. Utilise chaque instant pour te rapprocher d'Allah." },
  ],
  alcool: [
    { title: "Faire les ablutions et prier", desc: "Dès que l'envie vient, fais les ablutions (wudu) et prie 2 raka'at. La prière éloigne les mauvaises pensées." },
    { title: "Réciter la protection", desc: "Avant un contexte social, récite : « A'udhu billahi min ash-shaytan ar-rajim » plusieurs fois." },
    { title: "Réciter « La ilaha illa Allah » 100 fois", desc: "Répète « La ilaha illa Allah » 100 fois. Le dhikr purifie le cœur et renforce la volonté." },
    { title: "Prier en groupe à la mosquée", desc: "Va prier à la mosquée. La prière en groupe renforce la foi et éloigne les tentations." },
    { title: "Réciter Coran pour apaiser", desc: "Lis ou écoute 15 minutes de Coran. Le Coran apaise les cœurs et élève l'âme." },
    { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah al-'azim » 100 fois. Le repentir purifie et renforce la volonté." },
    { title: "Faire une bonne action immédiate", desc: "Dès que l'envie vient, fais une bonne action (aide quelqu'un, appelle tes parents, donne l'aumône)." },
    { title: "Réciter sourate Al-Falaq et An-Nas", desc: "Récite sourate Al-Falaq (113) et An-Nas (114) 3 fois matin et soir. Ce sont des protections." },
    { title: "Marche 15 min en récitant du dhikr", desc: "Marche 15 minutes en récitant du dhikr. Le mouvement physique avec le dhikr aide à surmonter." },
    { title: "Prier Tahajjud (prière de nuit)", desc: "Lève-toi la dernière partie de la nuit pour prier 2 raka'at. C'est le moment où Allah descend." },
    { title: "Réciter les dhikr du matin", desc: "Récite les dhikr du matin (adhkar as-sabah) au réveil. C'est une protection pour toute la journée." },
    { title: "Faire une aumône", desc: "Donne une aumône, même petite. « L'aumône éteint le péché comme l'eau éteint le feu. »" },
    { title: "Réciter sourate Al-Mulk", desc: "Lis sourate Al-Mulk (67) avant de dormir. Cette sourate protège et renforce la foi." },
    { title: "Réciter Subhanallah, Alhamdulillah, Allahu Akbar 33 fois avant de dormir", desc: "Avant de dormir, récite « Subhanallah, Alhamdulillah, Allahu Akbar » 33 fois chacune." },
    { title: "Boire de l'eau avec dhikr", desc: "Quand tu bois, dis « Bismillah » avant et « Alhamdulillah » après. Transforme chaque gorgée en dhikr." },
    { title: "Faire les ablutions complètes (ghusl)", desc: "Fais les ablutions complètes (ghusl) pour te purifier. La propreté est la moitié de la foi." },
    { title: "Réciter la dua de protection", desc: "Récite : « Rabbi adkhilni mudkhala sidqin wa akhrijni mukhraja sidqin » (Mon Seigneur, fais-moi entrer...)." },
    { title: "Prier avec concentration", desc: "Prie une prière avec une concentration totale. La prière recentre et renforce la volonté." },
    { title: "Réciter « La ilaha illa Allah » dans ton cœur 5 min", desc: "Répète « La ilaha illa Allah » dans ton cœur pendant tes activités. Le dhikr silencieux est puissant." },
    { title: "Réciter sourate Al-Ikhlas", desc: "Récite sourate Al-Ikhlas (112) 100 fois. C'est équivalent à réciter un tiers du Coran." },
    { title: "Réciter les dhikr prescrits après chaque prière", desc: "Après chaque prière obligatoire, récite les dhikr prescrits. C'est une purification continue." },
    { title: "Réciter les dhikr du soir", desc: "Récite les dhikr du soir (adhkar al-masa') avant de dormir. C'est une protection pour la nuit." },
    { title: "Faire une supplication sincère", desc: "Fais une dua sincère : « Allahumma a'inni ala dhikrika wa chukrika wa husni 'ibadatika »." },
    { title: "Réciter Coran à voix haute", desc: "Récite le Coran à voix haute pendant 10 minutes. Le Prophète (saws) a dit que c'est meilleur." },
    { title: "Faire du dhikr en faisant le sport", desc: "Pendant le sport ou la marche, récite du dhikr. Transforme chaque activité en adoration." },
    { title: "Prier les prières surérogatoires", desc: "Prie les prières surérogatoires (nafl) : Duha, Witr, Tahajjud. Ce sont des protections." },
    { title: "Réciter les 99 noms d'Allah", desc: "Apprends et récite les 99 noms d'Allah (Asma' al-Husna). C'est un dhikr puissant." },
    { title: "Réciter Subhanallah 33 fois pendant une attente", desc: "Pendant les moments d'attente, récite du dhikr. Utilise chaque instant pour te rapprocher d'Allah." },
  ],
  jeux: [
    { title: "Remplacer par Coran ou dhikr", desc: "À l'heure habituelle de jeu, lis 15 minutes de Coran ou fais du dhikr. Utilise ce temps pour Allah." },
    { title: "Faire les ablutions et prier", desc: "Dès que l'envie de jouer vient, fais les ablutions (wudu) et prie 2 raka'at. La prière éloigne les distractions." },
    { title: "Réciter la protection", desc: "Avant d'utiliser un appareil, récite : « A'udhu billahi min ash-shaytan ar-rajim » plusieurs fois." },
    { title: "Réciter « La ilaha illa Allah » 100 fois", desc: "Répète « La ilaha illa Allah » 100 fois. Le dhikr purifie le cœur et éloigne les addictions." },
    { title: "Prier en groupe à la mosquée", desc: "Va prier à la mosquée. La prière en groupe renforce la foi et éloigne les distractions." },
    { title: "Réciter Coran pour apaiser", desc: "Lis ou écoute 15 minutes de Coran. Le Coran apaise les cœurs et élève l'âme." },
    { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah al-'azim » 100 fois. Le repentir purifie et renforce la volonté." },
    { title: "Faire une bonne action immédiate", desc: "Dès que l'envie de jouer vient, fais une bonne action (aide quelqu'un, appelle tes parents, donne l'aumône)." },
    { title: "Réciter sourate Al-Falaq et An-Nas", desc: "Récite sourate Al-Falaq (113) et An-Nas (114) 3 fois matin et soir. Ce sont des protections." },
    { title: "Marche 15 min en récitant du dhikr", desc: "Marche 15 minutes en récitant du dhikr. Le mouvement physique avec le dhikr aide à surmonter." },
    { title: "Prier Tahajjud (prière de nuit)", desc: "Lève-toi la dernière partie de la nuit pour prier 2 raka'at. C'est le moment où Allah descend." },
    { title: "Réciter les dhikr du matin", desc: "Récite les dhikr du matin (adhkar as-sabah) au réveil. C'est une protection pour toute la journée." },
    { title: "Faire une aumône", desc: "Donne une aumône, même petite. « L'aumône éteint le péché comme l'eau éteint le feu. »" },
    { title: "Réciter sourate Al-Mulk", desc: "Lis sourate Al-Mulk (67) avant de dormir. Cette sourate protège et renforce la foi." },
    { title: "Réciter Subhanallah, Alhamdulillah, Allahu Akbar 33 fois avant de dormir", desc: "Avant de dormir, récite « Subhanallah, Alhamdulillah, Allahu Akbar » 33 fois chacune." },
    { title: "Écouter Coran au lieu de jouer", desc: "Quand l'envie de jouer vient, écoute du Coran récité pendant 20 minutes. Le Coran apaise." },
    { title: "Faire les ablutions complètes (ghusl)", desc: "Fais les ablutions complètes (ghusl) pour te purifier. La propreté est la moitié de la foi." },
    { title: "Réciter la dua de protection", desc: "Récite : « Allahumma naqqina min adh-dhunub wal-khataya kama yunaqqa ath-thawb al-abyad min ad-danas »." },
    { title: "Prier avec concentration", desc: "Prie une prière avec une concentration totale. La prière recentre et renforce la volonté." },
    { title: "Réciter « La ilaha illa Allah » dans ton cœur 5 min", desc: "Répète « La ilaha illa Allah » dans ton cœur pendant tes activités. Le dhikr silencieux est puissant." },
    { title: "Réciter sourate Al-Ikhlas", desc: "Récite sourate Al-Ikhlas (112) 100 fois. C'est équivalent à réciter un tiers du Coran." },
    { title: "Réciter les dhikr prescrits après chaque prière", desc: "Après chaque prière obligatoire, récite les dhikr prescrits. C'est une purification continue." },
    { title: "Réciter les dhikr du soir", desc: "Récite les dhikr du soir (adhkar al-masa') avant de dormir. C'est une protection pour la nuit." },
    { title: "Faire une supplication sincère", desc: "Fais une dua sincère : « Rabbi a'inni wa la tu'a'in 'alayya, wa unsurni wa la tansurni 'alayya »." },
    { title: "Réciter Coran à voix haute", desc: "Récite le Coran à voix haute pendant 10 minutes. Le Prophète (saws) a dit que c'est meilleur." },
    { title: "Faire du dhikr en faisant le sport", desc: "Pendant le sport ou la marche, récite du dhikr. Transforme chaque activité en adoration." },
    { title: "Prier les prières surérogatoires", desc: "Prie les prières surérogatoires (nafl) : Duha, Witr, Tahajjud. Ce sont des protections." },
    { title: "Apprendre par cœur des versets", desc: "Mémorise 3 nouveaux versets du Coran. La mémorisation du Coran est meilleure que les jeux." },
  ],
  mensonge: [
    { title: "Faire les ablutions et prier", desc: "Si tu as menti, fais les ablutions (wudu) et prie 2 raka'at de repentir. Demande pardon avec sincérité." },
    { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah » 100 fois. Le repentir purifie le cœur et renforce la sincérité." },
    { title: "Prier en groupe à la mosquée", desc: "Va prier à la mosquée. La prière en groupe renforce la sincérité et la véracité." },
    { title: "Réciter Coran pour apaiser", desc: "Lis ou écoute 15 minutes de Coran. Le Coran guide vers la vérité et la sincérité." },
    { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah al-'azim » 100 fois. Le repentir purifie et renforce la véracité." },
    { title: "Faire une bonne action immédiate", desc: "Dès qu'une mauvaise pensée vient, fais immédiatement une bonne action (aide quelqu'un, appelle tes parents)." },
    { title: "Réciter sourate Al-Falaq et An-Nas", desc: "Récite sourate Al-Falaq (113) et An-Nas (114) 3 fois matin et soir. Ce sont des protections." },
    { title: "Marche 15 min en récitant du dhikr", desc: "Marche 15 minutes en récitant du dhikr. Le mouvement physique avec le dhikr aide à rester sincère." },
    { title: "Prier Tahajjud (prière de nuit)", desc: "Lève-toi la dernière partie de la nuit pour prier 2 raka'at. C'est le moment où Allah descend." },
    { title: "Réciter les dhikr du matin", desc: "Récite les dhikr du matin (adhkar as-sabah) au réveil. C'est une protection pour toute la journée." },
    { title: "Faire une aumône", desc: "Donne une aumône, même petite. « L'aumône éteint le péché comme l'eau éteint le feu. »" },
    { title: "Réciter sourate Al-Mulk", desc: "Lis sourate Al-Mulk (67) avant de dormir. Cette sourate protège et renforce la foi." },
    { title: "Réciter Subhanallah, Alhamdulillah, Allahu Akbar 33 fois avant de dormir", desc: "Avant de dormir, récite « Subhanallah, Alhamdulillah, Allahu Akbar » 33 fois chacune." },
    { title: "Lire un verset ou hadith", desc: "Lis ou écoute 1 verset ou 1 hadith qui te parle. La guidance vient d'Allah." },
    { title: "Faire les ablutions complètes (ghusl)", desc: "Fais les ablutions complètes (ghusl) pour te purifier. La propreté est la moitié de la foi." },
    { title: "Réciter la dua de guidance", desc: "Récite : « Rabbi charrah li sadri wa yassir li amri wa ahlil 'uqdata min lisani yafqahu qawli »." },
    { title: "Prier avec concentration", desc: "Prie une prière avec une concentration totale. La prière recentre et renforce la sincérité." },
    { title: "Réciter « La ilaha illa Allah » dans ton cœur 5 min", desc: "Répète « La ilaha illa Allah » dans ton cœur pendant tes activités. Le dhikr silencieux est puissant." },
    { title: "Réciter sourate Al-Ikhlas", desc: "Récite sourate Al-Ikhlas (112) 100 fois. C'est équivalent à réciter un tiers du Coran." },
    { title: "Réciter les dhikr prescrits après chaque prière", desc: "Après chaque prière obligatoire, récite les dhikr prescrits. C'est une purification continue." },
    { title: "Réciter les dhikr du soir", desc: "Récite les dhikr du soir (adhkar al-masa') avant de dormir. C'est une protection pour la nuit." },
    { title: "Faire une supplication sincère", desc: "Fais une dua sincère : « Allahumma a'inni ala dhikrika wa chukrika wa husni 'ibadatika »." },
    { title: "Réciter Coran à voix haute", desc: "Récite le Coran à voix haute pendant 10 minutes. Le Prophète (saws) a dit que c'est meilleur." },
    { title: "Faire du dhikr en faisant le sport", desc: "Pendant le sport ou la marche, récite du dhikr. Transforme chaque activité en adoration." },
    { title: "Prier les prières surérogatoires", desc: "Prie les prières surérogatoires (nafl) : Duha, Witr, Tahajjud. Ce sont des protections." },
    { title: "Réciter les 99 noms d'Allah", desc: "Apprends et récite les 99 noms d'Allah (Asma' al-Husna). C'est un dhikr puissant." },
    { title: "Réciter Subhanallah 33 fois pendant une attente", desc: "Pendant les moments d'attente, récite du dhikr au lieu d'écouter de la musique ou de regarder ton téléphone." },
    { title: "Réciter sourate Ya-Sin", desc: "Lis sourate Ya-Sin (36) chaque jour. Cette sourate a de nombreux mérites." },
    { title: "Réciter La ilaha illa Allah 50 fois pendant le ménage", desc: "Pendant les tâches ménagères, récite du dhikr. Transforme chaque action en adoration." },
  ],
  regard: [
    { title: "Réciter la protection immédiatement", desc: "Dès que le regard se pose sur quelque chose d'interdit, récite immédiatement : « A'udhu billahi min ash-shaytan ar-rajim » 3 fois." },
    { title: "Faire les ablutions", desc: "Si tu as regardé quelque chose d'interdit, fais les ablutions (wudu) immédiatement. C'est une purification." },
    { title: "Prier 2 raka'at de repentir", desc: "Prie 2 raka'at immédiatement après avoir baissé le regard. Demande pardon avec sincérité." },
    { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah » 100 fois dans la journée. Le repentir purifie le regard." },
    { title: "Réciter sourate An-Nur", desc: "Lis sourate An-Nur (24), verset 30-31 : « Dis aux croyants de baisser leur regard... » Médite ces versets." },
    { title: "Prier en groupe à la mosquée", desc: "Va prier à la mosquée. La prière en groupe renforce la foi et éloigne les tentations." },
    { title: "Réciter Coran pour apaiser", desc: "Lis quelques versets du Coran. Le Coran apaise les cœurs et élève l'âme." },
    { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah al-'azim » 100 fois. Le Prophète (saws) faisait istighfar 100 fois par jour." },
    { title: "Faire une bonne action immédiate", desc: "Dès qu'une mauvaise pensée vient, fais immédiatement une bonne action (aide quelqu'un, appelle tes parents)." },
    { title: "Réciter sourate Al-Falaq et An-Nas", desc: "Récite sourate Al-Falaq (113) et An-Nas (114) 3 fois matin et soir. Ce sont des protections." },
    { title: "Marche 15 min en récitant du dhikr", desc: "Quand tu marches dans la rue, récite du dhikr et garde le regard baissé. Transforme chaque sortie en adoration." },
    { title: "Réciter sourate Al-Mulk", desc: "Lis sourate Al-Mulk (67) avant de dormir. Cette sourate protège et renforce la foi." },
    { title: "Réciter Subhanallah, Alhamdulillah, Allahu Akbar 33 fois avant de dormir", desc: "Avant de dormir, récite « Subhanallah, Alhamdulillah, Allahu Akbar » 33 fois chacune. Cela protège ta nuit." },
    { title: "Réciter Coran au lieu de scroll", desc: "Quand tu veux scroller, lis plutôt le Coran pendant 10 minutes. Le Coran élève l'âme." },
    { title: "Faire les ablutions complètes (ghusl)", desc: "Fais les ablutions complètes (ghusl) pour te purifier. La propreté est la moitié de la foi." },
    { title: "Réciter la dua de protection", desc: "Récite matin et soir : « Allahumma inna naj'aluka fi nuhurihim wa na'udhu bika min shururihim »." },
    { title: "Prier avec concentration", desc: "Prie une prière avec une concentration totale. La prière purifie le cœur et renforce la foi." },
    { title: "Réciter « La ilaha illa Allah » dans ton cœur 5 min", desc: "Répète « La ilaha illa Allah » dans ton cœur pendant tes activités. Le dhikr silencieux est puissant." },
    { title: "Réciter les dhikr du matin", desc: "Récite les dhikr du matin (adhkar as-sabah) au réveil. C'est une protection pour toute la journée." },
    { title: "Faire une aumône", desc: "Donne une aumône, même petite. « L'aumône éteint le péché comme l'eau éteint le feu. »" },
    { title: "Réciter sourate Al-Ikhlas", desc: "Récite sourate Al-Ikhlas (112) 100 fois. C'est équivalent à réciter un tiers du Coran." },
    { title: "Réciter les dhikr prescrits après chaque prière", desc: "Après chaque prière obligatoire, récite les dhikr prescrits. C'est une purification continue." },
    { title: "Réciter les dhikr du soir", desc: "Récite les dhikr du soir (adhkar al-masa') avant de dormir. C'est une protection pour la nuit." },
    { title: "Réciter Subhanallah, Alhamdulillah 33 fois en conduisant", desc: "Quand tu conduis, récite du dhikr et garde le regard sur la route. Évite de regarder autour." },
    { title: "Réciter Ayat al-Kursi", desc: "Récite Ayat al-Kursi (2:255) 3 fois matin et soir. C'est une protection puissante contre Shaytan." },
    { title: "Envoyer 100 salawat sur le Prophète", desc: "Envoie 100 salawat sur le Prophète (saws) : « Allahumma salli 'ala Muhammad wa 'ala ali Muhammad »." },
    { title: "Réciter sourate Ya-Sin", desc: "Lis sourate Ya-Sin (36) chaque jour. Cette sourate a de nombreux mérites." },
    { title: "Faire 20 min de sport en récitant du dhikr", desc: "Pendant le sport ou la marche, récite du dhikr. Transforme chaque activité en adoration." },
  ],
  parents: [
    { title: "Réciter le verset des parents (17:23-24)", desc: "Lis et médite : « Et ton Seigneur a décrété de n'adorer que Lui, et d'être bienfaisant envers les père et mère. Ne leur dis pas « Ouf » et ne les repousse pas ; dis-leur des paroles respectueuses. »" },
    { title: "Demander pardon à ton père ou ta mère", desc: "Si tu as manqué de respect ou désobéi aujourd'hui, va vers eux et dis « Je suis désolé(e), je ne recommencerai pas. » Le repentir envers eux est une adoration." },
    { title: "Faire une chose qu'ils te demandent sans rouspéter", desc: "Choisis une demande de tes parents (ranger, aider, une course) et accomplis-la avec un sourire et sans grogner. « Un mot doux est une aumône. »" },
    { title: "Leur dire « Jazakallahou khayran » ou « Merci »", desc: "Remercie ton père ou ta mère pour une chose qu'ils font pour toi. La gratitude envers eux est gratitude envers Allah." },
    { title: "Passer 10 minutes avec eux sans téléphone", desc: "Assieds-toi avec eux 10 minutes, écoute-les, pose une question sur leur journée. Ta présence est un cadeau." },
    { title: "Réciter la dua pour les parents", desc: "Récite : « Rabbi ghfir li wa li walidayya wa lil mu'minina yawma yaqum al-hisab » (Mon Seigneur, pardonne-moi ainsi qu'à mes parents et aux croyants le jour du jugement)." },
    { title: "Ne pas hausser le ton aujourd'hui", desc: "Engage-toi : toute la journée, parle à tes parents avec une voix douce, même si tu es contrarié. « Et ne leur dis pas Ouf. »" },
    { title: "Leur offrir à boire ou à manger", desc: "Propose à ton père ou ta mère un verre d'eau, un thé ou une part de ce que tu manges. Le service envers eux est un acte d'adoration." },
    { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah » 100 fois en pensant à tes manquements envers eux. Le repentir purifie le cœur." },
    { title: "Écrire une chose positive sur chacun", desc: "Note une qualité de ton père et une de ta mère. Cela change le regard et renforce le respect." },
    { title: "Prier 2 raka'at et invoquer pour eux", desc: "Prie 2 raka'at et dans ta dua demande à Allah de les préserver et de te donner la force de leur obéir dans le bien." },
    { title: "Ranger ta chambre ou un espace commun", desc: "Sans qu'ils te le demandent, range ta chambre ou aide au ménage. Alléger leur charge est une obéissance." },
    { title: "Ne pas les contredire avec insolence", desc: "Si tu n'es pas d'accord, dis « Je comprends, mais qu'en penses-tu si… » au lieu de couper la parole ou de répondre mal." },
    { title: "Réciter les dhikr du matin", desc: "Récite les dhikr du matin (adhkar as-sabah) au réveil et fais une intention : « Aujourd'hui je ne désobéirai pas à mes parents. »" },
    { title: "Appeler un grand-parent si tes parents sont d'accord", desc: "Prends des nouvelles de tes grands-parents. Le lien de parenté (silat ar-rahim) commence par les plus proches." },
    { title: "Lire le hadith « Le Paradis est aux pieds des mères »", desc: "Médite : « Le Paradis est aux pieds des mères. » (Ahmad, Nasa'i) Chaque geste de respect envers eux te rapproche du Paradis." },
    { title: "Faire une aumône en leur nom", desc: "Donne une petite aumône en invoquant le bien pour tes parents. « Quand une personne meurt, ses œuvres s'arrêtent sauf… un enfant pieux qui prie pour elle. »" },
    { title: "Leur souhaiter une bonne journée", desc: "Le matin, dis « Bonjour » ou « Sabah al-khayr » avec un sourire. Un simple mot bienveillant compte." },
    { title: "Ne pas mentir à tes parents aujourd'hui", desc: "Dis toujours la vérité à ton père et ta mère, même si c'est difficile. La sincérité envers eux est une obéissance." },
    { title: "Réciter sourate Al-Isra (versets 23-24)", desc: "Lis sourate Al-Isra (17), versets 23 et 24. Ce sont les versets clés sur le respect des parents en Islam." },
    { title: "Proposer ton aide pour une tâche", desc: "Demande : « Tu as besoin d'aide pour quelque chose ? » et fais ce qu'ils te demandent avec joie." },
    { title: "Réciter les dhikr du soir", desc: "Récite les dhikr du soir (adhkar al-masa') et avant de dormir demande pardon à Allah pour toute désobéissance envers tes parents." },
    { title: "Ne pas bouder ou faire la tête", desc: "Si tu es fâché, explique calmement au lieu de bouder. La communication respectueuse est une forme d'obéissance." },
    { title: "Prier en groupe et invoquer pour eux", desc: "Prie au moins une prière (ou plus) et dans tes invocations demande à Allah de bénir tes parents et de te guider vers la bienfaisance." },
    { title: "Réciter « La ilaha illa Allah » 100 fois", desc: "Répète « La ilaha illa Allah » 100 fois. Le dhikr adoucit le cœur et facilite l'obéissance et le respect." },
    { title: "Éteindre les écrans quand ils te parlent", desc: "Quand ton père ou ta mère te parle, pose ton téléphone et regarde-les. Leur accorder ton attention est un signe de respect." },
    { title: "Dire « Oui » à une demande sans rouspéter", desc: "Aujourd'hui, à la première demande (dans le halal), dis « Oui » et exécute tout de suite. « La meilleure œuvre après la prière : la bienfaisance envers les parents. »" },
    { title: "Réciter Ayat al-Kursi et invoquer pour eux", desc: "Récite Ayat al-Kursi (2:255) puis invoque Allah pour la santé et le bonheur de tes parents." },
    { title: "Partager un repas avec eux", desc: "Mange au moins un repas avec ton père ou ta mère (ou les deux), sans téléphone. Le repas en famille renforce les liens." },
    { title: "Réciter Coran et penser à eux", desc: "Lis 10 minutes de Coran et fais une dua pour tes parents après. Le Coran apaise le cœur et facilite la bienveillance." },
  ],
  autre: [
    { title: "Faire les ablutions et prier", desc: "Dès que la tentation vient, fais les ablutions (wudu) et prie 2 raka'at. La prière éloigne les mauvaises pensées." },
    { title: "Réciter la protection contre Shaytan", desc: "Récite immédiatement : « A'udhu billahi min ash-shaytan ar-rajim » plusieurs fois. C'est une protection." },
    { title: "Réciter « La ilaha illa Allah » 100 fois", desc: "Répète « La ilaha illa Allah » 100 fois. Le dhikr purifie le cœur et éloigne les péchés." },
    { title: "Prier en groupe à la mosquée", desc: "Va prier à la mosquée. La prière en groupe renforce la foi et éloigne les tentations." },
    { title: "Réciter Coran pour apaiser", desc: "Lis ou écoute 15 minutes de Coran. Le Coran apaise les cœurs et élève l'âme." },
    { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah al-'azim » 100 fois. Le repentir purifie et renforce la volonté." },
    { title: "Faire une bonne action immédiate", desc: "Dès que la tentation vient, fais une bonne action (aide quelqu'un, appelle tes parents, donne l'aumône)." },
    { title: "Réciter sourate Al-Falaq et An-Nas", desc: "Récite sourate Al-Falaq (113) et An-Nas (114) 3 fois matin et soir. Ce sont des protections." },
    { title: "Marche 15 min en récitant du dhikr", desc: "Marche 15 minutes en récitant du dhikr. Le mouvement physique avec le dhikr aide à surmonter." },
    { title: "Prier Tahajjud (prière de nuit)", desc: "Lève-toi la dernière partie de la nuit pour prier 2 raka'at. C'est le moment où Allah descend." },
    { title: "Réciter les dhikr du matin", desc: "Récite les dhikr du matin (adhkar as-sabah) au réveil. C'est une protection pour toute la journée." },
    { title: "Faire une aumône", desc: "Donne une aumône, même petite. « L'aumône éteint le péché comme l'eau éteint le feu. »" },
    { title: "Réciter sourate Al-Mulk", desc: "Lis sourate Al-Mulk (67) avant de dormir. Cette sourate protège et renforce la foi." },
    { title: "Réciter Subhanallah, Alhamdulillah, Allahu Akbar 33 fois avant de dormir", desc: "Avant de dormir, récite « Subhanallah, Alhamdulillah, Allahu Akbar » 33 fois chacune." },
    { title: "Lire un verset ou hadith", desc: "Lis ou écoute 1 verset ou 1 hadith qui te parle. La guidance vient d'Allah." },
    { title: "Faire les ablutions complètes (ghusl)", desc: "Fais les ablutions complètes (ghusl) pour te purifier. La propreté est la moitié de la foi." },
    { title: "Réciter la dua de guidance", desc: "Récite : « Rabbi charrah li sadri wa yassir li amri wa ahlil 'uqdata min lisani yafqahu qawli »." },
    { title: "Prier avec concentration", desc: "Prie une prière avec une concentration totale. La prière recentre et renforce la volonté." },
    { title: "Réciter « La ilaha illa Allah » dans ton cœur 5 min", desc: "Répète « La ilaha illa Allah » dans ton cœur pendant tes activités. Le dhikr silencieux est puissant." },
    { title: "Réciter sourate Al-Ikhlas", desc: "Récite sourate Al-Ikhlas (112) 100 fois. C'est équivalent à réciter un tiers du Coran." },
    { title: "Réciter les dhikr prescrits après chaque prière", desc: "Après chaque prière obligatoire, récite les dhikr prescrits. C'est une purification continue." },
    { title: "Réciter les dhikr du soir", desc: "Récite les dhikr du soir (adhkar al-masa') avant de dormir. C'est une protection pour la nuit." },
    { title: "Faire une supplication sincère", desc: "Fais une dua sincère : « Allahumma a'inni ala dhikrika wa chukrika wa husni 'ibadatika »." },
    { title: "Réciter Coran à voix haute", desc: "Récite le Coran à voix haute pendant 10 minutes. Le Prophète (saws) a dit que c'est meilleur." },
    { title: "Faire du dhikr en faisant le sport", desc: "Pendant le sport ou la marche, récite du dhikr. Transforme chaque activité en adoration." },
    { title: "Prier les prières surérogatoires", desc: "Prie les prières surérogatoires (nafl) : Duha, Witr, Tahajjud. Ce sont des protections." },
    { title: "Remplace l'habitude par dhikr", desc: "Remplace l'habitude négative par du dhikr. Transforme chaque moment en adoration." },
    { title: "Demander pardon sincèrement", desc: "Demande pardon à Allah pour une chute récente. Le repentir sincère efface les péchés." },
    { title: "Rends visite à tes parents", desc: "Va voir tes parents, prends de leurs nouvelles, aide-les. « Le Paradis est aux pieds des mères. »" },
    { title: "Aide quelqu'un concrètement", desc: "Propose ton aide pour une tâche : courses, ménage, garde. La solidarité purifie le cœur." },
  ],
};

const FOCUS_ACTIONS: Record<SelectedSin, Array<{ title: string; desc: string }>> = {
  porno: [
    { title: "Éviter d'être seul avec un non-mahram", desc: "Ne reste jamais seul(e) avec une personne du sexe opposé sans mahram. Le Prophète (saws) a dit : « Un homme ne doit pas être seul avec une femme, car le tiers est Shaytan. »" },
    { title: "Maintenir les limites (pas de toucher)", desc: "Ne touche pas et ne te laisse pas toucher par un non-mahram. La poignée de main ou tout contact physique entre homme et femme non-mahram est interdit." },
    { title: "Faire les ablutions (wudu)", desc: "Quand la tentation vient, fais les ablutions complètes. Elles purifient le cœur et te recentrent sur Allah." },
    { title: "Quitter la situation à risque", desc: "Si tu te retrouves dans une situation de mixité à risque (solitude, lieu inapproprié), quitte immédiatement. Fuir la tentation est une force." },
    { title: "Prier 2 raka'at de repentir", desc: "Si tu as franchi une limite, prie 2 raka'at immédiatement et demande pardon. Le repentir sincère efface les péchés." },
    { title: "Dhikr continu : La ilaha illa Allah", desc: "Répète « La ilaha illa Allah » 100 fois dans la journée. Ce dhikr purifie le cœur et éloigne les mauvaises pensées." },
    { title: "Jeûner un jour (nafl)", desc: "Jeûne un jour surérogatoire (nafl). Le Prophète (saws) a dit : « Le jeûne est un bouclier. » Il protège de la tentation." },
    { title: "Se rappeler du mariage halal", desc: "Médite : le seul cadre permis pour une relation est le mariage. Tout ce qui est avant (fréquentation, relation amoureuse) est haram." },
    { title: "Réciter sourate An-Nour (verset 30-31)", desc: "Lis et médite les versets sur la chasteté et les limites. « Dis aux croyants de baisser leur regard et de préserver leur chasteté. »" },
    { title: "Éviter les lieux de mixité à risque", desc: "Identifie les situations à risque (sorties seuls, messages prolongés, etc.) et évite-les. Préviens plutôt que guérir." },
    { title: "Prier en groupe (jama'a)", desc: "Prie au moins une prière en groupe à la mosquée. La prière en groupe renforce la foi et éloigne les tentations." },
    { title: "Réciter Ayat al-Kursi après chaque prière", desc: "Récite Ayat al-Kursi (2:255) après chaque prière obligatoire. C'est une protection contre Shaytan." },
    { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah al-'azim » 100 fois. Le Prophète (saws) faisait istighfar 100 fois par jour." },
    { title: "Couper les messages ou appels prolongés", desc: "Si tu as des échanges avec quelqu'un qui alimente la tentation, réduis ou coupe. Les messages prolongés ouvrent la porte au haram." },
    { title: "Faire une bonne action immédiate", desc: "Dès qu'une mauvaise pensée vient, fais une bonne action (aide quelqu'un, appelle tes parents, donne l'aumône)." },
    { title: "Réciter sourate Al-Falaq et An-Nas", desc: "Récite sourate Al-Falaq (113) et An-Nas (114) 3 fois matin et soir. Ce sont des protections contre le mal." },
    { title: "Prier Tahajjud (prière de nuit)", desc: "Lève-toi la dernière partie de la nuit pour prier 2 raka'at. C'est le moment où Allah descend au ciel le plus bas." },
    { title: "Marche 15 min en récitant du dhikr", desc: "Quand tu marches, récite du dhikr. Transforme chaque pas en adoration et garde ton cœur occupé par Allah." },
    { title: "Poser des limites claires", desc: "Si quelqu'un te sollicite de manière illicite, refuse clairement. Dire non par crainte d'Allah est une force." },
    { title: "Réciter la dua de protection", desc: "Récite matin et soir : « Bismillah alladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa huwa as-sami' al-'alim »." },
    { title: "Faire salawat 100 fois", desc: "Envoie 100 salawat sur le Prophète (saws). Cela purifie le cœur et te rapproche du meilleur exemple." },
    { title: "Lire sur le mariage en Islam", desc: "Lis 10 minutes sur les conditions du mariage halal. Comprendre le cadre licite aide à éviter l'illicite." },
    { title: "Réciter les dhikr prescrits après chaque prière", desc: "Après chaque prière obligatoire, récite les dhikr prescrits. C'est une purification continue." },
    { title: "Éviter les conversations ambiguës", desc: "Ne participe pas aux discussions flirteuses ou aux sous-entendus. Garde tes échanges purs et respectueux." },
    { title: "Faire une aumône (sadaqa)", desc: "Donne une aumône, même petite. Le Prophète (saws) a dit : « L'aumône éteint le péché comme l'eau éteint le feu. »" },
    { title: "Réciter sourate Al-Baqarah", desc: "Lis sourate Al-Baqarah (2) progressivement. Cette sourate protège la maison de Shaytan pendant 3 jours." },
    { title: "En parler à un proche de confiance", desc: "Si tu es tenté(e), parle à un parent ou un frère/sœur en Islam. Le conseil et la prière d'autrui t'aident." },
    { title: "Prier avec concentration (khushu')", desc: "Prie une prière avec une concentration totale. Médite chaque mot. La prière préserve de la turpitude." },
  ],
  musique: [
    { title: "Remplacer par Coran obligatoire", desc: "Écoute 15 minutes de Coran récité au lieu de toute musique. Le Coran apaise les cœurs et élève l'âme." },
    { title: "Écouter nasheed halal uniquement", desc: "Si tu dois écouter quelque chose, choisis uniquement des nasheed halal (sans instruments de musique). Les voix a cappella sont permises." },
    { title: "Réciter Coran au lieu d'écouter", desc: "Récite toi-même 10 versets de Coran au lieu d'écouter de la musique. La récitation personnelle est meilleure." },
    { title: "Faire dhikr en musique de fond", desc: "Répète « Subhanallah, Alhamdulillah, Allahu Akbar » pendant que tu fais tes activités. C'est le meilleur remplacement." },
    { title: "Écouter des cours islamiques", desc: "Écoute 20 minutes de cours islamiques (tafsir, hadith, fiqh) au lieu de musique. C'est bénéfique pour ta foi." },
    { title: "Désactiver toutes les playlists", desc: "Supprime ou désactive toutes tes playlists musicales. Remplace-les par des playlists de Coran et nasheed halal." },
    { title: "Réciter sourate Al-Kahf le vendredi", desc: "Lis sourate Al-Kahf (18) chaque vendredi. C'est une sunna et cela remplace les distractions." },
    { title: "Réciter Subhanallah, Alhamdulillah 33 fois en conduisant", desc: "Quand tu conduis, récite du dhikr au lieu d'allumer la radio musicale. Transforme chaque trajet en dhikr." },
    { title: "Écouter Coran avant de dormir", desc: "Écoute 10 minutes de Coran avant de dormir au lieu de musique. Cela apaise et protège ta nuit." },
    { title: "Apprendre par cœur 3 versets", desc: "Mémorise 3 nouveaux versets du Coran. La mémorisation du Coran est meilleure que toute musique." },
    { title: "Réciter les dhikr du matin", desc: "Récite les dhikr du matin (adhkar as-sabah) au réveil. C'est une protection pour toute la journée." },
    { title: "Écouter des conférences islamiques", desc: "Écoute une conférence islamique de 30 minutes. C'est éducatif et spirituellement bénéfique." },
    { title: "Faire 20 min de sport en récitant du dhikr", desc: "Pendant le sport ou la marche, récite du dhikr au lieu d'écouter de la musique. Chaque pas devient une adoration." },
    { title: "Réciter sourate Ya-Sin", desc: "Lis sourate Ya-Sin (36) chaque jour. Cette sourate a de nombreux mérites et remplace les distractions." },
    { title: "Écouter Coran pendant les repas", desc: "Écoute du Coran pendant tes repas au lieu de musique. Cela bénit ta nourriture." },
    { title: "Réciter La ilaha illa Allah 50 fois pendant le ménage", desc: "Pendant les tâches ménagères, récite du dhikr. Transforme chaque action en adoration." },
    { title: "Réciter les 99 noms d'Allah", desc: "Apprends et récite les 99 noms d'Allah (Asma' al-Husna). C'est un dhikr puissant." },
    { title: "Écouter Coran en famille", desc: "Écoute du Coran avec ta famille pendant 15 minutes. C'est une bénédiction pour la maison." },
    { title: "Réciter sourate Al-Mulk avant de dormir", desc: "Lis sourate Al-Mulk (67) avant de dormir. C'est une protection et meilleure que toute musique." },
    { title: "Réciter « La ilaha illa Allah » dans ton cœur 5 min", desc: "Répète « La ilaha illa Allah » dans ton cœur pendant tes activités. Le dhikr silencieux est puissant." },
    { title: "Écouter des récitations différentes", desc: "Écoute différentes récitations du Coran (Qari différents). Cela diversifie et enrichit ton écoute." },
    { title: "Réciter Coran à voix haute", desc: "Récite le Coran à voix haute pendant 10 minutes. Le Prophète (saws) a dit que c'est meilleur que le dhikr silencieux." },
    { title: "Réciter Subhanallah 33 fois pendant une attente", desc: "Pendant les moments d'attente, récite du dhikr au lieu d'écouter de la musique. Utilise chaque instant." },
    { title: "Réciter sourate Al-Ikhlas 100 fois", desc: "Récite sourate Al-Ikhlas (112) 100 fois. C'est équivalent à réciter un tiers du Coran." },
    { title: "Écouter Coran pendant le travail", desc: "Si possible, écoute du Coran en fond sonore pendant le travail au lieu de musique. C'est bénéfique." },
    { title: "Dire Bismillah avant 5 actions aujourd'hui", desc: "Dis « Bismillah » avant chaque action (manger, boire, entrer, sortir). C'est une bénédiction." },
    { title: "Réciter les dhikr du soir", desc: "Récite les dhikr du soir (adhkar al-masa') avant de dormir. C'est une protection pour la nuit." },
  ],
  priere: [
    { title: "Prier Fajr à l'heure exacte", desc: "Lève-toi pour Fajr à son heure précise, même si c'est difficile. Le Prophète (saws) a dit : « Fajr est la prière la plus lourde pour les hypocrites. »" },
    { title: "Faire les ablutions avant l'appel", desc: "Fais les ablutions (wudu) 10 minutes avant l'appel à la prière. Sois prêt et concentré." },
    { title: "Prier en groupe (jama'a)", desc: "Prie au moins une prière en groupe à la mosquée. La prière en groupe vaut 27 fois plus qu'une prière seule." },
    { title: "Réciter les dhikr après chaque prière", desc: "Après chaque prière, récite les dhikr prescrits : « Astaghfirullah » 3 fois, « Allahumma antas-salam... », puis les 33 tasbih." },
    { title: "Prier les sunan rawatib", desc: "Prie les prières sunna avant et après les prières obligatoires (2 avant Fajr, 4 avant Dhuhr, etc.). Ce sont des protections." },
    { title: "Faire dua après chaque prière", desc: "Fais une supplication (dua) sincère après chaque prière. C'est le moment où les duas sont acceptées." },
    { title: "Prier avec concentration (khushu')", desc: "Prie une prière avec une concentration totale. Médite chaque mot, chaque mouvement. C'est la clé de la prière acceptée." },
    { title: "Réciter Coran dans la prière", desc: "Récite des sourates différentes dans chaque raka'a. Varie tes récitations pour rester concentré." },
    { title: "Prier Duha (prière du matin)", desc: "Prie 2 à 8 raka'at de Duha entre le lever du soleil et Dhuhr. C'est une sunna très méritoire." },
    { title: "Faire les ablutions avant chaque prière", desc: "Renouvelle tes ablutions avant chaque prière, même si elles sont encore valides. C'est une purification supplémentaire." },
    { title: "Prier Witr avant de dormir", desc: "Prie la prière Witr (impair) avant de dormir. C'est une sunna importante que le Prophète (saws) ne délaissait jamais." },
    { title: "Réciter Ayat al-Kursi après chaque prière", desc: "Récite Ayat al-Kursi (2:255) après chaque prière obligatoire. C'est une protection contre Shaytan." },
    { title: "Prier Tahajjud (prière de nuit)", desc: "Lève-toi la dernière partie de la nuit pour prier 2 raka'at minimum. C'est le moment où Allah descend au ciel le plus bas." },
    { title: "Réciter Subhanallah, Alhamdulillah, Allahu Akbar 33 fois entre 2 prières", desc: "Entre chaque prière, récite du dhikr : « Subhanallah, Alhamdulillah, La ilaha illa Allah, Allahu Akbar »." },
    { title: "Prier avec les vêtements propres", desc: "Porte des vêtements propres et couvrants pour la prière. Respecte la tenue islamique." },
    { title: "Réciter sourate Al-Kahf le vendredi", desc: "Lis sourate Al-Kahf (18) chaque vendredi. C'est une sunna et une lumière pour la semaine." },
    { title: "Faire les ablutions même si propres", desc: "Fais les ablutions avant chaque prière même si tu es déjà pur. C'est une purification spirituelle." },
    { title: "Prier les prières surérogatoires", desc: "Prie les prières surérogatoires (nafl) : 2 avant Fajr, 4 avant Dhuhr, 2 après Maghrib, etc." },
    { title: "Réciter les invocations de la prière", desc: "Récite toutes les invocations prescrites dans la prière : après takbir, dans le ruku', dans le sujud, etc." },
    { title: "Prier avec lenteur et révérence", desc: "Prie avec lenteur, sans précipitation. Le Prophète (saws) priait avec calme et révérence." },
    { title: "Faire dua qunoot dans Witr", desc: "Dans la prière Witr, récite le dua qunoot. C'est une sunna importante." },
    { title: "Prier en direction de la Qibla", desc: "Vérifie toujours que tu es bien orienté vers la Qibla. C'est une condition de validité." },
    { title: "Réciter les dhikr du matin et du soir", desc: "Récite les dhikr du matin (adhkar as-sabah) et du soir (adhkar al-masa'). Ce sont des protections." },
    { title: "Prier avec les souliers propres", desc: "Si tu pries avec des souliers, assure-toi qu'ils sont propres. Respecte la propreté dans la prière." },
    { title: "Aller à la mosquée à pied en récitant du dhikr", desc: "Quand tu vas à la mosquée, récite du dhikr. Chaque pas vers la mosquée efface un péché." },
    { title: "Prier les prières à leur heure exacte", desc: "Prie chaque prière à son heure exacte, sans retard. « La prière à l'heure est meilleure. »" },
    { title: "Réciter Coran avant la prière", desc: "Lis quelques versets du Coran avant de commencer la prière. Cela prépare ton cœur." },
    { title: "Faire les ablutions complètes", desc: "Fais les ablutions complètes (ghusl) si nécessaire. La propreté est la moitié de la foi." },
  ],
  colere: [
    { title: "Faire les ablutions immédiatement", desc: "Dès que la colère monte, fais les ablutions (wudu) complètes. Le Prophète (saws) a dit : « La colère vient de Shaytan, et Shaytan est créé de feu. Le feu s'éteint avec l'eau. »" },
    { title: "Changer de posture (sunna)", desc: "Si tu es debout, assieds-toi. Si tu es assis, allonge-toi. Le Prophète (saws) a enseigné cette méthode pour maîtriser la colère." },
    { title: "Réciter la protection contre Shaytan", desc: "Récite immédiatement : « A'udhu billahi min ash-shaytan ar-rajim » plusieurs fois. C'est une protection." },
    { title: "Se taire et compter", desc: "Garde le silence et compte jusqu'à 10 en récitant « Astaghfirullah » à chaque nombre. Le Prophète (saws) a dit : « Si l'un de vous se met en colère, qu'il se taise. »" },
    { title: "Réciter le hadith sur la force", desc: "Récite et médite : « Le fort n'est pas celui qui vainc par la force, mais celui qui se maîtrise dans la colère. » (Bukhari)" },
    { title: "Réciter « La ilaha illa Allah » 100 fois", desc: "Répète « La ilaha illa Allah » 100 fois. Le dhikr apaise le cœur et éloigne la colère." },
    { title: "Prier 2 raka'at de repentir", desc: "Si tu as exprimé ta colère de manière haram, prie 2 raka'at immédiatement et demande pardon." },
    { title: "Réciter sourate Al-Falaq", desc: "Récite sourate Al-Falaq (113) 3 fois. C'est une protection contre le mal, y compris la colère." },
    { title: "Faire une pause et sortir", desc: "Quitte l'endroit où tu es. Va faire une promenade en récitant du dhikr. Le changement d'environnement aide." },
    { title: "Réciter la dua de protection", desc: "Récite : « Allahumma inni a'udhu bika min hamazati ch-shayatin » (Ô Allah, je cherche refuge en Toi contre les suggestions de Shaytan)." },
    { title: "Se rappeler la récompense", desc: "Rappelle-toi : celui qui maîtrise sa colère alors qu'il pourrait se venger, Allah remplira son cœur de foi le Jour du Jugement." },
    { title: "Respirer 10 fois : Allah à l'inspire, Al-Ghafur à l'expire", desc: "Inspire en disant « Allah », expire en disant « Al-Ghafur » (Le Pardonneur). Respire profondément avec dhikr." },
    { title: "Réciter Coran pour apaiser", desc: "Lis quelques versets du Coran. Le Coran apaise les cœurs : « N'est-ce pas par l'évocation d'Allah que s'apaisent les cœurs ? »" },
    { title: "Faire une bonne action immédiate", desc: "Dès que la colère monte, fais une bonne action (aide quelqu'un, donne l'aumône). Cela transforme la colère en bien." },
    { title: "Réciter les noms d'Allah", desc: "Répète « Ya Halim, Ya Ghafur, Ya Rahim » (Ô Le Clément, Le Pardonneur, Le Miséricordieux). Imite les attributs d'Allah." },
    { title: "Prier en groupe", desc: "Va prier à la mosquée. La prière en groupe apaise et recentre." },
    { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah al-'azim » 100 fois. Le repentir purifie le cœur de la colère." },
    { title: "Réciter sourate An-Nas", desc: "Récite sourate An-Nas (114) 3 fois. C'est une protection contre les maux, y compris la colère." },
    { title: "Se rappeler du pardon", desc: "Rappelle-toi : Allah pardonne, alors pardonne aussi. « Pardonne aux autres, Allah te pardonnera. »" },
    { title: "Réciter « La ilaha illa Allah » dans ton cœur 5 min", desc: "Répète « Subhanallah, Alhamdulillah, La ilaha illa Allah, Allahu Akbar » dans ton cœur. Le dhikr silencieux est puissant." },
    { title: "Réciter la dua du matin", desc: "Récite les dhikr du matin (adhkar as-sabah). C'est une protection pour toute la journée contre la colère." },
    { title: "Faire une aumône", desc: "Donne une aumône, même petite. « L'aumône éteint le péché comme l'eau éteint le feu. »" },
    { title: "Réciter sourate Al-Ikhlas", desc: "Récite sourate Al-Ikhlas (112) 10 fois. Cette sourate apaise le cœur." },
    { title: "Prier avec concentration", desc: "Prie une prière avec une concentration totale. La prière recentre et apaise." },
    { title: "Marche 15 min en récitant du dhikr", desc: "Marche en récitant du dhikr. Le mouvement physique avec le dhikr aide à maîtriser la colère." },
    { title: "Réciter les dhikr du soir", desc: "Récite les dhikr du soir (adhkar al-masa'). C'est une protection pour la nuit." },
    { title: "Se rappeler de la patience", desc: "Rappelle-toi : « Et Allah aime les patients. » (3:146) La patience est meilleure que la colère." },
    { title: "Réciter Subhanallah, Alhamdulillah, Allahu Akbar 33 fois avant de dormir", desc: "Avant de dormir, récite « Subhanallah, Alhamdulillah, Allahu Akbar » 33 fois chacune. Cela purifie." },
  ],
  drogue: [
    { title: "Faire les ablutions et prier", desc: "Dès que l'envie vient, fais les ablutions (wudu) et prie 2 raka'at. La prière éloigne les mauvaises pensées." },
    { title: "Réciter la protection contre Shaytan", desc: "Récite immédiatement : « A'udhu billahi min ash-shaytan ar-rajim » plusieurs fois. C'est une protection." },
    { title: "Réciter « La ilaha illa Allah » 100 fois", desc: "Répète « La ilaha illa Allah » 100 fois. Le dhikr purifie le cœur et éloigne les addictions." },
    { title: "Prier en groupe à la mosquée", desc: "Va prier à la mosquée. La prière en groupe renforce la foi et éloigne les tentations." },
    { title: "Réciter Coran pour apaiser", desc: "Lis ou écoute 15 minutes de Coran. Le Coran apaise les cœurs et élève l'âme." },
    { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah al-'azim » 100 fois. Le repentir purifie et renforce la volonté." },
    { title: "Éviter les lieux à risque", desc: "Évite complètement les lieux où tu consommais. Change de route, change d'environnement." },
    { title: "Faire une bonne action immédiate", desc: "Dès que l'envie vient, fais une bonne action (aide quelqu'un, donne l'aumône, appelle tes parents)." },
    { title: "Réciter sourate Al-Falaq et An-Nas", desc: "Récite sourate Al-Falaq (113) et An-Nas (114) 3 fois matin et soir. Ce sont des protections." },
    { title: "Marche 15 min en récitant du dhikr", desc: "Marche 15 minutes en récitant du dhikr. Le mouvement physique avec le dhikr aide à surmonter l'addiction." },
    { title: "Prier Tahajjud (prière de nuit)", desc: "Lève-toi la dernière partie de la nuit pour prier 2 raka'at. C'est le moment où Allah descend au ciel le plus bas." },
    { title: "Réciter les dhikr du matin", desc: "Récite les dhikr du matin (adhkar as-sabah) au réveil. C'est une protection pour toute la journée." },
    { title: "Faire une aumône", desc: "Donne une aumône, même petite. « L'aumône éteint le péché comme l'eau éteint le feu. »" },
    { title: "Réciter sourate Al-Mulk", desc: "Lis sourate Al-Mulk (67) avant de dormir. Cette sourate protège et renforce la foi." },
    { title: "Réciter Subhanallah, Alhamdulillah, Allahu Akbar 33 fois avant de dormir", desc: "Avant de dormir, récite « Subhanallah, Alhamdulillah, Allahu Akbar » 33 fois chacune." },
    { title: "Écouter Coran au lieu de consommer", desc: "Quand l'envie vient, écoute du Coran récité pendant 20 minutes. Le Coran apaise et élève." },
    { title: "Faire les ablutions complètes (ghusl)", desc: "Fais les ablutions complètes (ghusl) pour te purifier. La propreté est la moitié de la foi." },
    { title: "Réciter la dua de protection", desc: "Récite : « Allahumma a'inni ala dhikrika wa chukrika wa husni 'ibadatika » (Ô Allah, aide-moi à T'évoquer...)." },
    { title: "Prier avec concentration", desc: "Prie une prière avec une concentration totale. La prière recentre et renforce la volonté." },
    { title: "Réciter « La ilaha illa Allah » dans ton cœur 5 min", desc: "Répète « La ilaha illa Allah » dans ton cœur pendant tes activités. Le dhikr silencieux est puissant." },
    { title: "Réciter sourate Al-Ikhlas", desc: "Récite sourate Al-Ikhlas (112) 100 fois. C'est équivalent à réciter un tiers du Coran." },
    { title: "Réciter les dhikr prescrits après chaque prière", desc: "Après chaque prière obligatoire, récite les dhikr prescrits. C'est une purification continue." },
    { title: "Réciter les dhikr du soir", desc: "Récite les dhikr du soir (adhkar al-masa') avant de dormir. C'est une protection pour la nuit." },
    { title: "Faire une supplication sincère", desc: "Fais une dua sincère : « Rabbi a'inni wa la tu'a'in 'alayya, wa unsurni wa la tansurni 'alayya »." },
    { title: "Réciter Coran à voix haute", desc: "Récite le Coran à voix haute pendant 10 minutes. Le Prophète (saws) a dit que c'est meilleur." },
    { title: "Faire du dhikr en faisant le sport", desc: "Pendant le sport ou la marche, récite du dhikr. Transforme chaque activité en adoration." },
    { title: "Prier les prières surérogatoires", desc: "Prie les prières surérogatoires (nafl) : Duha, Witr, Tahajjud. Ce sont des protections." },
    { title: "Réciter les 99 noms d'Allah", desc: "Apprends et récite les 99 noms d'Allah (Asma' al-Husna). C'est un dhikr puissant." },
    { title: "Réciter Subhanallah 33 fois pendant une attente", desc: "Pendant les moments d'attente, récite du dhikr. Utilise chaque instant pour te rapprocher d'Allah." },
  ],
  alcool: [
    { title: "Refuser avec fermeté islamique", desc: "Si proposé, refuse en disant : « L'alcool est haram, je ne bois pas. » Sois ferme dans ta foi." },
    { title: "Réciter la protection", desc: "Avant un contexte social, récite : « A'udhu billahi min ash-shaytan ar-rajim » plusieurs fois." },
    { title: "Faire les ablutions et prier", desc: "Dès que l'envie vient, fais les ablutions (wudu) et prie 2 raka'at. La prière éloigne les mauvaises pensées." },
    { title: "Réciter le verset sur l'alcool", desc: "Lis et médite le verset : « Ô les croyants ! Le vin, le jeu de hasard, les pierres dressées... sont une abomination. » (5:90)" },
    { title: "Réciter « La ilaha illa Allah » 100 fois", desc: "Répète « La ilaha illa Allah » 100 fois. Le dhikr purifie le cœur et renforce la volonté." },
    { title: "Prier en groupe à la mosquée", desc: "Va prier à la mosquée. La prière en groupe renforce la foi et éloigne les tentations." },
    { title: "Réciter Coran pour apaiser", desc: "Lis ou écoute 15 minutes de Coran. Le Coran apaise les cœurs et élève l'âme." },
    { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah al-'azim » 100 fois. Le repentir purifie et renforce la volonté." },
    { title: "Éviter les lieux à risque", desc: "Évite complètement les bars, les soirées avec alcool. Change d'environnement social si nécessaire." },
    { title: "Faire une bonne action immédiate", desc: "Dès que l'envie vient, fais une bonne action (aide quelqu'un, donne l'aumône, appelle tes parents)." },
    { title: "Réciter sourate Al-Falaq et An-Nas", desc: "Récite sourate Al-Falaq (113) et An-Nas (114) 3 fois matin et soir. Ce sont des protections." },
    { title: "Marche 15 min en récitant du dhikr", desc: "Marche 15 minutes en récitant du dhikr. Le mouvement physique avec le dhikr aide à surmonter." },
    { title: "Prier Tahajjud (prière de nuit)", desc: "Lève-toi la dernière partie de la nuit pour prier 2 raka'at. C'est le moment où Allah descend." },
    { title: "Réciter les dhikr du matin", desc: "Récite les dhikr du matin (adhkar as-sabah) au réveil. C'est une protection pour toute la journée." },
    { title: "Faire une aumône", desc: "Donne une aumône, même petite. « L'aumône éteint le péché comme l'eau éteint le feu. »" },
    { title: "Réciter sourate Al-Mulk", desc: "Lis sourate Al-Mulk (67) avant de dormir. Cette sourate protège et renforce la foi." },
    { title: "Réciter Subhanallah, Alhamdulillah, Allahu Akbar 33 fois avant de dormir", desc: "Avant de dormir, récite « Subhanallah, Alhamdulillah, Allahu Akbar » 33 fois chacune." },
    { title: "Boire de l'eau avec dhikr", desc: "Quand tu bois, dis « Bismillah » avant et « Alhamdulillah » après. Transforme chaque gorgée en dhikr." },
    { title: "Faire les ablutions complètes (ghusl)", desc: "Fais les ablutions complètes (ghusl) pour te purifier. La propreté est la moitié de la foi." },
    { title: "Réciter la dua de protection", desc: "Récite : « Rabbi adkhilni mudkhala sidqin wa akhrijni mukhraja sidqin » (Mon Seigneur, fais-moi entrer...)." },
    { title: "Prier avec concentration", desc: "Prie une prière avec une concentration totale. La prière recentre et renforce la volonté." },
    { title: "Réciter « La ilaha illa Allah » dans ton cœur 5 min", desc: "Répète « La ilaha illa Allah » dans ton cœur pendant tes activités. Le dhikr silencieux est puissant." },
    { title: "Réciter sourate Al-Ikhlas", desc: "Récite sourate Al-Ikhlas (112) 100 fois. C'est équivalent à réciter un tiers du Coran." },
    { title: "Réciter les dhikr prescrits après chaque prière", desc: "Après chaque prière obligatoire, récite les dhikr prescrits. C'est une purification continue." },
    { title: "Réciter les dhikr du soir", desc: "Récite les dhikr du soir (adhkar al-masa') avant de dormir. C'est une protection pour la nuit." },
    { title: "Faire une supplication sincère", desc: "Fais une dua sincère : « Allahumma a'inni ala dhikrika wa chukrika wa husni 'ibadatika »." },
    { title: "Réciter Coran à voix haute", desc: "Récite le Coran à voix haute pendant 10 minutes. Le Prophète (saws) a dit que c'est meilleur." },
    { title: "Faire du dhikr en faisant le sport", desc: "Pendant le sport ou la marche, récite du dhikr. Transforme chaque activité en adoration." },
    { title: "Prier les prières surérogatoires", desc: "Prie les prières surérogatoires (nafl) : Duha, Witr, Tahajjud. Ce sont des protections." },
  ],
  jeux: [
    { title: "Remplacer par Coran ou dhikr", desc: "À l'heure habituelle de jeu, lis 15 minutes de Coran ou fais du dhikr. Utilise ce temps pour Allah." },
    { title: "Désinstaller les apps de jeux", desc: "Désinstalle complètement toutes les apps de jeux. Le Prophète (saws) a interdit le gaspillage du temps." },
    { title: "Faire les ablutions et prier", desc: "Dès que l'envie de jouer vient, fais les ablutions (wudu) et prie 2 raka'at. La prière éloigne les distractions." },
    { title: "Réciter la protection", desc: "Avant d'utiliser un appareil, récite : « A'udhu billahi min ash-shaytan ar-rajim » plusieurs fois." },
    { title: "Réciter « La ilaha illa Allah » 100 fois", desc: "Répète « La ilaha illa Allah » 100 fois. Le dhikr purifie le cœur et éloigne les addictions." },
    { title: "Prier en groupe à la mosquée", desc: "Va prier à la mosquée. La prière en groupe renforce la foi et éloigne les distractions." },
    { title: "Réciter Coran pour apaiser", desc: "Lis ou écoute 15 minutes de Coran. Le Coran apaise les cœurs et élève l'âme." },
    { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah al-'azim » 100 fois. Le repentir purifie et renforce la volonté." },
    { title: "Bloquer les jeux 2h minimum", desc: "Active un bloqueur d'apps pendant 2h minimum. Utilise ce temps pour lire Coran ou faire dhikr." },
    { title: "Faire une bonne action immédiate", desc: "Dès que l'envie de jouer vient, fais une bonne action (aide quelqu'un, appelle tes parents, donne l'aumône)." },
    { title: "Réciter sourate Al-Falaq et An-Nas", desc: "Récite sourate Al-Falaq (113) et An-Nas (114) 3 fois matin et soir. Ce sont des protections." },
    { title: "Marche 15 min en récitant du dhikr", desc: "Marche 15 minutes en récitant du dhikr. Le mouvement physique avec le dhikr aide à surmonter." },
    { title: "Prier Tahajjud (prière de nuit)", desc: "Lève-toi la dernière partie de la nuit pour prier 2 raka'at. C'est le moment où Allah descend." },
    { title: "Réciter les dhikr du matin", desc: "Récite les dhikr du matin (adhkar as-sabah) au réveil. C'est une protection pour toute la journée." },
    { title: "Faire une aumône", desc: "Donne une aumône, même petite. « L'aumône éteint le péché comme l'eau éteint le feu. »" },
    { title: "Réciter sourate Al-Mulk", desc: "Lis sourate Al-Mulk (67) avant de dormir. Cette sourate protège et renforce la foi." },
    { title: "Réciter Subhanallah, Alhamdulillah, Allahu Akbar 33 fois avant de dormir", desc: "Avant de dormir, récite « Subhanallah, Alhamdulillah, Allahu Akbar » 33 fois chacune." },
    { title: "Écouter Coran au lieu de jouer", desc: "Quand l'envie de jouer vient, écoute du Coran récité pendant 20 minutes. Le Coran apaise." },
    { title: "Faire les ablutions complètes (ghusl)", desc: "Fais les ablutions complètes (ghusl) pour te purifier. La propreté est la moitié de la foi." },
    { title: "Réciter la dua de protection", desc: "Récite : « Allahumma naqqina min adh-dhunub wal-khataya kama yunaqqa ath-thawb al-abyad min ad-danas »." },
    { title: "Prier avec concentration", desc: "Prie une prière avec une concentration totale. La prière recentre et renforce la volonté." },
    { title: "Réciter « La ilaha illa Allah » dans ton cœur 5 min", desc: "Répète « La ilaha illa Allah » dans ton cœur pendant tes activités. Le dhikr silencieux est puissant." },
    { title: "Réciter sourate Al-Ikhlas", desc: "Récite sourate Al-Ikhlas (112) 100 fois. C'est équivalent à réciter un tiers du Coran." },
    { title: "Réciter les dhikr prescrits après chaque prière", desc: "Après chaque prière obligatoire, récite les dhikr prescrits. C'est une purification continue." },
    { title: "Réciter les dhikr du soir", desc: "Récite les dhikr du soir (adhkar al-masa') avant de dormir. C'est une protection pour la nuit." },
    { title: "Faire une supplication sincère", desc: "Fais une dua sincère : « Rabbi a'inni wa la tu'a'in 'alayya, wa unsurni wa la tansurni 'alayya »." },
    { title: "Réciter Coran à voix haute", desc: "Récite le Coran à voix haute pendant 10 minutes. Le Prophète (saws) a dit que c'est meilleur." },
    { title: "Faire du dhikr en faisant le sport", desc: "Pendant le sport ou la marche, récite du dhikr. Transforme chaque activité en adoration." },
    { title: "Prier les prières surérogatoires", desc: "Prie les prières surérogatoires (nafl) : Duha, Witr, Tahajjud. Ce sont des protections." },
    { title: "Apprendre par cœur des versets", desc: "Mémorise 3 nouveaux versets du Coran. La mémorisation du Coran est meilleure que les jeux." },
  ],
  mensonge: [
    { title: "Réfléchir avant de parler", desc: "Avant de répondre, pause 2 secondes et demande-toi : « Est-ce vrai ? Est-ce bénéfique ? » Le Prophète (saws) ne disait que des paroles bénéfiques." },
    { title: "Corriger un mensonge passé", desc: "Si tu as menti récemment, corrige immédiatement auprès de la personne concernée. Le repentir nécessite la correction." },
    { title: "Réciter le hadith sur la vérité", desc: "Récite et médite : « La vérité mène à la piété, et la piété mène au Paradis. Le mensonge mène à la perversité, et la perversité mène à l'Enfer. » (Bukhari)" },
    { title: "Faire les ablutions et prier", desc: "Si tu as menti, fais les ablutions (wudu) et prie 2 raka'at de repentir. Demande pardon avec sincérité." },
    { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah » 100 fois. Le repentir purifie le cœur et renforce la sincérité." },
    { title: "Dire la vérité même si difficile", desc: "Dis une vérité que tu cachais, même si c'est difficile. « La vérité libère. » (Hadith)" },
    { title: "Réciter la dua pour les bonnes paroles", desc: "Récite : « Allahumma ihdini li-ahsani al-akhlaq, la yahdini li-ahsaniha illa anta » (Ô Allah, guide-moi vers les meilleures paroles...)." },
    { title: "Prier en groupe à la mosquée", desc: "Va prier à la mosquée. La prière en groupe renforce la sincérité et la véracité." },
    { title: "Réciter Coran pour apaiser", desc: "Lis ou écoute 15 minutes de Coran. Le Coran guide vers la vérité et la sincérité." },
    { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah al-'azim » 100 fois. Le repentir purifie et renforce la véracité." },
    { title: "Éviter les conversations futiles", desc: "Évite les conversations inutiles et les blagues mensongères. Le Prophète (saws) ne disait que des paroles bénéfiques." },
    { title: "Réciter sourate Al-Falaq et An-Nas", desc: "Récite sourate Al-Falaq (113) et An-Nas (114) 3 fois matin et soir. Ce sont des protections." },
    { title: "Marche 15 min en récitant du dhikr", desc: "Marche 15 minutes en récitant du dhikr. Le mouvement physique avec le dhikr aide à rester sincère." },
    { title: "Prier Tahajjud (prière de nuit)", desc: "Lève-toi la dernière partie de la nuit pour prier 2 raka'at. C'est le moment où Allah descend." },
    { title: "Réciter les dhikr du matin", desc: "Récite les dhikr du matin (adhkar as-sabah) au réveil. C'est une protection pour toute la journée." },
    { title: "Faire une aumône", desc: "Donne une aumône, même petite. « L'aumône éteint le péché comme l'eau éteint le feu. »" },
    { title: "Réciter sourate Al-Mulk", desc: "Lis sourate Al-Mulk (67) avant de dormir. Cette sourate protège et renforce la foi." },
    { title: "Réciter Subhanallah, Alhamdulillah, Allahu Akbar 33 fois avant de dormir", desc: "Avant de dormir, récite « Subhanallah, Alhamdulillah, Allahu Akbar » 33 fois chacune." },
    { title: "Dire « Bismillah » avant de parler", desc: "Avant de parler, dis « Bismillah » dans ton cœur. Cela te rappelle de dire la vérité." },
    { title: "Faire les ablutions complètes (ghusl)", desc: "Fais les ablutions complètes (ghusl) pour te purifier. La propreté est la moitié de la foi." },
    { title: "Réciter la dua pour la guidance", desc: "Récite : « Rabbi charrah li sadri wa yassir li amri wa ahlil 'uqdata min lisani yafqahu qawli »." },
    { title: "Prier avec concentration", desc: "Prie une prière avec une concentration totale. La prière recentre et renforce la sincérité." },
    { title: "Réciter « La ilaha illa Allah » dans ton cœur 5 min", desc: "Répète « La ilaha illa Allah » dans ton cœur pendant tes activités. Le dhikr silencieux est puissant." },
    { title: "Réciter sourate Al-Ikhlas", desc: "Récite sourate Al-Ikhlas (112) 100 fois. C'est équivalent à réciter un tiers du Coran." },
    { title: "Réciter les dhikr prescrits après chaque prière", desc: "Après chaque prière obligatoire, récite les dhikr prescrits. C'est une purification continue." },
    { title: "Réciter les dhikr du soir", desc: "Récite les dhikr du soir (adhkar al-masa') avant de dormir. C'est une protection pour la nuit." },
    { title: "Faire une supplication sincère", desc: "Fais une dua sincère : « Allahumma a'inni ala dhikrika wa chukrika wa husni 'ibadatika »." },
    { title: "Réciter Coran à voix haute", desc: "Récite le Coran à voix haute pendant 10 minutes. Le Prophète (saws) a dit que c'est meilleur." },
    { title: "Faire du dhikr en faisant le sport", desc: "Pendant le sport ou la marche, récite du dhikr. Transforme chaque activité en adoration." },
    { title: "Prier les prières surérogatoires", desc: "Prie les prières surérogatoires (nafl) : Duha, Witr, Tahajjud. Ce sont des protections." },
  ],
  regard: [
    { title: "Baisser le regard immédiatement", desc: "Dès qu'une image ou une personne non-mahram attire le regard, détourne immédiatement. Le Prophète (saws) a dit : « Le regard est une flèche empoisonnée d'Iblis. »" },
    { title: "Réciter la protection", desc: "Dès que le regard se pose sur quelque chose d'interdit, récite immédiatement : « A'udhu billahi min ash-shaytan ar-rajim » 3 fois." },
    { title: "Faire les ablutions", desc: "Si tu as regardé quelque chose d'interdit, fais les ablutions (wudu) immédiatement. C'est une purification." },
    { title: "Prier 2 raka'at de repentir", desc: "Prie 2 raka'at immédiatement après avoir baissé le regard. Demande pardon avec sincérité." },
    { title: "Éviter la solitude avec écran", desc: "Ne reste jamais seul avec un écran dans une pièce fermée. Le Prophète (saws) a interdit la solitude." },
    { title: "Réciter sourate An-Nur", desc: "Lis sourate An-Nur (24), verset 30-31 : « Dis aux croyants de baisser leur regard... » Médite ces versets." },
    { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah » 100 fois dans la journée. Le repentir purifie le regard." },
    { title: "Activer des filtres stricts", desc: "Active des filtres stricts sur tous tes appareils. Utilise des applications de contrôle parental." },
    { title: "Éviter les réseaux sociaux 2h", desc: "Désactive complètement les réseaux sociaux pendant 2h. Utilise ce temps pour lire Coran ou faire dhikr." },
    { title: "Réciter la dua de protection", desc: "Récite matin et soir : « Allahumma inna naj'aluka fi nuhurihim wa na'udhu bika min shururihim » (Ô Allah, nous plaçons Toi dans nos regards...)." },
    { title: "Marche 15 min en récitant du dhikr", desc: "Quand tu marches dans la rue, récite du dhikr et garde le regard baissé. Transforme chaque sortie en adoration." },
    { title: "Réciter sourate Al-Mulk", desc: "Lis sourate Al-Mulk (67) avant de dormir. Cette sourate protège et renforce la foi." },
    { title: "Prier en groupe", desc: "Va prier à la mosquée. La prière en groupe renforce la foi et éloigne les tentations." },
    { title: "Réciter Subhanallah, Alhamdulillah, Allahu Akbar 33 fois avant de dormir", desc: "Avant de dormir, récite « Subhanallah, Alhamdulillah, Allahu Akbar » 33 fois chacune. Cela protège ta nuit." },
    { title: "Éviter les images provocantes", desc: "Ne regarde jamais d'images de femmes non-mahram, même dans les publicités. Détourne immédiatement le regard." },
    { title: "Réciter Coran au lieu de scroll", desc: "Quand tu veux scroller, lis plutôt le Coran pendant 10 minutes. Le Coran élève l'âme." },
    { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah al-'azim » 100 fois. Le Prophète (saws) faisait istighfar 100 fois par jour." },
    { title: "Réciter sourate Al-Falaq et An-Nas", desc: "Récite sourate Al-Falaq (113) et An-Nas (114) 3 fois matin et soir. Ce sont des protections." },
    { title: "Faire une bonne action", desc: "Dès qu'une mauvaise pensée vient, fais immédiatement une bonne action (aide quelqu'un, appelle tes parents)." },
    { title: "Écouter Coran au lieu de regarder", desc: "Écoute du Coran récité pendant 15 minutes au lieu de regarder des écrans. Le Coran apaise les cœurs." },
    { title: "Réciter « La ilaha illa Allah » dans ton cœur 5 min", desc: "Répète « La ilaha illa Allah » dans ton cœur pendant tes activités. Le dhikr silencieux est puissant." },
    { title: "Réciter les dhikr du matin", desc: "Récite les dhikr du matin (adhkar as-sabah) au réveil. C'est une protection pour toute la journée." },
    { title: "Faire une aumône", desc: "Donne une aumône, même petite. « L'aumône éteint le péché comme l'eau éteint le feu. »" },
    { title: "Réciter sourate Al-Ikhlas", desc: "Récite sourate Al-Ikhlas (112) 100 fois. C'est équivalent à réciter un tiers du Coran." },
    { title: "Prier avec concentration", desc: "Prie une prière avec une concentration totale. La prière purifie le cœur et renforce la foi." },
    { title: "Réciter Subhanallah, Alhamdulillah 33 fois en conduisant", desc: "Quand tu conduis, récite du dhikr et garde le regard sur la route. Évite de regarder autour." },
    { title: "Réciter les dhikr du soir", desc: "Récite les dhikr du soir (adhkar al-masa') avant de dormir. C'est une protection pour la nuit." },
    { title: "Réciter les dhikr prescrits après chaque prière", desc: "Après chaque prière obligatoire, récite les dhikr prescrits. C'est une purification continue." },
    { title: "Éviter les conversations futiles", desc: "Évite les conversations inutiles et les blagues vulgaires. Le Prophète (saws) ne disait que des paroles bénéfiques." },
  ],
  parents: [
    { title: "Obéir à une demande sans rouspéter", desc: "Quand ton père ou ta mère te demande quelque chose (dans le halal), exécute tout de suite avec un « Oui » et sans grogner. « Et ne leur dis pas Ouf. » (17:23)" },
    { title: "Leur parler avec des paroles douces", desc: "Utilise des mots respectueux : « S'il te plaît », « Merci », « Je vais le faire ». Un mot doux est une aumône." },
    { title: "Demander pardon après un écart", desc: "Si tu as haussé le ton ou répondu mal, reviens vers eux et dis « Désolé(e), je n'aurais pas dû. » Le repentir envers eux efface le péché." },
    { title: "Passer du temps avec eux sans écran", desc: "Assieds-toi 10 minutes avec ton père ou ta mère, sans téléphone. Écoute-les. Ta présence est un acte d'adoration." },
    { title: "Faire une tâche sans qu'ils demandent", desc: "Range ta chambre, débarrasse la table ou aide à la maison sans qu'ils aient à te le demander. Devancer leur demande est une bienfaisance." },
    { title: "Réciter la dua pour les parents", desc: "Récite : « Rabbi ghfir li wa li walidayya » (Mon Seigneur, pardonne-moi et à mes parents). Invoque pour eux chaque jour." },
    { title: "Ne pas les contredire avec insolence", desc: "Si tu n'es pas d'accord, dis « Je comprends » puis explique calmement. Pas de « Mais non », pas de coupure de parole." },
    { title: "Leur offrir à manger ou à boire", desc: "Propose un verre d'eau, un thé ou une part de gâteau. Servir ses parents est une adoration." },
    { title: "Réciter sourate Al-Isra (17:23-24)", desc: "Lis et médite les versets sur le respect des parents. « Et ton Seigneur a décrété… d'être bienfaisant envers les père et mère. »" },
    { title: "Prier 2 raka'at et invoquer pour eux", desc: "Prie 2 raka'at et dans ta supplication demande à Allah de les préserver et de te donner la force de leur obéir." },
    { title: "Ne pas bouder", desc: "Si tu es fâché, parle calmement au lieu de faire la tête. La communication respectueuse fait partie de l'obéissance." },
    { title: "Leur dire merci ou Jazakallahou khayran", desc: "Remercie ton père ou ta mère pour une chose qu'ils font pour toi. La gratitude envers eux est gratitude envers Allah." },
    { title: "Accorder ton attention quand ils parlent", desc: "Quand ils te parlent, pose ton téléphone et regarde-les. Les écouter est un signe de respect." },
    { title: "Faire une aumône en leur nom", desc: "Donne une petite sadaqa en invoquant le bien pour tes parents. « Un enfant pieux qui prie pour eux » — les bonnes actions en leur faveur les atteignent." },
    { title: "Méditer le hadith « Le Paradis est aux pieds des mères »", desc: "Rappelle-toi : « Le Paradis est aux pieds des mères. » Chaque geste de respect envers eux te rapproche du Paradis." },
  ],
  autre: [
    { title: "Faire les ablutions et prier", desc: "Dès que la tentation vient, fais les ablutions (wudu) et prie 2 raka'at. La prière éloigne les mauvaises pensées." },
    { title: "Réciter la protection contre Shaytan", desc: "Récite immédiatement : « A'udhu billahi min ash-shaytan ar-rajim » plusieurs fois. C'est une protection." },
    { title: "Réciter « La ilaha illa Allah » 100 fois", desc: "Répète « La ilaha illa Allah » 100 fois. Le dhikr purifie le cœur et éloigne les péchés." },
    { title: "Prier en groupe à la mosquée", desc: "Va prier à la mosquée. La prière en groupe renforce la foi et éloigne les tentations." },
    { title: "Réciter Coran pour apaiser", desc: "Lis ou écoute 15 minutes de Coran. Le Coran apaise les cœurs et élève l'âme." },
    { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah al-'azim » 100 fois. Le repentir purifie et renforce la volonté." },
    { title: "Identifier le déclencheur", desc: "Note un déclencheur de ta lutte aujourd'hui. La connaissance de soi est la première étape." },
    { title: "Faire une bonne action immédiate", desc: "Dès que la tentation vient, fais une bonne action (aide quelqu'un, appelle tes parents, donne l'aumône)." },
    { title: "Réciter sourate Al-Falaq et An-Nas", desc: "Récite sourate Al-Falaq (113) et An-Nas (114) 3 fois matin et soir. Ce sont des protections." },
    { title: "Marche 15 min en récitant du dhikr", desc: "Marche 15 minutes en récitant du dhikr. Le mouvement physique avec le dhikr aide à surmonter." },
    { title: "Prier Tahajjud (prière de nuit)", desc: "Lève-toi la dernière partie de la nuit pour prier 2 raka'at. C'est le moment où Allah descend." },
    { title: "Réciter les dhikr du matin", desc: "Récite les dhikr du matin (adhkar as-sabah) au réveil. C'est une protection pour toute la journée." },
    { title: "Faire une aumône", desc: "Donne une aumône, même petite. « L'aumône éteint le péché comme l'eau éteint le feu. »" },
    { title: "Réciter sourate Al-Mulk", desc: "Lis sourate Al-Mulk (67) avant de dormir. Cette sourate protège et renforce la foi." },
    { title: "Réciter Subhanallah, Alhamdulillah, Allahu Akbar 33 fois avant de dormir", desc: "Avant de dormir, récite « Subhanallah, Alhamdulillah, Allahu Akbar » 33 fois chacune." },
    { title: "Lire un verset ou hadith", desc: "Lis ou écoute 1 verset ou 1 hadith qui te parle. La guidance vient d'Allah." },
    { title: "Faire les ablutions complètes (ghusl)", desc: "Fais les ablutions complètes (ghusl) pour te purifier. La propreté est la moitié de la foi." },
    { title: "Réciter la dua de guidance", desc: "Récite : « Rabbi charrah li sadri wa yassir li amri wa ahlil 'uqdata min lisani yafqahu qawli »." },
    { title: "Prier avec concentration", desc: "Prie une prière avec une concentration totale. La prière recentre et renforce la volonté." },
    { title: "Réciter « La ilaha illa Allah » dans ton cœur 5 min", desc: "Répète « La ilaha illa Allah » dans ton cœur pendant tes activités. Le dhikr silencieux est puissant." },
    { title: "Réciter sourate Al-Ikhlas", desc: "Récite sourate Al-Ikhlas (112) 100 fois. C'est équivalent à réciter un tiers du Coran." },
    { title: "Réciter les dhikr prescrits après chaque prière", desc: "Après chaque prière obligatoire, récite les dhikr prescrits. C'est une purification continue." },
    { title: "Réciter les dhikr du soir", desc: "Récite les dhikr du soir (adhkar al-masa') avant de dormir. C'est une protection pour la nuit." },
    { title: "Faire une supplication sincère", desc: "Fais une dua sincère : « Allahumma a'inni ala dhikrika wa chukrika wa husni 'ibadatika »." },
    { title: "Réciter Coran à voix haute", desc: "Récite le Coran à voix haute pendant 10 minutes. Le Prophète (saws) a dit que c'est meilleur." },
    { title: "Faire du dhikr en faisant le sport", desc: "Pendant le sport ou la marche, récite du dhikr. Transforme chaque activité en adoration." },
    { title: "Prier les prières surérogatoires", desc: "Prie les prières surérogatoires (nafl) : Duha, Witr, Tahajjud. Ce sont des protections." },
    { title: "Remplace l'habitude par dhikr", desc: "Remplace l'habitude négative par du dhikr. Transforme chaque moment en adoration." },
    { title: "Demander pardon sincèrement", desc: "Demande pardon à Allah pour une chute récente. Le repentir sincère efface les péchés." },
  ],
};

const BASE_ACTIONS_PRIERE: Array<{ title: string; desc: string }> = [
  { title: "Prier Fajr à l'heure exacte", desc: "Lève-toi pour Fajr à son heure précise. Le Prophète (saws) a dit : « Fajr est la prière la plus lourde pour les hypocrites. »" },
  { title: "Réciter les dhikr du matin", desc: "Récite les dhikr du matin (adhkar as-sabah) au réveil : « Subhanallah, Alhamdulillah, Allahu Akbar » 33 fois chacune, puis « La ilaha illa Allah wahdahu la sharika lahu... »" },
  { title: "Réciter la dua du réveil", desc: "Récite la dua du réveil : « Alhamdulillah alladhi ahyana ba'da ma amatana wa ilayhi an-nushur » (Louange à Allah qui nous a fait vivre après nous avoir fait mourir...)." },
  { title: "Envoyer 100 salawat sur le Prophète", desc: "Envoie 100 salawat sur le Prophète (saws) : « Allahumma salli 'ala Muhammad wa 'ala ali Muhammad ». C'est une purification du cœur." },
  { title: "Lire Coran 10 minutes minimum", desc: "Lis au moins 10 minutes de Coran chaque jour. Le Coran est une lumière qui chasse les ténèbres du cœur." },
  { title: "Réciter Ayat al-Kursi après chaque prière", desc: "Récite Ayat al-Kursi (2:255) après chaque prière obligatoire. C'est une protection contre Shaytan jusqu'à la prière suivante." },
  { title: "Faire les ablutions avant chaque prière", desc: "Renouvelle tes ablutions avant chaque prière, même si elles sont encore valides. C'est une purification supplémentaire." },
  { title: "Prier les sunan rawatib", desc: "Prie les prières sunna avant et après les prières obligatoires (2 avant Fajr, 4 avant Dhuhr, 2 après Maghrib, etc.). Ce sont des protections." },
  { title: "Faire dua après chaque prière", desc: "Fais une supplication (dua) sincère après chaque prière. C'est le moment où les duas sont acceptées." },
  { title: "Réciter les dhikr après chaque prière", desc: "Après chaque prière, récite les dhikr prescrits : « Astaghfirullah » 3 fois, « Allahumma antas-salam... », puis les 33 tasbih." },
  { title: "Prier Duha (prière du matin)", desc: "Prie 2 à 8 raka'at de Duha entre le lever du soleil et Dhuhr. C'est une sunna très méritoire." },
  { title: "Prier Witr avant de dormir", desc: "Prie la prière Witr (impair) avant de dormir. C'est une sunna importante que le Prophète (saws) ne délaissait jamais." },
  { title: "Réciter sourate Al-Kahf le vendredi", desc: "Lis sourate Al-Kahf (18) chaque vendredi. C'est une sunna et une lumière pour la semaine." },
  { title: "Réciter Subhanallah, Alhamdulillah, Allahu Akbar 33 fois entre 2 prières", desc: "Entre chaque prière, récite du dhikr : « Subhanallah, Alhamdulillah, La ilaha illa Allah, Allahu Akbar »." },
  { title: "Prier avec concentration (khushu')", desc: "Prie une prière avec une concentration totale. Médite chaque mot, chaque mouvement. C'est la clé de la prière acceptée." },
  { title: "Réciter Coran dans la prière", desc: "Récite des sourates différentes dans chaque raka'a. Varie tes récitations pour rester concentré." },
  { title: "Faire les ablutions complètes (ghusl)", desc: "Fais les ablutions complètes (ghusl) si nécessaire. La propreté est la moitié de la foi." },
  { title: "Réciter les invocations de la prière", desc: "Récite toutes les invocations prescrites dans la prière : après takbir, dans le ruku', dans le sujud, etc." },
  { title: "Prier avec lenteur et révérence", desc: "Prie avec lenteur, sans précipitation. Le Prophète (saws) priait avec calme et révérence." },
  { title: "Faire dua qunoot dans Witr", desc: "Dans la prière Witr, récite le dua qunoot. C'est une sunna importante." },
  { title: "Prier en direction de la Qibla", desc: "Vérifie toujours que tu es bien orienté vers la Qibla. C'est une condition de validité." },
  { title: "Réciter les dhikr du soir", desc: "Récite les dhikr du soir (adhkar al-masa') avant de dormir. C'est une protection pour la nuit." },
  { title: "Aller à la mosquée à pied en récitant du dhikr", desc: "Quand tu vas à la mosquée, récite du dhikr. Chaque pas vers la mosquée efface un péché." },
  { title: "Prier les prières à leur heure exacte", desc: "Prie chaque prière à son heure exacte, sans retard. « La prière à l'heure est meilleure. »" },
  { title: "Réciter Coran avant la prière", desc: "Lis quelques versets du Coran avant de commencer la prière. Cela prépare ton cœur." },
  { title: "Réciter « La ilaha illa Allah » dans ton cœur 5 min", desc: "Répète « La ilaha illa Allah » dans ton cœur pendant tes activités. Le dhikr silencieux est puissant." },
  { title: "Réciter sourate Al-Ikhlas 100 fois", desc: "Récite sourate Al-Ikhlas (112) 100 fois. C'est équivalent à réciter un tiers du Coran." },
  { title: "Réciter Subhanallah, Alhamdulillah, Allahu Akbar 33 fois avant de dormir", desc: "Avant de dormir, récite « Subhanallah, Alhamdulillah, Allahu Akbar » 33 fois chacune. Cela protège ta nuit." },
  { title: "Réciter sourate Al-Mulk avant de dormir", desc: "Lis sourate Al-Mulk (67) avant de dormir. Cette sourate protège des châtiments de la tombe." },
];

/** Actions spécifiques pour les péchés personnalisés ("autre") — mappés par mot-clé */
export const CUSTOM_SIN_ACTIONS: Record<string, { action1: Array<{ title: string; desc: string }>; focus: Array<{ title: string; desc: string }> }> = {
  gaspillage: {
    action1: [
      { title: "Dire Alhamdulillah avant et après chaque repas", desc: "Remercie Allah pour chaque bouchée. La gratitude (shukr) nous empêche de gaspiller. Le Prophète (saws) ne critiquait jamais la nourriture." },
      { title: "Finis ton assiette sans laisser de restes", desc: "Ne prends que ce que tu peux manger. Le Prophète (saws) a dit : « Nul d'entre vous ne doit se lever de son repas tant qu'il n'en a pas mangé jusqu'au bout. »" },
      { title: "Réciter le verset anti-gaspillage", desc: "Lis et médite : « Et ne gaspille pas, car Allah n'aime pas les gaspilleurs. » (6:141) et « Mangez et buvez mais ne gaspillez pas. » (7:31)" },
      { title: "Faire une liste avant d'aller faire les courses", desc: "Note ce dont tu as vraiment besoin. Achète uniquement le nécessaire. Le gaspillage commence souvent par des achats impulsifs." },
      { title: "Donner ce que tu n'utilises plus", desc: "Donne à quelqu'un dans le besoin : vêtements, nourriture non ouverte, objets. Transformer l'excès en aumône." },
      { title: "Dire Bismillah avant manger et Alhamdulillah après", desc: "Dis « Bismillah » avant de manger, « Alhamdulillah » après. Chaque gorgée, chaque bouchée compte. La conscience réduit le gaspillage." },
      { title: "Utiliser l'eau avec parcimonie", desc: "Réduis le débit de l'eau pour les ablutions et la douche. Le Prophète (saws) faisait ses ablutions avec une quantité minimale d'eau." },
      { title: "Réciter les dhikr du matin", desc: "Récite les dhikr du matin (adhkar as-sabah). La gratitude matinale oriente la journée vers la modération." },
      { title: "Faire une aumône avec l'argent économisé", desc: "Calcule ce que tu aurais gaspillé aujourd'hui et donne cette somme en sadaqa. Transforme l'excès en bien." },
      { title: "Consommer les restes avant de cuisiner du neuf", desc: "Avant de préparer un nouveau repas, mange ce qui reste. « Le meilleur d'entre vous est celui qui nourrit les gens. »" },
      { title: "Réciter sourate Al-Ikhlas 100 fois", desc: "Récite sourate Al-Ikhlas (112) 100 fois. Médite : Allah te suffit, tu n'as pas besoin de l'excès." },
      { title: "Prier avec concentration", desc: "Prie une prière en pensant à la modération. La prière recentre sur l'essentiel." },
      { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah » 100 fois pour le gaspillage passé. Le repentir ouvre à une vie plus sobre." },
    ],
    focus: [
      { title: "Ne pas gaspiller l'eau des ablutions", desc: "Fais tes ablutions (wudu) avec la quantité minimale. Le Prophète (saws) utilisait un mudd (environ 700g) d'eau pour les ablutions." },
      { title: "Manger jusqu'à 80% de sa faim", desc: "Le Prophète (saws) a dit : « Le fils d'Adam ne remplit pas de récipient pire que son ventre. » Manger modérément évite le gaspillage et préserve la santé." },
      { title: "Vérifier les dates de péremption", desc: "Range ta nourriture par date et consomme d'abord ce qui expire bientôt. Préviens le gaspillage par l'organisation." },
      { title: "Partager un repas avec quelqu'un", desc: "Invite quelqu'un à manger avec toi. Partager réduit le gaspillage et multiplie les bénédictions." },
      { title: "Réciter Alhamdulillah 100 fois", desc: "Répète « Alhamdulillah » 100 fois. La gratitude est l'antidote au gaspillage." },
      { title: "Donner de la nourriture avant qu'elle ne périsse", desc: "Si tu as des aliments qui vont expirer, donne-les à un voisin ou une association avant qu'il soit trop tard." },
      { title: "Ne pas surcharger son assiette", desc: "Prends de petites portions. Tu peux te resservir si tu as faim. Mieux vaut moins que trop." },
      { title: "Éteindre les lumières et appareils inutilisés", desc: "Éteins tout ce que tu n'utilises pas. L'économie d'énergie est une forme de lutte contre le gaspillage." },
      { title: "Faire une dua de gratitude", desc: "Récite : « Allahumma ma asbaha bi min ni'matin... » (Ô Allah, toute faveur dont j'ai bénéficié ce matin...). Remercie pour tout." },
      { title: "Réutiliser ou recycler un objet", desc: "Avant de jeter, demande-toi : puis-je le réutiliser ou le donner ? La sobriété est une adoration." },
    ],
  },
  medisance: {
    action1: [
      { title: "Se taire quand on veut médire", desc: "Avant de parler d'autrui, garde le silence. Le Prophète (saws) a dit : « Quiconque croit en Allah et au Jour Dernier, qu'il dise du bien ou qu'il se taise. »" },
      { title: "Réciter le hadith sur la médisance", desc: "Récite et médite : « La médisance, c'est mentionner ton frère d'une manière qu'il détesterait. » (Muslim) « Veux-tu manger la chair de ton frère mort ? » (49:12)" },
      { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah » 100 fois pour les paroles passées. Le repentir purifie la langue." },
      { title: "Dire du bien de quelqu'un aujourd'hui", desc: "Remplace une parole négative par une parole positive. Mentionne une qualité de quelqu'un à un tiers." },
      { title: "Réciter la dua pour la langue", desc: "Récite : « Allahumma a'inni ala dhikrika wa chukrika wa husni 'ibadatika » et « Allahumma ihdini li-ahsani al-akhlaq »." },
      { title: "Éviter les conversations sur les absents", desc: "Si on parle d'un absent, change de sujet ou défends-le. « Celui qui défend l'honneur de son frère en son absence, Allah le protégera du Feu. »" },
      { title: "Prier 2 raka'at de repentir", desc: "Si tu as médit, prie 2 raka'at et demande pardon. Puis demande pardon à la personne si possible." },
      { title: "Réciter sourate Al-Hujurat (49)", desc: "Lis sourate Al-Hujurat, verset 12 : « Ô vous qui avez cru, évitez beaucoup de suppositions... »" },
      { title: "Réciter La ilaha illa Allah 10 fois au lieu de médire", desc: "Quand tu es tenté de médire, récite « La ilaha illa Allah » ou « Subhanallah ». Occupe ta langue par le dhikr." },
      { title: "Écrire 3 qualités de quelqu'un qu'on critique", desc: "Avant de parler d'une personne, note 3 de ses qualités. Cela change le regard." },
    ],
    focus: [
      { title: "Se taire 1 heure", desc: "Fais l'exercice du silence : ne parle que si nécessaire pendant 1h. La langue sous contrôle est une force." },
      { title: "Corriger une médisance passée", desc: "Si tu as médit récemment, demande pardon à Allah et fais une bonne action pour la personne concernée." },
      { title: "Dire « Bismillah » avant de parler", desc: "Avant toute conversation, dis « Bismillah » dans ton cœur. Cela te rappelle de ne dire que du bien." },
      { title: "Éviter les cercles de médisance", desc: "Si tu es dans un groupe qui médit, quitte ou change de sujet. « Celui qui se tait face au mal est comme un ange. »" },
    ],
  },
  vandalisme: {
    action1: [
      { title: "Réciter le hadith sur la main et la langue", desc: "Médite : « Le musulman est celui dont les musulmans sont à l'abri de sa langue et de sa main. » (Bukhari) Ta main ne doit nuire à personne ni à rien." },
      { title: "Réparer ou nettoyer un dégât que tu as causé", desc: "Si tu as endommagé quelque chose (même petit), répare-le ou nettoie-le aujourd'hui. La réparation fait partie du repentir." },
      { title: "Respecter un bien qui ne t'appartient pas", desc: "Prends soin d'un objet commun : range, ne touche pas à ce qui ne t'appartient pas. Le respect du bien d'autrui est une adoration." },
      { title: "Faire une sadaqa pour compenser", desc: "Donne une aumône en intention de compenser un acte de vandalisme passé. « L'aumône éteint le péché comme l'eau éteint le feu. »" },
      { title: "Nettoyer un espace commun (parc, rue, mosquée)", desc: "Ramasse des déchets, nettoie un coin. Transformer la destruction en construction purifie le cœur." },
      { title: "Réciter le verset sur l'interdiction de nuire", desc: "Lis et médite : « Et ne semez pas la corruption sur la terre après qu'elle ait été réformée. » (7:56) Ne détruis pas ce qu'Allah a créé." },
      { title: "Réciter A'udhu billahi 3 fois quand l'envie de casser monte", desc: "Répète « A'udhu billahi min ash-shaytan ar-rajim » et « La ilaha illa Allah » quand la colère ou l'impulsivité monte." },
      { title: "Prier 2 raka'at de repentir", desc: "Si tu as vandalisé récemment, prie 2 raka'at et demande pardon. Le repentir sincère efface les péchés." },
      { title: "Aider à réparer chez quelqu'un", desc: "Propose ton aide pour une réparation (peinture, bricolage, nettoyage). Remplacer la destruction par la construction." },
      { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah » 100 fois. Le repentir purifie et renforce la maîtrise de soi." },
      { title: "Éviter les situations à risque (colère, alcool)", desc: "Identifie ce qui déclenche le passage à l'acte (colère, groupe, etc.) et évite ces contextes aujourd'hui." },
      { title: "Réciter sourate Al-Falaq et An-Nas", desc: "Récite sourate Al-Falaq (113) et An-Nas (114) 3 fois. Ce sont des protections contre les pulsions destructrices." },
    ],
    focus: [
      { title: "Ne rien endommager intentionnellement aujourd'hui", desc: "Engage-toi : pas de coup, pas de dégradation, pas de casse. La maîtrise de soi est une force." },
      { title: "Compenser une victime si possible", desc: "Si tu as endommagé le bien de quelqu'un, propose réparation ou excuse sincère. Le repentir inclut la réparation." },
      { title: "Prendre soin de ce qui t'entoure", desc: "Range ta chambre, répare un objet cassé, arrose une plante. Prendre soin cultive le respect." },
      { title: "Faire les ablutions pour apaiser", desc: "Quand l'envie de casser monte, fais les ablutions. L'eau calme. Le Prophète (saws) a dit que la colère vient de Shaytan, le feu s'éteint avec l'eau." },
      { title: "Méditer sur la valeur des choses", desc: "Chaque objet a une utilité, une histoire. Le respect des biens est le respect des personnes." },
    ],
  },
  hypocrisie: {
    action1: [
      { title: "Être sincère dans une action aujourd'hui", desc: "Fais une action uniquement pour Allah, sans chercher à être vu ou complimenté. « Les actions ne valent que par leurs intentions. »" },
      { title: "Réciter le hadith des trois cavités", desc: "Médite : « Celui qui trompe n'est pas des nôtres. » (Muslim) L'hypocrisie éloigne de la foi." },
      { title: "Corriger une apparence trompeuse", desc: "Si tu agis différemment en public et en privé, aligne aujourd'hui : fais en privé ce que tu montres en public." },
      { title: "Faire une bonne action en secret", desc: "Donne une sadaqa ou aide quelqu'un sans que personne ne le sache. La discrétion purifie l'intention." },
      { title: "Prier avec concentration (khushu')", desc: "Prie une prière en te concentrant vraiment, sans penser au regard des autres. « Malheur à ceux qui prient avec négligence. » (107:4-5)" },
      { title: "Dire la vérité même si difficile", desc: "Dis une vérité que tu cachais. L'honnêteté est l'antidote à l'hypocrisie." },
      { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah » 100 fois. Demande à Allah de purifier ton cœur du show-off et du double visage." },
      { title: "Éviter de se vanter", desc: "Aujourd'hui, ne parle pas de tes accomplissements pour te mettre en valeur. Laisse les actes parler." },
      { title: "Réciter sourate Al-Mounafiqoun", desc: "Lis sourate Al-Mounafiqoun (63). Elle décrit les hypocrites et nous invite à l'introspection." },
      { title: "Faire une dua de sincérité", desc: "Récite : « Allahumma inni a'udhu bika min an ushrika bika wa ana a'lamu wa astaghfiruka lima la a'lamu » (Ô Allah, préserve-moi du polythéisme...)." },
    ],
    focus: [
      { title: "Vérifier son intention avant chaque action", desc: "Avant d'agir, demande-toi : « Est-ce pour Allah ou pour les gens ? » Corrige si nécessaire." },
      { title: "Agir de la même façon seul et en public", desc: "Ce que tu fais quand personne ne te regarde doit ressembler à ce que tu montres. L'unité intérieure est la clé." },
      { title: "Ne pas mentir ou exagérer", desc: "Pas de surestimation de ta pratique, pas de faux témoignage. La vérité libère de l'hypocrisie." },
      { title: "Fréquenter des gens sincères", desc: "Entoure-toi de ceux qui pratiquent par conviction, pas pour la montre. L'environnement influence." },
    ],
  },
  voyeurisme: {
    action1: [
      { title: "Baisser le regard 10 fois dans la journée", desc: "Dès qu'une image ou personne non-mahram attire ton regard, détourne immédiatement. Compte 10 fois. « Le regard est une flèche empoisonnée d'Iblis. »" },
      { title: "Réciter A'udhu billahi 3 fois avant de sortir", desc: "Avant de quitter la maison, récite « A'udhu billahi min ash-shaytan ar-rajim » 3 fois. Protection contre les regards interdits." },
      { title: "Faire les ablutions si tu as regardé", desc: "Si tu as posé le regard sur quelque chose d'interdit, fais les ablutions (wudu) immédiatement. Purification." },
      { title: "Prier 2 raka'at de repentir", desc: "Prie 2 raka'at immédiatement après avoir baissé le regard. Demande pardon avec sincérité." },
      { title: "Lire sourate An-Nour verset 30-31", desc: "Lis et médite : « Dis aux croyants de baisser leur regard et de préserver leur chasteté. » (24:30-31)" },
      { title: "Réciter « Astaghfirullah » 100 fois", desc: "Répète « Astaghfirullah » 100 fois. Le repentir purifie le regard." },
      { title: "Éviter les écrans 2h ce soir", desc: "Coupe téléphone et ordinateur 2h avant de dormir. Les écrans alimentent le voyeurisme." },
      { title: "Réciter les dhikr du matin au réveil", desc: "Récite « Subhanallah, Alhamdulillah, Allahu Akbar » 33 fois chacune au réveil. Protection pour la journée." },
      { title: "Marcher 15 min en gardant le regard baissé", desc: "Sors marcher 15 min en gardant les yeux vers le sol ou devant toi. Entraîne-toi à ne pas regarder autour." },
      { title: "Installer un bloqueur de contenu", desc: "Active un filtre strict sur ton téléphone (contrôle parental ou app de blocage). Action concrète." },
    ],
    focus: [
      { title: "Détourner le regard dès qu'une tentation arrive", desc: "Engage-toi : à chaque tentation visuelle aujourd'hui, détourne immédiatement. Pas d'exception." },
      { title: "Réciter sourate Al-Falaq et An-Nas 3 fois", desc: "Récite sourate Al-Falaq (113) et An-Nas (114) 3 fois matin et soir. Protection." },
      { title: "Prier au moins une prière à la mosquée", desc: "Va prier une prière en groupe. L'environnement de la mosquée protège des regards." },
      { title: "Éteindre les notifications des réseaux", desc: "Désactive les notifications Instagram, TikTok, etc. Réduis les déclencheurs." },
    ],
  },
  education: {
    action1: [
      { title: "Lire 10 pages d'un livre islamique", desc: "Lis 10 pages d'un livre de fiqh, hadith ou tafsir. L'éducation islamique structure la journée." },
      { title: "Écouter un cours ou prêche de 15 min", desc: "Écoute 15 min de cours (YouTube, podcast) sur un sujet islamique. Apprentissage concret." },
      { title: "Mémoriser 3 versets du Coran", desc: "Apprends par cœur 3 versets nouveaux. La mémorisation est une action précise." },
      { title: "Réciter sourate Al-Kahf (vendredi)", desc: "Lis sourate Al-Kahf (18) en entier si c'est vendredi. Sinon lis 2 pages de Coran." },
      { title: "Écrire 5 points d'un hadith appris", desc: "Lis un hadith, écris 5 points à retenir. L'écriture fixe l'apprentissage." },
      { title: "Réciter les dhikr du matin", desc: "Récite « Subhanallah, Alhamdulillah, Allahu Akbar » 33 fois chacune au réveil." },
      { title: "Prier 2 raka'at de Duha", desc: "Prie 2 raka'at de Duha entre le lever du soleil et Dhuhr. Sunna méritoire." },
      { title: "Regarder une vidéo d'un savant (20 min)", desc: "Regarde 20 min de cours d'un savant reconnu. Choisis une vidéo éducative." },
      { title: "Lire la traduction d'une sourate", desc: "Lis la traduction d'une sourate courte (Al-Ikhlas, Al-Fatiha, etc.). Comprendre le Coran." },
      { title: "Réciter Ayat al-Kursi 3 fois", desc: "Récite le verset du Trône (2:255) 3 fois matin et soir. Protection et récompense." },
    ],
    focus: [
      { title: "Bloquer 30 min pour l'étude islamique", desc: "Réserve 30 min aujourd'hui pour lire ou écouter du contenu islamique. Pas d'excuse." },
      { title: "Apprendre une nouvelle invocation", desc: "Mémorise une invocation du Prophète (saws) que tu ne connaissais pas." },
      { title: "Prier avec concentration (khushu')", desc: "Prie une prière en méditant chaque mot. La prière bien faite est une éducation." },
      { title: "Partager un verset appris avec quelqu'un", desc: "Transmets à quelqu'un (famille, ami) un verset ou hadith que tu as appris. Enseigner fixe." },
    ],
  },
  paresse: {
    action1: [
      { title: "Se lever à l'heure de Fajr", desc: "Lève-toi pour Fajr même si c'est difficile. Le Prophète (saws) a dit : « La prière la plus lourde pour les hypocrites est Fajr et Isha. »" },
      { title: "Faire les ablutions au réveil", desc: "Dès le réveil, fais les ablutions. L'eau réveille le corps et l'esprit. « La propreté est la moitié de la foi. »" },
      { title: "Réciter la dua du réveil", desc: "Récite : « Alhamdulillah alladhi ahyana ba'da ma amatana wa ilayhi an-nushur ». Commence la journée par la gratitude." },
      { title: "Marche 15 minutes au réveil", desc: "Sors marcher 15 minutes dès le matin. Le mouvement chasse la paresse. Le Prophète (saws) aimait la marche." },
      { title: "Faire une tâche avant 10h", desc: "Accomplis une tâche importante avant 10h. « Les actions les plus aimées d'Allah sont les plus constantes, même minimes. »" },
      { title: "Prier Duha (2 raka'at minimum)", desc: "Prie au moins 2 raka'at de Duha. C'est une sunna qui structure la matinée." },
      { title: "Réciter les dhikr du matin", desc: "Récite les dhikr du matin (adhkar as-sabah) au réveil. Ils donnent de l'énergie spirituelle." },
      { title: "Éteindre les écrans 1h avant le coucher", desc: "Coupe tous les écrans 1h avant de dormir. Un sommeil de qualité réduit la paresse du matin." },
      { title: "Marche 15 min en récitant du dhikr", desc: "Marche en récitant du dhikr. Corps et esprit s'activent ensemble." },
      { title: "Aider quelqu'un concrètement", desc: "Propose ton aide pour une tâche. L'action pour autrui motive plus que pour soi." },
    ],
    focus: [
      { title: "Se lever au premier réveil", desc: "Ne remets pas le réveil. Au premier « bip », lève-toi. C'est une bataille contre le nafs." },
      { title: "Faire la chose la plus difficile en premier", desc: "Commence par la tâche que tu repousses. Une fois faite, le reste est plus facile." },
      { title: "Prier en groupe à la mosquée", desc: "Va prier au moins une prière à la mosquée. L'obligation collective combat la paresse." },
      { title: "Réciter le hadith sur la constance", desc: "Médite : « Les actions les plus aimées d'Allah sont les plus constantes, même si elles sont minimes. » Fais peu mais régulièrement." },
    ],
  },
};

function getCustomSinKey(customDescription: string): string | null {
  const s = customDescription.trim().toLowerCase();
  if (/gaspill|gaspillage|gaspiller|dépenser|dépens/.test(s)) return "gaspillage";
  if (/médis|medis|commérage|commérag|langue|parler mal/.test(s)) return "medisance";
  if (/paresse|paresseux|flemm|procrastin|remettre|tard/.test(s)) return "paresse";
  if (/vandal|dégrad|casser|détruire|détérior/.test(s)) return "vandalisme";
  if (/hypocri|hypocrisie|double visage|montrer|paraitre/.test(s)) return "hypocrisie";
  if (/voyeur|regard interd|couverture|pudeur|exhibition/.test(s)) return "voyeurisme";
  if (/éducation|education|apprentiss|étudier|études/.test(s)) return "education";
  return null;
}

function getCustomSinActions(customDescription: string): { action1: Array<{ title: string; desc: string }>; focus: Array<{ title: string; desc: string }> } | null {
  const key = getCustomSinKey(customDescription);
  return key ? CUSTOM_SIN_ACTIONS[key] ?? null : null;
}

/** Vérifie si un péché personnalisé nécessite des actions générées par IA (pas dans notre liste prédéfinie). */
export function needsAIActionsForCustomSin(customDescription: string): boolean {
  return !!(customDescription?.trim() && !getCustomSinActions(customDescription.trim()));
}

/** Actions physiques et sociales du quotidien — aident à corriger le péché par des actes concrets */
const PHYSICAL_ACTIONS: Array<{ title: string; desc: string }> = [
  { title: "Va voir ton voisin et offre-lui un gâteau", desc: "Rends visite à ton voisin avec une petite attention (gâteau, dattes). Le Prophète (saws) a dit : « Le meilleur des voisins auprès d'Allah est le meilleur envers son voisin. »" },
  { title: "Appelle un membre de ta famille", desc: "Appelle ta mère, ton père, un frère ou une sœur pour prendre de leurs nouvelles. Maintenir les liens de parenté est une adoration." },
  { title: "Rends visite à un malade ou une personne âgée", desc: "Va voir quelqu'un de malade ou une personne âgée. Le Prophète (saws) a dit : « Qui visite un malade est dans la récolte du Paradis jusqu'à son retour. »" },
  { title: "Aide quelqu'un à porter ses courses", desc: "Si tu vois quelqu'un qui en a besoin, propose ton aide pour porter des courses ou des paquets. La charité physique efface le péché." },
  { title: "Partage un repas avec un proche", desc: "Invite quelqu'un à manger avec toi ou partage ton repas. « Donnez à manger à celui qui a faim. » (Hadith)" },
  { title: "Fais une promenade de 15 min en récitant du dhikr", desc: "Sors marcher 15 minutes tout en récitant du dhikr. Le mouvement physique et l'évocation d'Allah purifient le cœur." },
  { title: "Nettoie ta chambre ou un coin de la maison", desc: "Range et nettoie ta chambre. La propreté physique reflète la pureté du cœur. « La propreté fait partie de la foi. »" },
  { title: "Fais 20 minutes de sport ou de marche", desc: "Bouge ton corps 20 minutes : marche, étirements, pompes. Un corps actif aide à dompter les tentations." },
  { title: "Apporte un café ou thé à quelqu'un", desc: "Offre une boisson à un collègue, un voisin ou un proche. Les petits gestes de bienveillance comptent." },
  { title: "Raconte un hadith ou verset à quelqu'un", desc: "Partage un verset ou hadith qui t'a touché avec une personne de ton entourage. Transmettre la science est une sadaqa." },
  { title: "Fais le ménage chez tes parents", desc: "Va chez tes parents et aide au ménage, au rangement ou aux courses. « Le Paradis est aux pieds de ta mère. »" },
  { title: "Invite quelqu'un à la mosquée", desc: "Propose à un ami ou un voisin de venir prier avec toi à la mosquée. « Qui appelle au bien a la même récompense que ceux qui le suivent. »" },
  { title: "Donne de l'eau ou de la nourriture à quelqu'un", desc: "Offre à manger ou à boire à quelqu'un dans le besoin. « Le meilleur des repas est celui auquel on invite des convives. »" },
  { title: "Écris un message de soutien à un proche", desc: "Envoie un message sincère à quelqu'un pour lui demander comment il va. Maintenir les liens est une adoration." },
  { title: "Fais une sortie en nature (parc, forêt)", desc: "Sors dans un parc ou en nature 20 minutes. Méditer la création d'Allah apaise le cœur." },
  { title: "Aide quelqu'un dans une tâche concrète", desc: "Propose ton aide pour une tâche : déménagement, bricolage, garde d'enfants. La solidarité purifie." },
  { title: "Va faire les courses pour quelqu'un qui ne peut pas", desc: "Propose à une personne âgée ou malade de faire ses courses. « Celui qui s'occupe des besoins de son frère, Allah s'occupe des siens. »" },
  { title: "Cuisine et offre un plat à quelqu'un", desc: "Prépare un plat et offre-le à un voisin, un proche ou quelqu'un dans le besoin. La générosité efface le péché." },
  { title: "Fais du jardinage ou arrose des plantes", desc: "Prends soin des plantes, du balcon ou du jardin. La création d'Allah nous rappelle à Lui." },
  { title: "Accompagne quelqu'un à un rendez-vous", desc: "Propose d'accompagner une personne âgée ou malade à un rdv. La présence et l'accompagnement sont des actes de bien." },
  { title: "Réconcilie-toi avec quelqu'un", desc: "Si tu as un différend, fais le premier pas pour te réconcilier. « La réconciliation entre les gens est une des meilleures aumônes. »" },
  { title: "Fais du bénévolat 1h (mosquée, association)", desc: "Donne 1h de ton temps : aider à la mosquée, une association, un maraud. Le bénévolat purifie." },
  { title: "Étire-toi 5 min au réveil avec dhikr", desc: "Au réveil, fais des étirements 5 minutes en récitant du dhikr. Corps et esprit s'éveillent ensemble." },
  { title: "Marche jusqu'à la mosquée pour une prière", desc: "Va à la mosquée à pied pour au moins une prière. Chaque pas vers la mosquée efface un péché." },
  { title: "Range et trie tes affaires", desc: "Range un placard, un tiroir ou tes vêtements. L'ordre extérieur aide à l'ordre intérieur." },
  { title: "Rends visite à tes parents", desc: "Va voir tes parents, prends de leurs nouvelles, aide-les. « Le Paradis est aux pieds des mères. »" },
  { title: "Fais une bonne action anonyme", desc: "Fais une bonne action sans que personne ne sache : laisse une pièce, aide en silence. La discrétion multiplie la récompense." },
  { title: "Sors sans téléphone 30 minutes", desc: "Laisse ton téléphone chez toi et sors 30 min (marche, parc). Déconnecte pour te reconnecter à l'essentiel." },
  { title: "Répare ou améliore quelque chose à la maison", desc: "Répare un objet, change une ampoule, accroche un cadre. Les petites actions concrètes valorisent." },
  { title: "Prépare le repas pour ta famille", desc: "Cuisine pour ta famille. Servir les siens est une adoration et renforce les liens." },
  { title: "Donne un vêtement en bon état à quelqu'un", desc: "Donne un vêtement que tu ne portes plus à quelqu'un dans le besoin. « Couvrir la nudité de ton frère est une sadaqa. »" },
];

/** Retourne les actions spécifiques au péché "base" (2e péché) — toujours liées au sin, jamais génériques */
function getBaseActions(sin: SelectedSin, user?: StopHaramUser): Array<{ title: string; desc: string }> {
  if (sin === "priere") return FOCUS_ACTIONS.priere;
  if (sin === "autre" && user?.profileInfo?.customSinDescription?.trim()) {
    const desc = user.profileInfo.customSinDescription.trim();
    const custom = getCustomSinActions(desc);
    if (custom) return [...custom.action1, ...custom.focus];
    const cached = user.profileInfo?.customSinActionsCache?.[desc.toLowerCase()];
    if (cached?.action1?.length && cached?.focus?.length)
      return [...cached.action1, ...cached.focus];
  }
  return FOCUS_ACTIONS[sin] ?? FOCUS_ACTIONS.autre;
}

function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length];
}

/** Choisit une action dont le titre n'est pas déjà utilisé. Essaie tous les index du pool. */
function pickUniqueFrom(
  arr: Array<{ title: string; desc: string }>,
  usedTitles: Set<string>,
  startIndex: number
): { title: string; desc: string } | null {
  for (let i = 0; i < arr.length; i++) {
    const idx = (startIndex + i) % arr.length;
    const a = arr[idx];
    if (!usedTitles.has(a.title)) return a;
  }
  return null;
}

/** Choisit une action unique. Si le pool principal n'a plus d'actions libres, essaie les pools de secours. */
function pickUnique(
  mainPool: Array<{ title: string; desc: string }>,
  usedTitles: Set<string>,
  startIndex: number,
  fallbackPools: Array<Array<{ title: string; desc: string }>> = []
): { title: string; desc: string } {
  const found = pickUniqueFrom(mainPool, usedTitles, startIndex);
  if (found) return found;
  for (const pool of fallbackPools) {
    const f = pickUniqueFrom(pool, usedTitles, startIndex);
    if (f) return f;
  }
  return mainPool[startIndex % mainPool.length];
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

  let focusActions = FOCUS_ACTIONS[focusSin] ?? FOCUS_ACTIONS.autre;
  const baseActions = getBaseActions(baseSin, user);
  const hasOptional = sins.length > 1;

  let action1List = ACTION_1[focusSin] ?? ACTION_1.autre;

  // Si "autre" + péché personnalisé, utiliser les actions adaptées (prédéfinies ou cache IA)
  if (focusSin === "autre" && user.profileInfo?.customSinDescription?.trim()) {
    const desc = user.profileInfo.customSinDescription.trim();
    const custom = getCustomSinActions(desc);
    if (custom) {
      action1List = custom.action1;
      focusActions = custom.focus;
    } else {
      const cacheKey = desc.toLowerCase();
      const cached = user.profileInfo?.customSinActionsCache?.[cacheKey];
      if (cached && cached.action1?.length >= 5 && cached.focus?.length >= 3) {
        action1List = cached.action1;
        focusActions = cached.focus;
      }
    }
  }
  
  // Nombre d'actions par jour (par défaut 3)
  const actionsPerDay = user.profileInfo?.actionsPerDay ?? 3;

  const allPools = [action1List, focusActions, baseActions, PHYSICAL_ACTIONS];

  const days: PlanDay[] = [];
  for (let d = 1; d <= 30; d++) {
    const level = getLevelFromDay(d);
    const diffOffset = getLevelDifficultyOffset(level);
    const usedTitles = new Set<string>();

    const action1 = pickUnique(action1List, usedTitles, d - 1 + diffOffset, [focusActions, baseActions, PHYSICAL_ACTIONS]);
    usedTitles.add(action1.title);

    const focus = pickUnique(focusActions, usedTitles, d - 1 + diffOffset, [action1List, baseActions, PHYSICAL_ACTIONS]);
    usedTitles.add(focus.title);

    const base = pickUnique(baseActions, usedTitles, d - 1 + diffOffset, [action1List, focusActions, PHYSICAL_ACTIONS]);
    usedTitles.add(base.title);

    const optional =
      hasOptional && (d % 7 === 3 || d % 7 === 6)
        ? { title: "Action optionnelle", desc: "Choisis une action parmi tes objectifs secondaires." }
        : undefined;

    const additionalActions: Array<{ title: string; desc: string; sin?: SelectedSin }> = [];
    const addUniqueFrom = (arr: Array<{ title: string; desc: string }>, idx: number, sin?: SelectedSin) => {
      const fallbacks = allPools.filter((p) => p !== arr);
      const a = pickUnique(arr, usedTitles, idx, fallbacks);
      usedTitles.add(a.title);
      additionalActions.push(sin ? { ...a, sin } : a);
    };

    // Actions supplémentaires : toutes liées aux péchés choisis (focus + base), pas de génériques
    if (actionsPerDay >= 5) {
      addUniqueFrom(focusActions, d - 1 + 7 + diffOffset, focusSin);
      addUniqueFrom(baseActions, d - 1 + 14 + diffOffset, baseSin);
    }
    if (actionsPerDay >= 10) {
      addUniqueFrom(baseActions, d - 1 + 21 + diffOffset, baseSin);
      addUniqueFrom(focusActions, d - 1 + 28 + diffOffset, focusSin);
      addUniqueFrom(action1List, d - 1 + 35 + diffOffset, focusSin);
      addUniqueFrom(baseActions, d - 1 + 42 + diffOffset, baseSin);
      addUniqueFrom(focusActions, d - 1 + 49 + diffOffset, focusSin);
      addUniqueFrom(action1List, d - 1 + 56 + diffOffset, focusSin);
      addUniqueFrom(baseActions, d - 1 + 63 + diffOffset, baseSin);
    }

    days.push({ day: d, intention: action1, focus, base, optional, additionalActions: additionalActions.length > 0 ? additionalActions : undefined });
  }

  return {
    durationDays: 30,
    focusSin,
    baseSin,
    days,
  };
}
