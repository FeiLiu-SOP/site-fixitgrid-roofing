import type { ActiveCollectionKey } from "../active-collection";
import { isStewardshipCollection } from "./stewardship-legal";
import type { FaqItem } from "./seo";
import { isCommercialContactFaqSeed } from "./commercial-contact-faq-seeds";

const COMMERCIAL_DISPATCH_COLLECTIONS = new Set<ActiveCollectionKey>([
  "roofing",
  "plumbing",
  "pestcontrol",
  "water-damage",
  "siding-services",
  "plumbing-v2",
]);

export function isCommercialDispatchCollection(
  collection: ActiveCollectionKey | string,
): boolean {
  return COMMERCIAL_DISPATCH_COLLECTIONS.has(collection as ActiveCollectionKey);
}

function placeLabel(city: string | null, stateCode: string | null): string {
  const c = city?.trim();
  const st = stateCode?.trim().toUpperCase();
  if (c && st) return `${c}, ${st}`;
  if (c) return c;
  if (st) return st;
  return "this service area";
}

type ContactCopy = { questionLead: string; answerLead: string };

const CONTACT_COPY_BY_COLLECTION: Record<
  "roofing" | "plumbing" | "pestcontrol" | "water-damage" | "siding-services" | "plumbing-v2",
  ContactCopy
> = {
  roofing: {
    questionLead: "roof leak or storm-damage dispatch",
    answerLead:
      "For roofing intake and emergency tarping coordination, call our regional roofing routing desk at",
  },
  plumbing: {
    questionLead: "urgent plumbing or water-line dispatch",
    answerLead:
      "For pressurized leak, drain backup, or shutoff coordination, call our regional plumbing routing desk at",
  },
  pestcontrol: {
    questionLead: "pest or termite service intake",
    answerLead:
      "For pest inspection routing and treatment scheduling questions, call our regional pest-control desk at",
  },
  "water-damage": {
    questionLead: "water mitigation or drying dispatch",
    answerLead:
      "For extraction, moisture monitoring, or mitigation intake, call our regional water-damage routing desk at",
  },
  "siding-services": {
    questionLead: "exterior or siding damage intake",
    answerLead:
      "For siding, envelope, or storm-damage coordination, call our regional exterior routing desk at",
  },
  "plumbing-v2": {
    questionLead: "urgent plumbing dispatch",
    answerLead:
      "For plumbing intake and scope questions, call our regional plumbing routing desk at",
  },
};

const ANSWER_TAIL =
  " Hours and technician availability vary by ZIP. This desk coordinates intake only; on-site work is performed by independent local professionals where available. This is not an insurance determination or licensed inspection.";

/**
 * Visible FAQ + JSON-LD 1:1 (commercial only). Phone must match `siteConfig` for the active build.
 */
export function buildCommercialContactFaqItem(args: {
  collection: ActiveCollectionKey;
  city: string | null;
  stateCode: string | null;
  phoneDisplay: string;
}): FaqItem | null {
  const { collection, city, stateCode, phoneDisplay } = args;
  if (isStewardshipCollection(collection)) return null;
  if (!isCommercialDispatchCollection(collection)) return null;

  const phone = phoneDisplay?.trim();
  if (!phone) return null;

  const copy = CONTACT_COPY_BY_COLLECTION[collection as keyof typeof CONTACT_COPY_BY_COLLECTION];
  if (!copy) return null;

  const place = placeLabel(city, stateCode);

  return {
    question: `How do I contact ${copy.questionLead} for ${place}?`,
    answer: `${copy.answerLead} ${phone}.${ANSWER_TAIL}`,
  };
}

/** Append contact FAQ on seed slugs only (pilot). Dedupes if already present. */
export function appendCommercialContactFaqIfSeed(args: {
  collection: ActiveCollectionKey;
  entrySlug: string;
  city: string | null;
  stateCode: string | null;
  phoneDisplay: string;
  items: FaqItem[];
}): { items: FaqItem[]; hasContactFaq: boolean } {
  if (!isCommercialContactFaqSeed(args.collection, args.entrySlug)) {
    return { items: args.items, hasContactFaq: false };
  }

  const contact = buildCommercialContactFaqItem({
    collection: args.collection,
    city: args.city,
    stateCode: args.stateCode,
    phoneDisplay: args.phoneDisplay,
  });
  if (!contact) return { items: args.items, hasContactFaq: false };

  const already = args.items.some(
    (i) => i.question === contact.question || i.answer.includes(args.phoneDisplay),
  );
  if (already) return { items: args.items, hasContactFaq: true };

  /** Contact intake first so it is visible without scrolling past niche FAQs. */
  return { items: [contact, ...args.items], hasContactFaq: true };
}

export function shouldForceFaqSectionVisible(
  collection: ActiveCollectionKey,
  entrySlug: string,
): boolean {
  return isCommercialContactFaqSeed(collection, entrySlug);
}
