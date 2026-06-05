import type { ActiveCollectionKey } from "../active-collection";
import { isRockwellGscSerpSeedSlug } from "./rockwell-gsc-serp-seeds";

/** Pilot: 15 FixitGrid near-me detail pages (5 FL cities × 3 verticals). Church excluded. */
export type CommercialContactSeed = {
  collection: "roofing" | "plumbing" | "pestcontrol";
  /** Content entry slug (no .md, no near-me path). */
  entrySlug: string;
  city: string;
  stateCode: string;
};

export const COMMERCIAL_CONTACT_FAQ_SEEDS: readonly CommercialContactSeed[] = [
  { collection: "roofing", entrySlug: "weston-fl-roof-repair-33326", city: "Weston", stateCode: "FL" },
  { collection: "roofing", entrySlug: "boca-raton-fl-roof-repair-33496", city: "Boca Raton", stateCode: "FL" },
  { collection: "roofing", entrySlug: "davie-fl-roof-repair-33324", city: "Davie", stateCode: "FL" },
  { collection: "roofing", entrySlug: "coral-gables-fl-roof-repair-33146", city: "Coral Gables", stateCode: "FL" },
  { collection: "roofing", entrySlug: "jupiter-fl-roof-repair-33477", city: "Jupiter", stateCode: "FL" },
  { collection: "plumbing", entrySlug: "weston-fl-emergency-plumber-33326", city: "Weston", stateCode: "FL" },
  { collection: "plumbing", entrySlug: "boca-raton-fl-emergency-plumber-33496", city: "Boca Raton", stateCode: "FL" },
  { collection: "plumbing", entrySlug: "davie-fl-emergency-plumber-33324", city: "Davie", stateCode: "FL" },
  { collection: "plumbing", entrySlug: "doral-fl-emergency-plumber-33178", city: "Doral", stateCode: "FL" },
  { collection: "plumbing", entrySlug: "jupiter-fl-emergency-plumber-33477", city: "Jupiter", stateCode: "FL" },
  { collection: "pestcontrol", entrySlug: "weston-fl-pest-exterminator-33326", city: "Weston", stateCode: "FL" },
  { collection: "pestcontrol", entrySlug: "boca-raton-fl-pest-exterminator-33496", city: "Boca Raton", stateCode: "FL" },
  { collection: "pestcontrol", entrySlug: "davie-fl-pest-exterminator-33324", city: "Davie", stateCode: "FL" },
  { collection: "pestcontrol", entrySlug: "coral-gables-fl-pest-exterminator-33146", city: "Coral Gables", stateCode: "FL" },
  { collection: "pestcontrol", entrySlug: "parkland-fl-pest-exterminator-33076", city: "Parkland", stateCode: "FL" },
] as const;

const SEED_KEYS = new Set(
  COMMERCIAL_CONTACT_FAQ_SEEDS.map((s) => `${s.collection}|${s.entrySlug}`),
);

export function isCommercialContactFaqSeed(
  collection: ActiveCollectionKey | string,
  entrySlug: string,
): boolean {
  const slug = entrySlug.replace(/\.(md|mdx)$/i, "").trim();
  if (SEED_KEYS.has(`${collection}|${slug}`)) return true;
  return isRockwellGscSerpSeedSlug(slug, collection);
}
