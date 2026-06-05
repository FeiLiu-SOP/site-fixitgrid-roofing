export type DomainTemplateOverrides = {
  /**
   * Domain match is done via substring contains on canonical/site URL.
   * Keep it permissive so previews using pages.dev still work.
   */
  domainIncludes: string;
  activeCollection: "water-damage";
  theme: {
    accent: string; // Deep Sea Blue
    fontFamily: string; // Inter, sans-serif
  };
  domPrefixBase: string; // e.g. "beach-container"
  /**
   * Tail blocks after the fold stack: markdown + related cities only.
   * FAQ / Geo live in `layoutStack` on `[...slug].astro` (SimHash diversification).
   */
  blockOrder: Array<"related" | "content">;
  /**
   * Phone defaults for this domain.
   * If Cloudflare env overrides are provided, env wins (handled in site-config.ts).
   */
  phone: {
    e164: string;
    display: string;
  };
  /**
   * Class/id naming strategy.
   * We generate:
   * - id: `${domPrefix}-<suffix>`
   * - class: `${domPrefix}--<suffix>`
   * so CSS can target suffixes via attribute selectors.
   */
  naming: {
    idSeparator: "-";
    classSeparator: "--";
  };
};

export const REALTORS_AT_THE_BEACH_WATER_DAMAGE: DomainTemplateOverrides = {
  domainIncludes: "realtorsatthebeach.com",
  activeCollection: "water-damage",
  theme: {
    accent: "#004a99",
    fontFamily: "Inter, sans-serif",
  },
  domPrefixBase: "beach-container",
  blockOrder: ["related", "content"],
  phone: {
    // Screenshot value
    e164: "+18312301952",
    display: "+18312301952",
  },
  naming: {
    idSeparator: "-",
    classSeparator: "--",
  },
};

export function matchesRealtorsAtTheBeachWaterDamage(args: {
  domainOrUrl?: string;
  activeCollection?: string;
}): boolean {
  const { domainOrUrl, activeCollection } = args;
  if ((activeCollection ?? "").toLowerCase() !== REALTORS_AT_THE_BEACH_WATER_DAMAGE.activeCollection) {
    return false;
  }
  return (domainOrUrl ?? "").includes(REALTORS_AT_THE_BEACH_WATER_DAMAGE.domainIncludes);
}

