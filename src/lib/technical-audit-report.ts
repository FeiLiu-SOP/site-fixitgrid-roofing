import fs from "node:fs";
import path from "node:path";

export const COMMERCIAL_TECHNICAL_AUDIT_COLLECTIONS = new Set([
  "roofing",
  "plumbing",
  "pestcontrol",
  "water-damage",
  "siding-services",
  "plumbing-v2",
]);

export type TechnicalAuditFrontmatter = {
  city?: string;
  state?: string;
  county?: string;
  zipCode?: string;
};

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function stableCode(text: string, slug: string, index: number): string {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const letter = letters[stableHash(`${slug}|${index}|${text}`) % letters.length]!;
  const num = 100 + (stableHash(`${slug}|code|${text}`) % 900);
  return `${letter}-${num}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightLocalTokens(text: string, fm: TechnicalAuditFrontmatter): string {
  let out = escapeHtml(text);
  const city = String(fm.city ?? "").trim();
  const state = String(fm.state ?? "").trim();
  const county = String(fm.county ?? "").trim();
  const zip = String(fm.zipCode ?? "").trim();
  const tokens = [city, county, zip, state ? `${city}, ${state}` : "", state].filter((t) => t.length > 2);
  const seen = new Set<string>();
  for (const tok of tokens.sort((a, b) => b.length - a.length)) {
    const key = tok.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out = out.replace(new RegExp(escapeRegExp(tok), "gi"), '<strong class="cta-loc">$&</strong>');
  }
  if (zip) {
    out = out.replace(
      new RegExp(`\\bZIP\\s*${escapeRegExp(zip)}\\b`, "gi"),
      '<strong class="cta-loc">$&</strong>',
    );
  }
  return out;
}

function classifyParagraph(text: string): "environment" | "field" | "directive" {
  const t = text.toLowerCase();
  if (
    /^(tip|step|service reference|about us|book |request |schedule )/i.test(text) ||
    /serving zip code:/i.test(text) ||
    /^faq:/i.test(text)
  ) {
    return "directive";
  }
  if (
    /\b(soil|moisture|elevation|humidity|mesh label|regional mesh|seasonal cue|terrain|clay|coords?|coordinate|zip-corridor|dispatch sectors|on-site sector|primary zip|wind|thaw|irrigation|psychrometric|drying packet|mitigation ledger)\b/i.test(
      t,
    )
  ) {
    return "environment";
  }
  return "field";
}

function envIcon(text: string): string {
  const t = text.toLowerCase();
  if (/\b(soil|clay|terrain|elevation)\b/.test(t)) return "Terrain";
  if (/\b(moisture|humidity|irrigation)\b/.test(t)) return "Moisture";
  if (/\b(coord|gps|lat|lng|zip-corridor|sector marker)\b/.test(t)) return "GPS";
  return "Env";
}

function renderEnvItem(text: string, fm: TechnicalAuditFrontmatter, slug: string, index: number): string {
  const icon = envIcon(text);
  return `<div class="cta-env-card"><span class="cta-env-icon" aria-hidden="true">[${icon}]</span><p>${highlightLocalTokens(text, fm)}</p></div>`;
}

function renderFieldItem(text: string, fm: TechnicalAuditFrontmatter, slug: string, index: number): string {
  const code = stableCode(text, slug, index);
  return `<div class="cta-field-row"><span class="cta-field-code">[CODE-${code}]</span><p>${highlightLocalTokens(text, fm)}</p></div>`;
}

function renderDirectiveItem(text: string, fm: TechnicalAuditFrontmatter, slug: string, index: number): string {
  const code = stableCode(text, slug, index);
  return `<div class="cta-directive-row"><span class="cta-directive-code">${code}:</span><p>${highlightLocalTokens(text, fm)}</p></div>`;
}

function formatSyncTimestamp(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", {
      timeZone: "UTC",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZoneName: "short",
    });
  } catch {
    return iso;
  }
}

function buildAuditVerdict(nicheLabel: string, city: string, slug: string): string {
  const niche = escapeHtml(nicheLabel.trim() || "service");
  const cityEsc = escapeHtml(city.trim() || "Local");
  const variants = [
    `High vulnerability detected. Immediate ${niche} intervention required for ${cityEsc} residential grid.`,
    `Elevated exposure index logged. Immediate ${niche} routing recommended for ${cityEsc} residential grid.`,
    `Sector stress threshold exceeded. Dispatch ${niche} intake for ${cityEsc} residential grid advised.`,
    `Conducive-risk markers confirmed. Priority ${niche} coordination required in ${cityEsc} residential grid.`,
    `Grid anomaly flagged. Same-day ${niche} response window recommended for ${cityEsc} residential sector.`,
  ];
  const pick = stableHash(`${slug}|auditVerdict`) % variants.length;
  return variants[pick]!;
}

function buildAuditHtml(
  groups: { environment: { text: string }[]; field: { text: string }[]; directive: { text: string }[] },
  fm: TechnicalAuditFrontmatter,
  slug: string,
  auditDate: string,
  syncTimestamp: string,
  nicheLabel: string,
): string {
  const city = escapeHtml(String(fm.city ?? "Local").trim() || "Local");
  const syncLabel = escapeHtml(formatSyncTimestamp(syncTimestamp));
  const verdict = buildAuditVerdict(nicheLabel, String(fm.city ?? "Local"), slug);

  const envBlock = groups.environment.length
    ? `<section class="cta-layer cta-layer--environment" aria-labelledby="cta-env-title">
        <h3 id="cta-env-title" class="cta-layer__title">Environmental Diagnostics</h3>
        <div class="cta-env-grid">${groups.environment.map((item, i) => renderEnvItem(item.text, fm, slug, i)).join("")}</div>
      </section>`
    : "";

  const fieldBlock = groups.field.length
    ? `<section class="cta-layer cta-layer--field" aria-labelledby="cta-field-title">
        <h3 id="cta-field-title" class="cta-layer__title">Field Evaluation Notes</h3>
        <div class="cta-field-list">${groups.field.map((item, i) => renderFieldItem(item.text, fm, slug, i)).join("")}</div>
      </section>`
    : "";

  const directiveBlock = groups.directive.length
    ? `<section class="cta-layer cta-layer--directive" aria-labelledby="cta-directive-title">
        <h3 id="cta-directive-title" class="cta-layer__title">Operational Directives</h3>
        <div class="cta-directive-panel">${groups.directive.map((item, i) => renderDirectiveItem(item.text, fm, slug, i)).join("")}</div>
      </section>`
    : "";

  return `<div class="certified-technical-audit" data-city="${city}">
    <div class="cta-audit-header">CERTIFIED TECHNICAL AUDIT — ${escapeHtml(auditDate)}</div>
    <p class="cta-node-sync" role="status"><span class="cta-node-sync__dot" aria-hidden="true">●</span> Real-time Node Sync Active: <time datetime="${escapeHtml(syncTimestamp)}">${syncLabel}</time></p>
    <div class="cta-audit-body">
      ${envBlock}
      ${fieldBlock}
      ${directiveBlock}
    </div>
    <div class="cta-audit-verdict" role="note"><span class="cta-audit-verdict__label">Audit Verdict</span><p class="cta-audit-verdict__text">${verdict}</p></div>
  </div>`;
}

export function usesTechnicalAuditReport(collection: string): boolean {
  return COMMERCIAL_TECHNICAL_AUDIT_COLLECTIONS.has(collection);
}

const FRONTMATTER_RE = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/;

export function stripMarkdownFrontmatter(raw: string): string {
  return raw.replace(FRONTMATTER_RE, "");
}

/**
 * Astro 6 glob loader may omit `entry.body` in large CF builds (`retainBody` / data store).
 * Fall back to `filePath` or `src/content/<collection>/<id>.md` so audit SSR always runs.
 */
export function resolveCollectionEntryMarkdownBody(
  entry: { body?: string; id?: string; filePath?: string },
  collectionKey: string,
): string {
  const inline = typeof entry.body === "string" ? entry.body.trim() : "";
  if (inline) return inline;

  const candidates: string[] = [];
  const filePath = String(entry.filePath ?? "").trim();
  if (filePath) {
    candidates.push(path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath));
  }

  const id = String(entry.id ?? "")
    .replace(/\\/g, "/")
    .replace(/\.(md|mdx)$/i, "");
  if (id && collectionKey) {
    const contentDir = path.join(process.cwd(), "src", "content", collectionKey);
    candidates.push(
      path.join(contentDir, `${id}.md`),
      path.join(contentDir, `${id}.mdx`),
      path.join(contentDir, `${path.basename(id)}.md`),
      path.join(contentDir, `${path.basename(id)}.mdx`),
    );
  }

  for (const candidate of candidates) {
    try {
      if (!fs.existsSync(candidate)) continue;
      const body = stripMarkdownFrontmatter(fs.readFileSync(candidate, "utf8")).trim();
      if (body) return body;
    } catch {
      /* try next candidate */
    }
  }
  return "";
}

export function parseMarkdownBodyParagraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((block) =>
      block
        .replace(/\r/g, "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join(" ")
        .trim(),
    )
    .filter(Boolean);
}

function isEngineeringNotice(text: string): boolean {
  return /engineering notice for/i.test(text);
}

export function renderEngineeringNoticeHtml(text: string): string {
  const m = text.match(/^\*\*Engineering Notice for (.+?):\*\*\s*(.+)$/i);
  if (m) {
    return `<p class="engineering-notice"><strong>Engineering Notice for ${escapeHtml(m[1]!.trim())}:</strong> ${escapeHtml(m[2]!.trim())}</p>`;
  }
  return `<p class="engineering-notice">${escapeHtml(text)}</p>`;
}

export function buildTechnicalAuditBodyHtml(input: {
  body: string;
  fm: TechnicalAuditFrontmatter;
  slug: string;
  nicheLabel: string;
  auditDate?: string;
  syncTimestamp?: string;
}): { engineeringHtml: string | null; auditHtml: string } | null {
  const paragraphs = parseMarkdownBodyParagraphs(input.body);
  if (paragraphs.length < 4) return null;

  let engineeringHtml: string | null = null;
  const bodyParagraphs: string[] = [];

  for (const text of paragraphs) {
    if (!engineeringHtml && isEngineeringNotice(text)) {
      engineeringHtml = renderEngineeringNoticeHtml(text);
      continue;
    }
    bodyParagraphs.push(text);
  }

  if (bodyParagraphs.length < 3) return null;

  const groups = {
    environment: [] as { text: string }[],
    field: [] as { text: string }[],
    directive: [] as { text: string }[],
  };
  for (const text of bodyParagraphs) {
    groups[classifyParagraph(text)].push({ text });
  }

  const auditDate = input.auditDate ?? new Date().toISOString().slice(0, 10);
  const syncTimestamp = input.syncTimestamp ?? new Date().toISOString();
  return {
    engineeringHtml,
    auditHtml: buildAuditHtml(
      groups,
      input.fm,
      input.slug,
      auditDate,
      syncTimestamp,
      input.nicheLabel,
    ),
  };
}
