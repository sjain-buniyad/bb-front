"use client";

import { useEffect, useState } from "react";
import { DIMENSION_KEYS, type BarItem } from "./types";

interface BarDetailFormProps {
  item: BarItem;
  imageUrl?: string;
  imageUploading?: boolean;
  onFieldChange: (field: keyof BarItem, value: any) => void;
  onDimChange: (key: string, value: string) => void;
  onDescriptionChange: (value: string) => void;
  onImageUpload: (file: File) => void;
}

const labelClass =
  "block text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5";

/** Editable detail panel shown when a bar row is expanded. */
export default function BarDetailForm({
  item,
  imageUrl,
  imageUploading,
  onFieldChange,
  onDimChange,
  onDescriptionChange,
  onImageUpload,
}: BarDetailFormProps) {
  const isDescription = typeof item.data === "string";
  const dims = !isDescription ? (item.data as Record<string, any>) || {} : {};
  const [imageFailed, setImageFailed] = useState(false);

  // Give the newly-uploaded image a fresh chance to load instead of staying
  // stuck on the previous "failed" state.
  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

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
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Bending Shape
          </h4>
          <label
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium text-accent border border-accent/30 transition-colors ${
              imageUploading
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-accent/10"
            }`}
          >
            {imageUploading
              ? "Uploading..."
              : item.crop_image
                ? "Change Image"
                : "Add Image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={imageUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImageUpload(file);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        {imageUrl && !imageFailed ? (
          <div className="inline-block bg-[#ffffff] border border-[#e4e4e7] rounded-lg p-3">
            <img
              src={imageUrl}
              alt={`Bending shape for ${item.bar_mark || "bar"}`}
              className="max-h-40 max-w-full object-contain"
              onError={() => setImageFailed(true)}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-24 w-48 rounded-lg border border-dashed border-[#d4d4d8] text-xs text-zinc-500">
            No image
          </div>
        )}
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
