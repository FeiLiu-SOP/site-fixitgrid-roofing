import type { FixitGridDomainTemplate } from "./fixitgrid.com-roofing";

/** Forest green — biosafe pest defense lane */
export const FIXITGRID_PESTCONTROL: FixitGridDomainTemplate = {
  domainIncludes: "fixitgrid.com",
  activeCollection: "pestcontrol",
  theme: {
    accent: "#16a34a",
    fontFamily: '"Segoe UI", Inter, system-ui, sans-serif',
  },
  domPrefixBase: "fg-pest-grid",
  blockOrder: ["faq", "content", "geo", "related"],
  phone: {
    e164: "+15615550100",
    display: "+1 (561) 555-0100",
  },
};

export function matchesFixitGridPestcontrol(args: {
  domainOrUrl?: string;
  activeCollection?: string;
}): boolean {
  if ((args.activeCollection ?? "").toLowerCase() !== "pestcontrol") return false;
  return (args.domainOrUrl ?? "").toLowerCase().includes("fixitgrid.com");
}
