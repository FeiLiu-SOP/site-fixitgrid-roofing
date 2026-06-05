import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { loadFixitgridPilotSlugs } from "./lib/fixitgrid-pilot";
import { rockwellGscSerpSeedSlugs } from "./lib/rockwell-gsc-serp-seeds";

const contentConfigDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * On astro dev, large collections may sit on [content] Clearing content store
 * with no logs while scanning; use DEV_FAST_CONTENT=1 for one sample per collection for fast boot.
 * Do not set DEV_FAST_CONTENT in production builds.
 */
function devContentGlob(fullPattern: string, sampleFile: string): string {
  if (process.env.NODE_ENV === "production") return fullPattern;
  const v = (process.env.DEV_FAST_CONTENT ?? process.env.ASTRO_DEV_FAST_CONTENT ?? "").trim().toLowerCase();
  const fast = v === "1" || v === "true" || v === "yes";
  return fast ? sampleFile : fullPattern;
}

/** Pilot: STEWARDSHIP_BUILD_LIMIT=N caps city MD count when env is set (any build env). */
function stewardshipBuildGlob(
  fullPattern: string,
  sampleFile: string,
  contentSubdir: string,
): string {
  const limitRaw = (process.env.STEWARDSHIP_BUILD_LIMIT ?? "").trim();
  const limit = limitRaw ? parseInt(limitRaw, 10) : 0;
  if (!limit || limit < 1) {
    return devContentGlob(fullPattern, sampleFile);
  }
  const baseDir = path.join(contentConfigDir, "content", contentSubdir);
  const names = fs
    .readdirSync(baseDir)
    .filter((n) => /\.(md|mdx)$/i.test(n))
    .sort()
    .slice(0, limit)
    .map((n) => n.replace(/\.(md|mdx)$/i, ""));
  if (names.length === 0) {
    throw new Error(`[content.config] STEWARDSHIP_BUILD_LIMIT: no markdown under ${contentSubdir}`);
  }
  console.log(`[content.config] STEWARDSHIP_BUILD_LIMIT=${limit} → ${names.length} file(s) in ${contentSubdir}`);
  return `{${names.join(",")}}.{md,mdx}`;
}

/** FixitGrid pilot: whitelist slugs from scripts/fixitgrid-pilot-slugs-*.txt */
function fixitgridPilotBuildGlob(
  fullPattern: string,
  sampleFile: string,
  collection: "roofing" | "plumbing" | "pestcontrol",
): string {
  const pilot = (process.env.FIXITGRID_PILOT_BUILD ?? "").trim() === "1";
  if (pilot) {
    const slugs = loadFixitgridPilotSlugs(collection);
    if (slugs.length === 0) {
      throw new Error(`[content.config] FIXITGRID_PILOT_BUILD: no slugs for ${collection}`);
    }
    console.log(
      `[content.config] FIXITGRID_PILOT_BUILD=1 → ${slugs.length} slug(s) in ${collection}`,
    );
    return `{${slugs.join(",")}}.{md,mdx}`;
  }

  const rockwellSeed = (process.env.ROCKWELL_SERP_SEED_BUILD ?? "").trim() === "1";
  if (rockwellSeed) {
    const slugs = rockwellGscSerpSeedSlugs(collection);
    console.log(
      `[content.config] ROCKWELL_SERP_SEED_BUILD=1 → ${slugs.length} slug(s) in ${collection}`,
    );
    return `{${slugs.join(",")}}.{md,mdx}`;
  }

  return devContentGlob(fullPattern, sampleFile);
}

const collectionSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date().optional(),
  updatedDate: z.coerce.date().optional(),
  heroImage: z.string().optional(),
  /** Optional: LocalBusiness areaServed; else parse from title/filename */
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  templateVersion: z.string().optional(),
  /** Optional: geo brief display field from Go generator */
  county: z.string().optional(),
  elevationFt: z.number().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  zipSample: z.array(z.string()).optional(),
  zipCodes: z.array(z.string()).optional(),
  localPaths: z.array(z.string()).optional(),
  /** Optional: Zillow-style median USD for title/meta anchor; else template A falls back to B/C */
  zillowHomeValueUsd: z.number().optional(),
  /** Optional: data confidence; estimated = state/national orphan backfill */
  data_fidelity: z.enum(["estimated", "synthetic"]).optional(),
  /** FixitGrid pilot: render LocalInfrastructureBrief + strip duplicate body paragraphs */
  infraBriefPanel: z.boolean().optional(),
});

const roofing = defineCollection({
  loader: glob({
    pattern: fixitgridPilotBuildGlob(
      "**/*.{md,mdx}",
      "roofing-zion-il-60099.md",
      "roofing",
    ),
    base: "./src/content/roofing",
  }),
  schema: collectionSchema,
});

const plumbing = defineCollection({
  loader: glob({
    pattern: fixitgridPilotBuildGlob(
      "**/*.{md,mdx}",
      "{plumbing-columbus-oh-43109,plumbing-reynoldsburg-oh-43068}.{md,mdx}",
      "plumbing",
    ),
    base: "./src/content/plumbing",
  }),
  schema: collectionSchema,
});

const pestcontrol = defineCollection({
  loader: glob({
    pattern: fixitgridPilotBuildGlob(
      "**/*.{md,mdx}",
      "pest-control-zion-il-60099.md",
      "pestcontrol",
    ),
    base: "./src/content/pestcontrol",
  }),
  schema: collectionSchema,
});

const waterDamage = defineCollection({
  loader: glob({
    pattern: devContentGlob("**/*.{md,mdx}", "water-damage-zion-pa-16823.md"),
    base: "./src/content/water-damage",
  }),
  schema: collectionSchema,
});

const sidingServices = defineCollection({
  loader: glob({
    pattern: devContentGlob("**/*.{md,mdx}", "siding-services-zion-pa-16823.md"),
    base: "./src/content/siding-services",
  }),
  schema: collectionSchema,
});

const plumbingV2 = defineCollection({
  loader: glob({
    pattern: devContentGlob("**/*.{md,mdx}", "plumbing-v2-zion-pa-16823.md"),
    base: "./src/content/plumbing-v2",
  }),
  schema: collectionSchema,
});

const communityStewardshipWater = defineCollection({
  loader: glob({
    /** Fast mode twin-city samples must be in stewardship-curated-uscities.csv top 500 medians */
    pattern: stewardshipBuildGlob(
      "**/*.{md,mdx}",
      "community-stewardship-water-{palo-alto-ca-94028,newport-beach-ca-92662}.md",
      "community-stewardship-water",
    ),
    base: "./src/content/community-stewardship-water",
  }),
  schema: collectionSchema,
});

const communityStewardshipSiding = defineCollection({
  loader: glob({
    pattern: stewardshipBuildGlob(
      "**/*.{md,mdx}",
      "community-stewardship-siding-{palo-alto-ca-94028,newport-beach-ca-92662}.md",
      "community-stewardship-siding",
    ),
    base: "./src/content/community-stewardship-siding",
  }),
  schema: collectionSchema,
});

const communityStewardshipPlumbing = defineCollection({
  loader: glob({
    pattern: stewardshipBuildGlob(
      "**/*.{md,mdx}",
      "community-stewardship-plumbing-{palo-alto-ca-94028,newport-beach-ca-92662}.md",
      "community-stewardship-plumbing",
    ),
    base: "./src/content/community-stewardship-plumbing",
  }),
  schema: collectionSchema,
});

/** New vertical: add defineCollection + src/content/<niche>/ and extend ALLOWED in active-collection.ts */
export const collections = {
  roofing,
  plumbing,
  pestcontrol,
  "water-damage": waterDamage,
  "siding-services": sidingServices,
  "plumbing-v2": plumbingV2,
  "community-stewardship-water": communityStewardshipWater,
  "community-stewardship-siding": communityStewardshipSiding,
  "community-stewardship-plumbing": communityStewardshipPlumbing,
};
