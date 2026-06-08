/**
 * PestControlService JSON-LD node — shared by Rockwell + FixitGrid @graph (no duplicate script).
 */

/** External knowledge anchors (Wikipedia + Wikidata entity link). */
export const PEST_CONTROL_KNOWS_ABOUT = [
  "https://en.wikipedia.org/wiki/Pest_control",
  "https://en.wikipedia.org/wiki/Termite",
  "https://www.wikidata.org/wiki/Q16983050",
] as const;

export function buildPestControlServiceNode(params: {
  pageUrl: string;
  localBusinessId: string;
  serviceName: string;
  countyDisplay?: string | null;
  cityDisplay?: string | null;
  stateCode?: string | null;
}): Record<string, unknown> {
  const county = (params.countyDisplay ?? "").trim();
  const city = (params.cityDisplay ?? "").trim();
  const st = (params.stateCode ?? "").trim().toUpperCase();

  const areaServed = county
    ? { "@type": "AdministrativeArea", name: county }
    : city && st
      ? {
          "@type": "AdministrativeArea",
          name: `${city}, ${st}`,
        }
      : st
        ? { "@type": "State", name: st }
        : { "@type": "Country", name: "US" };

  return {
    "@type": "PestControlService",
    "@id": `${params.pageUrl}#pestcontrol-service`,
    name: params.serviceName.trim() || "Local Exterminator",
    url: params.pageUrl,
    areaServed,
    knowsAbout: [...PEST_CONTROL_KNOWS_ABOUT],
    provider: { "@id": params.localBusinessId },
  };
}
