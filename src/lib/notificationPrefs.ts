/**
 * Préférences de notifications (rappels) — stockées en localStorage.
 */

const KEYS = {
  notifPriere: "stopharam_notif_priere",
  notifActions: "stopharam_notif_actions",
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

export function getNotifPriere(): boolean {
  return get(KEYS.notifPriere, "1") === "1";
}

export function setNotifPriere(enabled: boolean): void {
  set(KEYS.notifPriere, enabled ? "1" : "0");
}

export function getNotifActions(): boolean {
  return get(KEYS.notifActions, "1") === "1";
}

export function setNotifActions(enabled: boolean): void {
  set(KEYS.notifActions, enabled ? "1" : "0");
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
