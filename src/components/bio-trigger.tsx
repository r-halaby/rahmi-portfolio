"use client";

import { useState } from "react";
import type { PortableTextBlock } from "@portabletext/react";
import {
  BioOverlay,
  type BioClient,
  type BioEducation,
  type BioExperience,
} from "./bio-overlay";

type Props = {
  photoUrl: string | null;
  photoCaption: string | null;
  body: PortableTextBlock[] | null;
  education: BioEducation[];
  clients: BioClient[];
  experience: BioExperience[];
};

export function BioTrigger({
  photoUrl,
  photoCaption,
  body,
  education,
  clients,
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
        education={education}
        clients={clients}
        experience={experience}
      />
    </>
  );
}
