"use client";

import { useState, useEffect } from "react";
import { useAuthStatus } from "@/components/auth/AuthProvider";

const STORAGE_KEY_USER = "stopharam_install_prompt_seen";
const STORAGE_KEY_GUEST = "stopharam_install_prompt_seen_guest";

function getDevice(): "iphone" | "android" | null {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "iphone";
  if (/Android/i.test(ua)) return "android";
  return null;
}

function getStorageKey(isGuest: boolean): string {
  return isGuest ? STORAGE_KEY_GUEST : STORAGE_KEY_USER;
}

export default function InstallPrompt() {
  const { isGuest, loading: authLoading } = useAuthStatus();
  const [visible, setVisible] = useState(false);
  const [device, setDevice] = useState<"iphone" | "android" | null>(null);

  const storageKey = getStorageKey(isGuest);

  useEffect(() => {
    if (authLoading || typeof window === "undefined") return;
    try {
      const seen = window.localStorage.getItem(storageKey);
      if (seen === "true") return;
      const d = getDevice();
      setDevice(d);
      setVisible(true);
    } catch {
      // Ignore localStorage errors
    }
  }, [storageKey, authLoading]);

  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        try {
          window.localStorage?.setItem(storageKey, "true");
        } catch { /* ignore */ }
        setVisible(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible, storageKey]);

  const handleDismiss = () => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, "true");
      }
    } catch {
      // Ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-6 pt-16"
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-prompt-title"
      aria-describedby="install-prompt-desc"
    >
      {/* Overlay cliquable pour fermer */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleDismiss}
        onKeyDown={(e) => e.key === "Escape" && handleDismiss()}
        aria-hidden
      />

      <div
        className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/20 bg-[#0a1f12] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-h-[70vh] overflow-y-auto overscroll-contain px-5 py-5">
          <h2
            id="install-prompt-title"
            className="text-lg font-bold text-white"
          >
            📲 Installer StopHaram
          </h2>
          <p
            id="install-prompt-desc"
            className="mt-2 text-sm leading-relaxed text-white/90"
          >
            StopHaram fonctionne comme une vraie application.
            Ajoute-la à ton écran d&apos;accueil pour y accéder rapidement,
            sans passer par le navigateur.
          </p>

          {device === "iphone" && (
            <div className="mt-4 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
              <p className="text-sm font-semibold text-white">Sur iPhone :</p>
              <ol className="mt-2 list-decimal list-inside space-y-1.5 text-sm text-white/90">
                <li>Ouvre cette page avec Safari</li>
                <li>Appuie sur le bouton Partager</li>
                <li>Sélectionne « Ajouter à l&apos;écran d&apos;accueil »</li>
              </ol>
            </div>
          )}

          {device === "android" && (
            <div className="mt-4 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
              <p className="text-sm font-semibold text-white">Sur Android :</p>
              <p className="mt-2 text-sm leading-relaxed text-white/90">
                Appuie sur « Installer l&apos;application » quand Chrome le propose
                ou ouvre le menu ⋮ puis « Installer l&apos;application »
              </p>
            </div>
          )}

          {device === null && (
            <div className="mt-4 space-y-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-white">Sur iPhone :</p>
                <ol className="mt-1.5 list-decimal list-inside space-y-1 text-sm text-white/90">
                  <li>Ouvre cette page avec Safari</li>
                  <li>Appuie sur le bouton Partager</li>
                  <li>Sélectionne « Ajouter à l&apos;écran d&apos;accueil »</li>
                </ol>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Sur Android :</p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/90">
                  Appuie sur « Installer l&apos;application » quand Chrome le propose
                  ou ouvre le menu ⋮ puis « Installer l&apos;application »
                </p>
              </div>
            </div>
          )}

          {/* Vidéo démo installation */}
          <div className="mt-4 rounded-xl overflow-hidden border border-white/10 bg-black/30">
            <p className="px-4 py-2 text-sm font-semibold text-white bg-white/5">
              Voir la démo
            </p>
            <video
              src="/vid%C3%A9o/story%20installation%20app.mp4"
              controls
              playsInline
              className="w-full aspect-video"
              aria-label="Vidéo expliquant comment installer l'application"
            >
              Ton navigateur ne prend pas en charge la lecture vidéo.
            </video>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 px-5 py-4">
          <button
            type="button"
            onClick={handleDismiss}
            className="w-full rounded-xl bg-emerald-500/30 border border-emerald-400/50 py-3.5 text-base font-semibold text-emerald-200 transition-colors hover:bg-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
          >
            J&apos;ai compris
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="w-full rounded-xl border border-white/20 bg-white/5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            Comment installer
          </button>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Fermer"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
