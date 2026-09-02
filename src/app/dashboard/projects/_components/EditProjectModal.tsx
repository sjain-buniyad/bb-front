"use client";

import type { CreateProjectPayload, Project } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import { PencilIcon } from "@/components/ui/icons";
import ProjectFormFields from "./ProjectFormFields";
import { SubmitButton } from "./CreateProjectModal";

interface EditProjectModalProps {
  open: boolean;
  project: Project | null;
  onClose: () => void;
  form: CreateProjectPayload;
  onChange: (patch: Partial<CreateProjectPayload>) => void;
  onSubmit: (e: React.FormEvent) => void;
  updating: boolean;
}

export default function EditProjectModal({
  open,
  project,
  onClose,
  form,
  onChange,
  onSubmit,
  updating,
}: EditProjectModalProps) {
  return (
    <Modal
      open={open && !!project}
      onClose={onClose}
      title="Edit Project"
      subtitle={`Update ${project?.name ?? ""}`}
      size="lg"
      icon={
        <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
          <PencilIcon className="w-4 h-4 text-sky-400" />
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
            pending={updating}
            pendingLabel="Saving..."
            label="Save Changes"
            colorClass="bg-sky-500 hover:bg-sky-600"
          />
        </div>
      </form>
    </Modal>
  );
}
