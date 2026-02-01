"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getTotalPoints } from "@/lib/pointsGratitude";

export default function PointsBadge() {
  const pathname = usePathname();
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const refresh = () => setPoints(getTotalPoints());
    refresh();
    window.addEventListener("stopharam-points-updated", refresh);
    return () => window.removeEventListener("stopharam-points-updated", refresh);
  }, [pathname]);

  return (
    <Link
      href="/parcours?tab=progres"
      className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/25 border border-amber-400/50 px-3 py-1.5 shadow-lg hover:bg-amber-500/35 transition-colors w-fit"
      aria-label={`${points} points de gratitude — voir détails`}
      title="Points de gratitude — clique pour voir"
    >
      <span className="text-amber-200 text-sm" aria-hidden>
        ★
      </span>
      <span className="text-amber-100 font-bold text-sm tabular-nums">{points}</span>
      <span className="text-amber-200/80 text-xs">pts</span>
    </Link>
  );
}
