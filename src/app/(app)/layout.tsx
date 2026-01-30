"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import PrayerTimeReminder from "@/components/PrayerTimeReminder";
import { isLoggedIn } from "@/lib/authState";
import { hasDecouverteSeen } from "@/lib/decouverteStorage";

const LAST_RECHUTE_KEY = "last_rechute_check";

function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function hasRechuteCheckedToday(): boolean {
  if (typeof window === "undefined") return false;
  const raw = window.localStorage.getItem(LAST_RECHUTE_KEY);
  if (!raw) return false;
  return raw === getTodayISO();
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/start");
      return;
    }
    if (!hasRechuteCheckedToday()) {
      router.replace("/rechute");
      return;
    }
    if (!hasDecouverteSeen()) {
      router.replace("/decouverte");
      return;
    }
    setReady(true);
  }, [router, pathname]);

  if (!ready) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e]">
        <p className="text-white/70 text-sm">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e]">
      <PrayerTimeReminder />
      <main className="flex-1 min-h-0 w-full max-w-[420px] mx-auto pb-20 overflow-y-auto overflow-x-hidden">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
