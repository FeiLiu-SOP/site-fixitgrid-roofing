/**
 * Per-slug Rockwell roofing SERP overrides (CTR tests). Keys = entry slug without .md.
 */
export type RoofingSerpOverride = {
  pageTitle: string;
  pageH1: string;
  metaDescription: string;
};

const ROOFING_TITLE_MAX = 55;
const ROOFING_META_MAX = 155;

function clipMetaDescription(text: string, max = ROOFING_META_MAX): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd().replace(/[,;\s]+$/, "")}…`;
}

function assertRoofingTitleFits(title: string, context: string): string {
  if (title.length > ROOFING_TITLE_MAX) {
    throw new Error(
      `[roofing-serp-overrides] Title exceeds ${ROOFING_TITLE_MAX} chars (${title.length}). ctx=${context}`,
    );
  }
  return title;
}

const RAW: Record<string, Omit<RoofingSerpOverride, "metaDescription"> & { metaDescription: string }> = {
  "roofing-carlsbad-ca-92008": {
    pageTitle: "Emergency Roofing Carlsbad: No-Scam Quotes | FixitGrid",
    pageH1: "Emergency Roofing in Carlsbad, CA",
    metaDescription:
      "Local Carlsbad emergency roofing. Stop overpaying. Verify your scope before the work starts. Fast dispatch.",
  },
  "roofing-willowbrook-ca-90059": {
    pageTitle: "Willowbrook Roof Repair & Replacement | FixitGrid",
    pageH1: "Roof Repair & Replacement — Willowbrook, CA",
    metaDescription:
      "Roof repair & replacement in Willowbrook, CA 90059. Local roofing for restoration & storm damage. Licensed contractor — free estimate.",
  },
  "roofing-lochearn-md-21208": {
    pageTitle: "Lochearn Roof Repair & Replacement | FixitGrid",
    pageH1: "Roof Repair & Replacement — Lochearn, MD",
    metaDescription:
      "Roof repair & replacement in Lochearn, MD 21208. Local roofer for shingles & storm damage. Licensed contractor — free estimate.",
  },
  "roofing-white-center-wa-98106": {
    pageTitle: "White Center Roofer & Roof Replacement | FixitGrid",
    pageH1: "Roofer & Roof Replacement — White Center, WA",
    metaDescription:
      "Roofer & roof replacement in White Center, WA 98106. Repair, shingles & storm damage. Licensed local roofing — free estimate.",
  },
  "roofing-fullerton-pa-18052": {
    pageTitle: "Roofing Fullerton PA | FixitGrid",
    pageH1: "Roofing — Fullerton, PA",
    metaDescription:
      "Roofing & roof repair in Fullerton, PA 18052. Residential & commercial estimates. Licensed local contractor — free estimate.",
  },
  "roofing-temescal-valley-ca-92883": {
    pageTitle: "Roofing Temescal CA | FixitGrid",
    pageH1: "Roofing — Temescal, CA",
    metaDescription:
      "Roofer & roofing in Temescal Valley, CA 92883. Repair, replacement & storm damage. Licensed local contractor — free estimate.",
  },
};

export function getRoofingSerpOverride(slug: string): RoofingSerpOverride | null {
  const row = RAW[slug];
  if (!row) return null;
  const metaDescription = clipMetaDescription(row.metaDescription, ROOFING_META_MAX);
  const pageTitle = assertRoofingTitleFits(row.pageTitle, `override:${slug}`);
  return { pageTitle, pageH1: row.pageH1, metaDescription };
}
