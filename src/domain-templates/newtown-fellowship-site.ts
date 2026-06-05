/**
 * Newtown Fellowship vertical — isolated from Rockwell / FixitGrid commercial fingerprint.
 * Detected via build canonical/site URL; set PUBLIC_NEWTOWN_FELLOWSHIP_FINGERPRINT=1 locally to verify.
 */

const HOST_SUFFIXES = [
  "newtownbaptistfellowship.com",
  "newtownfellowship.org",
] as const;

function hostMatchesNewtown(host: string): boolean {
  const h = host.replace(/^www\./i, "").toLowerCase();
  return HOST_SUFFIXES.some((s) => h === s || h.endsWith(`.${s}`));
}

function urlMatches(raw: string | undefined): boolean {
  const t = (raw ?? "").trim();
  if (!t) return false;
  try {
    const u = new URL(t.includes("://") ? t : `https://${t}`);
    return hostMatchesNewtown(u.hostname);
  } catch {
    return HOST_SUFFIXES.some((s) => t.toLowerCase().includes(s));
  }
}

export function matchesNewtownFellowshipSite(urls: {
  canonicalOrigin?: string;
  siteUrl?: string;
}): boolean {
  const flag = (import.meta.env.PUBLIC_NEWTOWN_FELLOWSHIP_FINGERPRINT as string | undefined)
    ?.trim()
    .toLowerCase();
  if (flag === "1" || flag === "true" || flag === "yes") return true;
  return urlMatches(urls.canonicalOrigin) || urlMatches(urls.siteUrl);
}

/** JSON-LD/canonical: fingerprint builds fall back to church origin if PUBLIC_CANONICAL_ORIGIN leaks main site. */
export const NEWTOWN_FELLOWSHIP_DEFAULT_ORIGIN = "https://newtownbaptistfellowship.com" as const;

/**
 * Resolve origin (no trailing slash). Use Newtown host only when canonical/siteUrl already point there;
 * else {@link NEWTOWN_FELLOWSHIP_DEFAULT_ORIGIN} (no main-site domain).
 */
export function resolveNewtownFellowshipPublicOrigin(urls: {
  canonicalOrigin?: string;
  siteUrl?: string;
}): string {
  for (const raw of [urls.canonicalOrigin, urls.siteUrl]) {
    const t = (raw ?? "").trim();
    if (!t) continue;
    if (!urlMatches(t)) continue;
    try {
      const u = new URL(t.includes("://") ? t : `https://${t}`);
      return u.origin;
    } catch {
      /* fall through */
    }
  }
  return NEWTOWN_FELLOWSHIP_DEFAULT_ORIGIN;
}

/** Same as site-config.canonicalPageUrl but church origin. */
export function newtownFellowshipCanonicalPageUrl(originBase: string, ...segments: string[]): string {
  const base = originBase.replace(/\/$/, "");
  const parts = segments
    .filter((s) => s != null && s !== "")
    .map((s) => String(s).replace(/^\/+|\/+$/g, ""));
  if (parts.length === 0) return `${base}/`;
  return `${base}/${parts.join("/")}/`;
}
