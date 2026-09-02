"use client";

import type { CreateProjectPayload } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import { PlusIcon } from "@/components/ui/icons";
import ProjectFormFields from "./ProjectFormFields";

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  form: CreateProjectPayload;
  onChange: (patch: Partial<CreateProjectPayload>) => void;
  onSubmit: (e: React.FormEvent) => void;
  creating: boolean;
}

export default function CreateProjectModal({
  open,
  onClose,
  form,
  onChange,
  onSubmit,
  creating,
}: CreateProjectModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Project"
      subtitle="Create a new construction project"
      size="lg"
      icon={
        <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
          <PlusIcon className="w-4 h-4 text-sky-400" />
        </div>
      }
    >
      <form onSubmit={onSubmit} className="p-5 space-y-4">
        <ProjectFormFields form={form} onChange={onChange} />

        <div className="flex justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-[13px] font-medium text-zinc-600 border border-[#d4d4d8] hover:bg-[#e4e4e7] transition-colors"
          >
            Cancel
          </button>
          <SubmitButton
            pending={creating}
            pendingLabel="Creating..."
            label="Create Project"
            colorClass="bg-emerald-500 hover:bg-emerald-600"
          />
        </div>
      </form>
    </Modal>
  );
}

export function SubmitButton({
  pending,
  pendingLabel,
  label,
  colorClass,
}: {
  pending: boolean;
  pendingLabel: string;
  label: string;
  colorClass: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={`px-5 py-2 rounded-lg text-[13px] font-medium text-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all ${colorClass}`}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          {pendingLabel}
        </span>
      ) : (
        label
      )}
    </button>
  );
}
