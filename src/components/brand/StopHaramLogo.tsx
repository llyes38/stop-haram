"use client";

const STOP_DARK = "#F2F5F3";
const STOP_LIGHT = "#0B1C2D";
const HARAM = "#0F3D2E";
const ACCENT = "#C9A24D";

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
  const stopFill = variant === "dark" ? STOP_DARK : STOP_LIGHT;
  const height = (size * 44) / 200;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 44"
      fill="none"
      width={size}
      height={height}
      className={className}
      aria-label="StopHaram"
      role="img"
    >
      <text
        x="0"
        y="30"
        fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        fontWeight="700"
        fontSize="26"
        fill={stopFill}
      >
        Stop
      </text>
      <text
        x="56"
        y="30"
        fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        fontWeight="700"
        fontSize="26"
        fill={HARAM}
      >
        Haram
      </text>
      <g fill={ACCENT}>
        <path
          fillRule="evenodd"
          d="M70 10a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm2.5 0a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4z"
        />
        <circle cx="76" cy="8" r="1.2" />
      </g>
    </svg>
  );
}
