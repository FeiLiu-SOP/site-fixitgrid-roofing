/**
 * Meta-analysis clause bank (pSEO / Jaccard dilution). 50 × 20 = 1000 strings.
 * SSR-stable picks via `pickTwoMetaAnalysisLines`.
 */

import { filterTextPoolForCommercialHtml } from "./commercial-semantic-html-guard";

const PREFIX = [
  "Roofing routing lens:",
  "Roofing intake meta note:",
  "Roofing scope triage hint:",
  "Roofing storm-readiness frame:",
  "Roofing attic-vapor context:",
  "Plumbing dispatch lens:",
  "Plumbing pressure-system frame:",
  "Plumbing drain-health hint:",
  "Plumbing fixture-life context:",
  "Plumbing PRV-readiness note:",
  "Pest-control pathway lens:",
  "Pest barrier continuity frame:",
  "Pest moisture-cue hint:",
  "Pest perimeter audit note:",
  "Pest seasonal pressure context:",
  "Water-damage drying lens:",
  "Water-damage moisture-map frame:",
  "Water-damage contents triage hint:",
  "Water-damage insurer-doc context:",
  "Water-damage vapor-gradient note:",
  "Siding envelope lens:",
  "Siding WRB continuity frame:",
  "Siding fastener-schedule hint:",
  "Siding wind-load context:",
  "Siding color-lot variance note:",
  "Plumbing-v2 coastal lens:",
  "Plumbing-v2 slab-route frame:",
  "Plumbing-v2 hydro-jet hint:",
  "Plumbing-v2 sump-readiness context:",
  "Plumbing-v2 backflow note:",
  "Regional dispatch meta lens:",
  "ZIP-corridor intake frame:",
  "County-routing variance hint:",
  "Service-hub parity context:",
  "Cross-niche intake note:",
  "Median-home exposure lens:",
  "Asset-defense triage frame:",
  "IICRC-aligned readiness hint:",
  "Local-technician routing context:",
  "Intake verification depth note:",
  "Scheduling elasticity lens:",
  "Crew-availability smoothing frame:",
  "Weather-window coupling hint:",
  "Material-lead-time context:",
  "Permit-latency variance note:",
  "Photo-documentation lens:",
  "Scope-creep guard frame:",
  "Customer-education cadence hint:",
  "Call-volume seasonality context:",
  "After-hours premium note:",
] as const;

const SUFFIX = [
  "benchmarks are informational, not on-site measurements.",
  "coordinates anchor marketing copy, not a survey plat.",
  "ZIP samples illustrate coverage density, not exclusivity.",
  "elevation bands compress terrain variability into a single line.",
  "drainage language summarizes public datasets, not a per-lot study.",
  "FAQ answers add local color without replacing licensed inspection.",
  "dispatch verbs describe coordination, not guaranteed arrival times.",
  "insurance phrasing is educational, not a coverage promise.",
  "tooling brands indicate compatible systems, not endorsements.",
  "moisture modeling language stays qualitative by design.",
  "wind and hail wording reflects regional averages, not a forecast.",
  "seismic mentions are generic hazard context, not engineering calcs.",
  "humidity cues support maintenance planning, not medical advice.",
  "salt-air notes target coastal facades, not every block face.",
  "freeze–thaw cycles are seasonal averages, not daily readings.",
  "wildfire smoke references are episodic risk context, not AQI now.",
  "karst wording flags common caveats, not a geotech report.",
  "riverine notes describe floodplain proximity, not FEMA maps here.",
  "urban heat island text is climatology shorthand, not a sensor log.",
  "derecho language is straight-line wind education, not a warning.",
] as const;

export const META_ANALYSIS_LEXICON: readonly string[] = PREFIX.flatMap((p) =>
  SUFFIX.map((s) => `${p} ${s}`.replace(/\s+/g, " ").trim()),
);

function stableHash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickTwoMetaAnalysisLines(seedSlug: string, collectionKey: string): readonly [string, string] {
  const lex = META_ANALYSIS_LEXICON;
  let pool = filterTextPoolForCommercialHtml(collectionKey, lex);
  if (collectionKey.startsWith("community-stewardship-")) {
    pool = pool.filter((s) => !/\bdispatch\b/i.test(s));
  }
  if (pool.length < 2) {
    throw new Error(
      `[meta-analysis-lexicon] pool too small after commercial filter (collection=${collectionKey}, n=${pool.length})`,
    );
  }
  const n = pool.length;
  let i1 = stableHash(`${collectionKey}|${seedSlug}|ma1`) % n;
  let i2 = stableHash(`${collectionKey}|${seedSlug}|ma2`) % n;
  if (i2 === i1) {
    i2 = (i2 + 1 + (stableHash(`${seedSlug}|mab`) % (n - 1 || 1))) % n;
  }
  return [pool[i1]!, pool[i2]!] as const;
}
