const STORAGE_KEY = "stopharam_daily_actions";
const STORAGE_KEY_BY_TITLE = "stopharam_daily_actions_titles";

export type ActionId = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";

export type DailyActionsState = Record<ActionId, boolean>;

function getTodayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function loadRaw(): Record<string, DailyActionsState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, DailyActionsState>;
  } catch {
    return {};
  }
}

function saveRaw(data: Record<string, DailyActionsState>): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadTitlesRaw(): Record<string, string[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_BY_TITLE);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, string[]>;
  } catch {
    return {};
  }
}

function saveTitlesRaw(data: Record<string, string[]>): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY_BY_TITLE, JSON.stringify(data));
}

/** Completions stockées par titre d'action — évite de barrer des actions quand le plan change. */
export function getCompletedActionTitlesForToday(): string[] {
  const key = getTodayKey();
  const data = loadTitlesRaw();
  return data[key] ?? [];
}

/** Vérifie si une action est marquée complétée (par son titre). */
export function isActionCompletedByTitle(title: string): boolean {
  const completed = getCompletedActionTitlesForToday();
  return completed.includes(title);
}

/** Bascule la complétion d'une action par son titre. */
export function toggleActionByTitle(title: string): void {
  const key = getTodayKey();
  const data = loadTitlesRaw();
  const completed = data[key] ?? [];
  const idx = completed.indexOf(title);
  const next = idx >= 0 ? completed.filter((_, i) => i !== idx) : [...completed, title];
  data[key] = next;
  saveTitlesRaw(data);
}

export function getTodayActionsState(count: number = 3): DailyActionsState {
  const key = getTodayKey();
  const data = loadRaw();
  const day = data[key];
  const n = Math.min(Math.max(1, count), 10);
  const out: DailyActionsState = {
    "1": false, "2": false, "3": false, "4": false, "5": false,
    "6": false, "7": false, "8": false, "9": false, "10": false,
  };
  for (let i = 1; i <= n; i++) {
    const id = String(i) as ActionId;
    out[id] = day?.[id] ?? false;
  }
  return out;
}

export function setTodayActionDone(id: ActionId, done: boolean): void {
  const key = getTodayKey();
  const data = loadRaw();
  const existing = (data[key] ?? {}) as Record<string, boolean>;
  const day = { ...existing, [id]: done } as DailyActionsState;
  data[key] = day;
  saveRaw(data);
}

export function toggleTodayAction(id: ActionId, count: number = 10): void {
  const state = getTodayActionsState(count);
  setTodayActionDone(id, !state[id]);
}

/** Réinitialise toutes les actions du jour (ex. en cas de rechute). Le client « perd » la validation du jour. */
export function clearTodayActions(count: number = 3): void {
  const key = getTodayKey();
  const data = loadRaw();
  const cleared: DailyActionsState = {
    "1": false, "2": false, "3": false, "4": false, "5": false,
    "6": false, "7": false, "8": false, "9": false, "10": false,
  };
  const state: DailyActionsState = {} as DailyActionsState;
  for (let i = 1; i <= Math.min(count, 10); i++) {
    state[i.toString() as ActionId] = false;
  }
  data[key] = state;
  saveRaw(data);
  const titlesData = loadTitlesRaw();
  titlesData[key] = [];
  saveTitlesRaw(titlesData);
}
