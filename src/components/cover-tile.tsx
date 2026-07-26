"use client";

import { useState } from "react";

type Props = {
  imageUrl: string | null;
  label: string;
  href?: string | null;
  aspect?: "square" | "portrait" | "video";
};

const ASPECT_STYLES: Record<NonNullable<Props["aspect"]>, string> = {
  square: "1 / 1",
  portrait: "2 / 3",
  video: "16 / 9",
};

export function CoverTile({ imageUrl, label, href, aspect = "square" }: Props) {
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const inner = (
    <div
      style={{ aspectRatio: ASPECT_STYLES[aspect] }}
      className="block w-full overflow-hidden bg-ink/5"
    >
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          className="block h-full w-full object-cover"
          loading="lazy"
        />
      )}
    </div>
  );

  const body = href ? (
    <a href={href} target="_blank" rel="noreferrer" className="block">
      {inner}
    </a>
  ) : (
    inner
  );

  return (
    <>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
      >
        {body}
      </div>
      {hover && (
        <span
          className="pointer-events-none fixed z-50 whitespace-nowrap bg-ink px-2 py-1 text-xs text-paper"
          style={{ top: pos.y + 16, left: pos.x + 16 }}
        >
          {label}
        </span>
      )}
    </>
  );
}
