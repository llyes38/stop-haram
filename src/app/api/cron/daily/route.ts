import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getScheduledAtUtc,
  isInQuietHours,
  shiftAfterQuietEnd,
} from "@/lib/scheduleNotification";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type NotificationPrefRow = {
  user_id: string;
  timezone: string;
  daily_checkin_enabled: boolean;
  daily_checkin_time: string;
  actions_morning: boolean;
  actions_morning_time: string;
  actions_evening: boolean;
  actions_evening_time: string;
  sin_reminder_enabled: boolean;
  sin_reminder_time: string;
  quiet_start: string;
  quiet_end: string;
  checkin_2h_enabled?: boolean;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://stop-haram.vercel.app";

function applyQuietHours(
  scheduled: Date,
  quietStart: string,
  quietEnd: string,
  timezone: string
): Date {
  if (!isInQuietHours(scheduled, quietStart, quietEnd, timezone)) return scheduled;
  return shiftAfterQuietEnd(scheduled, quietEnd, timezone);
}

function getCronSecret(request: NextRequest): string | null {
  const { searchParams } = new URL(request.url);
  const fromQuery = searchParams.get("secret");
  if (fromQuery) return fromQuery;
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7).trim();
  return null;
}

export async function POST(request: NextRequest) {
  const secret = getCronSecret(request);
  const cronSecret = process.env.CRON_SECRET ?? "";
  if (cronSecret && secret !== cronSecret) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis (Vercel env)." },
      { status: 503 }
    );
  }

  try {
    const admin = createAdminClient();
    const { data: prefs, error: prefsError } = await admin
      .from("notification_prefs")
      .select("user_id, timezone, daily_checkin_enabled, daily_checkin_time, actions_morning, actions_morning_time, actions_evening, actions_evening_time, sin_reminder_enabled, sin_reminder_time, quiet_start, quiet_end, checkin_2h_enabled");

    if (prefsError) {
      return NextResponse.json(
        { error: `notification_prefs: ${prefsError.message}` },
        { status: 500 }
      );
    }

    const now = new Date();
    const rows: { user_id: string; type: string; scheduled_at: string; payload: object }[] = [];
    const countsByType: Record<string, number> = {};

    for (const p of (prefs ?? []) as NotificationPrefRow[]) {
      const tz = p.timezone || "Europe/Paris";
      const qStart = p.quiet_start ?? "23:30";
      const qEnd = p.quiet_end ?? "08:00";

      const enqueue = (
        type: string,
        timeStr: string,
        title: string,
        body: string,
        url: string
      ) => {
        let scheduled = getScheduledAtUtc(timeStr, tz, now);
        scheduled = applyQuietHours(scheduled, qStart, qEnd, tz);
        if (scheduled <= now) return;
        rows.push({
          user_id: p.user_id,
          type,
          scheduled_at: scheduled.toISOString(),
          payload: { title, body, url },
        });
        countsByType[type] = (countsByType[type] ?? 0) + 1;
      };

      if (p.daily_checkin_enabled) {
        enqueue(
          "daily_checkin",
          p.daily_checkin_time ?? "20:30",
          "StopHaram — Check-in",
          "Pense à faire ton check-in du jour.",
          `${SITE_URL}/checkin`
        );
      }
      if (p.actions_morning) {
        enqueue(
          "actions_morning",
          p.actions_morning_time ?? "08:30",
          "StopHaram — Actions du matin",
          "Rappel : tes actions du jour t'attendent.",
          `${SITE_URL}/home`
        );
      }
      if (p.actions_evening) {
        enqueue(
          "actions_evening",
          p.actions_evening_time ?? "21:30",
          "StopHaram — Actions du soir",
          "Pense à valider tes actions du jour.",
          `${SITE_URL}/home`
        );
      }
      if (p.sin_reminder_enabled) {
        enqueue(
          "sin_reminder",
          p.sin_reminder_time ?? "23:00",
          "StopHaram — Rappel",
          "Un instant pour toi.",
          `${SITE_URL}/home`
        );
      }
      if (p.checkin_2h_enabled) {
        const feelCheckTimes = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
        for (const timeStr of feelCheckTimes) {
          enqueue(
            "feel_check",
            timeStr,
            "StopHaram — Comment te sens-tu ?",
            "Ouvre l'app pour un rappel adapté à ton état.",
            `${SITE_URL}/checkin`
          );
        }
      }
    }

    if (rows.length === 0) {
      return NextResponse.json({ queued: 0, users: prefs?.length ?? 0 });
    }

    const { error: insertError } = await admin.from("notification_queue").insert(
      rows.map((r) => ({
        user_id: r.user_id,
        type: r.type,
        scheduled_at: r.scheduled_at,
        payload: r.payload,
        status: "pending",
      }))
    );

    if (insertError) {
      return NextResponse.json(
        { error: `notification_queue insert: ${insertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ queued: rows.length, users: prefs?.length ?? 0, by_type: countsByType });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur inconnue";
    return NextResponse.json(
      { error: `cron daily: ${msg}` },
      { status: 500 }
    );
  }
}
