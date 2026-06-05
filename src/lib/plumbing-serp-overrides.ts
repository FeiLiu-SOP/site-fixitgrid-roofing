/**
 * Per-slug Rockwell plumbing SERP overrides (CTR tests). Keys = entry slug without .md.
 */
export type PlumbingSerpOverride = {
  pageTitle: string;
  pageH1: string;
  metaDescription: string;
};

const PLUMBING_TITLE_MAX = 55;
const PLUMBING_META_MAX = 155;

function clipMetaDescription(text: string, max = PLUMBING_META_MAX): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd().replace(/[,;\s]+$/, "")}…`;
}

function assertPlumbingTitleFits(title: string, context: string): string {
  if (title.length > PLUMBING_TITLE_MAX) {
    throw new Error(
      `[plumbing-serp-overrides] Title exceeds ${PLUMBING_TITLE_MAX} chars (${title.length}). ctx=${context}`,
    );
  }
  return title;
}

const RAW: Record<string, Omit<PlumbingSerpOverride, "metaDescription"> & { metaDescription: string }> = {
  "plumbing-columbus-oh-43109": {
    pageTitle: "Columbus Plumbing Contractor 43109 OH | FixitGrid",
    pageH1: "Columbus Plumbing Contractor — ZIP 43109 — Emergency Service",
    metaDescription:
      "Licensed plumbing contractor serving Columbus OH 43109. Emergency leaks, drains & repairs. Call for same-day service.",
  },
  "plumbing-reynoldsburg-oh-43068": {
    pageTitle: "Reynoldsburg Plumber 43068 & 43069 | FixitGrid",
    pageH1: "Reynoldsburg Plumber — ZIP 43068 & 43069",
    metaDescription:
      "Licensed plumber for Reynoldsburg OH 43068 & 43069. Emergency leaks, drains & repairs. Same-day local plumbing service.",
  },
};

export function getPlumbingSerpOverride(slug: string): PlumbingSerpOverride | null {
  const row = RAW[slug];
  if (!row) return null;
  const metaDescription = clipMetaDescription(row.metaDescription, PLUMBING_META_MAX);
  const pageTitle = assertPlumbingTitleFits(row.pageTitle, `override:${slug}`);
  return { pageTitle, pageH1: row.pageH1, metaDescription };
}
