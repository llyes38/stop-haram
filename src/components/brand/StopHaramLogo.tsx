"use client";

import Image from "next/image";

export type StopHaramLogoVariant = "dark" | "light";

type StopHaramLogoProps = {
  size?: number;
  variant?: StopHaramLogoVariant;
  className?: string;
};

/** Logo StopHaram (Stop + HARAM) — distinct du favicon (icône) */
export default function StopHaramLogo({
  size = 180,
  variant = "dark",
  className = "",
}: StopHaramLogoProps) {
  const height = Math.round((size * 44) / 200);
  return (
    <Image
      src="/brand/stopharam-logo.png"
      alt="StopHaram"
      width={size}
      height={height}
      className={className}
      priority
      aria-label="StopHaram"
      style={{ width: size, height: "auto", objectFit: "contain" }}
    />
  );
}
