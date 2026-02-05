import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL est absent. Définissez-la dans .env.local (et sur Vercel si déployé)."
  );
}
if (!supabaseAnonKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY est absente. Définissez-la dans .env.local (et sur Vercel si déployé)."
  );
}

/**
 * Client Supabase pour le navigateur (composants client).
 * Utilise @supabase/ssr pour stocker le code verifier PKCE dans des cookies,
 * (session Magic Link / Auth).
 */
export const supabase: SupabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
