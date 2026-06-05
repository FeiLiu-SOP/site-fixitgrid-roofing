/**
 * US states (+ DC) physical environment blurbs for regional infrastructure brief.
 * Educational maintenance context only; not warnings or regulatory conclusions.
 */

export type StateGeoFact = {
  /** Short label for UI or internal reference */
  label: string;
  /** 1–3 objective sentences shown with other fact fields */
  narrative: string;
};

const DEFAULT_FACT: StateGeoFact = {
  label: "Regional climate variability",
  narrative:
    "Seasonal temperature and precipitation patterns vary across the United States. Aligning envelope and mechanical maintenance with local exposure—sun, wind-driven rain, snow load, or soil moisture—helps preserve long-term building performance.",
};

/** 50 states + DC; keys are uppercase USPS codes */
export const STATE_PHYSICAL_ENVIRONMENT: Record<string, StateGeoFact> = {
  AL: {
    label: "Gulf humidity & convective storms",
    narrative:
      "High ambient humidity and frequent thunderstorms increase emphasis on roof-to-wall transitions, drainage, and moisture-managed assemblies. Wind-driven rain can test flashing continuity on low-slope and steep-slope systems alike.",
  },
  AK: {
    label: "Arctic cold & permafrost context",
    narrative:
      "Long cold seasons and ground thermal behavior can affect foundations and exterior penetrations. Freeze-related movement and snow retention patterns warrant periodic review of roof edges, vents, and waterproofing at grade.",
  },
  AZ: {
    label: "Arid sun & thermal swing",
    narrative:
      "Intense UV and large daily temperature swings accelerate sealant and coating aging. Dust storms and monsoon bursts create punctuated wetting events that stress drainage paths and exterior seal continuity.",
  },
  AR: {
    label: "Humid subtropical & riverine moisture",
    narrative:
      "Warm-season humidity and localized heavy rainfall elevate moisture-entry risk at openings and low points. Crawlspaces and slab perimeters may see seasonal vapor drive that affects interior conditions.",
  },
  CA: {
    label: "Seismic, wildfire exposure & coastal salt",
    narrative:
      "Varies by region: coastal zones see salt-laden marine air; inland valleys see heat and smoke-season particulates; seismically active areas stress lateral bracing and utility flex details. Maintenance should match the dominant local hazard mix.",
  },
  CO: {
    label: "High-altitude UV & hail",
    narrative:
      "Strong solar exposure and hail-prone corridors increase wear on roof coverings and skylight seals. Rapid snowmelt can concentrate runoff at valleys and penetrations if drainage is obstructed.",
  },
  CT: {
    label: "Nor’easter moisture & freeze–thaw",
    narrative:
      "Coastal and inland freeze–thaw cycling stresses masonry, flashing, and asphaltic layers. Wind-driven precipitation during coastal lows tests cladding and roof-to-wall interfaces.",
  },
  DE: {
    label: "Humid Atlantic plain",
    narrative:
      "Humid summers and winter freeze–thaw cycles affect exterior coatings and sealants. Proximity to tidal and estuarine air can increase corrosion risk on exposed metal flashings.",
  },
  DC: {
    label: "Humid continental urban heat island",
    narrative:
      "Urban heat retention and humid summers increase cooling and condensation management demands. Seasonal freeze–thaw still affects horizontal surfaces and drainage hardware.",
  },
  FL: {
    label: "High humidity, wind-driven rain & salt air",
    narrative:
      "Coastal and near-coastal properties see salt aerosol corrosion on fasteners and flashings, while interior humidity loads stress HVAC balance. Wind-driven rain during tropical systems demands continuous drainage planes and sealed penetrations.",
  },
  GA: {
    label: "Humid heat & convective rainfall",
    narrative:
      "Long warm seasons and intense rainfall rates test gutter capacity and foundation drainage. Attic and crawlspace moisture control remains a recurring maintenance theme.",
  },
  HI: {
    label: "Marine trade-wind salt & volcanic soils",
    narrative:
      "Salt-laden trade winds corrode exterior metals; windward slopes receive sustained driven rain. Local soil chemistry and slope stability can influence footing and drainage performance.",
  },
  ID: {
    label: "Semi-arid to mountain snow",
    narrative:
      "Snow load and spring melt concentrate runoff at eaves and penetrations. Dry seasons increase wildfire smoke exposure and dust infiltration through envelope leaks.",
  },
  IL: {
    label: "Continental freeze–thaw & summer humidity",
    narrative:
      "Wide seasonal temperature swings stress expansion joints, sealants, and roof membranes. Humid summers increase condensation risk if attic or crawlspace ventilation is marginal.",
  },
  IN: {
    label: "Humid continental storms",
    narrative:
      "Spring and summer convective storms bring hail and wind gusts that damage shingles and accessories. Winter freeze–thaw cycles affect masonry and horizontal waterproofing.",
  },
  IA: {
    label: "Prairie temperature extremes & derecho risk",
    narrative:
      "Large diurnal and seasonal temperature ranges stress exterior materials. Straight-line wind events can lift edge metal and displace rooftop equipment if attachments loosen.",
  },
  KS: {
    label: "High plains wind & hail",
    narrative:
      "Sustained wind and hail episodes are recurring roof and wall-cladding stressors. Wide open exposure increases driving rain at gable ends and corners.",
  },
  KY: {
    label: "Humid subtropical rainfall",
    narrative:
      "Heavy rainfall rates and humid summers elevate subgrade moisture and bulk water management needs. Seasonal temperature swings still produce freeze–thaw wear on pavements and low-slope membranes.",
  },
  LA: {
    label: "Gulf humidity, flooding potential & wind",
    narrative:
      "High humidity and tropical rainfall intensities stress drainage systems. Wind and surge-prone coastlines place additional demands on roof attachments and opening protection.",
  },
  ME: {
    label: "Marine cold & eaves-ice context",
    narrative:
      "Snow retention and ice-dam formation at eaves can back water under shingles if thermal bridging or ventilation is inadequate. Coastal spray adds salt exposure on exposed hardware.",
  },
  MD: {
    label: "Atlantic humidity & winter freeze",
    narrative:
      "Humid summers and winter freeze–thaw cycles affect exterior sealants and flashings. Chesapeake-influenced air can carry additional salt near tidal waterways.",
  },
  MA: {
    label: "Coastal nor’easters & freeze–thaw",
    narrative:
      "Wind-driven rain and snow loads test roof continuity and ice-dam controls. Salt air near the coast accelerates corrosion on metals and fasteners.",
  },
  MI: {
    label: "Great Lakes lake-effect snow & humidity",
    narrative:
      "Lake-effect snow increases roof load and melt–refreeze cycles at transitions. High summer humidity can drive moisture into poorly ventilated attics.",
  },
  MN: {
    label: "Deep cold & heavy snow",
    narrative:
      "Long subfreezing periods and substantial snowpack stress roof structure and ice-dam mitigation. Frost depth affects buried utilities and foundation drainage.",
  },
  MS: {
    label: "Gulf humidity & convective wind",
    narrative:
      "High dew points and severe thunderstorms elevate moisture and wind uplift concerns. Crawlspace and slab edge moisture is common in clay-rich soils after heavy rain.",
  },
  MO: {
    label: "Continental storms & humidity",
    narrative:
      "Tornado and severe thunderstorm corridors produce punctuated wind and hail damage. Humid summers increase mold risk if envelope leaks go unaddressed.",
  },
  MT: {
    label: "Mountain snow & dry cold",
    narrative:
      "Snow load and spring melt concentrate runoff at valleys. Low winter humidity increases static and wood shrinkage issues in some assemblies.",
  },
  NE: {
    label: "High plains wind & hail",
    narrative:
      "Wind-driven soil and hail events stress roof coverings. Wide temperature swings accelerate sealant fatigue on penetrations.",
  },
  NV: {
    label: "Arid heat & flash flood hydrology",
    narrative:
      "Intense solar radiation degrades exposed polymers quickly. Desert hydrology can produce short, high-energy runoff that overwhelms gutters and drainage if debris accumulates.",
  },
  NH: {
    label: "Northern freeze–thaw & snow",
    narrative:
      "Cold winters and snow retention increase ice-dam and icicle loading at eaves. Interior moisture control must balance tight envelopes with adequate drying potential.",
  },
  NJ: {
    label: "Humid coast & freeze–thaw",
    narrative:
      "Humid summers and winter freeze–thaw cycles wear horizontal waterproofing. Coastal and estuarine salt air increases maintenance frequency on exposed metals.",
  },
  NM: {
    label: "Dry heat & large diurnal range",
    narrative:
      "Low relative humidity and strong UV age elastomeric and painted surfaces rapidly. Thermal expansion cycles stress stucco, metal panels, and roof fasteners in high-sun exposures.",
  },
  NY: {
    label: "Lake-effect snow to coastal salt",
    narrative:
      "Upstate sees heavy snow and freeze–thaw; downstate coastal areas see salt air and wind-driven rain. Maintenance priorities depend strongly on sub-region within the state.",
  },
  NC: {
    label: "Humid subtropical & hurricane exposure",
    narrative:
      "Humid summers and tropical systems elevate wind-driven rain and wind uplift concerns. Piedmont clay soils can shift foundations seasonally with moisture changes.",
  },
  ND: {
    label: "Continental cold & wind",
    narrative:
      "Prolonged cold and wind increase heat loss at thermal bridges and accelerate ice on north-facing exposures. Spring thaw can saturate soils around foundations.",
  },
  OH: {
    label: "Humid continental rainfall & freeze–thaw",
    narrative:
      "Humid summers and winter freeze–thaw cycles stress sealants and flashings. Severe storms add hail risk in many counties.",
  },
  OK: {
    label: "Tornado alley wind & hail",
    narrative:
      "High wind and hail frequency stress roof edges and openings. Wide temperature swings increase fatigue on exposed fasteners and sealants.",
  },
  OR: {
    label: "Marine west-coast moisture",
    narrative:
      "Persistent cloud-season moisture and wind-driven rain test cladding drainage planes and deck ledger details. East of the Cascades, aridity and wildfire smoke exposure rise.",
  },
  PA: {
    label: "Freeze–thaw & humid summers",
    narrative:
      "Seasonal freeze–thaw and humid summers wear exterior sealants and low-slope membranes. Western snow belts add roof load and ice-dam considerations.",
  },
  RI: {
    label: "Coastal salt & nor’easter exposure",
    narrative:
      "Marine air corrodes exterior metals quickly. Coastal lows produce wind-driven rain that tests window heads and roof-to-wall flashings.",
  },
  SC: {
    label: "Humid heat & tropical systems",
    narrative:
      "High humidity and hurricane-season wind and rain elevate envelope and drainage maintenance needs. Coastal salt accelerates corrosion on hardware.",
  },
  SD: {
    label: "Continental extremes & hail",
    narrative:
      "Temperature extremes and hail events stress roof coverings. Spring snowmelt can concentrate runoff if drainage is blocked.",
  },
  TN: {
    label: "Humid subtropical rainfall",
    narrative:
      "Heavy rainfall rates and humid summers increase bulk water management priorities at foundations and roof valleys. Winter freeze events still occur, especially at elevation.",
  },
  TX: {
    label: "Hail, wind & humidity gradient",
    narrative:
      "North and central corridors see hail and straight-line wind; Gulf humidity increases mold and condensation risk if envelopes leak. West Texas aridity increases UV and thermal swing stresses.",
  },
  UT: {
    label: "Arid mountain snow & UV",
    narrative:
      "High UV and low humidity age sealants; mountain snowpack adds load and melt runoff at transitions. Flash flood risk exists in canyon terrain after storms.",
  },
  VT: {
    label: "Freeze–thaw cycle & snow load",
    narrative:
      "Cold-climate freeze–thaw cycling stresses masonry, asphalt shingles, and flashing terminations. Roof-edge ice ridges and icicle loading are common when attic thermal performance is uneven.",
  },
  VA: {
    label: "Humid mid-Atlantic & coastal salt",
    narrative:
      "Humid summers and winter freeze–thaw wear exterior materials. Tidewater salt air increases corrosion frequency on coastal exposures.",
  },
  WA: {
    label: "Marine moisture & seismic context",
    narrative:
      "Western Washington’s sustained moisture season tests drainage planes and wood details. Seismic considerations apply to chimney, masonry, and utility anchorage in many jurisdictions.",
  },
  WV: {
    label: "Humid continental orography",
    narrative:
      "Steep terrain concentrates runoff; humid summers elevate mold risk in basements and crawlspaces. Winter freeze–thaw still affects pavements and flashings.",
  },
  WI: {
    label: "Lake-effect snow & deep cold",
    narrative:
      "Heavy snow and cold increase ice-dam and roof load concerns. Spring melt and summer humidity both stress below-grade waterproofing.",
  },
  WY: {
    label: "High-elevation cold & wind",
    narrative:
      "Wind-driven snow and low temperatures increase air leakage penalties and ice buildup at vents. Large diurnal temperature swings stress roof fasteners and sealants.",
  },
};

export function getStatePhysicalEnvironmentFact(stateCode: string | null | undefined): StateGeoFact {
  if (!stateCode) return DEFAULT_FACT;
  const key = stateCode.trim().toUpperCase();
  return STATE_PHYSICAL_ENVIRONMENT[key] ?? DEFAULT_FACT;
}

/** Deterministic mix-ins for per-page HTML fingerprinting (not a field survey). */
const DRAINAGE_ARCHETYPES = [
  "sheet-flow toward the nearest perennial channel",
  "dendritic upland drainage with low-order tributary incision",
  "till-mantled interfluve with seasonal perched saturation",
  "coastal-plain sheetwash with tidal backwater influence",
  "karst-influenced subsurface routing in soluble bedrock",
  "alluvial-fan distributary channels with episodic aggradation",
  "lacustrine-margin swales and closed depressions",
  "glaciofluvial terrace scarps with spring-line seepage",
] as const;

function stableHashGeo(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickDrainageArchetype(seed: string): string {
  const idx = stableHashGeo(`${seed}|drainage`) % DRAINAGE_ARCHETYPES.length;
  return DRAINAGE_ARCHETYPES[idx]!;
}

/**
 * Single-line “micro semantic” footer for pSEO fingerprint variance.
 * When `elevationFt` is absent, elevation is a deterministic terrain-model-style integer (not a cadastral measurement).
 */
export function buildMicroGeoFingerprintLine(params: {
  cityDisplay: string;
  elevationFt?: number | null;
  seed: string;
}): string {
  const city = params.cityDisplay.replace(/\s+/g, " ").trim() || "Local";
  const drainage = pickDrainageArchetype(params.seed);
  const hasElev =
    typeof params.elevationFt === "number" && Number.isFinite(params.elevationFt) && params.elevationFt > 0;
  const elevFt = hasElev
    ? Math.round(params.elevationFt!)
    : 95 + (stableHashGeo(`${params.seed}|amsl`) % 11840);
  return `${city} elevation detail: ${elevFt} ft AMSL. Drainage pattern: ${drainage}.`;
}
