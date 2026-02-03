import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendPushToUser } from "@/lib/sendPushNotifications";

/**
 * Envoie une notif de test à l'utilisateur connecté (ses abonnements push).
 * Utilisé par le bouton "Envoyer une notif de test" dans Compte > Notifications.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      return NextResponse.json(
        { sent: 0, total: 0, error: "Connecte-toi pour recevoir le test sur cet appareil." },
        { status: 200 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as { title?: string; body?: string };
    const { sent, total } = await sendPushToUser(user.id, {
      title: body.title ?? "StopHaram — Test",
      body: body.body ?? "Si tu vois ce message, les notifs push fonctionnent.",
      url: "/",
    });

    return NextResponse.json({ sent, total });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur inconnue";
    return NextResponse.json(
      { error: `Erreur : ${msg}` },
      { status: 500 }
    );
  }
}
