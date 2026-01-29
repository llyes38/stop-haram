"use client";

import { useState, useCallback } from "react";

export type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_MESSAGES = 15;

export function useCompanionChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    const text = content.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => {
      const next = [...prev, userMsg];
      return next.length > MAX_MESSAGES ? next.slice(-MAX_MESSAGES) : next;
    });
    setLoading(true);
    setError(null);

    try {
      const history = [...messages, userMsg].slice(-MAX_MESSAGES);
      const res = await fetch("/api/companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };

      if (!res.ok) {
        setError(data.error ?? "Oups, je n'arrive pas à répondre. Réessaie.");
        return;
      }

      const reply = data.reply?.trim();
      if (reply) {
        setMessages((prev) => {
          const next = [...prev, { role: "assistant" as const, content: reply }];
          return next.length > MAX_MESSAGES ? next.slice(-MAX_MESSAGES) : next;
        });
      } else {
        setError("Oups, je n'arrive pas à répondre. Réessaie.");
      }
    } catch {
      setError("Oups, je n'arrive pas à répondre. Réessaie.");
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  const clearError = useCallback(() => setError(null), []);

  return { messages, loading, error, sendMessage, clearError };
}
