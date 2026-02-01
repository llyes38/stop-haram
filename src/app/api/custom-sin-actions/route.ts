import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import OpenAI from "openai";

const MODEL = "gpt-4o-mini";

function loadOpenAIKey(): string {
  let key = (process.env.OPENAI_API_KEY ?? "").trim();
  if (key) return key;
  try {
    const envPath = join(process.cwd(), ".env.local");
    if (!existsSync(envPath)) return "";
    const raw = readFileSync(envPath, "utf8");
    for (const line of raw.split("\n")) {
      const idx = line.indexOf("=");
      if (idx === -1) continue;
      const k = line.slice(0, idx).trim();
      if (k !== "OPENAI_API_KEY") continue;
      let v = line.slice(idx + 1).trim();
      const c = v.startsWith('"') ? '"' : v.startsWith("'") ? "'" : null;
      if (c) v = v.slice(1, v.endsWith(c) ? v.length - 1 : v.length).trim();
      const hash = v.indexOf("#");
      if (hash !== -1) v = v.slice(0, hash).trim();
      if (v) return v;
      break;
    }
  } catch {
    /* ignore */
  }
  return "";
}

const SYSTEM_PROMPT = `Tu es un assistant pour l'app StopHaram qui aide les musulmans à corriger leurs péchés par des actions quotidiennes personnalisées.

TÂCHE: Génère des actions islamiques CONCRÈTES pour un péché personnalisé. Chaque action doit être une TÂCHE À FAIRE MAINTENANT, pas une idée vague.

OBLIGATOIRE — Actions CONCRÈTES (exemples de BON titre):
- "Réciter Subhanallah 33 fois ce matin"
- "Faire les ablutions maintenant"
- "Lire sourate Al-Ikhlas 10 fois"
- "Appeler un proche pour prendre de ses nouvelles"
- "Prier 2 raka'at de Duha"
- "Faire une sadaqa de 1 euro"
- "Baisser le regard 5 fois dans la journée quand une tentation arrive"
- "Écouter 15 min de Coran"

INTERDIT — Idées vagues (exemples de MAUVAIS titre):
- "Pratiquer l'autodiscipline" (trop vague)
- "Respect de la pudeur" (concept, pas action)
- "Éducation continue" (trop vague)
- "Faire du dhikr continu" (préciser: combien, lequel)
- "Être plus patient" (vague)
- "Améliorer sa spiritualité" (vague)

FORMAT (JSON strict):
{
  "action1": [
    { "title": "Action concrète à faire ( verbe + quantité/moment si pertinent )", "desc": "Description avec rappel Coran/Hadith" }
  ],
  "focus": [
    { "title": "Action concrète", "desc": "Description" }
  ]
}

RÈGLES:
1. 12 actions dans "action1", 10 dans "focus". Toutes différentes.
2. Chaque "title" = UNE action à effectuer réellement (verbe d'action + objet concret + nombre/durée si pertinent).
3. Lié au péché mentionné. Ex: voyeurisme → "Baisser le regard 10 fois quand tentation", "Réciter A'udhu billahi 3 fois avant de sortir".
4. Français, ton islamique.
5. Ne génère QUE du JSON valide.`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = loadOpenAIKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: "Service non configuré. Réessaie plus tard." },
        { status: 503 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as { customSin?: string };
    const customSin = typeof body.customSin === "string" ? body.customSin.trim() : "";
    if (!customSin || customSin.length < 2) {
      return NextResponse.json(
        { error: "Péché personnalisé requis." },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Génère des actions pour ce péché personnalisé: "${customSin}"`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) {
      return NextResponse.json({ error: "Réponse vide de l'IA." }, { status: 500 });
    }

    const parsed = JSON.parse(content) as {
      action1?: Array<{ title?: string; desc?: string }>;
      focus?: Array<{ title?: string; desc?: string }>;
    };

    const action1 = Array.isArray(parsed.action1)
      ? parsed.action1
          .filter((a) => a && typeof a.title === "string" && typeof a.desc === "string")
          .map((a) => ({ title: String(a.title).slice(0, 80), desc: String(a.desc).slice(0, 300) }))
          .slice(0, 15)
      : [];
    const focus = Array.isArray(parsed.focus)
      ? parsed.focus
          .filter((a) => a && typeof a.title === "string" && typeof a.desc === "string")
          .map((a) => ({ title: String(a.title).slice(0, 80), desc: String(a.desc).slice(0, 300) }))
          .slice(0, 12)
      : [];

    if (action1.length < 5 || focus.length < 3) {
      return NextResponse.json(
        { error: "Pas assez d'actions générées. Réessaie." },
        { status: 500 }
      );
    }

    return NextResponse.json({ action1, focus });
  } catch (e) {
    console.error("[custom-sin-actions]", e);
    return NextResponse.json(
      { error: "Erreur lors de la génération. Réessaie plus tard." },
      { status: 500 }
    );
  }
}
