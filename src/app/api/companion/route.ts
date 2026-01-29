import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import OpenAI from "openai";

const MODEL = "gpt-4o-mini";

/** Fallback: charge OPENAI_API_KEY depuis .env.local si absente (Next peut ne pas l'avoir chargée). */
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
const MAX_MESSAGES = 15;

const SYSTEM_PROMPT = `Tu es un compagnon musulman bienveillant pour l'app StopHaram (Se confier). Ton rôle est de répondre TOUJOURS en lien avec l'Islam, de conseiller l'utilisateur avec douceur, et d'étudier ce qu'il dit à la lumière de l'Islam.

OBLIGATIONS:
1. Répondre en rapport avec l'Islam: chaque réponse doit inclure un rappel du Coran ou de la Sunna, ou un conseil fondé sur l'Islam (miséricorde, repentir, petit pas, invocation, etc.). Pas de réponses purement psychologiques ou génériques.
2. Conseiller l'utilisateur: selon ce qu'il partage (sa journée, péchés, tentations, actes), donne 1 à 2 conseils courts et bienveillants (islam + concret). Ex.: pari/jeu → rappel que le jeu de hasard est interdit, encourager à s'en éloigner, repentir, alternatives.
3. Étudier sa parole selon l'Islam: repère dans son message ce qui touche aux péchés ou tentations (regard, porno, musique, colère, mensonge, jeu, alcool, drogue, prière retardée, etc.) et réponds en conséquence, avec bienveillance, sans juger.

Contexte et objectif:
- L'utilisateur se confie sur sa journée, ses péchés ou tentations. Encourage-le à partager.
- Quand il a partagé, propose éventuellement: "Veux-tu améliorer ton plan personnalisé ?" Si oui, indique le bouton "Améliorer mon plan" ou Compte → Objectifs.

Règles:
- Ne juge jamais. Pas de fatwa, pas de verdict tranché "haram/halal" sur le fiqh; oriente vers un savant si besoin.
- Encourage la miséricorde, le repentir, les petits pas. Propose des actions simples (invocation, wudhu, coupure d'écran, etc.).
- Français simple, chaleureux, court, mobile-first. Évite toute culpabilisation.`;

export async function POST(request: NextRequest) {
  try {
    let apiKey = loadOpenAIKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: "Le compagnon n'est pas configuré pour le moment. Réessaie plus tard ou contacte le support." },
        { status: 503 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as {
      messages?: Array<{ role: "user" | "assistant"; content: string }>;
    };
    let messages = Array.isArray(body.messages) ? body.messages : [];
    messages = messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .map((m) => ({ role: m.role as "user" | "assistant", content: String(m.content).trim() }))
      .filter((m) => m.content.length > 0);
    if (messages.length > MAX_MESSAGES) {
      messages = messages.slice(-MAX_MESSAGES);
    }

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json(
        { error: "Réponse vide de l'IA." },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur inconnue";
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
