"use client";

import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

export type BioClient = {
  name: string;
  url: string | null;
};

export type BioExperience = {
  company: string;
  role: string;
  startYear: number;
  endYear: number | null;
};

export type BioEducation = {
  institution: string;
  program: string | null;
  location: string | null;
  activities: string | null;
  coursework: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  photoUrl: string | null;
  photoCaption: string | null;
  body: PortableTextBlock[] | null;
  education: BioEducation[];
  clients: BioClient[];
  experience: BioExperience[];
};

export function BioOverlay({
  open,
  onClose,
  photoUrl,
  photoCaption,
  body,
  education,
  clients,
  experience,
}: Props) {
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
            key="backdrop"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-warm/10 backdrop-blur-md"
          />

          {photoUrl && (
            <motion.div
              key="photo-card"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{
                type: "tween",
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.05,
              }}
              style={{ width: "35vw" }}
              className="pointer-events-none fixed left-0 top-0 z-50 flex h-full flex-col items-center justify-center"
            >
              <div style={{ maxWidth: "26vw" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt="Rahmi Halaby"
                  className="block w-full"
                  loading="eager"
                />
                {photoCaption && (
                  <div className="mt-4 whitespace-pre-line text-xs uppercase tracking-widest text-ink">
                    {photoCaption}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            style={{ width: "65vw" }}
            className="fixed right-0 top-0 z-50 h-full overflow-y-auto bg-warm text-ink"
            aria-modal="true"
            role="dialog"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-8 top-6 text-sm tracking-wide hover:opacity-70"
            >
              ×
            </button>

            <div className="px-14 py-16">
              <Section title="Overview">
                <div className="mb-6 aspect-video w-full max-w-md">
                  <iframe
                    src="https://www.youtube.com/embed/gTdXOEmX3g8?autoplay=1&mute=1&loop=1&playlist=gTdXOEmX3g8&playsinline=1"
                    title="Rahmi Halaby"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
                {body && body.length > 0 && (
                  <div className="max-w-3xl space-y-4 text-base leading-relaxed">
                    <PortableText value={body} />
                  </div>
                )}
              </Section>

              {clients.length > 0 && (
                <Section title="Clients">
                  <div className="grid grid-cols-3 gap-x-6 gap-y-2 text-base">
                    {clients.map((c, i) =>
                      c.url ? (
                        <a
                          key={`${c.name}-${i}`}
                          href={c.url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:opacity-70"
                        >
                          {c.name}
                        </a>
                      ) : (
                        <span key={`${c.name}-${i}`}>{c.name}</span>
                      ),
                    )}
                  </div>
                </Section>
              )}

              {education.length > 0 && (
                <Section title="Education">
                  <div className="grid grid-cols-2 gap-x-10 gap-y-10">
                    {education.map((e, i) => (
                      <EducationEntry key={`${e.institution}-${i}`} entry={e} />
                    ))}
                  </div>
                </Section>
              )}

              {experience.length > 0 && (
                <Section title="Experience">
                  <div className="grid grid-cols-2 gap-x-10 gap-y-10">
                    {experience.map((e, i) => (
                      <ExperienceEntry
                        key={`${e.company}-${e.startYear}-${i}`}
                        entry={e}
                      />
                    ))}
                  </div>
                </Section>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <h2 className="mb-8 border-b border-hairline pb-2 text-6xl leading-none">
        {title}
      </h2>
      {children}
    </section>
  );
}

function EducationEntry({ entry }: { entry: BioEducation }) {
  return (
    <div>
      <div className="text-2xl leading-tight">{entry.institution}</div>
      <div className="mt-2 space-y-3 text-xs uppercase tracking-wide text-ink-muted">
        {entry.program && <div>{entry.program}</div>}
        {entry.location && <div>{entry.location}</div>}
        {entry.activities && (
          <div>
            <div className="mb-1 text-ink-muted opacity-70">
              Activities and Societies
            </div>
            <div className="normal-case tracking-normal text-ink">
              {entry.activities}
            </div>
          </div>
        )}
        {entry.coursework && (
          <div>
            <div className="mb-1 text-ink-muted opacity-70">
              Coursework Included
            </div>
            <div className="normal-case tracking-normal text-ink">
              {entry.coursework}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ExperienceEntry({ entry }: { entry: BioExperience }) {
  return (
    <div>
      <div className="text-2xl leading-tight">{entry.company}</div>
      <div className="mt-2 space-y-1 text-xs uppercase tracking-wide text-ink-muted">
        <div>{entry.role}</div>
        <div>
          {entry.startYear} – {entry.endYear ?? "present"}
        </div>
      </div>
    </div>
  );
}
