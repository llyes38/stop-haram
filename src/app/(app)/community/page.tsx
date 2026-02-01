"use client";

import { useState, useEffect } from "react";
import {
  APP_URL,
  WHATSAPP_COMMUNITY_URL,
  hasJoinedWeekChallenge,
  setWeekChallengeJoined,
} from "@/lib/community";
import { canShare, copyToClipboard, shareWithNative } from "@/lib/share";
import { updateLastRoute } from "@/lib/authState";

const INVITE_SHARE = {
  title: "StopHaram - Communauté",
  text: `Rejoins la communauté StopHaram (WhatsApp) : on se motive, on fait les défis ensemble.
➡️ Lien : ${WHATSAPP_COMMUNITY_URL}
Et l'app : ${APP_URL}`,
  url: WHATSAPP_COMMUNITY_URL,
};

const CHALLENGE_SHARE = {
  title: "Défi StopHaram",
  text: `🔥 Défi StopHaram de la semaine : 7 jours de constance.
Tu viens avec moi ?
➡️ Rejoins la communauté WhatsApp : ${WHATSAPP_COMMUNITY_URL}`,
  url: WHATSAPP_COMMUNITY_URL,
};

export default function CommunityPage() {
  const [joined, setJoined] = useState(false);
  const [toast, setToast] = useState(false);
  const [hasShare, setHasShare] = useState(false);

  useEffect(() => {
    updateLastRoute("/community");
    setJoined(hasJoinedWeekChallenge());
    setHasShare(canShare());
  }, []);

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  const handleJoinWhatsApp = () => {
    window.open(WHATSAPP_COMMUNITY_URL, "_blank");
  };

  const handleShareInvite = async () => {
    if (hasShare) {
      await shareWithNative(INVITE_SHARE);
      return;
    }
    const ok = await copyToClipboard(`${INVITE_SHARE.text}\n\n${INVITE_SHARE.url}`);
    if (ok) showToast();
  };

  const handleJoinChallenge = () => {
    setWeekChallengeJoined();
    setJoined(true);
  };

  const handleShareChallenge = async () => {
    if (hasShare) {
      await shareWithNative(CHALLENGE_SHARE);
      return;
    }
    const ok = await copyToClipboard(`${CHALLENGE_SHARE.text}\n\n${CHALLENGE_SHARE.url}`);
    if (ok) showToast();
  };

  return (
    <div className="w-full flex flex-col px-6 pt-8 pb-8 text-white max-w-[420px] mx-auto">
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-white">Communauté</h1>
        <p className="text-white/60 text-sm mt-1">
          Avance avec d&apos;autres Stopprs. Chaque semaine, un défi simple. Ensemble, c&apos;est plus facile.
        </p>
      </header>

      <section className="flex flex-col gap-6">
        {/* Défi de la semaine */}
        <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-5">
          <h2 className="text-white font-semibold text-base mb-2">🔥 Défi de la semaine</h2>
          <p className="text-white/85 text-sm leading-relaxed mb-4">
            Thème : constance.
            <br />
            Objectif : 7 jours sans abandon. Un petit pas chaque jour.
          </p>
          <div className="flex flex-col gap-2">
            {joined ? (
              <p className="rounded-xl bg-emerald-500/20 border border-emerald-400/40 py-3 px-4 text-emerald-200 text-sm font-medium text-center">
                Tu participes ✅
              </p>
            ) : (
              <button
                type="button"
                onClick={handleJoinChallenge}
                className="w-full rounded-xl bg-amber-500/30 border border-amber-400/50 py-3 text-amber-100 font-semibold text-sm hover:bg-amber-500/40 transition-colors"
              >
                Je participe
              </button>
            )}
            <button
              type="button"
              onClick={handleShareChallenge}
              className="w-full rounded-xl border border-white/20 bg-white/5 py-2.5 text-white/80 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Partager le défi
            </button>
          </div>
        </div>

        {/* WhatsApp Community */}
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-400/25 px-5 py-5">
          <h2 className="text-emerald-200 font-semibold text-base mb-2">💬 WhatsApp Community</h2>
          <p className="text-white/85 text-sm leading-relaxed mb-4">
            Rejoins la communauté pour participer aux défis, te motiver et partager tes progrès.
          </p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleJoinWhatsApp}
              className="w-full rounded-xl bg-emerald-500/40 border border-emerald-400/60 py-3.5 text-emerald-100 font-semibold text-sm hover:bg-emerald-500/50 transition-colors"
            >
              Rejoindre sur WhatsApp
            </button>
            <button
              type="button"
              onClick={handleShareInvite}
              className="w-full rounded-xl border border-white/20 bg-white/5 py-2.5 text-white/80 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              {hasShare ? "Partager l'invitation" : "Copier le message"}
            </button>
          </div>
        </div>
      </section>

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 rounded-full bg-emerald-500/90 text-white text-sm font-medium px-4 py-2 shadow-lg">
          Copié ✅
        </div>
      )}
    </div>
  );
}
