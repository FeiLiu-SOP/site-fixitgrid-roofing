/**
 * FixitGrid National Service Network — entity JSON-LD for fixitgrid.com verticals.
 */

import type { ActiveCollectionKey } from "../active-collection";
import type { DispatchCompliance } from "../lib/compliance-matrix";
import { buildDispatchComplianceSchema } from "../lib/compliance-matrix";
import { buildPestControlServiceNode } from "../lib/pest-control-service-entity";
import type { ParsedLocation } from "../lib/location";
import { buildServiceAreaAggregateRating } from "../lib/seo";
import { detailOpeningHoursSpecification } from "../lib/live-dispatch-status";
import { getCanonicalBase, normalizePhoneE164, siteConfig } from "../site-config";
import { FIXITGRID_DOMAIN } from "../lib/fixitgrid-domain";

export function matchesFixitGridEntity(args: { domainOrUrl?: string }): boolean {
  const raw = (args.domainOrUrl ?? "").trim().toLowerCase();
  if (!raw) return false;
  try {
    const u = new URL(raw.includes("://") ? raw : `https://${raw}`);
    const host = u.hostname.replace(/^www\./i, "").toLowerCase();
    return host === FIXITGRID_DOMAIN || host.endsWith(`.${FIXITGRID_DOMAIN}`);
  } catch {
    return raw.includes(FIXITGRID_DOMAIN);
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

export function buildFixitGridEntityGraph(params: {
  collection: ActiveCollectionKey;
  pageDescription: string;
  pageUrl: string;
  location: ParsedLocation | null;
  entrySlug?: string;
  dispatchCompliance?: DispatchCompliance | null;
  cityDisplay?: string | null;
  countyDisplay?: string | null;
}): Record<string, unknown> {
  const orgId = `${brandOrigin()}/#organization`;
  const localId = `${params.pageUrl}#localbusiness`;
  const legalName = "FixitGrid National Service Network";

  const serviceType =
    params.collection === "roofing"
      ? "Hurricane-resilient roofing coordination"
      : params.collection === "plumbing"
        ? "Emergency plumbing and sewer dispatch"
        : params.collection === "pestcontrol"
          ? "Subtropical pest management programs"
          : "Regional home infrastructure dispatch";

  const organization: Record<string, unknown> = {
    "@type": "Organization",
    "@id": orgId,
    name: legalName,
    url: brandOrigin(),
    description:
      "Nationwide local dispatch network for roofing, plumbing, and pest control coordination. Licensed partners vary by county.",
  };

  const openingHoursSpecification = detailOpeningHoursSpecification(params.entrySlug);

  const localBusiness: Record<string, unknown> = {
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": localId,
    name: legalName,
    description: params.pageDescription,
    url: params.pageUrl,
    telephone: normalizePhoneE164(siteConfig.phoneE164),
    priceRange: "$$$–$$$$",
    ...(openingHoursSpecification ? { openingHoursSpecification } : {}),
    areaServed: params.location
      ? {
          "@type": "AdministrativeArea",
          name: `${params.location.city}, ${params.location.state}`,
        }
      : { "@type": "State", name: "Florida" },
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
          brandName: "FixitGrid",
        }),
      );
    }
  }

  if (params.collection === "pestcontrol") {
    graph.push(
      buildPestControlServiceNode({
        pageUrl: params.pageUrl,
        localBusinessId: localId,
        serviceName: "FixitGrid Local Exterminator",
        countyDisplay: params.countyDisplay,
        cityDisplay: params.cityDisplay ?? params.location?.city ?? null,
        stateCode: params.location?.state ?? null,
      }),
    );
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
