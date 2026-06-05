/**
 * Load niche SSOT from scripts/niche-master.json (notices, forbidden, keywords, aliases).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ACTIVE_COLLECTION_KEYS, type ActiveCollectionKey } from "../active-collection-keys";

/** After Astro bundle, resolve SSOT via cwd / candidate paths */
function resolveNicheMasterJson(): string {
  const candidates = [
    path.join(process.cwd(), "scripts", "niche-master.json"),
    path.join(process.cwd(), "absent-apogee", "scripts", "niche-master.json"),
    path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "scripts", "niche-master.json"),
  ];
  for (const p of candidates) {
    const norm = path.normalize(p);
    if (fs.existsSync(norm)) return norm;
  }
  throw new Error(`[niche-master-data] niche-master.json not found. Tried:\n${candidates.join("\n")}`);
}

export type EngineeringNoticeBlock =
  | { mode: "prefixSuffix"; prefixes: string[]; suffixes: string[] }
  | { mode: "fullLines"; lines: string[] };

export type NicheCollectionRecord = {
  titleSuffix: string;
  dispatchPhone: string;
  nicheKeywords: string[];
  forbiddenPhrases: string[];
  /** Commercial child dist for semantic-scan; church vertical must not mix */
  ciDistHtmlRoot?: string;
  /** Church/NPO compliance audit root (ciAuditProfile=church only) */
  ciChurchDistRoot?: string;
  /** commercial = default; church = compliance-audit-church not commercial forbidden dist */
  ciAuditProfile?: "commercial" | "church";
  aliasPoolOrdered?: string[];
  engineeringNotice: EngineeringNoticeBlock;
};

export type NicheMasterDocument = {
  schemaVersion: number;
  document?: string;
  collections: Record<string, NicheCollectionRecord>;
  goNicheSpecs: Record<string, unknown>;
};

function loadMaster(): NicheMasterDocument {
  const jsonPath = resolveNicheMasterJson();
  const raw = JSON.parse(fs.readFileSync(jsonPath, "utf8")) as NicheMasterDocument;
  if (!raw.collections || typeof raw.collections !== "object") {
    throw new Error("[niche-master-data] niche-master.json: missing collections");
  }
  if (!raw.goNicheSpecs || typeof raw.goNicheSpecs !== "object") {
    throw new Error("[niche-master-data] niche-master.json: missing goNicheSpecs");
  }
  for (const key of ACTIVE_COLLECTION_KEYS) {
    if (!raw.collections[key]) {
      throw new Error(`[niche-master-data] niche-master.json missing collection "${key}"`);
    }
  }
  for (const k of Object.keys(raw.collections)) {
    if (!ACTIVE_COLLECTION_KEYS.includes(k as ActiveCollectionKey)) {
      throw new Error(`[niche-master-data] niche-master.json unknown collection "${k}"`);
    }
  }
  for (const key of ACTIVE_COLLECTION_KEYS) {
    if (!raw.goNicheSpecs[key]) {
      throw new Error(`[niche-master-data] niche-master.json missing goNicheSpecs["${key}"]`);
    }
  }
  for (const key of ACTIVE_COLLECTION_KEYS) {
    const c = raw.collections[key]!;
    if (!c.titleSuffix?.trim()) throw new Error(`[niche-master-data] empty titleSuffix: ${key}`);
    if (!c.dispatchPhone?.trim()) throw new Error(`[niche-master-data] empty dispatchPhone: ${key}`);
    if (!c.nicheKeywords?.length) throw new Error(`[niche-master-data] empty nicheKeywords: ${key}`);
    if (!c.forbiddenPhrases?.length) throw new Error(`[niche-master-data] empty forbiddenPhrases: ${key}`);
    if (!c.engineeringNotice) throw new Error(`[niche-master-data] missing engineeringNotice: ${key}`);
  }
  for (const key of ACTIVE_COLLECTION_KEYS) {
    const c = raw.collections[key]!;
    const profile = c.ciAuditProfile ?? "commercial";
    if (profile === "church") {
      if (c.ciDistHtmlRoot?.trim()) {
        throw new Error(
          `[niche-master-data] ${key}: ciAuditProfile=church must not set ciDistHtmlRoot (commercial scan isolation)`,
        );
      }
      if (!c.ciChurchDistRoot?.trim()) {
        throw new Error(`[niche-master-data] ${key}: ciAuditProfile=church requires ciChurchDistRoot`);
      }
    } else {
      if (c.ciChurchDistRoot?.trim()) {
        throw new Error(`[niche-master-data] ${key}: ciChurchDistRoot only allowed when ciAuditProfile=church`);
      }
    }
  }
  return raw;
}

const NICHE_MASTER: NicheMasterDocument = loadMaster();

const engineeringLexiconCache = new Map<ActiveCollectionKey, readonly string[]>();

function expandEngineeringNotice(notice: EngineeringNoticeBlock): readonly string[] {
  if (notice.mode === "fullLines") {
    return notice.lines.map((s) => s.replace(/\s+/g, " ").trim());
  }
  return notice.prefixes.flatMap((p) =>
    notice.suffixes.map((s) => `${p} ${s}`.replace(/\s+/g, " ").trim()),
  );
}

export function getNicheMaster(): Readonly<NicheMasterDocument> {
  return NICHE_MASTER;
}

export function getNicheCollection(key: ActiveCollectionKey): Readonly<NicheCollectionRecord> {
  const row = NICHE_MASTER.collections[key];
  if (!row) throw new Error(`[niche-master-data] missing collection ${key}`);
  return row;
}

export function getEngineeringLexicon(collectionKey: ActiveCollectionKey): readonly string[] {
  let cached = engineeringLexiconCache.get(collectionKey);
  if (!cached) {
    const row = getNicheCollection(collectionKey);
    const lex = expandEngineeringNotice(row.engineeringNotice);
    if (!lex.length) {
      throw new Error(`[niche-master-data] empty engineeringNotice for ${collectionKey}`);
    }
    cached = Object.freeze(lex);
    engineeringLexiconCache.set(collectionKey, cached);
  }
  return cached;
}

/** Realtors/hub title pools; order must match Go stableHashUint32 modulo. */
export function getAliasPoolOrdered(collectionKey: ActiveCollectionKey): readonly string[] | undefined {
  const pool = getNicheCollection(collectionKey).aliasPoolOrdered;
  if (!pool?.length) return undefined;
  return pool;
}

export const NICHE_DIST_ROOT_RELATIVE: Partial<Record<ActiveCollectionKey, string>> = ACTIVE_COLLECTION_KEYS.reduce(
  (acc, key) => {
    const rel = getNicheCollection(key).ciDistHtmlRoot?.trim();
    if (rel) acc[key] = rel;
    return acc;
  },
  {} as Partial<Record<ActiveCollectionKey, string>>,
);
