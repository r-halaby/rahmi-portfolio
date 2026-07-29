"use client";

import { useLayoutEffect, useRef, useState } from "react";

export function ExpandableDescription({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const [truncatable, setTruncatable] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const prev = {
        display: el.style.display,
        webkitLineClamp: el.style.webkitLineClamp,
        webkitBoxOrient: el.style.webkitBoxOrient,
        overflow: el.style.overflow,
      };
      el.style.display = "-webkit-box";
      el.style.webkitLineClamp = "3";
      el.style.webkitBoxOrient = "vertical";
      el.style.overflow = "hidden";
      const overflowing = el.scrollHeight > el.clientHeight + 1;
      el.style.display = prev.display;
      el.style.webkitLineClamp = prev.webkitLineClamp;
      el.style.webkitBoxOrient = prev.webkitBoxOrient;
      el.style.overflow = prev.overflow;
      setTruncatable(overflowing);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [text]);

  const clamped = truncatable && !expanded;

  return (
    <div>
      <p
        ref={ref}
        className={`text-sm leading-relaxed text-ink ${clamped ? "line-clamp-3" : ""}`}
      >
        {text}
      </p>
      {truncatable && (
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
