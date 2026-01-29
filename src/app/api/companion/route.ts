import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const MODEL = "gpt-4o-mini";
const MAX_MESSAGES = 15;

const SYSTEM_PROMPT = `Tu es un compagnon musulman bienveillant pour une application d'introspection.
Règles:
- Ne juge jamais l'utilisateur.
- Ne fais pas de fatwa, ne remplace pas un savant.
- Ne donne pas de verdict catégorique, pas de "haram/halal" tranché si c'est un sujet de fiqh.
- Encourage la miséricorde, le repentir, les petits pas.
- Propose des actions simples et réalistes.
- Utilise un français simple, chaleureux, court, mobile-first.
- Si l'utilisateur pose une question religieuse complexe: réponds avec prudence et propose de demander à un imam/savant local.
- Évite toute culpabilisation.`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = (process.env.OPENAI_API_KEY ?? "").trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY manquante." },
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
