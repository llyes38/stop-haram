import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendPushToUser } from "@/lib/sendPushNotifications";

/**
 * Envoie une notif de test uniquement à l'utilisateur connecté (ses abonnements push).
 * N'envoie jamais aux autres appareils.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as { title?: string; body?: string };
    const opts = {
      title: body.title ?? "StopHaram — Test",
      body: body.body ?? "Si tu vois ce message, les notifs push fonctionnent.",
      url: "/home",
    };

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      return NextResponse.json(
        { sent: 0, total: 0, error: "Connecte-toi pour recevoir la notif de test sur ton appareil." },
        { status: 200 }
      );
    }

    const { sent, total } = await sendPushToUser(user.id, opts);
    if (total === 0) {
      return NextResponse.json(
        { sent: 0, total: 0, error: "Aucun appareil enregistré pour ce compte. Va dans Compte > Notifications, active un rappel et accepte « Autoriser » pour enregistrer cet appareil." },
        { status: 200 }
      );
    }
    return NextResponse.json({ sent, total });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur inconnue";
    return NextResponse.json(
      { error: `Erreur : ${msg}` },
      { status: 500 }
    );
  }
}
