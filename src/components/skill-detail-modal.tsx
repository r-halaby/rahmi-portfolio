"use client";

import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import type { Image } from "sanity";
import { urlFor } from "@/sanity/image";

type GalleryImage = Image & { caption?: string | null };

export type SanitySkill = {
  _id: string;
  name: string;
  body: PortableTextBlock[] | null;
  gallery: GalleryImage[] | null;
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
                  <div className="mb-8 space-y-4 text-sm leading-relaxed text-ink">
                    <PortableText value={skill.body} />
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
                      {skill.gallery.map((img, i) => {
                        const url = img.asset
                          ? urlFor(img).width(1200).auto("format").url()
                          : null;
                        if (!url) return null;
                        return (
                          <figure
                            key={img.asset?._ref ?? i}
                            className="shrink-0"
                            style={{ scrollSnapAlign: "start" }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={url}
                              alt={img.caption ?? ""}
                              className="block h-64 w-auto object-cover"
                              loading="lazy"
                            />
                            {img.caption && (
                              <figcaption className="mt-1 max-w-xs text-xs text-ink-muted">
                                {img.caption}
                              </figcaption>
                            )}
                          </figure>
                        );
                      })}
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
