"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/ui/icons";
import PlateDetailForm from "./PlateDetailForm";
import type { PlateItem } from "./types";

interface PlateTableProps {
  plates: PlateItem[];
  onChange: (index: number, field: keyof PlateItem, value: any) => void;
}

/** Bar-table-style accordion for the bar section's plate data — click a row to expand and edit it. */
export default function PlateTable({ plates, onChange }: PlateTableProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="bg-[#ffffff] border border-[#e4e4e7] rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-[#e4e4e7]">
        <h2 className="text-sm font-semibold text-zinc-900">Plates</h2>
      </div>
      <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#e4e4e7] text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
        <div className="col-span-1">#</div>
        <div className="col-span-2">Plate Name</div>
        <div className="col-span-1 text-center">Qty</div>
        <div className="col-span-2 text-center">Repetition</div>
        <div className="col-span-3">Profile</div>
        <div className="col-span-2 text-right">Weight (kg)</div>
        <div className="col-span-1" />
      </div>
      <div className="divide-y divide-[#f4f4f5]">
        {plates.length === 0 ? (
          <div className="py-16 text-center text-sm text-zinc-500">
            No plates found
          </div>
        ) : (
          plates.map((plate, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div key={index}>
                <div
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-[#f4f4f5] transition-colors cursor-pointer"
                >
                  <div className="col-span-1 text-sm text-zinc-400">
                    {index + 1}
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-zinc-800">
                      {plate.plate_name || "—"}
                    </span>
                  </div>
                  <div className="col-span-1 text-center text-sm text-zinc-600">
                    {plate.qty ?? "—"}
                  </div>
                  <div className="col-span-2 text-center text-sm text-zinc-600">
                    {plate.plate_repetation ?? "—"}
                  </div>
                  <div className="col-span-3">
                    <span className="text-xs text-zinc-600 bg-[#f4f4f5] px-2 py-1 rounded font-mono">
                      {plate.plate_profile || "—"}
                    </span>
                  </div>
                  <div className="col-span-2 text-right text-sm text-zinc-700">
                    {plate.weigth ?? "—"}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <ChevronDownIcon
                      className={`w-4 h-4 text-zinc-400 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {isExpanded && (
                  <PlateDetailForm
                    plate={plate}
                    onFieldChange={(field, value) =>
                      onChange(index, field, value)
                    }
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
