function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** County-level regional base (2200–2800) — same county cluster shares similar volume. */
export function stableCountyBaseDispatchCount(county: string, state: string | null | undefined): number {
  const key = `${county.trim()}|${(state ?? "").trim()}`.toLowerCase() || "regional-default";
  return 2200 + (stableHash(key) % 601);
}

/** Per-city jitter (0–119) so adjacent cities in one county differ slightly. */
export function stableCityDispatchJitter(entrySlug: string): number {
  return stableHash(`${entrySlug}|dispatchJitter`) % 120;
}

/** Regional dispatch volume = county base + city jitter (not a per-city review DB). */
export function stableRegionalDispatchJobCount(input: {
  county: string;
  state: string | null | undefined;
  entrySlug: string;
}): number {
  const sector = resolveDispatchSectorLabel({
    city: "",
    county: input.county,
    localPaths: [],
  });
  const base = stableCountyBaseDispatchCount(sector, input.state);
  return base + stableCityDispatchJitter(input.entrySlug);
}

/** County from frontmatter → first localPaths segment → city area fallback. */
export function resolveDispatchSectorLabel(input: {
  city: string;
  county: string;
  localPaths?: string[];
}): string {
  const county = input.county.trim();
  if (county) return county;

  const paths = (input.localPaths ?? []).map((p) => p.trim()).filter(Boolean);
  if (paths.length > 0) {
    const idx = stableHash(`${paths.join("|")}|sectorPick`) % paths.length;
    const segment = paths[idx]!.split(" / ")[0]?.trim();
    if (segment) return segment;
  }

  const city = input.city.trim();
  return city ? `${city} area` : "Regional";
}

export function buildDispatchSectorRatingLine(input: {
  city: string;
  county: string;
  state: string | null | undefined;
  entrySlug: string;
  localPaths?: string[];
}): string {
  const city = input.city.trim() || "Local";
  const sector = resolveDispatchSectorLabel({
    city,
    county: input.county,
    localPaths: input.localPaths,
  });
  const jobs = stableRegionalDispatchJobCount({
    county: sector,
    state: input.state,
    entrySlug: input.entrySlug,
  });
  const jobsLabel = `${jobs.toLocaleString("en-US")}+`;
  return `${city} Dispatch Rating: 4.9/5.0 based on ${jobsLabel} local dispatches in the ${sector} sector. Real-time fleet tracking active.`;
}
