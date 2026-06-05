/** Realtors plumbing-v2 SERP: BaitPool hash templates, `| FixitGrid` suffix (Rockwell-aligned). */

export const PLUMBING_V2_BRAND_SUFFIX = " | FixitGrid";
export const PLUMBING_V2_TITLE_MAX = 55;
export const PLUMBING_V2_META_MAX = 155;

export function clipMetaDescription(text: string, max = PLUMBING_V2_META_MAX): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd().replace(/[,;\s]+$/, "")}…`;
}

function withPlumbingV2TitleBrand(core: string): string {
  const c = core.trim();
  return c.endsWith("FixitGrid") ? c : `${c}${PLUMBING_V2_BRAND_SUFFIX}`;
}

export function assertPlumbingV2TitleFits(title: string, context: string): string {
  const len = title.length;
  if (len > PLUMBING_V2_TITLE_MAX) {
    console.warn(`[plumbing-v2-title] Title Truncated: ${len}>${PLUMBING_V2_TITLE_MAX} ctx=${context}`);
    throw new Error(
      `[plumbing-v2-title] Title exceeds ${PLUMBING_V2_TITLE_MAX} characters (${len}). Refusing truncated SERP title. ctx=${context} title="${title}"`,
    );
  }
  return title;
}

function pickFirstPlumbingV2Title(cores: string[], context: string): string {
  for (const core of cores) {
    const titled = withPlumbingV2TitleBrand(core);
    if (titled.length <= PLUMBING_V2_TITLE_MAX) {
      return assertPlumbingV2TitleFits(titled, context);
    }
  }
  return assertPlumbingV2TitleFits(withPlumbingV2TitleBrand(cores[cores.length - 1]!), context);
}

/** Template 0 — emergency / dispatch. */
export function buildPlumbingV2Template0Cores(city: string): string[] {
  return [
    `Emergency ${city} Plumber: $0 Dispatch & Verified`,
    `${city} Plumber: $0 Dispatch & Verified`,
    `Emergency ${city} Plumb: $0 Dispatch & Verified`,
    `Emergency ${city} Plumbing: $0 Dispatch & Verified`,
    `${city} Emergency Plumber: $0 Dispatch & Verified`,
    `Emergency Plumber: $0 Dispatch & Verified`,
  ];
}

/** Template 1 — asset / audit (requires z). */
export function buildPlumbingV2Template1Cores(city: string, valueToken: string): string[] {
  const z = valueToken || "Home";
  return [
    `Protect Your ${z} Home: ${city} Plumbing Audit`,
    `Protect Your ${z} Home: ${city} Plumber Audit`,
    `Protect ${z} Home: ${city} Plumbing Audit`,
    `Protect Your ${z}: ${city} Plumbing Audit`,
    `${city} Plumbing Audit: Protect ${z}`,
    `Protect ${z} Home: Plumbing Audit`,
    `Protect ${z}: ${city} Plumbing`,
    `Plumbing Audit: Protect ${z} Home`,
    `Plumbing Audit: ${z} Home`,
    `Plumbing Audit`,
  ];
}

/** Template 2 — upfront / no-scam. */
export function buildPlumbingV2Template2Cores(city: string): string[] {
  return [
    `${city} Plumbing Services: Upfront Pricing & No-Scam`,
    `${city} Plumbing: Upfront Pricing & No-Scam`,
    `${city} Plumbing: Upfront & No-Scam`,
    `${city} Plumbing: Upfront Pricing`,
    `Plumbing: Upfront & No-Scam`,
    `Plumbing Services: No-Scam`,
    `Plumbing: Upfront Pricing`,
    `Plumbing Services`,
  ];
}

export function buildPlumbingV2PageTitle(opts: {
  city: string;
  zLabel: string | null;
  zLabelExact: string | null;
  slug: string;
  pick: number;
}): string {
  const { city, zLabel, zLabelExact, slug, pick } = opts;
  const z = (zLabel ?? zLabelExact ?? "").trim();
  let r = pick % 3;
  if (r === 1 && !z) {
    r = stablePickWithoutAsset(slug) % 2 === 0 ? 0 : 2;
  }
  if (r === 0) {
    return pickFirstPlumbingV2Title(buildPlumbingV2Template0Cores(city), `t0:${slug}`);
  }
  if (r === 1) {
    return pickFirstPlumbingV2Title(buildPlumbingV2Template1Cores(city, z), `t1:${slug}`);
  }
  return pickFirstPlumbingV2Title(buildPlumbingV2Template2Cores(city), `t2:${slug}`);
}

function stablePickWithoutAsset(slug: string): number {
  let h = 2166136261;
  const s = `plumbing-v2|${slug}|bait2NoZ`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function buildPlumbingV2H1(opts: {
  city: string;
  zLabel: string | null;
  zLabelExact: string | null;
}): string {
  const { city, zLabel, zLabelExact } = opts;
  const zDisplay = (zLabelExact ?? zLabel ?? "Home").trim();
  return `Verified ${city} Plumber — $0 Dispatch Fee — Protecting your ${zDisplay} Asset`;
}

export function buildPlumbingV2MetaDescription(city: string, stateCode: string): string {
  const st = stateCode.trim().toUpperCase() || "US";
  return clipMetaDescription(
    `Stop overpaying. Get upfront pricing and verified plumbing for ${city} residents. No hidden dispatch fees. Search 'FixitGrid ${st}' for emergency dispatch.`,
    PLUMBING_V2_META_MAX,
  );
}

export function buildBaitPool2TitlesPlumbingV2(opts: {
  city: string;
  stateCode: string;
  zLabel: string | null;
  zLabelExact: string | null;
  slug: string;
  pick: number;
}): { pageTitle: string; pageH1: string; metaDescription: string } {
  const { city, stateCode } = opts;
  return {
    pageTitle: buildPlumbingV2PageTitle(opts),
    pageH1: buildPlumbingV2H1(opts),
    metaDescription: buildPlumbingV2MetaDescription(city, stateCode),
  };
}
