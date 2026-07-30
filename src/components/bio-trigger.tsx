"use client";

import { useState } from "react";
import type { PortableTextBlock } from "@portabletext/react";
import { BioOverlay, type BioExperience } from "./bio-overlay";

type Props = {
  photoUrl: string | null;
  photoCaption: string | null;
  body: PortableTextBlock[] | null;
  experience: BioExperience[];
};

export function BioTrigger({
  photoUrl,
  photoCaption,
  body,
  experience,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm tracking-wide hover:opacity-70"
      >
        -BIO
      </button>
      <BioOverlay
        open={open}
        onClose={() => setOpen(false)}
        photoUrl={photoUrl}
        photoCaption={photoCaption}
        body={body}
        experience={experience}
      />
    </>
  );
}
