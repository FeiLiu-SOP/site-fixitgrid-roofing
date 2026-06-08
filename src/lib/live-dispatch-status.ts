/**
 * Live dispatch status bar (preview / opt-in).
 * Rollback: unset PUBLIC_LIVE_DISPATCH_STATUS — see docs/LIVE_DISPATCH_STATUS_PREVIEW.md
 */

function stableHash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** Primary US state → IANA (detail pages; edge Worker can reuse same data attrs). */
const STATE_IANA_TZ: Record<string, string> = {
  AL: "America/Chicago",
  AK: "America/Anchorage",
  AZ: "America/Phoenix",
  AR: "America/Chicago",
  CA: "America/Los_Angeles",
  CO: "America/Denver",
  CT: "America/New_York",
  DE: "America/New_York",
  FL: "America/New_York",
  GA: "America/New_York",
  HI: "Pacific/Honolulu",
  ID: "America/Boise",
  IL: "America/Chicago",
  IN: "America/Indiana/Indianapolis",
  IA: "America/Chicago",
  KS: "America/Chicago",
  KY: "America/New_York",
  LA: "America/Chicago",
  ME: "America/New_York",
  MD: "America/New_York",
  MA: "America/New_York",
  MI: "America/Detroit",
  MN: "America/Chicago",
  MS: "America/Chicago",
  MO: "America/Chicago",
  MT: "America/Denver",
  NE: "America/Chicago",
  NV: "America/Los_Angeles",
  NH: "America/New_York",
  NJ: "America/New_York",
  NM: "America/Denver",
  NY: "America/New_York",
  NC: "America/New_York",
  ND: "America/Chicago",
  OH: "America/New_York",
  OK: "America/Chicago",
  OR: "America/Los_Angeles",
  PA: "America/New_York",
  RI: "America/New_York",
  SC: "America/New_York",
  SD: "America/Chicago",
  TN: "America/Chicago",
  TX: "America/Chicago",
  UT: "America/Denver",
  VT: "America/New_York",
  VA: "America/New_York",
  WA: "America/Los_Angeles",
  WV: "America/New_York",
  WI: "America/Chicago",
  WY: "America/Denver",
  DC: "America/New_York",
};

export function liveDispatchStatusEnabled(): boolean {
  const v = String(import.meta.env.PUBLIC_LIVE_DISPATCH_STATUS ?? "")
    .trim()
    .toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

export function resolveIanaTimezone(stateCode: string | null | undefined, lng?: number): string {
  const st = (stateCode ?? "").trim().toUpperCase();
  if (st && STATE_IANA_TZ[st]) return STATE_IANA_TZ[st]!;
  if (typeof lng === "number" && Number.isFinite(lng)) {
    const offset = Math.round(lng / 15);
    if (offset <= -8) return "America/Los_Angeles";
    if (offset <= -6) return "America/Denver";
    if (offset <= -5) return "America/Chicago";
    return "America/New_York";
  }
  return "America/New_York";
}

const BASE_OPEN_MIN = 8 * 60;
const BASE_CLOSE_MIN = 18 * 60;
const HOURS_JITTER_MAX = 30;

const COMMERCIAL_WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
] as const;

function jitterMinutes(seed: number, shift: number): number {
  const bucket = ((seed >> shift) % (HOURS_JITTER_MAX * 2 + 1)) - HOURS_JITTER_MAX;
  return bucket;
}

function fmt24(mins: number): string {
  const hh = String(Math.floor(mins / 60)).padStart(2, "0");
  const mm = String(mins % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

/** 12h display, e.g. 7:45 AM */
export function formatMinutes12h(mins: number): string {
  const h24 = Math.floor(mins / 60) % 24;
  const mm = mins % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(mm).padStart(2, "0")} ${period}`;
}

/**
 * Deterministic per-slug (City_ID proxy) business hours — ±30 min from 8:00 / 18:00.
 * Same slug always yields same window (Jaccard / schema fingerprint).
 */
export function businessHoursForSlug(slug: string): {
  opensMin: number;
  closesMin: number;
  opensLabel: string;
  closesLabel: string;
  opensSchema: string;
  closesSchema: string;
  displayRange: string;
} {
  const h = stableHash(slug || "default");
  const opensMin = BASE_OPEN_MIN + jitterMinutes(h, 0);
  const closesMin = BASE_CLOSE_MIN + jitterMinutes(h, 8);
  const opensLabel = fmt24(opensMin);
  const closesLabel = fmt24(closesMin);
  return {
    opensMin,
    closesMin,
    opensLabel,
    closesLabel,
    opensSchema: opensLabel,
    closesSchema: closesLabel,
    displayRange: `${formatMinutes12h(opensMin)} – ${formatMinutes12h(closesMin)}`,
  };
}

/** schema.org OpeningHoursSpecification[] for LocalBusiness JSON-LD */
export function buildOpeningHoursSpecificationForSlug(slug: string): Record<string, unknown>[] {
  const { opensSchema, closesSchema } = businessHoursForSlug(slug);
  return COMMERCIAL_WEEKDAYS.map((day) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: day,
    opens: opensSchema,
    closes: closesSchema,
  }));
}

/**
 * Detail-page opening hours for Rockwell / Realtors / FixitGrid when rollout flag is on.
 * Same slug → same ±30min window (UI bar + JSON-LD).
 */
export function detailOpeningHoursSpecification(
  entrySlug: string | undefined,
): Record<string, unknown>[] | undefined {
  if (!liveDispatchStatusEnabled()) return undefined;
  const slug = (entrySlug ?? "").trim();
  if (!slug) return undefined;
  return buildOpeningHoursSpecificationForSlug(slug);
}

export function buildLiveDispatchStatusProps(params: {
  city: string;
  stateCode: string | null;
  entrySlug: string;
  lat?: number;
  lng?: number;
}) {
  const city = params.city.trim();
  if (!city) return null;
  const hours = businessHoursForSlug(params.entrySlug);
  const tz = resolveIanaTimezone(params.stateCode, params.lng);
  return { city, tz, ...hours };
}
