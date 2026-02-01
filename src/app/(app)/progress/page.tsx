"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProgressRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/parcours?tab=progres");
  }, [router]);

  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <p className="text-white/60 text-sm">Redirection…</p>
    </div>
  );
}
