"use client";

import { useState } from "react";
import { RadioPlayer, type RadioEpisode } from "./radio-player";

export function RadioTrigger({ episodes }: { episodes: RadioEpisode[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm tracking-wide hover:opacity-70"
      >
        -RADIO
      </button>
      <RadioPlayer open={open} onClose={() => setOpen(false)} episodes={episodes} />
    </>
  );
}
