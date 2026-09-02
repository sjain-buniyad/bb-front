"use client";

import SelectField from "@/components/ui/SelectField";
import type { BeamFormEntry, EvalSnapshot, GroupFormState } from "./types";

interface SpanDetailsTableProps {
  beams: any[];
  form: GroupFormState;
  onBeamChange: (bIdx: number, field: string, value: any) => void;
  getEvalFor: (bIdx: number) => EvalSnapshot;
}

/** Editable per-span table for continuous beam groups. */
export default function SpanDetailsTable({
  beams,
  form,
  onBeamChange,
  getEvalFor,
}: SpanDetailsTableProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
          Span Details
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400 border-b border-[#e4e4e7]">
              <th className="py-2 pr-3 w-8">#</th>
              <th className="py-2 pr-3">Name</th>
              <th className="py-2 pr-3">Width</th>
              <th className="py-2 pr-3">Depth</th>
              <th className="py-2 pr-3">Length</th>
              <th className="py-2 pr-3">Bar &amp; Dia</th>
              <th className="py-2 pr-3">Col Left</th>
              <th className="py-2 pr-3">Col Right</th>
              <th className="py-2">L Values</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f4f4f5]">
            {beams.map((beam: any, bIdx: number) => {
              const bf: BeamFormEntry = form.beams[bIdx] || {
                width: beam.size?.width || 0,
                depth: beam.size?.depth || 0,
                length: beam.size?.length || 0,
                barDia: beam.reinforcement?.[0] || "",
                colLeft: "",
                colRight: "",
              };
              const evalState = getEvalFor(bIdx);

              return (
                <tr key={bIdx} className="align-top">
                  <td className="py-2 pr-3 text-[11px] text-zinc-400">
                    {bIdx + 1}
                  </td>
                  <td className="py-2 pr-3">
                    <span className="text-xs font-medium text-zinc-700">
                      {beam.name}
                    </span>
                  </td>
                  <td className="py-2 pr-3">
                    <NumberCell
                      value={bf.width}
                      onChange={(v) => onBeamChange(bIdx, "width", v)}
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <NumberCell
                      value={bf.depth}
                      onChange={(v) => onBeamChange(bIdx, "depth", v)}
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <NumberCell
                      value={bf.length}
                      placeholder="—"
                      onChange={(v) => onBeamChange(bIdx, "length", v)}
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <select
                      value={bf.barDia}
                      onChange={(e) =>
                        onBeamChange(bIdx, "barDia", e.target.value)
                      }
                      className="w-24 input-field !py-1 !px-2 text-xs appearance-none"
                    >
                      <option value="">Select</option>
                      {(beam.reinforcement || []).map((r: string, ri: number) => (
                        <option key={ri} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      type="text"
                      value={bf.colLeft}
                      onChange={(e) =>
                        onBeamChange(bIdx, "colLeft", e.target.value)
                      }
                      placeholder="—"
                      className="w-16 input-field !py-1 !px-2 text-xs"
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      type="text"
                      value={bf.colRight}
                      onChange={(e) =>
                        onBeamChange(bIdx, "colRight", e.target.value)
                      }
                      placeholder="—"
                      className="w-16 input-field !py-1 !px-2 text-xs"
                    />
                  </td>
                  <LValuesCell evalState={evalState} />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NumberCell({
  value,
  onChange,
  placeholder,
}: {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="number"
      value={value || ""}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      placeholder={placeholder}
      className="w-20 input-field !py-1 !px-2 text-xs"
    />
  );
}

function LValuesCell({ evalState }: { evalState: EvalSnapshot }) {
  return (
    <td className="py-2 min-w-[180px]">
      {evalState.loading && (
        <div className="flex items-center gap-1.5">
          <div className="animate-spin h-3 w-3 rounded-full border-2 border-zinc-200 border-t-accent" />
        </div>
      )}
      {evalState.error && (
        <span className="text-[10px] text-red-600">{evalState.error}</span>
      )}
      {!evalState.loading && !evalState.error && evalState.lVals.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {evalState.lVals.map((lv) => (
            <span
              key={lv.key}
              className="inline-flex items-center gap-1 text-[10px] bg-[#f4f4f5] border border-[#e4e4e7] rounded px-1.5 py-0.5"
            >
              <span className="text-accent/70 font-mono">{lv.key}</span>
              <span className="text-zinc-400">=</span>
              <span className="text-zinc-700 font-mono font-medium">
                {lv.value.toFixed(3)}
              </span>
            </span>
          ))}
        </div>
      )}
      {!evalState.loading && !evalState.error && evalState.lVals.length === 0 && (
        <span className="text-[10px] text-zinc-300">—</span>
      )}
    </td>
  );
}
