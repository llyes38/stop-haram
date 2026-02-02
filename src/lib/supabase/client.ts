import { createClient, type SupabaseClient } from "@supabase/supabase-js";

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

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: "pkce",
    detectSessionInUrl: true,
  },
});
