"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStatus } from "@/components/auth/AuthProvider";
import {
  hasGuestProgress,
  getGuestProgressRaw,
  loadProgress,
  saveProgress,
  clearGuestProgress,
  type ProgressData,
} from "@/lib/progressStorage";
import { getUser } from "@/lib/storage";
import { setState, setProfile, type StopharamState, type StopharamProfile } from "@/lib/authState";

const MODAL_DISMISSED_KEY = "stopharam_guest_sync_modal_dismissed";

/**
 * Modal affichée quand l'utilisateur se connecte (Magic Link)
 * et qu'il a des données invité : "Tu veux sauvegarder tes progrès sur ton compte ?"
 * - Oui sauvegarder => push vers Supabase, supprimer guest
 * - Non => ne pas écraser Supabase (par défaut), marquer modal comme vue
 */
export default function GuestSyncModal() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStatus();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !isAuthenticated || !user?.id) return;
    if (dismissed) return;
    if (pathname === "/start" || pathname?.startsWith("/start?")) return;
    const alreadyDismissed = window.sessionStorage.getItem(MODAL_DISMISSED_KEY);
    if (alreadyDismissed) return;
    if (!hasGuestProgress()) return;

    setOpen(true);
  }, [isAuthenticated, user?.id, dismissed, pathname]);

  const handleYes = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const guest = getGuestProgressRaw();
      const localUser = getUser();
      if (guest || localUser) {
        const existing = await loadProgress(user.id);
        const toMerge = { ...guest } as ProgressData;
        if (localUser && Object.keys(localUser).length > 0) {
          toMerge.storage_user = localUser as unknown as Record<string, unknown>;
        }
        const merged: ProgressData = { ...existing, ...toMerge };
        await saveProgress(merged, user.id);
        if (guest?.state && typeof guest.state === "object") {
          const state = guest.state as StopharamState;
          setState({ ...state, onboardingComplete: true });
        } else {
          setState({ onboardingComplete: true });
        }
        if (guest?.profile && typeof guest.profile === "object") {
          setProfile(guest.profile as StopharamProfile);
        } else if (localUser?.name) {
          setProfile({ name: localUser.name });
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
