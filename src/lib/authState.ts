export interface StopharamAuth {
  isLoggedIn: boolean;
  email?: string;
}

export interface StopharamState {
  onboardingComplete: boolean;
  lastRoute?: string;
  startDate?: string;
  dayCount?: number;
  relapse?: boolean;
}

export interface StopharamProfile {
  name: string;
  selectedSins?: string[];
  [key: string]: unknown;
}

const AUTH_KEY = "stopharam_auth";
const STATE_KEY = "stopharam_state";
const PROFILE_KEY = "stopharam_profile";

export function getAuth(): StopharamAuth | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StopharamAuth;
  } catch {
    return null;
  }
}

export function setAuth(auth: StopharamAuth): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  window.localStorage.setItem("is_logged_in", auth.isLoggedIn ? "true" : "false");
}

export function getState(): StopharamState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STATE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StopharamState;
  } catch {
    return null;
  }
}

export function setState(state: StopharamState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

export function updateLastRoute(path: string): void {
  const state = getState() ?? { onboardingComplete: false };
  setState({ ...state, lastRoute: path });
}

export function getProfile(): StopharamProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StopharamProfile;
  } catch {
    return null;
  }
}

export function setProfile(profile: StopharamProfile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function isLoggedIn(): boolean {
  const auth = getAuth();
  if (auth?.isLoggedIn) return true;
  return typeof window !== "undefined" && window.localStorage.getItem("is_logged_in") === "true";
}

export function isOnboardingComplete(): boolean {
  const state = getState();
  if (state && "onboardingComplete" in state) return state.onboardingComplete === true;
  return true;
}

export function resetOnboarding(): void {
  setState({
    onboardingComplete: false,
    lastRoute: undefined,
    startDate: undefined,
    dayCount: 0,
    relapse: undefined,
  });
  setProfile({ name: "" });
}

export function completeOnboarding(): void {
  const state = getState() ?? { onboardingComplete: false };
  setState({ ...state, onboardingComplete: true });
}

const PARCOURS_ROUTES = [
  "/profile",
  "/quiz",
  "/analysis",
  "/analysis/result",
  "/symptoms",
  "/awareness",
  "/onboarding",
  "/testimonials",
  "/objectives",
  "/plan",
  "/offer",
  "/checkout",
  "/signup",
  "/rechute",
  "/test",
  "/urgence",
];

const PUBLIC_ROUTES = ["/start", "/login"];

export const FIRST_PARCOURS_STEP = "/profile";

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));
}

export function isParcoursRoute(pathname: string): boolean {
  return PARCOURS_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));
}

export function isAppRoute(pathname: string): boolean {
  return ["/home", "/parcours", "/progress", "/account", "/urgence", "/"].includes(pathname) || pathname.startsWith("/home") || pathname.startsWith("/parcours") || pathname.startsWith("/progress") || pathname.startsWith("/account");
}
