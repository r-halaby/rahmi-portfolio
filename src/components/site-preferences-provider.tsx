"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { t } from "@/lib/i18n";

export type FontSize = "sm" | "md" | "lg";
export type FontWeight = "normal" | "medium" | "bold";
export type TextAlign = "left" | "justify";
export type Theme = "light" | "dark";
export type CursorVariant = "off" | "dot" | "orb" | "ring";
export type Language = "en" | "fr";

export type Preferences = {
  fontSize: FontSize;
  fontWeight: FontWeight;
  textAlign: TextAlign;
  theme: Theme;
  cursor: CursorVariant;
  language: Language;
  wallpaperUrl: string | null;
};

const DEFAULT_PREFS: Preferences = {
  fontSize: "md",
  fontWeight: "normal",
  textAlign: "left",
  theme: "light",
  cursor: "off",
  language: "en",
  wallpaperUrl: null,
};

const STORAGE_KEY = "rahmi-prefs-v1";

type PrefsContextValue = {
  prefs: Preferences;
  setPref: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  reset: () => void;
  hydrated: boolean;
};

const PrefsContext = createContext<PrefsContextValue | null>(null);

function loadPrefs(): Preferences {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<Preferences>;
    return { ...DEFAULT_PREFS, ...parsed };
  } catch {
    return DEFAULT_PREFS;
  }
}

function applyToDocument(p: Preferences) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  html.dataset.fontSize = p.fontSize;
  html.dataset.fontWeight = p.fontWeight;
  html.dataset.textAlign = p.textAlign;
  html.dataset.theme = p.theme;
  html.dataset.cursor = p.cursor;
  html.dataset.lang = p.language;
  html.dataset.wallpaper = p.wallpaperUrl ? "on" : "off";
}

export function SitePreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadPrefs();
    setPrefs(loaded);
    applyToDocument(loaded);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    applyToDocument(prefs);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // ignore
    }
  }, [prefs, hydrated]);

  const setPref = useCallback(
    <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
      setPrefs((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const reset = useCallback(() => setPrefs(DEFAULT_PREFS), []);

  const value = useMemo<PrefsContextValue>(
    () => ({ prefs, setPref, reset, hydrated }),
    [prefs, setPref, reset, hydrated],
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function useSitePreferences() {
  const ctx = useContext(PrefsContext);
  if (!ctx) {
    throw new Error(
      "useSitePreferences must be used within SitePreferencesProvider",
    );
  }
  return ctx;
}

export function useT() {
  const { prefs } = useSitePreferences();
  return (key: string) => t(key, prefs.language);
}
