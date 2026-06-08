export type PlumbingV2DomainTemplate = {
  domainIncludes: string;
  activeCollection: "plumbing-v2";
  theme: {
    accent: string;
    fontFamily: string;
  };
  domPrefixBase: string;
  blockOrder: Array<"related" | "content" | "geo" | "faq">;
  phone: {
    e164: string;
    display: string;
  };
  naming: {
    idSeparator: string;
    classSeparator: string;
  };
};

/** Ocean Teal — fingerprint isolation from Rockwell / water-damage deep blue. */
export const REALTORS_AT_THE_BEACH_PLUMBING_V2: PlumbingV2DomainTemplate = {
  domainIncludes: "realtorsatthebeach.com",
  activeCollection: "plumbing-v2",
  theme: {
    accent: "#0d9488",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  domPrefixBase: "beach-plumb-v2",
  /** Geo (DispatchRadar) + FAQ included for parity with Rockwell hubs. */
  blockOrder: ["geo", "related", "content", "faq"],
  phone: {
    e164: "+16074009375",
    display: "+1 (607) 400-9375",
  },
  naming: {
    idSeparator: "-",
    classSeparator: "--",
  },
};

export function matchesRealtorsAtTheBeachPlumbingV2(args: {
  domainOrUrl?: string;
  activeCollection?: string;
}): boolean {
  const { domainOrUrl, activeCollection } = args;
  if ((activeCollection ?? "").toLowerCase() !== REALTORS_AT_THE_BEACH_PLUMBING_V2.activeCollection) {
    return false;
  }
  return (domainOrUrl ?? "").includes(REALTORS_AT_THE_BEACH_PLUMBING_V2.domainIncludes);
}
