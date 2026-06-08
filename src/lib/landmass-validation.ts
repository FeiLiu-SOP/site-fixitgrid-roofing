/**
 * Mirror of root landmass.go — runtime land anchor for DispatchRadar preview.
 * SSOT for generation: landmass.go via main.go.
 */

const LAND_MASS_OFFSET_DEG = 0.03;

const COASTAL_PERIMETER_STATES = new Set(["IL", "WI", "MI", "NY", "CA", "FL", "TX"]);

export function isCoastalPerimeterState(stateCode: string): boolean {
  return COASTAL_PERIMETER_STATES.has(String(stateCode ?? "").trim().toUpperCase());
}

function greatLakesWaterHeuristic(lat: number, lng: number, state: string): boolean {
  if (lat < 41.2 || lat > 46.2 || lng < -91.5 || lng > -82.0) return false;
  switch (state) {
    case "IL":
      return lat >= 42.0 && lat <= 42.95 && lng > -87.92 && lng < -87.78;
    case "WI":
      return lat >= 42.4 && lat <= 45.2 && lng > -87.62;
    case "MI":
      if (lat >= 41.8 && lat <= 46.2 && lng >= -87.4 && lng <= -85.2) {
        return lng > -86.55;
      }
      if (lat >= 43.0 && lat <= 46.5 && lng >= -84.5 && lng <= -82.0) {
        return lng > -83.35;
      }
      return false;
    default:
      return false;
  }
}

function nyCoastalWaterHeuristic(lat: number, lng: number): boolean {
  if (lat >= 40.45 && lat <= 41.15 && lng >= -74.2 && lng <= -71.5) {
    return lng > -73.35 && lat < 40.95;
  }
  if (lat >= 40.55 && lat <= 40.95 && lng >= -74.25 && lng <= -73.65) {
    return lng > -74.02;
  }
  return false;
}

function pacificCoastalWaterHeuristic(lat: number, lng: number): boolean {
  if (lng > -117.0) return false;
  if (lat >= 32.4 && lat <= 34.2 && lng >= -118.8 && lng <= -117.2) {
    return lng < -118.35;
  }
  if (lat >= 37.2 && lat <= 38.2 && lng >= -122.9 && lng <= -121.8) {
    return lng < -122.45;
  }
  return false;
}

function floridaCoastalWaterHeuristic(lat: number, lng: number): boolean {
  if (lat >= 24.3 && lat <= 26.2 && lng >= -82.2 && lng <= -79.8) {
    return lat < 25.35;
  }
  if (lat >= 25.6 && lat <= 28.2 && lng >= -82.0 && lng <= -79.8) {
    return lng > -80.55 && lat < 26.4;
  }
  return false;
}

function texasGulfWaterHeuristic(lat: number, lng: number): boolean {
  if (lat >= 25.8 && lat <= 30.2 && lng >= -97.8 && lng <= -93.5) {
    return lat < 29.2 && lng > -95.8;
  }
  return false;
}

function isLikelyWaterPoint(lat: number, lng: number, state: string): boolean {
  switch (state) {
    case "IL":
    case "WI":
    case "MI":
      return greatLakesWaterHeuristic(lat, lng, state);
    case "NY":
      return nyCoastalWaterHeuristic(lat, lng);
    case "CA":
      return pacificCoastalWaterHeuristic(lat, lng);
    case "FL":
      return floridaCoastalWaterHeuristic(lat, lng);
    case "TX":
      return texasGulfWaterHeuristic(lat, lng);
    default:
      return false;
  }
}

function inlandOffset(state: string, lat: number, lng: number): { dLat: number; dLng: number } {
  switch (state) {
    case "IL":
    case "WI":
      return { dLat: 0, dLng: -LAND_MASS_OFFSET_DEG };
    case "MI":
      if (lng < -86.0) {
        return { dLat: 0, dLng: -LAND_MASS_OFFSET_DEG };
      }
      return { dLat: 0, dLng: LAND_MASS_OFFSET_DEG };
    case "NY":
      return { dLat: LAND_MASS_OFFSET_DEG * 0.35, dLng: -LAND_MASS_OFFSET_DEG };
    case "CA":
      return { dLat: 0, dLng: LAND_MASS_OFFSET_DEG };
    case "FL":
      return { dLat: LAND_MASS_OFFSET_DEG, dLng: 0 };
    case "TX":
      return { dLat: LAND_MASS_OFFSET_DEG * 0.6, dLng: -LAND_MASS_OFFSET_DEG * 0.25 };
    default:
      return { dLat: 0, dLng: 0 };
  }
}

export function validateLandMass(
  lat: number,
  lng: number,
  stateCode: string,
): { lat: number; lng: number; adjusted: boolean } {
  const state = String(stateCode ?? "").trim().toUpperCase();
  if (!COASTAL_PERIMETER_STATES.has(state)) {
    return { lat, lng, adjusted: false };
  }
  if (!isLikelyWaterPoint(lat, lng, state)) {
    return { lat, lng, adjusted: false };
  }
  const { dLat, dLng } = inlandOffset(state, lat, lng);
  return { lat: lat + dLat, lng: lng + dLng, adjusted: true };
}

export const COASTAL_ZONE_STATUS = "Mobile Unit Zone - Coastal Perimeter";

export const COASTAL_ANCHOR_NOTE =
  "Note: Grid anchor represents the regional dispatch radius center, including coastal surveillance zones.";
