"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ChatMessage } from "@/hooks/useCompanionChat";

interface CompanionChatDrawerProps {
  open: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  onSend: (content: string) => void;
  onClearError: () => void;
}

export default function CompanionChatDrawer({
  open,
  onClose,
  messages,
  loading,
  error,
  onSend,
  onClearError,
}: CompanionChatDrawerProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState("");

  const handleAmeliorerPlan = () => {
    onClose();
    router.push("/quiz?from=companion");
  };

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || loading) return;
    onSend(text);
    setDraft("");
    onClearError();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] max-w-[420px] mx-auto flex flex-col rounded-t-2xl bg-[#0a1f12] border border-white/10 border-b-0 shadow-2xl"
        role="dialog"
        aria-label="Se confier"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
          <div>
            <h2 className="text-violet-200 font-semibold text-base">Se confier</h2>
            <p className="text-white/60 text-xs mt-0.5">Parle librement, sans jugement.</p>
            <p className="text-white/50 text-[11px] mt-1 leading-relaxed max-w-[280px]">
              Confie-toi sur ta journée, sur tes péchés ou tentations (ce que tu as tenté ou fait). On pourra améliorer ton plan personnalisé. Dis tes péchés ou tentations ; quand tu les as partagés, on te proposera d&apos;améliorer ton plan. Si tu dis oui, on l&apos;adapte et on peut ajouter des péchés à ton plan. On est là pour toi — pas de fatwa, juste bienveillance et rappels.
            </p>
            <button
              type="button"
              onClick={handleAmeliorerPlan}
              className="mt-2 rounded-lg bg-violet-500/30 border border-violet-400/50 px-3 py-1.5 text-violet-200 text-[11px] font-medium hover:bg-violet-500/40 transition-colors"
            >
              Améliorer mon plan
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/15 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 min-h-[200px] max-h-[50vh] flex flex-col gap-4"
        >
          {error && (
            <div className="rounded-xl bg-amber-500/15 border border-amber-400/30 px-4 py-3 shrink-0">
              <p className="text-amber-200/90 text-sm">{error}</p>
            </div>
          )}
          {loading && (
            <div className="flex justify-start shrink-0">
              <div className="rounded-2xl rounded-bl-md bg-white/10 px-4 py-2.5 text-white/60 text-sm">
                Écrit…
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex shrink-0 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-violet-500/30 text-violet-100 rounded-br-md"
                    : "bg-white/10 text-white/95 rounded-bl-md"
                }`}
              >
                <span className="whitespace-pre-wrap">{m.content}</span>
              </div>
            </div>
          ))}
          {messages.length === 0 && !loading && !error && (
            <p className="text-white/50 text-sm text-center py-6 shrink-0">
              Écris un message pour parler au compagnon. Il est là pour t&apos;écouter.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 pt-2 border-t border-white/10 shrink-0">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écris ton message…"
              rows={1}
              disabled={loading}
              className="flex-1 rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/50 resize-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !draft.trim()}
              className="shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/40 border border-violet-400/50 text-violet-100 hover:bg-violet-500/50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              aria-label="Envoyer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
