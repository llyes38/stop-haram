"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getUser, saveUser, getDayNumber, getDailyActionLabels, getDailyActionsWithSins, getSinLabel } from "@/lib/storage";
import { getProfile } from "@/lib/authState";
import { generatePlan } from "@/lib/programEngine";
import type { SelectedSin } from "@/lib/storage";
import { getTemptationStats, incrementTempted } from "@/lib/temptationStats";
import { getCurrentStatut, isStatutUnlocked, STATUTS, type Statut } from "@/lib/statuts";
import {
  getTodayActionsState,
  getCompletedActionTitlesForToday,
  toggleActionByTitle,
  type ActionId,
  type DailyActionsState,
} from "@/lib/dailyActions";
import {
  addVersets,
  isVerseAction,
  versetsFromActionLabel,
} from "@/lib/progressStats";
import PrayerTimesCard from "@/components/PrayerTimesCard";
import QuizLudiqueBlock from "@/components/QuizLudiqueBlock";
import { todayKey } from "@/lib/date";
import {
  getNotifPriere,
  setNotifPriere,
  getNotifActions,
  setNotifActions,
} from "@/lib/notificationPrefs";
import { hasDonToday } from "@/lib/sadaqaStorage";
import { getDefiDaysStatus, setDefiDayStatus } from "@/lib/defiDaysStatus";
import { addDefiDayPoints } from "@/lib/pointsGratitude";
import { getLevelFromDay, LEVEL_EMOJIS, LEVEL_NAMES } from "@/lib/defiLevels";
import StopHaramLogo from "@/components/brand/StopHaramLogo";
import ShareCard from "@/components/ShareCard";
import LockedFeatureCard from "@/components/LockedFeatureCard";
import { APP_URL, shareWithNative, copyToClipboard } from "@/lib/share";
import { useSupabaseAuth } from "@/components/auth/AuthProvider";
import { compressImageToBase64 } from "@/lib/profilePhoto";
import { saveProgress } from "@/lib/progressStorage";
import {
  getDhikrMatinCountsForToday,
  incrementDhikrMatin,
  DHIKR_MATIN_TARGETS,
  resetDhikrMatinCountsForToday,
  type DhikrMatinCounts,
} from "@/lib/dhikrMatinCounts";
import {
  getDhikrSoirCountsForToday,
  resetDhikrSoirCountsForToday,
  type DhikrSoirCounts,
} from "@/lib/dhikrSoirCounts";
import {
  getFoisTarget,
  getDhikrFoisCount,
  incrementDhikrFoisCount,
  resetDhikrFoisCount,
} from "@/lib/dhikrFoisCount";

const DEFI_JOURS = 30;

const LAST_STREAK_START_KEY = "last_streak_start_iso";

/** Versets et hadiths en rapport précis avec le thème de l'action. */
type VerseRef = { text: string; ref: string };
const VERSETS_PAR_THEME: Array<{ keywords: RegExp; verses: VerseRef[] }> = [
  {
    keywords: /\b(dhikr|invocation|Subhanallah|Alhamdulillah|Astaghfirullah|La ilaha illa Allah|évocation)\b/i,
    verses: [
      { text: "N'est-ce pas par l'évocation d'Allah que s'apaisent les cœurs ?", ref: "Sourate Ar-Ra'd, v.28" },
      { text: "Le dhikr d'Allah est ce qu'il y a de plus grand.", ref: "Sourate Al-'Ankabût, v.45" },
      { text: "Invoque ton Seigneur en toi-même, en humilité et crainte.", ref: "Sourate Al-A'râf, v.205" },
    ],
  },
  {
    keywords: /\b(ablutions?|wudu|ghusl|propreté)\b/i,
    verses: [
      { text: "La propreté est la moitié de la foi.", ref: "Rapporté par Muslim" },
      { text: "Allah aime ceux qui se repentent et ceux qui se purifient.", ref: "Sourate Al-Baqara, v.222" },
    ],
  },
  {
    keywords: /\b(prière|prier|raka'at|Duha|Witr|Tahajjud|sunan)\b/i,
    verses: [
      { text: "La prière préserve de la turpitude et du blâmable.", ref: "Sourate Al-'Ankabût, v.45" },
      { text: "Celui qui accomplit une prière surérogatoire sincèrement, ses péchés lui seront pardonnés.", ref: "Rapporté par Al-Bukhârî" },
      { text: "Le Prophète (saws) ne délaissait jamais la prière Witr.", ref: "Rapporté par Al-Bukhârî" },
    ],
  },
  {
    keywords: /\b(Coran|sourate|réciter|récite|Ya-Sin|Al-Mulk|Al-Ikhlas|Al-Kahf|verset)\b/i,
    verses: [
      { text: "Récitez le Coran, car il viendra intercéder pour ses lecteurs au Jour de la Résurrection.", ref: "Rapporté par Muslim" },
      { text: "Ce Coran guide vers ce qu'il y a de plus droit.", ref: "Sourate Al-Isra, v.9" },
      { text: "Et récite ce qui t'est révélé du Livre.", ref: "Sourate Al-'Ankabût, v.45" },
    ],
  },
  {
    keywords: /\b(sadaqa|aumône|don)\b/i,
    verses: [
      { text: "L'aumône éteint le péché comme l'eau éteint le feu.", ref: "Rapporté par At-Tirmidhî" },
      { text: "Ce que vous dépensez du bien, c'est pour vous-mêmes.", ref: "Sourate Al-Baqara, v.272" },
    ],
  },
  {
    keywords: /\b(voisin)\b/i,
    verses: [
      { text: "Le meilleur des voisins auprès d'Allah est le meilleur envers son voisin.", ref: "Rapporté par At-Tirmidhî" },
      { text: "Jibril ne cessa de me recommander le voisin.", ref: "Rapporté par Al-Bukhârî" },
    ],
  },
  {
    keywords: /\b(famille|mère|père|parent|proche)\b/i,
    verses: [
      { text: "Et ton Seigneur a décrété de n'adorer que Lui et d'être bienfaisant envers les parents.", ref: "Sourate Al-Isra, v.23" },
      { text: "Maintenir les liens de parenté prolonge la vie et étend la subsistance.", ref: "Rapporté par Al-Bukhârî" },
    ],
  },
  {
    keywords: /\b(colère|colère)\b/i,
    verses: [
      { text: "La colère vient de Shaytan, et Shaytan est créé de feu. Le feu s'éteint avec l'eau.", ref: "Rapporté par Abû Dâwûd" },
      { text: "Le fort n'est pas celui qui terrasse, mais celui qui se maîtrise dans la colère.", ref: "Rapporté par Al-Bukhârî" },
    ],
  },
  {
    keywords: /\b(intention|niyyah)\b/i,
    verses: [
      { text: "Les actes ne valent que par leurs intentions.", ref: "Rapporté par Al-Bukhârî et Muslim" },
      { text: "Allah ne regarde pas vos apparences ni vos biens, mais Il regarde vos cœurs et vos œuvres.", ref: "Rapporté par Muslim" },
    ],
  },
  {
    keywords: /\b(salawat|Prophète|Muhammad)\b/i,
    verses: [
      { text: "Allah et Ses anges prient sur le Prophète. Ô vous qui croyez, priez sur lui.", ref: "Sourate Al-Ahzâb, v.56" },
      { text: "Celui qui envoie une prière sur moi, Allah envoie dix sur lui.", ref: "Rapporté par Muslim" },
    ],
  },
  {
    keywords: /\b(Ayat al-Kursi|Al-Falaq|An-Nas|protection|Shaytan)\b/i,
    verses: [
      { text: "Quiconque récite Ayat al-Kursi le soir, une garde sera établie sur lui jusqu'au matin.", ref: "Rapporté par Al-Bukhârî" },
      { text: "Dis : Je me réfugie auprès du Seigneur de l'aube naissante.", ref: "Sourate Al-Falaq, v.1" },
    ],
  },
  {
    keywords: /\b(istighfar|repentir|Astaghfirullah)\b/i,
    verses: [
      { text: "Quiconque se repent et accomplit de bonnes œuvres, Allah transforme ses mauvaises actions en bonnes.", ref: "Sourate Al-Furqân, v.70" },
      { text: "Par Allah, je demande pardon à Allah et je me repens plus de soixante-dix fois par jour.", ref: "Rapporté par Al-Bukhârî (parole du Prophète)" },
    ],
  },
  {
    keywords: /\b(sourire|sourire|geste amical|amical|bienveillance|douceur)\b/i,
    verses: [
      { text: "La douceur n'orne une chose sans l'embellir.", ref: "Rapporté par Muslim" },
      { text: "Un sourire envers ton frère est une aumône.", ref: "Rapporté par At-Tirmidhî" },
    ],
  },
  {
    keywords: /\b(musique|Coran|écouter|nasheed)\b/i,
    verses: [
      { text: "N'est-ce pas par l'évocation d'Allah que s'apaisent les cœurs ?", ref: "Sourate Ar-Ra'd, v.28" },
      { text: "Le Coran apaise les cœurs et élève l'âme.", ref: "Sourate Ar-Ra'd, v.28" },
    ],
  },
  {
    keywords: /\b(mosquée)\b/i,
    verses: [
      { text: "Chaque pas vers la mosquée efface un péché et élève d'un degré.", ref: "Rapporté par Muslim" },
    ],
  },
  {
    keywords: /\b(marche|marcher|sport)\b/i,
    verses: [
      { text: "Transforme chaque pas en dhikr : « Subhanallah, Alhamdulillah, La ilaha illa Allah, Allahu Akbar ».", ref: "Rapporté par Muslim (dhikr en marchant)" },
    ],
  },
];

const VERSETS_GENERIQUES: VerseRef[] = [
  { text: "Les bonnes actions effacent les mauvaises.", ref: "Sourate Houd, v.114" },
  { text: "Quiconque accomplit une bonne action en aura dix fois autant.", ref: "Sourate Al-An'am, v.160" },
  { text: "Celui qui se rapproche de Moi d'un empan, Je me rapproche de lui d'une coudée.", ref: "Hadith Qudsi" },
];

function getVerseOuHadithPourAction(
  actionTitle: string,
  actionDesc: string | undefined,
  actionIndex: number
): VerseRef {
  const texte = `${actionTitle} ${actionDesc ?? ""}`.toLowerCase();
  for (const { keywords, verses } of VERSETS_PAR_THEME) {
    if (keywords.test(texte)) {
      const idx = actionIndex % verses.length;
      return verses[idx];
    }
  }
  const idx = actionIndex % VERSETS_GENERIQUES.length;
  return VERSETS_GENERIQUES[idx];
}

function HomeNotifToggle({
  label,
  checked,
  onToggle,
  offMessage,
}: {
  label: string;
  checked: boolean;
  onToggle: (v: boolean) => void;
  offMessage: string;
}) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <span className="text-white/90 text-sm font-medium">{label}</span>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onToggle(!checked)}
          className={`relative inline-flex h-7 w-12 flex-shrink-0 rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400/50 ${
            checked ? "border-emerald-400/50 bg-emerald-500/30" : "border-white/20 bg-white/10"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-6 w-6 translate-y-0.5 rounded-full bg-white shadow transition-transform ${
              checked ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
      {!checked && (
        <p className="text-amber-200/90 text-xs mt-2.5 leading-relaxed">
          {offMessage}
        </p>
      )}
    </div>
  );
}

function formatElapsed(ms: number): { days: number; hours: number; minutes: number; seconds: number } {
  const sec = Math.floor(ms / 1000) % 60;
  const min = Math.floor(ms / 60000) % 60;
  const hours = Math.floor(ms / 3600000) % 24;
  const days = Math.floor(ms / 86400000);
  return { days, hours, minutes: min, seconds: sec };
}

const GUEST_MODE_KEY = "stopharam_guest_mode";

export default function HomePage() {
  const router = useRouter();
  const { user: supabaseUser } = useSupabaseAuth();
  const [guestModeFlag, setGuestModeFlag] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setGuestModeFlag(window.localStorage.getItem(GUEST_MODE_KEY) === "true");
    }
  }, []);
  const isGuest = !supabaseUser || guestModeFlag;
  const pathname = usePathname();
  const [name, setName] = useState("");
  const [streakDays, setStreakDays] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [streakStartIso, setStreakStartIso] = useState<string | null>(null);
  const [stats, setStats] = useState<{ tempted: number; resisted: number }>({ tempted: 0, resisted: 0 });
  const [whyStop, setWhyStop] = useState("");
  const [whyStopEditing, setWhyStopEditing] = useState(false);
  const [whyStopDraft, setWhyStopDraft] = useState("");
  const [challengeDay, setChallengeDay] = useState<number>(0);
  const [startDateISO, setStartDateISO] = useState<string | null>(null);
  const [statutModalOpen, setStatutModalOpen] = useState(false);
  const [shareNudgeModalOpen, setShareNudgeModalOpen] = useState(false);
  const [actionLabels, setActionLabels] = useState<string[]>([
    "Faire mon intention du jour",
    "Lire un rappel ou une invocation",
    "Une action concrète vers mon objectif",
  ]);
  const [actionItems, setActionItems] = useState<Array<{ title: string; desc?: string; sin?: SelectedSin }>>([]);
  const [selectedActionIndex, setSelectedActionIndex] = useState<number | null>(null);
  const [actionsState, setActionsState] = useState<DailyActionsState>({
    "1": false,
    "2": false,
    "3": false,
  });
  const [completedTitles, setCompletedTitles] = useState<string[]>([]);
  const [focusSin, setFocusSin] = useState<SelectedSin | null>(null);
  const [baseSin, setBaseSin] = useState<SelectedSin | null>(null);
  const [dhikrDoneToday, setDhikrDoneToday] = useState(false);
  const [notifPriere, setNotifPriereState] = useState(true);
  const [notifActions, setNotifActionsState] = useState(true);
  const [sadaqaDoneToday, setSadaqaDoneToday] = useState(false);
  const [defiStatus, setDefiStatus] = useState<Record<number, "validated" | "failed">>({});
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const photoFileInputRef = useRef<HTMLInputElement>(null);
  const [dhikrMatinCounts, setDhikrMatinCounts] = useState<DhikrMatinCounts | null>(null);
  const [dhikrSoirDoneToday, setDhikrSoirDoneToday] = useState(false);
  const [dhikrSoirCounts, setDhikrSoirCounts] = useState<DhikrSoirCounts | null>(null);
  const [dhikrFoisCount, setDhikrFoisCount] = useState<number | null>(null);

  useEffect(() => {
    let u = getUser();
    if (u?.plan && u?.selectedSins?.length) {
      u = { ...u, plan: generatePlan(u) };
      saveUser(u);
    }
    setWhyStop(u?.profileInfo?.whyStop?.trim() || "");
    if (u?.startDateISO) {
      setStartDateISO(u.startDateISO);
      const day = getDayNumber(u.startDateISO);
      setChallengeDay(Math.min(Math.max(1, day), DEFI_JOURS));
    } else {
      setStartDateISO(null);
      setChallengeDay(0);
    }
    const items = getDailyActionsWithSins(u ?? null);
    setActionItems(items);
    setActionLabels(items.map((i) => i.title));
    const actionsCount = items.length;
    setActionsState(getTodayActionsState(actionsCount));
    setCompletedTitles(getCompletedActionTitlesForToday());
    setFocusSin(u?.plan?.focusSin ?? null);
    setBaseSin(u?.plan?.baseSin ?? null);
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem("dhikr_matin_done");
      setDhikrDoneToday(raw === todayKey());
      const rawSoir = window.localStorage.getItem("dhikr_soir_done");
      setDhikrSoirDoneToday(rawSoir === todayKey());
    }
    setNotifPriereState(getNotifPriere());
    setNotifActionsState(getNotifActions());
    setSadaqaDoneToday(hasDonToday());
    setDefiStatus(getDefiDaysStatus());
    setProfilePhoto(u?.profileInfo?.profilePhoto ?? null);
    // Re-lit le nom à chaque affichage de la page (ex. retour du profil après modification)
    const legacyName = typeof window === "undefined" ? null : window.localStorage.getItem("user_name");
    setName(u?.name?.trim() || getProfile()?.name?.trim() || legacyName?.trim() || "");
  }, [pathname]);

  useEffect(() => {
    setStats(getTemptationStats());
  }, [pathname]);

  useEffect(() => {
    if (selectedActionIndex == null) {
      setDhikrMatinCounts(null);
      setDhikrSoirCounts(null);
      setDhikrFoisCount(null);
      return;
    }
    const itemsToShow = actionItems.length > 0 ? actionItems : actionLabels.map((title) => ({ title }));
    const item = itemsToShow[selectedActionIndex];
    if (item?.title === "Invocations du matin") {
      setDhikrMatinCounts(getDhikrMatinCountsForToday());
      setDhikrSoirCounts(null);
      setDhikrFoisCount(null);
    } else if (item?.title === "Invocations avant de dormir") {
      setDhikrSoirCounts(getDhikrSoirCountsForToday());
      setDhikrMatinCounts(null);
      setDhikrFoisCount(null);
    } else if (item && getFoisTarget(item.title, item.desc) != null) {
      setDhikrFoisCount(getDhikrFoisCount(item.title));
      setDhikrMatinCounts(null);
      setDhikrSoirCounts(null);
    } else {
      setDhikrMatinCounts(null);
      setDhikrSoirCounts(null);
      setDhikrFoisCount(null);
    }
  }, [selectedActionIndex, actionItems, actionLabels]);

  useEffect(() => {
    const items = actionItems.length > 0 ? actionItems : actionLabels.map((l) => ({ title: l }));
    const itemsToValidate = items.filter((item) => item.title !== "Invocations du matin");
    const allDone = itemsToValidate.every((item) => {
      const label = item.title;
      if (label === "Invocations avant de dormir") return dhikrSoirDoneToday;
      const target = getFoisTarget(item.title, item.desc ?? "");
      if (target != null) {
        return getDhikrFoisCount(item.title) >= target || completedTitles.includes(label);
      }
      const isDhikr = /dhikr|invocation/i.test(label);
      return isDhikr ? dhikrDoneToday : completedTitles.includes(label);
    });
    if (allDone && challengeDay >= 1 && challengeDay <= 30) {
      const status = getDefiDaysStatus();
      if (status[challengeDay] !== "validated") {
        setDefiDayStatus(challengeDay, "validated");
        setDefiStatus({ ...status, [challengeDay]: "validated" });
        addDefiDayPoints(challengeDay);
      }
    }
  }, [actionLabels, actionItems, completedTitles, dhikrDoneToday, dhikrSoirDoneToday, challengeDay]);

  useEffect(() => {
    const user = getUser();
    const legacyName = typeof window === "undefined" ? null : window.localStorage.getItem("user_name");
    const legacyDays = typeof window === "undefined" ? null : window.localStorage.getItem("days_clean");
    setName(user?.name?.trim() || getProfile()?.name?.trim() || legacyName?.trim() || "");
    setStreakDays(user?.streakDays ?? (legacyDays != null && legacyDays !== "" ? parseInt(legacyDays, 10) : null));
    if (typeof window !== "undefined") {
      let start = window.localStorage.getItem(LAST_STREAK_START_KEY);
      const days = user?.streakDays ?? (legacyDays != null && legacyDays !== "" ? parseInt(legacyDays, 10) : null);
      if (!start && days != null && days > 0) {
        const approx = new Date(Date.now() - days * 86400000).toISOString();
        window.localStorage.setItem(LAST_STREAK_START_KEY, approx);
        start = approx;
      }
      setStreakStartIso(start || null);
      if (start) {
        const tick = () => {
          const startDate = new Date(start!).getTime();
          setElapsed(formatElapsed(Date.now() - startDate));
        };
        tick();
        const t = setInterval(tick, 1000);
        return () => clearInterval(t);
      } else {
        setElapsed(null);
      }
    }
  }, []);

  // Re-lit le prénom après hydratation Supabase (connexion) pour afficher "[Prénom], tu es sur la bonne voie"
  useEffect(() => {
    if (!supabaseUser?.id) return;
    const t = setTimeout(() => {
      const u = getUser();
      const profile = getProfile();
      const legacy = typeof window === "undefined" ? "" : window.localStorage.getItem("user_name")?.trim() || "";
      setName(u?.name?.trim() || profile?.name?.trim() || legacy || "");
      if (u?.streakDays != null) setStreakDays(u.streakDays);
    }, 500);
    return () => clearTimeout(t);
  }, [supabaseUser?.id]);

  const hasStreak = streakDays != null && Number.isFinite(streakDays) && streakDays >= 0;
  const currentStatut = getCurrentStatut(streakDays ?? null);

  const ratio = stats.tempted > 0 ? Math.round((100 * stats.resisted) / stats.tempted) : null;

  const handleJeVaisCraquer = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([300, 100, 300, 100, 300]);
    }
    incrementTempted();
    router.push("/urgence");
  };

  const startEditWhyStop = () => {
    setWhyStopDraft(whyStop);
    setWhyStopEditing(true);
  };

  const saveWhyStop = () => {
    const user = getUser();
    if (!user) return;
    const text = whyStopDraft.trim();
    const updated = {
      ...user,
      profileInfo: { ...user.profileInfo, whyStop: text || undefined },
    };
    saveUser(updated);
    setWhyStop(text);
    setWhyStopEditing(false);
  };

  const cancelEditWhyStop = () => {
    setWhyStopEditing(false);
    setWhyStopDraft("");
  };

  const handlePhotoClick = () => {
    if (profilePhoto) {
      setPhotoModalOpen(true);
    } else {
      router.push(supabaseUser ? "/account" : "/login");
    }
  };

  const handlePhotoSelectFromHome = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    e.target.value = "";
    setPhotoUploading(true);
    try {
      const u = getUser();
      if (!u) return;
      const dataUrl = await compressImageToBase64(file);
      const updated = { ...u, profileInfo: { ...u.profileInfo, profilePhoto: dataUrl } };
      saveUser(updated);
      setProfilePhoto(dataUrl);
      if (supabaseUser?.id) await saveProgress({ storage_user: updated as unknown as Record<string, unknown> }, supabaseUser.id);
      setPhotoModalOpen(false);
    } catch {
      // ignore
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleToggleActionByTitle = (title: string) => {
    const aboutToMarkDone = !completedTitles.includes(title);
    if (aboutToMarkDone && isVerseAction(title)) {
      const n = versetsFromActionLabel(title);
      if (n > 0) addVersets(n);
    }
    toggleActionByTitle(title);
    setCompletedTitles(getCompletedActionTitlesForToday());
    const cnt = actionItems.length || actionLabels.length || 3;
    setActionsState(getTodayActionsState(cnt));
  };

  const handleShareResult = async () => {
    const text = hasStreak && streakDays != null
      ? `Je suis sur la bonne voie depuis ${streakDays} jour${streakDays > 1 ? "s" : ""} avec StopHaram. Rejoins-moi ! ${APP_URL}`
      : `Je reprends le contrôle avec StopHaram. Rejoins-moi ! ${APP_URL}`;
    const ok = await shareWithNative({ title: "StopHaram", text, url: APP_URL });
    if (!ok) await copyToClipboard(text);
    setShareNudgeModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col px-6 pt-12 pb-12 text-white">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes stress-shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          20% { transform: translateX(-2px) rotate(-3deg); }
          40% { transform: translateX(2px) rotate(3deg); }
          60% { transform: translateX(-1px) rotate(-2deg); }
          80% { transform: translateX(1px) rotate(2deg); }
        }
        .stress-emoji { display: inline-block; animation: stress-shake 0.8s ease-in-out infinite; }
        @keyframes statut-bounce {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.1) translateY(-3px); }
        }
        .statut-icon-animated { animation: statut-bounce 1.2s ease-in-out infinite; }
        @keyframes action-pulse {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.4); }
          50% { opacity: 0.95; transform: scale(1.01); box-shadow: 0 0 12px 2px rgba(52, 211, 153, 0.25); }
        }
        .action-todo { animation: action-pulse 2s ease-in-out infinite; }
        .action-todo:hover { animation: none; }
      `}} />

      <header className="mb-8 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <button
            type="button"
            onClick={handlePhotoClick}
            className="shrink-0 h-10 w-10 rounded-full overflow-hidden border-2 border-white/20 hover:border-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400/50 mt-0.5"
            aria-label={profilePhoto ? "Voir ou modifier ma photo" : supabaseUser ? "Mon compte" : "Se connecter"}
          >
            {profilePhoto ? (
              <img src={profilePhoto} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-white/10 flex items-center justify-center text-white/60 text-sm font-semibold">
                {(name || "?")[0]?.toUpperCase()}
              </div>
            )}
          </button>
          <input
            type="file"
            accept="image/*"
            ref={photoFileInputRef}
            onChange={handlePhotoSelectFromHome}
            className="hidden"
            aria-hidden
          />
          <div className="min-w-0 -mt-1">
            <StopHaramLogo size={200} variant="dark" className="block" />
          </div>
        </div>
        {!isGuest && (
        <button
          type="button"
          onClick={() => setStatutModalOpen(true)}
          className="statut-icon-animated flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-xl hover:bg-white/15 hover:animate-none transition-colors"
          aria-label="Voir mon statut"
          title={currentStatut.label}
        >
          {currentStatut.emoji}
        </button>
        )}
      </header>

      {/* Modal photo de profil : voir en grand + modifier */}
      {photoModalOpen && profilePhoto && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 px-4"
          onClick={() => setPhotoModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Photo de profil"
        >
          <div
            className="w-full max-w-[320px] flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={profilePhoto}
              alt="Photo de profil"
              className="w-64 h-64 rounded-full object-cover border-4 border-white/30 shadow-xl"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => photoFileInputRef.current?.click()}
                disabled={photoUploading}
                className="rounded-xl bg-emerald-500/80 hover:bg-emerald-500 text-white font-semibold px-5 py-2.5 disabled:opacity-60"
              >
                {photoUploading ? "Chargement…" : "Modifier"}
              </button>
              <button
                type="button"
                onClick={() => setPhotoModalOpen(false)}
                className="rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Réalisations / Statuts (masqué en mode essai) */}
      {!isGuest && statutModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-4 pb-8 pt-8"
          onClick={() => setStatutModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="statut-modal-title"
        >
          <div
            className="w-full max-w-[420px] max-h-[85vh] overflow-y-auto rounded-2xl bg-[#0a1f12] border border-white/20 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0a1f12]/95 px-5 py-4 backdrop-blur-sm">
              <h2 id="statut-modal-title" className="text-lg font-bold text-white">
                Réalisations
              </h2>
              <button
                type="button"
                onClick={() => setStatutModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/15"
                aria-label="Fermer"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <p className="text-white/70 text-sm">Ton statut actuel</p>
              <div className="rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-4 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{currentStatut.emoji}</span>
                  <div>
                    <p className="font-semibold text-white">{currentStatut.label}</p>
                    <p className="text-emerald-200/90 text-sm mt-0.5">{currentStatut.description}</p>
                  </div>
                </div>
              </div>
              <p className="text-white/70 text-sm pt-2">Tous les statuts</p>
              <div className="space-y-2">
                {STATUTS.map((s) => {
                  const unlocked = isStatutUnlocked(s, streakDays ?? null);
                  return (
                    <div
                      key={s.id}
                      className={`rounded-xl border px-4 py-3 ${
                        unlocked
                          ? "bg-white/10 border-white/20"
                          : "bg-white/5 border-white/10 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{unlocked ? s.emoji : "🔒"}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium ${unlocked ? "text-white" : "text-white/60"}`}>
                            {s.label}
                          </p>
                          <p className="text-white/50 text-xs mt-0.5">
                            {unlocked ? s.description : `Débloque en tenant ${s.minDays} jour${s.minDays > 1 ? "s" : ""} sans rechute`}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cadre prioritaire en haut : [Prénom], tu es sur la bonne voie depuis X jours — ou Mode essai pour invité */}
      <div className="rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/40 px-5 py-5 shadow-lg mb-2 relative">
        {isGuest ? (
          <>
            <p className="text-amber-200 text-sm font-semibold text-center mb-2">Mode essai</p>
            <p className="text-white/90 text-sm text-center mb-4">
              Valide tes actions du jour et invite un proche. Crée un compte pour débloquer tout le parcours.
            </p>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full rounded-xl bg-white py-3 text-gray-900 font-semibold text-sm hover:bg-white/95 transition-colors"
            >
              Créer un compte (Google ou email)
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setShareNudgeModalOpen(true)}
              className="absolute top-3 right-3 p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Partager mon résultat"
              title="Partager mon résultat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <p className="text-emerald-200 text-sm font-semibold text-center mb-3">
              {name ? (
                <>
                  <span className="text-white">{name}</span>, tu es sur la bonne voie depuis
                </>
              ) : (
                "Tu es sur la bonne voie depuis"
              )}
            </p>
            <div className="text-center">
              {hasStreak && (
                <p className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
                  {streakDays === 0 ? "Jour 0" : `${streakDays} jour${streakDays > 1 ? "s" : ""}`}
                </p>
              )}
              {elapsed != null && (
                <p className="text-xl sm:text-2xl font-bold text-white/95 tabular-nums mt-2">
                  {elapsed.days > 0 && `${elapsed.days}j `}
                  {String(elapsed.hours).padStart(2, "0")}h {String(elapsed.minutes).padStart(2, "0")}min {String(elapsed.seconds).padStart(2, "0")}s
                </p>
              )}
              {!hasStreak && !elapsed && (
                <p className="text-white/90 text-lg">Chaque effort compte.</p>
              )}
            </div>
            <p className="text-emerald-200/90 text-xs text-center mt-2">sans rechute</p>
          </>
        )}
      </div>

      {/* Modale partage : message motivant avant de partager */}
      {shareNudgeModalOpen && !isGuest && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-4 pb-8 pt-8"
          onClick={() => setShareNudgeModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-nudge-title"
        >
          <div
            className="w-full max-w-[360px] rounded-2xl bg-[#0a1f12] border border-emerald-400/30 shadow-xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <p id="share-nudge-title" className="text-emerald-200 font-semibold text-center mb-2">
              Partage ton résultat
            </p>
            <p className="text-white/85 text-sm text-center leading-relaxed mb-5">
              Envoie ton avancée à tes proches : ça te motive et peut encourager quelqu&apos;un à te rejoindre sur le chemin. Chaque partage compte.
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleShareResult}
                className="w-full rounded-xl bg-emerald-500/30 border border-emerald-400/50 py-3 text-emerald-200 font-semibold text-sm hover:bg-emerald-500/40 transition-colors"
              >
                Partager maintenant
              </button>
              <button
                type="button"
                onClick={() => setShareNudgeModalOpen(false)}
                className="w-full rounded-xl bg-white/10 border border-white/20 py-2.5 text-white/70 text-sm font-medium hover:bg-white/15 transition-colors"
              >
                Plus tard
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => router.push("/fonctionnement")}
        className="block w-full text-center text-emerald-300/90 hover:text-emerald-200 text-xs font-medium underline mb-6 transition-colors"
      >
        Comment ça marche ?
      </button>

      <section className="flex flex-col gap-6 pb-28">
        {/* Bloc : Défi 30 jours — verrouillé en mode essai */}
        {isGuest ? (
          <LockedFeatureCard
            title="Défi 30 jours"
            description="Suivi de ton parcours sur 30 jours, niveaux et validation des jours."
          />
        ) : (
        <div className={`rounded-2xl px-5 py-4 ${challengeDay === 0 ? "bg-amber-500/15 border-2 border-amber-400/50 ring-1 ring-amber-400/30" : "bg-white/5 border border-white/10"}`}>
          <div className="flex flex-col gap-1 mb-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${challengeDay === 0 ? "text-amber-200" : "text-white/80"}`}>Défi 30 jours</span>
                {challengeDay >= 1 && challengeDay <= DEFI_JOURS && (
                  <span
                    className="flex h-7 items-center gap-1.5 rounded-lg bg-amber-500/20 border border-amber-400/40 px-2 text-sm"
                    title={LEVEL_NAMES[getLevelFromDay(challengeDay)] ?? ""}
                  >
                    <span>{LEVEL_EMOJIS[getLevelFromDay(challengeDay)] ?? "⭐"}</span>
                    <span className="text-amber-200 font-medium">Niveau {getLevelFromDay(challengeDay)}</span>
                  </span>
                )}
              </div>
              {challengeDay >= 1 && challengeDay <= DEFI_JOURS && (
                <span className="text-white/60 text-xs tabular-nums">Jour {challengeDay}/{DEFI_JOURS}</span>
              )}
            </div>
            {startDateISO && (
              <p className="text-white/50 text-xs">
                Depuis le {new Date(startDateISO + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}
          </div>
          <div className="grid grid-cols-10 gap-1.5 mb-3">
            {Array.from({ length: DEFI_JOURS }, (_, i) => {
              const d = i + 1;
              const status = defiStatus[d];
              const isPast = d < challengeDay;
              const isCurrent = d === challengeDay;
              const showCheck = status === "validated";
              const showCross = status === "failed" || (isPast && status !== "validated");
              return (
                <div
                  key={d}
                  className={`flex h-8 w-full min-w-0 items-center justify-center rounded-md text-sm font-bold ${
                    showCheck
                      ? "bg-emerald-500/50 text-emerald-100 border border-emerald-400/60"
                      : showCross
                      ? "bg-red-500/40 text-red-100 border border-red-400/50"
                      : isCurrent
                      ? "bg-white/25 text-white border border-white/40 ring-1 ring-emerald-400/50"
                      : "bg-white/5 text-white/30 border border-white/10"
                  }`}
                  title={
                    showCheck
                      ? `Jour ${d} validé`
                      : showCross
                      ? `Jour ${d} échoué`
                      : isCurrent
                      ? `Jour ${d} en cours`
                      : `Jour ${d}`
                  }
                  aria-label={showCheck ? `Jour ${d} validé` : showCross ? `Jour ${d} échoué` : `Jour ${d}`}
                >
                  {showCheck ? "✓" : showCross ? "✗" : isCurrent ? d : ""}
                </div>
              );
            })}
          </div>
          <p className={`text-xs text-center ${challengeDay === 0 ? "text-amber-200/90 font-medium" : "text-white/50"}`}>
            {challengeDay >= DEFI_JOURS ? "Challenge terminé 🎉" : challengeDay === 0 ? "Va dans Parcours et clique sur Commencer quand tu es prêt" : "✓ validé · ✗ échoué"}
          </p>
        </div>
        )}

        {/* Actions du jour — visible pour tous (mode essai + compte) */}
        <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4">
          {isGuest && (
            <p className="text-emerald-200/90 text-sm font-semibold mb-3">Actions du jour</p>
          )}
          <div className={!isGuest ? "mt-5 pt-5 border-t border-white/10" : ""}>
            {!isGuest && challengeDay === 0 ? (
              <div className="text-center py-4">
                <p className="text-amber-200/95 text-sm mb-3 font-medium">Commence ton défi dans Parcours pour débloquer tes actions du jour.</p>
                <button
                  type="button"
                  onClick={() => router.push("/parcours")}
                  className="rounded-xl bg-amber-500/40 border-2 border-amber-400/70 py-3 px-5 text-amber-100 font-bold text-sm hover:bg-amber-500/50 hover:border-amber-300/80 transition-colors shadow-lg shadow-amber-500/20"
                >
                  Aller dans Parcours
                </button>
              </div>
            ) : (() => {
              const itemsToCount = actionItems.length > 0 ? actionItems : actionLabels.map((l) => ({ title: l }));
              const baseTitles = ["Invocations du matin", "Invocations avant de dormir"];
              const actionsCount = itemsToCount.filter((item) => !baseTitles.includes(item.title)).length;
              const allDone = itemsToCount
                .filter((item) => item.title !== "Invocations du matin")
                .every((item) => {
                  const label = "title" in item ? item.title : item;
                  if (label === "Invocations avant de dormir") return dhikrSoirDoneToday;
                  const isDhikr = /dhikr|invocation/i.test(label);
                  return isDhikr ? dhikrDoneToday : completedTitles.includes(label);
                });
              return (
                <>
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <p className="text-emerald-200/90 text-sm font-semibold">{actionsCount} actions du jour</p>
                    {allDone && (
                      <span className="rounded-full bg-emerald-500/30 px-3 py-1 text-emerald-200 text-xs font-semibold">
                        Journée validée ✓
                      </span>
                    )}
                  </div>
                  <p className="text-white/60 text-xs mb-4">Tu valides ta journée en accomplissant les {actionsCount} actions. Les actions communes (★ matin, 🌙 soir) ne comptent pas dans ce nombre. Si tu rechutes, tu perds la validation du jour.</p>
                  <div className="space-y-3">
                    {(() => {
                      const u = getUser();
                      const itemsToShow = actionItems.length > 0 ? actionItems : actionLabels.map((title) => ({ title }));
                      return itemsToShow.map((item, i) => {
                        const id = String(i + 1) as ActionId;
                        const isInvocationsMatin = item.title === "Invocations du matin";
                        const isInvocationsSoir = item.title === "Invocations avant de dormir";
                        const isBaseAction = isInvocationsMatin || isInvocationsSoir;
                        const isDhikr = /dhikr|invocation/i.test(item.title);
                        const done =
                          isInvocationsMatin
                            ? dhikrDoneToday
                            : isInvocationsSoir
                              ? dhikrSoirDoneToday
                              : /dhikr|invocation/i.test(item.title)
                                ? dhikrDoneToday
                                : completedTitles.includes(item.title);
                        const sinLabel = item.sin && u ? getSinLabel(item.sin, u) : null;
                        const numberedIndex = itemsToShow.filter(
                          (_, j) => j < i && itemsToShow[j].title !== "Invocations du matin" && itemsToShow[j].title !== "Invocations avant de dormir"
                        ).length + 1;
                        return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setSelectedActionIndex(i)}
                          className={`w-full rounded-xl border px-4 py-3.5 text-left flex items-start gap-3 transition-all ${
                            done
                              ? "bg-white/5 border-white/10 opacity-70 hover:opacity-90"
                              : isBaseAction
                                ? "border-amber-400/40 bg-amber-500/15 hover:bg-amber-500/20"
                                : "action-todo bg-emerald-500/15 border-emerald-400/35 hover:bg-emerald-500/20"
                          }`}
                        >
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                              done
                                ? "bg-emerald-500/30 text-emerald-200"
                                : isBaseAction
                                  ? "bg-amber-400/40 text-amber-100"
                                  : item.sin === focusSin
                                    ? "bg-amber-500/25 text-amber-200"
                                    : "bg-emerald-500/20 text-emerald-200"
                            }`}
                            aria-hidden
                            title={isBaseAction ? "Action de base pour tout le monde" : undefined}
                          >
                            {done ? "✓" : isInvocationsMatin ? "★" : isInvocationsSoir ? "🌙" : numberedIndex}
                          </span>
                          <div className="flex-1 min-w-0">
                            <span className={`text-sm font-medium ${done ? "text-white/80 line-through" : "text-white"}`}>
                              {item.title}
                            </span>
                            {isBaseAction && (
                              <p className="text-xs mt-0.5 text-amber-200/90 font-medium">
                                Action de base pour tout le monde
                              </p>
                            )}
                            {sinLabel && !isBaseAction && (
                              <p className="text-xs mt-0.5 text-emerald-200/70">
                                → {sinLabel}
                              </p>
                            )}
                            {isDhikr && done && (
                              <span className="inline-block mt-1 rounded-full bg-emerald-500/30 px-2 py-0.5 text-emerald-200 text-xs font-semibold">
                                Terminé
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    });
                    })()}
                  </div>
                  {/* Ajouter une action de soi-même — ex. sadaqa (masqué en mode essai) */}
                  {!isGuest && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-emerald-200/90 text-sm font-semibold mb-2">Ajouter une action de toi-même</p>
                    <p className="text-white/60 text-xs mb-3">Une action en plus qui compte pour ta journée.</p>
                    <button
                      type="button"
                      onClick={() => router.push("/sadaqa")}
                      className="w-full rounded-xl border border-amber-400/35 bg-amber-500/15 hover:bg-amber-500/20 px-4 py-3.5 text-left flex items-center gap-3 transition-all"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm bg-amber-500/25 text-amber-200" aria-hidden>
                        🤲
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">
                          Faire une sadaqa (don)
                        </p>
                        <p className="text-amber-200/80 text-xs mt-0.5">La sadaqa efface le péché comme l&apos;eau éteint le feu.</p>
                        {sadaqaDoneToday && (
                          <span className="inline-block mt-1 text-emerald-200/90 text-xs">
                            Tu as déjà fait un don aujourd&apos;hui — tu peux en refaire si tu veux.
                          </span>
                        )}
                      </div>
                      <span className="text-white/40 shrink-0" aria-hidden>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </button>
                  </div>
                  )}
                  {!isGuest && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <HomeNotifToggle
                      label="Rappel actions du jour"
                      checked={notifActions}
                      onToggle={(v) => {
                        setNotifActions(v);
                        setNotifActionsState(v);
                      }}
                      offMessage="Pour ton bien et le suivi de ton plan, nous te conseillons de garder les rappels activés. Si tu désactives : tu ne recevras plus de notifications ni de vibration pour les actions du jour. Tu peux réactiver à tout moment dans Compte > Notifications. Khayr in cha Allah."
                    />
                  </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>

        {/* Bloc : Mon but en arrêtant mes péchés — verrouillé en mode essai */}
        {isGuest ? (
          <LockedFeatureCard
            title="Mon but en arrêtant mes péchés"
            description="Écris ta motivation pour te rappeler pourquoi tu avances."
          />
        ) : (
        <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4 but-scintille">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 text-sm font-medium" aria-hidden>?</span>
              <span className="text-white/80 text-sm font-medium">Mon but en arrêtant mes péchés est …</span>
            </div>
            {!whyStopEditing && (
              <button
                type="button"
                onClick={startEditWhyStop}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white/80 transition-colors"
                aria-label="Modifier la phrase"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
          </div>
          {whyStopEditing ? (
            <div className="space-y-3">
              <textarea
                value={whyStopDraft}
                onChange={(e) => setWhyStopDraft(e.target.value)}
                placeholder="Ex. me rapprocher d'Allah et devenir une meilleure personne."
                rows={4}
                className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 resize-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={saveWhyStop}
                  className="flex-1 rounded-xl bg-emerald-500/20 border border-emerald-400/40 py-2.5 text-emerald-200 text-sm font-medium hover:bg-emerald-500/30 transition-colors"
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={cancelEditWhyStop}
                  className="rounded-xl bg-white/10 py-2.5 px-4 text-white/70 text-sm font-medium hover:bg-white/15 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap min-h-[2.5rem]">
              {whyStop || "Ex. me rapprocher d'Allah. Clique sur le crayon pour modifier."}
            </p>
          )}
        </div>
        )}

        {/* Bloc : Tenté / Résisté — verrouillé en mode essai */}
        {isGuest ? (
          <LockedFeatureCard
            title="Tes victoires face à la tentation"
            description="Compte les fois où tu as résisté et vois ta progression."
          />
        ) : (
        <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-5">
          <p className="text-white/80 text-sm font-semibold mb-4 text-center">
            Tes victoires face à la tentation
          </p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="rounded-xl bg-amber-500/15 border border-amber-400/30 py-3 px-4 text-center">
              <p className="text-2xl font-bold text-amber-200 tabular-nums">{stats.tempted}</p>
              <p className="text-amber-200/80 text-xs mt-0.5">fois tenté</p>
            </div>
            <div className="rounded-xl bg-emerald-500/20 border border-emerald-400/40 py-3 px-4 text-center">
              <p className="text-2xl font-bold text-emerald-200 tabular-nums">{stats.resisted}</p>
              <p className="text-emerald-200/80 text-xs mt-0.5">fois résisté</p>
            </div>
          </div>
          {stats.tempted > 0 ? (
            <div className="space-y-2">
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-400/80 transition-all duration-500"
                  style={{ width: `${Math.min(100, ratio ?? 0)}%` }}
                />
              </div>
              <p className="text-white/70 text-xs text-center">
                Tu tiens bon dans <span className="font-semibold text-emerald-300">{ratio}%</span> des cas
              </p>
            </div>
          ) : (
            <p className="text-white/50 text-xs text-center">
              Tu n&apos;as pas encore eu besoin d&apos;aide — continue comme ça.
            </p>
          )}
        </div>
        )}

        {/* Bloc Communauté : Invite un proche (toujours visible) */}
        <ShareCard
          title="🤝 Invite un proche"
          description="StopHaram est plus facile à tenir à deux. Invite quelqu'un à rejoindre les Stopprs et faites le chemin ensemble."
          shareTitle="StopHaram"
          shareText={`Je viens de commencer StopHaram. Rejoins-moi et on se fait un défi à 2 pour reprendre le contrôle.\n➡️ Installe l'app ici : ${APP_URL}`}
          primaryLabel="Partager l'invitation"
          secondaryLabel="Copier le message"
          copyLinkLabel="Copier le lien"
        />

        {/* CTA mode essai : inciter à créer un compte */}
        {isGuest && (
        <div className="rounded-2xl bg-amber-500/15 border-2 border-amber-400/40 px-5 py-5">
          <p className="text-amber-200 font-semibold text-center mb-2">Débloque tout le parcours</p>
          <p className="text-white/90 text-sm text-center mb-4">
            Crée un compte pour sauvegarder ta progression, accéder au quiz du jour, au défi 30 jours et à la synchronisation sur tous tes appareils.
          </p>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full rounded-xl bg-white py-3.5 text-gray-900 font-bold text-sm hover:bg-white/95 transition-colors"
          >
            Créer un compte (Google ou email)
          </button>
        </div>
        )}

        {/* Rappel prière + Horaires — verrouillé en mode essai */}
        {isGuest ? (
          <LockedFeatureCard
            title="Rappel prière et horaires"
            description="Reçois une notification avant chaque prière et consulte les horaires."
          />
        ) : (
        <div className="space-y-3">
          <HomeNotifToggle
            label="Rappel heure de prière"
            checked={notifPriere}
            onToggle={(v) => {
              setNotifPriere(v);
              setNotifPriereState(v);
            }}
            offMessage="Pour ton bien et le suivi de ton plan, nous te conseillons de garder les rappels activés. Si tu désactives : tu ne recevras plus de rappels avant l'heure de prière (notifications et vibration). Tu peux réactiver à tout moment dans Compte > Notifications. Khayr in cha Allah."
          />
          <PrayerTimesCard />
        </div>
        )}

        {/* Quiz du jour — verrouillé en mode essai */}
        {isGuest ? (
          <LockedFeatureCard
            title="Quiz du jour"
            description="Gagne des points de gratitude à chaque bonne réponse et offre 1 mois gratuit à un proche."
          />
        ) : (
          <QuizLudiqueBlock />
        )}

        <p className="text-white/50 text-sm leading-relaxed max-w-[320px]">
          Allah voit tes efforts, même ceux que personne ne voit.
        </p>
      </section>

      {/* Bouton Je vais craquer — fixe, reste visible au scroll (rouge alerte mais pas fort, type bouton panique) */}
      <div className="fixed bottom-20 left-0 right-0 z-20 flex justify-center px-6 max-w-[420px] mx-auto">
        <button
          type="button"
          onClick={handleJeVaisCraquer}
          className="w-full rounded-2xl bg-red-900/50 border-2 border-red-500/60 py-3.5 text-white font-semibold text-base hover:bg-red-900/60 hover:border-red-500/70 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all shadow-lg flex flex-col items-center gap-0.5"
        >
          <span className="text-base flex items-center gap-2">
            <span className="stress-emoji">😰</span>
            Je vais craquer
          </span>
          <span className="text-red-200 font-medium text-xs">O Allah aide-moi 🤲</span>
        </button>
      </div>

      {/* Modal détail action — explication + bouton Validée */}
      {selectedActionIndex !== null && (() => {
        const u = getUser();
        const itemsToShow = actionItems.length > 0 ? actionItems : actionLabels.map((title) => ({ title }));
        const item = itemsToShow[selectedActionIndex];
        if (!item) return null;
        const isDhikr = /dhikr|invocation/i.test(item.title);
        const foisTarget = getFoisTarget(item.title, item.desc ?? "");
        const foisCount = foisTarget != null ? (dhikrFoisCount ?? getDhikrFoisCount(item.title)) : 0;
        const done =
          item.title === "Invocations du matin"
            ? dhikrDoneToday
            : item.title === "Invocations avant de dormir"
              ? dhikrSoirDoneToday
              : foisTarget != null
                ? foisCount >= foisTarget || completedTitles.includes(item.title)
                : completedTitles.includes(item.title);
        const sinLabel = item.sin && u ? getSinLabel(item.sin, u) : null;
        return (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm px-4 pb-8 sm:pb-0"
            onClick={() => setSelectedActionIndex(null)}
            role="presentation"
          >
            <div
              className="w-full max-w-lg rounded-2xl bg-slate-900 border border-white/15 shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="action-detail-title"
            >
              <div className="p-6 max-h-[85vh] overflow-y-auto">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                    item.title === "Invocations du matin"
                      ? "bg-amber-400/40 text-amber-100"
                      : item.title === "Invocations avant de dormir"
                        ? "bg-indigo-400/40 text-indigo-100"
                        : "bg-emerald-500/25 text-emerald-200"
                  }`}>
                    {item.title === "Invocations du matin"
                      ? "★"
                      : item.title === "Invocations avant de dormir"
                        ? "🌙"
                        : itemsToShow.filter(
                            (_, j) =>
                              j < selectedActionIndex &&
                              itemsToShow[j].title !== "Invocations du matin" &&
                              itemsToShow[j].title !== "Invocations avant de dormir"
                          ).length + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedActionIndex(null)}
                    className="text-white/50 hover:text-white/80 transition-colors p-1"
                    aria-label="Fermer"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <h2 id="action-detail-title" className="text-xl font-semibold text-white mb-2">
                  {item.title}
                </h2>
                {sinLabel && (
                  <p className="text-emerald-200/80 text-sm mb-4">→ {sinLabel}</p>
                )}
                <div className="prose prose-invert prose-sm max-w-none mb-5">
                  <p className="text-white/90 leading-relaxed">
                    {item.desc ?? "Accomplis cette action avec sincérité pour te rapprocher d'Allah."}
                  </p>
                </div>
                {(() => {
                  const { text, ref } = getVerseOuHadithPourAction(
                    item.title,
                    item.desc,
                    selectedActionIndex
                  );
                  return (
                    <blockquote className="border-l-4 border-emerald-500/50 pl-4 py-2 text-white/70 text-sm italic">
                      « {text} » — {ref}
                    </blockquote>
                  );
                })()}
              </div>
              <div className="p-4 pt-0 flex flex-col gap-2">
                {done ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelectedActionIndex(null)}
                      className="w-full rounded-xl bg-emerald-500/30 border border-emerald-400/40 py-3.5 text-emerald-200 font-semibold"
                    >
                      ✓ Validée
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (item.title === "Invocations du matin") {
                          if (typeof window !== "undefined") {
                            resetDhikrMatinCountsForToday();
                            setDhikrDoneToday(false);
                            setDhikrMatinCounts(getDhikrMatinCountsForToday());
                          }
                        } else if (item.title === "Invocations avant de dormir") {
                          if (typeof window !== "undefined") {
                            resetDhikrSoirCountsForToday();
                            setDhikrSoirDoneToday(false);
                            setDhikrSoirCounts(getDhikrSoirCountsForToday());
                          }
                        } else if (foisTarget != null) {
                          if (typeof window !== "undefined") {
                            resetDhikrFoisCount(item.title);
                            setDhikrFoisCount(0);
                          }
                          handleToggleActionByTitle(item.title);
                        } else {
                          handleToggleActionByTitle(item.title);
                        }
                        setSelectedActionIndex(null);
                      }}
                      className="w-full rounded-xl bg-white/10 border border-white/20 py-2.5 text-white/70 text-sm font-medium hover:bg-white/15 hover:text-white/90 transition-colors"
                    >
                      Recommencer cette action
                    </button>
                  </>
                ) : item.title === "Invocations du matin" ? (
                  <div className="space-y-3">
                    <p className="text-white/70 text-sm">
                      Compteur (33/33/34), invocations (Âyatu-l-Kursî, phonétique, audio…) : tout sur une seule page.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedActionIndex(null);
                        router.push("/dhikr/matin");
                      }}
                      className="w-full rounded-xl bg-emerald-500/25 border border-emerald-400/50 py-3.5 text-emerald-200 font-semibold hover:bg-emerald-500/35 transition-colors"
                    >
                      Ouvrir les invocations du matin
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedActionIndex(null)}
                      className="w-full rounded-xl bg-white/10 border border-white/20 py-2.5 text-white/80 text-sm"
                    >
                      Fermer
                    </button>
                  </div>
                ) : item.title === "Invocations avant de dormir" ? (
                  <div className="space-y-3">
                    <p className="text-white/70 text-sm">
                      Compteur (33/33/34), invocations avant de dormir (Âyatu-l-Kursî, phonétique…) : tout sur une seule page.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedActionIndex(null);
                        router.push("/dhikr/soir");
                      }}
                      className="w-full rounded-xl bg-emerald-500/25 border border-emerald-400/50 py-3.5 text-emerald-200 font-semibold hover:bg-emerald-500/35 transition-colors"
                    >
                      Ouvrir les invocations avant de dormir
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedActionIndex(null)}
                      className="w-full rounded-xl bg-white/10 border border-white/20 py-2.5 text-white/80 text-sm"
                    >
                      Fermer
                    </button>
                  </div>
                ) : foisTarget != null ? (
                  <div className="space-y-3">
                    <p className="text-white/70 text-sm">Touche pour compter (vibration à chaque touche).</p>
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(50);
                        const next = incrementDhikrFoisCount(item.title, foisTarget);
                        setDhikrFoisCount(next);
                        if (next >= foisTarget) {
                          setCompletedTitles((prev) =>
                            prev.includes(item.title) ? prev : [...prev, item.title]
                          );
                          handleToggleActionByTitle(item.title);
                        }
                      }}
                      disabled={done}
                      className={`w-full rounded-xl border py-4 px-4 flex items-center justify-between transition-colors ${
                        done
                          ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-200"
                          : "bg-white/10 border-white/20 text-white hover:bg-white/15 active:scale-[0.98]"
                      }`}
                    >
                      <span className="text-white/70 text-sm">Touche pour compter</span>
                      <span className="tabular-nums font-bold text-lg">
                        {foisCount}<span className="text-white/50 font-normal">/{foisTarget}</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedActionIndex(null)}
                      className="w-full rounded-xl bg-white/10 border border-white/20 py-2.5 text-white/80 text-sm"
                    >
                      Fermer
                    </button>
                  </div>
                ) : isDhikr ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedActionIndex(null);
                      router.push("/dhikr/matin");
                    }}
                    className="w-full rounded-xl bg-amber-500/30 border border-amber-400/50 py-3.5 text-amber-200 font-semibold hover:bg-amber-500/40 transition-colors"
                  >
                    Aller au dhikr
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      handleToggleActionByTitle(item.title);
                      setSelectedActionIndex(null);
                    }}
                    className="w-full rounded-xl bg-emerald-500/30 border border-emerald-400/50 py-3.5 text-emerald-200 font-semibold hover:bg-emerald-500/40 transition-colors"
                  >
                    Validée
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
