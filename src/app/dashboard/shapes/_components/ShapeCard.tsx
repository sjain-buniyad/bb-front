"use client";

import { API_URL, type ShapeItem } from "@/lib/api";

interface ShapeCardProps {
  shape: ShapeItem;
  onDelete: () => void;
}

/** Grid card showing one shape's thumbnail, flags, metrics and formulas. */
export default function ShapeCard({ shape, onDelete }: ShapeCardProps) {
  return (
    <div className="group relative rounded-xl border border-[#e4e4e7] bg-[#ffffff] p-5 transition-colors hover:border-[#d4d4d8]">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {shape.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={`${API_URL}/${shape.image}`}
              alt={shape.name}
              className="w-12 h-12 rounded-lg object-cover border border-[#e4e4e7] bg-[#f4f4f5]"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-sm font-bold">
              {shape.name?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold text-zinc-800">{shape.name}</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              {shape.numberOfSides} sides
            </p>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-500/10 transition-all"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      <FlagBadges isNFB={shape.isNFB} hasStirrup={shape.hasStirrup} />

      <MetricGrid shape={shape} />

      {shape.formula && Object.keys(shape.formula).length > 0 && (
        <div className="mt-3 pt-3 border-t border-[#e4e4e7]">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
            Formula
          </p>
          <div className="space-y-1">
            {Object.entries(shape.formula).map(([key, val]) => (
              <div key={key} className="flex items-center gap-2 text-[10px]">
                <span className="text-accent/70 font-mono min-w-[40px]">{key}</span>
                <span className="text-zinc-300">=</span>
                <span className="text-zinc-600 font-mono">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FlagBadges({ isNFB, hasStirrup }: { isNFB: boolean; hasStirrup: boolean }) {
  if (!isNFB && !hasStirrup) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mb-3">
      {isNFB && (
        <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/20">
          NFB
        </span>
      )}
      {hasStirrup && (
        <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-600 border border-blue-500/20">
          Stirrup
        </span>
      )}
    </div>
  );
}

function MetricGrid({ shape }: { shape: ShapeItem }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
      {shape.LD > 0 && <Metric label="LD" value={String(shape.LD)} />}
      {shape.L > 0 && <Metric label="L" value={String(shape.L)} />}
      {shape.numberOfStirrups > 0 && (
        <Metric label="Stirrups" value={String(shape.numberOfStirrups)} />
      )}
      {shape.allL && shape.allL.length > 0 && (
        <div className="col-span-2">
          <span className="text-zinc-400">allL:</span>{" "}
          <span className="text-zinc-600 font-mono">[{shape.allL.join(", ")}]</span>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-zinc-400">{label}:</span>{" "}
      <span className="text-zinc-600 font-mono">{value}</span>
    </div>
  );
}
