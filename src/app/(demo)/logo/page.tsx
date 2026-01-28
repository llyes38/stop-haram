"use client";

import StopHaramLogo from "@/components/brand/StopHaramLogo";

export default function LogoDemoPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e] text-white px-6 py-12 max-w-[420px] mx-auto">
      <h1 className="text-lg font-semibold text-emerald-200/90 mb-2">Logo StopHaram — Cas 1 (texte)</h1>
      <p className="text-white/60 text-sm mb-10">Variant dark, fond dégradé sombre.</p>

      <div className="flex flex-col items-center gap-12 mb-12">
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/50 text-xs">140px</span>
          <StopHaramLogo size={140} variant="dark" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/50 text-xs">180px (défaut)</span>
          <StopHaramLogo size={180} variant="dark" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/50 text-xs">240px</span>
          <StopHaramLogo size={240} variant="dark" />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-8 flex flex-col items-center gap-4">
        <p className="text-slate-700 text-sm font-medium">Variant light sur fond blanc</p>
        <StopHaramLogo size={180} variant="light" />
      </div>
    </div>
  );
}
