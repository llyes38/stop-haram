"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Mode sans compte : après paiement on va sur /app. Redirection vers start si accès direct. */
export default function CreateAccountPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/start");
  }, [router]);
  return null;
}
