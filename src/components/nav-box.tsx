"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  href: string;
  label: string;
};

export function NavBox({ href, label }: Props) {
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <>
      <Link
        href={href}
        aria-label={label}
        className="block aspect-square bg-warm"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
      />
      {hover && (
        <span
          className="pointer-events-none fixed z-50 whitespace-nowrap text-xs text-ink"
          style={{ top: pos.y + 16, left: pos.x + 16 }}
        >
          {label}
        </span>
      )}
    </>
  );
}
