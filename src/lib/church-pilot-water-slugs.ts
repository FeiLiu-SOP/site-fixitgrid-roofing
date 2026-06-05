/**
 * Church water pilot whitelist (30 cities). SSOT: scripts/church-pilot-30-water-slugs.txt
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SLUG_FILE = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../scripts/church-pilot-30-water-slugs.txt",
);

export function loadChurchPilotWaterSlugs(): string[] {
  const raw = fs.readFileSync(SLUG_FILE, "utf8");
  return raw
    .split(/\r?\n/)
    .map((line) => line.replace(/#.*$/, "").trim())
    .filter(Boolean);
}

export function slugToCityStateLabel(slug: string): string {
  const m = slug.match(/^community-stewardship-water-(.+)-([a-z]{2})-(\d{5})$/i);
  if (!m) return slug;
  const city = m[1]!
    .split("-")
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
  return `${city}, ${m[2]!.toUpperCase()} ${m[3]}`;
}

export function churchPilotWaterCanonicalUrl(slug: string): string {
  return `https://www.newtownbaptistfellowship.com/community-stewardship/water/${slug}/`;
}
