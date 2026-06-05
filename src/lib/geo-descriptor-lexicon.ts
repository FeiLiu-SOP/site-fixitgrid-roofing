/**
 * Lexicon for geo-brief “descriptor injection” (pSEO fingerprint / Jaccard dilution).
 * 25 × 20 = 500 unique short English clauses; selection is deterministic per slug.
 */

const A = [
  "Humid subtropical exposure",
  "Continental freeze–thaw cycling",
  "Marine moderated air mass influence",
  "High-plain wind exposure",
  "Karst-influenced shallow groundwater",
  "Alluvial plain sheet drainage",
  "Glacial till mantle context",
  "Coastal salt aerosol loading",
  "Urban heat-island amplification",
  "Mountain snow-melt pulse runoff",
  "Prairie hail corridor exposure",
  "Riverine floodplain proximity",
  "Desert UV and thermal swing stress",
  "Lake-effect moisture banding",
  "Seismic lateral demand context",
  "Volcanic ash soil chemistry",
  "Tidal backwater influence",
  "Derecho-prone straight-line wind",
  "Monsoon punctuated wetting",
  "Interior downslope wind channeling",
  "Fog belt marine layer persistence",
  "Ice dam prone cold-season stack",
  "Clay shrink-swell seasonal drive",
  "Sandy high-infiltration substrate",
  "Bedrock-near footing context",
] as const;

const B = [
  "favors continuous perimeter drainage review.",
  "increases vapor drive at crawlspaces and rim joists.",
  "stresses flashing continuity at roof-to-wall transitions.",
  "elevates gutter capacity checks after convective bursts.",
  "warrants periodic sealant audits on south-facing exposures.",
  "can concentrate runoff at driveway pinch points.",
  "supports moss and organic growth on shaded slopes.",
  "raises subgrade moisture after sustained rainfall.",
  "may widen seasonal crack patterns in pavements.",
  "often correlates with higher attic dew-point risk.",
  "can accelerate fastener corrosion on coastal facets.",
  "increases wind-driven rain at gable ends and corners.",
  "suggests wider roof-edge metal inspection intervals.",
  "favors sump and perimeter drain readiness checks.",
  "can amplify frost heave at shallow footings.",
  "increases dust infiltration through envelope gaps.",
  "supports ice bridging at low-slope transitions.",
  "elevates splash-back wetting at grade lines.",
  "warrants vented cladding gap continuity checks.",
  "can increase static pressure on ridge vent paths.",
  "favors downspout discharge away from foundations.",
  "supports seasonal humidity spikes in basements.",
  "increases UV embrittlement on south roof facets.",
  "can widen diurnal expansion noise in metal trims.",
  "suggests periodic skylight seal inspections.",
] as const;

export const GEO_DESCRIPTOR_LEXICON: readonly string[] = A.flatMap((a) =>
  B.map((b) => `${a}: ${b}`.replace(/\s+/g, " ").trim()),
);

function stableHash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Two distinct clauses for the geo-brief block (SSR-stable). */
export function pickTwoGeoDescriptors(seedSlug: string, collectionKey: string): readonly [string, string] {
  const lex = GEO_DESCRIPTOR_LEXICON;
  const n = lex.length;
  let i1 = stableHash(`${collectionKey}|${seedSlug}|gdx1`) % n;
  let i2 = stableHash(`${collectionKey}|${seedSlug}|gdx2`) % n;
  if (i2 === i1) {
    i2 = (i2 + 1 + (stableHash(`${seedSlug}|gdxb`) % (n - 1 || 1))) % n;
  }
  return [lex[i1]!, lex[i2]!] as const;
}
