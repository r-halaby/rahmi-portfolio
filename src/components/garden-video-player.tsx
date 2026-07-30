"use client";

import { useEffect, useRef, useState } from "react";

export function GardenVideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const update = () => {
      if (v.duration > 0 && Number.isFinite(v.duration)) {
        setProgress((v.currentTime / v.duration) * 100);
      }
    };
    v.addEventListener("timeupdate", update);
    v.addEventListener("seeking", update);
    v.addEventListener("loadedmetadata", update);
    return () => {
      v.removeEventListener("timeupdate", update);
      v.removeEventListener("seeking", update);
      v.removeEventListener("loadedmetadata", update);
    };
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    setMuted(next);
    if (!next) {
      // if user is unmuting, ensure playback continues
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }
  };

  return (
    <div className="relative inline-block">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        onClick={toggleMute}
        style={{ maxWidth: "900px", maxHeight: "80vh" }}
        className="block h-auto w-auto cursor-pointer"
      />
      <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center">
        <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/35">
          <div
            className="h-full bg-white"
            style={{
              width: `${progress}%`,
              transition: "width 100ms linear",
            }}
          />
        </div>
      </div>
      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "Unmute" : "Mute"}
        className="absolute right-3 top-8 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-opacity hover:opacity-90"
      >
        {muted ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden
          >
            <path d="M5 9h3l4-3v12l-4-3H5z" />
            <line x1="17" y1="9" x2="22" y2="14" />
            <line x1="22" y1="9" x2="17" y2="14" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden
          >
            <path d="M5 9h3l4-3v12l-4-3H5z" />
            <path d="M16 8a5 5 0 0 1 0 8" />
            <path d="M19 5a9 9 0 0 1 0 14" />
          </svg>
        )}
      </button>
      <div className="pointer-events-none absolute inset-x-3 bottom-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/90 text-white">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden
          >
            <path d="M4 8h3l2-2h6l2 2h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
            <circle cx="12" cy="13" r="3.5" />
          </svg>
        </div>
        <a
          href="mailto:rahmihalaby@gmail.com?subject=I%20better%20just%20give%20you%20the%20gig%20now!"
          className="pointer-events-auto flex flex-1 items-center justify-between rounded-full border border-white/90 px-4 py-2 text-white/90 transition-colors hover:text-white"
        >
          <span className="text-sm">Send message</span>
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden
          >
            <circle cx="6" cy="12" r="1.6" />
            <circle cx="12" cy="12" r="1.6" />
            <circle cx="18" cy="12" r="1.6" />
          </svg>
        </a>
      </div>
    </div>
  );
}
