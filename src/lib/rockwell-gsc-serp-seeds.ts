import type { ActiveCollectionKey } from "../active-collection";
import { getPlumbingSerpOverride } from "./plumbing-serp-overrides";
import { getPestcontrolSerpOverride } from "./pestcontrol-serp-overrides";
import { getRoofingSerpOverride } from "./roofing-serp-overrides";

/**
 * Rockwell GSC SERP seed slugs (15) — SSOT aligned with:
 * - docs/Rockwell-GSC细粒度SERP覆盖页面清单.md
 * - *-serp-overrides.ts RAW keys
 */
export const ROCKWELL_GSC_SERP_SEEDS = {
  plumbing: [
    "plumbing-columbus-oh-43109",
    "plumbing-reynoldsburg-oh-43068",
  ],
  pestcontrol: [
    "pest-control-temescal-valley-ca-92883",
    "pest-control-coral-terrace-fl-33144",
    "pest-control-moreno-valley-ca-92551",
    "pest-control-flowing-wells-az-85705",
    "pest-control-casa-de-oro-mount-helix-ca-91977",
    "pest-control-the-acreage-fl-33411",
    "pest-control-gladeview-fl-33147",
  ],
  roofing: [
    "roofing-carlsbad-ca-92008",
    "roofing-willowbrook-ca-90059",
    "roofing-lochearn-md-21208",
    "roofing-white-center-wa-98106",
    "roofing-fullerton-pa-18052",
    "roofing-temescal-valley-ca-92883",
  ],
} as const satisfies Record<"plumbing" | "pestcontrol" | "roofing", readonly string[]>;

export type RockwellGscSerpSeedCollection = keyof typeof ROCKWELL_GSC_SERP_SEEDS;

export function rockwellGscSerpSeedSlugs(
  collection: RockwellGscSerpSeedCollection,
): readonly string[] {
  return ROCKWELL_GSC_SERP_SEEDS[collection];
}

export function isRockwellGscSerpSeedSlug(
  entrySlug: string,
  collection: ActiveCollectionKey | string,
): boolean {
  const slug = entrySlug.replace(/\.(md|mdx)$/i, "").trim();
  const key = collection as RockwellGscSerpSeedCollection;
  const list = ROCKWELL_GSC_SERP_SEEDS[key as keyof typeof ROCKWELL_GSC_SERP_SEEDS];
  if (!list) return false;
  return (list as readonly string[]).includes(slug);
}

/** Dev/build guard: list keys must match serp override modules. */
export function assertRockwellGscSerpSeedsMatchOverrides(): void {
  for (const slug of ROCKWELL_GSC_SERP_SEEDS.plumbing) {
    if (!getPlumbingSerpOverride(slug)) {
      throw new Error(`[rockwell-gsc-serp-seeds] plumbing slug missing override: ${slug}`);
    }
  }
  for (const slug of ROCKWELL_GSC_SERP_SEEDS.pestcontrol) {
    if (!getPestcontrolSerpOverride(slug)) {
      throw new Error(`[rockwell-gsc-serp-seeds] pestcontrol slug missing override: ${slug}`);
    }
  }
  for (const slug of ROCKWELL_GSC_SERP_SEEDS.roofing) {
    if (!getRoofingSerpOverride(slug)) {
      throw new Error(`[rockwell-gsc-serp-seeds] roofing slug missing override: ${slug}`);
    }
  }
}

assertRockwellGscSerpSeedsMatchOverrides();
