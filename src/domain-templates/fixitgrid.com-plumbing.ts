import type { FixitGridDomainTemplate } from "./fixitgrid.com-roofing";

/** Fire-engine red — emergency plumbing rescue lane */
export const FIXITGRID_PLUMBING: FixitGridDomainTemplate = {
  domainIncludes: "fixitgrid.com",
  activeCollection: "plumbing",
  theme: {
    accent: "#dc2626",
    fontFamily: '"Segoe UI", Inter, system-ui, sans-serif',
  },
  domPrefixBase: "fg-pipe-grid",
  blockOrder: ["geo", "content", "faq", "related"],
  phone: {
    e164: "+19545550100",
    display: "+1 (954) 555-0100",
  },
};

export function matchesFixitGridPlumbing(args: {
  domainOrUrl?: string;
  activeCollection?: string;
}): boolean {
  if ((args.activeCollection ?? "").toLowerCase() !== "plumbing") return false;
  return (args.domainOrUrl ?? "").toLowerCase().includes("fixitgrid.com");
}
