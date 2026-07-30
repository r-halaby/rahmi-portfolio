"use client";

import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import type { Image } from "sanity";
import { ExpandableSection } from "@/components/expandable-section";
import { resolveEmbed } from "@/lib/covers";
import { urlFor } from "@/sanity/image";

type ImageItem = Image & { _type: "image"; caption?: string | null };
type EmbedItem = {
  _type: "embed";
  _key?: string;
  url: string;
  caption?: string | null;
};
type VideoItem = {
  _type: "video";
  _key?: string;
  caption?: string | null;
  file?: {
    asset?: { url?: string | null; mimeType?: string | null } | null;
  } | null;
  poster?: Image | null;
};
export type GalleryItem = ImageItem | EmbedItem | VideoItem;

export type SanitySkill = {
  _id: string;
  name: string;
  body: PortableTextBlock[] | null;
  gallery: GalleryItem[] | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  name: string;
  skill: SanitySkill | null;
};

export function SkillDetailModal({ open, onClose, name, skill }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="skill-backdrop"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60]"
          />
          <div className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center px-8">
            <motion.div
              key="skill-panel"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "tween", duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              style={{ maxHeight: "90vh" }}
              className="pointer-events-auto relative flex h-full w-full max-w-3xl flex-col overflow-hidden bg-warm text-ink"
              role="dialog"
              aria-modal="true"
              aria-label={name}
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-6 top-4 z-10 text-sm tracking-wide hover:opacity-70"
              >
                ×
              </button>

              <div className="overflow-y-auto px-10 py-10">
                <h2 className="mb-6 text-2xl">{name}</h2>

                {skill?.body && skill.body.length > 0 ? (
                  <div className="mb-8">
                    <ExpandableSection maxHeight={180}>
                      <div className="space-y-4 text-sm leading-relaxed text-ink">
                        <PortableText value={skill.body} />
                      </div>
                    </ExpandableSection>
                  </div>
                ) : (
                  <p className="mb-8 text-sm text-ink-muted">
                    Overview coming soon.
                  </p>
                )}

                {skill?.gallery && skill.gallery.length > 0 && (
                  <div className="-mx-10 overflow-x-auto px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div
                      className="flex gap-3"
                      style={{ scrollSnapType: "x mandatory" }}
                    >
                      {skill.gallery.map((item, i) => (
                        <GalleryFigure key={itemKey(item, i)} item={item} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function itemKey(item: GalleryItem, i: number) {
  if (item._type === "image") return item.asset?._ref ?? `img-${i}`;
  if (item._type === "video") return item._key ?? `video-${i}`;
  return item._key ?? item.url ?? `embed-${i}`;
}

function GalleryFigure({ item }: { item: GalleryItem }) {
  if (item._type === "video") {
    const videoUrl = item.file?.asset?.url;
    if (!videoUrl) return null;
    const posterUrl = item.poster?.asset
      ? urlFor(item.poster as Image).width(800).auto("format").url()
      : undefined;
    return (
      <figure className="shrink-0" style={{ scrollSnapAlign: "start" }}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src={videoUrl}
          poster={posterUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="block h-64 w-auto"
        />
        {item.caption && (
          <figcaption className="mt-1 max-w-xs text-xs text-ink-muted">
            {item.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (item._type === "image") {
    const url = item.asset
      ? urlFor(item as Image).width(1200).auto("format").url()
      : null;
    if (!url) return null;
    return (
      <figure className="shrink-0" style={{ scrollSnapAlign: "start" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={item.caption ?? ""}
          className="block h-64 w-auto object-cover"
          loading="lazy"
        />
        {item.caption && (
          <figcaption className="mt-1 max-w-xs text-xs text-ink-muted">
            {item.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  const resolved = resolveEmbed(item.url);
  if (!resolved) {
    return (
      <figure className="shrink-0" style={{ scrollSnapAlign: "start" }}>
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="flex h-64 w-64 items-center justify-center bg-ink/5 text-xs text-ink-muted underline"
        >
          Open link
        </a>
        {item.caption && (
          <figcaption className="mt-1 max-w-xs text-xs text-ink-muted">
            {item.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  const width = resolved.aspect === "video" ? 456 : 400;
  const hideChrome = resolved.kind === "youtube";
  return (
    <figure className="shrink-0" style={{ scrollSnapAlign: "start" }}>
      <div className="group relative" style={{ width, height: 256 }}>
        <iframe
          src={resolved.src}
          title={item.caption ?? "Embed"}
          allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
          allowFullScreen
          className="block h-full w-full border-0"
        />
        {hideChrome && (
          <>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-warm transition-opacity duration-200 group-hover:opacity-0" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-warm transition-opacity duration-200 group-hover:opacity-0" />
          </>
        )}
      </div>
      {item.caption && (
        <figcaption className="mt-1 max-w-xs text-xs text-ink-muted">
          {item.caption}
        </figcaption>
      )}
    </figure>
  );
}
