import type { ActiveCollectionKey } from "../active-collection";

const STEWARDSHIP_KEYS = new Set<ActiveCollectionKey>([
  "community-stewardship-water",
  "community-stewardship-siding",
  "community-stewardship-plumbing",
]);

export function isStewardshipCollection(
  collection: ActiveCollectionKey | string | null | undefined,
): boolean {
  return STEWARDSHIP_KEYS.has(collection as ActiveCollectionKey);
}

/** NPO operator line on stewardship legal pages (no commercial dispatch branding). */
export const STEWERSHIP_LEGAL_OPERATOR =
  "Newtown Baptist Fellowship — Community Stewardship (informational outreach)";

/** Display brand for stewardship HTML (avoids FixitGrid on church builds). */
export const STEWERSHIP_BRAND_NAME = "Newtown Baptist Fellowship — Community Stewardship";
export const STEWERSHIP_BRAND_SHORT = "Newtown Fellowship";
