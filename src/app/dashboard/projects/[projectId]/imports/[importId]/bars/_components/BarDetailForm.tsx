"use client";

import { DIMENSION_KEYS, type BarItem } from "./types";

interface BarDetailFormProps {
  item: BarItem;
  onFieldChange: (field: keyof BarItem, value: any) => void;
  onDimChange: (key: string, value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const labelClass =
  "block text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5";

/** Editable detail panel shown when a bar row is expanded. */
export default function BarDetailForm({
  item,
  onFieldChange,
  onDimChange,
  onDescriptionChange,
}: BarDetailFormProps) {
  const isDescription = typeof item.data === "string";
  const dims = !isDescription ? (item.data as Record<string, any>) || {} : {};

  return (
    <div className="px-5 py-5 bg-[#f4f4f5] border-t border-[#ffffff] space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div>
          <label className={labelClass}>Bar Mark / Position</label>
          <input
            type="text"
            value={item.bar_mark || ""}
            onChange={(e) => onFieldChange("bar_mark", e.target.value)}
            className="input-field text-xs"
          />
        </div>
        <div>
          <label className={labelClass}>Diameter (mm)</label>
          <input
            type="number"
            value={item.diameter ?? ""}
            onChange={(e) => onFieldChange("diameter", Number(e.target.value))}
            className="input-field text-xs"
          />
        </div>
        <div>
          <label className={labelClass}>Qty</label>
          <input
            type="number"
            value={item.qty ?? ""}
            onChange={(e) => onFieldChange("qty", Number(e.target.value))}
            className="input-field text-xs"
          />
        </div>
        <div>
          <label className={labelClass}>Cutting Length</label>
          <input
            type="number"
            value={item.length ?? ""}
            onChange={(e) => onFieldChange("length", Number(e.target.value))}
            className="input-field text-xs"
          />
        </div>
        <div>
          <label className={labelClass}>Total Bar Length</label>
          <input
            type="number"
            value={item.total_bar_length ?? ""}
            onChange={(e) =>
              onFieldChange("total_bar_length", Number(e.target.value))
            }
            className="input-field text-xs"
          />
        </div>
        <div>
          <label className={labelClass}>Total Weight (kg)</label>
          <input
            type="number"
            value={item.total_weigth ?? ""}
            onChange={(e) =>
              onFieldChange("total_weigth", Number(e.target.value))
            }
            className="input-field text-xs"
          />
        </div>
      </div>

      <div>
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-3">
          Bending Details
        </h4>
        {isDescription ? (
          <textarea
            value={item.data as string}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Description (no bending dimensions, e.g. sleeves, couplers, plates)"
            rows={2}
            className="input-field text-xs w-full resize-none"
          />
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
            {DIMENSION_KEYS.map((key) => (
              <div key={key}>
                <label className={labelClass}>{key}</label>
                <input
                  type="text"
                  value={dims[key] ?? ""}
                  onChange={(e) => onDimChange(key, e.target.value)}
                  className="input-field text-xs"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
