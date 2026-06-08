/**
 * Fleet Flash Offer — deterministic amount + countdown per slug/collection.
 * SSR bar in FlashCouponAnchor; JS only ticks the timer.
 */
import type { ActiveCollectionKey } from "../active-collection-keys";

/** 12:00 – 20:00 inclusive (720–1200 s). */
export const FLASH_COUPON_SECONDS_MIN = 720;
export const FLASH_COUPON_SECONDS_MAX = 1200;

/** Commercial hubs that show the red Flash Offer bar (not church / NPO). */
export const COMMERCIAL_FLASH_COUPON_COLLECTIONS = [
  "roofing",
  "plumbing",
  "pestcontrol",
  "water-damage",
  "siding-services",
  "plumbing-v2",
] as const;

export type CommercialFlashCouponCollection = (typeof COMMERCIAL_FLASH_COUPON_COLLECTIONS)[number];

/** Per-vertical amount entropy pools (slug-stable pick). */
export const FLASH_COUPON_AMOUNTS_USD: Record<CommercialFlashCouponCollection, readonly number[]> = {
  pestcontrol: [45, 50, 55, 60],
  /** ~50% of ~$200 service unit — can run higher than pest. */
  "water-damage": [90, 100, 110, 120],
  roofing: [75, 100, 125, 150],
  plumbing: [50, 60, 70, 80],
  "plumbing-v2": [50, 60, 70, 80],
  "siding-services": [50, 60, 70, 80],
};

export function collectionUsesFlashCoupon(
  collection: ActiveCollectionKey,
): collection is CommercialFlashCouponCollection {
  return (COMMERCIAL_FLASH_COUPON_COLLECTIONS as readonly string[]).includes(collection);
}

function flashCouponSlugHash(entrySlug: string): number {
  let h = 2166136261;
  for (let i = 0; i < entrySlug.length; i++) {
    h ^= entrySlug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function flashCouponAmountUsd(
  entrySlug: string,
  collection: CommercialFlashCouponCollection,
): number {
  const pool = FLASH_COUPON_AMOUNTS_USD[collection];
  const h = flashCouponSlugHash(entrySlug);
  return pool[h % pool.length]!;
}

export function flashCouponSeedSeconds(entrySlug: string): number {
  const h = flashCouponSlugHash(entrySlug);
  const span = FLASH_COUPON_SECONDS_MAX - FLASH_COUPON_SECONDS_MIN + 1;
  return FLASH_COUPON_SECONDS_MIN + (h % span);
}

export function formatCountdownMmSs(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

export type FlashCouponBundle = {
  amountUsd: number;
  initialSeconds: number;
  initialLabel: string;
  /** `$XX OFF Emergency [Niche] in [City]` */
  dealLine: string;
  ariaLabel: string;
};

export function buildFlashCouponBundle(input: {
  entrySlug: string;
  city: string;
  nicheLabel: string;
  collection: CommercialFlashCouponCollection;
}): FlashCouponBundle {
  const { entrySlug, city, nicheLabel, collection } = input;
  const amountUsd = flashCouponAmountUsd(entrySlug, collection);
  const initialSeconds = flashCouponSeedSeconds(entrySlug);
  const dealLine = `$${amountUsd} OFF Emergency ${nicheLabel} in ${city}`;
  return {
    amountUsd,
    initialSeconds,
    initialLabel: formatCountdownMmSs(initialSeconds),
    dealLine,
    ariaLabel: `Flash offer: ${amountUsd} dollars off emergency ${nicheLabel.toLowerCase()} in ${city}`,
  };
}
