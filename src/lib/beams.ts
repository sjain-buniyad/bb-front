import { API_URL } from "./api";

// ── Beam grouping ──

export interface BeamGroup {
  baseName: string;
  beams: any[];
  isContinuous: boolean;
  firstIndex: number;
}

/** Strip a trailing lowercase suffix: "B1a" -> "B1" */
export function getBaseName(name: string): string | null {
  const m = name?.match(/^(.+?)([a-z]+)$/);
  return m ? m[1] : null;
}

/**
 * The group a beam belongs to. Explicit `groupId` (set by merging) wins,
 * otherwise beams are grouped by their name's base ("B1a" -> "B1").
 */
export function getBeamGroupId(
  beam: BeamGroup["beams"][number],
): string {
  return beam?.groupId || getBaseName(beam?.name) || beam?.name;
}

/**
 * Group beams into beam groups. Beams sharing an explicit `groupId` (from a
 * merge) or a name base (e.g. B1a, B1b -> "B1") form one group; standalone
 * beams become single-item groups. Result keeps original order.
 */
export function groupBeams(beamData: any[]): BeamGroup[] {
  const suffixMap = new Map<
    string,
    { base: string; beam: any; idx: number }[]
  >();
  const standalones: BeamGroup[] = [];

  beamData.forEach((beam, idx) => {
    const base = getBeamGroupId(beam);
    if (base) {
      if (!suffixMap.has(base)) suffixMap.set(base, []);
      suffixMap.get(base)!.push({ base, beam, idx });
    } else {
      standalones.push({
        baseName: beam.name,
        beams: [beam],
        isContinuous: false,
        firstIndex: idx,
      });
    }
  });

  const groups: BeamGroup[] = [...standalones];
  suffixMap.forEach((entries) => {
    groups.push({
      baseName: entries[0].base,
      beams: entries.map((e) => e.beam),
      isContinuous: entries.length > 1,
      firstIndex: entries[0].idx,
    });
  });

  groups.sort((a, b) => a.firstIndex - b.firstIndex);
  return groups;
}

// ── Merging groups into one continuous beam ──

export interface MergePlan {
  /** Group id of the merged continuous group (from the first group). */
  targetKey: string;
  /** Groups being merged, in original extraction order. */
  groups: BeamGroup[];
  /** All beams being merged, in extraction order (names stay unchanged). */
  beams: BeamGroup["beams"];
}

/**
 * Plan merging the given groups (>= 2) into a single continuous-beam group.
 * Beam names are NOT changed — beams are tagged with a shared `groupId`
 * so they are treated as spans of one continuous beam.
 */
export function buildMergePlan(groups: BeamGroup[]): MergePlan | null {
  if (groups.length < 2) return null;
  const sorted = [...groups].sort((a, b) => a.firstIndex - b.firstIndex);
  return {
    targetKey: sorted[0].baseName,
    groups: sorted,
    beams: sorted.flatMap((g) => g.beams),
  };
}

/** Apply a merge plan to the raw columns array (returns a new array). */
export function applyMergePlan(
  beamData: BeamGroup["beams"],
  plan: MergePlan,
): BeamGroup["beams"] {
  const merging = new Set<BeamGroup["beams"][number]>(plan.beams);
  return beamData.map((b) =>
    merging.has(b) ? { ...b, groupId: plan.targetKey } : b,
  );
}

// ── Eval (L-value calculation) ──

export interface EvalBeamPayload {
  beaminX: number;
  beaminY: number;
  shape: { numberOfSides: number; formula: Record<string, string> };
}

export async function evalBeamApi(
  payload: EvalBeamPayload,
): Promise<Record<string, number>> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`${API_URL}/eval-beam`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Evaluation failed");
  }
  return res.json();
}

/** Extract the "L*" keys from an eval result. */
export function getLValues(result: any): { key: string; value: number }[] {
  if (!result || result.error) return [];
  return Object.entries(result)
    .filter(([k]) => k.startsWith("L"))
    .map(([k, v]) => ({ key: k, value: v as number }));
}
