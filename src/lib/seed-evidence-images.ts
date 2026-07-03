import { getCanonicalBase } from "../site-config";
import manifestDoc from "../../data/seed-evidence-manifest.json";

export type SeedEvidenceStatus = "pending" | "generated" | "uploaded" | "live";

export type SeedEvidenceManifestEntry = {
  slug: string;
  collection: string;
  workflow: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lon: number;
  climate: string;
  alt: string;
  caption: string;
  status: SeedEvidenceStatus;
};

type ManifestDoc = {
  entries: SeedEvidenceManifestEntry[];
};

const ENTRIES = (manifestDoc as ManifestDoc).entries ?? [];
const BY_SLUG = new Map(ENTRIES.map((e) => [e.slug.trim(), e]));

/** Absolute URL for seed evidence JPEG (Worker R2: {segment}/images/evidence/{slug}.jpg). */
export function seedEvidencePhotoUrl(entrySlug: string): string {
  const slug = entrySlug.trim().replace(/\.(md|mdx)$/i, "");
  return `${getCanonicalBase()}/images/evidence/${slug}.jpg`;
}

export type SeedEvidencePhotoView = {
  url: string;
  alt: string;
  caption: string;
};

/** Only returns data when manifest status is `live` (image on R2). */
export function getSeedEvidencePhoto(entrySlug: string): SeedEvidencePhotoView | null {
  const slug = entrySlug.trim().replace(/\.(md|mdx)$/i, "");
  const row = BY_SLUG.get(slug);
  if (!row || row.status !== "live") return null;
  const alt = row.alt.trim();
  const caption = (row.caption ?? alt).trim();
  if (!alt) return null;
  return { url: seedEvidencePhotoUrl(slug), alt, caption };
}
