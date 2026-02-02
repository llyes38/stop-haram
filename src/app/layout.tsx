import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import AppGuard from "@/components/AppGuard";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "StopHaram",
  description: "Un accompagnement discret et bienveillant",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <AppGuard>{children}</AppGuard>
        </Providers>
      </body>
    </html>
  );
}
