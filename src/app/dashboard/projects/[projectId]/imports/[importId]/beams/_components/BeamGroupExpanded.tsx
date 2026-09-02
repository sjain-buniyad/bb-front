"use client";

import type { ShapeItem } from "@/lib/api";
import ShapePreview from "@/components/ui/ShapePreview";
import type { BeamGroup } from "@/lib/beams";
import SharedParamsBar from "./SharedParamsBar";
import SpanDetailsTable from "./SpanDetailsTable";
import StandaloneBeamForm from "./StandaloneBeamForm";
import type { EvalSnapshot, GroupFormState } from "./types";

interface BeamGroupExpandedProps {
  group: BeamGroup;
  form: GroupFormState;
  shapes: ShapeItem[];
  shapesLoading: boolean;
  selectedShape?: ShapeItem;
  onSelectShape: (shapeId: string) => void;
  onUpdateShared: (field: string, value: any) => void;
  onBeamChange: (bIdx: number, field: string, value: any) => void;
  getEvalFor: (bIdx: number) => EvalSnapshot;
}

/** Everything rendered when a group row is expanded. */
export default function BeamGroupExpanded({
  group,
  form,
  shapes,
  shapesLoading,
  selectedShape,
  onSelectShape,
  onUpdateShared,
  onBeamChange,
  getEvalFor,
}: BeamGroupExpandedProps) {
  return (
    <div className="px-5 py-5 bg-[#f4f4f5] border-t border-[#ffffff]">
      {/* Banner */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2.5 flex-1">
          <svg
            className="h-4 w-4 text-amber-600 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-xs text-amber-600">
            {group.isContinuous
              ? `Continuous beam group — shared shape & grades apply to all ${group.beams.length} spans.`
              : "Fill shape, width & depth to auto-calculate L values."}
          </p>
        </div>
        <button className="shrink-0 ml-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-zinc-900 font-medium text-xs hover:bg-accent-hover transition-colors">
          Save
        </button>
      </div>

      {/* Shared parameters */}
      <SharedParamsBar
        form={form}
        isContinuous={group.isContinuous}
        shapes={shapes}
        shapesLoading={shapesLoading}
        onSelectShape={onSelectShape}
        onUpdateShared={onUpdateShared}
      />

      {/* Shape preview (expanded groups only) */}
      {form.shapeImage && (
        <ShapePreview
          src={form.shapeImage}
          name={form.shapeName}
          formula={selectedShape?.formula}
          isNFB={selectedShape?.isNFB}
          hasStirrup={selectedShape?.hasStirrup}
        />
      )}

      {/* Per-beam content */}
      {group.isContinuous ? (
        <SpanDetailsTable
          beams={group.beams}
          form={form}
          onBeamChange={onBeamChange}
          getEvalFor={getEvalFor}
        />
      ) : (
        <StandaloneBeamForm
          firstBeam={group.beams[0]}
          form={form}
          onBeamChange={(field, value) => onBeamChange(0, field, value)}
          evalState={getEvalFor(0)}
        />
      )}
    </div>
  );
}
