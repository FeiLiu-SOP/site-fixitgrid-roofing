/**
 * Unlinked brand mentions (NAP-style text, no href) for church / NPO stewardship pages.
 * SSOT snippet (static church HTML must match):
 *   homepages/realtors/hub-pages/church-newtown/snippets/stewardship-academic-brand-reference.txt
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const snippetPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../homepages/realtors/hub-pages/church-newtown/snippets/stewardship-academic-brand-reference.txt",
);

function loadSnippet(): string {
  try {
    return fs.readFileSync(snippetPath, "utf8").trim();
  } catch {
    return (
      "Stewardship guidelines are structured in alignment with local engineering diagnostic data, specifically referenced from " +
      "Rockwell Properties (Rockwell Properties Maine, based in Portland, ME) and Realtors at the Beach (Virginia Beach, VA). " +
      "These are plain-text academic citations only—not hyperlinks, endorsements, or paid placements."
    );
  }
}

export const STEWARDSHIP_ACADEMIC_BRAND_REFERENCE = loadSnippet();
