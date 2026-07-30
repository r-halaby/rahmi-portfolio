"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";

export type Photo = {
  _id: string;
  image: {
    asset: {
      url: string;
      metadata: { dimensions: { width: number; height: number; aspectRatio: number } };
    };
  };
  location: string | null;
  dateTaken: string | null;
  series: string | null;
  featured: boolean;
};

type Placed = {
  photo: Photo;
  xPct: number;
  yPct: number;
  width: number;
  height: number;
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function computeLayout(photos: Photo[]): Placed[] {
  return photos.map((photo, i) => {
    const rng = mulberry32(i * 2654435761 + 1);
    const width = 200 + rng() * 260;
    const aspectRatio = photo.image.asset.metadata.dimensions.aspectRatio || 1;
    const height = width / aspectRatio;
    const xPct = 18 + rng() * 64;
    const yPct = 20 + rng() * 60;
    return { photo, xPct, yPct, width, height };
  });
}

function sanityImageAt(url: string, targetWidth: number) {
  if (!url) return url;
  const w = Math.round(targetWidth * 2);
  if (url.includes("cdn.sanity.io")) {
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}w=${w}&auto=format&fit=max`;
  }
  return url;
}

const SLOT = 1;
const OVERLAP = 3;
const LIFESPAN = SLOT * OVERLAP;
const ENTER_FRACTION = 0.18;
const ENTER_DUR = LIFESPAN * ENTER_FRACTION;
const EXIT_DUR = LIFESPAN - ENTER_DUR;
const OPACITY_HOLD = 0.6;
const SCROLL_SENSITIVITY = 0.0015;
const TOUCH_SENSITIVITY = 0.003;
const EASE_FACTOR = 0.08;

export function PhotoCanvas({ photos }: { photos: Photo[] }) {
  if (photos.length > 60) {
    console.warn(`PhotoCanvas: capping display at 60 (received ${photos.length})`);
  }
  const displayPhotos = photos.slice(0, 60);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const layout = useMemo(() => computeLayout(displayPhotos), [displayPhotos]);

  useEffect(() => {
    const n = layout.length;
    if (n === 0) return;
    if (typeof window !== "undefined" && !window.matchMedia("(min-width: 640px)").matches) {
      return;
    }

    const cycleDur = n * SLOT;
    const wrap = gsap.utils.wrap(0, cycleDur);
    const els = imageRefs.current.slice(0, n);

    els.forEach((el) => {
      if (!el) return;
      el.style.transform = "translate(-50%, -50%) scale(1)";
      el.style.opacity = "0";
    });

    let target = 0;
    let current = 0;
    let raf = 0;

    const tick = () => {
      current += (target - current) * EASE_FACTOR;
      for (let i = 0; i < n; i++) {
        const el = els[i];
        if (!el) continue;
        const localTime = wrap(current - i * SLOT);
        let scale: number;
        let opacity: number;
        if (localTime < ENTER_DUR) {
          const t = localTime / ENTER_DUR;
          const eased = 1 - Math.pow(1 - t, 2);
          scale = 1.1 - 0.1 * eased;
          opacity = eased;
        } else if (localTime < LIFESPAN) {
          const t = (localTime - ENTER_DUR) / EXIT_DUR;
          scale = 1 - 0.9 * t;
          opacity =
            t < OPACITY_HOLD
              ? 1
              : Math.max(0, 1 - (t - OPACITY_HOLD) / (1 - OPACITY_HOLD));
        } else {
          scale = 0.1;
          opacity = 0;
        }
        el.style.transform = `translate(-50%, -50%) scale(${scale})`;
        el.style.opacity = String(opacity);
      }
      raf = requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      target += e.deltaY * SCROLL_SENSITIVITY;
    };

    let touchY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY === null) return;
      e.preventDefault();
      const dy = touchY - e.touches[0].clientY;
      touchY = e.touches[0].clientY;
      target += dy * TOUCH_SENSITIVITY;
    };
    const onTouchEnd = () => {
      touchY = null;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      document.body.style.overflow = prevOverflow;
    };
  }, [layout]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {layout.map((placed, i) => (
        <div
          key={placed.photo._id}
          ref={(el) => {
            imageRefs.current[i] = el;
          }}
          className="absolute will-change-transform"
          style={{
            left: `${placed.xPct}%`,
            top: `${placed.yPct}%`,
            width: placed.width,
            height: placed.height,
            transform: "translate(-50%, -50%) scale(1)",
            opacity: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sanityImageAt(placed.photo.image.asset.url, placed.width)}
            alt=""
            width={placed.width}
            height={placed.height}
            className="block h-full w-full object-cover"
            loading="eager"
          />
        </div>
      ))}
    </div>
  );
}
