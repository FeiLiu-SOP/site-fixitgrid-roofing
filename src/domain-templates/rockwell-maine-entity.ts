/**
 * Rockwell Properties Maine — hub entity JSON-LD for /roofing /plumbing /pestcontrol.
 * NAP/sameAs/founder from build env vars; no unverified hardcoded addresses.
 *
 * Avoid *.com.ts filenames: Vite may parse .com as extension on Linux.
 */

import type { ActiveCollectionKey } from "../active-collection";
import type { ParsedLocation } from "../lib/location";
import { buildServiceAreaAggregateRating } from "../lib/seo";
import { detailOpeningHoursSpecification, liveDispatchStatusEnabled } from "../lib/live-dispatch-status";
import { getCanonicalBase, normalizePhoneE164, siteConfig } from "../site-config";

export const ROCKWELL_MAINE_DOMAIN = "rockwellpropertiesmaine.com";

export function matchesRockwellMaine(args: { domainOrUrl?: string }): boolean {
  const raw = (args.domainOrUrl ?? "").trim();
  if (!raw) return false;
  try {
    const u = new URL(raw.includes("://") ? raw : `https://${raw}`);
    const host = u.hostname.replace(/^www\./i, "").toLowerCase();
    return host === ROCKWELL_MAINE_DOMAIN || host.endsWith(`.${ROCKWELL_MAINE_DOMAIN}`);
  } catch {
    return raw.toLowerCase().includes(ROCKWELL_MAINE_DOMAIN);
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

function envTrim(key: string): string | undefined {
  const v = (import.meta.env[key] as string | undefined)?.trim();
  return v && v.length > 0 ? v : undefined;
}

function parseHours(): { opens: string; closes: string; days: string[] } | null {
  const spec = envTrim("PUBLIC_ORG_OPENING_HOURS_SPEC");
  if (!spec) {
    return {
      opens: "08:00",
      closes: "17:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    };
  }
  try {
    const j = JSON.parse(spec) as { opens?: string; closes?: string; dayOfWeek?: string[] };
    if (!j.opens || !j.closes || !Array.isArray(j.dayOfWeek) || j.dayOfWeek.length === 0) return null;
    return { opens: j.opens, closes: j.closes, days: j.dayOfWeek };
  } catch {
    return null;
  }
}

/**
 * Google: legal name, verifiable NAP, sameAs aligned with areaServed.
 * Omit unset PUBLIC_ORG_* fields rather than emit bad data.
 */
export function buildRockwellMaineEntityGraph(params: {
  collection: ActiveCollectionKey;
  pageDescription: string;
  pageUrl: string;
  location: ParsedLocation | null;
  /** GSC SERP seed slug — adds aggregateRating on LocalBusiness when matched. */
  entrySlug?: string;
}): Record<string, unknown> {
  const orgId = `${brandOrigin()}/#organization`;
  const localId = `${params.pageUrl}#localbusiness`;

  const legalName = envTrim("PUBLIC_ORG_LEGAL_NAME") ?? "Rockwell Properties Maine";
  const twitter = envTrim("PUBLIC_ORG_TWITTER_URL");
  const linkedin = envTrim("PUBLIC_ORG_LINKEDIN_URL");
  const sameAs = [twitter, linkedin].filter(Boolean) as string[];

  const founderName = envTrim("PUBLIC_ORG_FOUNDER_NAME");
  const founder =
    founderName != null
      ? {
          "@type": "Person",
          name: founderName,
        }
      : undefined;

  const street = envTrim("PUBLIC_ORG_STREET_ADDRESS");
  const locality = envTrim("PUBLIC_ORG_ADDRESS_LOCALITY");
  const region = envTrim("PUBLIC_ORG_ADDRESS_REGION") ?? "ME";
  const postal = envTrim("PUBLIC_ORG_POSTAL_CODE");
  const country = envTrim("PUBLIC_ORG_ADDRESS_COUNTRY") ?? "US";

  const latStr = envTrim("PUBLIC_ORG_GEO_LAT");
  const lngStr = envTrim("PUBLIC_ORG_GEO_LNG");
  const lat = latStr != null ? Number(latStr) : NaN;
  const lng = lngStr != null ? Number(lngStr) : NaN;
  const geo =
    Number.isFinite(lat) && Number.isFinite(lng)
      ? {
          "@type": "GeoCoordinates",
          latitude: lat,
          longitude: lng,
        }
      : undefined;

  const address =
    street && locality && postal
      ? {
          "@type": "PostalAddress",
          streetAddress: street,
          addressLocality: locality,
          addressRegion: region,
          postalCode: postal,
          addressCountry: country,
        }
      : undefined;

  const hours = parseHours();
  const legacyOpeningHoursSpecification =
    hours != null
      ? hours.days.map((day) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: day,
          opens: hours.opens,
          closes: hours.closes,
        }))
      : undefined;

  const openingHoursSpecification = liveDispatchStatusEnabled()
    ? detailOpeningHoursSpecification(params.entrySlug)
    : legacyOpeningHoursSpecification;

  const priceRange = envTrim("PUBLIC_ORG_PRICE_RANGE") ?? "$$–$$$";
  const logo = envTrim("PUBLIC_ORG_LOGO_URL");

  const telephone = normalizePhoneE164(siteConfig.phoneE164);

  const areaServed = params.location
    ? {
        "@type": "AdministrativeArea",
        name: `${params.location.city}, ${params.location.state}`,
        containedInPlace: {
          "@type": "Country",
          name: "United States",
        },
      }
    : { "@type": "Country", name: "United States" };

  const serviceType =
    params.collection === "roofing"
      ? "Residential roofing infrastructure maintenance"
      : params.collection === "plumbing"
        ? "Residential plumbing infrastructure maintenance"
        : params.collection === "pestcontrol"
          ? "Residential pest-management programs"
          : "Regional property infrastructure maintenance";

  const organization: Record<string, unknown> = {
    "@type": "Organization",
    "@id": orgId,
    name: legalName,
    url: brandOrigin(),
    description:
      envTrim("PUBLIC_ORG_DESCRIPTION") ??
      "Regional coordination for licensed residential infrastructure maintenance across the United States; scope and availability vary by market.",
    ...(sameAs.length ? { sameAs } : {}),
    ...(founder ? { founder } : {}),
    ...(logo ? { logo: logo } : {}),
  };

  const localBusiness: Record<string, unknown> = {
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": localId,
    name: legalName,
    description: params.pageDescription,
    url: params.pageUrl,
    telephone,
    priceRange,
    ...(address ? { address } : {}),
    ...(geo ? { geo } : {}),
    ...(openingHoursSpecification ? { openingHoursSpecification } : {}),
    areaServed,
    serviceType,
    parentOrganization: { "@id": orgId },
    knowsAbout: [
      "Residential building envelope maintenance",
      "Moisture intrusion prevention",
      "Regional service coordination",
      serviceType,
    ],
    ...(founder ? { founder } : {}),
  };

  const aggregateRating = params.entrySlug
    ? buildServiceAreaAggregateRating(params.entrySlug)
    : null;
  if (aggregateRating) {
    localBusiness.aggregateRating = aggregateRating;
  }

  return {
    "@context": "https://schema.org",
    "@graph": [organization, localBusiness],
  };
}
