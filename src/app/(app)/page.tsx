"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/home");
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e]">
      <p className="text-white/70 text-sm">Redirection…</p>
    </div>
  );
}
