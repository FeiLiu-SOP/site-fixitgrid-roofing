import type { ActiveCollectionKey } from "../active-collection";
import bulkDoc from "../../data/bulk-write-protected-slugs.json";

/** SSOT: data/bulk-write-protected-slugs.json — all domains / collections. */
export const BULK_WRITE_PROTECTED_BY_COLLECTION = bulkDoc.collections as Record<
  string,
  readonly string[]
>;

export function isBulkWriteProtectedSlug(
  entrySlug: string,
  collection: ActiveCollectionKey | string,
): boolean {
  const slug = entrySlug.replace(/\.(md|mdx)$/i, "").trim();
  const list = BULK_WRITE_PROTECTED_BY_COLLECTION[collection];
  if (!list) return false;
  return list.includes(slug);
}

export function bulkWriteProtectedSlugs(collection: string): readonly string[] {
  return BULK_WRITE_PROTECTED_BY_COLLECTION[collection] ?? [];
}
