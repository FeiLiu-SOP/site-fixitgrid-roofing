/**
 * Pre-build gate: every plumbing city page must have a SERP title ≤55 chars (full words).
 * Run: npm run check:plumbing-titles
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, "..", "src", "content", "plumbing");

function titleCase(s) {
  return s
    .split(/\s+/g)
    .filter(Boolean)
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(" ");
}

function cityFromSlug(slug) {
  const m = slug.match(/^(.*)-([a-z]{2})-(\d{5})$/i);
  if (!m) return null;
  let prefixAndCity = m[1];
  const pfx = "plumbing-";
  if (prefixAndCity.toLowerCase().startsWith(pfx)) {
    prefixAndCity = prefixAndCity.slice(pfx.length);
  }
  const city = prefixAndCity.split("-").filter(Boolean).join(" ").trim();
  return city ? titleCase(city) : null;
}

function parseZillow(md) {
  const m = md.match(/^zillowHomeValueUsd:\s*(\d+(?:\.\d+)?)\s*$/m);
  return m ? Number(m[1]) : null;
}

function formatZillowUsdShort(usd) {
  if (!Number.isFinite(usd) || usd <= 0) return "";
  if (usd >= 1_000_000) {
    const m = usd / 1_000_000;
    const s =
      m >= 10
        ? String(Math.round(m))
        : String(Math.round(m * 100) / 100).replace(/\.?0+$/, "");
    return `$${s}M`;
  }
  const k = usd / 1000;
  if (k < 10) return `$${Math.round(usd).toLocaleString("en-US")}`;
  const roundedK = Math.round(k * 10) / 10;
  const sk = Number.isInteger(roundedK) ? String(roundedK) : roundedK.toFixed(1).replace(/\.0$/, "");
  return `$${sk}K`;
}

const libUrl = pathToFileURL(path.join(__dirname, "..", "src", "lib", "plumbing-serp-title.ts")).href;
const { buildPlumbingPageTitle, PLUMBING_TITLE_MAX } = await import(libUrl);

const HIGH = 300_000;
const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".md"));
let failures = 0;

for (const file of files) {
  const slug = file.replace(/\.md$/i, "");
  const city = cityFromSlug(slug);
  if (!city) continue;
  const m = slug.match(/-([a-z]{2})-\d{5}$/i);
  const stateCode = m ? m[1].toUpperCase() : "US";
  const md = fs.readFileSync(path.join(contentDir, file), "utf8");
  const zUsd = parseZillow(md);
  const zLabel = zUsd != null ? formatZillowUsdShort(zUsd) : null;
  const zLabelExact =
    zUsd != null
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(zUsd)
      : null;
  const highValue = zUsd != null && zUsd >= HIGH;
  try {
    const title = buildPlumbingPageTitle({
      city,
      zLabel,
      zLabelExact,
      highValue,
      slug,
    });
    if (title.length > PLUMBING_TITLE_MAX) {
      console.warn(`[plumbing-title] Title Truncated: ${title.length}>${PLUMBING_TITLE_MAX} slug=${slug}`);
      failures++;
    }
  } catch (err) {
    console.warn(String(err));
    failures++;
  }
}

if (failures > 0) {
  console.error(`[check-plumbing-serp-titles] ${failures} page(s) failed SERP title gate.`);
  process.exit(1);
}
console.log(`[check-plumbing-serp-titles] OK — ${files.length} files scanned, all titles ≤${PLUMBING_TITLE_MAX} chars.`);
