import { NextRequest, NextResponse } from "next/server";
import { sendPushToAll } from "@/lib/sendPushNotifications";
import {
  getVerseOrHadithForHour,
  getBienveillanceForHour,
  isVerseHour,
} from "@/lib/hourlyReminderContent";

/**
 * Cron Vercel : rappel chaque heure.
 * Heures paires (0, 2, 4, ... UTC) = verset ou hadith.
 * Heures impaires (1, 3, 5, ... UTC) = message de bienveillance "comment vas-tu, on est là pour toi".
 * Schedule dans vercel.json : "0 * * * *" (toutes les heures à :00).
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
    const now = new Date();
    let title: string;
    let body: string;

    if (isVerseHour(now)) {
      const v = getVerseOrHadithForHour(now);
      title = "StopHaram — Verset / hadith";
      body = `${v.texte} (${v.ref}). Khayr in cha Allah.`;
    } else {
      const msg = getBienveillanceForHour(now);
      title = "StopHaram — On est là pour toi";
      body = msg;
    }

    const { sent, total, error } = await sendPushToAll({ title, body });

    if (error) {
      return NextResponse.json({ sent: 0, total: 0, error }, { status: 200 });
    }
    return NextResponse.json({ sent, total, type: isVerseHour(now) ? "verse" : "bienveillance" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur inconnue";
    return NextResponse.json(
      { error: `Erreur cron hourly-reminder : ${msg}` },
      { status: 500 }
    );
  }
}
