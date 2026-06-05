/**
 * Realtors at the Beach — entity JSON-LD for realtorsatthebeach.com verticals.
 */
import type { ActiveCollectionKey } from "../active-collection";
import type { DispatchCompliance } from "../lib/compliance-matrix";
import { buildDispatchComplianceSchema } from "../lib/compliance-matrix";
import type { ParsedLocation } from "../lib/location";
import { buildServiceAreaAggregateRating } from "../lib/seo";
import { getCanonicalBase, normalizePhoneE164, siteConfig } from "../site-config";

export const REALTORS_DOMAIN = "realtorsatthebeach.com";

export function matchesRealtorsEntity(args: { domainOrUrl?: string }): boolean {
  const raw = (args.domainOrUrl ?? "").trim().toLowerCase();
  if (!raw) return false;
  try {
    const u = new URL(raw.includes("://") ? raw : `https://${raw}`);
    const host = u.hostname.replace(/^www\./i, "").toLowerCase();
    return host === REALTORS_DOMAIN || host.endsWith(`.${REALTORS_DOMAIN}`);
  } catch {
    return raw.includes(REALTORS_DOMAIN);
  }
}

function brandOrigin(): string {
  try {
    const u = new URL(getCanonicalBase());
    return `${u.protocol}//${u.host}`;
  } catch {
    return getCanonicalBase().replace(/\/+$/, "").replace(/\/[^/]+$/, "");
  }
}

export function buildRealtorsEntityGraph(params: {
  collection: ActiveCollectionKey;
  pageDescription: string;
  pageUrl: string;
  location: ParsedLocation | null;
  entrySlug?: string;
  dispatchCompliance?: DispatchCompliance | null;
  cityDisplay?: string | null;
}): Record<string, unknown> {
  const orgId = `${brandOrigin()}/#organization`;
  const localId = `${params.pageUrl}#localbusiness`;
  const legalName = "Realtors at the Beach";

  const serviceType =
    params.collection === "water-damage"
      ? "Water damage and flood mitigation coordination"
      : params.collection === "plumbing-v2"
        ? "Emergency plumbing dispatch coordination"
        : params.collection === "siding-services"
          ? "Exterior siding and cladding coordination"
          : "Regional home service dispatch coordination";

  const organization: Record<string, unknown> = {
    "@type": "Organization",
    "@id": orgId,
    name: legalName,
    url: brandOrigin(),
    description:
      "Buyer-facing coastal property desk and licensed service-partner dispatch network for water, siding, and plumbing coordination.",
  };

  const localBusiness: Record<string, unknown> = {
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": localId,
    name: legalName,
    description: params.pageDescription,
    url: params.pageUrl,
    telephone: normalizePhoneE164(siteConfig.phoneE164),
    areaServed: params.location
      ? {
          "@type": "AdministrativeArea",
          name: `${params.location.city}, ${params.location.state}`,
        }
      : { "@type": "Country", name: "US" },
    serviceType,
    parentOrganization: { "@id": orgId },
  };

  const aggregateRating = params.entrySlug
    ? buildServiceAreaAggregateRating(params.entrySlug)
    : null;
  if (aggregateRating) {
    localBusiness.aggregateRating = aggregateRating;
  }

  const graph: Record<string, unknown>[] = [organization, localBusiness];

  if (params.dispatchCompliance) {
    const cityDisplay = (params.cityDisplay ?? params.location?.city ?? "").trim();
    if (cityDisplay) {
      graph.push(
        buildDispatchComplianceSchema({
          pageUrl: params.pageUrl,
          compliance: params.dispatchCompliance,
          cityDisplay,
          brandName: "Realtors at the Beach",
        }),
      );
    }
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
