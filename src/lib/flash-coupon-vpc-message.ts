/** Copy for coupon-abandon → Value Protection Calculator popup. */
export function buildFlashCouponVpcPopupMessage(city: string): {
  badge: string;
  headline: string;
} {
  const place = city.trim() || "your area";
  return {
    badge: "Discount Applied!",
    headline: `Your estimated protection value in ${place} is now secured.`,
  };
}
