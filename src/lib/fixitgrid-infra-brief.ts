/**
 * FixitGrid Local Infrastructure Brief — gated by frontmatter `infraBriefPanel: true`.
 * Legacy geo-brief renders when the flag is absent or false.
 *
 * SSOT rollout phases: docs/FIXITGRID_INFRA_BRIEF_ROLLBACK_AND_SCALE.md
 */
import { createHash } from "node:crypto";

export function isFixitgridInfraBriefPanel(args: {
  isFixitGridSite: boolean;
  infraBriefPanel?: boolean | null;
}): boolean {
  if (!args.isFixitGridSite) return false;
  return args.infraBriefPanel === true;
}

/** Matches generator token in main.go buildServiceReferenceToken. */
export function buildFixitgridServiceReference(args: {
  niche: string;
  city: string;
  stateCode: string;
  zip: string;
}): string {
  const state = args.stateCode.trim().toUpperCase().slice(0, 2);
  const zipMatch = args.zip.match(/\d{5}/);
  const zip = zipMatch?.[0] ?? args.zip.trim();
  const hash8 = createHash("sha1")
    .update(
      `${args.niche.toLowerCase().trim()}|${args.city.toLowerCase().trim()}|${state}|${zip}`,
    )
    .digest("hex")
    .slice(0, 8);
  return `${state}-${zip}-${hash8}`;
}
