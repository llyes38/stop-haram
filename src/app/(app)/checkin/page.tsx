"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ETATS_CHECKIN,
  getInvocationPourEtat,
  type EtatCheckin,
} from "@/lib/invocationsParEtat";

export default function CheckinPage() {
  const [selectedEtat, setSelectedEtat] = useState<EtatCheckin | null>(null);
  const [toast, setToast] = useState(false);

  const invocation = selectedEtat ? getInvocationPourEtat(selectedEtat) : null;

  const copyInvocation = () => {
    if (!invocation) return;
    const text = invocation.arabic
      ? `${invocation.arabic}\n\n${invocation.fullText}`
      : invocation.fullText;
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setToast(true);
        setTimeout(() => setToast(false), 1500);
      });
    }
  };

  return (
    <div className="w-full min-h-full flex flex-col px-6 pt-8 pb-8 text-white max-w-[420px] mx-auto">
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-white">
          Comment te sens-tu ?
        </h1>
        <p className="text-white/70 text-sm mt-1">
          Choisis ton état : on t&apos;envoie une invocation adaptée pour te recentrer.
        </p>
      </header>

      {!invocation ? (
        <div className="space-y-3 flex-1">
          {ETATS_CHECKIN.map(({ id, label, emoji }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedEtat(id)}
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-4 text-left flex items-center gap-4 hover:bg-white/10 active:scale-[0.98] transition-all"
            >
              <span className="text-2xl" aria-hidden>
                {emoji}
              </span>
              <span className="font-medium text-white">{label}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4 flex-1">
          <div className="rounded-xl bg-emerald-500/15 border border-emerald-400/30 px-4 py-4">
            <p className="text-emerald-200 font-semibold text-sm mb-2">
              Invocation pour toi
            </p>
            {invocation.arabic && (
              <p
                className="text-white/90 text-base mb-2 leading-relaxed"
                dir="rtl"
              >
                {invocation.arabic}
              </p>
            )}
            <p className="text-white/80 text-sm mb-2">{invocation.fullText}</p>
            {invocation.reference && (
              <p className="text-white/50 text-xs">{invocation.reference}</p>
            )}
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={copyInvocation}
                className="rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white/90 text-sm font-medium hover:bg-white/15"
              >
                Copier
              </button>
              <button
                type="button"
                onClick={() => setSelectedEtat(null)}
                className="rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white/80 text-sm"
              >
                Changer d&apos;état
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-emerald-500/90 px-4 py-2 text-white text-sm font-medium shadow-lg">
          Copié ✓
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-white/10">
        <Link
          href="/home"
          className="block w-full rounded-xl border border-white/20 py-3 text-center text-white/80 text-sm font-medium hover:bg-white/10"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
