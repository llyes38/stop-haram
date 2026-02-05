"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StopHaramLogo from "@/components/brand/StopHaramLogo";

const PAID_KEY = "stopharam_paid";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"checking" | "ok" | "invalid">("checking");

  useEffect(() => {
    if (!sessionId) {
      setStatus("invalid");
      return;
    }
    fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok === true) {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(PAID_KEY, "true");
          }
          router.replace("/app");
          return;
        }
        setStatus("invalid");
      })
      .catch(() => setStatus("invalid"));
  }, [sessionId, router]);

  useEffect(() => {
    if (status === "invalid") {
      router.replace("/paywall");
    }
  }, [status, router]);

  if (status === "invalid") {
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a1f12] to-[#0a1c2e] text-white px-6 max-w-[420px] mx-auto">
      <StopHaramLogo size={120} variant="dark" className="block mb-6" />
      <p className="text-white/70 text-sm">Paiement confirmé ✅ Redirection…</p>
    </main>
  );
}
