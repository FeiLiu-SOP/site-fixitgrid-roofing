/** Rockwell roofing SERP titles: ≤55 chars, service-first, tiered (no asset-audit titles). */

export const ROOFING_BRAND_SUFFIX = " | FixitGrid";
export const ROOFING_TITLE_MAX = 55;
export const ROOFING_META_MAX = 155;

export function clipMetaDescription(text: string, max = ROOFING_META_MAX): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd().replace(/[,;\s]+$/, "")}…`;
}

function withRoofingTitleBrand(core: string): string {
  const c = core.trim();
  return c.endsWith("FixitGrid") ? c : `${c}${ROOFING_BRAND_SUFFIX}`;
}

/** Build fails if no candidate fits — never ship a truncated SERP title. */
export function assertRoofingTitleFits(title: string, context: string): string {
  const len = title.length;
  if (len > ROOFING_TITLE_MAX) {
    console.warn(`[roofing-title] Title Truncated: ${len}>${ROOFING_TITLE_MAX} ctx=${context}`);
    throw new Error(
      `[roofing-title] Title exceeds ${ROOFING_TITLE_MAX} characters (${len}). Refusing truncated SERP title. ctx=${context} title="${title}"`,
    );
  }
  return title;
}

function pickFirstRoofingTitle(cores: string[], context: string): string {
  for (const core of cores) {
    const titled = withRoofingTitleBrand(core);
    if (titled.length <= ROOFING_TITLE_MAX) {
      return assertRoofingTitleFits(titled, context);
    }
  }
  const fallback = withRoofingTitleBrand(cores[cores.length - 1]!);
  return assertRoofingTitleFits(fallback, context);
}

export function buildRoofingLowTitleCore(city: string): string[] {
  return [
    `Emergency ${city} Roofing`,
    `Emergency ${city} Roof Repair`,
    `${city} Emergency Roofing`,
    `${city} Roof Repair`,
    `Emergency Roof Repair`,
  ];
}

export function buildRoofingHighTitleCore(city: string, _valueToken: string): string[] {
  return [
    `${city} Roof Repair & Replacement`,
    `${city} Roofing Contractor`,
    `${city} Roofer & Roof Repair`,
    `Roofing Contractor ${city}`,
    `${city} Licensed Roofer`,
    `Roof Repair & Replacement`,
    `Licensed Roofer`,
  ];
}

export function buildRoofingPageTitle(opts: {
  city: string;
  zLabel: string | null;
  zLabelExact: string | null;
  highValue: boolean;
  slug: string;
}): string {
  const { city, zLabel, zLabelExact, highValue, slug } = opts;
  const z = (zLabel ?? zLabelExact ?? "").trim();
  if (highValue) {
    return pickFirstRoofingTitle(buildRoofingHighTitleCore(city, z || "Home"), `high:${slug}`);
  }
  return pickFirstRoofingTitle(buildRoofingLowTitleCore(city), `low:${slug}`);
}

export function buildRoofingH1(city: string, highValue: boolean): string {
  if (highValue) {
    return `Roof Repair & Replacement — ${city}`;
  }
  return `Roofing — ${city}`;
}

export function buildBaitPool2TitlesRoofing(opts: {
  city: string;
  zLabel: string | null;
  zLabelExact: string | null;
  highValue: boolean;
  slug: string;
  stateCode?: string;
}): { pageTitle: string; pageH1: string; metaDescription: string } {
  const { city, highValue, stateCode = "US" } = opts;
  const st = stateCode.trim().toUpperCase() || "US";
  const pageTitle = buildRoofingPageTitle(opts);
  const pageH1 = buildRoofingH1(city, highValue);
  const metaDescription = clipMetaDescription(
    `Roof repair & replacement in ${city}, ${st}. Local roofer for shingles & storm damage. Licensed contractor — free estimate.`,
    ROOFING_META_MAX,
  );
  return { pageTitle, pageH1, metaDescription };
}
