/** Realtors siding-services SERP: hash bait templates, `| FixitGrid` suffix (Rockwell-aligned). */

export const SIDING_BRAND_SUFFIX = " | FixitGrid";
export const SIDING_TITLE_MAX = 55;
export const SIDING_META_MAX = 155;

export function clipMetaDescription(text: string, max = SIDING_META_MAX): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd().replace(/[,;\s]+$/, "")}…`;
}

function withSidingTitleBrand(core: string): string {
  const c = core.trim();
  return c.endsWith("FixitGrid") ? c : `${c}${SIDING_BRAND_SUFFIX}`;
}

export function assertSidingTitleFits(title: string, context: string): string {
  const len = title.length;
  if (len > SIDING_TITLE_MAX) {
    console.warn(`[siding-title] Title Truncated: ${len}>${SIDING_TITLE_MAX} ctx=${context}`);
    throw new Error(
      `[siding-title] Title exceeds ${SIDING_TITLE_MAX} characters (${len}). Refusing truncated SERP title. ctx=${context} title="${title}"`,
    );
  }
  return title;
}

function pickFirstSidingTitle(cores: string[], context: string): string {
  for (const core of cores) {
    const titled = withSidingTitleBrand(core);
    if (titled.length <= SIDING_TITLE_MAX) {
      return assertSidingTitleFits(titled, context);
    }
  }
  return assertSidingTitleFits(withSidingTitleBrand(cores[cores.length - 1]!), context);
}

/** Template 0 — structural decay / asset boost. */
export function buildSidingTemplate0Cores(city: string, valueToken: string): string[] {
  const z = valueToken || "Home";
  return [
    `${city} Siding Audit: Stop Structural Decay & Boost ${z} Asset`,
    `${city} Siding Audit: Stop Decay & Boost ${z} Asset`,
    `${city} Siding Audit: Boost ${z} Asset`,
    `${city} Siding Audit: ${z} Asset`,
    `Siding Audit: Boost ${z} Asset`,
    `Siding Audit: ${z} Asset`,
    `${city} Siding Audit: Stop Decay`,
    `${city} Siding Audit`,
    `Siding Audit: Protect Asset`,
    `Siding Audit`,
  ];
}

/** Template 1 — verified / dispatch. */
export function buildSidingTemplate1Cores(city: string): string[] {
  return [
    `Verified ${city} Siding Pros: $0 Dispatch & Quality Repairs`,
    `Verified ${city} Siding Pros: $0 Dispatch & Verified`,
    `Verified ${city} Siding: $0 Dispatch & Verified`,
    `${city} Siding Pros: $0 Dispatch & Verified`,
    `${city} Siding: $0 Dispatch & Verified`,
    `Verified ${city} Siding: $0 Dispatch`,
    `Verified Siding: $0 Dispatch`,
    `Siding Pros: $0 Dispatch`,
    `Siding: $0 Dispatch`,
  ];
}

/** Template 2 — 2026 compliance audit. */
export function buildSidingTemplate2Cores(city: string): string[] {
  return [
    `2026 ${city} Siding Protection Audit: State-Compliant Pricing`,
    `2026 ${city} Siding Audit: State-Compliant Pricing`,
    `2026 ${city} Siding Audit: Compliant Pricing`,
    `${city} Siding Protection Audit: Compliant`,
    `2026 Siding Audit: State-Compliant`,
    `Siding Audit: Compliant`,
    `Siding Audit`,
  ];
}

export function buildSidingPageTitle(opts: {
  city: string;
  zLabel: string | null;
  zLabelExact: string | null;
  slug: string;
  pick: number;
}): string {
  const { city, zLabel, zLabelExact, slug, pick } = opts;
  const z = (zLabel ?? zLabelExact ?? "").trim();
  const r = pick % 3;
  if (r === 0) {
    return pickFirstSidingTitle(buildSidingTemplate0Cores(city, z), `t0:${slug}`);
  }
  if (r === 1) {
    return pickFirstSidingTitle(buildSidingTemplate1Cores(city), `t1:${slug}`);
  }
  return pickFirstSidingTitle(buildSidingTemplate2Cores(city), `t2:${slug}`);
}

export function buildSidingH1(opts: {
  city: string;
  zLabel: string | null;
  zLabelExact: string | null;
}): string {
  const { city, zLabel, zLabelExact } = opts;
  const zDisplay = (zLabelExact ?? zLabel ?? "Home").trim();
  return `Verified ${city} Siding Pros — Prevent Water Damage — Protecting your ${zDisplay} Asset`;
}

export function buildSidingMetaDescription(city: string, stateCode: string): string {
  const st = stateCode.trim().toUpperCase() || "US";
  return clipMetaDescription(
    `Stop overpaying. Get verified siding installation and risk audits for ${city} residents. Avoid common contractor scams. Search 'FixitGrid ${st}' on Google for your property risk tier.`,
    SIDING_META_MAX,
  );
}

export function buildBaitPool2TitlesSiding(opts: {
  city: string;
  stateCode: string;
  zLabel: string | null;
  zLabelExact: string | null;
  slug: string;
  pick: number;
}): { pageTitle: string; pageH1: string; metaDescription: string } {
  const { city, stateCode } = opts;
  return {
    pageTitle: buildSidingPageTitle(opts),
    pageH1: buildSidingH1(opts),
    metaDescription: buildSidingMetaDescription(city, stateCode),
  };
}
