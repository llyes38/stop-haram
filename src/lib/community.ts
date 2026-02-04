/**
 * Communauté StopHaram — constantes et utilitaires.
 */

export const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://stop-haram.vercel.app";
export const WHATSAPP_COMMUNITY_URL = "REPLACE_ME_WITH_YOUR_WHATSAPP_LINK";

const CHALLENGE_JOINED_KEY = "community_week_challenge_joined";

export function hasJoinedWeekChallenge(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(CHALLENGE_JOINED_KEY) === "true";
}

export function setWeekChallengeJoined(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CHALLENGE_JOINED_KEY, "true");
}
