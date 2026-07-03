/** Rockwell plumbing SERP: ≤55-char titles, `| FixitGrid` suffix (service-first, tiered). */

import { stableHash } from "./faq-hydration";

export const PLUMBING_BRAND_SUFFIX = " | FixitGrid";
export const PLUMBING_TITLE_MAX = 55;
export const PLUMBING_META_MAX = 155;

export function clipMetaDescription(text: string, max = PLUMBING_META_MAX): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd().replace(/[,;\s]+$/, "")}…`;
}

function withPlumbingTitleBrand(core: string): string {
  const c = core.trim();
  return c.endsWith("FixitGrid") ? c : `${c}${PLUMBING_BRAND_SUFFIX}`;
}

export function assertPlumbingTitleFits(title: string, context: string): string {
  const len = title.length;
  if (len > PLUMBING_TITLE_MAX) {
    console.warn(`[plumbing-title] Title Truncated: ${len}>${PLUMBING_TITLE_MAX} ctx=${context}`);
    throw new Error(
      `[plumbing-title] Title exceeds ${PLUMBING_TITLE_MAX} characters (${len}). Refusing truncated SERP title. ctx=${context} title="${title}"`,
    );
  }
  return title;
}

function pickFirstPlumbingTitle(cores: string[], context: string): string {
  for (const core of cores) {
    const titled = withPlumbingTitleBrand(core);
    if (titled.length <= PLUMBING_TITLE_MAX) {
      return assertPlumbingTitleFits(titled, context);
    }
  }
  const fallback = withPlumbingTitleBrand(cores[cores.length - 1]!);
  return assertPlumbingTitleFits(fallback, context);
}

/** Lower median markets — shorter plumber titles. */
export function buildPlumbingLowTitleCore(city: string): string[] {
  return [
    `Emergency ${city} Plumber`,
    `${city} Plumber`,
    `Emergency ${city} Plumbing`,
    `${city} Plumbing`,
    `Emergency Plumber`,
  ];
}

/** Higher median markets — contractor / services wording (no home-value in title). */
export function buildPlumbingHighTitleCore(city: string, _valueToken: string): string[] {
  return [
    `${city} Plumbing Contractor`,
    `${city} Plumber Contractor`,
    `${city} Plumbing Services`,
    `Plumbing Contractor ${city}`,
    `${city} Licensed Plumber`,
    `Licensed Plumber`,
    `Plumbing Contractor`,
  ];
}

export function buildPlumbingMetaDescription(city: string, stateCode: string): string {
  const st = stateCode.trim().toUpperCase() || "US";
  return clipMetaDescription(
    `Licensed plumbing in ${city}, ${st}. Emergency leaks, drains & repairs. Upfront pricing — call for same-day service.`,
    PLUMBING_META_MAX,
  );
}

export function buildPlumbingPageTitle(opts: {
  city: string;
  zLabel: string | null;
  zLabelExact: string | null;
  highValue: boolean;
  slug: string;
}): string {
  const { city, zLabel, zLabelExact, highValue, slug } = opts;
  const z = (zLabel ?? zLabelExact ?? "").trim();
  if (highValue) {
    return pickFirstPlumbingTitle(buildPlumbingHighTitleCore(city, z || "Home"), `high:${slug}`);
  }
  return pickFirstPlumbingTitle(buildPlumbingLowTitleCore(city), `low:${slug}`);
}

export function buildPlumbingH1(opts: {
  city: string;
  highValue: boolean;
  slug?: string;
  stateCode?: string | null;
  county?: string | null;
}): string {
  const { city, highValue, slug = city, stateCode, county } = opts;
  const st = (stateCode ?? "").trim().toUpperCase() || "US";
  const countyLabel = (county ?? "").trim();
  const geoTail = countyLabel || st;

  const lowPool = [
    `Emergency plumber in ${city} — leak & drain response`,
    `${city} plumbing repair — ${geoTail} pipe & fixture help`,
    `Emergency plumbing in ${city}, ${st} — burst pipe & clog triage`,
    `Plumbing repair in ${city}: ${geoTail} licensed local pros`,
    `${city} emergency plumber — same-day leak repair options`,
  ];
  const highPool = [
    `${city} plumbing contractor — leak & repipe scope`,
    `Licensed plumber in ${city}, ${st}`,
    `${city} plumbing services — ${geoTail} drain & water heater repair`,
    `Plumbing repair in ${city} — emergency leak & fixture work`,
    `${city} plumber — drain cleaning & pipe repair options`,
  ];
  const pool = highValue ? highPool : lowPool;
  return pool[stableHash(`${slug}|plumbH1`) % pool.length]!;
}

export function buildBaitPool2TitlesPlumbing(opts: {
  city: string;
  stateCode: string;
  zLabel: string | null;
  zLabelExact: string | null;
  highValue: boolean;
  slug: string;
  county?: string;
}): { pageTitle: string; pageH1: string; metaDescription: string } {
  const { city, stateCode, slug, county } = opts;
  const pageTitle = buildPlumbingPageTitle(opts);
  const pageH1 = buildPlumbingH1({
    city,
    highValue: opts.highValue,
    slug,
    stateCode,
    county,
  });
  const metaDescription = buildPlumbingMetaDescription(city, stateCode);
  return { pageTitle, pageH1, metaDescription };
}
