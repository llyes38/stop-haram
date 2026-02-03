import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendPushToUser, sendPushToAll } from "@/lib/sendPushNotifications";

/**
 * Envoie une notif de test à l'utilisateur connecté (ses abonnements push).
 * Si aucun abonnement lié au compte : tente l'envoi à tous (clé globale) pour compat ancien stockage.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as { title?: string; body?: string };
    const opts = {
      title: body.title ?? "StopHaram — Test",
      body: body.body ?? "Si tu vois ce message, les notifs push fonctionnent.",
      url: "/",
    };

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) {
      const { sent, total } = await sendPushToUser(user.id, opts);
      if (total > 0) return NextResponse.json({ sent, total });
    }

    const fallback = await sendPushToAll(opts);
    if (fallback.error) {
      return NextResponse.json(
        { sent: 0, total: 0, error: fallback.error === "Clés VAPID manquantes (variables d'environnement)." ? fallback.error : "Aucun abonnement. Bouge un toggle ci-dessus ou clique « Activer les notifications », puis réessaie." },
        { status: fallback.error?.includes("VAPID") ? 500 : 200 }
      );
    }
    return NextResponse.json({ sent: fallback.sent, total: fallback.total });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur inconnue";
    return NextResponse.json(
      { error: `Erreur : ${msg}` },
      { status: 500 }
    );
  }
}
