"use client";

import { useState } from "react";

type Props = {
  url: string;
  imageUrl: string | null;
};

export function ProjectImageTile({ url, imageUrl }: Props) {
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="block"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
      >
        <div
          style={{ aspectRatio: "16 / 9" }}
          className="w-full overflow-hidden bg-ink/5"
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
      </a>
      {hover && (
        <span
          className="pointer-events-none fixed z-50 whitespace-nowrap bg-ink px-2 py-1 text-xs text-paper"
          style={{ top: pos.y + 16, left: pos.x + 16 }}
        >
          Visit Project
        </span>
      )}
    </>
  );
}
