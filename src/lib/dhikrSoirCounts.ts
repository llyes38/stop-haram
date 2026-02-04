import { todayKey } from "@/lib/date";

const STORAGE_KEY = "dhikr_soir_counts";
const DONE_KEY = "dhikr_soir_done";

export const DHIKR_SOIR_TARGETS = {
  subhanallah: 33,
  alhamdulillah: 33,
  allahu_akbar: 34,
} as const;

export type DhikrSoirCounts = {
  subhanallah: number;
  alhamdulillah: number;
  allahu_akbar: number;
};

function loadRaw(): Record<string, DhikrSoirCounts> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, DhikrSoirCounts>;
  } catch {
    return {};
  }
}

function saveRaw(data: Record<string, DhikrSoirCounts>): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getDhikrSoirCountsForToday(): DhikrSoirCounts {
  const key = todayKey();
  const data = loadRaw();
  const day = data[key];
  return day ?? { subhanallah: 0, alhamdulillah: 0, allahu_akbar: 0 };
}

export function incrementDhikrSoir(which: keyof DhikrSoirCounts): DhikrSoirCounts {
  const key = todayKey();
  const data = loadRaw();
  const day = { ...getDhikrSoirCountsForToday() };
  const max = DHIKR_SOIR_TARGETS[which];
  day[which] = Math.min(day[which] + 1, max);
  data[key] = day;
  saveRaw(data);

  const counts = getDhikrSoirCountsForToday();
  if (
    counts.subhanallah >= DHIKR_SOIR_TARGETS.subhanallah &&
    counts.alhamdulillah >= DHIKR_SOIR_TARGETS.alhamdulillah &&
    counts.allahu_akbar >= DHIKR_SOIR_TARGETS.allahu_akbar
  ) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(DONE_KEY, key);
    }
  }
  return getDhikrSoirCountsForToday();
}

export function isDhikrSoirDoneToday(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(DONE_KEY) === todayKey();
}

export function resetDhikrSoirCountsForToday(): DhikrSoirCounts {
  if (typeof window === "undefined") return { subhanallah: 0, alhamdulillah: 0, allahu_akbar: 0 };
  const key = todayKey();
  const data = loadRaw();
  data[key] = { subhanallah: 0, alhamdulillah: 0, allahu_akbar: 0 };
  saveRaw(data);
  window.localStorage.removeItem(DONE_KEY);
  return data[key];
}
