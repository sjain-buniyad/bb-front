"use client";

import type { BeamGroup } from "@/lib/beams";
import { EyeIcon, MergeIcon } from "@/components/ui/icons";

interface BeamGroupRowProps {
  group: BeamGroup;
  /** 1-based position within the full (unfiltered) list */
  groupNumber: number;
  selected: boolean;
  onToggleSelect: () => void;
  onToggle: () => void;
  onViewDetail: () => void;
}

/** Collapsed table row summarising one beam or continuous-beam group. */
export default function BeamGroupRow({
  group,
  groupNumber,
  selected,
  onToggleSelect,
  onToggle,
  onViewDetail,
}: BeamGroupRowProps) {
  const firstBeam = group.beams[0];
  const allReinforcements = group.beams.flatMap(
    (b: any) => b.reinforcement || [],
  );
  const uniqueReinforcements = Array.from(new Set<any>(allReinforcements));

  return (
    <div
      onClick={onToggle}
      className={`grid grid-cols-12 gap-4 px-5 py-4 items-center transition-colors cursor-pointer ${
        selected ? "bg-accent/5" : "hover:bg-[#f4f4f5]"
      }`}
    >
      <div className="col-span-1 flex items-center gap-2.5">
        <input
          type="checkbox"
          checked={selected}
          onClick={(e) => e.stopPropagation()}
          onChange={onToggleSelect}
          className="w-4 h-4 shrink-0 rounded border-zinc-300 bg-zinc-200 text-accent focus:ring-accent/30 cursor-pointer"
          title="Select to merge"
        />
        <span className="text-sm text-zinc-400">{groupNumber}</span>
      </div>

      <div className="col-span-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-800">
            {group.isContinuous
              ? group.beams.map((b: any) => b.name).join(", ")
              : group.baseName}
          </span>
          {group.isContinuous && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-accent/10 text-accent border border-accent/20">
              {group.beams.length}
            </span>
          )}
        </div>
      </div>

      <div className="col-span-3 text-center">
        {group.isContinuous ? (
          <div className="flex flex-wrap gap-1 justify-center">
            {group.beams.map((b: any, i: number) => (
              <span
                key={i}
                className="text-[10px] text-zinc-500 bg-[#f4f4f5] px-1.5 py-0.5 rounded font-mono"
              >
                {b.size?.width || 0}x{b.size?.depth || 0}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-zinc-600 bg-[#f4f4f5] px-2 py-1 rounded font-mono">
            {firstBeam.size?.width || 0} x {firstBeam.size?.depth || 0}
          </span>
        )}
      </div>

      <div className="col-span-4 text-center">
        <div className="flex flex-wrap gap-1 justify-center">
          {uniqueReinforcements.slice(0, 6).map((r: string, i: number) => (
            <span
              key={i}
              className="text-[10px] text-zinc-500 bg-[#f4f4f5] border border-[#e4e4e7] px-1.5 py-0.5 rounded"
            >
              {r}
            </span>
          ))}
          {uniqueReinforcements.length > 6 && (
            <span className="text-[10px] text-zinc-400">
              +{uniqueReinforcements.length - 6}
            </span>
          )}
        </div>
      </div>

      <div className="col-span-2 flex justify-end pr-2 gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail();
          }}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-zinc-600 border border-[#d4d4d8] hover:bg-[#e4e4e7] hover:text-zinc-800 transition-colors"
          title="Open detail"
        >
          <EyeIcon />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect();
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors ${
            selected
              ? "text-accent border-accent/40 bg-accent/10"
              : "text-zinc-600 border-[#d4d4d8] hover:bg-[#e4e4e7] hover:text-zinc-800"
          }`}
          title={
            selected
              ? "Remove from merge selection"
              : "Add to merge selection"
          }
        >
          <MergeIcon />
          {selected ? "Selected" : "Merge"}
        </button>
      </div>
    </div>
  );
}
