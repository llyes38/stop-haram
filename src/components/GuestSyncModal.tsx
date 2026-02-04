"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStatus } from "@/components/auth/AuthProvider";
import {
  hasGuestProgress,
  getGuestProgressRaw,
  loadProgress,
  saveProgress,
  clearGuestProgress,
  type ProgressData,
} from "@/lib/progressStorage";
import { setState, setProfile, type StopharamState, type StopharamProfile } from "@/lib/authState";

const MODAL_DISMISSED_KEY = "stopharam_guest_sync_modal_dismissed";

/**
 * Modal affichée quand l'utilisateur se connecte (Google ou Magic link)
 * et qu'il a des données invité : "Tu veux sauvegarder tes progrès sur ton compte ?"
 * - Oui sauvegarder => push vers Supabase, supprimer guest
 * - Non => ne pas écraser Supabase (par défaut), marquer modal comme vue
 */
export default function GuestSyncModal() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStatus();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !isAuthenticated || !user?.id) return;
    if (dismissed) return;
    const alreadyDismissed = window.sessionStorage.getItem(MODAL_DISMISSED_KEY);
    if (alreadyDismissed) return;
    if (!hasGuestProgress()) return;

    setOpen(true);
  }, [isAuthenticated, user?.id, dismissed]);

  const handleYes = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const guest = getGuestProgressRaw();
      if (guest) {
        const existing = await loadProgress(user.id);
        const merged: ProgressData = { ...guest, ...existing };
        await saveProgress(merged, user.id);
        if (guest.state && typeof guest.state === "object") {
          const state = guest.state as StopharamState;
          setState({ ...state, onboardingComplete: true });
        } else {
          setState({ onboardingComplete: true });
        }
        if (guest.profile && typeof guest.profile === "object") {
          setProfile(guest.profile as StopharamProfile);
        }
      }
      clearGuestProgress();
      window.sessionStorage.setItem(MODAL_DISMISSED_KEY, "1");
      setOpen(false);
      router.replace("/home");
    } finally {
      setLoading(false);
    }
  };

  const handleNo = () => {
    window.sessionStorage.setItem(MODAL_DISMISSED_KEY, "1");
    setOpen(false);
    setDismissed(true);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-[380px] rounded-2xl bg-[#0d2818] p-6 shadow-xl border border-white/10">
        <h3 className="text-lg font-semibold text-white">
          Sauvegarder tes progrès ?
        </h3>
        <p className="mt-2 text-sm text-white/80">
          Tu as des progrès en mode invité. Tu veux les sauvegarder sur ton compte ?
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handleYes}
            disabled={loading}
            className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
          >
            {loading ? "Enregistrement…" : "Oui, sauvegarder"}
          </button>
          <button
            type="button"
            onClick={handleNo}
            className="flex-1 rounded-xl border border-white/30 bg-white/10 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
          >
            Non
          </button>
        </div>
      </div>
    </div>
  );
}
