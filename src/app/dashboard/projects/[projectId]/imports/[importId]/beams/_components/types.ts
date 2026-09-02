export interface BeamFormEntry {
  width: number;
  depth: number;
  length: number;
  barDia: string;
  colLeft: string;
  colRight: string;
}

export interface GroupFormState {
  shapeId: string;
  shapeName: string;
  shapeImage: string;
  gradeConcrete: string;
  gradeSteel: string;
  cover: string;
  repetition: number;
  beams: Record<number, BeamFormEntry>;
}

export function makeDefaultGroupForm(beams: any[]): GroupFormState {
  const beamEntries: Record<number, BeamFormEntry> = {};
  beams.forEach((b, i) => {
    beamEntries[i] = {
      width: b.size?.width || 0,
      depth: b.size?.depth || 0,
      length: b.size?.length || 0,
      barDia: b.reinforcement?.[0] || "",
      colLeft: "",
      colRight: "",
    };
  });
  return {
    shapeId: "",
    shapeName: "",
    shapeImage: "",
    gradeConcrete: "",
    gradeSteel: "",
    cover: "",
    repetition: 1,
    beams: beamEntries,
  };
}

export interface EvalSnapshot {
  lVals: { key: string; value: number }[];
  loading?: boolean;
  error?: string;
}
