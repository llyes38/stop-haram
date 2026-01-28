import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import AppGuard from "@/components/AppGuard";

export const metadata: Metadata = {
  title: "StopHaram",
  description: "Un accompagnement discret et bienveillant",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased">
        <AppGuard>{children}</AppGuard>
      </body>
    </html>
  );
}
