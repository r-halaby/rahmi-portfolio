"use client";

import { useLayoutEffect, useRef, useState } from "react";

export function ExpandableSection({
  children,
  maxHeight = 160,
}: {
  children: React.ReactNode;
  maxHeight?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      const prevMax = el.style.maxHeight;
      const prevOverflow = el.style.overflow;
      el.style.maxHeight = `${maxHeight}px`;
      el.style.overflow = "hidden";
      const overflowingNow = el.scrollHeight > maxHeight + 1;
      el.style.maxHeight = prevMax;
      el.style.overflow = prevOverflow;
      setOverflowing(overflowingNow);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [children, maxHeight]);

  const clamped = overflowing && !expanded;

  return (
    <div>
      <div
        ref={ref}
        style={
          clamped ? { maxHeight, overflow: "hidden" } : undefined
        }
      >
        {children}
      </div>
      {overflowing && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-xs uppercase tracking-widest text-ink-muted hover:text-ink"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
}
