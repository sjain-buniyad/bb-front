"use client";

import SelectField from "@/components/ui/SelectField";
import type { BeamEntry } from "./types";

interface BeamFormCardProps {
  beam: BeamEntry;
  index: number;
  isContinuous: boolean;
  totalBeams: number;
  onChange: (field: keyof BeamEntry, value: any) => void;
  evalState: {
    lVals: { key: string; value: number }[];
    loading?: boolean;
    error?: string;
  };
}

const labelClass =
  "block text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5";

/** Card for one beam/span: header, dimension inputs and L values. */
export default function BeamFormCard({
  beam: bf,
  index: bIdx,
  isContinuous,
  totalBeams,
  onChange,
  evalState,
}: BeamFormCardProps) {
  return (
    <div className="p-5 rounded-xl border border-[#e4e4e7] bg-[#ffffff]">
      {/* Beam header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-xs font-bold">
            {isContinuous ? bIdx + 1 : "#"}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-800">{bf.name}</h4>
            {isContinuous && (
              <p className="text-[10px] text-zinc-400">
                Span {bIdx + 1} of {totalBeams}
              </p>
            )}
          </div>
        </div>
        {bf.originalReinforcement.length > 0 && (
          <div className="flex gap-1">
            {bf.originalReinforcement.map((r, ri) => (
              <span
                key={ri}
                className="text-[10px] text-zinc-500 bg-[#f4f4f5] border border-[#e4e4e7] px-1.5 py-0.5 rounded"
              >
                {r}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Form + Eval side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Dimensions */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <NumberField
            label="Width"
            required
            value={bf.width}
            onChange={(v) => onChange("width", v)}
          />
          <NumberField
            label="Depth"
            required
            value={bf.depth}
            onChange={(v) => onChange("depth", v)}
          />
          <NumberField
            label="Length"
            placeholder="—"
            value={bf.length}
            onChange={(v) => onChange("length", v)}
          />
          <div>
            <label className={labelClass}>Bar &amp; Dia</label>
            <SelectField
              value={bf.barDia}
              onChange={(v) => onChange("barDia", v)}
              placeholder="Select"
              options={bf.originalReinforcement.map((r) => ({
                value: r,
                label: r,
              }))}
            />
          </div>
          <TextField
            label="Column Left"
            placeholder="e.g. C1"
            value={bf.colLeft}
            onChange={(v) => onChange("colLeft", v)}
          />
          <TextField
            label="Column Right"
            placeholder="e.g. C2"
            value={bf.colRight}
            onChange={(v) => onChange("colRight", v)}
          />
        </div>

        {/* L Values */}
        <LValuesCard evalState={evalState} />
      </div>
    </div>
  );
}

function NumberField({
  label,
  required,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  placeholder?: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label} {required && <span className="text-amber-500/60">*</span>}
      </label>
      <input
        type="number"
        value={value || ""}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        placeholder={placeholder}
        className="input-field text-xs"
      />
    </div>
  );
}

function TextField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field text-xs"
      />
    </div>
  );
}

function LValuesCard({
  evalState,
}: {
  evalState: { lVals: { key: string; value: number }[]; loading?: boolean; error?: string };
}) {
  const { loading, error, lVals } = evalState;

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">
        Calculated L Values
      </p>
      {loading && (
        <div className="flex items-center gap-2 bg-[#f4f4f5] border border-[#e4e4e7] rounded-lg px-3 py-6">
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
        <div className="bg-[#f4f4f5] border border-dashed border-[#e4e4e7] rounded-lg px-3 py-6 text-center">
          <svg
            className="w-4 h-4 text-zinc-200 mx-auto mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <p className="text-[10px] text-zinc-300">
            Select shape &amp; fill dimensions
          </p>
        </div>
      )}
    </div>
  );
}
