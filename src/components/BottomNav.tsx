"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { incrementTempted } from "@/lib/temptationStats";

const TABS = [
  { href: "/home", label: "Accueil", icon: "home" },
  { href: "/parcours", label: "Parcours", icon: "play" },
  { craquer: true as const },
  { href: "/progress", label: "Progrès", icon: "chart" },
  { href: "/account", label: "Compte", icon: "user" },
] as const;

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function PlayIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ChartIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function TabIcon({ icon, active }: { icon: string; active: boolean }) {
  switch (icon) {
    case "home": return <HomeIcon active={active} />;
    case "play": return <PlayIcon active={active} />;
    case "chart": return <ChartIcon active={active} />;
    case "user": return <UserIcon active={active} />;
    default: return <HomeIcon active={active} />;
  }
}

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleCraquer = () => {
    incrementTempted();
    router.push("/urgence");
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 max-w-[420px] mx-auto bg-[#0a0f1a]/90 border-t border-white/10 backdrop-blur-sm safe-area-pb"
      aria-label="Navigation principale"
    >
      <div className="flex items-center justify-around h-16 px-2 gap-1">
        {TABS.map((tab, i) => {
          if ("craquer" in tab && tab.craquer) {
            return (
              <button
                key="craquer"
                type="button"
                onClick={handleCraquer}
                className="flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-2 rounded-xl bg-red-900/50 border-2 border-red-500/60 text-white hover:bg-red-900/60 hover:border-red-500/70 transition-all focus:outline-none focus:ring-2 focus:ring-red-500/50"
                aria-label="Je vais craquer"
              >
                <span className="text-xl leading-none">
                  <span className="stress-emoji">😰</span>
                </span>
              </button>
            );
          }
          const { href, label, icon } = tab as { href: string; label: string; icon: string };
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-2 rounded-lg transition-colors ${
                active ? "text-white" : "text-white/50 hover:text-white/80"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <TabIcon icon={icon} active={active} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
