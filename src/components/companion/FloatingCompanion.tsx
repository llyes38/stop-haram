"use client";

import { useState } from "react";
import { useCompanionChat } from "@/hooks/useCompanionChat";
import CompanionChatDrawer from "./CompanionChatDrawer";

export default function FloatingCompanion() {
  const [open, setOpen] = useState(false);
  const { messages, loading, error, sendMessage, clearError } = useCompanionChat();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-32 left-4 z-[35] flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/30 border border-violet-400/50 text-violet-200 shadow-lg hover:bg-violet-500/40 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-violet-400/50"
        aria-label="Ouvrir le chat — Se confier"
        title="Se confier"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>
      <CompanionChatDrawer
        open={open}
        onClose={() => setOpen(false)}
        messages={messages}
        loading={loading}
        error={error}
        onSend={sendMessage}
        onClearError={clearError}
      />
    </>
  );
}
