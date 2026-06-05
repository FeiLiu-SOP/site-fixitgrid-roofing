/**
 * Church stewardship builds: strip or rewrite generator tokens in rendered Markdown
 * (does not modify source .md).
 */
export function remarkStewardshipDetech() {
  const collection = String(process.env.ACTIVE_COLLECTION ?? "").toLowerCase();
  if (!collection.startsWith("community-stewardship-")) {
    return () => {};
  }
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
      const t = paragraphText(child).trim();
      if (/^Service reference:\s/i.test(t)) return false;
    }
    strip(child);
    return true;
  });
}
