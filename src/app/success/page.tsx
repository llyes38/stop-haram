"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StopHaramLogo from "@/components/brand/StopHaramLogo";

const PENDING_SESSION_KEY = "stopharam_pendingStripeSessionId";

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
    fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then((data) => {
        const subscriptionOk = data.subscriptionStatus === "active" || data.subscriptionStatus === "trialing" || data.paid === true;
        if (subscriptionOk) {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(PENDING_SESSION_KEY, sessionId);
          }
          router.replace(`/create-account?session_id=${encodeURIComponent(sessionId)}`);
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
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a1f12] to-[#0a1c2e] text-white px-6">
      <StopHaramLogo size={120} variant="dark" className="block mb-6" />
      <p className="text-white/70 text-sm">Paiement confirmé. Redirection vers la création de compte…</p>
    </main>
  );
}
