"use client";

import type { ShapeItem } from "@/lib/api";
import { GRADE_CONCRETE, GRADE_STEEL } from "@/lib/constants";
import SelectField from "@/components/ui/SelectField";
import Spinner from "@/components/ui/Spinner";
import type { GroupFormState } from "./types";

interface SharedParamsBarProps {
  form: GroupFormState;
  isContinuous: boolean;
  shapes: ShapeItem[];
  shapesLoading: boolean;
  onSelectShape: (shapeId: string) => void;
  onUpdateShared: (field: string, value: any) => void;
}

const labelClass =
  "block text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1";

/** Shape + grade/cover/repetition inputs shared by every beam in a group. */
export default function SharedParamsBar({
  form,
  isContinuous,
  shapes,
  shapesLoading,
  onSelectShape,
  onUpdateShared,
}: SharedParamsBarProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5 pb-5 border-b border-[#e4e4e7]">
      {/* Shape */}
      <div className="col-span-2 sm:col-span-1">
        <label className={labelClass}>
          Shape <span className="text-amber-500/60">*</span>
        </label>
        {shapesLoading ? (
          <div className="input-field flex items-center gap-2 text-xs">
            <Spinner className="h-3 w-3 border-zinc-300" />
            <span className="text-zinc-400">Loading...</span>
          </div>
        ) : (
          <SelectField
            value={form.shapeId}
            onChange={onSelectShape}
            placeholder="Choose shape"
            options={shapes.map((s) => ({
              value: s._id,
              label: `${s.name}${s.numberOfSides ? ` (${s.numberOfSides}s)` : ""}`,
            }))}
          />
        )}
      </div>

      {/* Shape Name */}
      <div>
        <label className={labelClass}>Shape Name</label>
        <input
          type="text"
          value={form.shapeName}
          readOnly
          placeholder="Auto"
          className="input-field bg-[#f4f4f5] text-zinc-500 cursor-default text-xs"
        />
      </div>

      {/* Grade Concrete */}
      <div>
        <label className={labelClass}>Grade Concrete</label>
        <SelectField
          value={form.gradeConcrete}
          onChange={(v) => onUpdateShared("gradeConcrete", v)}
          placeholder="Select"
          options={GRADE_CONCRETE.map((g) => ({ value: g, label: g }))}
        />
      </div>

      {/* Grade Steel */}
      <div>
        <label className={labelClass}>Grade Steel</label>
        <SelectField
          value={form.gradeSteel}
          onChange={(v) => onUpdateShared("gradeSteel", v)}
          placeholder="Select"
          options={GRADE_STEEL.map((g) => ({ value: g, label: g }))}
        />
      </div>

      {/* Cover */}
      <div>
        <label className={labelClass}>Cover</label>
        <input
          type="text"
          value={form.cover}
          onChange={(e) => onUpdateShared("cover", e.target.value)}
          placeholder="e.g. 25"
          className="input-field text-xs"
        />
      </div>

      {/* Repetition (for continuous groups) */}
      {isContinuous && (
        <div>
          <label className={labelClass}>Repetition</label>
          <input
            type="number"
            value={form.repetition || ""}
            onChange={(e) =>
              onUpdateShared("repetition", parseInt(e.target.value) || 0)
            }
            className="input-field text-xs"
          />
        </div>
      )}
    </div>
  );
}
