/**
 * Préférences de notifications (rappels) — stockées en localStorage.
 * Un seul toggle général : l'user reçoit un rappel (une notif par jour, le matin).
 */

const KEYS = {
  /** Un seul toggle : activer ou non les rappels (une notif par jour). */
  notifGeneral: "stopharam_notif_general",
  actionsReminded: "stopharam_actions_reminded",
} as const;

function get(key: string, defaultValue: "1" | "0"): "1" | "0" {
  if (typeof window === "undefined") return defaultValue;
  const v = window.localStorage.getItem(key);
  return v === "0" ? "0" : v === "1" ? "1" : defaultValue;
}

function set(key: string, value: "1" | "0"): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value);
}

const LEGACY_KEYS = {
  notifPriere: "stopharam_notif_priere",
  notifActions: "stopharam_notif_actions",
  notifVersetHadith: "stopharam_notif_verset_hadith",
} as const;

/** Préférence unique : recevoir un rappel (notification par jour). */
export function getNotifGeneral(): boolean {
  const v = get(KEYS.notifGeneral, "");
  if (v === "1") return true;
  if (v === "0") return false;
  // Migration : si l'user avait tout désactivé (anciennes clés), garder désactivé
  if (typeof window !== "undefined") {
    const anyOn =
      window.localStorage.getItem(LEGACY_KEYS.notifPriere) === "1" ||
      window.localStorage.getItem(LEGACY_KEYS.notifActions) === "1" ||
      window.localStorage.getItem(LEGACY_KEYS.notifVersetHadith) === "1";
    const anyOff =
      window.localStorage.getItem(LEGACY_KEYS.notifPriere) === "0" ||
      window.localStorage.getItem(LEGACY_KEYS.notifActions) === "0" ||
      window.localStorage.getItem(LEGACY_KEYS.notifVersetHadith) === "0";
    if (anyOff && !anyOn) return false;
  }
  return true;
}

export function setNotifGeneral(enabled: boolean): void {
  set(KEYS.notifGeneral, enabled ? "1" : "0");
}

/** Pour compat avec PrayerTimeReminder : tout dépend du toggle général. */
export function getNotifPriere(): boolean {
  return getNotifGeneral();
}

export function setNotifPriere(enabled: boolean): void {
  setNotifGeneral(enabled);
}

export function getNotifActions(): boolean {
  return getNotifGeneral();
}

export function setNotifActions(enabled: boolean): void {
  setNotifGeneral(enabled);
}

export function getNotifVersetHadith(): boolean {
  return getNotifGeneral();
}

export function setNotifVersetHadith(enabled: boolean): void {
  setNotifGeneral(enabled);
}

export function wasActionsRemindedToday(): boolean {
  if (typeof window === "undefined") return true;
  const today = new Date().toISOString().slice(0, 10);
  return window.localStorage.getItem(`${KEYS.actionsReminded}_${today}`) === "1";
}

export function setActionsRemindedToday(): void {
  if (typeof window === "undefined") return;
  const today = new Date().toISOString().slice(0, 10);
  window.localStorage.setItem(`${KEYS.actionsReminded}_${today}`, "1");
}
