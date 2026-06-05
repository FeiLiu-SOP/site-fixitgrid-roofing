import { getCanonicalBase } from "../site-config";

/**
 * Absolute og:image URL for city detail pages.
 * Must match Worker R2 key: {segment}/images/thumbnails/{slug}.jpg
 * `getCanonicalBase()` already includes the hub segment (e.g. …/pestcontrol).
 */
export function ogThumbnailUrl(entrySlug: string): string {
  const slug = entrySlug.trim().replace(/\.(md|mdx)$/i, "");
  return `${getCanonicalBase()}/images/thumbnails/${slug}.jpg`;
}
