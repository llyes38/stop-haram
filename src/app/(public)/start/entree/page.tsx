"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StartEntreeRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/start");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a1f12]">
      <p className="text-white/70 text-sm">Redirection…</p>
    </main>
  );
}
