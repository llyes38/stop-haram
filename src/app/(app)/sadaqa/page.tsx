"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  SADAQA_HADITH,
  SADAQA_VERSE,
  SADAQA_CAUSES,
  type SadaqaCause,
} from "@/lib/sadaqaData";
import { addDon } from "@/lib/sadaqaStorage";

const AMOUNT_PRESETS = [5, 10, 20, 50] as const;

export default function SadaqaPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<SadaqaCause | null>(null);
  const [amount, setAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const customVal = customAmount.trim()
    ? Math.max(0, parseFloat(customAmount.replace(",", ".")) || 0)
    : null;
  const effectiveAmount = customVal !== null ? customVal : amount;
  const isValidAmount = Number.isFinite(effectiveAmount) && effectiveAmount > 0;

  const handleDonate = () => {
    if (!selected || effectiveAmount <= 0) return;
    setLoading(true);
    setTimeout(() => {
      addDon({
        causeId: selected.id,
        causeLabel: selected.label,
        amountEur: effectiveAmount,
      });
      setLoading(false);
      setDone(true);
    }, 1200);
  };

  const handleBack = () => {
    setSelected(null);
    setAmount(10);
    setCustomAmount("");
    setDone(false);
  };

  return (
    <div className="w-full flex flex-col px-6 pt-8 pb-8 text-white max-w-[420px] mx-auto">
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-white">Sadaqa</h1>
        <p className="text-white/70 text-sm mt-1">
          La sadaqa efface le péché comme l&apos;eau éteint le feu.
        </p>
      </header>

      {/* Hadith + verset */}
      <div className="rounded-2xl bg-amber-500/10 border border-amber-400/25 px-5 py-4 mb-6">
        <p className="text-amber-200 font-semibold text-sm mb-2">Hadith</p>
        <p className="text-white/95 text-base mb-2" dir="rtl">
          {SADAQA_HADITH.ar}
        </p>
        <p className="text-white/90 text-sm italic mb-4">&quot;{SADAQA_HADITH.fr}&quot;</p>
        <p className="text-amber-200/80 text-xs">{SADAQA_HADITH.ref}</p>
        <div className="mt-4 pt-4 border-t border-amber-400/20">
          <p className="text-amber-200 font-semibold text-sm mb-1">Verset</p>
          <p className="text-white/90 text-sm italic">&quot;{SADAQA_VERSE.text}&quot;</p>
          <p className="text-amber-200/80 text-xs mt-1">{SADAQA_VERSE.ref}</p>
        </div>
      </div>

      {!selected ? (
        <>
          <p className="text-white/80 text-sm mb-3">
            Choisis une cause pour ton don. <span className="text-amber-200/90">Paiement simulé</span> — aucun prélèvement réel.
          </p>
          <div className="rounded-xl bg-amber-500/10 border border-amber-400/20 px-4 py-3 mb-4">
            <p className="text-amber-200/90 text-xs font-medium mb-1">Projets sadaqa</p>
            <p className="text-white/80 text-xs leading-relaxed">
              Les projets sont <strong className="text-white">tracés</strong> et <strong className="text-white">mis en ligne</strong>, 
              en partenariat avec des <strong className="text-white">sponsors authentiques</strong>. 
              Quand les partenariats seront actifs, tu pourras donner pour de vrai.
            </p>
          </div>
          <div className="grid gap-3">
            {SADAQA_CAUSES.map((c) => (
              <div key={c.id} className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setSelected(c)}
                  className="w-full px-4 py-4 text-left flex items-center gap-4 hover:bg-white/10 transition-colors"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-lg">
                    {c.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white">{c.label}</p>
                    <p className="text-white/60 text-xs mt-0.5">{c.description}</p>
                  </div>
                  <span className="text-white/40 shrink-0" aria-hidden>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
                {c.externalUrl && c.partnerLabel && (
                  <div className="px-4 pb-3 pt-0">
                    <a
                      href={c.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/20 border border-emerald-400/30 px-3 py-2 text-emerald-200 text-xs font-medium hover:bg-emerald-500/30 transition-colors"
                    >
                      Donner pour de vrai — {c.partnerLabel}
                      <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : done ? (
        <div className="rounded-2xl bg-emerald-500/20 border border-emerald-400/40 px-5 py-8 text-center">
          <p className="text-4xl mb-3">🤲</p>
          <p className="text-emerald-200 font-semibold text-lg">Don enregistré</p>
          <p className="text-white/90 text-sm mt-1">Barakallahou fik.</p>
          <p className="text-white/60 text-xs mt-3">
            {effectiveAmount} € — {selected.label} (simulation)
          </p>
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 rounded-xl bg-white/10 border border-white/20 py-3 text-white/90 text-sm font-medium hover:bg-white/15"
            >
              Autre don
            </button>
            <button
              type="button"
              onClick={() => router.push("/home")}
              className="flex-1 rounded-xl bg-emerald-500/25 border border-emerald-400/40 py-3 text-emerald-200 text-sm font-semibold hover:bg-emerald-500/35"
            >
              Retour à l&apos;accueil
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-lg">
              {selected.icon}
            </span>
            <div>
              <p className="font-semibold text-white">{selected.label}</p>
              <p className="text-white/60 text-xs">{selected.description}</p>
            </div>
          </div>

          {selected.externalUrl && selected.partnerLabel && (
            <a
              href={selected.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/25 border border-emerald-400/40 px-4 py-3 text-emerald-200 text-sm font-semibold hover:bg-emerald-500/35 transition-colors"
            >
              Donner pour de vrai via {selected.partnerLabel}
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}

          <div>
            <p className="text-white/80 text-sm font-medium mb-3">Montant (simulation)</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {AMOUNT_PRESETS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => {
                    setAmount(a);
                    setCustomAmount("");
                  }}
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                    customAmount === "" && amount === a
                      ? "bg-amber-500/30 text-amber-200 border-2 border-amber-400/50"
                      : "bg-white/10 text-white/80 border border-white/20 hover:bg-white/15"
                  }`}
                >
                  {a} €
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="custom-amount" className="text-white/70 text-sm shrink-0">
                Autre
              </label>
              <input
                id="custom-amount"
                type="text"
                inputMode="decimal"
                placeholder="0"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="rounded-lg bg-white/10 border border-white/20 px-4 py-2.5 text-white placeholder-white/40 w-24 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              />
              <span className="text-white/60 text-sm">€</span>
            </div>
          </div>

          <p className="text-white/50 text-xs">
            Paiement simulé — aucun prélèvement. Les projets sont tracés et mis en ligne avec des sponsors authentiques ; les vrais dons arriveront quand les partenariats seront en place.
          </p>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-xl bg-white/10 border border-white/20 py-3 px-4 text-white/80 text-sm font-medium hover:bg-white/15"
            >
              Retour
            </button>
            <button
              type="button"
              onClick={handleDonate}
              disabled={loading || !isValidAmount}
              className="flex-1 rounded-xl bg-amber-500/30 border border-amber-400/50 py-3 text-amber-200 font-semibold text-sm hover:bg-amber-500/40 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block h-4 w-4 rounded-full border-2 border-amber-200/60 border-t-amber-200 animate-spin" />
                  Simulation…
                </>
              ) : (
                <>Faire le don · {effectiveAmount} €</>
              )}
            </button>
          </div>
        </div>
      )}

      {(!selected || !done) && (
        <button
          type="button"
          onClick={() => router.push("/home")}
          className="mt-8 rounded-xl border border-white/20 py-3 text-white/70 text-sm font-medium hover:bg-white/10 w-full"
        >
          Retour à l&apos;accueil
        </button>
      )}
    </div>
  );
}
