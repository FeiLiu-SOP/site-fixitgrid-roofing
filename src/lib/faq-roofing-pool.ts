import type { FaqPoolItem } from "./faq-hydration";

/** Roofing bottom-accordion pool — exactly 25 items; insurance + warranty are priority-weighted. */
export const ROOFING_FAQ_POOL: FaqPoolItem[] = [
  {
    question: "Do you offer emergency roofing repairs in {{city}}, {{county}}?",
    answer:
      "Yes. Intake coordinates local emergency response for active leaks, wind uplift, and temporary dry-in while {{localDataPoint}}.",
  },
  {
    question: "How quickly can a roofer be routed to {{city}}?",
    answer:
      "Many sectors support same-day or next-day dispatch windows depending on weather, crew coverage, and call volume; {{localDataPoint}}.",
  },
  {
    question: "Do you handle storm and wind roof damage near {{city}}?",
    answer:
      "Yes. Common storm scenarios include missing shingles, lifted tabs, flashing separation, and active infiltration; {{localDataPoint}}.",
  },
  {
    question: "Are written estimates available for roofing service in {{county}}?",
    answer:
      "Yes. Scope, material notes, and scheduling expectations are typically reviewed in writing before work is confirmed; {{localDataPoint}}.",
  },
  {
    question: "Do you work with asphalt shingle roofs in {{city}}?",
    answer:
      "Yes. Asphalt shingle systems remain among the most common residential requests in {{county}} service corridors; {{localDataPoint}}.",
  },
  {
    question: "Can roof repairs help after hail exposure in {{city}}?",
    answer:
      "Yes. Intake often involves granule loss checks, impact marks, and moisture-entry risk after hail or wind events; {{localDataPoint}}.",
  },
  {
    question: "Will you explain repair versus replacement options in {{city}}, {{county}}?",
    answer:
      "Yes. Homeowners receive scope comparisons between targeted repairs and full replacement paths before approving spend; {{localDataPoint}}.",
  },
  {
    question: "Are emergency tarping options available in {{city}}?",
    answer:
      "In many service areas, temporary weather protection may be arranged while permanent repair scope is finalized; {{localDataPoint}}.",
  },
  {
    question: "Can roof issues affect attic moisture conditions in {{county}}?",
    answer:
      "Yes. Ongoing leaks and ventilation imbalance can contribute to attic moisture, insulation damage, and interior staining; {{localDataPoint}}.",
  },
  {
    question: "Do you provide written scope details before scheduling in {{city}}?",
    answer:
      "Yes. Line items, material assumptions, and milestone timing are typically documented before dispatch confirmation; {{localDataPoint}}.",
  },
  {
    question: "Can crews review soft decking concerns in {{city}}?",
    answer:
      "When accessible, local teams may note soft decking or moisture-related deck concerns during scope walks; {{localDataPoint}}.",
  },
  {
    question: "Do you offer guidance on ventilation balance in {{county}}?",
    answer:
      "Yes. Intake and field notes often cover intake versus exhaust balance when attic moisture is suspected; {{localDataPoint}}.",
  },
  {
    question: "Can gutter overflow contribute to roof leaks in {{city}}?",
    answer:
      "Yes. Water management at eaves and fascia can influence leak symptoms that mimic cladding failure; {{localDataPoint}}.",
  },
  {
    question: "Do you coordinate chimney flashing leak points in {{city}}?",
    answer:
      "Yes. Chimney transitions remain common leak-prone details during repair and replacement planning; {{localDataPoint}}.",
  },
  {
    question: "Can seasonal ice or wind patterns affect roofing wear in {{county}}?",
    answer:
      "Yes. Freeze-thaw cycles, wind exposure, and shoulder-season storms can accelerate wear patterns; {{localDataPoint}}.",
  },
  {
    question: "Will intake confirm timeline expectations before dispatch in {{city}}?",
    answer:
      "Yes. Service windows and realistic milestones are shared based on coverage, weather, and scope complexity; {{localDataPoint}}.",
  },
  {
    question: "How do I know if my roof needs replacing in {{city}}, {{county}}?",
    answer:
      "{Warning signs include missing or curled shingles, granules in gutters, ceiling stains, attic daylight, or a system past its typical service life.|Red flags include lifted tabs, interior staining, repeated leak patches, and decking softness when accessible.|Any one symptom does not always mean full replacement—intake helps separate cosmetic wear from active infiltration.|If unsure, call with what you see; phone photos help coordinators set urgency before local crews mobilize.|One strong indicator plus age or storm history may justify a replacement scope review rather than another spot repair.} {{localDataPoint}}.",
  },
  {
    question: "How long does roofing work usually take near {{city}}?",
    answer:
      "{Many residential re-roofs complete within a few days once weather and decking conditions are known.|Smaller repair scopes may finish faster; full replacements depend on tear-off depth and ventilation upgrades.|Commercial timelines vary by square count, safety staging, and inspection gates.|Written estimates should include target milestones—not open-ended calendars.|Weather holds and decking surprises are the most common reasons schedules shift in {{county}}.} {{localDataPoint}}.",
  },
  {
    question: "What roofing systems are commonly coordinated in {{city}}?",
    answer:
      "{Requests often involve asphalt shingles, tile, metal, TPO, EPDM, or modified bitumen depending on slope and exposure.|System choice should match pitch, wind exposure, and budget—not marketing defaults.|Intake can clarify which assemblies are realistic for your property type in {{county}}.|Material selection should be documented before crews order long-lead items.|Matching existing elevations may require profile, color lot, and fastener schedule review.} {{localDataPoint}}.",
  },
  {
    question: "Are permits part of roofing projects in {{city}}, {{county}}?",
    answer:
      "{Permit and inspection rules vary by municipality; reputable scopes document expectations before work starts.|Re-roof permits may require manufacturer bulletins and disposal manifests in {{county}}.|If a contractor suggests skipping permits, treat that as a liability risk on your property.|Intake can flag when routing may trigger structural or re-roof reviews.|Inspection close-out should be part of the written plan—not an afterthought.} {{localDataPoint}}.",
  },
  {
    priorityGroup: "insurance",
    question:
      "{Can intake help with insurance-related roofing documentation in {{city}}, {{county}}?|Do you support insurance claim documentation routing in {{city}}?|How should I prepare roofing files before speaking with an adjuster in {{county}}?|Can coordinators help organize storm-damage notes for carrier review in {{city}}?|Is claim documentation support available for roof losses in {{city}}, {{county}}?}",
    answer:
      "{Intake helps organize damage photos, timelines, and scope questions before carrier conversations—we coordinate dispatch, not legal representation.|We support documentation routing for storm claims: visible damage notes and contractor scope outlines stay in your intake packet.|Homeowners in {{city}} can use intake to line up adjuster-ready photos while local roofing coverage is routed.|Claim-related calls should start with dated damage photos; intake clarifies what to log before adjuster contact.|Storm and leak intake includes checklist guidance for carrier files while crews are coordinated locally.} {{localDataPoint}}.",
  },
  {
    priorityGroup: "warranty",
    question:
      "{How are roofing warranties typically explained in {{city}}?|What warranty details should I review before approving roof work in {{county}}?|Are manufacturer and workmanship warranties discussed during intake in {{city}}?|How do I compare warranty terms between roofing quotes in {{city}}, {{county}}?|What should a written roofing warranty include before I sign in {{county}}?}",
    answer:
      "{Manufacturer and workmanship terms depend on materials and who performs the install—intake clarifies what should appear in writing.|Warranty scope, transfer rules, and exclusions should be reviewed before approving replacement spend.|Do not rely on verbal promises; ask how labor and material coverage are separated in the contract.|In {{city}}, compare warranty length against exposure, ventilation upgrades, and decking repairs included in scope.|A credible warranty is documented, transferable where applicable, and tied to approved materials—not handshake assurances.} {{localDataPoint}}.",
  },
  {
    question: "Can flashing and vent penetrations be coordinated in {{city}}?",
    answer:
      "Yes. Vent boots, ridge caps, and transition flashings are common scope items during leak tracing; {{localDataPoint}}.",
  },
  {
    question: "Can homeowners share phone photos during roofing intake in {{county}}?",
    answer:
      "Yes. Dated exterior and attic photos help coordinators set urgency before local crews are routed; {{localDataPoint}}.",
  },
  {
    question: "Will coordinators route leak tracing before recommending full replacement in {{city}}?",
    answer:
      "Yes. Intake separates active infiltration paths from cosmetic wear whenever photo evidence supports a targeted repair; {{localDataPoint}}.",
  },
];
