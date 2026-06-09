/**
 * FixitGrid FL pilot whitelist (10 cities × 3 verticals).
 * SSOT slugs: scripts/fixitgrid-pilot-slugs-{roofing,plumbing,pestcontrol}.txt
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ActiveCollectionKey } from "../active-collection";

/** Repo-local `scripts/` (FixitGrid child sites) or monorepo root `scripts/` (absent-apogee dev). */
function resolveRepoScriptsDir(): string {
  const libDir = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.resolve(libDir, "../../scripts"),
    path.resolve(libDir, "../../../scripts"),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  return candidates[0]!;
}

const PILOT_COLLECTIONS = new Set<ActiveCollectionKey>([
  "roofing",
  "plumbing",
  "pestcontrol",
]);

export function isFixitgridPilotCollection(
  collection: ActiveCollectionKey,
): boolean {
  return PILOT_COLLECTIONS.has(collection);
}

export function loadFixitgridPilotSlugs(
  collection: ActiveCollectionKey,
): string[] {
  if (!isFixitgridPilotCollection(collection)) return [];
  const file = path.join(resolveRepoScriptsDir(), `fixitgrid-pilot-slugs-${collection}.txt`);
  if (!fs.existsSync(file)) {
    throw new Error(
      `[fixitgrid-pilot] Missing ${file} (required when FIXITGRID_PILOT_BUILD=1; copy from monorepo scripts/ or unset FIXITGRID_PILOT_BUILD on Cloudflare Pages)`,
    );
  }
  const raw = fs.readFileSync(file, "utf8");
  return raw
    .split(/\r?\n/)
    .map((line) => line.replace(/#.*$/, "").trim())
    .filter(Boolean);
}

export const FIXITGRID_PILOT_CITY_COUNT = 10;
