import { readFileSync } from "node:fs";
import type { NicheJitter } from "./niche-jitter";
import { getNicheJitter } from "./niche-jitter";
import { resolve } from "node:path";

export type DispatchMeshNode = {
  lat: number;
  lng: number;
  label: string;
  active: boolean;
};

export type ProjectedNode = {
  xPct: number;
  yPct: number;
  node: DispatchMeshNode;
};

type CityRow = {
  city: string;
  state_id: string;
  lat: number;
  lng: number;
  population: number;
};

let cachedRows: CityRow[] | null = null;

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

function loadUsCitiesRows(): CityRow[] {
  if (cachedRows) return cachedRows;
  const candidates = [
    resolve(process.cwd(), "uscities.csv"),
    resolve(process.cwd(), "../uscities.csv"),
  ];
  let csv = "";
  for (const csvPath of candidates) {
    try {
      csv = readFileSync(csvPath, "utf-8");
      if (csv) break;
    } catch {
      // try next
    }
  }
  if (!csv) {
    cachedRows = [];
    return cachedRows;
  }

  const lines = csv.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) {
    cachedRows = [];
    return cachedRows;
  }

  const header = parseCsvLine(lines[0]!).map((h) => h.trim().replace(/^"|"$/g, ""));
  const cityIdx = header.indexOf("city");
  const stateIdx = header.indexOf("state_id");
  const latIdx = header.indexOf("lat");
  const lngIdx = header.indexOf("lng");
  const popIdx = header.indexOf("population");
  if (cityIdx === -1 || stateIdx === -1 || latIdx === -1 || lngIdx === -1 || popIdx === -1) {
    cachedRows = [];
    return cachedRows;
  }

  const rows: CityRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = parseCsvLine(lines[i]!);
    const city = (parts[cityIdx] ?? "").trim();
    const state_id = (parts[stateIdx] ?? "").trim().toLowerCase();
    const lat = Number((parts[latIdx] ?? "").trim());
    const lng = Number((parts[lngIdx] ?? "").trim());
    const population = Number((parts[popIdx] ?? "0").trim());
    if (!city || !/^[a-z]{2}$/.test(state_id) || !Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    rows.push({
      city,
      state_id,
      lat,
      lng,
      population: Number.isFinite(population) ? population : 0,
    });
  }
  cachedRows = rows;
  return cachedRows;
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function normalizeCityName(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export function getStateMeshNodes(input: {
  stateCode: string;
  activeCity: string;
  activeLat: number;
  activeLng: number;
  limit?: number;
}): DispatchMeshNode[] {
  const limit = input.limit ?? 20;
  const state = String(input.stateCode ?? "").trim().toLowerCase();
  const activeKey = normalizeCityName(input.activeCity);
  const rows = loadUsCitiesRows().filter((r) => r.state_id === state);
  rows.sort((a, b) => b.population - a.population);

  const picked: DispatchMeshNode[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
    const key = normalizeCityName(row.city);
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push({
      lat: row.lat,
      lng: row.lng,
      label: row.city,
      active: key === activeKey,
    });
    if (picked.length >= limit) break;
  }

  const hasActive = picked.some((n) => n.active);
  if (!hasActive) {
    if (picked.length >= limit) picked.pop();
    picked.unshift({
      lat: input.activeLat,
      lng: input.activeLng,
      label: input.activeCity.trim() || "Local",
      active: true,
    });
  } else {
    for (const node of picked) {
      if (node.active) {
        node.lat = input.activeLat;
        node.lng = input.activeLng;
        node.label = input.activeCity.trim() || node.label;
      }
    }
  }

  return picked.slice(0, limit);
}

function lngToWorldX(lng: number, zoom: number): number {
  return ((lng + 180) / 360) * 256 * 2 ** zoom;
}

function latToWorldY(lat: number, zoom: number): number {
  const latRad = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * 256 * 2 ** zoom;
}

export function computeMeshViewport(input: {
  nodes: DispatchMeshNode[];
  viewportWidth?: number;
  viewportHeight?: number;
  paddingPx?: number;
}): { centerLat: number; centerLng: number; zoom: number } {
  const viewportWidth = input.viewportWidth ?? 400;
  const viewportHeight = input.viewportHeight ?? 300;
  const paddingPx = input.paddingPx ?? 28;

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;
  for (const n of input.nodes) {
    minLat = Math.min(minLat, n.lat);
    maxLat = Math.max(maxLat, n.lat);
    minLng = Math.min(minLng, n.lng);
    maxLng = Math.max(maxLng, n.lng);
  }

  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;

  for (let zoom = 10; zoom >= 4; zoom--) {
    const x1 = lngToWorldX(minLng, zoom);
    const x2 = lngToWorldX(maxLng, zoom);
    const y1 = latToWorldY(minLat, zoom);
    const y2 = latToWorldY(maxLat, zoom);
    const spanX = Math.abs(x2 - x1);
    const spanY = Math.abs(y2 - y1);
    if (spanX <= viewportWidth - paddingPx * 2 && spanY <= viewportHeight - paddingPx * 2) {
      return { centerLat, centerLng, zoom };
    }
  }
  return { centerLat, centerLng, zoom: 4 };
}

export function projectNodesToViewport(input: {
  nodes: DispatchMeshNode[];
  centerLat: number;
  centerLng: number;
  zoom: number;
  viewportWidth?: number;
  viewportHeight?: number;
}): ProjectedNode[] {
  const viewportWidth = input.viewportWidth ?? 400;
  const viewportHeight = input.viewportHeight ?? 300;
  const centerX = lngToWorldX(input.centerLng, input.zoom);
  const centerY = latToWorldY(input.centerLat, input.zoom);

  return input.nodes.map((node) => {
    const x = lngToWorldX(node.lng, input.zoom);
    const y = latToWorldY(node.lat, input.zoom);
    const px = viewportWidth / 2 + (x - centerX);
    const py = viewportHeight / 2 + (y - centerY);
    return {
      xPct: Math.max(2, Math.min(98, (px / viewportWidth) * 100)),
      yPct: Math.max(4, Math.min(96, (py / viewportHeight) * 100)),
      node,
    };
  });
}

export function buildNodeLockTitle(city: string, stateCode: string): string {
  const cityTok =
    city
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "") || "LOCAL";
  const st = String(stateCode ?? "")
    .trim()
    .toUpperCase() || "US";
  return `[NODE_LOCK]: ${cityTok}_SECTOR_${st}`;
}

function formatTickerClock(ms: number): string {
  return new Date(ms).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

/** Live Dispatch Monitor — unique lines only; timestamps back-calculated from build-time clock. */
export function buildDispatchTickerLines(input: {
  city: string;
  stateCode?: string | null;
  zipCode?: string | null;
  county?: string | null;
  entrySlug: string;
  jitter?: NicheJitter;
}): string[] {
  const city = input.city.trim() || "Local";
  const state = String(input.stateCode ?? "").trim().toUpperCase() || "US";
  const zip = /^\d{5}$/.test(String(input.zipCode ?? "").trim())
    ? String(input.zipCode).trim()
    : "00000";
  const county = String(input.county ?? "Regional").trim() || "Regional";
  const seed = stableHash(`${city}|${state}|${input.entrySlug}|dispatch-ticker`);
  const unitPrimary = 700 + (seed % 280);
  const unitReserve = 500 + ((seed >>> 5) % 420);
  const jitter = input.jitter ?? getNicheJitter(input.entrySlug);
  const sigCode = jitter.sigCode;
  const channel = jitter.channel;
  const now = Date.now();

  const lookbacksMs = [
    4_000,
    28_000,
    67_000,
    118_000,
    184_000,
    241_000,
  ].map((base, i) => base + ((seed >>> (i + 2)) % 9) * 1_000);

  const candidates = [
    `[${formatTickerClock(now - lookbacksMs[0]!)}] - Node Sync: ${city} sector armed`,
    `[${formatTickerClock(now - lookbacksMs[1]!)}] - Dispatch: Unit #${unitPrimary} routed to ZIP ${zip}`,
    `[${formatTickerClock(now - lookbacksMs[2]!)}] - Mesh: ${county} uplink ACK (${sigCode})`,
    `[${formatTickerClock(now - lookbacksMs[3]!)}] - Telemetry: ${channel} lock confirmed (${state})`,
    `[${formatTickerClock(now - lookbacksMs[4]!)}] - Sector: standby Unit #${unitReserve} on deck`,
    `[${formatTickerClock(now - lookbacksMs[5]!)}] - Path: satellite corridor nominal`,
  ];

  const seen = new Set<string>();
  const unique: string[] = [];
  for (const line of candidates) {
    if (seen.has(line)) continue;
    seen.add(line);
    unique.push(line);
  }
  return unique;
}

export function filterViewportMeshNodes(projected: ProjectedNode[]): ProjectedNode[] {
  return projected.filter(
    (p) =>
      !p.node.active &&
      p.xPct >= 6 &&
      p.xPct <= 94 &&
      p.yPct >= 8 &&
      p.yPct <= 92,
  );
}
