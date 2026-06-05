import type { ActiveCollectionKey } from "../active-collection";

/** File name prefix must match Go `FilePrefix` in nicheRegistry */
const FILE_PREFIX: Record<ActiveCollectionKey, string> = {
  roofing: "roofing-",
  plumbing: "plumbing-",
  pestcontrol: "pest-control-",
  "water-damage": "water-damage-",
  "siding-services": "siding-services-",
  "plumbing-v2": "plumbing-v2-",
  "community-stewardship-water": "community-stewardship-water-",
  "community-stewardship-siding": "community-stewardship-siding-",
  "community-stewardship-plumbing": "community-stewardship-plumbing-",
};

export type ParsedLocation = {
  city: string;
  state: string;
  zip: string;
};

export function getCollectionFilePrefix(collection: ActiveCollectionKey): string {
  return FILE_PREFIX[collection];
}

/**
 * Title format from generator: "... in City, ST (12345)"
 * Uses last ", ST (ZIP)" segment so multi-word cities parse correctly.
 */
export function parseLocationFromTitle(title: string): ParsedLocation | null {
  const m = title.match(/,\s*([A-Z]{2})\s*\((\d{5})\)\s*$/);
  if (!m) return null;
  const state = m[1];
  const zip = m[2];
  const before = title.slice(0, title.length - m[0].length);
  const inIdx = before.lastIndexOf(" in ");
  if (inIdx === -1) return null;
  const city = before.slice(inIdx + 4).trim();
  if (!city) return null;
  return { city, state, zip };
}

/**
 * Slug format: "{prefix}city-slug-st-12345" (state = 2 letters, zip = 5 digits)
 */
export function parseLocationFromSlug(
  slug: string,
  collection: ActiveCollectionKey,
): ParsedLocation | null {
  const prefix = FILE_PREFIX[collection];
  if (!slug.startsWith(prefix)) return null;
  const rest = slug.slice(prefix.length);
  const m = rest.match(/^(.+)-([a-z]{2})-(\d{5})$/i);
  if (!m) return null;
  const city = titleCaseFromSlug(m[1]);
  const state = m[2].toUpperCase();
  const zip = m[3];
  return { city, state, zip };
}

function titleCaseFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function resolvePageLocation(params: {
  collection: ActiveCollectionKey;
  title: string;
  slug: string;
  fmCity?: string | null;
  fmState?: string | null;
  fmZip?: string | null;
}): ParsedLocation | null {
  const c = params.fmCity?.trim();
  const s = params.fmState?.trim();
  const z = params.fmZip?.trim();
  if (c && s && z) {
    return {
      city: c,
      state: s.toUpperCase().slice(0, 2),
      zip: z.replace(/\D/g, "").slice(0, 5),
    };
  }
  const fromTitle = parseLocationFromTitle(params.title);
  if (fromTitle) return fromTitle;
  return parseLocationFromSlug(params.slug, params.collection);
}
