/**
 * @deprecated Import from `./flash-coupon` — kept for pest biodiversity gate aliases.
 */
import {
  buildFlashCouponBundle,
  flashCouponAmountUsd,
  flashCouponSeedSeconds,
  FLASH_COUPON_SECONDS_MAX,
  FLASH_COUPON_SECONDS_MIN,
  formatCountdownMmSs,
  type FlashCouponBundle,
} from "./flash-coupon";

export const PEST_FLASH_COUPON_AMOUNTS_USD = [45, 50, 55, 60] as const;
export const PEST_FLASH_COUPON_SECONDS_MIN = FLASH_COUPON_SECONDS_MIN;
export const PEST_FLASH_COUPON_SECONDS_MAX = FLASH_COUPON_SECONDS_MAX;

export type PestFlashCouponBundle = FlashCouponBundle;

export function pestFlashCouponAmountUsd(entrySlug: string): number {
  return flashCouponAmountUsd(entrySlug, "pestcontrol");
}

export function pestFlashCouponSeedSeconds(entrySlug: string): number {
  return flashCouponSeedSeconds(entrySlug);
}

export { formatCountdownMmSs };

export function buildPestFlashCouponBundle(input: {
  entrySlug: string;
  city: string;
  nicheLabel: string;
}): PestFlashCouponBundle {
  return buildFlashCouponBundle({ ...input, collection: "pestcontrol" });
}
