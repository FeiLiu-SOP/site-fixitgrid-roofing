import corpusDoc from "./pest-biodiversity-corpus.json";

export type PestClimatePool = "universal" | "desert_south" | "cold_north" | "warm_climate";

export type PestCorpusEntry = {
  id: string;
  name: string;
  svgPaths: string;
  svgAccent: string;
  descriptionSpintax: string;
  climatePool: PestClimatePool;
};

export type PestFeatured = PestCorpusEntry & {
  description: string;
  imageAlt: string;
  /** Slug-bleached accent for inline SVG fingerprint variance. */
  displayAccent: string;
};

export type PestBiodiversityBundle = {
  featured: PestFeatured[];
  /** Dynamic subset for `<details>` — not the full 30-species block on every page. */
  detailsSubset: PestFeatured[];
  sectionTitle: string;
  nicheList: string;
  bottomLine: string;
  detailsSummary: string;
};

const CORPUS: PestCorpusEntry[] = corpusDoc.pests.map((p) => ({
  ...p,
  climatePool: (p.climatePool ?? "universal") as PestClimatePool,
}));

const FEATURED_COUNT = 6;
const DETAILS_SUBSET_COUNT = 15;

/** Southwest / Gulf — scorpions & fire ants are plausible priority pests. */
const DESERT_SOUTH_STATES = new Set([
  "TX", "AZ", "NV", "NM", "CA", "UT", "OK", "LA", "MS", "AL", "GA", "FL", "SC", "AR",
]);

/** Great Lakes / Northeast / Upper Midwest — boost mice, bed bugs, clothes moths, rats. */
const COLD_NORTH_STATES = new Set([
  "IL", "NY", "MN", "WI", "MI", "IN", "OH", "PA", "MA", "CT", "NJ", "NH", "VT", "ME", "RI", "IA", "ND", "SD",
]);

/** Termite pressure boost (still allowed in cold states — subterranean termites exist in IL). */
const WARM_CLIMATE_STATES = new Set(["TX", "AZ", "NV", "NM", "CA", "FL", "GA", "LA", "SC", "AL", "MS"]);

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Per-page icon fingerprint bleach — micro-shift hex so SVG bytes differ by city slug. */
export function bleachedPestIconAccent(baseHex: string, slug: string, pestId: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(baseHex.trim());
  if (!m) return baseHex;
  const seed = stableHash(`${slug}|pest-icon-bleach|${pestId}`);
  let r = parseInt(m[1]!.slice(0, 2), 16);
  let g = parseInt(m[1]!.slice(2, 4), 16);
  let b = parseInt(m[1]!.slice(4, 6), 16);
  const channel = seed % 3;
  const delta = 1 + (seed % 3);
  if (channel === 0) r = Math.min(255, r + delta);
  else if (channel === 1) g = Math.min(255, g + delta);
  else b = Math.min(255, b + delta);
  const hex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

export function expandSpintax(text: string, seed: number): string {
  return text.replace(/\{([^{}]+)\}/g, (_, group: string) => {
    const options = group.split("|").map((s) => s.trim()).filter(Boolean);
    if (!options.length) return "";
    return options[seed % options.length]!;
  });
}

function isChicagoMarket(stateCode: string, city: string, slug: string): boolean {
  if (stateCode !== "IL") return false;
  return `${city} ${slug}`.toLowerCase().includes("chicago");
}

/** Species paradox guard — exclude desert-only pests outside their range. */
export function isPestEligibleForState(pest: PestCorpusEntry, stateCode: string): boolean {
  const st = stateCode.toUpperCase();
  if (pest.climatePool === "desert_south" && !DESERT_SOUTH_STATES.has(st)) return false;
  return true;
}

function geoWeightMultiplier(
  pest: PestCorpusEntry,
  stateCode: string,
  city: string,
  slug: string,
): number {
  const st = stateCode.toUpperCase();
  if (!isPestEligibleForState(pest, st)) return 0;

  if (pest.climatePool === "desert_south" && DESERT_SOUTH_STATES.has(st)) return 8;
  if (pest.climatePool === "cold_north" && COLD_NORTH_STATES.has(st)) return 8;
  if (pest.id === "termites" && WARM_CLIMATE_STATES.has(st)) return 6;
  if (st === "NY" || isChicagoMarket(st, city, slug)) {
    if (pest.id === "rats" || pest.id === "bed-bugs") return 8;
  }
  if (pest.climatePool === "universal") return 1;
  return 1;
}

function withDescription(entry: PestCorpusEntry, slug: string, city: string): PestFeatured {
  const seed = stableHash(`${slug}|pest-bio-desc|${entry.id}`);
  return {
    ...entry,
    description: expandSpintax(entry.descriptionSpintax, seed),
    imageAlt: `${entry.name} removal in ${city}`,
    displayAccent: bleachedPestIconAccent(entry.svgAccent, slug, entry.id),
  };
}

function eligibleCorpus(stateCode: string): PestCorpusEntry[] {
  return CORPUS.filter((p) => isPestEligibleForState(p, stateCode));
}

function selectFeatured(slug: string, stateCode: string, city: string): PestFeatured[] {
  const st = stateCode.toUpperCase();
  const pool = eligibleCorpus(st);
  const picked: PestCorpusEntry[] = [];

  if (st === "FL") {
    const termites = pool.find((p) => p.id === "termites") ?? CORPUS.find((p) => p.id === "termites");
    if (termites && isPestEligibleForState(termites, st)) picked.push(termites);
  }

  const remaining = pool.filter((p) => !picked.some((x) => x.id === p.id));
  const scored = remaining.map((pest) => {
    const base = stableHash(`${slug}|pest-bio-pick|${pest.id}`);
    const weight = geoWeightMultiplier(pest, st, city, slug);
    return { pest, score: base * weight };
  });
  scored.sort((a, b) => b.score - a.score);

  for (const row of scored) {
    if (picked.length >= FEATURED_COUNT) break;
    if (row.score <= 0) continue;
    picked.push(row.pest);
  }

  return picked.map((p) => withDescription(p, slug, city));
}

function selectDetailsSubset(slug: string, stateCode: string, city: string): PestFeatured[] {
  const st = stateCode.toUpperCase();
  const pool = eligibleCorpus(st);
  const scored = pool.map((pest) => ({
    pest,
    score: stableHash(`${slug}|pest-bio-details|${pest.id}`) * Math.max(1, geoWeightMultiplier(pest, st, city, slug)),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, DETAILS_SUBSET_COUNT).map((row) => withDescription(row.pest, slug, city));
}

function formatNicheList(names: string[]): string {
  if (!names.length) return "common household pests";
  if (names.length === 1) return names[0]!;
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

export function buildPestBiodiversityBundle(opts: {
  entrySlug: string;
  city: string;
  stateCode: string;
  stateLabel: string;
}): PestBiodiversityBundle {
  const city = opts.city.trim() || "your area";
  const stateLabel = opts.stateLabel.trim() || opts.stateCode || "your state";
  const featured = selectFeatured(opts.entrySlug, opts.stateCode, city);
  const detailsSubset = selectDetailsSubset(opts.entrySlug, opts.stateCode, city);
  const nicheList = formatNicheList(featured.map((p) => p.name));

  const sectionTitle = `Local Pest Control & Inspection in ${city}`;

  const bottomLine =
    `In addition to the ${nicheList} above, our ${city} technicians are certified to handle over 45 species of local pests common to ${stateLabel}. ` +
    "No matter what's crawling in your home, we have the specialized equipment to neutralize the threat.";

  const detailsSummary = `View treated pests commonly routed in ${city}`;

  return {
    featured,
    detailsSubset,
    sectionTitle,
    nicheList,
    bottomLine,
    detailsSummary,
  };
}
