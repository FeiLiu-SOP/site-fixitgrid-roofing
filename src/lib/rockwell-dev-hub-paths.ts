/**
 * Dev-only: register Rockwell roofing/plumbing/pestcontrol paths in one astro dev process.
 * Avoid parallel ACTIVE_COLLECTION dev servers writing .astro/ (EPERM).
 * Must live in separate file: getStaticPaths is split into chunks.
 */
import { ACTIVE_COLLECTION, type ActiveCollectionKey } from "../active-collection";

export const ROCKWELL_HUB_KEYS: readonly ActiveCollectionKey[] = ["roofing", "plumbing", "pestcontrol"];

export function rockwellDevHubMergeEnabled(): boolean {
  const hub = (process.env.DEV_ROCKWELL_HUB ?? "").trim() === "1";
  if (!hub || !import.meta.env.DEV) return false;
  return (ROCKWELL_HUB_KEYS as readonly string[]).includes(ACTIVE_COLLECTION);
}
