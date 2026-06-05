export type FixitGridDomainTemplate = {
  domainIncludes: string;
  activeCollection: "roofing" | "plumbing" | "pestcontrol";
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
};

/** Royal blue — storm / windproof roofing lane */
export const FIXITGRID_ROOFING: FixitGridDomainTemplate = {
  domainIncludes: "fixitgrid.com",
  activeCollection: "roofing",
  theme: {
    accent: "#1d4ed8",
    fontFamily: '"Segoe UI", Inter, system-ui, sans-serif',
  },
  domPrefixBase: "fg-roof-grid",
  blockOrder: ["content", "geo", "faq", "related"],
  phone: {
    e164: "+13055550100",
    display: "+1 (305) 555-0100",
  },
};

export function matchesFixitGridRoofing(args: {
  domainOrUrl?: string;
  activeCollection?: string;
}): boolean {
  if ((args.activeCollection ?? "").toLowerCase() !== "roofing") return false;
  return (args.domainOrUrl ?? "").toLowerCase().includes("fixitgrid.com");
}
