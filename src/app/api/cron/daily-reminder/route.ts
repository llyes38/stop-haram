import { NextRequest, NextResponse } from "next/server";
import { sendPushToAll } from "@/lib/sendPushNotifications";
import { getVerseOfTheDay } from "@/lib/verseOfTheDay";

/**
 * Cron Vercel : rappel automatique "actions du jour" (9h Paris) + verset du jour.
 * À configurer dans vercel.json + variable CRON_SECRET sur Vercel.
 * Vercel envoie Authorization: Bearer <CRON_SECRET>.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET ?? "";
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const verse = getVerseOfTheDay(new Date());
    const body = `Pense à faire tes actions du jour. Verset du jour : ${verse.texte} (${verse.ref}). Khayr in cha Allah.`;

    const { sent, total, error } = await sendPushToAll({
      title: "StopHaram — Actions du jour",
      body,
    });

    if (error) {
      return NextResponse.json({ sent: 0, total: 0, error }, { status: 200 });
    }
    return NextResponse.json({ sent, total });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur inconnue";
    return NextResponse.json(
      { error: `Erreur cron daily-reminder : ${msg}` },
      { status: 500 }
    );
  }
}
