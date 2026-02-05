import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Callback OAuth (Google). Après connexion réussie → redirection vers l'app.
 * Si new_signup=1 (inscription depuis "Deviens un Stoppr"), on crée la ligne user_progress.
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
      /* client admin indisponible ou erreur ; le client complètera sur /home */
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
