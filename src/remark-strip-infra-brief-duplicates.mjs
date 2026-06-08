/**
 * Strip body paragraphs duplicated by LocalInfrastructureBrief when
 * frontmatter infraBriefPanel: true (pilot / single-page preview).
 */

function paragraphText(p) {
  let s = "";
  for (const c of p.children || []) {
    if (c.type === "text") s += c.value;
    if (c.type === "strong" && c.children?.[0]?.type === "text") s += c.children[0].value;
  }
  return s;
}

function shouldDropParagraph(text) {
  const t = text.trim();
  if (!t) return true;
  if (/^\*\*Engineering Notice\b/i.test(t)) return true;
  if (/^Engineering Notice\b/i.test(t)) return true;
  if (/^\*\*Regional Infrastructure Brief\b/i.test(t)) return true;
  if (/^Regional infrastructure brief:/i.test(t)) return true;
  if (/^On-site sector marker:/i.test(t)) return true;
  if (/^Service reference:/i.test(t)) return true;
  if (/^ZIP-corridor snapshot/i.test(t)) return true;
  if (/^Regional access notes:/i.test(t)) return true;
  return false;
}

function strip(node) {
  if (!node?.children) return;
  node.children = node.children.filter((child) => {
    if (child.type === "paragraph") {
      const t = paragraphText(child);
      if (shouldDropParagraph(t)) return false;
    }
    strip(child);
    return true;
  });
}

export function remarkStripInfraBriefDuplicates() {
  return (tree, file) => {
    const fm = file?.data?.astro?.frontmatter ?? {};
    if (!fm.infraBriefPanel) return;
    strip(tree);
  };
}
