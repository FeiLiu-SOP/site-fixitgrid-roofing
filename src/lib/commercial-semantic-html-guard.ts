/**
 * Aligned with scripts/forbidden-phrases.ci.generated.json commercial forbidden_phrases (sync after npm run audit:config).
 * Strip cross-vertical substrings in SSR pools that would fail semantic-scan.py.
 */
import type { ActiveCollectionKey } from "../active-collection-keys";

/** Matches semantic_scan_lib: spaced phrases as substring; else word boundary (avoids Apex→PEX, residing→siding false positives). */
function forbiddenPhraseMatchesLowerText(lower: string, phrase: string): boolean {
  const needle = phrase.trim().toLowerCase();
  if (!needle) return false;
  if (/\s/.test(needle)) return lower.includes(needle);
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`).test(lower);
}

const COMMERCIAL_FORBIDDEN: Partial<Record<ActiveCollectionKey, readonly string[]>> = {
  roofing: [
    "structural drying",
    "dehumidifier chamber",
    "bed bug",
    "termite",
    "hydro-jetting",
    "slab leak listening",
    "sump discharge head",
    "plumber",
    "PEX",
    "drain line",
    "water heater",
    "termite trail",
    "rodent gnaw",
    "perimeter exclusion",
    "psychrometric",
    "moisture mapping",
    "repiping",
    "cleanout",
    "backflow",
  ],
  plumbing: [
    "structural drying",
    "bed bug",
    "termite trail",
    "shingle seal-down",
    "ice-dam backup",
    "rodent gnaw paths",
    "roofing",
    "ice dam",
    "ridge vent",
    "roof deck",
    "rodent gnaw",
    "perimeter exclusion",
    "psychrometric",
    "moisture mapping",
    "dehumidifier chamber",
    "siding",
    "J-channel",
    "housewrap",
    "fiber-cement",
    "kickout flash",
  ],
  pestcontrol: [
    "structural drying",
    "pipe corrosion",
    "leak detection",
    "shingle replacement",
    "hydro-jetting envelope",
    "dehumidifier reheat",
    "roofing",
    "shingle seal-down",
    "ice dam",
    "ridge vent",
    "roof deck",
    "plumber",
    "PEX",
    "hydro-jetting",
    "drain line",
    "water heater",
    "psychrometric",
    "moisture mapping",
    "dehumidifier chamber",
    "siding",
    "J-channel",
    "housewrap",
    "fiber-cement",
    "kickout flash",
    "repiping",
    "cleanout",
    "backflow",
  ],
  "water-damage": [
    "bed bug aggregation",
    "termite shelter tubes",
    "shingle seal-down timing",
    "hydro-jetter nozzle envelope",
    "roofing",
    "shingle seal-down",
    "ice dam",
    "ridge vent",
    "roof deck",
    "plumber",
    "PEX",
    "hydro-jetting",
    "drain line",
    "water heater",
    "bed bug",
    "termite trail",
    "rodent gnaw",
    "perimeter exclusion",
    "siding",
    "J-channel",
    "housewrap",
    "fiber-cement",
    "kickout flash",
    "repiping",
    "cleanout",
    "backflow",
  ],
  "siding-services": [
    "slab leak listening window",
    "camera pass friction on offset closet bends",
    "bed bug",
    "structural drying chamber",
    "plumber",
    "PEX",
    "hydro-jetting",
    "drain line",
    "water heater",
    "termite trail",
    "rodent gnaw",
    "perimeter exclusion",
    "structural drying",
    "psychrometric",
    "moisture mapping",
    "dehumidifier chamber",
    "repiping",
    "cleanout",
    "backflow",
  ],
  "plumbing-v2": [
    "termite shelter tubes",
    "rodent gnaw paths",
    "structural drying",
    "psychrometric ramp",
    "roofing",
    "shingle seal-down",
    "ice dam",
    "ridge vent",
    "roof deck",
    "bed bug",
    "termite trail",
    "rodent gnaw",
    "perimeter exclusion",
    "psychrometric",
    "moisture mapping",
    "dehumidifier chamber",
    "siding",
    "J-channel",
    "housewrap",
    "fiber-cement",
    "kickout flash",
  ],
};

/** Forbidden list (semantic-scan rules). Church vertical excluded. */
export function forbiddenSubstringsForCommercialScan(collectionKey: string): readonly string[] {
  if (collectionKey.startsWith("community-stewardship-")) return [];
  const row = COMMERCIAL_FORBIDDEN[collectionKey as ActiveCollectionKey];
  return row ?? [];
}

export function filterTextPoolForCommercialHtml<T extends string>(collectionKey: string, pool: readonly T[]): T[] {
  const needles = forbiddenSubstringsForCommercialScan(collectionKey);
  if (!needles.length) return [...pool];
  return pool.filter((line) => {
    const low = line.toLowerCase();
    return !needles.some((n) => {
      const t = n.trim();
      return t && forbiddenPhraseMatchesLowerText(low, t);
    });
  });
}
