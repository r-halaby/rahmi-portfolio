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

export type ExperiencePosition = {
  title: string;
  employmentType: string | null;
  startDate: string;
  endDate: string | null;
  description: string | null;
  gallery: GalleryItem[] | null;
};

export type ExperienceRole = {
  _id: string;
  title: string;
  company: string;
  logo: Image | null;
  employmentType: string | null;
  workMode: string | null;
  location: string | null;
  startDate: string;
  endDate: string | null;
  description: string | null;
  gallery: GalleryItem[] | null;
  titles: ExperiencePosition[] | null;
};

const formatMonthYear = flexMonthYear;
const durationBetween = flexDuration;

function titleCase(s: string | null): string | null {
  if (!s) return s;
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("-");
}

function logoUrl(image: Image | null | undefined) {
  if (!image?.asset) return null;
  return urlFor(image).width(120).height(120).fit("crop").auto("format").url();
}

function earliest(dates: (string | null | undefined)[]): string | null {
  const valid = dates.filter(Boolean) as string[];
  if (!valid.length) return null;
  return [...valid].sort()[0];
}

function latestOrPresent(
  dates: (string | null | undefined)[],
): string | null {
  if (dates.some((d) => !d)) return null;
  const valid = dates.filter(Boolean) as string[];
  if (!valid.length) return null;
  return [...valid].sort().at(-1) ?? null;
}

export function ExperienceList({ roles }: { roles: ExperienceRole[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [tapped, setTapped] = useState<number | null>(null);

  return (
    <div className="space-y-10">
      {roles.map((r, i) => {
        const isTop = i === 0;
        const active = tapped ?? hovered;
        const expanded = active === null ? isTop : active === i;
        return (
          <RoleEntry
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

function RoleEntry({
  entry,
  expanded,
  onMouseEnter,
  onMouseLeave,
  onToggle,
}: {
  entry: ExperienceRole;
  expanded: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onToggle: () => void;
}) {
  const grouped = (entry.titles ?? []).length > 0;

  let header: React.ReactNode;
  let body: React.ReactNode;

  if (grouped) {
    const primary: ExperiencePosition = {
      title: entry.title,
      employmentType: entry.employmentType,
      startDate: entry.startDate,
      endDate: entry.endDate,
      description: entry.description,
      gallery: entry.gallery,
    };
    const positions = [primary, ...(entry.titles ?? [])];
    const overallStart = earliest(positions.map((p) => p.startDate));
    const overallEnd = latestOrPresent(positions.map((p) => p.endDate));
    const overallDuration = overallStart
      ? durationBetween(overallStart, overallEnd)
      : null;
    const locLine = [entry.location, titleCase(entry.workMode)]
      .filter(Boolean)
      .join(" · ");
    header = (
      <>
        <LogoBox image={entry.logo} />
        <div className="mt-3 text-xl leading-tight">{entry.company}</div>
        <div className="mt-1 space-y-1 text-xs uppercase tracking-wide text-ink-muted">
          {overallDuration && <div>{overallDuration}</div>}
          {locLine && <div>{locLine}</div>}
        </div>
      </>
    );
    body = (
      <div className="mt-6 space-y-8 border-l border-hairline pl-6">
        {positions.map((p, i) => (
          <PositionEntry key={`${p.title}-${i}`} position={p} />
        ))}
      </div>
    );
  } else {
    const start = formatMonthYear(entry.startDate);
    const end = entry.endDate ? formatMonthYear(entry.endDate) : "Present";
    const duration = durationBetween(entry.startDate, entry.endDate);
    const companyLine = [entry.company, titleCase(entry.employmentType)]
      .filter(Boolean)
      .join(" · ");
    const dateLine = [
      [start, end].filter(Boolean).join(" – "),
      duration,
    ]
      .filter(Boolean)
      .join(" · ");
    const locLine = [entry.location, titleCase(entry.workMode)]
      .filter(Boolean)
      .join(" · ");
    header = (
      <>
        <LogoBox image={entry.logo} />
        <div className="mt-3 text-xl leading-tight">{entry.title}</div>
        <div className="mt-1 space-y-1 text-xs uppercase tracking-wide text-ink-muted">
          {companyLine && <div>{companyLine}</div>}
          {dateLine && <div>{dateLine}</div>}
          {locLine && <div>{locLine}</div>}
        </div>
      </>
    );
    body = (
      <>
        {entry.description && (
          <div className="mt-3">
            <ExpandableDescription text={entry.description} />
          </div>
        )}
        {entry.gallery && entry.gallery.length > 0 && (
          <GalleryCarousel images={entry.gallery} />
        )}
      </>
    );
  }

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <button
        type="button"
        onClick={onToggle}
        className="block w-full text-left"
        aria-expanded={expanded}
      >
        {header}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          expanded ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {body}
      </div>
    </div>
  );
}

function PositionEntry({ position }: { position: ExperiencePosition }) {
  const start = formatMonthYear(position.startDate);
  const end = position.endDate ? formatMonthYear(position.endDate) : "Present";
  const duration = durationBetween(position.startDate, position.endDate);
  const dateLine = [
    [start, end].filter(Boolean).join(" – "),
    duration,
  ]
    .filter(Boolean)
    .join(" · ");
  return (
    <div>
      <div className="text-base leading-tight">{position.title}</div>
      <div className="mt-1 space-y-1 text-xs uppercase tracking-wide text-ink-muted">
        {position.employmentType && (
          <div>{titleCase(position.employmentType)}</div>
        )}
        {dateLine && <div>{dateLine}</div>}
      </div>
      {position.description && (
        <div className="mt-2">
          <ExpandableDescription text={position.description} />
        </div>
      )}
      {position.gallery && position.gallery.length > 0 && (
        <GalleryCarousel images={position.gallery} />
      )}
    </div>
  );
}

function LogoBox({ image, size = 64 }: { image: Image | null; size?: number }) {
  const url = logoUrl(image);
  return (
    <div
      style={{ width: size, height: size }}
      className="shrink-0 overflow-hidden bg-ink/5"
    >
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
  );
}

