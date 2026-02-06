"use client";

import { useRouter } from "next/navigation";

type Props = {
  title: string;
  description?: string;
};

/** Carte affichée si non abonné pour une fonctionnalité réservée aux abonnés. CTA = S'abonner (MVP). */
export default function LockedFeatureCard({ title, description }: Props) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/start")}
      className="w-full rounded-2xl border-2 border-white/20 bg-white/5 px-5 py-5 text-left transition-colors hover:bg-white/10 hover:border-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
    >
      <div className="flex items-start gap-4">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-400/40 text-2xl"
          aria-hidden
        >
          🔒
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-white/90 font-semibold text-base">{title}</p>
          {description && (
            <p className="text-white/60 text-sm mt-0.5">{description}</p>
          )}
          <p className="text-amber-200/90 text-sm font-medium mt-2">
            S&apos;abonner pour débloquer
          </p>
        </div>
        <span className="text-white/40 shrink-0" aria-hidden>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </button>
  );
}
