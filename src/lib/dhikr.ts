export type DhikrItem = {
  id: string;
  title: string;
  arabic?: string;
  french: string;
  repeat?: number;
  source: string;
};

export const dhikrMatin: DhikrItem[] = [
  {
    id: "istighfar",
    title: "Istighfar",
    arabic: "أستغفر الله",
    french: "Dis : Astaghfirullâh.",
    repeat: 100,
    source: "Dhikr",
  },
  {
    id: "tasbih",
    title: "SubhanAllah, Alhamdulillah, Allahu Akbar",
    arabic: "سُبْحَانَ ٱللَّٰهِ، ٱلْحَمْدُ لِلَّٰهِ، ٱللَّٰهُ أَكْبَرُ",
    french: "SubhanAllah, Alhamdulillah, Allahu Akbar — 33, 33, 34.",
    repeat: 100,
    source: "Dhikr",
  },
  {
    id: "ayat-kursi",
    title: "Ayat al-Kursi",
    french: "Lire Ayat al-Kursi (Sourate Al-Baqara 2:255)",
    source: "Dhikr",
  },
  {
    id: "trois-sourates",
    title: "Al-Ikhlas, Al-Falaq, An-Nas",
    french: "Lire les 3 sourates: Al-Ikhlas, Al-Falaq, An-Nas (x3)",
    repeat: 3,
    source: "Dhikr",
  },
  {
    id: "hasbunallah",
    title: "HasbiAllahu…",
    arabic: "حَسْبِيَ ٱللَّٰهُ لَا إِلَٰهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ، وَهُوَ رَبُّ ٱلْعَرْشِ ٱلْعَظِيمِ",
    french: "HasbiAllahu la ilaha illa Huwa, 'alayhi tawakkaltu, wa Huwa Rabbul-'Arshil-'Azim.",
    repeat: 7,
    source: "Dhikr",
  },
];
