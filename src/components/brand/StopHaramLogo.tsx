"use client";

import Image from "next/image";

export type StopHaramLogoVariant = "dark" | "light";

type StopHaramLogoProps = {
  size?: number;
  variant?: StopHaramLogoVariant;
  className?: string;
};

export default function StopHaramLogo({
  size = 180,
  variant = "dark",
  className = "",
}: StopHaramLogoProps) {
  return (
    <Image
      src="/brand/stopharam-logo.png"
      alt="StopHaram"
      width={size}
      height={Math.round((size * 44) / 200)}
      className={className}
      priority
      aria-label="StopHaram"
      style={{ width: size, height: "auto", objectFit: "contain" }}
    />
  );
}
