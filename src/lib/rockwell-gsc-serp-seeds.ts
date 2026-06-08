import type { ActiveCollectionKey } from "../active-collection";
import { getPlumbingSerpOverride } from "./plumbing-serp-overrides";
import { getPestcontrolSerpOverride } from "./pestcontrol-serp-overrides";
import { getRoofingSerpOverride } from "./roofing-serp-overrides";
import bulkDoc from "../../../data/bulk-write-protected-slugs.json";

/**
 * Rockwell GSC SERP seed slugs (15) — subset of data/bulk-write-protected-slugs.json
 * docs/Rockwell-GSC细粒度SERP覆盖页面清单.md
 */
export const ROCKWELL_GSC_SERP_SEEDS = bulkDoc.sources.rockwellGscSerp.collections as {
  plumbing: readonly string[];
  pestcontrol: readonly string[];
  roofing: readonly string[];
};

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
