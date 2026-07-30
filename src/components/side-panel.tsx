"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  useSitePreferences,
  useT,
  type CursorVariant,
  type FontSize,
  type FontWeight,
  type Language,
  type TextAlign,
  type Theme,
} from "./site-preferences-provider";

type PanelKey = "backlog" | "language" | "style" | "wallpaper" | "cursor";

type BacklogEntry = {
  sha: string;
  date: string;
  message: string;
};

type Wallpaper = {
  _id: string;
  title: string | null;
  imageUrl: string;
  thumbUrl: string;
};

type Props = {
  wallpapers: Wallpaper[];
  backlog: BacklogEntry[];
};

export function SidePanel({ wallpapers, backlog }: Props) {
  const [active, setActive] = useState<PanelKey | null>(null);
  const [hovered, setHovered] = useState(false);
  const tr = useT();

  const expanded = hovered || active !== null;

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const toggle = (k: PanelKey) => setActive((cur) => (cur === k ? null : k));

  return (
    <>
      <div
        data-side-rail
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="fixed right-0 top-1/2 z-40 flex -translate-y-1/2 items-center py-6 pl-6 pr-3 text-ink"
      >
        <span
          aria-hidden
          className={`absolute right-1.5 top-1/2 h-14 w-[3px] -translate-y-1/2 bg-current transition-opacity duration-200 ${
            expanded ? "opacity-0" : "opacity-60"
          }`}
        />
        <nav
          aria-label="Site preferences"
          className={`flex flex-col items-center gap-4 transition-opacity duration-200 ${
            expanded ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
        <RailButton
          label={tr("panel.backlog")}
          active={active === "backlog"}
          onClick={() => toggle("backlog")}
        >
          <BacklogIcon />
        </RailButton>
        <RailButton
          label={tr("panel.language")}
          active={active === "language"}
          onClick={() => toggle("language")}
        >
          <LangIcon />
        </RailButton>
        <RailButton
          label={tr("panel.style")}
          active={active === "style"}
          onClick={() => toggle("style")}
        >
          <StyleIcon />
        </RailButton>
        <RailButton
          label={tr("panel.wallpaper")}
          active={active === "wallpaper"}
          onClick={() => toggle("wallpaper")}
        >
          <WallpaperIcon />
        </RailButton>
        <RailButton
          label={tr("panel.cursor")}
          active={active === "cursor"}
          onClick={() => toggle("cursor")}
        >
          <CursorIcon />
        </RailButton>
        </nav>
      </div>

      <AnimatePresence>
        {active && (
          <>
            <motion.div
              key="panel-backdrop"
              onClick={() => setActive(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-30"
            />
            <motion.aside
              key="panel-body"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ type: "tween", duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="fixed right-16 top-1/2 z-40 w-72 -translate-y-1/2 bg-warm p-5 text-ink shadow-xl"
              role="dialog"
              aria-label={active}
            >
              {active === "backlog" && <BacklogPanel entries={backlog} />}
              {active === "language" && <LanguagePanel />}
              {active === "style" && <StylePanel />}
              {active === "wallpaper" && <WallpaperPanel wallpapers={wallpapers} />}
              {active === "cursor" && <CursorPanel />}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function RailButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`flex h-9 w-9 items-center justify-center transition-opacity hover:opacity-100 ${
        active ? "opacity-100" : "opacity-60"
      }`}
    >
      {children}
    </button>
  );
}

// ---------- Panels ----------

function PanelHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-xs uppercase tracking-widest text-ink-muted">
      {children}
    </h3>
  );
}

function BacklogPanel({ entries }: { entries: BacklogEntry[] }) {
  const tr = useT();
  return (
    <div className="max-h-[70vh] overflow-y-auto">
      <PanelHeading>{tr("panel.backlog")}</PanelHeading>
      {entries.length === 0 ? (
        <p className="text-xs text-ink-muted">{tr("panel.emptyBacklog")}</p>
      ) : (
        <ul className="space-y-3 text-sm">
          {entries.map((e) => (
            <li key={e.sha} className="border-b border-hairline pb-3 last:border-0">
              <div>{e.message}</div>
              <div className="mt-1 text-[10px] uppercase tracking-widest text-ink-muted">
                {new Date(e.date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LanguagePanel() {
  const { prefs, setPref } = useSitePreferences();
  const tr = useT();
  const languages: { key: Language; label: string; flag: string }[] = [
    { key: "en", label: "English", flag: "🇬🇧" },
    { key: "fr", label: "Français", flag: "🇫🇷" },
  ];
  return (
    <div>
      <PanelHeading>{tr("panel.language")}</PanelHeading>
      <div className="flex flex-col gap-1">
        {languages.map((l) => (
          <button
            key={l.key}
            type="button"
            onClick={() => setPref("language", l.key)}
            className={`flex items-center justify-between rounded px-2 py-2 text-sm hover:bg-ink/5 ${
              prefs.language === l.key ? "bg-ink/5" : ""
            }`}
          >
            <span className="flex items-center gap-2">
              <span>{l.flag}</span>
              {l.label}
            </span>
            {prefs.language === l.key && <span className="text-xs">●</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function StylePanel() {
  const { prefs, setPref } = useSitePreferences();
  const tr = useT();
  const sizes: { key: FontSize; label: string }[] = [
    { key: "sm", label: tr("size.sm") },
    { key: "md", label: tr("size.md") },
    { key: "lg", label: tr("size.lg") },
  ];
  const weights: { key: FontWeight; label: string }[] = [
    { key: "normal", label: tr("weight.normal") },
    { key: "medium", label: tr("weight.medium") },
    { key: "bold", label: tr("weight.bold") },
  ];
  const aligns: { key: TextAlign; label: string }[] = [
    { key: "left", label: tr("align.left") },
    { key: "justify", label: tr("align.justify") },
  ];
  const themes: { key: Theme; label: string }[] = [
    { key: "light", label: tr("theme.light") },
    { key: "dark", label: tr("theme.dark") },
  ];

  return (
    <div className="space-y-4">
      <PanelHeading>{tr("panel.style")}</PanelHeading>
      <ControlRow label={tr("panel.size")}>
        <SegmentedGroup
          value={prefs.fontSize}
          onSelect={(v) => setPref("fontSize", v)}
          options={sizes}
        />
      </ControlRow>
      <ControlRow label={tr("panel.weight")}>
        <SegmentedGroup
          value={prefs.fontWeight}
          onSelect={(v) => setPref("fontWeight", v)}
          options={weights}
        />
      </ControlRow>
      <ControlRow label={tr("panel.align")}>
        <SegmentedGroup
          value={prefs.textAlign}
          onSelect={(v) => setPref("textAlign", v)}
          options={aligns}
        />
      </ControlRow>
      <ControlRow label={tr("panel.theme")}>
        <SegmentedGroup
          value={prefs.theme}
          onSelect={(v) => setPref("theme", v)}
          options={themes}
        />
      </ControlRow>
    </div>
  );
}

function WallpaperPanel({ wallpapers }: { wallpapers: Wallpaper[] }) {
  const { prefs, setPref } = useSitePreferences();
  const tr = useT();
  return (
    <div>
      <PanelHeading>{tr("panel.wallpaper")}</PanelHeading>
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => setPref("wallpaperUrl", null)}
          aria-label="No wallpaper"
          className={`aspect-square bg-home ring-ink ${
            prefs.wallpaperUrl === null ? "ring-2" : ""
          }`}
        />
        {wallpapers.map((w) => (
          <button
            key={w._id}
            type="button"
            onClick={() => setPref("wallpaperUrl", w.imageUrl)}
            aria-label={w.title ?? "Wallpaper"}
            className={`aspect-square overflow-hidden ring-ink ${
              prefs.wallpaperUrl === w.imageUrl ? "ring-2" : ""
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={w.thumbUrl}
              alt=""
              className="block h-full w-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function CursorPanel() {
  const { prefs, setPref } = useSitePreferences();
  const tr = useT();
  const variants: { key: CursorVariant; label: string }[] = [
    { key: "off", label: tr("cursor.off") },
    { key: "dot", label: tr("cursor.dot") },
    { key: "orb", label: tr("cursor.orb") },
    { key: "ring", label: tr("cursor.ring") },
  ];
  return (
    <div>
      <PanelHeading>{tr("panel.cursor")}</PanelHeading>
      <div className="flex flex-col gap-1">
        {variants.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => setPref("cursor", v.key)}
            className={`flex items-center justify-between rounded px-2 py-2 text-sm hover:bg-ink/5 ${
              prefs.cursor === v.key ? "bg-ink/5" : ""
            }`}
          >
            <span>{v.label}</span>
            {prefs.cursor === v.key && <span className="text-xs">●</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function ControlRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1 text-[10px] uppercase tracking-widest text-ink-muted">
        {label}
      </div>
      {children}
    </div>
  );
}

function SegmentedGroup<T extends string>({
  value,
  onSelect,
  options,
}: {
  value: T;
  onSelect: (v: T) => void;
  options: { key: T; label: string }[];
}) {
  return (
    <div className="flex overflow-hidden border border-hairline">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => onSelect(o.key)}
          className={`flex-1 px-2 py-1.5 text-xs uppercase tracking-wide transition-colors ${
            value === o.key ? "bg-ink text-paper" : "hover:bg-ink/5"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ---------- Icons ----------

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-5 w-5",
  "aria-hidden": true,
};

function BacklogIcon() {
  return (
    <svg {...iconProps}>
      <line x1="8" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="20" y2="12" />
      <line x1="8" y1="18" x2="20" y2="18" />
      <circle cx="4" cy="6" r="1" fill="currentColor" />
      <circle cx="4" cy="12" r="1" fill="currentColor" />
      <circle cx="4" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

function LangIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a13 13 0 0 1 0 18" />
      <path d="M12 3a13 13 0 0 0 0 18" />
    </svg>
  );
}

function StyleIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 20L10 4h2l6 16" />
      <line x1="6" y1="14" x2="16" y2="14" />
    </svg>
  );
}

function WallpaperIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="4" width="18" height="16" rx="1" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M21 17l-5-6-6 7-3-3-4 4" />
    </svg>
  );
}

function CursorIcon() {
  return (
    <svg {...iconProps}>
      <path d="M5 3l6 16 2-7 7-2z" />
    </svg>
  );
}
