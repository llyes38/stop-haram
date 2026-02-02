"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCompanionChat } from "@/hooks/useCompanionChat";
import CompanionChatDrawer from "@/components/companion/CompanionChatDrawer";
import { useAuthStatus } from "@/components/auth/AuthProvider";

const GUEST_MODE_KEY = "stopharam_guest_mode";

const TABS = [
  { href: "/home", label: "Accueil", icon: "home" },
  { href: "/parcours", label: "Parcours", icon: "play" },
  { companion: true as const },
  { href: "/community", label: "Communauté", icon: "community" },
  { href: "/account", label: "Compte", icon: "user" },
] as const;

/** Mode essai : seulement Accueil + Compte */
const GUEST_TABS = [
  { href: "/home", label: "Accueil", icon: "home" as const },
  { href: "/account", label: "Compte", icon: "user" as const },
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

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function CommunityIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function TabIcon({ icon, active }: { icon: string; active: boolean }) {
  switch (icon) {
    case "home": return <HomeIcon active={active} />;
    case "play": return <PlayIcon active={active} />;
    case "user": return <UserIcon active={active} />;
    case "community": return <CommunityIcon active={active} />;
    default: return <HomeIcon active={active} />;
  }
}

function CompanionIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const { isGuest: isGuestAuth } = useAuthStatus();
  const [guestModeFlag, setGuestModeFlag] = useState(false);
  const isGuest = isGuestAuth || guestModeFlag;
  const [companionOpen, setCompanionOpen] = useState(false);
  const { messages, loading, error, sendMessage, clearError } = useCompanionChat();
  const tabs = isGuest ? GUEST_TABS : TABS;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setGuestModeFlag(window.localStorage.getItem(GUEST_MODE_KEY) === "true");
    }
  }, []);

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 max-w-[420px] mx-auto bg-[#0a0f1a]/90 border-t border-white/10 backdrop-blur-sm safe-area-pb"
        aria-label="Navigation principale"
      >
        <div className="flex items-center justify-around h-16 px-2 gap-1">
          {tabs.map((tab, i) => {
            if ("companion" in tab && tab.companion && !isGuest) {
              return (
                <button
                  key="companion"
                  type="button"
                  onClick={() => setCompanionOpen(true)}
                  className="companion-glow flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-2 rounded-xl bg-violet-500/40 border-2 border-violet-400/60 text-violet-200 shadow-[0_0_16px_rgba(139,92,246,0.4),0_0_32px_rgba(139,92,246,0.2)] hover:bg-violet-500/50 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-violet-400/50"
                  aria-label="Se confier"
                  title="Confie-toi sur ta journée, tes péchés ou tentations. On pourra améliorer ton plan personnalisé."
                >
                  <CompanionIcon />
                  <span className="text-[10px] font-medium">Se confier</span>
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
    <CompanionChatDrawer
      open={companionOpen}
      onClose={() => setCompanionOpen(false)}
      messages={messages}
      loading={loading}
      error={error}
      onSend={sendMessage}
      onClearError={clearError}
    />
    </>
  );
}
