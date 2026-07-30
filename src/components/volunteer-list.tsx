"use client";

import { useState } from "react";
import type { Image } from "sanity";
import { ExpandableDescription } from "@/components/expandable-description";
import {
  GalleryCarousel,
  type GalleryItem,
} from "@/components/gallery-carousel";
import {
  durationBetween as flexDuration,
  formatMonthYear as flexMonthYear,
} from "@/lib/dates";
import { urlFor } from "@/sanity/image";

export type VolunteerRole = {
  _id: string;
  role: string;
  organization: string;
  logo: Image | null;
  cause: string | null;
  startDate: string;
  endDate: string | null;
  description: string | null;
  gallery: GalleryItem[] | null;
};

const formatMonthYear = flexMonthYear;
const durationBetween = flexDuration;

function logoUrl(image: Image | null | undefined) {
  if (!image?.asset) return null;
  return urlFor(image).width(120).height(120).fit("crop").auto("format").url();
}

export function VolunteerList({ roles }: { roles: VolunteerRole[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [tapped, setTapped] = useState<number | null>(null);

  return (
    <div className="space-y-10">
      {roles.map((r, i) => {
        const isTop = i === 0;
        const active = tapped ?? hovered;
        const expanded = active === null ? isTop : active === i;
        return (
          <VolunteerEntry
            key={r._id}
            entry={r}
            expanded={expanded}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onToggle={() => setTapped((t) => (t === i ? null : i))}
          />
        );
      })}
    </div>
  );
}

function VolunteerEntry({
  entry,
  expanded,
  onMouseEnter,
  onMouseLeave,
  onToggle,
}: {
  entry: VolunteerRole;
  expanded: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onToggle: () => void;
}) {
  const start = formatMonthYear(entry.startDate);
  const end = entry.endDate ? formatMonthYear(entry.endDate) : "Present";
  const duration = durationBetween(entry.startDate, entry.endDate);
  const dateLine = [
    [start, end].filter(Boolean).join(" – "),
    duration,
  ]
    .filter(Boolean)
    .join(" · ");

  const url = logoUrl(entry.logo);

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <button
        type="button"
        onClick={onToggle}
        className="block w-full text-left"
        aria-expanded={expanded}
      >
        <div className="h-16 w-16 shrink-0 overflow-hidden bg-ink/5">
          {url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt=""
              className="block h-full w-full object-cover"
              loading="lazy"
            />
          )}
        </div>
        <div className="mt-3 text-xl leading-tight">{entry.role}</div>
        <div className="mt-1 space-y-1 text-xs uppercase tracking-wide text-ink-muted">
          <div>{entry.organization}</div>
          {dateLine && <div>{dateLine}</div>}
          {entry.cause && <div>{entry.cause}</div>}
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          expanded ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {entry.description && (
          <div className="mt-3">
            <ExpandableDescription text={entry.description} />
          </div>
        )}
        {entry.gallery && entry.gallery.length > 0 && (
          <GalleryCarousel images={entry.gallery} />
        )}
      </div>
    </div>
  );
}
