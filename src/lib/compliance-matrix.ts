/**
 * Dispatch-gateway compliance matrix (SSOT: data/compliance-matrix.json).
 */
import type { ActiveCollectionKey } from "../active-collection";
import matrixData from "../../data/compliance-matrix.json";

export type ComplianceDomainKey = "fixitgrid" | "realtors";

export type DispatchCompliance = {
  stateCode: string;
  authorityFull: string;
  authorityShort: string;
  verifyUrl: string;
  scopeNote: string;
  formatHint: string;
  dispatchId: string;
  domainPrefix: string;
};

type MatrixStateRow = {
  authorityFull: string;
  authorityShort: string;
  verifyUrl: string;
  scopeNote: string;
  formatHints: Record<string, string>;
};

type ComplianceMatrixFile = {
  schemaVersion: number;
  domainPrefixes: { fixitgrid: string; realtors: string };
  states: Record<string, MatrixStateRow>;
};

const matrix = matrixData as ComplianceMatrixFile;

const DOMAIN_PREFIX: Record<ComplianceDomainKey, string> = {
  fixitgrid: matrix.domainPrefixes.fixitgrid ?? "FG",
  realtors: matrix.domainPrefixes.realtors ?? "RE",
};

const FIXITGRID_NICHES = ["roofing", "plumbing", "pestcontrol"] as const;

const REALTORS_FORMAT_HINTS: Record<string, string> = {
  "water-damage":
    "Licensed water mitigation / restoration contractors per state rules (not a home pass/fail certificate)",
  "plumbing-v2": "Licensed plumbing contractors per state plumbing board requirements",
  "siding-services":
    "Licensed exterior / siding contractors where state or local registration applies",
};

/** SC buyer hub — real estate + trade partner context (hub page only). */
export const SC_REALTOR_HUB_COMPLIANCE: DispatchCompliance = {
  stateCode: "SC",
  authorityFull: "South Carolina Real Estate Commission",
  authorityShort: "SC REC",
  verifyUrl: "https://www.llr.sc.gov/realestate/",
  scopeNote:
    "Myrtle Beach / Horry County buyer education only; confirm agent licenses at SC REC and trade licenses at the official state lookup before authorizing work.",
  formatHint:
    "SC real estate salesperson/broker license (numeric ID at SC REC lookup) — illustrative sample only",
  dispatchId: buildDispatchId("realtors", "SC", "buyer-hub", "myrtle-beach-hub"),
  domainPrefix: DOMAIN_PREFIX.realtors,
};

export function stableHashUint(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function buildDispatchId(
  domainKey: ComplianceDomainKey,
  stateCode: string,
  niche: string,
  citySlug: string,
): string {
  const prefix = DOMAIN_PREFIX[domainKey];
  const st = stateCode.trim().toUpperCase();
  const hash = stableHashUint(`${domainKey}|${st}|${niche}|${citySlug}|dispatch`)
    .toString(16)
    .padStart(8, "0")
    .slice(0, 8);
  return `${prefix}-${st}-NET-${hash}`;
}

function isFixitgridNiche(collection: ActiveCollectionKey): boolean {
  return (FIXITGRID_NICHES as readonly string[]).includes(collection);
}

function isRealtorsNiche(collection: ActiveCollectionKey): boolean {
  return (
    collection === "water-damage" ||
    collection === "plumbing-v2" ||
    collection === "siding-services"
  );
}

function resolveFormatHint(
  row: MatrixStateRow,
  domainKey: ComplianceDomainKey,
  collection: ActiveCollectionKey,
): string {
  if (domainKey === "realtors") {
    return (
      REALTORS_FORMAT_HINTS[collection] ??
      row.formatHints.plumbing ??
      "Licensed service partners where state rules apply"
    );
  }
  if (isFixitgridNiche(collection)) {
    return row.formatHints[collection] ?? row.formatHints.roofing ?? "";
  }
  return row.formatHints.roofing ?? "";
}

export function getDispatchCompliance(params: {
  stateCode: string;
  niche: ActiveCollectionKey;
  citySlug: string;
  domainKey: ComplianceDomainKey;
}): DispatchCompliance | null {
  const st = params.stateCode.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(st)) return null;

  if (params.domainKey === "fixitgrid" && !isFixitgridNiche(params.niche)) return null;
  if (params.domainKey === "realtors" && !isRealtorsNiche(params.niche)) return null;

  const row = matrix.states[st];
  if (!row) return null;

  const domainPrefix = DOMAIN_PREFIX[params.domainKey];

  return {
    stateCode: st,
    authorityFull: row.authorityFull,
    authorityShort: row.authorityShort,
    verifyUrl: row.verifyUrl,
    scopeNote: row.scopeNote,
    formatHint: resolveFormatHint(row, params.domainKey, params.niche),
    dispatchId: buildDispatchId(params.domainKey, st, params.niche, params.citySlug),
    domainPrefix,
  };
}

/** JSON-LD: regulatory context only — no fake hasCredential license numbers. */
export function buildDispatchComplianceSchema(params: {
  pageUrl: string;
  compliance: DispatchCompliance;
  cityDisplay: string;
  brandName?: string;
}): Record<string, unknown> {
  const { compliance, pageUrl, cityDisplay } = params;
  const brand = params.brandName?.trim() || "FixitGrid";
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#compliance-matrix`,
    url: pageUrl,
    name: `Dispatch Gateway Compliance — ${cityDisplay}, ${compliance.stateCode}`,
    about: {
      "@type": "GovernmentOrganization",
      name: compliance.authorityFull,
      url: compliance.verifyUrl,
    },
    identifier: {
      "@type": "PropertyValue",
      name: "Internal Dispatch Reference",
      value: compliance.dispatchId,
      description: `${brand} internal routing trace identifier; not a state-issued license number.`,
    },
  };
}
