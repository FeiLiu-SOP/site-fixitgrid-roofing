/**
 * GSC seed pages — user-verified local landmarks (manual / Maps driving distance).
 * Keys = entry slug without .md. Only slugs with entries render ServiceAreaLocalLandmarks.
 */
export type SeedLandmarkKind =
  | "mall"
  | "park"
  | "school"
  | "airport"
  | "hospital"
  | "stadium"
  | "other";

export type SeedLandmark = {
  name: string;
  kind: SeedLandmarkKind;
  /** Driving or walking distance from ZIP center (mi), user-verified. */
  distanceMi: number;
};

export type GscSeedLandmarksEntry = {
  landmarks: SeedLandmark[];
};

const RAW: Record<string, GscSeedLandmarksEntry> = {
  "plumbing-columbus-oh-43109": {
    landmarks: [
      { name: "Lowe's Home Improvement", kind: "other", distanceMi: 0.4 },
      { name: "Blacklick Woods Metro Park", kind: "park", distanceMi: 4 },
    ],
  },
  "plumbing-reynoldsburg-oh-43068": {
    landmarks: [
      { name: "AMA Motorcycle Hall of Fame Museum", kind: "other", distanceMi: 3 },
      { name: "Blacklick Woods Metro Park", kind: "park", distanceMi: 2.4 },
    ],
  },
};

export function getGscSeedLandmarks(slug: string): GscSeedLandmarksEntry | null {
  const row = RAW[slug.trim()];
  if (!row?.landmarks.length) return null;
  return row;
}

export function formatLandmarkDistanceMi(mi: number): string {
  if (!Number.isFinite(mi) || mi <= 0) return "nearby";
  if (mi < 1) return `about ${mi.toFixed(1)} mi`;
  const rounded = Math.round(mi * 2) / 2;
  return Number.isInteger(rounded) ? `about ${rounded} mi` : `about ${rounded} mi`;
}

export function buildSeedLandmarksCoverageLine(landmarks: SeedLandmark[]): string {
  const parts = landmarks.map(
    (lm) => `${formatLandmarkDistanceMi(lm.distanceMi)} of ${lm.name}`,
  );
  if (parts.length === 1) return parts[0]!;
  if (parts.length === 2) return `${parts[0]}; ${parts[1]}`;
  return `${parts.slice(0, -1).join("; ")}; ${parts[parts.length - 1]}`;
}
