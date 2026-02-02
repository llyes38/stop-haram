import { NextRequest, NextResponse } from "next/server";
import { sendPushToAll } from "@/lib/sendPushNotifications";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      title?: string;
      body?: string;
    };
    const { sent, total, error } = await sendPushToAll({
      title: body.title ?? "StopHaram",
      body: body.body ?? "Rappel : pense à tes actions du jour.",
    });

    if (error) {
      return NextResponse.json(
        { sent: 0, error: error === "Clés VAPID manquantes (variables d'environnement)." ? error : "Aucun abonnement enregistré. Réactive les notifications puis réessaie." },
        { status: error?.includes("VAPID") ? 500 : 200 }
      );
    }
    return NextResponse.json({ sent, total });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur inconnue";
    return NextResponse.json(
      { error: `Erreur lors de l'envoi : ${msg}` },
      { status: 500 }
    );
  }
}
