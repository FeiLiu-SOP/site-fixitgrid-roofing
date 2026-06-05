/**
 * Dev-only: register three community-stewardship collections in one dev server.
 * Separate .ts file: getStaticPaths is isolated chunk; inline on page is out of scope.
 */
import { ACTIVE_COLLECTION, type ActiveCollectionKey } from "../active-collection";

export const STEWARDSHIP_HUB_KEYS: readonly ActiveCollectionKey[] = [
  "community-stewardship-water",
  "community-stewardship-siding",
  "community-stewardship-plumbing",
];

export function stewardshipDevHubMergeEnabled(): boolean {
  const hub = (process.env.DEV_COMMUNITY_STEWARDSHIP_HUB ?? "").trim() === "1";
  if (!hub || !import.meta.env.DEV) return false;
  return (STEWARDSHIP_HUB_KEYS as readonly string[]).includes(ACTIVE_COLLECTION);
}
