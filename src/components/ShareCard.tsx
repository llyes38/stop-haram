"use client";

import { useState } from "react";
import { canShare, copyToClipboard, shareWithNative, APP_URL } from "@/lib/share";

type ShareCardProps = {
  title: string;
  description: string;
  shareTitle: string;
  shareText: string;
  shareUrl?: string;
  primaryLabel: string;
  secondaryLabel: string;
  /** Optionnel : ligne additionnelle dans le message partagé (ex. point sensible) */
  shareTextExtra?: string;
  /** Pour le fallback : label du bouton "Copier le lien" (si différent) */
  copyLinkLabel?: string;
};

export default function ShareCard({
  title,
  description,
  shareTitle,
  shareText,
  shareUrl = APP_URL,
  primaryLabel,
  secondaryLabel,
  shareTextExtra,
  copyLinkLabel = "Copier le lien",
}: ShareCardProps) {
  const [toast, setToast] = useState(false);
  const hasShare = canShare();

  const fullShareText = shareTextExtra ? `${shareText}\n\n${shareTextExtra}` : shareText;

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  const handlePrimary = async () => {
    if (hasShare) {
      await shareWithNative({
        title: shareTitle,
        text: fullShareText,
        url: shareUrl,
      });
    }
  };

  const handleCopyMessage = async () => {
    const ok = await copyToClipboard(fullShareText);
    if (ok) showToast();
  };

  const handleCopyLink = async () => {
    const ok = await copyToClipboard(shareUrl);
    if (ok) showToast();
  };

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4 max-w-[420px]">
      <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
      <p className="text-white/85 text-sm leading-relaxed mb-4">{description}</p>

      <div className="flex flex-col gap-2">
        {hasShare ? (
          <>
            <button
              type="button"
              onClick={handlePrimary}
              className="w-full rounded-xl bg-emerald-500/30 border border-emerald-400/50 py-3 text-emerald-200 font-semibold text-sm hover:bg-emerald-500/40 transition-colors"
            >
              {primaryLabel}
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyMessage}
                className="flex-1 rounded-xl border border-white/20 bg-white/5 py-2.5 text-white/80 text-sm font-medium hover:bg-white/10 transition-colors"
              >
                {secondaryLabel}
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 rounded-xl border border-white/20 bg-white/5 py-2.5 text-white/80 text-sm font-medium hover:bg-white/10 transition-colors"
              >
                {copyLinkLabel}
              </button>
            </div>
          </>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopyMessage}
              className="flex-1 rounded-xl bg-emerald-500/30 border border-emerald-400/50 py-3 text-emerald-200 font-semibold text-sm hover:bg-emerald-500/40 transition-colors"
            >
              {secondaryLabel}
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex-1 rounded-xl border border-white/20 bg-white/5 py-3 text-white/80 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              {copyLinkLabel}
            </button>
          </div>
        )}
      </div>

      {toast && (
        <div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 rounded-full bg-emerald-500/90 text-white text-sm font-medium px-4 py-2 shadow-lg"
          role="status"
          aria-live="polite"
        >
          Copié ✅
        </div>
      )}
    </div>
  );
}
