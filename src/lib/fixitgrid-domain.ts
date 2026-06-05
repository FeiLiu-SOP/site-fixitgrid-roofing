/**
 * FixitGrid domain resolution — tri-color vertical isolation on fixitgrid.com.
 */
import type { ActiveCollectionKey } from "../active-collection";
import {
  FIXITGRID_ROOFING,
  matchesFixitGridRoofing,
  type FixitGridDomainTemplate,
} from "../domain-templates/fixitgrid.com-roofing";
import {
  FIXITGRID_PLUMBING,
  matchesFixitGridPlumbing,
} from "../domain-templates/fixitgrid.com-plumbing";
import {
  FIXITGRID_PESTCONTROL,
  matchesFixitGridPestcontrol,
} from "../domain-templates/fixitgrid.com-pestcontrol";

export const FIXITGRID_DOMAIN = "fixitgrid.com";

export function matchesFixitGrid(args: { domainOrUrl?: string }): boolean {
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

export function resolveFixitGridTemplate(args: {
  domainOrUrl?: string;
  activeCollection: ActiveCollectionKey;
}): FixitGridDomainTemplate | null {
  if (!matchesFixitGrid({ domainOrUrl: args.domainOrUrl })) return null;
  if (matchesFixitGridRoofing(args)) return FIXITGRID_ROOFING;
  if (matchesFixitGridPlumbing(args)) return FIXITGRID_PLUMBING;
  if (matchesFixitGridPestcontrol(args)) return FIXITGRID_PESTCONTROL;
  return null;
}

export function isFixitGridIsolation(args: {
  domainOrUrl?: string;
  activeCollection: ActiveCollectionKey;
}): boolean {
  return resolveFixitGridTemplate(args) != null;
}
