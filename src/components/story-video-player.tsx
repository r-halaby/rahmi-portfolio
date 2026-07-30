"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  poster?: string;
  className?: string;
  style?: React.CSSProperties;
  emailTo?: string;
  emailSubject?: string;
  compact?: boolean;
};

export function StoryVideoPlayer({
  src,
  poster,
  className,
  style,
  emailTo,
  emailSubject,
  compact = false,
}: Props) {
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
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }
  };

  const mailto = emailTo
    ? `mailto:${emailTo}${
        emailSubject ? `?subject=${encodeURIComponent(emailSubject)}` : ""
      }`
    : null;

  const barInset = compact ? "inset-x-2" : "inset-x-3";
  const barTop = compact ? "top-2" : "top-3";
  const muteTop = compact ? "top-5" : "top-8";
  const muteRight = compact ? "right-2" : "right-3";
  const muteSize = compact ? "h-6 w-6" : "h-8 w-8";
  const muteIcon = compact ? "h-3 w-3" : "h-4 w-4";
  const bottomInset = compact ? "inset-x-2 bottom-2" : "inset-x-3 bottom-4";
  const bottomGap = compact ? "gap-2" : "gap-3";
  const cameraSize = compact ? "h-7 w-7" : "h-10 w-10";
  const cameraIcon = compact ? "h-3.5 w-3.5" : "h-5 w-5";
  const pillPad = compact ? "px-2.5 py-1" : "px-4 py-2";
  const pillText = compact ? "text-[10px]" : "text-sm";
  const dotsIcon = compact ? "h-3 w-3" : "h-4 w-4";

  const containerStyle = compact
    ? { width: 144, height: 256, ...style }
    : undefined;
  const videoStyle: React.CSSProperties = compact
    ? {
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }
    : { display: "block", ...style };

  return (
    <div
      className={`relative inline-block overflow-hidden ${className ?? ""}`}
      style={containerStyle}
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        onClick={toggleMute}
        style={videoStyle}
        className="cursor-pointer"
      />
      <div className={`pointer-events-none absolute ${barInset} ${barTop} flex items-center`}>
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
        className={`absolute ${muteRight} ${muteTop} flex ${muteSize} items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-opacity hover:opacity-90`}
      >
        {muted ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={muteIcon}
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
            className={muteIcon}
            aria-hidden
          >
            <path d="M5 9h3l4-3v12l-4-3H5z" />
            <path d="M16 8a5 5 0 0 1 0 8" />
            <path d="M19 5a9 9 0 0 1 0 14" />
          </svg>
        )}
      </button>
      <div className={`pointer-events-none absolute ${bottomInset} flex items-center ${bottomGap}`}>
        <div
          className={`flex ${cameraSize} shrink-0 items-center justify-center rounded-full border border-white/90 text-white`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cameraIcon}
            aria-hidden
          >
            <path d="M4 8h3l2-2h6l2 2h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
            <circle cx="12" cy="13" r="3.5" />
          </svg>
        </div>
        {mailto ? (
          <a
            href={mailto}
            className={`pointer-events-auto flex flex-1 items-center justify-between rounded-full border border-white/90 ${pillPad} text-white/90 transition-colors hover:text-white`}
          >
            <span className={pillText}>Send message</span>
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className={dotsIcon}
              aria-hidden
            >
              <circle cx="6" cy="12" r="1.6" />
              <circle cx="12" cy="12" r="1.6" />
              <circle cx="18" cy="12" r="1.6" />
            </svg>
          </a>
        ) : (
          <div
            className={`flex flex-1 items-center justify-between rounded-full border border-white/90 ${pillPad} text-white/90`}
          >
            <span className={pillText}>Send message</span>
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className={dotsIcon}
              aria-hidden
            >
              <circle cx="6" cy="12" r="1.6" />
              <circle cx="12" cy="12" r="1.6" />
              <circle cx="18" cy="12" r="1.6" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
