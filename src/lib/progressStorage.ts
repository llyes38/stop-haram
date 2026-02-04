"use client";

import { supabase } from "@/lib/supabase/client";
import { getState, setState, getProfile, setProfile } from "@/lib/authState";

const GUEST_PROGRESS_KEY = "stopharam_progress_guest";

export type QuizResultData = {
  answers: Record<string, string | string[]>;
  analysis?: Record<string, unknown>;
  sin_categories?: string[];
};

/** Utilisateur complet (storage) pour restauration après reconnexion */
export type StorageUserProgress = Record<string, unknown>;

export type ProgressData = {
  state?: Record<string, unknown>;
  profile?: Record<string, unknown>;
  quiz_result?: QuizResultData;
  /** Utilisateur complet (nom, plan, etc.) — synchro multi-appareils */
  storage_user?: StorageUserProgress;
  [key: string]: unknown;
};

/**
 * Charge la progression : Supabase si connecté, sinon localStorage invité.
 */
export async function loadProgress(userId: string | null): Promise<ProgressData> {
  if (userId) {
    const { data, error } = await supabase
      .from("user_progress")
      .select("data")
      .eq("user_id", userId)
      .single();
    if (!error && data?.data) return (data.data as ProgressData) ?? {};
    return {};
  }
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(GUEST_PROGRESS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ProgressData;
  } catch {
    return {};
  }
}

/**
 * Sauvegarde la progression : Supabase si connecté, sinon localStorage invité.
 */
export async function saveProgress(
  partialData: Partial<ProgressData>,
  userId: string | null
): Promise<{ ok: boolean; error?: string }> {
  const existing = await loadProgress(userId);
  const merged: ProgressData = { ...existing, ...partialData };

  if (userId) {
    const { error } = await supabase
      .from("user_progress")
      .upsert(
        { user_id: userId, data: merged, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(merged));
  }
  return { ok: true };
}

/**
 * Vide la progression invité (localStorage).
 */
export function clearGuestProgress(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(GUEST_PROGRESS_KEY);
}

/**
 * Retourne true si l'invité a des données de progression.
 */
export function hasGuestProgress(): boolean {
  if (typeof window === "undefined") return false;
  const raw = window.localStorage.getItem(GUEST_PROGRESS_KEY);
  if (!raw) return false;
  try {
    const data = JSON.parse(raw) as ProgressData;
    return Object.keys(data).length > 0;
  } catch {
    return false;
  }
}

/**
 * Récupère la progression invité brute (pour fusion au login).
 */
export function getGuestProgressRaw(): ProgressData | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(GUEST_PROGRESS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ProgressData;
  } catch {
    return null;
  }
}

/**
 * Supprime toutes les données Supabase de l'utilisateur (user_progress, notification_prefs, notification_queue).
 * À appeler avant déconnexion quand l'utilisateur choisit "Supprimer mes données" pour que la reconnexion reparte de zéro.
 */
export async function deleteAllUserDataFromSupabase(userId: string): Promise<void> {
  await supabase.from("user_progress").delete().eq("user_id", userId);
  await supabase.from("notification_prefs").delete().eq("user_id", userId);
  await supabase.from("notification_queue").delete().eq("user_id", userId);
}

/**
 * Persiste l'état local actuel (state + profile) dans la couche progress.
 * À appeler après modifications state/profile pour garder guest et Supabase en sync.
 */
export function persistLocalStateToProgress(userId: string | null): void {
  const state = getState();
  const profile = getProfile();
  const partial: Partial<ProgressData> = {};
  if (state) partial.state = state as unknown as Record<string, unknown>;
  if (profile) partial.profile = profile as unknown as Record<string, unknown>;
  if (Object.keys(partial).length > 0) {
    saveProgress(partial, userId);
  }
}
