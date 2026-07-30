"use client";

import { useEffect, useRef } from "react";
import { useSitePreferences } from "./site-preferences-provider";

export function TrailingCursor() {
  const { prefs } = useSitePreferences();
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefs.cursor === "off") return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;

    const el = elRef.current;
    if (!el) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let x = mouseX;
    let y = mouseY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const tick = () => {
      x += (mouseX - x) * 0.18;
      y += (mouseY - y) * 0.18;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [prefs.cursor]);

  if (prefs.cursor === "off") return null;

  const style: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    pointerEvents: "none",
    zIndex: 9999,
    mixBlendMode: "difference",
  };

  if (prefs.cursor === "dot") {
    return (
      <div
        ref={elRef}
        style={{
          ...style,
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#ffffff",
        }}
      />
    );
  }

  if (prefs.cursor === "orb") {
    return (
      <div
        ref={elRef}
        style={{
          ...style,
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "invert(1) blur(4px)",
          WebkitBackdropFilter: "invert(1) blur(4px)",
        }}
      />
    );
  }

  // ring
  return (
    <div
      ref={elRef}
      style={{
        ...style,
        width: 28,
        height: 28,
        borderRadius: "50%",
        border: "1.5px solid #ffffff",
      }}
    />
  );
}
