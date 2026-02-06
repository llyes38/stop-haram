import { NextRequest, NextResponse } from "next/server";
import { sendPushToUser, sendPushToDevice } from "@/lib/sendPushNotifications";

/**
 * Envoie une notif de test : par user (Supabase) ou par device_key (MVP sans compte).
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as { title?: string; body?: string; device_key?: string };
    const opts = {
      title: body.title ?? "StopHaram — Test",
      body: body.body ?? "Si tu vois ce message, les notifs push fonctionnent.",
      url: "/home",
    };

    const deviceKey = typeof body.device_key === "string" ? body.device_key.trim() : undefined;

    // MVP : priorité device_key (sans compte)
    if (deviceKey) {
      const { sent, total } = await sendPushToDevice(deviceKey, opts);
      if (total === 0) {
        return NextResponse.json(
          { sent: 0, total: 0, error: "Aucun appareil enregistré. Active un rappel et accepte « Autoriser » les notifications." },
          { status: 200 }
        );
      }
      return NextResponse.json({ sent, total });
    }

    // Fallback : user Supabase (si un jour on réactive l'auth)
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) {
      const { sent, total } = await sendPushToUser(user.id, opts);
      if (total === 0) {
        return NextResponse.json(
          { sent: 0, total: 0, error: "Aucun appareil enregistré. Va dans Compte > Notifications, active un rappel et accepte « Autoriser »." },
          { status: 200 }
        );
      }
      return NextResponse.json({ sent, total });
    }

    return NextResponse.json(
      { sent: 0, total: 0, error: "Ouvre la page Rappels dans l'app et envoie une notif de test depuis là." },
      { status: 200 }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur inconnue";
    return NextResponse.json(
      { error: `Erreur : ${msg}` },
      { status: 500 }
    );
  }
}
