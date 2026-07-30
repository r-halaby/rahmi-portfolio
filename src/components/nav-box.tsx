"use client";

import Link from "next/link";
import { useState } from "react";
import { useT } from "@/components/site-preferences-provider";

type Props = {
  href: string;
  label: string;
  labelKey?: string;
  imageUrl?: string | null;
};

export function NavBox({ href, label, labelKey, imageUrl }: Props) {
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const tr = useT();
  const displayLabel = labelKey ? tr(labelKey) : label;

  return (
    <>
      <Link
        href={href}
        aria-label={displayLabel}
        className={`relative block aspect-square overflow-hidden ${imageUrl ? "" : "bg-warm"}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
      >
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            className="block h-full w-full object-cover"
            loading="eager"
          />
        )}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 hidden bg-ink/70 px-2 py-1 text-center text-[10px] uppercase tracking-wide text-paper [@media(hover:none)]:block">
          {displayLabel}
        </span>
      </Link>
      {hover && (
        <span
          className="pointer-events-none fixed z-50 whitespace-nowrap bg-ink px-2 py-1 text-xs text-paper"
          style={{ top: pos.y + 16, left: pos.x + 16 }}
        >
          {displayLabel}
        </span>
      )}
    </>
  );
}
