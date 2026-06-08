/**
 * Astro `site` 与前端 `PUBLIC_SITE_URL` 共用逻辑：
 * - PUBLIC_SITE_URL 仍为 *.pages.dev 时，用已配置的 PUBLIC_CANONICAL_ORIGIN 生成 sitemap。
 * - 裸主域 SITE + 带子路径的 CANONICAL（如 /pestcontrol）时，用 CANONICAL 作站点根，避免 sitemap 少一段路径。
 * @param {{ site?: string, canonical?: string, fallback: string }} p
 */
export function resolvePublicSiteUrl(p) {
  const rawSite = (p.site ?? "").trim() || undefined;
  const rawCanon = (p.canonical ?? "").trim() || undefined;

  const isPagesDev = (u) => {
    if (!u) return false;
    try {
      return new URL(u).hostname.endsWith(".pages.dev");
    } catch {
      return u.includes("pages.dev");
    }
  };

  const norm = (u) => u.replace(/\/+$/, "");

  if (rawSite && !isPagesDev(rawSite)) {
    const ns = norm(rawSite);
    if (rawCanon && !isPagesDev(rawCanon)) {
      const nc = norm(rawCanon);
      if (nc.startsWith(`${ns}/`)) return nc;
    }
    return ns;
  }
  if (rawCanon && !isPagesDev(rawCanon)) return norm(rawCanon);
  if (rawSite) return norm(rawSite);
  if (rawCanon) return norm(rawCanon);
  return p.fallback;
}
