/**
 * FixitGrid FL pilot whitelist (10 cities × 3 verticals).
 * SSOT slugs: scripts/fixitgrid-pilot-slugs-{roofing,plumbing,pestcontrol}.txt
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ActiveCollectionKey } from "../active-collection";

const repoScripts = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../scripts",
);

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
  const file = path.join(repoScripts, `fixitgrid-pilot-slugs-${collection}.txt`);
  const raw = fs.readFileSync(file, "utf8");
  return raw
    .split(/\r?\n/)
    .map((line) => line.replace(/#.*$/, "").trim())
    .filter(Boolean);
}

export const FIXITGRID_PILOT_CITY_COUNT = 10;
