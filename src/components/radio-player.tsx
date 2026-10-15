"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type RadioEpisode = {
  _id: string;
  episodeNumber: number;
  title: string | null;
  airDate: string | null;
  description: string | null;
  audioUrl: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  episodes: RadioEpisode[];
};

function formatTime(seconds: number) {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function episodeLabel(ep: RadioEpisode) {
  const num = `Ep. ${String(ep.episodeNumber).padStart(3, "0")}`;
  return ep.title ? `${num} — ${ep.title}` : num;
}

export function RadioPlayer({ open, onClose, episodes }: Props) {
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      audioRef.current?.pause();
      setPlaying(false);
      setActiveId(null);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [open]);

  const activeEpisode = episodes.find((e) => e._id === activeId) ?? null;

  function selectEpisode(id: string) {
    if (id === activeId) {
      if (playing) {
        audioRef.current?.pause();
        setPlaying(false);
      } else {
        audioRef.current?.play();
        setPlaying(true);
      }
      return;
    }
    setActiveId(id);
    setCurrentTime(0);
    setDuration(0);
    setPlaying(true);
  }

  function togglePlay() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  }

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const t = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = t;
    setCurrentTime(t);
  }

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {activeEpisode?.audioUrl && (
            <audio
              key={activeEpisode._id}
              ref={audioRef}
              src={activeEpisode.audioUrl}
              autoPlay
              onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
              onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
            />
          )}

          <motion.div
            key="backdrop"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-warm/10 backdrop-blur-md"
          />

          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed right-0 top-0 z-50 h-full w-full overflow-y-auto bg-warm text-ink sm:w-[65vw]"
            aria-modal="true"
            role="dialog"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-6 top-5 text-sm tracking-wide hover:opacity-70 sm:right-8 sm:top-6"
            >
              ×
            </button>

            <div className="px-6 py-10 sm:px-14 sm:py-16">
              <h2 className="mb-8 border-b border-hairline pb-2 text-4xl leading-none sm:text-6xl">
                Radio
              </h2>

              {/* Player controls */}
              <div className="mb-10 space-y-3">
                <div className="text-base">
                  {activeEpisode ? episodeLabel(activeEpisode) : "—"}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={togglePlay}
                    disabled={!activeEpisode?.audioUrl}
                    className="text-sm tracking-wide hover:opacity-70 disabled:opacity-30"
                  >
                    {playing ? "PAUSE" : "PLAY"}
                  </button>
                  <span className="text-xs tabular-nums text-ink-muted">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={currentTime}
                  onChange={seek}
                  disabled={!activeEpisode?.audioUrl}
                  className="w-full cursor-pointer accent-ink disabled:opacity-30"
                />
              </div>

              {/* Episode list */}
              <div className="divide-y divide-hairline">
                {episodes.length === 0 && (
                  <p className="py-4 text-sm text-ink-muted">No episodes yet.</p>
                )}
                {episodes.map((ep) => {
                  const isActive = ep._id === activeId;
                  return (
                    <button
                      key={ep._id}
                      type="button"
                      onClick={() => selectEpisode(ep._id)}
                      className="w-full py-4 text-left hover:opacity-70"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-3 shrink-0 text-xs text-ink-muted">
                          {isActive && playing ? "▶" : ""}
                        </span>
                        <span className="text-base">{episodeLabel(ep)}</span>
                      </div>
                      {ep.airDate && (
                        <div className="ml-5 mt-1 text-xs text-ink-muted">{ep.airDate}</div>
                      )}
                      {ep.description && (
                        <div className="ml-5 mt-1 text-xs text-ink-muted">{ep.description}</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
