const LAST_NUDGE_DATE_KEY = "last_auth_nudge_date";
const GUEST_ACTIONS_KEY = "stopharam_guest_actions_count";
const PARCOURS_VISITED_KEY = "stopharam_parcours_visited";

/**
 * Retourne true si on peut afficher le nudge "connecte-toi" (max 1 fois par jour).
 */
export function canShowAuthNudge(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(LAST_NUDGE_DATE_KEY);
    if (!raw) return true;
    const last = new Date(raw);
    const today = new Date();
    return last.toDateString() !== today.toDateString();
  } catch {
    return true;
  }
}

/**
 * Marque le nudge comme affiché aujourd'hui.
 */
export function markAuthNudgeShown(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LAST_NUDGE_DATE_KEY, new Date().toISOString());
}

/**
 * Incrémente le compteur d'actions invité (pour déclencher le nudge après 2 actions).
 */
export function incrementGuestActions(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(GUEST_ACTIONS_KEY);
    const n = raw ? Math.max(0, parseInt(raw, 10) + 1) : 1;
    window.localStorage.setItem(GUEST_ACTIONS_KEY, String(n));
  } catch {
    /* ignore */
  }
}

/**
 * Nombre d'actions accomplies en mode invité.
 */
export function getGuestActionsCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(GUEST_ACTIONS_KEY);
    return raw ? Math.max(0, parseInt(raw, 10)) : 0;
  } catch {
    return 0;
  }
}

/**
 * Marque que l'invité a visité la page parcours (début parcours).
 */
export function markParcoursVisited(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PARCOURS_VISITED_KEY, "1");
}

/**
 * True si l'invité a déjà visité la page parcours.
 */
export function wasParcoursVisited(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(PARCOURS_VISITED_KEY) === "1";
}
