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
  if (!isFinite(seconds) || seconds < 0) return "0:00";
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
  const panelRef = useRef<HTMLDivElement | null>(null);

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
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        const tab = document.querySelector("[data-radio-tab]");
        if (tab && tab.contains(e.target as Node)) return;
        onClose();
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      audioRef.current?.pause();
      setPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [open]);

  const activeEpisode = episodes.find((e) => e._id === activeId) ?? null;

  function selectEpisode(id: string) {
    if (id === activeId) {
      if (playing) {
        audioRef.current?.pause();
      } else {
        audioRef.current?.play();
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
    } else {
      audioRef.current.play();
    }
  }

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const t = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = t;
    setCurrentTime(t);
  }

  if (!mounted) return null;

  return createPortal(
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

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            key="radio-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "tween", duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed right-8 top-12 z-40 w-80 overflow-hidden rounded-b-lg bg-black text-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <span className="text-xs tracking-widest">LOOK & FEEL RADIO</span>
              <button
                type="button"
                onClick={onClose}
                className="text-sm leading-none text-white/60 hover:text-white"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Player controls */}
            <div className="px-4 py-4">
              <div className="mb-3 truncate text-sm">
                {activeEpisode ? episodeLabel(activeEpisode) : "Select an episode"}
              </div>
              <div className="mb-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  disabled={!activeEpisode?.audioUrl}
                  className="text-xs tracking-widest hover:opacity-70 disabled:opacity-30"
                >
                  {playing ? "PAUSE" : "PLAY"}
                </button>
                <span className="text-xs tabular-nums text-white/50">
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
                className="w-full cursor-pointer accent-white disabled:opacity-30"
                style={{ height: "2px" }}
              />
            </div>

            {/* Episode list */}
            <div className="max-h-60 overflow-y-auto border-t border-white/10">
              {episodes.length === 0 && (
                <p className="px-4 py-4 text-xs text-white/40">No episodes yet.</p>
              )}
              {episodes.map((ep) => {
                const isActive = ep._id === activeId;
                return (
                  <button
                    key={ep._id}
                    type="button"
                    onClick={() => selectEpisode(ep._id)}
                    className={`w-full border-b border-white/5 px-4 py-3 text-left last:border-0 hover:bg-white/5 ${isActive ? "bg-white/10" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 shrink-0 text-xs text-white/40">
                        {isActive && playing ? "▶" : ""}
                      </span>
                      <span className="text-sm">{episodeLabel(ep)}</span>
                    </div>
                    {ep.airDate && (
                      <div className="ml-5 mt-0.5 text-xs text-white/40">{ep.airDate}</div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body,
  );
}
