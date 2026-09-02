"use client";

import type { PlateItem } from "./types";

interface PlateDetailFormProps {
  plate: PlateItem;
  onFieldChange: (field: keyof PlateItem, value: any) => void;
}

const labelClass =
  "block text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5";

/** Editable detail panel shown when a plate row is expanded. */
export default function PlateDetailForm({
  plate,
  onFieldChange,
}: PlateDetailFormProps) {
  return (
    <div className="px-5 py-5 bg-[#f4f4f5] border-t border-[#ffffff]">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-4">
        <div>
          <label className={labelClass}>Plate Name</label>
          <input
            type="text"
            value={plate.plate_name ?? ""}
            onChange={(e) => onFieldChange("plate_name", e.target.value)}
            className="input-field text-xs"
          />
        </div>
        <div>
          <label className={labelClass}>Qty</label>
          <input
            type="number"
            value={plate.qty ?? ""}
            onChange={(e) =>
              onFieldChange(
                "qty",
                e.target.value === "" ? null : Number(e.target.value),
              )
            }
            placeholder="From mark table"
            className="input-field text-xs"
          />
        </div>
        <div>
          <label className={labelClass}>Repetition</label>
          <input
            type="number"
            value={plate.plate_repetation ?? ""}
            onChange={(e) =>
              onFieldChange("plate_repetation", Number(e.target.value))
            }
            className="input-field text-xs"
          />
        </div>
        <div>
          <label className={labelClass}>Profile</label>
          <input
            type="text"
            value={plate.plate_profile ?? ""}
            onChange={(e) => onFieldChange("plate_profile", e.target.value)}
            placeholder="e.g. 12x200x2"
            className="input-field text-xs"
          />
        </div>
        <div>
          <label className={labelClass}>Weight (kg)</label>
          <input
            type="number"
            value={plate.weigth ?? ""}
            onChange={(e) => onFieldChange("weigth", Number(e.target.value))}
            className="input-field text-xs"
          />
        </div>
        <div>
          <label className={labelClass}>Dia of Lug</label>
          <input
            type="number"
            value={plate.dia_of_lug ?? ""}
            onChange={(e) => onFieldChange("dia_of_lug", Number(e.target.value))}
            className="input-field text-xs"
          />
        </div>
        <div>
          <label className={labelClass}>Total Length of Lug</label>
          <input
            type="number"
            value={plate.total_length_of_lug ?? ""}
            onChange={(e) =>
              onFieldChange("total_length_of_lug", Number(e.target.value))
            }
            className="input-field text-xs"
          />
        </div>
        <div>
          <label className={labelClass}>Total Weight of Lug</label>
          <input
            type="number"
            value={plate.total_weight_of_lug ?? ""}
            onChange={(e) =>
              onFieldChange("total_weight_of_lug", Number(e.target.value))
            }
            className="input-field text-xs"
          />
        </div>
      </div>
    </div>
  );
}
