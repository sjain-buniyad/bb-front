export const GRADE_CONCRETE = [
  "M15",
  "M20",
  "M25",
  "M30",
  "M35",
  "M40",
  "M45",
  "M50",
  "M55",
  "M60",
];

export const GRADE_STEEL = ["Fe250", "Fe415", "Fe500", "Fe500D", "Fe550", "Fe600"];

/** Tab strip shared by the beams / slabs / columns / footings / bars pages. */
export const STRUCTURE_TABS: { label: string; path: string }[] = [
  { label: "Beam", path: "beams" },
  { label: "Slab", path: "slabs" },
  { label: "Column", path: "columns" },
  { label: "Footing", path: "footings" },
  { label: "Bar", path: "bars" },
];
