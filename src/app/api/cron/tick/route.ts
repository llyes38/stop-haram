import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendPushToUser } from "@/lib/sendPushNotifications";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type QueueRow = {
  id: string;
  user_id: string;
  type: string;
  scheduled_at: string;
  payload: { title?: string; body?: string; url?: string };
  status: string;
};

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
    const now = new Date().toISOString();

    const { data: due, error: fetchError } = await admin
      .from("notification_queue")
      .select("id, user_id, type, scheduled_at, payload, status")
      .eq("status", "pending")
      .lte("scheduled_at", now);

    if (fetchError) {
      return NextResponse.json(
        { error: `notification_queue select: ${fetchError.message}` },
        { status: 500 }
      );
    }

    const items = (due ?? []) as QueueRow[];
    let sent = 0;
    let failed = 0;

    for (const row of items) {
      const payload = (row.payload ?? {}) as { title?: string; body?: string; url?: string };
      const { sent: s, total } = await sendPushToUser(row.user_id, {
        title: payload.title ?? "StopHaram",
        body: payload.body ?? "Rappel",
        url: payload.url ?? "/",
      });

      const newStatus = total > 0 && s > 0 ? "sent" : "failed";
      if (newStatus === "sent") sent++;
      else failed++;

      await admin
        .from("notification_queue")
        .update({
          status: newStatus,
          sent_at: new Date().toISOString(),
        })
        .eq("id", row.id);
    }

    return NextResponse.json({ processed: items.length, sent, failed });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur inconnue";
    return NextResponse.json(
      { error: `cron tick: ${msg}` },
      { status: 500 }
    );
  }
}
