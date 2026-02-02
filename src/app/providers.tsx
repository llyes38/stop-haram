"use client";

import { AuthProvider } from "@/components/auth/AuthProvider";
import GuestSyncModal from "@/components/GuestSyncModal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <GuestSyncModal />
    </AuthProvider>
  );
}
