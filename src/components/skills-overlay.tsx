"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  skills: string[];
  onSelect: (name: string) => void;
};

export function SkillsOverlay({ open, onClose, skills, onSelect }: Props) {
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
            className="fixed inset-0 z-40"
          />
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            style={{ left: "calc(50% + 24rem)" }}
            className="fixed right-0 top-0 z-50 h-full overflow-y-auto text-ink"
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

            <div className="px-10 py-16">
              <h2 className="mb-10 text-xs uppercase tracking-widest text-ink-muted">
                Skills
              </h2>
              <ul className="flex flex-col items-end space-y-2 text-base">
                {skills.map((s) => (
                  <li key={s}>
                    <motion.button
                      type="button"
                      onClick={() => onSelect(s)}
                      whileHover={{ fontWeight: 700 }}
                      transition={{ duration: 0.15 }}
                      className="text-right"
                    >
                      {s}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
