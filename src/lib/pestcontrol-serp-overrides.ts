/**
 * Per-slug Rockwell pest control SERP overrides (CTR tests). Keys = entry slug without .md.
 */
export type PestcontrolSerpOverride = {
  pageTitle: string;
  pageH1: string;
  metaDescription: string;
};

const PEST_OVERRIDE_TITLE_MAX = 120;
const PEST_OVERRIDE_META_MAX = 155;

function clipMetaDescription(text: string, max = PEST_OVERRIDE_META_MAX): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd().replace(/[,;\s]+$/, "")}…`;
}

function assertPestOverrideTitleFits(title: string, context: string): string {
  if (title.length > PEST_OVERRIDE_TITLE_MAX) {
    throw new Error(
      `[pestcontrol-serp-overrides] Title exceeds ${PEST_OVERRIDE_TITLE_MAX} chars (${title.length}). ctx=${context}`,
    );
  }
  return title;
}

const RAW: Record<string, Omit<PestcontrolSerpOverride, "metaDescription"> & { metaDescription: string }> = {
  "pest-control-temescal-valley-ca-92883": {
    pageTitle: "Temescal Valley Emergency Pest Control | FixitGrid",
    pageH1: "Emergency Pest Control — Temescal Valley, CA",
    metaDescription:
      "Emergency pest control in Temescal Valley, CA 92883. Ants, rodents & seasonal pests. Local service — call for same-day help.",
  },
  "pest-control-coral-terrace-fl-33144": {
    pageTitle: "Pest Control Services Coral Terrace FL | FixitGrid",
    pageH1: "Pest Control Services — Coral Terrace, FL",
    metaDescription:
      "Pest control services in Coral Terrace, FL 33144. Rodents, ants & seasonal pests. Local licensed service — call for same-day help.",
  },
  "pest-control-moreno-valley-ca-92551": {
    pageTitle: "Emergency Pest Control — Mead Valley & Moreno Valley | FixitGrid",
    pageH1: "Emergency Pest Control — Mead Valley & Moreno Valley, CA",
    metaDescription:
      "Emergency pest control in Moreno Valley & Mead Valley, CA 92551. Rodents, ants & local pests. Licensed local service — same-day help.",
  },
  "pest-control-flowing-wells-az-85705": {
    pageTitle: "Pest Control Flowing Wells AZ | FixitGrid",
    pageH1: "Pest Control — Flowing Wells, AZ",
    metaDescription:
      "Pest control in Flowing Wells, AZ 85705. Wasp, ant & cockroach treatment. Licensed local service — same-day help.",
  },
  "pest-control-casa-de-oro-mount-helix-ca-91977": {
    pageTitle: "Pest Control Casa de Oro CA | FixitGrid",
    pageH1: "Pest Control — Casa de Oro, CA",
    metaDescription:
      "Pest control in Casa de Oro & Mount Helix, CA 91977. Ants, rodents & seasonal pests. Licensed local service — same-day help.",
  },
  "pest-control-the-acreage-fl-33411": {
    pageTitle: "Pest Control The Acreage FL | FixitGrid",
    pageH1: "Pest Control — The Acreage, FL",
    metaDescription:
      "Pest & termite control in The Acreage, FL 33411. Ants, rodents & local pests. Licensed local service — same-day help.",
  },
  "pest-control-gladeview-fl-33147": {
    pageTitle: "Gladeview FL Pest Control | FixitGrid",
    pageH1: "Pest Control — Gladeview, FL",
    metaDescription:
      "Pest control services in Gladeview, FL 33147. Ants, rodents & seasonal pests. Licensed local service — same-day help.",
  },
};

export function getPestcontrolSerpOverride(slug: string): PestcontrolSerpOverride | null {
  const row = RAW[slug];
  if (!row) return null;
  const metaDescription = clipMetaDescription(row.metaDescription, PEST_OVERRIDE_META_MAX);
  const pageTitle = assertPestOverrideTitleFits(row.pageTitle, `override:${slug}`);
  return { pageTitle, pageH1: row.pageH1, metaDescription };
}
