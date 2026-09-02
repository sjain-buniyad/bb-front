export interface FormulaEntry {
  key: string;
  value: string;
}

/** Full state of the "Create Shape" form. */
export interface ShapeFormState {
  name: string;
  numberOfSides: number;
  isNFB: boolean;
  hasStirrup: boolean;
  LD: number;
  L: number;
  numberOfStirrups: number;
  file: File | null;
  formulas: FormulaEntry[];
  /** Raw comma-separated list of L values. */
  allL: string;
}

export const emptyShapeForm: ShapeFormState = {
  name: "",
  numberOfSides: 0,
  isNFB: false,
  hasStirrup: false,
  LD: 0,
  L: 0,
  numberOfStirrups: 0,
  file: null,
  formulas: [{ key: "", value: "" }],
  allL: "",
};

/** Build the multipart payload expected by POST /shape. */
export function buildShapeFormData(form: ShapeFormState): FormData {
  const fd = new FormData();
  fd.append("name", form.name.trim());
  fd.append("numberOfSides", String(form.numberOfSides));
  fd.append("isNFB", String(form.isNFB));
  fd.append("hasStirrup", String(form.hasStirrup));
  fd.append("LD", String(form.LD));
  fd.append("L", String(form.L));
  fd.append("numberOfStirrups", String(form.numberOfStirrups));
  fd.append("file", form.file!);

  // Filter out empty keys
  const formulaObj: Record<string, string> = {};
  form.formulas.forEach((entry) => {
    const trimmedKey = entry.key.trim();
    if (trimmedKey) formulaObj[trimmedKey] = entry.value.trim();
  });
  fd.append("formula", JSON.stringify(formulaObj));

  // Parse comma-separated L values
  const parsed = form.allL.trim()
    ? form.allL
        .split(",")
        .map((v) => parseFloat(v.trim()))
        .filter((v) => !isNaN(v))
    : [];
  fd.append("allL", JSON.stringify(parsed));

  return fd;
}
