import { ACTIVE_COLLECTION } from "../active-collection";
import { siteConfig } from "../site-config";
import profilesDoc from "../../scripts/brand-visual-profiles.json";

export type BrandVisualProfile = {
  id: string;
  domains: string[];
  auditMode: "commercial" | "church";
  theme: string;
  colorKey: string;
  watermark: string;
  headline: string;
  subline: string;
  heroFilename: string;
  foreignWatermarks: string[];
};

const entities = profilesDoc.entities as Record<string, BrandVisualProfile>;
const collectionEntity = profilesDoc.collectionEntity as Record<string, string>;

/** Entity id for the current build (collection → entity map). */
export function entityIdForActiveCollection(): string | null {
  const key = ACTIVE_COLLECTION;
  return collectionEntity[key] ?? null;
}

export function brandProfileForEntity(entityId: string): BrandVisualProfile | null {
  return entities[entityId] ?? null;
}

export function brandProfileForActiveBuild(): BrandVisualProfile | null {
  const entityId = entityIdForActiveCollection();
  if (!entityId) return null;
  return brandProfileForEntity(entityId);
}

/** Domain origin only (no hub segment), e.g. https://rockwellpropertiesmaine.com */
export function entityOriginBase(): string {
  try {
    return new URL(siteConfig.canonicalOrigin).origin;
  } catch {
    return siteConfig.canonicalOrigin.replace(/\/$/, "");
  }
}

/** Absolute brand hero og:image URL (entity-level, served from domain root /brand/...). */
export function brandHeroOgImageUrl(): string | null {
  const profile = brandProfileForActiveBuild();
  if (!profile) return null;
  const prefix = String(profilesDoc.heroPathPrefix ?? "/brand/images/brand-thumbnails").replace(/\/$/, "");
  const bust = String((profilesDoc as { heroCacheBust?: string }).heroCacheBust ?? "").trim();
  const base = `${entityOriginBase()}${prefix}/${profile.heroFilename}`;
  return bust ? `${base}?v=${encodeURIComponent(bust)}` : base;
}

export function brandHeroPathPrefix(): string {
  return String(profilesDoc.heroPathPrefix ?? "/brand/images/brand-thumbnails");
}

export { profilesDoc as BRAND_VISUAL_PROFILES_DOC };
