/**
 * South Florida climate lead copy — FixitGrid pilot (roof / plumbing / pest).
 */
import type { ActiveCollectionKey } from "../active-collection";

export function buildFixitGridFlClimateLead(args: {
  collection: ActiveCollectionKey;
  city: string;
  stateCode: string;
}): string | null {
  if (args.stateCode.toUpperCase() !== "FL") return null;
  const city = args.city.trim() || "your area";
  if (args.collection === "roofing") {
    return `Coastal wind-driven rain and Atlantic storm surges around ${city} stress asphalt shingles and tile underlayment. Class-4 impact-rated assemblies and hurricane strapping are common upgrade paths after salt spray and UV degradation along the Gulf Stream corridor.`;
  }
  if (args.collection === "plumbing") {
    return `Tropical downpours and high water tables near ${city} increase main-line surcharge risk and slab leak frequency. Cast-iron lateral lines in older Broward and Palm Beach subdivisions often fail after repeated storm-season pressure spikes.`;
  }
  if (args.collection === "pestcontrol") {
    return `Humid subtropical conditions in ${city} accelerate drywood termite swarms, American cockroach activity, and attic moisture that supports rodent harborage. Perimeter exclusion and crawl-space dehumidification are typical first-response steps after inspection.`;
  }
  return null;
}

/** FL area-code hints for Ringba-style local display (pilot). */
export function fixitGridFlAreaCode(city: string): string {
  const c = city.toLowerCase();
  if (c.includes("marco")) return "239";
  if (c.includes("jupiter") || c.includes("palm beach") || c.includes("wellington") || c.includes("boca")) {
    return "561";
  }
  if (c.includes("weston") || c.includes("davie") || c.includes("parkland")) return "954";
  return "305";
}
