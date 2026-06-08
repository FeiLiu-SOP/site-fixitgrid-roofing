/**
 * 主域 Hub：/roofing /plumbing /pestcontrol。
 * @astrojs/sitemap 用 `new URL(config.base, config.site)`；`site` 不能带 path，否则会被当成 base 解析成根域。
 * 正确：`site` = origin，`base` = `/pestcontrol/` 等。
 */
export const SEGMENT_BY_COLLECTION = {
  roofing: "roofing",
  plumbing: "plumbing",
  pestcontrol: "pestcontrol",
  "water-damage": "water-damage",
  "siding-services": "siding-services",
  "plumbing-v2": "plumbing",
};

/**
 * 仍为「完整公开 URL」字符串（给 site-config / JSON-LD），含路径。
 * @param {string} siteStr
 * @param {string} activeCollection
 * @param {string | undefined} disableAugment "0" 关闭
 */
export function augmentHubPathForMainSite(siteStr, activeCollection, disableAugment) {
  if (disableAugment === "0" || !siteStr) return siteStr;
  const key = (activeCollection ?? "").toLowerCase().trim();
  const seg = SEGMENT_BY_COLLECTION[key];
  if (!seg) return siteStr;
  try {
    const u = new URL(siteStr);
    if (u.hostname.endsWith(".pages.dev")) return siteStr;
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length > 0) return siteStr;
    const allowed =
      u.hostname === "rockwellpropertiesmaine.com" ||
      u.hostname === "www.rockwellpropertiesmaine.com" ||
      u.hostname === "realtorsatthebeach.com" ||
      u.hostname === "www.realtorsatthebeach.com" ||
      u.hostname === "fixitgrid.com" ||
      u.hostname === "www.fixitgrid.com";
    if (!allowed) return siteStr;
    if (u.hostname.includes("fixitgrid.com")) {
      return u.origin;
    }
    if (key === "plumbing-v2") {
      return `${u.origin}/plumbing`;
    }
    return `${u.origin}/${seg}`;
  } catch {
    return siteStr;
  }
}

/**
 * @param {string} fullResolvedUrl augment 后的完整 URL
 * @param {string} activeCollection
 * @returns {{ site: string, base: string }}
 */
export function toAstroSiteAndBase(fullResolvedUrl, activeCollection) {
  const seg =
    SEGMENT_BY_COLLECTION[(activeCollection ?? "").toLowerCase().trim()];
  const key = (activeCollection ?? "").toLowerCase().trim();
  try {
    const u = new URL(fullResolvedUrl);
    if (u.hostname.endsWith(".pages.dev")) {
      return { site: u.origin, base: "/" };
    }
    const hub =
      u.hostname === "rockwellpropertiesmaine.com" ||
      u.hostname === "www.rockwellpropertiesmaine.com" ||
      u.hostname === "realtorsatthebeach.com" ||
      u.hostname === "www.realtorsatthebeach.com";
    const fixitgrid =
      u.hostname === "fixitgrid.com" || u.hostname === "www.fixitgrid.com";
    const pathParts = u.pathname.split("/").filter(Boolean);
    if (fixitgrid) {
      return { site: u.origin, base: "/" };
    }
    if (hub && seg) {
      if (key === "plumbing-v2") {
        return { site: u.origin, base: "/plumbing/" };
      }
      if (pathParts.length === 0) {
        return { site: u.origin, base: `/${seg}/` };
      }
      return { site: u.origin, base: `/${pathParts.join("/")}/` };
    }
    if (pathParts.length > 0) {
      return { site: u.origin, base: `/${pathParts.join("/")}/` };
    }
    return { site: u.origin, base: "/" };
  } catch {
    return { site: fullResolvedUrl, base: "/" };
  }
}
