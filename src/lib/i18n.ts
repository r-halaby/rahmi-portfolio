import type { Language } from "@/components/site-preferences-provider";

type Dict = Record<string, { en: string; fr: string }>;

export const strings: Dict = {
  // Nav
  "nav.experience": { en: "Experience", fr: "Expérience" },
  "nav.writing": { en: "Writing", fr: "Écrits" },
  "nav.photography": { en: "Photography", fr: "Photographie" },
  "nav.reference": { en: "Inspiration", fr: "Inspiration" },
  "nav.futures": { en: "Playspace", fr: "Terrain de jeu" },
  "nav.wish": {
    en: "Projects I Wish I Made",
    fr: "Projets que j’aurais aimé faire",
  },
  // Landing triggers
  "landing.skills": { en: "SKILLS", fr: "COMPÉTENCES" },
  "landing.bio": { en: "BIO", fr: "BIO" },
  // Panel
  "panel.backlog": { en: "Backlog", fr: "Journal" },
  "panel.language": { en: "Language", fr: "Langue" },
  "panel.style": { en: "Text style", fr: "Style de texte" },
  "panel.wallpaper": { en: "Wallpaper", fr: "Fond d’écran" },
  "panel.cursor": { en: "Cursor", fr: "Curseur" },
  "panel.size": { en: "Size", fr: "Taille" },
  "panel.weight": { en: "Weight", fr: "Graisse" },
  "panel.align": { en: "Align", fr: "Alignement" },
  "panel.theme": { en: "Theme", fr: "Thème" },
  "panel.emptyBacklog": { en: "No entries yet.", fr: "Aucune entrée pour le moment." },
  // Cursor variants
  "cursor.off": { en: "Default", fr: "Par défaut" },
  "cursor.dot": { en: "Dot", fr: "Point" },
  "cursor.orb": { en: "Orb", fr: "Sphère" },
  "cursor.ring": { en: "Ring", fr: "Anneau" },
  // Style options
  "size.sm": { en: "S", fr: "S" },
  "size.md": { en: "M", fr: "M" },
  "size.lg": { en: "L", fr: "L" },
  "weight.normal": { en: "Regular", fr: "Normal" },
  "weight.medium": { en: "Medium", fr: "Moyen" },
  "weight.bold": { en: "Bold", fr: "Gras" },
  "align.left": { en: "Left", fr: "Gauche" },
  "align.justify": { en: "Justify", fr: "Justifié" },
  "theme.light": { en: "Light", fr: "Clair" },
  "theme.dark": { en: "Dark", fr: "Sombre" },
};

export function t(key: string, lang: Language): string {
  const entry = strings[key];
  if (!entry) return key;
  return entry[lang] ?? entry.en;
}
