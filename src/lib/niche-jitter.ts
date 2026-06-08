/**
 * Mirror of root niche_jitter.go GetNicheJitter — per-slug dispatch diversity tokens.
 */

export type NicheJitter = {
  sigCode: string;
  channel: string;
  hueRotateDeg: number;
};

function stableHashUint32(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Last 4 slug chars → SIG-100..999 & CH-01..99; slug length parity → hue-rotate ±3°. */
export function getNicheJitter(slug: string): NicheJitter {
  const trimmed = String(slug ?? "").trim();
  const tail = trimmed.length >= 4 ? trimmed.slice(-4) : trimmed;
  const h = stableHashUint32(`${tail}|${trimmed}|niche-jitter`);
  const sig = 100 + (h % 900);
  const ch = 1 + ((h >>> 10) % 99);
  const micro = ((h >>> 16) % 61) / 10;
  const hueRaw = trimmed.length % 2 === 1 ? micro - 3 : 3 - micro;
  const hueRotateDeg = Math.round(hueRaw * 10) / 10;
  return {
    sigCode: `SIG-${sig}`,
    channel: `CH-${String(ch).padStart(2, "0")}`,
    hueRotateDeg,
  };
}
