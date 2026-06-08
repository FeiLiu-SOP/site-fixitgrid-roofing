// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { loadEnv } from "vite";
import { remarkStripRoutingMarkers } from "./src/remark-strip-routing-markers.mjs";
import { remarkStripInfraBriefDuplicates } from "./src/remark-strip-infra-brief-duplicates.mjs";
import { remarkStewardshipDetech } from "./src/remark-stewardship-detech.mjs";
import { resolvePublicSiteUrl } from "./resolve-public-site-url.mjs";
import {
  SEGMENT_BY_COLLECTION,
  augmentHubPathForMainSite,
  toAstroSiteAndBase,
} from "./hub-site-path.mjs";

const fallbackSite = "https://la-roofing-v1.pages.dev";

// 必须用「对象形式」导出 config，保证 `site` 在集成阶段已存在；
// 若用 defineConfig(({ mode }) => …) 回调，在 Astro 6 下 @astrojs/sitemap 可能读不到 site，导致不生成 *.xml，
// Cloudflare 再把不存在的 /sitemap-index.xml 回退成首页 HTML。
const mode = process.env.NODE_ENV === "production" ? "production" : "development";
const fileEnv = loadEnv(mode, process.cwd(), "");
const activeCollection =
  process.env.ACTIVE_COLLECTION ?? fileEnv.ACTIVE_COLLECTION ?? "roofing";
const disableAugment =
  process.env.PUBLIC_AUTO_SITEMAP_PATH ?? fileEnv.PUBLIC_AUTO_SITEMAP_PATH;
const fullSiteUrl = augmentHubPathForMainSite(
  resolvePublicSiteUrl({
    site: process.env.PUBLIC_SITE_URL ?? fileEnv.PUBLIC_SITE_URL,
    canonical: process.env.PUBLIC_CANONICAL_ORIGIN ?? fileEnv.PUBLIC_CANONICAL_ORIGIN,
    fallback: fallbackSite,
  }),
  activeCollection,
  disableAugment
);
const { site, base } = toAstroSiteAndBase(fullSiteUrl, activeCollection);
const normalizedCollection = String(activeCollection).toLowerCase().trim();
let enforcedBase = normalizedCollection === "plumbing-v2" ? "/plumbing/" : base;
/** Local/dev often resolves `site` to *.pages.dev → `base` "/" (`hub-site-path`). Hub URLs then break (e.g. /water-damage/ 404). Align with production segment. */
const hubSeg = SEGMENT_BY_COLLECTION[normalizedCollection];
if (hubSeg && enforcedBase === "/") {
  enforcedBase = normalizedCollection === "plumbing-v2" ? "/plumbing/" : `/${hubSeg}/`;
}

/** Dev：Rockwell 三垂直合一验收时 slug 前缀已互斥，强制根 base，避免锁在 /roofing/ 下打不开 plumbing/pest 路径 */
const rockwellHub =
  mode === "development" &&
  (process.env.DEV_ROCKWELL_HUB ?? fileEnv.DEV_ROCKWELL_HUB ?? "").trim() === "1" &&
  ["roofing", "plumbing", "pestcontrol"].includes(normalizedCollection);
if (rockwellHub) {
  enforcedBase = "/";
}

/** FixitGrid near-me pilot: pages at /near-me/florida/... on apex domain (no /roofing/ prefix). */
const fixitgridNearMe =
  (process.env.FIXITGRID_NEAR_ME ?? fileEnv.FIXITGRID_NEAR_ME ?? "").trim() === "1";
if (fixitgridNearMe) {
  enforcedBase = "/";
}

/** 教堂 stewardship 常拷到 `_stewardship_preview/<vertical>/` 用 http.server 验；`base` 为 `/` 时外链 `/_astro/*.css` 会打到站点根而 404。内联样式避免子路径预览丢 CSS。 */
const churchStewardship = normalizedCollection.startsWith("community-stewardship-");

// https://astro.build/config
export default defineConfig({
  site,
  base: enforcedBase,
  build: {
    inlineStylesheets: churchStewardship ? "always" : "auto",
  },
  vite: {
    server: {
      watch: {
        /** Dev-only: skip massive thumbnail trees when running multiple hub servers. */
        ignored: [
          "**/public/images/thumbnails/**",
          "**/public/images/thumbnails-legacy-v1/**",
          "**/public/images/brand-thumbnails/**",
        ],
      },
    },
  },
  integrations: [
    /** Church stewardship: GSC uses static apex sitemap only — do not emit *.pages.dev sitemap XML. */
    ...(churchStewardship
      ? []
      : [
          sitemap({
            /** SERP / crawl signal: uniform freshness date for all URLs (protocol 2026-05-11). */
            lastmod: new Date("2026-05-11T00:00:00.000Z"),
          }),
        ]),
  ],
  markdown: {
    remarkPlugins: [
      remarkStripRoutingMarkers,
      remarkStripInfraBriefDuplicates,
      remarkStewardshipDetech,
    ],
  },
});
