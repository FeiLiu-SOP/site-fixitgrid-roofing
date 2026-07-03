/**
 * Commercial detail-page shell copy (Layer C semantic pivot).
 * SSOT for header / service / CTA / phone / calculator sublines — six Rockwell + Realtors hubs.
 */
import type { ActiveCollectionKey } from "../active-collection-keys";
import { stableHash } from "./faq-hydration";

export const COMMERCIAL_DETAIL_COLLECTIONS = [
  "roofing",
  "plumbing",
  "pestcontrol",
  "water-damage",
  "siding-services",
  "plumbing-v2",
] as const;

export type CommercialDetailCollection = (typeof COMMERCIAL_DETAIL_COLLECTIONS)[number];

export function isCommercialDetailCollection(
  key: ActiveCollectionKey,
): key is CommercialDetailCollection {
  return (COMMERCIAL_DETAIL_COLLECTIONS as readonly string[]).includes(key);
}

export interface CommercialDetailCopyInput {
  collection: CommercialDetailCollection;
  nicheLabel: string;
  city: string | null;
  trustPlace: string;
  zip: string;
  countyLabel: string;
  entrySlug: string;
}

export interface CommercialDetailCopy {
  headerVariant: string;
  serviceLine: string;
  ctaVariant: { title: string; meta: string };
  phoneTrustSubtitle: string;
  phoneZipHint: string;
  dispatcherHookupLine: string;
  plumbingVisualLine: string;
  sidingVisualLine: string;
  sidingServiceLeadHtml: string | null;
  officialNodeLine: string;
}

function cityPhrase(city: string | null): string {
  const c = city?.trim();
  return c || "your area";
}

function nicheLower(label: string): string {
  return label.toLowerCase();
}

function pick<T>(items: readonly T[], seed: string): T {
  return items[stableHash(seed) % items.length]!;
}

function sharedPhonePools(input: CommercialDetailCopyInput, nl: string) {
  const { trustPlace, zip } = input;
  return {
    phoneTrustSubtitles: [
      `Licensed & insured local crews serving ${trustPlace}.`,
      `Local ${nl} pros — ${trustPlace} service area.`,
      `${trustPlace} ${nl} — call for scope review and scheduling.`,
      `Insured local ${nl} teams covering ${trustPlace}.`,
      `${trustPlace} property ${nl} — licensed pros on call.`,
    ],
    phoneZipHints: [
      `Service coverage for ZIP ${zip} — ${trustPlace}.`,
      `Local ${nl} availability near ZIP ${zip}.`,
      `Licensed crews serving ZIP ${zip} in ${trustPlace}.`,
      `ZIP ${zip} ${nl} service area — call for timing.`,
      `Property help near ZIP ${zip} (${trustPlace}).`,
    ],
    dispatcherHookupLines: [
      `Local service desk (${input.countyLabel}):`,
      `Licensed ${nl} desk (${input.countyLabel}):`,
      `${input.countyLabel} ${nl} service line:`,
      `Area ${nl} desk (${input.countyLabel}):`,
      `${input.countyLabel} local ${nl} contact:`,
    ],
  };
}

function officialNodeLine(zip: string): string {
  const zip5 = zip.replace(/\D/g, "").slice(0, 5);
  return zip5.length === 5
    ? `Official Node: FixitGrid Licensed Service Area · ZIP ${zip5}`
    : "Official Node: FixitGrid Licensed Service Area";
}

function calculatorLine(city: string | null, trade: string): string {
  const cityP = cityPhrase(city);
  return `Our ${cityP} ${trade} service area uses state-compliant pricing benchmarks. Cross-referenced with regional risk scores to prevent contractor scams.`;
}

type CopyPools = {
  headerVariants: readonly string[];
  serviceLineVariants: readonly string[];
  ctaVariants: readonly { title: string; meta: string }[];
  phoneTrustSubtitles: readonly string[];
  phoneZipHints: readonly string[];
  dispatcherHookupLines: readonly string[];
  plumbingVisualLine: string;
  sidingVisualLine: string;
  sidingServiceLeadHtml: string | null;
};

function poolsFor(input: CommercialDetailCopyInput): CopyPools {
  const { nicheLabel, city, collection } = input;
  const cityP = cityPhrase(city);
  const nl = nicheLower(nicheLabel);
  const phone = sharedPhonePools(input, nl);

  switch (collection) {
    case "roofing":
      return {
        headerVariants: [
          `Licensed roof repair and storm-damage service in ${cityP}`,
          `${cityP} roofing — insured local crews and clear scope notes`,
          `Local shingle and leak repair — ${cityP} service area`,
          `Emergency roof repair options for ${cityP} properties`,
          `${cityP} roof repair — licensed pros with upfront estimates`,
        ],
        serviceLineVariants: [
          `Licensed roofers available for urgent leak and shingle repair in ${cityP}.`,
          `Insured local crews handle storm-damage roof work with practical timelines.`,
          `Same-day roof repair windows may be available for ${cityP} — call for scope review.`,
          `Clear pricing notes and inspection-backed recommendations for ${cityP} roofs.`,
          `Local ${nl} teams serving ${cityP} with transparent appointment communication.`,
        ],
        ctaVariants: [
          {
            title: `24/7 Local ${nicheLabel} Emergency Service`,
            meta: "Licensed crews, transparent pricing, and inspection options where offered.",
          },
          {
            title: `Same-Day ${nicheLabel} Support Options`,
            meta: "Scheduling windows, scope review, and straightforward next-step guidance.",
          },
          {
            title: `${cityP} ${nicheLabel} — Urgent Repair Help`,
            meta: "Local licensed roofers with clear estimates and practical timing.",
          },
          {
            title: `${nicheLabel} Help for Urgent Property Issues`,
            meta: "Appointment planning with insured local crews and pricing clarity.",
          },
          {
            title: `On-Demand ${nicheLabel} Service Availability`,
            meta: "Call-first scheduling with licensed pros and upfront scope notes.",
          },
        ],
        ...phone,
        plumbingVisualLine: calculatorLine(city, "roofing"),
        sidingVisualLine: calculatorLine(city, "roofing"),
        sidingServiceLeadHtml: null,
      };
    case "plumbing":
      return {
        headerVariants: [
          `Licensed ${nl} and pipe repair in ${cityP}`,
          `${cityP} emergency plumber — insured local crews`,
          `Local leak and drain repair — ${cityP} service area`,
          `${cityP} ${nl} — upfront scope notes and licensed pros`,
          `Same-day ${nl} options for ${cityP} homes`,
        ],
        serviceLineVariants: [
          `Licensed plumbers available for urgent leak and drain calls in ${cityP}.`,
          `Insured local crews handle burst pipes and fixture repair with clear estimates.`,
          `Same-day ${nl} windows may be available for ${cityP} — call for scope review.`,
          `Transparent pricing notes and code-aware recommendations for ${cityP} plumbing.`,
          `Local ${nl} teams serving ${cityP} with practical appointment communication.`,
        ],
        ctaVariants: [
          {
            title: `24/7 Local ${nicheLabel} Emergency Service`,
            meta: "Licensed plumbers, transparent pricing, and same-day options where offered.",
          },
          {
            title: `Same-Day ${nicheLabel} Support Options`,
            meta: "Scheduling windows, leak triage, and straightforward next-step guidance.",
          },
          {
            title: `${cityP} ${nicheLabel} — Urgent Repair Help`,
            meta: "Local licensed plumbers with clear estimates and practical timing.",
          },
          {
            title: `${nicheLabel} Help for Urgent Property Issues`,
            meta: "Appointment planning with insured local crews and pricing clarity.",
          },
          {
            title: `On-Demand ${nicheLabel} Service Availability`,
            meta: "Call-first scheduling with licensed pros and upfront scope notes.",
          },
        ],
        ...phone,
        plumbingVisualLine: calculatorLine(city, "plumbing"),
        sidingVisualLine: calculatorLine(city, "plumbing"),
        sidingServiceLeadHtml: null,
      };
    case "plumbing-v2":
      return {
        headerVariants: [
          `Licensed home ${nl} for ${cityP} properties`,
          `${cityP} pipe repair — insured local plumbers`,
          `Local ${nl} and fixture repair — ${cityP}`,
          `${cityP} ${nl} — clear scope notes for homeowners`,
          `Emergency ${nl} options in ${cityP}`,
        ],
        serviceLineVariants: [
          `Licensed plumbers available for urgent home plumbing calls in ${cityP}.`,
          `Insured local crews handle leaks, drains, and fixture repair with clear estimates.`,
          `Same-day ${nl} windows may be available for ${cityP} — call for scope review.`,
          `Homeowner-focused pricing notes and code-aware plumbing guidance for ${cityP}.`,
          `Local ${nl} teams serving ${cityP} with transparent appointment communication.`,
        ],
        ctaVariants: [
          {
            title: `24/7 Local ${nicheLabel} Emergency Service`,
            meta: "Licensed home plumbers, transparent pricing, and scheduling clarity.",
          },
          {
            title: `Same-Day ${nicheLabel} Support Options`,
            meta: "Leak triage, scope review, and straightforward next-step guidance.",
          },
          {
            title: `${cityP} Home ${nicheLabel} — Urgent Help`,
            meta: "Local licensed plumbers with clear estimates and practical timing.",
          },
          {
            title: `${nicheLabel} Help for Urgent Property Issues`,
            meta: "Appointment planning with insured local crews and pricing clarity.",
          },
          {
            title: `On-Demand ${nicheLabel} Service Availability`,
            meta: "Call-first scheduling with licensed pros and upfront scope notes.",
          },
        ],
        ...phone,
        plumbingVisualLine: calculatorLine(city, "plumbing"),
        sidingVisualLine: calculatorLine(city, "plumbing"),
        sidingServiceLeadHtml: null,
      };
    case "pestcontrol":
      return {
        headerVariants: [
          `Licensed ${nl} and inspection in ${cityP}`,
          `${cityP} pest treatment — insured local exterminators`,
          `Local termite and rodent help — ${cityP} service area`,
          `${cityP} ${nl} — inspection-backed treatment plans`,
          `Same-day ${nl} options for ${cityP} properties`,
        ],
        serviceLineVariants: [
          `Licensed pest pros available for urgent infestation calls in ${cityP}.`,
          `Insured local crews handle termite, rodent, and seasonal pest work with clear scope notes.`,
          `Inspection-backed ${nl} plans for ${cityP} — call for timing and coverage.`,
          `Transparent treatment notes and prevention guidance for ${cityP} homes.`,
          `Local ${nl} teams serving ${cityP} with practical appointment communication.`,
        ],
        ctaVariants: [
          {
            title: `24/7 Local ${nicheLabel} Emergency Service`,
            meta: "Licensed pest pros, transparent pricing, and inspection options where offered.",
          },
          {
            title: `Same-Day ${nicheLabel} Support Options`,
            meta: "Treatment windows, scope review, and straightforward next-step guidance.",
          },
          {
            title: `${cityP} ${nicheLabel} — Urgent Treatment Help`,
            meta: "Local licensed exterminators with clear estimates and practical timing.",
          },
          {
            title: `${nicheLabel} Help for Urgent Property Issues`,
            meta: "Appointment planning with insured local crews and pricing clarity.",
          },
          {
            title: `On-Demand ${nicheLabel} Service Availability`,
            meta: "Call-first scheduling with licensed pros and upfront scope notes.",
          },
        ],
        ...phone,
        plumbingVisualLine: calculatorLine(city, "pest control"),
        sidingVisualLine: calculatorLine(city, "pest control"),
        sidingServiceLeadHtml: null,
      };
    case "water-damage":
      return {
        headerVariants: [
          `Licensed water extraction and drying in ${cityP}`,
          `${cityP} flood cleanup — insured restoration crews`,
          `Local structural drying — ${cityP} service area`,
          `${cityP} water damage repair — mold prevention focus`,
          `Emergency water removal options for ${cityP}`,
        ],
        serviceLineVariants: [
          `Licensed restoration crews available for urgent water extraction in ${cityP}.`,
          `Insured local teams handle flood cleanup and structural drying with clear timelines.`,
          `Same-day water removal windows may be available for ${cityP} — call for scope review.`,
          `Moisture mapping and drying plans with transparent notes for ${cityP} properties.`,
          `Local ${nl} teams serving ${cityP} with practical appointment communication.`,
        ],
        ctaVariants: [
          {
            title: `24/7 Local ${nicheLabel} Emergency Service`,
            meta: "Licensed restoration crews, transparent pricing, and drying plans where offered.",
          },
          {
            title: `Same-Day ${nicheLabel} Support Options`,
            meta: "Extraction windows, moisture triage, and straightforward next-step guidance.",
          },
          {
            title: `${cityP} ${nicheLabel} — Urgent Cleanup Help`,
            meta: "Local licensed crews with clear estimates and practical timing.",
          },
          {
            title: `${nicheLabel} Help for Urgent Property Issues`,
            meta: "Appointment planning with insured local crews and pricing clarity.",
          },
          {
            title: `On-Demand ${nicheLabel} Service Availability`,
            meta: "Call-first scheduling with licensed pros and upfront scope notes.",
          },
        ],
        ...phone,
        plumbingVisualLine: calculatorLine(city, "water damage"),
        sidingVisualLine: calculatorLine(city, "water damage"),
        sidingServiceLeadHtml: null,
      };
    case "siding-services":
      return {
        headerVariants: [
          `Licensed siding repair and installation in ${cityP}`,
          `${cityP} exterior siding — insured local crews`,
          `Local siding replacement — ${cityP} service area`,
          `${cityP} siding repair — moisture intrusion and panel work`,
          `Same-day siding repair options for ${cityP}`,
        ],
        serviceLineVariants: [
          `Licensed siding crews available for urgent envelope repair in ${cityP}.`,
          `Insured local teams handle panel replacement and moisture intrusion with clear estimates.`,
          `Same-day siding repair windows may be available for ${cityP} — call for scope review.`,
          `Exterior envelope notes and material guidance for ${cityP} siding projects.`,
          `Local ${nl} teams serving ${cityP} with transparent appointment communication.`,
        ],
        ctaVariants: [
          {
            title: `24/7 Local ${nicheLabel} Emergency Service`,
            meta: "Licensed siding crews, transparent pricing, and on-site scope review.",
          },
          {
            title: `Same-Day ${nicheLabel} Support Options`,
            meta: "Repair windows, photo-based scope review, and next-step guidance.",
          },
          {
            title: `${cityP} ${nicheLabel} — Urgent Repair Help`,
            meta: "Local licensed crews with clear estimates and practical timing.",
          },
          {
            title: `${nicheLabel} Help for Urgent Property Issues`,
            meta: "Appointment planning with insured local crews and pricing clarity.",
          },
          {
            title: `On-Demand ${nicheLabel} Service Availability`,
            meta: "Call-first scheduling with licensed pros and upfront scope notes.",
          },
        ],
        ...phone,
        plumbingVisualLine: calculatorLine(city, "siding"),
        sidingVisualLine: calculatorLine(city, "siding"),
        sidingServiceLeadHtml:
          "<p><strong>On-site siding repair and installation.</strong> This page connects licensed local crews for moisture intrusion, decay at the envelope, and panel replacement — not retail material sales. Share photos and ZIP context for a scope review before scheduling.</p>",
      };
    default: {
      const _exhaustive: never = collection;
      return _exhaustive;
    }
  }
}

export function pickCommercialDetailCopy(input: CommercialDetailCopyInput): CommercialDetailCopy {
  const pools = poolsFor(input);
  const base = `${input.collection}|${input.entrySlug}`;
  return {
    headerVariant: pick(pools.headerVariants, `${base}|header`),
    serviceLine: pick(pools.serviceLineVariants, `${base}|svcLine`),
    ctaVariant: pick(pools.ctaVariants, `${base}|cta`),
    phoneTrustSubtitle: pick(pools.phoneTrustSubtitles, `${base}|phoneTrust`),
    phoneZipHint: pick(pools.phoneZipHints, `${base}|phoneZip`),
    dispatcherHookupLine: pick(pools.dispatcherHookupLines, `${base}|hookup`),
    plumbingVisualLine: pools.plumbingVisualLine,
    sidingVisualLine: pools.sidingVisualLine,
    sidingServiceLeadHtml: pools.sidingServiceLeadHtml,
    officialNodeLine: officialNodeLine(input.zip),
  };
}
