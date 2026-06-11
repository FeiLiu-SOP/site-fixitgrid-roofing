#!/usr/bin/env node
/**
 * After FixitGrid vertical `astro build`: fix sitemap-index shard locs to /{segment}/sitemap-N.xml.
 * Uses ACTIVE_COLLECTION (roofing|plumbing|pestcontrol). Page URLs in sitemap-0 stay apex /near-me/...
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const APEX = "https://fixitgrid.com";
const allowed = new Set(["roofing", "plumbing", "pestcontrol"]);

function resolveSegment() {
  const fromEnv = (process.env.ACTIVE_COLLECTION ?? "").trim().toLowerCase();
  if (allowed.has(fromEnv)) return fromEnv;
  const fromArg = (process.argv[2] ?? "").trim().toLowerCase();
  if (allowed.has(fromArg)) return fromArg;
  const pkg = (process.env.npm_package_name ?? "").trim().toLowerCase();
  const m = pkg.match(/fixitgrid-(roofing|plumbing|pestcontrol)/);
  if (m && allowed.has(m[1])) return m[1];
  return "";
}

const segment = resolveSegment();

if (!allowed.has(segment)) {
  console.error(
    "[patch-fixitgrid-sitemap-index] need ACTIVE_COLLECTION, CLI arg, or npm_package_name fixitgrid-{vertical}",
  );
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
