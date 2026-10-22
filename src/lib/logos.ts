// Organisation marks rendered as one-ink silhouettes (CSS mask over currentColor). Each entry
// maps the name as it appears in profile.yaml to a file in public/logos and its aspect ratio
// (width over height), so the mark can be sized by height alone. Symbols are preferred over
// lockups: a wordmark turns to noise at 16px, a mark does not.
export interface Logo {
  file: string;
  aspect: number;
  label: string;
  /** Crests and seals carry detail a 1.125rem mark loses; they render taller. */
  tall?: boolean;
}

const LOGOS: Record<string, Logo> = {
  "South Pole": { file: "/logos/south-pole.svg", aspect: 29.5 / 28, label: "South Pole" },
  "Publicis Groupe": { file: "/logos/publicis.svg", aspect: 1306.22 / 1319.82, label: "Publicis Groupe" },
  "WPP, GroupM": { file: "/logos/wpp.svg", aspect: 170.1 / 51, label: "WPP" },
  "Museum of English Rural Life": { file: "/logos/merl.svg", aspect: 69.5 / 60, label: "Museum of English Rural Life" },
  "Data Science Festival": { file: "/logos/data-science-festival.svg", aspect: 99.36 / 36, label: "Data Science Festival" },
  Google: { file: "/logos/google.svg", aspect: 1, label: "Google" },
  "University of Strathclyde": { file: "/logos/strathclyde.png", aspect: 480 / 457, label: "University of Strathclyde", tall: true },
  "University of Mumbai": { file: "/logos/mumbai.svg", aspect: 235.5 / 237.75, label: "University of Mumbai", tall: true },
  "Shri Bhagubhai Mafatlal Polytechnic": { file: "/logos/sbmp.png", aspect: 366 / 359, label: "Shri Bhagubhai Mafatlal Polytechnic", tall: true },
};

/** The mark for an organisation string such as "Publicis Groupe, Digitas UK · London", or null. */
export function logoFor(text: string | null | undefined): Logo | null {
  if (!text) return null;
  for (const [key, logo] of Object.entries(LOGOS)) {
    if (text.startsWith(key)) return logo;
  }
  return null;
}
