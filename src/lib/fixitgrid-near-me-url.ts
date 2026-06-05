/**
 * FixitGrid near-me URL schema (2026 flagship).
 * https://fixitgrid.com/near-me/florida/weston-fl-roof-repair-33326/
 */
import type { ActiveCollectionKey } from "../active-collection";

export const FIXITGRID_NEAR_ME_PREFIX = "near-me";

/** Intent keyword in slug (not repeated in path prefix). */
export const NEAR_ME_INTENT_BY_COLLECTION: Record<
  "roofing" | "plumbing" | "pestcontrol",
  string
> = {
  roofing: "roof-repair",
  plumbing: "emergency-plumber",
  pestcontrol: "pest-exterminator",
};

const STATE_SLUG: Record<string, string> = {
  AL: "alabama",
  AK: "alaska",
  AZ: "arizona",
  AR: "arkansas",
  CA: "california",
  CO: "colorado",
  CT: "connecticut",
  DE: "delaware",
  FL: "florida",
  GA: "georgia",
  HI: "hawaii",
  ID: "idaho",
  IL: "illinois",
  IN: "indiana",
  IA: "iowa",
  KS: "kansas",
  KY: "kentucky",
  LA: "louisiana",
  ME: "maine",
  MD: "maryland",
  MA: "massachusetts",
  MI: "michigan",
  MN: "minnesota",
  MS: "mississippi",
  MO: "missouri",
  MT: "montana",
  NE: "nebraska",
  NV: "nevada",
  NH: "new-hampshire",
  NJ: "new-jersey",
  NM: "new-mexico",
  NY: "new-york",
  NC: "north-carolina",
  ND: "north-dakota",
  OH: "ohio",
  OK: "oklahoma",
  OR: "oregon",
  PA: "pennsylvania",
  RI: "rhode-island",
  SC: "south-carolina",
  SD: "south-dakota",
  TN: "tennessee",
  TX: "texas",
  UT: "utah",
  VT: "vermont",
  VA: "virginia",
  WA: "washington",
  WV: "west-virginia",
  WI: "wisconsin",
  WY: "wyoming",
  DC: "district-of-columbia",
};

export function isFixitgridNearMeBuild(): boolean {
  return (process.env.FIXITGRID_NEAR_ME ?? "").trim() === "1";
}

export function stateSlugFromAbbr(stateAbbr: string | undefined): string {
  const abbr = (stateAbbr ?? "FL").trim().toUpperCase();
  return STATE_SLUG[abbr] ?? abbr.toLowerCase();
}

export function nearMePageSlug(
  citySlug: string,
  stateAbbr: string,
  collection: "roofing" | "plumbing" | "pestcontrol",
  zip: string,
): string {
  const intent = NEAR_ME_INTENT_BY_COLLECTION[collection];
  const zip5 = String(zip).replace(/\D/g, "").slice(0, 5);
  const st = stateAbbr.trim().toLowerCase();
  return `${citySlug}-${st}-${intent}-${zip5}`;
}

/** Path segments after origin (no leading slash): near-me, florida, weston-fl-roof-repair-33326 */
export function nearMePathSegments(
  entrySlug: string,
  stateAbbr?: string,
): string[] {
  const state = stateSlugFromAbbr(stateAbbr);
  return [FIXITGRID_NEAR_ME_PREFIX, state, entrySlug.replace(/\.(md|mdx)$/i, "")];
}

/** Public URL path segments (for canonical + static paths). */
export function entryPublicPathSegments(
  entrySlug: string,
  stateAbbr?: string,
): string[] {
  if (isFixitgridNearMeBuild()) {
    return nearMePathSegments(entrySlug, stateAbbr);
  }
  return [entrySlug.replace(/\.(md|mdx)$/i, "")];
}

export function resolveContentEntrySlug(slugParam: string): string {
  const cleaned = (slugParam ?? "").replace(/\.(md|mdx)$/i, "").replace(/\/+$/, "");
  if (isFixitgridNearMeBuild() && cleaned.includes("/")) {
    const parts = cleaned.split("/").filter(Boolean);
    return parts[parts.length - 1] ?? cleaned;
  }
  return cleaned;
}

export function isNearMeEntrySlug(slug: string): boolean {
  const s = slug.toLowerCase();
  return (
    s.includes("-roof-repair-") ||
    s.includes("-emergency-plumber-") ||
    s.includes("-pest-exterminator-")
  );
}

function titleCaseCity(citySlug: string): string | null {
  const city = citySlug.split("-").filter(Boolean).join(" ").trim();
  return city ? city.replace(/\b\w/g, (c) => c.toUpperCase()) : null;
}

/** Parse city name from near-me slug when frontmatter city is absent. */
export function cityFromNearMeSlug(slug: string): string | null {
  const intents = Object.values(NEAR_ME_INTENT_BY_COLLECTION);
  for (const intent of intents) {
    const withState = new RegExp(`^(.+)-([a-z]{2})-${intent}-(\\d{5})$`, "i");
    const mState = slug.match(withState);
    if (mState) return titleCaseCity(mState[1]!);

    const legacy = new RegExp(`^(.+)-${intent}-(\\d{5})$`, "i");
    const mLegacy = slug.match(legacy);
    if (mLegacy) return titleCaseCity(mLegacy[1]!);
  }
  return null;
}

export function stateAbbrFromNearMeSlug(slug: string): string | null {
  const intents = Object.values(NEAR_ME_INTENT_BY_COLLECTION);
  for (const intent of intents) {
    const re = new RegExp(`^(.+)-([a-z]{2})-${intent}-(\\d{5})$`, "i");
    const m = slug.match(re);
    if (m) return m[2]!.toUpperCase();
  }
  return null;
}

export function zipFromNearMeSlug(slug: string): string | null {
  const m = slug.match(/-(\d{5})$/);
  return m ? m[1]! : null;
}

export function collectionForNearMeSlug(
  slug: string,
): "roofing" | "plumbing" | "pestcontrol" | null {
  if (slug.includes("-roof-repair-")) return "roofing";
  if (slug.includes("-emergency-plumber-")) return "plumbing";
  if (slug.includes("-pest-exterminator-")) return "pestcontrol";
  return null;
}

export function isFixitgridPilotCollection(
  collection: ActiveCollectionKey,
): boolean {
  return collection === "roofing" || collection === "plumbing" || collection === "pestcontrol";
}
