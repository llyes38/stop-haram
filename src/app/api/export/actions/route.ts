import { NextResponse } from "next/server";
import { ACTION_1, FOCUS_ACTIONS, CUSTOM_SIN_ACTIONS } from "@/lib/programEngine";
import type { SelectedSin } from "@/lib/storage";

/** Évite le prerender au build (ACTION_1 / FOCUS_ACTIONS peuvent être undefined en contexte statique). */
export const dynamic = "force-dynamic";

/**
 * GET /api/export/actions — Liste de toutes les actions par type de péché (JSON).
 * Pour étudier les actions côté projet ou les réutiliser.
 */
export async function GET() {
  if (!ACTION_1 || !FOCUS_ACTIONS) {
    return NextResponse.json(
      { error: "Données actions non disponibles." },
      { status: 503 }
    );
  }

  const sinLabels: Record<SelectedSin, string> = {
    porno: "Relations illicites",
    musique: "Musique",
    priere: "Prière",
    colere: "Colère",
    drogue: "Drogue",
    alcool: "Alcool",
    jeux: "Jeux",
    mensonge: "Mensonge",
    regard: "Regard",
    autre: "Autre",
  };

  const sins: SelectedSin[] = ["porno", "musique", "priere", "colere", "drogue", "alcool", "jeux", "mensonge", "regard", "autre"];

  const bySin: Record<string, { label: string; action1: Array<{ title: string; desc: string }>; focus: Array<{ title: string; desc: string }> }> = {};
  for (const sin of sins) {
    bySin[sin] = {
      label: sinLabels[sin],
      action1: ACTION_1[sin] ?? [],
      focus: FOCUS_ACTIONS[sin] ?? [],
    };
  }

  const payload = {
    bySin,
    customSinActions: CUSTOM_SIN_ACTIONS,
  };

  return NextResponse.json(payload, {
    headers: {
      "Content-Disposition": 'attachment; filename="stop-haram-actions-par-peche.json"',
      "Cache-Control": "no-store",
    },
  });
}
