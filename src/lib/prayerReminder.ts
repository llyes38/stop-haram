/**
 * Utilitaires pour le rappel de l'heure de prière (minutes avant).
 */

const STORAGE_KEYS = {
  city: "stopharam_city",
  country: "stopharam_country",
  method: "stopharam_prayer_method",
  school: "stopharam_school",
} as const;

const ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

export type Timings = Record<string, string>;

function parseTime(hhmm: string): { h: number; m: number } | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm);
  if (!m) return null;
  const h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return { h, m: min };
}

/** Retourne la prochaine prière et son heure (HH:MM). */
export function getNextPrayerFromTimings(timings: Timings): { name: string; time: string } | null {
  if (typeof window === "undefined") return null;
  const now = new Date();
  const nowM = now.getHours() * 60 + now.getMinutes();
  for (const name of ORDER) {
    const time = timings[name];
    if (!time) continue;
    const p = parseTime(time);
    if (!p) continue;
    const prayerM = p.h * 60 + p.m;
    if (prayerM > nowM) return { name, time };
  }
  const first = ORDER[0];
  const firstTime = timings[first];
  if (firstTime) return { name: first, time: firstTime };
  return null;
}

/** Minutes restantes jusqu'à l'heure HH:MM (aujourd'hui). */
export function minutesUntil(hhmm: string): number | null {
  const p = parseTime(hhmm);
  if (!p) return null;
  const now = new Date();
  const nowM = now.getHours() * 60 + now.getMinutes();
  const targetM = p.h * 60 + p.m;
  return targetM - nowM;
}

const REMINDER_KEY_PREFIX = "stopharam_prayer_reminded_";

export function getReminderKey(dateIso: string, prayerName: string): string {
  return `${REMINDER_KEY_PREFIX}${dateIso}_${prayerName}`;
}

export function wasRemindedToday(prayerName: string): boolean {
  if (typeof window === "undefined") return true;
  const today = new Date().toISOString().slice(0, 10);
  return window.localStorage.getItem(getReminderKey(today, prayerName)) === "1";
}

export function setRemindedToday(prayerName: string): void {
  if (typeof window === "undefined") return;
  const today = new Date().toISOString().slice(0, 10);
  window.localStorage.setItem(getReminderKey(today, prayerName), "1");
}

export function getPrayerSettings(): { city: string; country: string } | null {
  if (typeof window === "undefined") return null;
  const city = window.localStorage.getItem(STORAGE_KEYS.city)?.trim();
  const country = window.localStorage.getItem(STORAGE_KEYS.country)?.trim();
  if (!city || !country) return null;
  return { city, country };
}
