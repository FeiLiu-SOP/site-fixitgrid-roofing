/**
 * Dispatch radar / war-room mesh — production on city detail pages with geo frontmatter.
 * Rollback: remove DispatchRadar import/wiring in [...slug].astro.
 */

import {
  buildDispatchTickerLines,
  buildNodeLockTitle,
  filterViewportMeshNodes,
  getStateMeshNodes,
  projectNodesToViewport,
  type DispatchMeshNode,
  type ProjectedNode,
} from "./dispatch-radar-nodes";
import {
  COASTAL_ANCHOR_NOTE,
  COASTAL_ZONE_STATUS,
  isCoastalPerimeterState,
  validateLandMass,
} from "./landmass-validation";
import { getNicheJitter, type NicheJitter } from "./niche-jitter";

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Residential street detail: slug-stable 13 or 14 (deeper than legacy z12). */
export function resolveDispatchRadarZoom(entrySlug: string): number {
  return 13 + (stableHash(`${entrySlug}|dispatch-radar-zoom`) % 2);
}

export type OsmTileCell = {
  url: string;
  col: number;
  row: number;
};

export type DispatchRadarBundle = {
  imageUrl?: string;
  tiles?: OsmTileCell[];
  tileGridSize?: number;
  tileSize?: number;
  tileTranslateX?: number;
  tileTranslateY?: number;
  meshNodes: DispatchMeshNode[];
  projectedNodes: ProjectedNode[];
  activeNode: DispatchMeshNode;
  tickerLines: string[];
  nodeLockTitle: string;
  zoneStatus: string | null;
  coastalAnchorNote: string | null;
  landCorrected: boolean;
  jitter: NicheJitter;
  gridFootnote: string;
  alt: string;
  title: string;
  nodeLabel: string;
  zoom: number;
  centerLat: number;
  centerLng: number;
  provider: "google" | "osm-tiles";
};

function formatCoord(n: number): string {
  return n.toFixed(4);
}

function lngToTileX(lng: number, zoom: number): number {
  return ((lng + 180) / 360) * 2 ** zoom;
}

function latToTileY(lat: number, zoom: number): number {
  const latRad = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * 2 ** zoom;
}

export function buildGoogleWarRoomMapUrl(input: {
  centerLat: number;
  centerLng: number;
  zoom: number;
  nodes: DispatchMeshNode[];
  apiKey: string;
  width?: number;
  height?: number;
}): string {
  const width = input.width ?? 400;
  const height = input.height ?? 300;
  const center = `${input.centerLat},${input.centerLng}`;
  const gray = input.nodes
    .filter((n) => !n.active)
    .map((n) => `${n.lat},${n.lng}`)
    .join("|");
  const params = new URLSearchParams({
    center,
    zoom: String(input.zoom),
    size: `${width}x${height}`,
    maptype: "roadmap",
    scale: "2",
    key: input.apiKey,
  });
  if (gray) params.append("markers", `size:small|color:gray|${gray}`);
  params.append("markers", `size:mid|color:red|${center}`);
  return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
}

export function buildOsmTileGrid(input: {
  centerLat: number;
  centerLng: number;
  zoom: number;
  gridSize?: number;
  viewportWidth?: number;
  viewportHeight?: number;
}): {
  tiles: OsmTileCell[];
  gridSize: number;
  tileSize: number;
  translateX: number;
  translateY: number;
} {
  const gridSize = input.gridSize ?? 5;
  const tileSize = 256;
  const viewportWidth = input.viewportWidth ?? 400;
  const viewportHeight = input.viewportHeight ?? 300;
  const half = Math.floor(gridSize / 2);
  const z = input.zoom;

  const xTile = lngToTileX(input.centerLng, z);
  const yTile = latToTileY(input.centerLat, z);
  const centerTileX = Math.floor(xTile);
  const centerTileY = Math.floor(yTile);

  const gridOriginX = (centerTileX - half) * tileSize;
  const gridOriginY = (centerTileY - half) * tileSize;
  const pointX = xTile * tileSize;
  const pointY = yTile * tileSize;

  const translateX = viewportWidth / 2 - (pointX - gridOriginX);
  const translateY = viewportHeight / 2 - (pointY - gridOriginY);

  const tiles: OsmTileCell[] = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      tiles.push({
        url: `https://tile.openstreetmap.org/${z}/${centerTileX - half + col}/${centerTileY - half + row}.png`,
        col,
        row,
      });
    }
  }

  return { tiles, gridSize, tileSize, translateX, translateY };
}

export function buildDispatchRadarBundle(input: {
  lat: number;
  lng: number;
  city: string;
  stateCode: string;
  county?: string | null;
  entrySlug: string;
  zipCode?: string | null;
  googleApiKey?: string | null;
}): DispatchRadarBundle {
  const city = input.city.trim() || "Local";
  const stateCode = String(input.stateCode ?? "").trim().toUpperCase();
  const zip = String(input.zipCode ?? "").trim();
  const zipPart = /^\d{5}$/.test(zip) ? ` ZIP ${zip}` : "";

  const anchored = validateLandMass(input.lat, input.lng, stateCode);
  const centerLat = anchored.lat;
  const centerLng = anchored.lng;
  const latLabel = formatCoord(centerLat);
  const lngLabel = formatCoord(centerLng);
  const zoom = resolveDispatchRadarZoom(input.entrySlug);
  const coastal = isCoastalPerimeterState(stateCode);
  const zoneStatus = coastal ? COASTAL_ZONE_STATUS : null;
  const coastalAnchorNote = coastal ? COASTAL_ANCHOR_NOTE : null;
  const jitter = getNicheJitter(input.entrySlug);

  const meshNodes = getStateMeshNodes({
    stateCode: input.stateCode,
    activeCity: city,
    activeLat: centerLat,
    activeLng: centerLng,
    limit: 20,
  });

  const activeNode =
    meshNodes.find((n) => n.active) ??
    ({
      lat: centerLat,
      lng: centerLng,
      label: city,
      active: true,
    } satisfies DispatchMeshNode);

  activeNode.lat = centerLat;
  activeNode.lng = centerLng;

  const allProjected = projectNodesToViewport({
    nodes: meshNodes,
    centerLat,
    centerLng,
    zoom,
  });
  const projectedNodes = filterViewportMeshNodes(allProjected);
  const inViewGrayNodes = projectedNodes.map((p) => p.node);

  const nodeLockTitle = buildNodeLockTitle(city, stateCode);
  const gridFootnote = "Grid Accuracy: +/- 11m. Satellite Path: Active.";
  const alt = `Residential dispatch lock for ${city}${zipPart} at ${latLabel}, ${lngLabel} (zoom ${zoom}).`;
  const title = `${nodeLockTitle} — ${latLabel}, ${lngLabel}`;
  const nodeLabel = `[NODE_ACTIVE]: SYNC_LAT_${latLabel}`;
  const tickerLines = buildDispatchTickerLines({
    city,
    stateCode,
    zipCode: input.zipCode,
    county: input.county,
    entrySlug: input.entrySlug,
    jitter,
  });

  const apiKey = String(input.googleApiKey ?? "").trim();
  if (apiKey) {
    return {
      imageUrl: buildGoogleWarRoomMapUrl({
        centerLat,
        centerLng,
        zoom,
        nodes: [activeNode, ...inViewGrayNodes],
        apiKey,
      }),
      meshNodes,
      projectedNodes,
      activeNode,
      tickerLines,
      nodeLockTitle,
      zoneStatus,
      coastalAnchorNote,
      landCorrected: anchored.adjusted,
      jitter,
      gridFootnote,
      alt,
      title,
      nodeLabel,
      zoom,
      centerLat,
      centerLng,
      provider: "google",
    };
  }

  const tileGrid = buildOsmTileGrid({
    centerLat,
    centerLng,
    zoom,
  });

  return {
    tiles: tileGrid.tiles,
    tileGridSize: tileGrid.gridSize,
    tileSize: tileGrid.tileSize,
    tileTranslateX: tileGrid.translateX,
    tileTranslateY: tileGrid.translateY,
    meshNodes,
    projectedNodes,
    activeNode,
    tickerLines,
    nodeLockTitle,
    zoneStatus,
    coastalAnchorNote,
    landCorrected: anchored.adjusted,
    jitter,
    gridFootnote,
    alt,
    title,
    nodeLabel,
    zoom,
    centerLat,
    centerLng,
    provider: "osm-tiles",
  };
}

export function dispatchRadarPreviewEnabled(): boolean {
  const flag = String(process.env.DISPATCH_RADAR_PREVIEW ?? "").trim();
  return flag === "1" || flag.toLowerCase() === "true";
}

/** @deprecated use buildDispatchRadarBundle */
export const buildDispatchRadarMap = buildDispatchRadarBundle;
