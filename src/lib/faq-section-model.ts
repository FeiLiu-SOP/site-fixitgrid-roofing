import type { ActiveCollectionKey } from "../active-collection";
import type { FaqItem } from "./seo";
import { getFaqByCollection } from "./seo";

function stableHash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickFaqSubsetStable<T>(items: T[], seedText: string, count: number): T[] {
  const copy = [...items];
  let seed = stableHash(seedText);
  for (let i = copy.length - 1; i > 0; i--) {
    seed = Math.imul(seed ^ (seed >>> 13), 1274126177) >>> 0;
    const j = seed % (i + 1);
    const a = copy[i]!;
    const b = copy[j]!;
    copy[i] = b;
    copy[j] = a;
  }
  return copy.slice(0, Math.min(count, copy.length));
}

/** Five semantically aligned surfaces per slot (stable from slug + index). */
export function surfaceFaqQuestion(slug: string, slotIndex: number, baseQuestion: string): string {
  const q = baseQuestion.trim();
  const bucket = stableHash(`${slug}|faqQ|${slotIndex}`) % 5;

  const mQuick = q.match(/^How quickly can (.+?)\s*\?$/i);
  if (mQuick) {
    const rest = mQuick[1]!.trim();
    const alts = [
      `How quickly can ${rest}?`,
      `What is the typical response window for ${rest}?`,
      `How soon can ${rest} in most service areas?`,
      `When should I expect updates on timing for ${rest}?`,
      `Roughly how fast is dispatch coordination for ${rest}?`,
    ];
    return alts[bucket]!;
  }

  const mDo = q.match(/^Do you (.+?)\s*\?$/i);
  if (mDo) {
    const rest = mDo[1]!.trim();
    const alts = [
      `Do you ${rest}?`,
      `Can you coordinate ${rest}?`,
      `Is help available for ${rest}?`,
      `Does routing cover ${rest}?`,
      `Will intake address ${rest}?`,
    ];
    return alts[bucket]!;
  }

  const mCan = q.match(/^Can you (.+?)\s*\?$/i);
  if (mCan) {
    const rest = mCan[1]!.trim();
    const alts = [
      `Can you ${rest}?`,
      `Are teams able to ${rest}?`,
      `Is it possible to ${rest}?`,
      `Do coordinators help with ${rest}?`,
      `Will intake cover ${rest}?`,
    ];
    return alts[bucket]!;
  }

  const generic = [
    (s: string) => s,
    (s: string) => `Local FAQ: ${s}`,
    (s: string) => `Homeowner question: ${s}`,
    (s: string) => `Intake context: ${s}`,
    (s: string) => `Service desk: ${s}`,
  ];
  return generic[bucket]!(q);
}

export type FaqSectionGeoInput = {
  county?: string;
  zipSample?: string[];
  lat?: number;
  lng?: number;
  localPaths?: string[];
};

function addendumForFaq(
  geo: FaqSectionGeoInput,
  stateCode: string | null | undefined,
  seedText: string,
): string | null {
  const pool = [
    geo.county ? `Local note: County context — ${geo.county}.` : null,
    geo.zipSample?.length ? `Local note: Sample ZIP sectors — ${(geo.zipSample ?? []).slice(0, 5).join(", ")}.` : null,
    stateCode ? `Local note: State routing node — ${stateCode}.` : null,
    typeof geo.lat === "number" && typeof geo.lng === "number"
      ? `Local note: Coordinate anchor — ${geo.lat.toFixed(4)}, ${geo.lng.toFixed(4)}.`
      : null,
    geo.localPaths?.length ? `Local note: Transit markers — ${(geo.localPaths ?? []).slice(0, 2).join("; ")}.` : null,
  ].filter(Boolean) as string[];
  if (!pool.length) return null;
  return stableHash(seedText) % 2 === 0 ? pool[stableHash(`${seedText}|p`) % pool.length]! : null;
}

const FAQ_STABLE_BANKS = 20;

export function buildFaqSectionItems(input: {
  collection: ActiveCollectionKey;
  entrySlug: string;
  stateCode: string | null | undefined;
  geo: FaqSectionGeoInput;
}): FaqItem[] {
  const { collection, entrySlug, stateCode, geo } = input;
  const faqItems = getFaqByCollection(collection);
  // 20 stable FAQ banks: pick bank per page then 3 items under seed to reduce overlap.
  const bankKey = stableHash(`${collection}|${entrySlug}|faqBank`) % FAQ_STABLE_BANKS;
  const picked = pickFaqSubsetStable(
    faqItems,
    `${collection}|${entrySlug}|faqList|${bankKey}`,
    Math.min(3, faqItems.length),
  );
  return picked.map((item, idx) => {
    const add = addendumForFaq(geo, stateCode, `${collection}|${entrySlug}|faqAdd|${idx}`);
    return {
      question: surfaceFaqQuestion(entrySlug, idx, item.question),
      answer: add ? `${item.answer} ${add}` : item.answer,
    };
  });
}
