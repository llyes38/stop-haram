"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Mode sans compte : redirection vers start. */
export default function AuthConfirmPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/start");
  }, [router]);
  return null;
}
