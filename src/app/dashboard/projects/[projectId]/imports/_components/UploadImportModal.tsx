"use client";

import type { Block, Floor } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import { FILE_TYPES } from "../_components/import-constants";

interface UploadImportModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  uploading: boolean;
  blocks: Block[];
  floors: Floor[];
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  // field values
  file: File | null;
  name: string;
  type: string;
  selectedBlock: string;
  selectedFloor: string;
  drgNumber: string;
  drgDate: string;
  structureName: string;
  // field setters
  onFileChange: (file: File | null) => void;
  onNameChange: (v: string) => void;
  onTypeChange: (v: string) => void;
  onBlockChange: (v: string) => void;
  onFloorChange: (v: string) => void;
  onDrgNumberChange: (v: string) => void;
  onDrgDateChange: (v: string) => void;
  onStructureNameChange: (v: string) => void;
}

const labelClass =
  "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-zinc-500";

export default function UploadImportModal(props: UploadImportModalProps) {
  const { open, onClose, onSubmit, uploading, blocks, floors, fileInputRef } = props;

  return (
    <Modal open={open} onClose={onClose} title="New Import" size="lg">
      <form onSubmit={onSubmit} className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={labelClass}>File *</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.xlsx,.xls,.dwg,.rvt"
              onChange={(e) => props.onFileChange(e.target.files?.[0] || null)}
              className="block w-full text-sm text-zinc-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 cursor-pointer bg-[#ffffff] border border-[#e4e4e7] rounded-lg"
            />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Name *</label>
            <input
              type="text"
              required
              value={props.name}
              onChange={(e) => props.onNameChange(e.target.value)}
              placeholder="e.g. Beam Schedule A"
              className="input-field"
            />
          </div>
          <div>
            <label className={labelClass}>Type</label>
            <select
              value={props.type}
              onChange={(e) => props.onTypeChange(e.target.value)}
              className="input-field appearance-none"
            >
              {FILE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Block *</label>
            <select
              value={props.selectedBlock}
              onChange={(e) => props.onBlockChange(e.target.value)}
              className="input-field appearance-none"
              required
            >
              <option value="">Select Block</option>
              {blocks.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Floor *</label>
            <select
              value={props.selectedFloor}
              onChange={(e) => props.onFloorChange(e.target.value)}
              className="input-field appearance-none"
              required
              disabled={!props.selectedBlock}
            >
              <option value="">Select Floor</option>
              {floors.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>DRG Number</label>
            <input
              type="text"
              value={props.drgNumber}
              onChange={(e) => props.onDrgNumberChange(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className={labelClass}>DRG Date</label>
            <input
              type="date"
              value={props.drgDate}
              onChange={(e) => props.onDrgDateChange(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Structure Name</label>
            <input
              type="text"
              value={props.structureName}
              onChange={(e) => props.onStructureNameChange(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-[13px] font-medium text-zinc-600 border border-[#d4d4d8] hover:bg-[#e4e4e7] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="px-5 py-2 rounded-lg text-[13px] font-medium text-zinc-900 bg-accent hover:bg-accent-hover disabled:opacity-40 transition-all"
          >
            {uploading ? "Uploading..." : "Upload & Extract"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
