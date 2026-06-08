/**
 * Strip generator-injected Internal routing markers block from Markdown AST,
 * so rendered HTML has no junk tokens (does not modify source .md).
 */
export function remarkStripRoutingMarkers() {
  return (tree) => {
    strip(tree);
  };
}

function paragraphText(p) {
  let s = "";
  for (const c of p.children || []) {
    if (c.type === "text") s += c.value;
  }
  return s;
}

function strip(node) {
  if (!node?.children) return;
  node.children = node.children.filter((child) => {
    if (child.type === "paragraph") {
      normalizeTextNodes(child);
      const t = paragraphText(child).trim();
      if (/^\s*Internal routing markers:/i.test(t)) return false;
      if (!t) return false;
    }
    strip(child);
    return true;
  });
}

function normalizeTextNodes(node) {
  if (!node) return;
  if (node.type === "text" && typeof node.value === "string") {
    node.value = normalizeSentence(node.value);
    return;
  }
  if (!Array.isArray(node.children)) return;
  for (const child of node.children) {
    normalizeTextNodes(child);
  }
}

function normalizeSentence(input) {
  return (
    input
      // collapse whitespace/newlines in generated prose
      .replace(/\s+/g, " ")
      // remove obvious repeated punctuation artifacts
      .replace(/([,.;:!?])\1+/g, "$1")
      // normalize dangling separator noise around slashes
      .replace(/\s*\/\s*/g, "/")
      // tighten punctuation spacing
      .replace(/\s+([,.;:!?])/g, "$1")
      .replace(/([,.;:!?])([A-Za-z])/g, "$1 $2")
      .trim()
  );
}
