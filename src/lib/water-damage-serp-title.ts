/** Realtors / water-damage SERP: Rockwell-aligned conversion titles, `| FixitGrid` suffix. */

export const WATER_BRAND_SUFFIX = " | FixitGrid";
export const WATER_TITLE_MAX = 55;
export const WATER_META_MAX = 155;

export function clipMetaDescription(text: string, max = WATER_META_MAX): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd().replace(/[,;\s]+$/, "")}…`;
}

function withWaterTitleBrand(core: string): string {
  const c = core.trim();
  return c.endsWith("FixitGrid") ? c : `${c}${WATER_BRAND_SUFFIX}`;
}

export function assertWaterTitleFits(title: string, context: string): string {
  const len = title.length;
  if (len > WATER_TITLE_MAX) {
    console.warn(`[water-title] Title Truncated: ${len}>${WATER_TITLE_MAX} ctx=${context}`);
    throw new Error(
      `[water-title] Title exceeds ${WATER_TITLE_MAX} characters (${len}). Refusing truncated SERP title. ctx=${context} title="${title}"`,
    );
  }
  return title;
}

function pickFirstWaterTitle(cores: string[], context: string): string {
  for (const core of cores) {
    const titled = withWaterTitleBrand(core);
    if (titled.length <= WATER_TITLE_MAX) {
      return assertWaterTitleFits(titled, context);
    }
  }
  return assertWaterTitleFits(withWaterTitleBrand(cores[cores.length - 1]!), context);
}

export function buildWaterHighTitleCores(zLabel: string): string[] {
  const z = zLabel.trim() || "Home";
  return [
    `URGENT: ${z} Water Damage Audit | Prevent Permanent Loss`,
    `URGENT: ${z} Water Damage Audit | Prevent Loss`,
    `URGENT: ${z} Water Audit | Prevent Permanent Loss`,
    `URGENT: ${z} Water Audit | Prevent Loss`,
    `URGENT: ${z} Water Audit | Loss`,
    `URGENT: ${z} Flood Audit | Prevent Loss`,
  ];
}

export function buildWaterTemplate0Cores(city: string): string[] {
  return [
    `${city} Water Damage: Direct Insurance Billing | $0 Out-of-Pocket`,
    `${city} Water Damage: Insurance Billing | $0 Out-of-Pocket`,
    `${city} Water: Direct Insurance Billing | $0 Out-of-Pocket`,
    `${city} Water Damage: $0 Out-of-Pocket`,
    `${city} Water: Insurance | $0 Out-of-Pocket`,
    `${city} Water: $0 Out-of-Pocket`,
    `Water Damage: Insurance | $0 Out-of-Pocket`,
    `Water Damage: $0 Out-of-Pocket`,
  ];
}

export function buildWaterTemplate1Cores(city: string): string[] {
  return [
    `Emergency Water Extraction ${city}: Arrive in Minutes`,
    `Emergency Water Extraction ${city}: 24/7 Dispatch`,
    `Emergency Water ${city}: Arrive in Minutes`,
    `Water Extraction ${city}: Arrive in Minutes`,
    `Emergency Water Extraction: Arrive in Minutes`,
    `Emergency Water Extraction: 24/7`,
  ];
}

export function buildWaterTemplate2Cores(city: string): string[] {
  return [
    `2026 ${city} Water Mitigation Audit: IICRC Certified`,
    `2026 ${city} Water Mitigation: IICRC Certified`,
    `${city} Water Mitigation Audit: IICRC Certified`,
    `${city} Water Mitigation: IICRC Certified`,
    `2026 Water Mitigation: IICRC Certified`,
    `Water Mitigation Audit: IICRC Certified`,
    `Water Mitigation: IICRC Certified`,
  ];
}

export function buildWaterPageTitle(opts: {
  city: string;
  zLabel: string | null;
  zLabelExact: string | null;
  highValue: boolean;
  slug: string;
  pick: number;
}): string {
  const { city, zLabel, zLabelExact, highValue, slug, pick } = opts;
  const z = (zLabel ?? zLabelExact ?? "").trim();
  if (highValue && z) {
    return pickFirstWaterTitle(buildWaterHighTitleCores(z), `high:${slug}`);
  }
  const r = pick % 3;
  if (r === 0) {
    return pickFirstWaterTitle(buildWaterTemplate0Cores(city), `t0:${slug}`);
  }
  if (r === 1) {
    return pickFirstWaterTitle(buildWaterTemplate1Cores(city), `t1:${slug}`);
  }
  return pickFirstWaterTitle(buildWaterTemplate2Cores(city), `t2:${slug}`);
}

export function buildWaterH1(opts: {
  city: string;
  zLabel: string | null;
  zLabelExact: string | null;
}): string {
  const { city } = opts;
  const zDisplay = (opts.zLabelExact ?? opts.zLabel ?? "Home").trim();
  return `IICRC Certified ${city} Response — Direct Billing to Insurance — ${city} Emergency Dispatch — Protecting your ${zDisplay} Asset`;
}

export function buildWaterMetaDescription(city: string, stateCode: string): string {
  const st = stateCode.trim().toUpperCase() || "US";
  return clipMetaDescription(
    `Don't pay for flood damage out of pocket. Our verified ${city} dispatch ensures direct insurance billing and IICRC emergency extraction. Search 'FixitGrid ${st}' for emergency dispatch.`,
    WATER_META_MAX,
  );
}

export function buildBaitPool2TitlesWater(opts: {
  city: string;
  stateCode: string;
  zLabel: string | null;
  zLabelExact: string | null;
  highValue: boolean;
  slug: string;
  pick: number;
}): { pageTitle: string; pageH1: string; metaDescription: string } {
  const { city, stateCode } = opts;
  return {
    pageTitle: buildWaterPageTitle(opts),
    pageH1: buildWaterH1(opts),
    metaDescription: buildWaterMetaDescription(city, stateCode),
  };
}
