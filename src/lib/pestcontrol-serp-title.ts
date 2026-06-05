/** Rockwell pest control SERP: hash templates + tier; service-first (no PREMIUM/asset audit titles). */

export const PEST_BRAND_SUFFIX = " | FixitGrid";
export const PEST_TITLE_MAX = 120;
export const PEST_META_MAX = 155;

export function clipMetaDescription(text: string, max = PEST_META_MAX): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd().replace(/[,;\s]+$/, "")}…`;
}

function withPestTitleBrand(core: string): string {
  const c = core.trim();
  if (c.endsWith("FixitGrid")) {
    return c.length <= PEST_TITLE_MAX ? c : c;
  }
  return `${c}${PEST_BRAND_SUFFIX}`;
}

export function assertPestTitleFits(title: string, context: string): string {
  const len = title.length;
  if (len > PEST_TITLE_MAX) {
    console.warn(`[pest-title] Title Truncated: ${len}>${PEST_TITLE_MAX} ctx=${context}`);
    throw new Error(
      `[pest-title] Title exceeds ${PEST_TITLE_MAX} characters (${len}). Refusing truncated SERP title. ctx=${context} title="${title}"`,
    );
  }
  return title;
}

function pickFirstPestTitle(cores: string[], context: string): string {
  for (const core of cores) {
    const titled = withPestTitleBrand(core);
    if (titled.length <= PEST_TITLE_MAX) {
      return assertPestTitleFits(titled, context);
    }
  }
  return assertPestTitleFits(withPestTitleBrand(cores[cores.length - 1]!), context);
}

/** Template 0 — emergency pest control. */
export function buildPestTemplate0Cores(city: string): string[] {
  return [
    `Emergency ${city} Pest Control`,
    `Emergency Pest Control ${city}`,
    `Emergency ${city} Pest Service`,
    `Emergency Pest Control`,
  ];
}

/** Template 1 — general services. */
export function buildPestTemplate1Cores(city: string, _valueToken: string): string[] {
  return [
    `Pest Control Services ${city}`,
    `${city} Pest Control Services`,
    `Pest Control ${city}`,
    `${city} Licensed Pest Control`,
  ];
}

/** Template 2 — roaches / rodents / seasonal. */
export function buildPestTemplate2Cores(city: string): string[] {
  return [
    `${city} Pest & Rodent Control`,
    `${city} Ant & Roach Control`,
    `Pest & Rodent Control ${city}`,
    `${city} Local Pest Control`,
  ];
}

/** Higher median — contractor wording (no dollar amount in title). */
export function buildPestPremiumTitleCores(city: string, _zLabelExact: string): string[] {
  return [
    `Pest Control Contractor ${city}`,
    `${city} Pest Control Contractor`,
    `${city} Pest Control Services`,
    `Licensed Pest Control ${city}`,
  ];
}

export function buildPestPageTitle(opts: {
  city: string;
  zLabel: string | null;
  zLabelExact: string | null;
  highValue: boolean;
  slug: string;
  pick: number;
}): string {
  const { city, zLabel, zLabelExact, highValue, slug, pick } = opts;
  const z = (zLabel ?? zLabelExact ?? "").trim();
  if (highValue && zLabelExact) {
    return pickFirstPestTitle(buildPestPremiumTitleCores(city, zLabelExact), `premium:${slug}`);
  }
  const r = pick % 3;
  if (r === 0) {
    return pickFirstPestTitle(buildPestTemplate0Cores(city), `t0:${slug}`);
  }
  if (r === 1) {
    return pickFirstPestTitle(buildPestTemplate1Cores(city, z), `t1:${slug}`);
  }
  return pickFirstPestTitle(buildPestTemplate2Cores(city), `t2:${slug}`);
}

export function buildPestH1(opts: {
  city: string;
  zLabel: string | null;
  zLabelExact: string | null;
  highValue?: boolean;
}): string {
  const { city, highValue } = opts;
  if (highValue) {
    return `Pest Control Services — ${city}`;
  }
  return `Pest Control — ${city}`;
}

export function buildPestNestNotice(city: string): string {
  return `NOTICE: Your ${city} property may need pest treatment. Schedule inspection for ants, rodents and seasonal pests.`;
}

export function buildPestMetaDescription(city: string, stateCode: string): string {
  const st = stateCode.trim().toUpperCase() || "US";
  return clipMetaDescription(
    `Pest control in ${city}, ${st}. Ants, rodents, wasps & seasonal pests. Licensed local service — same-day help.`,
    PEST_META_MAX,
  );
}

export function buildBaitPool2TitlesPestcontrol(opts: {
  city: string;
  stateCode: string;
  zLabel: string | null;
  zLabelExact: string | null;
  highValue: boolean;
  slug: string;
  pick: number;
}): { pageTitle: string; pageH1: string; metaDescription: string } {
  const { city, stateCode, highValue } = opts;
  const pageTitle = buildPestPageTitle(opts);
  const pageH1 = buildPestH1({ city, zLabel: opts.zLabel, zLabelExact: opts.zLabelExact, highValue });
  const metaDescription = buildPestMetaDescription(city, stateCode);
  return { pageTitle, pageH1, metaDescription };
}
