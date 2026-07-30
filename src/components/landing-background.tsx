"use client";

import { useSitePreferences } from "./site-preferences-provider";

export function LandingBackground() {
  const { prefs, hydrated } = useSitePreferences();
  if (!hydrated || !prefs.wallpaperUrl) return null;

  return (
    <div
      aria-hidden
      className="absolute inset-0 z-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${prefs.wallpaperUrl})` }}
    />
  );
}
