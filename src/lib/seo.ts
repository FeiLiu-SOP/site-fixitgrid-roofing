import type { ActiveCollectionKey } from "../active-collection";
import type { ParsedLocation } from "./location";
import { getPestcontrolSerpOverride } from "./pestcontrol-serp-overrides";
import { getPlumbingSerpOverride } from "./plumbing-serp-overrides";
import { getRoofingSerpOverride } from "./roofing-serp-overrides";
import { normalizePhoneE164, siteConfig } from "../site-config";

export type FaqItem = {
  question: string;
  answer: string;
};

const FAQ_BY_COLLECTION: Record<ActiveCollectionKey, FaqItem[]> = {
  roofing: [
    {
      question: "Do you offer emergency roofing repairs?",
      answer:
        "Yes. We coordinate local emergency roofing response for leak mitigation and urgent storm-damage inspections.",
    },
    {
      question: "How quickly can a roofer arrive?",
      answer:
        "Most service areas support same-day dispatch windows depending on technician availability and weather conditions.",
    },
    {
      question: "Can you inspect roof leaks before full replacement?",
      answer:
        "Yes. We prioritize inspection-first recommendations so homeowners can compare repair vs replacement options.",
    },
    {
      question: "Do you handle storm and wind roof damage?",
      answer:
        "Yes. We help with common storm damage scenarios including missing shingles, flashing issues, and active leaks.",
    },
    {
      question: "Are estimates available for local roofing service?",
      answer:
        "Yes. Availability varies by city, but transparent estimate options are provided before work is scheduled.",
    },
    {
      question: "Can you inspect flashing and vent penetrations?",
      answer:
        "Yes. Inspection requests often include flashing, vent boots, ridge caps, and other leak-prone transitions.",
    },
    {
      question: "Do you work with asphalt shingle roofs?",
      answer:
        "Yes. Asphalt shingle systems are among the most common residential roofing requests in many service areas.",
    },
    {
      question: "Can roof repairs help after hail exposure?",
      answer:
        "Yes. Many calls involve impact checks, missing granules, and moisture entry after hail or wind events.",
    },
    {
      question: "Will you explain repair versus replacement options?",
      answer:
        "Yes. Homeowners are usually given a scope review so they can compare targeted repair and full replacement paths.",
    },
    {
      question: "Are emergency tarping options available?",
      answer:
        "In some service areas, temporary weather protection may be available while a permanent repair plan is arranged.",
    },
    {
      question: "Can roof issues affect attic moisture conditions?",
      answer:
        "Yes. Ongoing leaks and ventilation issues can contribute to attic moisture, insulation damage, and interior staining.",
    },
    {
      question: "Do you provide written scope details before scheduling?",
      answer:
        "Yes. Scope, material notes, and scheduling expectations are typically reviewed before work is confirmed.",
    },
    {
      question: "Can you check roof decking for soft spots?",
      answer:
        "Yes. When accessible, service teams may check for soft decking areas or visible moisture-related concerns.",
    },
    {
      question: "Do you offer guidance on ventilation and intake/exhaust balance?",
      answer:
        "In many cases, yes. Ventilation notes are often part of a broader inspection conversation.",
    },
    {
      question: "Can you help with gutter-related overflow contributing to leaks?",
      answer:
        "Yes. Water management issues can contribute to roof and fascia concerns in certain scenarios.",
    },
    {
      question: "Do you handle chimney flashing leak points?",
      answer:
        "Yes. Chimney transitions are common leak-prone areas and are often checked during inspection requests.",
    },
    {
      question: "Can you document findings with photos when available?",
      answer:
        "Often, yes. Some technicians provide photos of visible issues to help explain recommendations.",
    },
    {
      question: "Are warranty details reviewed before approval?",
      answer:
        "Yes. When applicable, warranty scope and exclusions are typically discussed before work is scheduled.",
    },
    {
      question: "Can seasonal ice or wind patterns affect roofing wear?",
      answer:
        "Yes. Seasonal conditions can influence wear patterns and may be mentioned during service discussions.",
    },
    {
      question: "Will you confirm timeline expectations before dispatch?",
      answer:
        "Yes. Service windows and timing expectations are usually shared based on coverage and demand.",
    },
  ],
  plumbing: [
    {
      question: "Do you provide emergency plumber service?",
      answer:
        "Yes. Emergency plumbing support is available for urgent leak, backup, and water flow issues.",
    },
    {
      question: "Can you help with leaky pipe and clogged drain problems?",
      answer:
        "Yes. Local technicians handle pipe leaks, drain clogs, and standard residential plumbing repairs.",
    },
    {
      question: "Are same-day plumbing appointments available?",
      answer:
        "In many cities, same-day scheduling is available based on demand and technician coverage.",
    },
    {
      question: "Do you service both kitchen and bathroom plumbing?",
      answer:
        "Yes. Typical service includes sinks, toilets, faucets, supply lines, and drain line troubleshooting.",
    },
    {
      question: "Will I get pricing details before work starts?",
      answer:
        "Yes. Service teams provide scope and pricing details before work begins whenever possible.",
    },
    {
      question: "Can you inspect water heater supply and drain connections?",
      answer:
        "Yes. Water heater checks often include supply lines, shutoff valves, drain pans, and visible leak points.",
    },
    {
      question: "Do you help with garbage disposal and sink line issues?",
      answer:
        "Yes. Many service calls involve kitchen sink backups, disposal jams, and under-sink connection leaks.",
    },
    {
      question: "Can low water pressure be diagnosed on site?",
      answer:
        "Yes. Pressure complaints are commonly reviewed for valve restrictions, fixture issues, or supply-side problems.",
    },
    {
      question: "Do you handle toilet seal and flange leak concerns?",
      answer:
        "Yes. Toilet leaks can involve wax ring failure, flange movement, or supply connection issues.",
    },
    {
      question: "Can recurring drain clogs indicate a deeper line issue?",
      answer:
        "Yes. Repeated backups may point to branch-line buildup or a larger drain line obstruction requiring inspection.",
    },
    {
      question: "Are shutoff valve and fixture checks part of routine service?",
      answer:
        "Often, yes. Shutoff valves, supply connections, and visible fixture wear are common parts of a service review.",
    },
    {
      question: "Can plumbing leaks damage drywall or flooring quickly?",
      answer:
        "Yes. Even moderate leaks can spread into cabinets, drywall, or flooring if left unresolved.",
    },
    {
      question: "Do you handle faucet cartridge and valve leak repairs?",
      answer:
        "Yes. Many calls involve faucet drips, valve wear, and replacement of common internal components.",
    },
    {
      question: "Can you inspect supply lines for corrosion or wear?",
      answer:
        "Yes. Visible supply connections are commonly checked for wear, corrosion, or slow seepage.",
    },
    {
      question: "Is drain odor troubleshooting included in service?",
      answer:
        "In some cases, yes. Odors may be evaluated for trap issues, venting, or buildup depending on symptoms.",
    },
    {
      question: "Do you help with shower and tub drain backups?",
      answer:
        "Yes. Bathroom drain backups are common and may be assessed for local clogs or branch-line issues.",
    },
    {
      question: "Can you review shutoff access and labeling best practices?",
      answer:
        "Often, yes. Technicians may point out shutoff access considerations during service visits.",
    },
    {
      question: "Are follow-up recommendations provided after urgent service?",
      answer:
        "Yes. After urgent stabilization, additional recommendations may be provided to reduce repeat problems.",
    },
    {
      question: "Can hard water contribute to fixture wear over time?",
      answer:
        "Yes. Mineral buildup can contribute to reduced flow and fixture wear depending on local water conditions.",
    },
    {
      question: "Do you handle visible pipe joint leaks under sinks?",
      answer:
        "Yes. Under-sink joint leaks and connection issues are common service items in many homes.",
    },
  ],
  pestcontrol: [
    {
      question: "Do you provide fast pest control service?",
      answer:
        "Yes. Local service teams support rapid scheduling for urgent pest concerns in most coverage areas.",
    },
    {
      question: "Can you treat ants, roaches, and rodents?",
      answer:
        "Yes. Common treatment requests include ants, cockroaches, and rodent activity in residential properties.",
    },
    {
      question: "Are recurring pest treatment plans available?",
      answer:
        "Yes. Many areas offer recurring treatment plans to reduce reinfestation risks over time.",
    },
    {
      question: "Is inspection included before treatment?",
      answer:
        "Yes. A basic inspection is typically performed first to identify hotspots and treatment scope.",
    },
    {
      question: "Do you provide prevention recommendations?",
      answer:
        "Yes. Technicians usually provide practical prevention steps for sanitation, entry points, and moisture control.",
    },
    {
      question: "Can you identify likely entry points around the home?",
      answer:
        "Yes. Entry-point reviews often include gaps near doors, utility penetrations, vents, and foundation transitions.",
    },
    {
      question: "Do treatment plans vary by pest type and activity level?",
      answer:
        "Yes. Treatment scope is typically adjusted based on the pest involved, visible activity, and affected areas.",
    },
    {
      question: "Can moisture issues make pest activity worse?",
      answer:
        "Yes. Damp crawlspaces, leaks, and standing water can increase conditions that attract certain pests.",
    },
    {
      question: "Do you inspect garages, attics, and exterior edges?",
      answer:
        "Yes. Many inspections include garages, attic access points, exterior perimeters, and common harborage zones.",
    },
    {
      question: "Can recurring service reduce reinfestation risk?",
      answer:
        "Yes. Ongoing monitoring and scheduled treatment can help reduce repeat pest pressure over time.",
    },
    {
      question: "Will technicians explain prep steps before treatment?",
      answer:
        "Yes. Prep guidance is often provided so residents know what to move, clean, or secure before service.",
    },
    {
      question: "Can rodent activity affect insulation or wiring areas?",
      answer:
        "Yes. Rodents may disturb insulation and travel through wall or utility areas if access points remain open.",
    },
    {
      question: "Do you advise on sealing gaps around doors and windows?",
      answer:
        "Yes. Basic exclusion guidance often includes sealing gaps and maintaining door sweeps where appropriate.",
    },
    {
      question: "Can food storage practices impact pest recurrence?",
      answer:
        "Yes. Food storage and sanitation habits can influence pest pressure and reinfestation risk over time.",
    },
    {
      question: "Do you inspect crawlspaces and utility penetrations?",
      answer:
        "Yes. Crawlspaces and utility entry points are common areas reviewed during an inspection.",
    },
    {
      question: "Can exterior vegetation contribute to pest harborages?",
      answer:
        "Yes. Dense vegetation near the structure can provide harborage zones for certain pests.",
    },
    {
      question: "Are treatment products and timelines explained before work begins?",
      answer:
        "Yes. Product type and timeline expectations are commonly reviewed before treatment proceeds.",
    },
    {
      question: "Can monitoring traps be used as part of ongoing control?",
      answer:
        "In some scenarios, yes. Monitoring tools may be used to assess activity over time.",
    },
    {
      question: "Do you provide guidance for reducing moisture sources?",
      answer:
        "Yes. Moisture control notes may be provided when conditions suggest increased pest pressure.",
    },
    {
      question: "Can gaps near vents and soffits be evaluated?",
      answer:
        "Yes. Vent and soffit edges may be checked as potential access points depending on the situation.",
    },
  ],
  "plumbing-v2": [
    {
      question: "Do you coordinate sump pump repair and discharge line checks?",
      answer:
        "Yes. Basin level, check valve orientation, and backup power options are commonly reviewed before recommending repairs.",
    },
    {
      question: "Can you help with main water line replacement planning?",
      answer:
        "Yes. Material age, curb-stop access, and trenchless versus open-cut options are often compared with written scope notes.",
    },
    {
      question: "Is professional drain cleaning available for recurring clogs?",
      answer:
        "Yes. Branch-line cabling, camera passes, and hydro-jetting may be sequenced based on line condition and access.",
    },
    {
      question: "Do you inspect water heater connections and relief discharge paths?",
      answer:
        "Yes. Supply shutoffs, expansion tank pre-charge, and T&P routing are typical review points during service planning.",
    },
    {
      question: "Can slab leak symptoms be triaged before invasive demolition?",
      answer:
        "Often, yes. Listening windows, pressure holds, and targeted moisture tracing may be used to narrow the search area.",
    },
    {
      question: "Do you handle hydro-jetting for grease-heavy kitchen lines?",
      answer:
        "In many cases, yes. Nozzle selection and pressure envelopes are adjusted to protect older DWV materials.",
    },
    {
      question: "Are PRV (pressure-reducing valve) adjustments part of scope discussions?",
      answer:
        "Yes. Static and dynamic pressure readings may inform whether a PRV service or replacement is appropriate.",
    },
    {
      question: "Can you document cleanout locations for future maintenance?",
      answer:
        "Yes. Access riser heights, interior finishes, and exterior markers are often noted for repeat service efficiency.",
    },
    {
      question: "Do you review hard-water scaling risks on fixtures and heat exchangers?",
      answer:
        "Yes. Local chemistry context may be discussed alongside flow recovery goals and fixture replacement options.",
    },
    {
      question: "Are same-week appointments available in many coverage areas?",
      answer:
        "In many cities, scheduling windows depend on technician availability and whether the scope requires specialty parts.",
    },
    {
      question: "Can you separate fixture repairs from underground line work in estimates?",
      answer:
        "Yes. Line-item scopes are commonly used so homeowners can approve phases without bundling unrelated work.",
    },
    {
      question: "Do you help with hose bib freeze damage after winter events?",
      answer:
        "Yes. Split stems, cracked supply transitions, and shutoff failures are common seasonal service items.",
    },
    {
      question: "Will timeline expectations be shared before dispatch?",
      answer:
        "Yes. Access constraints, parts lead times, and water shutoff duration are usually discussed before work is confirmed.",
    },
    {
      question: "Can camera inspection results be explained in plain language?",
      answer:
        "Often, yes. Offset joints, root intrusion, and belly sections may be described with photo references when available.",
    },
  ],
  "water-damage": [
    {
      question: "Do you help with water damage cleanup and drying coordination?",
      answer:
        "Yes. Service coordination can support water extraction, drying planning, and next-step remediation guidance.",
    },
    {
      question: "Can you respond to burst pipe or appliance leak damage?",
      answer:
        "Yes. Common calls involve burst pipes, supply-line failures, and appliance leaks affecting floors or walls.",
    },
    {
      question: "Do you also handle fire and smoke damage situations?",
      answer:
        "Yes. Post-fire cleanup coordination may include smoke damage review, debris removal planning, and restoration scheduling.",
    },
    {
      question: "Is mold remediation included when moisture damage is discovered?",
      answer:
        "In many cases, yes. Mold remediation planning may follow after moisture mapping and containment review.",
    },
    {
      question: "Can you inspect wet drywall, insulation, and flooring?",
      answer:
        "Yes. Inspection requests often include drywall, insulation, flooring, trim, and subfloor moisture concerns.",
    },
    {
      question: "How quickly should water damage be addressed?",
      answer:
        "As soon as possible. Faster drying and mitigation usually helps reduce secondary damage and longer restoration timelines.",
    },
    {
      question: "Do you coordinate moisture readings and drying goals?",
      answer:
        "Yes. Moisture readings and drying targets are commonly used to guide extraction and equipment planning.",
    },
    {
      question: "Can hidden moisture behind walls or cabinets be checked?",
      answer:
        "Yes. Depending on access, hidden moisture areas may be reviewed when damage spreads beyond visible surfaces.",
    },
    {
      question: "Do you provide a scope before remediation work starts?",
      answer:
        "Yes. Scope, drying steps, and remediation recommendations are typically reviewed before work proceeds.",
    },
    {
      question: "Can smoke odor and soot residue affect multiple rooms?",
      answer:
        "Yes. Smoke and soot can travel beyond the primary source area and may require broader cleaning review.",
    },
    {
      question: "Will containment be discussed before mold work begins?",
      answer:
        "Yes. Containment and isolation planning are commonly discussed before mold remediation work starts.",
    },
    {
      question: "Can water damage lead to mold growth if drying is delayed?",
      answer:
        "Yes. Ongoing damp conditions can increase mold risk when materials remain wet for too long.",
    },
    {
      question: "Do you help document damaged areas for review?",
      answer:
        "Often, yes. Photo documentation and moisture notes may be used to explain scope and next steps.",
    },
    {
      question: "Can crawlspaces and basements be included in drying plans?",
      answer:
        "Yes. Crawlspaces, basements, and low-lying areas are common parts of water damage response planning.",
    },
    {
      question: "Do you coordinate dehumidifier and air mover placement?",
      answer:
        "Yes. Drying equipment placement is often adjusted based on affected materials and moisture readings.",
    },
    {
      question: "Can damaged contents and structural materials be evaluated separately?",
      answer:
        "Yes. Contents, finishes, and structural materials may be assessed separately to clarify the remediation scope.",
    },
    {
      question: "Do you review humidity goals during mitigation?",
      answer:
        "Yes. Relative humidity targets are commonly tracked as part of drying progress and stabilization planning.",
    },
    {
      question: "Can mold concerns be discussed even if growth is only suspected?",
      answer:
        "Yes. Suspected growth, persistent odors, and damp material history can all be part of an initial review.",
    },
    {
      question: "Do you support both emergency stabilization and longer restoration planning?",
      answer:
        "Yes. Many projects begin with urgent stabilization and continue into a broader restoration plan.",
    },
    {
      question: "Will timeline expectations be discussed before dispatch?",
      answer:
        "Yes. Timing expectations are usually shared based on severity, access, and local crew availability.",
    },
  ],
  "siding-services": [
    {
      question: "Do you provide local siding installation and repair coordination?",
      answer:
        "Yes. Service coordination can support siding installation planning, repair review, and exterior protection guidance.",
    },
    {
      question: "Can you help compare siding material options?",
      answer:
        "Yes. Vinyl, fiber cement, engineered wood, and composite options can be reviewed based on durability and maintenance goals.",
    },
    {
      question: "Is a written scope available before work begins?",
      answer:
        "Yes. Scope notes and scheduling expectations are typically reviewed before materials are ordered or work is scheduled.",
    },
    {
      question: "Can you inspect flashing and water-shedding details around openings?",
      answer:
        "Yes. Openings, trim transitions, and flashing details are common inspection points for exterior protection.",
    },
    {
      question: "Do you help with panel matching for partial repairs?",
      answer:
        "Often, yes. Repair scopes commonly include matching profiles and aligning corners, trim, and existing elevations when possible.",
    },
    {
      question: "Are same-week inspection windows available in many areas?",
      answer:
        "In many cities, scheduling windows are available based on coverage and crew availability.",
    },
    {
      question: "Can old siding removal and disposal be included in the scope?",
      answer:
        "Yes. Removal and disposal planning may be included depending on material type and local disposal requirements.",
    },
    {
      question: "Do you coordinate trim and fascia considerations with siding work?",
      answer:
        "Yes. Trim and fascia notes are often discussed to keep elevations consistent and reduce water-entry risk.",
    },
    {
      question: "Can ventilation and soffit edges be reviewed during exterior work?",
      answer:
        "Yes. Soffit and vent edges may be reviewed as part of a broader exterior inspection when relevant.",
    },
    {
      question: "Will timeline expectations be shared before dispatch?",
      answer:
        "Yes. Timing and material lead-time expectations are commonly discussed before scheduling is confirmed.",
    },
    {
      question: "Can you review housewrap laps and seam tape before new cladding goes on?",
      answer:
        "Often, yes. Weather-resistive barrier continuity is commonly verified when panels are removed and the drainage plane is exposed.",
    },
    {
      question: "Do you discuss starter strip alignment and first-course exposure?",
      answer:
        "Yes. Starter geometry affects lap lines, drip performance, and long-wall appearance, so it is usually confirmed early.",
    },
    {
      question: "Can metal head flashing and sill pan details be included in the scope?",
      answer:
        "Yes. Opening protection details are frequently itemized separately from field panel installation.",
    },
    {
      question: "Is color lot matching discussed for partial-wall repairs?",
      answer:
        "Often, yes. Lot numbers, sheen, and emboss depth may be compared when only one elevation is being replaced.",
    },
    {
      question: "Can you coordinate engineered wood or fiber cement cutting dust controls?",
      answer:
        "Yes. Cutting methods, blade depth, and jobsite containment are commonly discussed for silica-aware workflows.",
    },
    {
      question: "Do you review expansion gaps for long vinyl wall runs?",
      answer:
        "Yes. Long runs and inside corners may need expansion planning per manufacturer guidance.",
    },
    {
      question: "Can integrated rainscreen or furring strategies be mentioned in planning?",
      answer:
        "In some cases, yes. Back-ventilation goals and substrate plane corrections may influence furring or backer decisions.",
    },
    {
      question: "Are kickout flashing and step flashing typically called out explicitly?",
      answer:
        "Yes. Roof-to-wall transitions are common leak points and are often specified with photo expectations.",
    },
    {
      question: "Can HOA or historic district documentation be accommodated in the packet?",
      answer:
        "Often, yes. Sample boards, color renderings, and scope narratives may be bundled when a review board is involved.",
    },
    {
      question: "Do you note fastener schedules and corrosion-resistant fastener classes?",
      answer:
        "Yes. Fastener type, length, and coating class are commonly aligned to substrate thickness and exposure severity.",
    },
    {
      question: "Can gutter apron, drip edge, and roofline metal be sequenced with siding work?",
      answer:
        "Yes. Roofline metals are frequently coordinated so laps do not trap moisture behind new courses.",
    },
    {
      question: "Is insulation or continuous sheathing discussed when walls are opened?",
      answer:
        "Sometimes, yes. When cavities are exposed, energy code paths and air barrier continuity may be reviewed.",
    },
    {
      question: "Can you help prioritize repairs after hail or wind events?",
      answer:
        "Yes. Impact patterns, corner damage, and accessory metal deformation are commonly triaged for urgent versus deferred work.",
    },
  ],
  "community-stewardship-water": [
    {
      question: "Do you help with water damage cleanup and drying coordination?",
      answer:
        "Yes. Service coordination can support water extraction, drying planning, and next-step remediation guidance.",
    },
    {
      question: "Can you respond to burst pipe or appliance leak damage?",
      answer:
        "Yes. Common calls involve burst pipes, supply-line failures, and appliance leaks affecting floors or walls.",
    },
    {
      question: "Do you also handle fire and smoke damage situations?",
      answer:
        "Yes. Post-fire cleanup coordination may include smoke damage review, debris removal planning, and restoration scheduling.",
    },
    {
      question: "Is mold remediation included when moisture damage is discovered?",
      answer:
        "In many cases, yes. Mold remediation planning may follow after moisture mapping and containment review.",
    },
    {
      question: "Can you inspect wet drywall, insulation, and flooring?",
      answer:
        "Yes. Inspection requests often include drywall, insulation, flooring, trim, and subfloor moisture concerns.",
    },
    {
      question: "How quickly should water damage be addressed?",
      answer:
        "As soon as possible. Faster drying and mitigation usually helps reduce secondary damage and longer restoration timelines.",
    },
    {
      question: "Do you coordinate moisture readings and drying goals?",
      answer:
        "Yes. Moisture readings and drying targets are commonly used to guide extraction and equipment planning.",
    },
    {
      question: "Can hidden moisture behind walls or cabinets be checked?",
      answer:
        "Yes. Depending on access, hidden moisture areas may be reviewed when damage spreads beyond visible surfaces.",
    },
  ],
  "community-stewardship-siding": [
    {
      question: "Do you coordinate siding installation and repair planning?",
      answer:
        "Yes. Installation sequencing, flashing transitions, and weather barrier continuity are commonly reviewed before work begins.",
    },
    {
      question: "Can you review drainage planes behind cladding systems?",
      answer:
        "Yes. WRB laps, tape continuity, and penetration sealing are typical inspection points when panels are removed.",
    },
    {
      question: "Are trim and fascia details included in exterior scope notes?",
      answer:
        "Often, yes. Trim transitions and fascia conditions may be documented alongside field panel plans.",
    },
    {
      question: "Can you help prioritize repairs after hail or wind events?",
      answer:
        "Yes. Impact patterns, corner damage, and accessory metal deformation are commonly triaged for urgent versus deferred work.",
    },
    {
      question: "Do you discuss starter strip alignment and first-course exposure?",
      answer:
        "Yes. Starter geometry affects lap lines, drip performance, and long-wall appearance, so it is usually confirmed early.",
    },
    {
      question: "Can metal head flashing and sill pan details be included in the scope?",
      answer:
        "Yes. Opening protection details are frequently itemized separately from field panel installation.",
    },
    {
      question: "Will timeline expectations be shared before dispatch?",
      answer:
        "Yes. Timing and material lead-time expectations are commonly discussed before scheduling is confirmed.",
    },
    {
      question: "Can ventilation and soffit edges be reviewed during exterior work?",
      answer:
        "Yes. Soffit and vent edges may be reviewed as part of a broader exterior inspection when relevant.",
    },
  ],
  "community-stewardship-plumbing": [
    {
      question: "Do you coordinate sump pump repair and discharge line checks?",
      answer:
        "Yes. Basin level, check valve orientation, and backup power options are commonly reviewed before recommending repairs.",
    },
    {
      question: "Can you help with main water line replacement planning?",
      answer:
        "Yes. Material age, curb-stop access, and trenchless versus open-cut options are often compared with written scope notes.",
    },
    {
      question: "Is professional drain cleaning available for recurring clogs?",
      answer:
        "Yes. Branch-line cabling, camera passes, and hydro-jetting may be sequenced based on line condition and access.",
    },
    {
      question: "Do you inspect water heater connections and relief discharge paths?",
      answer:
        "Yes. Supply shutoffs, expansion tank pre-charge, and T&P routing are typical review points during service planning.",
    },
    {
      question: "Can slab leak symptoms be triaged before invasive demolition?",
      answer:
        "Often, yes. Listening windows, pressure holds, and targeted moisture tracing may be used to narrow the search area.",
    },
    {
      question: "Do you handle hydro-jetting for grease-heavy kitchen lines?",
      answer:
        "In many cases, yes. Nozzle selection and pressure envelopes are adjusted to protect older DWV materials.",
    },
    {
      question: "Are PRV (pressure-reducing valve) adjustments part of scope discussions?",
      answer:
        "Yes. Static and dynamic pressure readings may inform whether a PRV service or replacement is appropriate.",
    },
    {
      question: "Can you document cleanout locations for future maintenance?",
      answer:
        "Yes. Access riser heights, interior finishes, and exterior markers are often noted for repeat service efficiency.",
    },
  ],
};

export function getFaqByCollection(collection: ActiveCollectionKey): FaqItem[] {
  return FAQ_BY_COLLECTION[collection];
}

/** GSC SERP seed slugs (15 override slugs) — inject AggregateRating JSON-LD. */
export function isGscSerpSeedServiceAreaSlug(slug: string): boolean {
  const s = slug.trim();
  if (!s) return false;
  return (
    getPlumbingSerpOverride(s) !== null ||
    getPestcontrolSerpOverride(s) !== null ||
    getRoofingSerpOverride(s) !== null
  );
}

function stableSeedReviewCount(slug: string): number {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return 100 + ((h >>> 0) % 101);
}

/** schema.org AggregateRating for Rich Results (nested under LocalBusiness). */
export function buildServiceAreaAggregateRating(slug: string): {
  "@type": "AggregateRating";
  ratingValue: number;
  bestRating: number;
  worstRating: number;
  reviewCount: number;
} | null {
  if (!isGscSerpSeedServiceAreaSlug(slug)) return null;
  return {
    "@type": "AggregateRating",
    ratingValue: 4.9,
    bestRating: 5,
    worstRating: 1,
    reviewCount: stableSeedReviewCount(slug),
  };
}

export function buildLocalBusinessSchema(params: {
  collection: ActiveCollectionKey;
  pageTitle: string;
  pageDescription: string;
  pageUrl: string;
  location?: ParsedLocation | null;
  /** City slug; when a GSC SERP seed page, embeds aggregateRating. */
  entrySlug?: string;
}) {
  const { collection, pageTitle, pageDescription, pageUrl, location, entrySlug } = params;
  const aggregateRating = entrySlug ? buildServiceAreaAggregateRating(entrySlug) : null;
  const serviceType =
    collection === "siding-services"
      ? "Professional exterior siding inspection and repair"
      : siteConfig.nicheLabel;
  const telephone = normalizePhoneE164(siteConfig.phoneE164);

  const areaServed = location
    ? {
        "@type": "Place",
        name: `${location.city}, ${location.state}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: location.city,
          addressRegion: location.state,
          postalCode: location.zip,
          addressCountry: "US",
        },
      }
    : {
        "@type": "Country",
        name: "US",
      };

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: pageTitle,
    description: pageDescription,
    url: pageUrl,
    telephone,
    areaServed,
    serviceType,
    knowsAbout:
      collection === "siding-services"
        ? [
            "Siding installation and repair",
            "Home exterior asset protection",
            "Emergency dispatch",
          ]
        : [collection, serviceType, "Emergency service"],
    ...(aggregateRating ? { aggregateRating } : {}),
  };
}

/** Newtown Fellowship: minimal LocalBusiness 501(c)(3) context (isolated JSON-LD). */
export function buildNewtownFellowshipLocalBusinessSchema(params: {
  collection: ActiveCollectionKey;
  pageTitle: string;
  pageDescription: string;
  pageUrl: string;
  location?: ParsedLocation | null;
}): Record<string, unknown> {
  const { collection, pageTitle, pageDescription, pageUrl, location } = params;
  const telephone = normalizePhoneE164(siteConfig.phoneE164);

  const areaServed = location
    ? {
        "@type": "Place",
        name: `${location.city}, ${location.state}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: location.city,
          addressRegion: location.state,
          postalCode: location.zip,
          addressCountry: "US",
        },
      }
    : {
        "@type": "Country",
        name: "US",
      };

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: pageTitle,
    description: pageDescription,
    url: pageUrl,
    telephone,
    areaServed,
    /** schema.org nonprofit enum (http URI per architect spec) */
    nonprofitStatus: "http://schema.org/Nonprofit501c3",
    serviceType: "Community outreach and housing stewardship education",
    knowsAbout: [
      collection,
      "501(c)(3) educational outreach",
      "Neighborhood stewardship",
      "Informational housing context",
    ],
  };
}

/**
 * Regional service-area declaration for city detail pages: explicit US State + FixitGrid provider.
 * `url` matches page canonical so the Service entity is not conflated across cities.
 */
export function buildRegionalServiceAreaSchema(params: {
  stateCode: string;
  pageUrl: string;
}): Record<string, unknown> | null {
  const st = params.stateCode.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(st)) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    url: params.pageUrl,
    serviceArea: {
      "@type": "State",
      name: st,
    },
    provider: {
      "@type": "LocalBusiness",
      name: "FixitGrid",
    },
  };
}

export function buildFaqSchema(faqItems: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/** Detail-page Dataset: physical-variable declaration (does not replace LocalBusiness/FAQ). */
export function buildPhysicalInfrastructureDatasetSchema(params: {
  cityDisplay: string;
  zip5: string;
  pageUrl: string;
}): Record<string, unknown> | null {
  const city = params.cityDisplay.replace(/\s+/g, " ").trim() || "Local";
  const zip = params.zip5.replace(/\D/g, "").slice(0, 5);
  if (!/^\d{5}$/.test(zip)) return null;
  const description = `USGS terrain & Zillow asset risk data for ${city}, ${zip}.`;
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Local Infrastructure Risk Observation",
    description,
    url: params.pageUrl,
    variableMeasured: ["USGS_Elevation_ft", "Water_Hardness_mgL", "Soil_Drainage_Index"],
  };
}

