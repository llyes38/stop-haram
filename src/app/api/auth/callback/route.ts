import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Callback OAuth (Google, etc.) — route API uniquement, pas de page.
 * Seuls les comptes ayant fait l'onboarding + paiement + inscription (présents dans user_progress) peuvent se reconnecter.
 * On utilise le client admin pour vérifier user_progress : la session cookie n'est pas toujours prise en compte par RLS dans la même requête.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirect") ?? "/home";
  const next = redirectTo.startsWith("/") ? redirectTo : "/home";
  const origin = new URL(request.url).origin;
  const isNewSignup = searchParams.get("new_signup") === "1";

  if (!code) {
    return NextResponse.redirect(new URL(`${origin}/login?error=callback`, request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[api/auth/callback]", error.message);
    return NextResponse.redirect(new URL(`${origin}/login?error=callback`, request.url));
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) {
    return NextResponse.redirect(new URL(`${origin}/login?error=callback`, request.url));
  }

  if (isNewSignup) {
    // Créer tout de suite une ligne user_progress pour que la reconnexion fonctionne (la sauvegarde client sur /home peut être en retard ou échouer)
    try {
      const admin = createAdminClient();
      await admin.from("user_progress").upsert(
        {
          user_id: user.id,
          data: { state: { onboardingComplete: true } },
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    } catch {
      // Ignorer si admin indisponible ; le client complètera sur /home
    }
    return NextResponse.redirect(`${origin}${next}`);
  }

  // Vérifier avec le client admin pour éviter les faux négatifs (RLS/session pas encore dispo dans la même requête)
  let hasProgressRow = false;
  try {
    const admin = createAdminClient();
    const { data: row } = await admin
      .from("user_progress")
      .select("data")
      .eq("user_id", user.id)
      .maybeSingle();
    hasProgressRow = row != null && (row as { data?: unknown }).data != null;
  } catch {
    // Si admin indisponible (ex. env manquante), fallback sur le client session
    const { data: row } = await supabase
      .from("user_progress")
      .select("data")
      .eq("user_id", user.id)
      .maybeSingle();
    hasProgressRow = row != null && (row as { data?: unknown }).data != null;
  }

  if (!hasProgressRow) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL(`${origin}/login?error=not_registered`, request.url));
  }

  return NextResponse.redirect(`${origin}${next}`);
}
