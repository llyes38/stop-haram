const STORAGE_KEY = "stopharam_daily_actions";

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

export function getTodayActionsState(): DailyActionsState {
  const key = getTodayKey();
  const data = loadRaw();
  const day = data[key];
  return {
    "1": day?.["1"] ?? false,
    "2": day?.["2"] ?? false,
    "3": day?.["3"] ?? false,
  };
}

export function setTodayActionDone(id: ActionId, done: boolean): void {
  const key = getTodayKey();
  const data = loadRaw();
  const day = { ...getTodayActionsState(), [id]: done };
  data[key] = day;
  saveRaw(data);
}

export function toggleTodayAction(id: ActionId): void {
  const state = getTodayActionsState();
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
  // Ne garder que les actions nécessaires
  const state: DailyActionsState = {} as DailyActionsState;
  for (let i = 1; i <= Math.min(count, 10); i++) {
    state[i.toString() as ActionId] = false;
  }
  data[key] = state;
  saveRaw(data);
}
