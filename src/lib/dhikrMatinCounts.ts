import { todayKey } from "@/lib/date";

const STORAGE_KEY = "dhikr_matin_counts";
const DONE_KEY = "dhikr_matin_done";

export const DHIKR_MATIN_TARGETS = {
  subhanallah: 33,
  alhamdulillah: 33,
  allahu_akbar: 34,
} as const;

export type DhikrMatinCounts = {
  subhanallah: number;
  alhamdulillah: number;
  allahu_akbar: number;
};

function loadRaw(): Record<string, DhikrMatinCounts> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, DhikrMatinCounts>;
  } catch {
    return {};
  }
}

function saveRaw(data: Record<string, DhikrMatinCounts>): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getDhikrMatinCountsForToday(): DhikrMatinCounts {
  const key = todayKey();
  const data = loadRaw();
  const day = data[key];
  return day ?? { subhanallah: 0, alhamdulillah: 0, allahu_akbar: 0 };
}

export function incrementDhikrMatin(
  which: keyof DhikrMatinCounts
): DhikrMatinCounts {
  const key = todayKey();
  const data = loadRaw();
  const day = { ...getDhikrMatinCountsForToday() };
  const max = DHIKR_MATIN_TARGETS[which];
  day[which] = Math.min(day[which] + 1, max);
  data[key] = day;
  saveRaw(data);

  const counts = getDhikrMatinCountsForToday();
  if (
    counts.subhanallah >= DHIKR_MATIN_TARGETS.subhanallah &&
    counts.alhamdulillah >= DHIKR_MATIN_TARGETS.alhamdulillah &&
    counts.allahu_akbar >= DHIKR_MATIN_TARGETS.allahu_akbar
  ) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(DONE_KEY, key);
    }
  }
  return getDhikrMatinCountsForToday();
}

export function isDhikrMatinDoneToday(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(DONE_KEY) === todayKey();
}
