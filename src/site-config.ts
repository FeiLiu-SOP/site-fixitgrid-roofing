/**
 * 站点「配置中心」：从构建时环境变量读取，换类目时改 Cloudflare Pages 的 Build 变量即可。
 * 客户端/模板中使用的变量须带 PUBLIC_ 前缀（Astro/Vite 约定）。
 */

import {
  ACTIVE_COLLECTION,
  type ActiveCollectionKey,
} from "./active-collection";
import {
  REALTORS_AT_THE_BEACH_WATER_DAMAGE,
  matchesRealtorsAtTheBeachWaterDamage,
} from "./domain-templates/realtorsatthebeach.com-water-damage";
import {
  REALTORS_AT_THE_BEACH_PLUMBING_V2,
  matchesRealtorsAtTheBeachPlumbingV2,
} from "./domain-templates/realtorsatthebeach.com-plumbing-v2";
import { augmentHubPathForMainSite } from "../hub-site-path.mjs";


export const BRAND_CONFIG = {
  rockwell: {
    name: "FixitGrid Local Dispatch Network",
    short: "FixitGrid",
  },
  realtors: {
    name: "FixitGrid Local Dispatch Network",
    short: "FixitGrid",
  },
} as const;

export type BrandBundle = (typeof BRAND_CONFIG)[keyof typeof BRAND_CONFIG];

/** 全站统一 FixitGrid；域名不再切换品牌。 */
export function getBrand(_domain: string): BrandBundle {
  return BRAND_CONFIG.rockwell;
}

const fallbackSiteUrl = "https://la-roofing-v1.pages.dev";

/** Must stay in sync with `stableHashUint32` in repo root `main.go` (Go generator alias picks). */
function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** 与 `resolve-public-site-url.mjs` 一致：SITE 仍为 pages.dev 时回退到正式 canonical（sitemap / JSON-LD 对齐） */
function isPagesDevHost(u: string | undefined): boolean {
  if (!u) return false;
  try {
    return new URL(u).hostname.endsWith(".pages.dev");
  } catch {
    return u.includes("pages.dev");
  }
}

function pickPublicSiteUrl(
  rawSite: string | undefined,
  rawCanon: string | undefined
): string {
  const norm = (u: string) => u.replace(/\/+$/, "");
  const s = rawSite?.trim();
  const c = rawCanon?.trim();
  if (s && !isPagesDevHost(s)) {
    const ns = norm(s);
    if (c && !isPagesDevHost(c)) {
      const nc = norm(c);
      if (nc.startsWith(`${ns}/`)) return nc;
    }
    return ns;
  }
  if (c && !isPagesDevHost(c)) return norm(c);
  if (s) return norm(s);
  if (c) return norm(c);
  return fallbackSiteUrl;
}

function safeUrl(input: string | undefined): URL | null {
  if (!input) return null;
  try {
    return new URL(input);
  } catch {
    return null;
  }
}

function isRealtorsPlumbingV2BondedDomain(activeCollection: ActiveCollectionKey): boolean {
  if (activeCollection !== "plumbing-v2") return false;
  const candidates = [
    import.meta.env.PUBLIC_CANONICAL_ORIGIN as string | undefined,
    import.meta.env.PUBLIC_SITE_URL as string | undefined,
  ];
  for (const c of candidates) {
    const u = safeUrl(c);
    if (!u) continue;
    const host = u.hostname.toLowerCase();
    const path = u.pathname.toLowerCase();
    if (
      (host === "realtorsatthebeach.com" || host === "www.realtorsatthebeach.com") &&
      (path === "/plumbing" || path === "/plumbing/")
    ) {
      return true;
    }
  }
  return false;
}

function enforcePlumbingHubPathIfNeeded(urlText: string, activeCollection: ActiveCollectionKey): string {
  if (activeCollection !== "plumbing-v2") return urlText;
  const u = safeUrl(urlText);
  if (!u) return urlText;
  const host = u.hostname.toLowerCase();
  if (host === "realtorsatthebeach.com" || host === "www.realtorsatthebeach.com") {
    return `${u.origin}/plumbing`;
  }
  return urlText;
}

/** 未设置 PUBLIC_NICHE_LABEL 时，与当前 ACTIVE_COLLECTION 对齐（避免 plumbing 构建仍显示 Roofing） */
const DEFAULT_NICHE_BY_COLLECTION: Record<ActiveCollectionKey, string> = {
  roofing: "Roofing",
  plumbing: "Plumbing",
  pestcontrol: "Pest Control",
  "water-damage": "Water Mitigation",
  "siding-services": "Siding Services",
  "plumbing-v2": "Professional Plumbing Services",
};

/** 顺序与条数须与 `new_word/main.go` → `waterDamageAliasForJob` 内 `pool` 完全一致。 */
const WATER_DAMAGE_ALIAS_POOL = [
  "Water Mitigation",
  "Flood Recovery",
  "Disaster Cleanup",
  "Moisture Restoration",
  "Emergency Dry-Out",
  "Property Drying",
  "Water Loss Recovery",
  "Storm Cleanup",
  "Flood Restoration",
  "Structural Drying",
] as const;

const SIDING_ALIAS_POOL = [
  "Exterior Cladding",
  "Vinyl Panels",
  "Wall Restoration",
  "Facade Renewal",
  "Cladding Service",
  "Weather Barrier Wrap",
  "Panel Replacement",
  "Exterior Envelope",
  "Surface Sheathing",
  "Cladding Retrofit",
] as const;

/** 顺序与条数须与 `new_word/main.go` → `plumbingV2AliasForJob` 内 `pool` 完全一致。 */
const PLUMBING_V2_ALIAS_POOL = [
  "Professional Plumbing Services",
  "Emergency Pipe Repair",
  "Leak Detection Pros",
  "Drain Line Restoration Crew",
  "Slab Leak Response Unit",
  "Water Heater & Pipe Experts",
  "Hydro-Jetting Specialists",
  "Basement Sump Service Team",
  "Whole-Home Repiping Advisors",
  "Fixture & Supply Line Pros",
] as const;
const rawNicheLabel = (
  import.meta.env.PUBLIC_NICHE_LABEL as string | undefined
)?.trim();

export const PUBLIC_NICHE_LABEL =
  rawNicheLabel && rawNicheLabel.length > 0
    ? rawNicheLabel
    : DEFAULT_NICHE_BY_COLLECTION[ACTIVE_COLLECTION];

export function getNicheLabelForSeed(seed?: string | null): string {
  if (
    ACTIVE_COLLECTION !== "water-damage" &&
    ACTIVE_COLLECTION !== "siding-services" &&
    ACTIVE_COLLECTION !== "plumbing-v2"
  ) {
    return PUBLIC_NICHE_LABEL;
  }
  const aliasSeed = (seed ?? "home").trim() || "home";
  if (ACTIVE_COLLECTION === "water-damage") {
    return WATER_DAMAGE_ALIAS_POOL[stableHash(aliasSeed) % WATER_DAMAGE_ALIAS_POOL.length]!;
  }
  if (ACTIVE_COLLECTION === "plumbing-v2") {
    return PLUMBING_V2_ALIAS_POOL[stableHash(aliasSeed) % PLUMBING_V2_ALIAS_POOL.length]!;
  }
  return SIDING_ALIAS_POOL[stableHash(aliasSeed) % SIDING_ALIAS_POOL.length]!;
}

const domainOrUrlForPhone =
  (import.meta.env.PUBLIC_CANONICAL_ORIGIN as string | undefined) ??
  (import.meta.env.PUBLIC_SITE_URL as string | undefined) ??
  "";
const DEFAULT_PHONE_BY_COLLECTION: Record<ActiveCollectionKey, { e164: string; display: string }> = {
  roofing: { e164: "+17733028078", display: "+1 (773) 302-8078" },
  plumbing: { e164: "+17733028078", display: "+1 (773) 302-8078" },
  pestcontrol: { e164: "+17733028078", display: "+1 (773) 302-8078" },
  "water-damage": { e164: "+18312301952", display: "+18312301952" },
  "siding-services": { e164: "+18446134825", display: "+18446134825" },
  "plumbing-v2": {
    e164: REALTORS_AT_THE_BEACH_PLUMBING_V2.phone.e164,
    display: REALTORS_AT_THE_BEACH_PLUMBING_V2.phone.display,
  },
};
const usePlumbingV2PhoneIdentity =
  ACTIVE_COLLECTION === "plumbing-v2" ||
  isRealtorsPlumbingV2BondedDomain(ACTIVE_COLLECTION) ||
  matchesRealtorsAtTheBeachPlumbingV2({
    domainOrUrl: domainOrUrlForPhone,
    activeCollection: ACTIVE_COLLECTION,
  });
const useWaterDamagePhoneIdentity =
  ACTIVE_COLLECTION === "water-damage" ||
  matchesRealtorsAtTheBeachWaterDamage({
    domainOrUrl: domainOrUrlForPhone,
    activeCollection: ACTIVE_COLLECTION,
  });

/**
 * E.164 优先顺序：显式 E164 > PUBLIC_PHONE（部分环境只配一个号码）> 默认
 */
const rawPhoneE164 =
  (import.meta.env.PUBLIC_PHONE_E164 as string | undefined)?.trim() ||
  (import.meta.env.PUBLIC_PHONE as string | undefined)?.trim() ||
  (usePlumbingV2PhoneIdentity
    ? REALTORS_AT_THE_BEACH_PLUMBING_V2.phone.e164
    : useWaterDamagePhoneIdentity
      ? REALTORS_AT_THE_BEACH_WATER_DAMAGE.phone.e164
      : DEFAULT_PHONE_BY_COLLECTION[ACTIVE_COLLECTION].e164);

export const PUBLIC_PHONE_DISPLAY =
  import.meta.env.PUBLIC_PHONE_DISPLAY ??
  (usePlumbingV2PhoneIdentity
    ? REALTORS_AT_THE_BEACH_PLUMBING_V2.phone.display
    : useWaterDamagePhoneIdentity
      ? REALTORS_AT_THE_BEACH_WATER_DAMAGE.phone.display
      : DEFAULT_PHONE_BY_COLLECTION[ACTIVE_COLLECTION].display);

const rawPublicSiteUrl = (
  import.meta.env.PUBLIC_SITE_URL as string | undefined
)?.trim();

const rawCanonicalOrigin = (
  import.meta.env.PUBLIC_CANONICAL_ORIGIN as string | undefined
)?.trim();

const pickedPublicSiteUrl = pickPublicSiteUrl(
  rawPublicSiteUrl,
  rawCanonicalOrigin
);

const rawAugmentOff = (
  import.meta.env.PUBLIC_AUTO_SITEMAP_PATH as string | undefined
)?.trim();

/** 与 sitemap、astro `site`、JSON-LD 绝对 URL 对齐（主域 Hub 路径见 `hub-site-path.mjs`） */
export const PUBLIC_SITE_URL = augmentHubPathForMainSite(
  pickedPublicSiteUrl,
  ACTIVE_COLLECTION,
  rawAugmentOff
);

/**
 * 可选：统一 canonical 归属域（例如 rockwellpropertiesmaine.com）。
 * 未配置时回退到 PUBLIC_SITE_URL（已含 pages.dev → canonical 的解析）。
 */
export const PUBLIC_CANONICAL_ORIGIN =
  rawCanonicalOrigin && rawCanonicalOrigin.length > 0
    ? enforcePlumbingHubPathIfNeeded(rawCanonicalOrigin, ACTIVE_COLLECTION)
    : enforcePlumbingHubPathIfNeeded(PUBLIC_SITE_URL, ACTIVE_COLLECTION);

/**
 * 可选：统一 robots 元标签内容。
 * 例如在 pages.dev 预览项目可设为 "noindex, follow"。
 * 若留空则默认 "index, follow"。
 */
const rawRobotsContent = (
  import.meta.env.PUBLIC_ROBOTS_CONTENT as string | undefined
)?.trim();
export const PUBLIC_ROBOTS_CONTENT =
  rawRobotsContent && rawRobotsContent.length > 0
    ? rawRobotsContent
    : "index, follow";

/**
 * 规范为 E.164（联盟/解析/JSON-LD 更稳）：仅数字时按北美 +1 处理
 */
export function normalizePhoneE164(input: string): string {
  const t = input.trim();
  if (t.startsWith("+")) {
    const digits = t.slice(1).replace(/\D/g, "");
    return `+${digits}`;
  }
  const digits = t.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  return t;
}

export const PUBLIC_PHONE_E164 = normalizePhoneE164(rawPhoneE164);

export const siteConfig = {
  nicheLabel: PUBLIC_NICHE_LABEL,
  phoneE164: PUBLIC_PHONE_E164,
  phoneDisplay: PUBLIC_PHONE_DISPLAY,
  siteUrl: PUBLIC_SITE_URL,
  canonicalOrigin: PUBLIC_CANONICAL_ORIGIN,
  robotsContent: PUBLIC_ROBOTS_CONTENT,
} as const;

/**
 * Canonical base without trailing slash (e.g. https://domain/plumbing or pages.dev root).
 * Do not use `new URL("/tx/", canonicalOrigin)` — a leading `/` path is resolved from the
 * origin root and drops the /plumbing segment, producing https://domain/tx/ by mistake.
 */
export function getCanonicalBase(): string {
  return siteConfig.canonicalOrigin.replace(/\/$/, "");
}

/** Absolute URL for this service (trailing slash). No args = service index. */
export function canonicalPageUrl(...segments: string[]): string {
  const base = getCanonicalBase();
  const parts = segments
    .filter((s) => s != null && s !== "")
    .map((s) => String(s).replace(/^\/+|\/+$/g, ""));
  if (parts.length === 0) return `${base}/`;
  return `${base}/${parts.join("/")}/`;
}

/** Relative internal path（与 `astro.config` 的 `base` 一致，如 Hub `/pestcontrol/`）。 */
export function internalPath(...segments: string[]): string {
  const parts = segments
    .filter((s) => s != null && s !== "")
    .map((s) => String(s).replace(/^\/+|\/+$/g, ""));
  const root = import.meta.env.BASE_URL ?? "/";
  const base = root.endsWith("/") ? root : `${root}/`;
  if (parts.length === 0) {
    return base;
  }
  const tail = `${parts.join("/")}/`;
  try {
    return new URL(tail, `http://localhost${base}`).pathname;
  } catch {
    return `/${parts.join("/")}/`;
  }
}

function hostnameFromPublicUrl(input: string): string {
  try {
    return new URL(input).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return "";
  }
}

function deploySiteHostname(): string {
  const rawSite = (import.meta.env.PUBLIC_SITE_URL as string | undefined)?.trim();
  if (rawSite) return hostnameFromPublicUrl(rawSite);
  return hostnameFromPublicUrl(siteConfig.siteUrl);
}

function isFixitGridHubDeploy(): boolean {
  const host = deploySiteHostname();
  return host === "fixitgrid.com" || host === "fixitgrid-hub.pages.dev";
}

function fixitGridHubOriginForTunnel(): string {
  const siteHost = deploySiteHostname();
  if (siteHost.endsWith(".pages.dev") && siteHost !== "fixitgrid-hub.pages.dev") {
    return "https://fixitgrid-hub.pages.dev";
  }
  return getCanonicalBase();
}

function isFixitGridVerticalPagesDev(): boolean {
  const host = deploySiteHostname();
  return (
    host.startsWith("fixitgrid-") &&
    host.endsWith(".pages.dev") &&
    host !== "fixitgrid-hub.pages.dev"
  );
}

/**
 * Root-level path on the main domain (bypasses Astro `base`).
 * Hub pages live at origin root, e.g. `/national-service-coverage/` — not under this site's Astro `base`.
 * FixitGrid vertical `*.pages.dev` builds use absolute Hub URL (relative path 404-fallbacks to index).
 */
export function hubPublicPath(...segments: string[]): string {
  const parts = segments
    .filter((s) => s != null && s !== "")
    .map((s) => String(s).replace(/^\/+|\/+$/g, ""));
  const rel = parts.length === 0 ? "/" : `/${parts.join("/")}/`;

  if (isFixitGridVerticalPagesDev()) {
    return `${fixitGridHubOriginForTunnel().replace(/\/+$/, "")}${rel}`;
  }

  return rel;
}

