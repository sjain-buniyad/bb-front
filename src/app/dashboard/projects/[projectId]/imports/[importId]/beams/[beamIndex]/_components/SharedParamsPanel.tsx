"use client";

import type { ShapeItem } from "@/lib/api";
import { GRADE_CONCRETE, GRADE_STEEL } from "@/lib/constants";
import SelectField from "@/components/ui/SelectField";
import Spinner from "@/components/ui/Spinner";
import ShapePreview from "@/components/ui/ShapePreview";

export interface SharedBeamParams {
  shapeId: string;
  shapeName: string;
  shapeImage: string;
  gradeConcrete: string;
  gradeSteel: string;
  cover: string;
  repetition: number;
}

interface SharedParamsPanelProps {
  params: SharedBeamParams;
  onChange: (field: keyof SharedBeamParams, value: any) => void;
  isContinuous: boolean;
  shapes: ShapeItem[];
  shapesLoading: boolean;
  selectedShape?: ShapeItem;
}

const labelClass =
  "block text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5";

/** "Common Parameters" card: shape, grades, cover, repetition + preview. */
export default function SharedParamsPanel({
  params,
  onChange,
  isContinuous,
  shapes,
  shapesLoading,
  selectedShape,
}: SharedParamsPanelProps) {
  return (
    <div className="p-5 rounded-xl border border-[#e4e4e7] bg-[#ffffff]">
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-4">
        Common Parameters
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Shape */}
        <div className="col-span-2 sm:col-span-1">
          <label className={labelClass}>
            Select Shape <span className="text-amber-500/60">*</span>
          </label>
          {shapesLoading ? (
            <div className="input-field flex items-center gap-2 text-xs">
              <Spinner className="h-3 w-3 border-zinc-300" />
              <span className="text-zinc-400">Loading...</span>
            </div>
          ) : (
            <SelectField
              value={params.shapeId}
              onChange={(id) => onChange("shapeId", id)}
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
            value={params.shapeName}
            readOnly
            placeholder="Auto-filled"
            className="input-field bg-[#f4f4f5] text-zinc-500 cursor-default text-xs"
          />
        </div>

        {/* Grade Concrete */}
        <div>
          <label className={labelClass}>Grade of Concrete</label>
          <SelectField
            value={params.gradeConcrete}
            onChange={(v) => onChange("gradeConcrete", v)}
            placeholder="Select"
            options={GRADE_CONCRETE.map((g) => ({ value: g, label: g }))}
          />
        </div>

        {/* Grade Steel */}
        <div>
          <label className={labelClass}>Grade of Steel</label>
          <SelectField
            value={params.gradeSteel}
            onChange={(v) => onChange("gradeSteel", v)}
            placeholder="Select"
            options={GRADE_STEEL.map((g) => ({ value: g, label: g }))}
          />
        </div>

        {/* Cover */}
        <div>
          <label className={labelClass}>Cover</label>
          <input
            type="text"
            value={params.cover}
            onChange={(e) => onChange("cover", e.target.value)}
            placeholder="e.g. 25"
            className="input-field text-xs"
          />
        </div>

        {/* Repetition (continuous only) */}
        {isContinuous && (
          <div>
            <label className={labelClass}>Repetition</label>
            <input
              type="number"
              value={params.repetition || ""}
              onChange={(e) => onChange("repetition", parseInt(e.target.value) || 0)}
              className="input-field text-xs"
            />
          </div>
        )}
      </div>

      {/* Shape preview + formulas */}
      {params.shapeImage && (
        <ShapePreview
          size="lg"
          src={params.shapeImage}
          name={params.shapeName}
          formula={selectedShape?.formula}
          isNFB={selectedShape?.isNFB}
          hasStirrup={selectedShape?.hasStirrup}
        />
      )}
    </div>
  );
}
