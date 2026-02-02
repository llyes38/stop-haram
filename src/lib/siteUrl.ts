/**
 * URL de base de l'app (prod ou local).
 * - En prod : NEXT_PUBLIC_SITE_URL ou NEXT_PUBLIC_APP_URL ou https://stop-haram.vercel.app
 * - En local : http://localhost:3000
 * Ne pas hardcoder un domaine unique.
 */
export function getSiteUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  const env =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL;
  if (env) return env;
  return "https://stop-haram.vercel.app";
}
