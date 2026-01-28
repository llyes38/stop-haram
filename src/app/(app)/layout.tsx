"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

const STORAGE_KEYS = {
  is_logged_in: "is_logged_in",
  last_rechute_check: "last_rechute_check",
} as const;

function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function hasRechuteCheckedToday(): boolean {
  if (typeof window === "undefined") return false;
  const raw = window.localStorage.getItem(STORAGE_KEYS.last_rechute_check);
  if (!raw) return false;
  return raw === getTodayISO();
}

function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEYS.is_logged_in) === "true";
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }
    if (!hasRechuteCheckedToday()) {
      router.replace("/rechute");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e]">
        <p className="text-white/70 text-sm">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e]">
      <main className="flex-1 w-full max-w-[420px] mx-auto pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
