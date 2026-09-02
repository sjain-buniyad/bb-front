/** One editable beam (or span within a continuous group). */
export interface BeamEntry {
  width: number;
  depth: number;
  length: number;
  barDia: string;
  colLeft: string;
  colRight: string;
  name: string;
  originalReinforcement: string[];
}

export function toBeamEntry(beam: any): BeamEntry {
  return {
    width: beam.size?.width || 0,
    depth: beam.size?.depth || 0,
    length: beam.size?.length || 0,
    barDia: beam.reinforcement?.[0] || "",
    colLeft: "",
    colRight: "",
    name: beam.name,
    originalReinforcement: beam.reinforcement || [],
  };
}
