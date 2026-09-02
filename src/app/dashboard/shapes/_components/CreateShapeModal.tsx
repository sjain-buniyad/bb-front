"use client";

import Modal from "@/components/ui/Modal";
import { CloseIcon, PlusIcon } from "@/components/ui/icons";
import type { FormulaEntry, ShapeFormState } from "./shape-form";

interface CreateShapeModalProps {
  open: boolean;
  onClose: () => void;
  form: ShapeFormState;
  onChange: (patch: Partial<ShapeFormState>) => void;
  onSubmit: () => void;
  creating: boolean;
}

const labelClass =
  "block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5";

export default function CreateShapeModal({
  open,
  onClose,
  form,
  onChange,
  onSubmit,
  creating,
}: CreateShapeModalProps) {
  const updateFormula = (index: number, field: "key" | "value", val: string) => {
    const updated = [...form.formulas];
    updated[index][field] = val;
    onChange({ formulas: updated });
  };

  const addFormulaRow = () =>
    onChange({ formulas: [...form.formulas, { key: "", value: "" }] });

  const removeFormulaRow = (index: number) => {
    if (form.formulas.length <= 1) return;
    onChange({ formulas: form.formulas.filter((_, i) => i !== index) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[5vh] overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#ffffff] border border-[#e4e4e7] rounded-xl shadow-2xl shadow-black/60 mb-8">
        <div className="flex items-center justify-between border-b border-[#e4e4e7] px-5 py-4">
          <h2 className="text-[15px] font-semibold text-zinc-900">Create Shape</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-700 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Name */}
          <div>
            <label className={labelClass}>Shape Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g. Rectangle, L-Shape"
              className="input-field"
            />
          </div>

          {/* Numeric fields */}
          <div className="grid grid-cols-2 gap-4">
            <NumberField
              label="Number of Sides"
              value={form.numberOfSides}
              onChange={(v) => onChange({ numberOfSides: v })}
            />
            <NumberField label="LD" value={form.LD} onChange={(v) => onChange({ LD: v })} />
            <NumberField label="L" value={form.L} onChange={(v) => onChange({ L: v })} />
            <NumberField
              label="Number of Stirrups"
              value={form.numberOfStirrups}
              onChange={(v) => onChange({ numberOfStirrups: v })}
            />
          </div>

          {/* allL */}
          <div>
            <label className={labelClass}>All L Values</label>
            <input
              type="text"
              value={form.allL}
              onChange={(e) => onChange({ allL: e.target.value })}
              placeholder="e.g. 120, 80, 120, 80"
              className="input-field"
            />
            <p className="mt-1 text-[10px] text-zinc-400">
              Comma-separated length values
            </p>
          </div>

          {/* Checkboxes */}
          <div className="flex items-center gap-6">
            <Checkbox
              checked={form.isNFB}
              onChange={(v) => onChange({ isNFB: v })}
              label="NFB"
            />
            <Checkbox
              checked={form.hasStirrup}
              onChange={(v) => onChange({ hasStirrup: v })}
              label="Has Stirrup"
            />
          </div>

          {/* Formula rows */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelClass}>Formulas</label>
              <button
                type="button"
                onClick={addFormulaRow}
                className="inline-flex items-center gap-1 text-[11px] text-accent hover:text-accent-hover transition-colors"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                Add Row
              </button>
            </div>
            <FormulaRows
              formulas={form.formulas}
              onUpdate={updateFormula}
              onRemove={removeFormulaRow}
            />
            <p className="mt-1.5 text-[10px] text-zinc-400">
              Empty keys will be ignored. Use variable names from the shape (L, B, LD, etc.)
            </p>
          </div>

          {/* File Upload */}
          <div>
            <label className={labelClass}>Shape Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onChange({ file: e.target.files?.[0] || null })}
              className="input-field text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-accent/10 file:text-accent hover:file:bg-accent/20 file:cursor-pointer"
            />
            {form.file && (
              <p className="mt-1.5 text-[11px] text-zinc-500 truncate">{form.file.name}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-[#d4d4d8] px-4 py-2 text-[13px] font-medium text-zinc-600 hover:bg-[#e4e4e7] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={creating || !form.name.trim() || !form.file}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-zinc-900 font-medium text-sm hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {creating ? (
                <>
                  <div className="animate-spin h-4 w-4 rounded-full border-2 border-white/30 border-t-white" />
                  Creating...
                </>
              ) : (
                "Create Shape"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type="number"
        value={value || ""}
        onChange={(e) =>
          onChange(label === "LD" || label === "L" ? parseFloat(e.target.value) || 0 : parseInt(e.target.value) || 0)
        }
        className="input-field"
      />
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-zinc-300 bg-zinc-200 text-accent focus:ring-accent/30"
      />
      <span className="text-sm text-zinc-600">{label}</span>
    </label>
  );
}

function FormulaRows({
  formulas,
  onUpdate,
  onRemove,
}: {
  formulas: FormulaEntry[];
  onUpdate: (index: number, field: "key" | "value", val: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-2">
      {formulas.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={entry.key}
            onChange={(e) => onUpdate(index, "key", e.target.value)}
            placeholder="Key (e.g. area)"
            className="input-field flex-1 text-sm"
          />
          <span className="text-zinc-400 text-sm font-mono">=</span>
          <input
            type="text"
            value={entry.value}
            onChange={(e) => onUpdate(index, "value", e.target.value)}
            placeholder="Value (e.g. L*B)"
            className="input-field flex-[2] text-sm"
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            disabled={formulas.length <= 1}
            className="shrink-0 p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-500/10 transition-all disabled:opacity-20 disabled:pointer-events-none"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
