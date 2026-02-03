import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/**
 * Client Supabase avec service_role pour les crons (lecture notification_prefs,
 * insertion/lecture notification_queue). Ne pas utiliser côté client.
 */
export function createAdminClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis pour le client admin.");
  }
  return createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
}
