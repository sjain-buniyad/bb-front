"use client";

import type { CreateProjectPayload } from "@/lib/api";
import { ChevronDownIcon } from "@/components/ui/icons";

interface ProjectFormFieldsProps {
  form: CreateProjectPayload;
  onChange: (patch: Partial<CreateProjectPayload>) => void;
}

const labelClass =
  "block text-[11px] font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider";

/** Field grid shared by the create & edit project modals. */
export default function ProjectFormFields({
  form,
  onChange,
}: ProjectFormFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label className={labelClass}>Project Name *</label>
        <input
          type="text"
          required
          placeholder="e.g. Metro Rail Phase 2"
          value={form.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="input-field"
        />
      </div>
      <div>
        <label className={labelClass}>Project Type</label>
        <div className="relative">
          <select
            value={form.type}
            onChange={(e) => onChange({ type: e.target.value })}
            className="input-field appearance-none cursor-pointer pr-9"
          >
            <option value="bbs">BBS</option>
            <option value="waste">Waste</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
            <ChevronDownIcon />
          </div>
        </div>
      </div>
      <div>
        <label className={labelClass}>Bar Length</label>
        <input
          type="number"
          min="1"
          placeholder="12"
          value={form.bar_length}
          onChange={(e) =>
            onChange({ bar_length: parseInt(e.target.value) || 12 })
          }
          className="input-field"
        />
      </div>
      <div>
        <label className={labelClass}>Manager</label>
        <input
          type="text"
          placeholder="Project manager"
          value={form.manager}
          onChange={(e) => onChange({ manager: e.target.value })}
          className="input-field"
        />
      </div>
      <div>
        <label className={labelClass}>Developer</label>
        <input
          type="text"
          placeholder="Developer name"
          value={form.developer}
          onChange={(e) => onChange({ developer: e.target.value })}
          className="input-field"
        />
      </div>
      <div>
        <label className={labelClass}>Contractor</label>
        <input
          type="text"
          placeholder="Contractor name"
          value={form.contrator}
          onChange={(e) => onChange({ contrator: e.target.value })}
          className="input-field"
        />
      </div>
      <div>
        <label className={labelClass}>Consultant</label>
        <input
          type="text"
          placeholder="Consultant name"
          value={form.consultant}
          onChange={(e) => onChange({ consultant: e.target.value })}
          className="input-field"
        />
      </div>
      <div>
        <label className={labelClass}>Start Date</label>
        <input
          type="date"
          value={form.start_date}
          onChange={(e) => onChange({ start_date: e.target.value })}
          className="input-field"
        />
      </div>
      <div>
        <label className={labelClass}>End Date</label>
        <input
          type="date"
          value={form.end_date}
          onChange={(e) => onChange({ end_date: e.target.value })}
          className="input-field"
        />
      </div>
      <div className="col-span-2">
        <label className={labelClass}>Description</label>
        <textarea
          rows={3}
          placeholder="Brief project description..."
          value={form.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className="input-field resize-none"
        />
      </div>
    </div>
  );
}
