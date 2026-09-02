"use client";

import SelectField from "@/components/ui/SelectField";
import type { EvalSnapshot, GroupFormState } from "./types";

interface StandaloneBeamFormProps {
  firstBeam: any;
  form: GroupFormState;
  onBeamChange: (field: string, value: any) => void;
  evalState: EvalSnapshot;
}

/** Single-beam editing layout: dimension fields + shape preview + L values. */
export default function StandaloneBeamForm({
  firstBeam,
  form,
  onBeamChange,
  evalState,
}: StandaloneBeamFormProps) {
  const fields = [
    { label: "Beam Width", field: "width", req: true, text: false },
    { label: "Beam Depth", field: "depth", req: true, text: false },
    { label: "Beam Length", field: "length", req: false, text: false },
    { label: "Column in Left", field: "colLeft", req: false, text: true },
    { label: "Column in Right", field: "colRight", req: false, text: true },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Left: dimensions + bar dia */}
      <div className="xl:col-span-2 grid grid-cols-2 gap-4">
        {fields.map((item) => (
          <div key={item.field}>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
              {item.label}{" "}
              {item.req && <span className="text-amber-500/60">*</span>}
            </label>
            <input
              type={item.text ? "text" : "number"}
              value={(form.beams[0] as any)?.[item.field as "width"] || ""}
              onChange={(e) =>
                onBeamChange(
                  item.field,
                  item.text ? e.target.value : parseFloat(e.target.value) || 0,
                )
              }
              placeholder={item.text ? "e.g. C1" : ""}
              className="input-field"
            />
          </div>
        ))}

        {/* Bar & Dia */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
            Bar &amp; Dia
          </label>
          <SelectField
            value={form.beams[0]?.barDia || ""}
            onChange={(v) => onBeamChange("barDia", v)}
            placeholder="Select reinforcement"
            options={(firstBeam.reinforcement || []).map((r: string) => ({
              value: r,
              label: r,
            }))}
          />
        </div>
      </div>

      {/* Right: shape preview placeholder + calculated L values */}
      <div className="space-y-4">
        {form.shapeImage ? (
          <div className="border border-[#e4e4e7] rounded-lg h-28 flex items-center justify-center bg-[#ffffff] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"}/${form.shapeImage}`}
              alt={form.shapeName}
              className="max-h-full max-w-full object-contain p-2"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        ) : (
          <div className="border border-dashed border-[#d4d4d8] rounded-lg h-28 flex flex-col items-center justify-center bg-[#ffffff]">
            <svg
              className="w-5 h-5 text-zinc-300 mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-[10px] text-zinc-400">Shape preview</span>
          </div>
        )}

        <LValuesPanel evalState={evalState} />
      </div>
    </div>
  );
}

export function LValuesPanel({ evalState }: { evalState: EvalSnapshot }) {
  const { loading, error, lVals } = evalState;

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">
        Calculated L Values
      </p>
      {loading && (
        <div className="flex items-center gap-2 bg-[#f4f4f5] border border-[#e4e4e7] rounded-lg px-3 py-4">
          <div className="animate-spin h-3.5 w-3.5 rounded-full border-2 border-zinc-200 border-t-accent" />
          <span className="text-[11px] text-zinc-500">Evaluating...</span>
        </div>
      )}
      {error && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-3">
          <span className="text-[11px] text-red-600">{error}</span>
        </div>
      )}
      {!loading && !error && lVals.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {lVals.map((lv) => (
            <div
              key={lv.key}
              className="bg-[#f4f4f5] border border-[#e4e4e7] rounded-lg p-2.5 text-center hover:border-accent/30 transition-colors"
            >
              <p className="text-[9px] font-semibold uppercase text-zinc-400">
                {lv.key}
              </p>
              <p className="text-base font-bold text-zinc-900 font-mono">
                {lv.value.toFixed(3)}
              </p>
              <p className="text-[8px] text-zinc-300">m</p>
            </div>
          ))}
        </div>
      )}
      {!loading && !error && lVals.length === 0 && (
        <div className="bg-[#f4f4f5] border border-dashed border-[#e4e4e7] rounded-lg px-3 py-4 text-center">
          <p className="text-[10px] text-zinc-300">
            Select shape &amp; fill dimensions
          </p>
        </div>
      )}
    </div>
  );
}
