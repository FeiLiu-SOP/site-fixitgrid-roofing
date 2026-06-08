import type { ActiveCollectionKey } from "../active-collection";
import type { FaqItem } from "./seo";

export type FaqPriorityGroup = "insurance" | "warranty";

export type FaqPoolItem = FaqItem & {
  priorityGroup?: FaqPriorityGroup;
};

export type FaqHydrationContext = {
  collection: ActiveCollectionKey;
  entrySlug: string;
  city: string;
  county: string;
  state: string | null;
  zillowHomeValueUsd: number | null;
  localPaths: string[];
  elevationFt: number | null;
};

export function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function formatZillowUsdPublic(usd: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(usd);
}

/** Slot 1 — asset preservation (Zillow). */
function buildSlot1Hook(ctx: FaqHydrationContext): string {
  if (ctx.zillowHomeValueUsd != null && ctx.zillowHomeValueUsd > 0) {
    const label = formatZillowUsdPublic(ctx.zillowHomeValueUsd);
    return `illustrative median near ${label} supports asset-preservation framing before permanent scope is approved`;
  }
  return `local asset context in ${ctx.city} should be weighed before approving major replacement spend`;
}

/** Slot 2 — neighborhood dispatch (localPaths / sector markers). */
function buildSlot2Identity(ctx: FaqHydrationContext, seed: string): string {
  const paths = ctx.localPaths.filter((p) => p.trim().length > 0);
  if (paths.length > 0) {
    const idx = stableHash(`${seed}|slot2`) % paths.length;
    const marker = paths[idx]!.trim();
    return `neighborhood dispatch markers include ${marker} for corridor routing and crew staging`;
  }
  return `county-grid routing for ${ctx.county || ctx.city} anchors intake staging before crews mobilize`;
}

/** Slot 3 — environmental load (elevation). */
function buildSlot3Engineering(ctx: FaqHydrationContext): string {
  if (ctx.elevationFt != null && Number.isFinite(ctx.elevationFt)) {
    return `environmental load calibration references ~${ctx.elevationFt} ft elevation band for wind, drainage, and drying context`;
  }
  return `terrain and exposure context for ${ctx.city} should inform material and timeline assumptions`;
}

export function buildLocalDataPointForSlot(
  slotIndex: number,
  ctx: FaqHydrationContext,
  seed: string,
): string {
  const slot = (slotIndex % 3) + 1;
  if (slot === 1) return buildSlot1Hook(ctx);
  if (slot === 2) return buildSlot2Identity(ctx, seed);
  return buildSlot3Engineering(ctx);
}

/** Resolve `{a|b|c}` spintax with stable per-seed choice. */
export function resolveSpintax(text: string, seed: string): string {
  let out = text;
  let guard = 0;
  while (out.includes("{") && out.includes("|") && out.includes("}") && guard < 64) {
    guard += 1;
    const start = out.indexOf("{");
    const end = out.indexOf("}", start);
    if (end < 0) break;
    const inner = out.slice(start + 1, end);
    if (!inner.includes("|")) break;
    const options = inner.split("|").map((s) => s.trim()).filter(Boolean);
    if (!options.length) break;
    const pick = stableHash(`${seed}|spintax|${guard}|${start}`) % options.length;
    out = out.slice(0, start) + options[pick]! + out.slice(end + 1);
  }
  return out;
}

function pickFaqSubsetStable<T>(items: T[], seedText: string, count: number): T[] {
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

function shuffleStable<T>(items: T[], seedText: string): T[] {
  return pickFaqSubsetStable(items, `${seedText}|shuffle`, items.length);
}

export function pickWeightedFaqPool(
  pool: FaqPoolItem[],
  ctx: Pick<FaqHydrationContext, "collection" | "entrySlug">,
  count = 5,
): FaqPoolItem[] {
  if (pool.length <= count) return [...pool];

  const usePriority =
    ctx.collection === "roofing" &&
    stableHash(`${ctx.collection}|${ctx.entrySlug}|faqPriority`) % 100 < 75;

  if (!usePriority) {
    return pickFaqSubsetStable(pool, `${ctx.collection}|${ctx.entrySlug}|faq`, count);
  }

  const insurance = pool.find((p) => p.priorityGroup === "insurance");
  const warranty = pool.find((p) => p.priorityGroup === "warranty");
  const regular = pool.filter((p) => !p.priorityGroup);

  const forced: FaqPoolItem[] = [];
  if (insurance) forced.push(insurance);
  if (warranty) forced.push(warranty);

  const restCount = Math.max(0, count - forced.length);
  const rest = pickFaqSubsetStable(regular, `${ctx.collection}|${ctx.entrySlug}|faqRest`, restCount);
  return shuffleStable([...forced, ...rest], `${ctx.collection}|${ctx.entrySlug}|faqOrder`);
}

function ensureLocalizationPlaceholders(text: string): string {
  const hasCity = text.includes("{{city}}");
  const hasCounty = text.includes("{{county}}");
  const hasLocal = text.includes("{{localDataPoint}}");
  if (hasCity && hasCounty && hasLocal) return text;
  if (hasLocal && (!hasCity || !hasCounty)) {
    return `${text.trim()} Intake context for {{city}}, {{county}}.`;
  }
  if (!hasLocal && hasCity && hasCounty) {
    return `${text.trim()} {{localDataPoint}}.`;
  }
  return `${text.trim()} In {{city}}, {{county}}, {{localDataPoint}}.`;
}

export function hydrateFaqItem(
  item: FaqPoolItem,
  slotIndex: number,
  ctx: FaqHydrationContext,
): FaqItem {
  const seed = `${ctx.collection}|${ctx.entrySlug}|faqHydrate|${slotIndex}|${item.question.slice(0, 24)}`;
  const localDataPoint = buildLocalDataPointForSlot(slotIndex, ctx, seed);
  const countyLabel = ctx.county.trim() || `${ctx.city} area`;
  const stateSuffix = ctx.state ? `, ${ctx.state}` : "";

  const replaceTokens = (raw: string, appendLocalizationTail: boolean) => {
    let text = raw;
    if (appendLocalizationTail) {
      text = ensureLocalizationPlaceholders(text);
    }
    // Must resolve {{city}}/{{county}} before spintax: `{{city}}` contains `}` and
    // otherwise truncates `{a|b}` blocks at the first mustache closing brace.
    text = text
      .replaceAll("{{city}}", ctx.city)
      .replaceAll("{{county}}", countyLabel)
      .replaceAll("{{state}}", ctx.state ?? "")
      .replaceAll("{{cityState}}", `${ctx.city}${stateSuffix}`)
      .replaceAll("{{localDataPoint}}", localDataPoint);
    return resolveSpintax(text, seed);
  };

  return {
    question: replaceTokens(item.question, false).replace(/\s+/g, " ").trim(),
    answer: replaceTokens(item.answer, true).replace(/\s+/g, " ").trim(),
  };
}

export function buildHydratedPageFaqs(
  pool: FaqPoolItem[],
  ctx: FaqHydrationContext,
  count = 5,
): FaqItem[] {
  const picked = pickWeightedFaqPool(pool, ctx, count);
  return picked.map((item, idx) => hydrateFaqItem(item, idx, ctx));
}

/** Deterministic fingerprint for HTML vs JSON-LD parity checks. */
export function faqItemsContentHash(items: FaqItem[]): string {
  const payload = items.map((i) => `${i.question}\n${i.answer}`).join("\n---\n");
  return String(stableHash(payload));
}
