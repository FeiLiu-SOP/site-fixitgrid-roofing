/**
 * Data-only: no import.meta or process side effects; safe for Node/tsx audit imports.
 * Must stay aligned with content.config.ts, Go nicheRegistry, and active-collection.ts.
 */
export const ACTIVE_COLLECTION_KEYS = [
  "roofing",
  "plumbing",
  "pestcontrol",
  "water-damage",
  "siding-services",
  "plumbing-v2",
  "community-stewardship-water",
  "community-stewardship-siding",
  "community-stewardship-plumbing",
] as const;

export type ActiveCollectionKey = (typeof ACTIVE_COLLECTION_KEYS)[number];
