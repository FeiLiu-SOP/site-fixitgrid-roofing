/**
 * Detail BreadcrumbList JSON-LD aligned with index/state/slug routes.
 * Home and service hub share index URL in single-collection deploy.
 */

export type BreadcrumbListItem = {
  name: string;
  /** Absolute URL; must match canonicalPageUrl (with trailing slash) */
  item: string;
};

export function buildBreadcrumbListSchema(items: BreadcrumbListItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((row, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: row.name,
      item: row.item,
    })),
  };
}

/**
 * City detail: Home > service hub > state hub > city node
 * - Keep two-level naming when hub shares index URL; duplicate URL is routing constraint.
 */
export function buildSlugPageBreadcrumbItems(args: {
  canonicalPageUrl: (...segments: string[]) => string;
  serviceHubLabel: string;
  stateCode: string | null;
  cityDisplayName: string | null;
  entrySlug: string;
}): BreadcrumbListItem[] {
  const { canonicalPageUrl, serviceHubLabel, stateCode, cityDisplayName, entrySlug } = args;
  const homeUrl = canonicalPageUrl();
  const serviceHubUrl = canonicalPageUrl();

  const items: BreadcrumbListItem[] = [
    { name: "Home", item: homeUrl },
    { name: `${serviceHubLabel} hub`, item: serviceHubUrl },
  ];

  if (stateCode && /^[A-Z]{2}$/.test(stateCode)) {
    const stLower = stateCode.toLowerCase();
    items.push({
      name: `${stateCode} hub`,
      item: canonicalPageUrl(stLower),
    });
  }

  const cityLeaf =
    cityDisplayName && stateCode
      ? `${cityDisplayName}, ${stateCode}`
      : cityDisplayName ?? entrySlug.replace(/\.(md|mdx)$/i, "");

  items.push({
    name: cityLeaf,
    item: canonicalPageUrl(entrySlug.replace(/\.(md|mdx)$/i, "")),
  });

  return items;
}
