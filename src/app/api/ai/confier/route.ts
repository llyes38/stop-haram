import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const MODEL = "gpt-4o-mini";

const SYSTEM_PROMPT = `Tu es un assistant musulman bienveillant au sein de l'app StopHaram. L'utilisateur se confie sur des difficultés (péchés, rechutes, luttes) pour ne pas rester seul et recevoir un rappel bienveillant.

Règles strictes:
- Réponds en français, avec empathie et bienveillance. Pas de jugement.
- Donne 1 à 2 conseils courts et pratiques (islam + psychologie), avec un rappel du Coran ou de la Sunna si pertinent.
- N'émets jamais de fatwa ni de jugement légal. Dirige vers un savant ou un imam pour les questions de fiqh.
- Encourage le repentir et la miséricorde d'Allah. Rappelle que "Allah aime celui qui se repent".
- Réponse concise: 2 à 4 phrases, ton doux et encourageant.`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = (process.env.OPENAI_API_KEY ?? "").trim();
    if (!apiKey) {
      return NextResponse.json(
        { useFallback: true, error: "OPENAI_API_KEY manquante." },
        { status: 503 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as {
      sins?: string[];
      note?: string;
    };
    const sins = Array.isArray(body.sins) ? body.sins : [];
    const note = typeof body.note === "string" ? body.note.trim() : "";

    const parts: string[] = [];
    if (sins.length > 0) {
      parts.push(`Points sur lesquels il/elle se confie : ${sins.join(", ")}.`);
    }
    if (note) {
      parts.push(`Il/elle a écrit : « ${note} ».`);
    }
    const userContext = parts.length > 0
      ? parts.join(" ")
      : "L'utilisateur souhaite se confier sans préciser de point particulier.";

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContext },
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content?.trim();
    if (!text) {
      return NextResponse.json(
        { useFallback: true, error: "Réponse vide de l'IA." },
        { status: 502 }
      );
    }

    return NextResponse.json({ text });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur inconnue";
    return NextResponse.json(
      { useFallback: true, error: msg },
      { status: 500 }
    );
  }
}
