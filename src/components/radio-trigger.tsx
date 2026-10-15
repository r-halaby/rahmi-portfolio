"use client";

import { useState } from "react";
import { RadioPlayer, type RadioEpisode } from "./radio-player";

export function RadioTrigger({ episodes }: { episodes: RadioEpisode[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open radio player"
        data-radio-tab
        className="fixed right-8 top-0 z-50 flex items-center justify-center rounded-b-lg bg-black px-3 py-2 hover:opacity-80"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/look-and-feel-icon.png"
          alt="Look & Feel Radio"
          width={22}
          height={22}
          className="block"
        />
      </button>
      <RadioPlayer open={open} onClose={() => setOpen(false)} episodes={episodes} />
    </>
  );
}
