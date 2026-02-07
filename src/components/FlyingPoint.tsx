"use client";

import { useEffect, useState, useRef } from "react";

type FlyingItem = { id: number; fromX: number; fromY: number };

const DURATION_MS = 700;

export default function FlyingPoint({ targetRef }: { targetRef: React.RefObject<HTMLDivElement | null> }) {
  const [items, setItems] = useState<FlyingItem[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent<{ fromX: number; fromY: number }>;
      const { fromX, fromY } = ev.detail ?? {};
      if (typeof fromX !== "number" || typeof fromY !== "number") return;
      const id = ++idRef.current;
      setItems((prev) => [...prev, { id, fromX, fromY }]);
      setTimeout(() => {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }, DURATION_MS);
    };
    window.addEventListener("stopharam-fly-point", handler);
    return () => window.removeEventListener("stopharam-fly-point", handler);
  }, []);

  if (items.length === 0) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fly-to-badge {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) translate(0, 0) scale(1);
          }
          60% {
            opacity: 1;
            transform: translate(-50%, -50%) translate(var(--fly-tx, 0), var(--fly-ty, 0)) scale(0.8);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translate(var(--fly-tx, 0), var(--fly-ty, 0)) scale(0.5);
          }
        }
        .flying-pt {
          animation: fly-to-badge ${DURATION_MS}ms cubic-bezier(0.2, 0.8, 0.4, 1) forwards;
          pointer-events: none;
        }
      `}} />
      {items.map((item) => (
        <FlyingPointItem
          key={item.id}
          fromX={item.fromX}
          fromY={item.fromY}
          targetRef={targetRef}
        />
      ))}
    </>
  );
}

function FlyingPointItem({
  fromX,
  fromY,
  targetRef,
}: {
  fromX: number;
  fromY: number;
  targetRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [target, setTarget] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) {
      setTarget({ x: fromX - 80, y: fromY - 60 });
      return;
    }
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setTarget({ x: centerX - fromX, y: centerY - fromY });
  }, [fromX, fromY, targetRef]);

  if (target === null) return null;

  return (
    <div
      className="flying-pt fixed z-[100] flex items-center justify-center rounded-full bg-amber-400/95 px-2 py-1 shadow-lg border border-amber-300/80 text-amber-900 font-bold text-sm whitespace-nowrap"
      style={{
        left: fromX,
        top: fromY,
        ["--fly-tx" as string]: `${target.x}px`,
        ["--fly-ty" as string]: `${target.y}px`,
      }}
      aria-hidden
    >
      +1 pt
    </div>
  );
}
