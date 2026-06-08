#!/usr/bin/env node
/**
 * After FixitGrid vertical `astro build`: fix sitemap-index shard locs to /{segment}/sitemap-N.xml.
 * Uses ACTIVE_COLLECTION (roofing|plumbing|pestcontrol). Page URLs in sitemap-0 stay apex /near-me/...
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const APEX = "https://fixitgrid.com";
const segment = (process.env.ACTIVE_COLLECTION ?? process.argv[2] ?? "").trim().toLowerCase();
const allowed = new Set(["roofing", "plumbing", "pestcontrol"]);

if (!allowed.has(segment)) {
  console.error("[patch-fixitgrid-sitemap-index] ACTIVE_COLLECTION must be roofing|plumbing|pestcontrol");
  process.exit(1);
}

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const indexPath = join(dist, "sitemap-index.xml");
if (!existsSync(indexPath)) {
  console.warn(`[patch-fixitgrid-sitemap-index] skip — no ${indexPath}`);
  process.exit(0);
}

const before = readFileSync(indexPath, "utf8");
const after = before.replace(
  new RegExp(`${APEX.replace(/\./g, "\\.")}/sitemap-`, "g"),
  `${APEX}/${segment}/sitemap-`,
);

if (after !== before) {
  writeFileSync(indexPath, after, "utf8");
  console.log(`[patch-fixitgrid-sitemap-index] ${segment}: patched sitemap-index.xml`);
}
