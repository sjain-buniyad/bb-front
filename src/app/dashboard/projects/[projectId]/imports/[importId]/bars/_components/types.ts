export interface BarItem {
  bar_mark: string;
  diameter: number;
  crop_image?: string | null;
  qty: number;
  length: number;
  total_bar_length: number;
  total_weigth: number;
  data?: Record<string, number | string | null> | string;
}

export interface PlateItem {
  plate_name: string | null;
  plate_repetation: number | null;
  plate_profile: string | null;
  weigth: number | null;
  dia_of_lug: number | null;
  total_length_of_lug: number | null;
  total_weight_of_lug: number | null;
  qty?: number | null;
}

export interface MarkItem {
  mark: string | null;
  description: string | null;
  qty: number | null;
}

/** Dimension keys shown for bars that have structured bending data. */
export const DIMENSION_KEYS = ["A", "B", "C", "C1", "C2", "D", "D1", "D2", "D3"];

/** Strip everything but letters/digits and uppercase, so "IP-1", "IP 1" and "ip1" all compare equal. */
const normalizeMarkName = (name?: string | null): string =>
  (name || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

/**
 * Look up a plate's qty from the bar section's `mark` table by name, tolerant of
 * formatting differences between the two lists (hyphens, spacing, casing — e.g.
 * plate name "IP1" matching mark "IP-1").
 */
export const findMarkQty = (
  plateName: string | null | undefined,
  marks: MarkItem[] | undefined,
): number | null => {
  const target = normalizeMarkName(plateName);
  if (!target || !marks?.length) return null;
  const match = marks.find((m) => normalizeMarkName(m.mark) === target);
  return match?.qty ?? null;
};
