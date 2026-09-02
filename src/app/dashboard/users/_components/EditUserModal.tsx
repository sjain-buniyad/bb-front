"use client";

import type { Employee } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import { PencilIcon } from "@/components/ui/icons";
import { RoleSelect, SpinnerSvg } from "./AddEmployeeModal";

export interface EditUserFormState {
  name: string;
  email: string;
  role: string;
}

interface EditUserModalProps {
  open: boolean;
  user: Employee | null;
  onClose: () => void;
  form: EditUserFormState;
  onChange: (patch: Partial<EditUserFormState>) => void;
  onSubmit: (e: React.FormEvent) => void;
  updating: boolean;
  showSuperAdminOption: boolean;
}

const labelClass =
  "block text-[11px] font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider";

export default function EditUserModal({
  open,
  user,
  onClose,
  form,
  onChange,
  onSubmit,
  updating,
  showSuperAdminOption,
}: EditUserModalProps) {
  return (
    <Modal
      open={open && !!user}
      onClose={onClose}
      title="Edit User"
      subtitle={`Update ${user?.name ?? ""}'s details`}
      size="md"
      icon={
        <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
          <PencilIcon className="w-4 h-4 text-sky-400" />
        </div>
      }
    >
      <form onSubmit={onSubmit} className="p-5 space-y-4">
        <div>
          <label className={labelClass}>Full Name</label>
          <input
            type="text"
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className={labelClass}>Email Address</label>
          <input
            type="email"
            required
            placeholder="email@example.com"
            value={form.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className="input-field"
          />
        </div>
        <RoleSelect
          value={form.role}
          onChange={(role) => onChange({ role })}
          showSuperAdminOption={showSuperAdminOption}
        />

        <div className="flex justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-[13px] font-medium text-zinc-600 border border-[#d4d4d8] hover:bg-[#e4e4e7] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updating}
            className="px-5 py-2 rounded-lg text-[13px] font-medium text-zinc-900 bg-sky-500 hover:bg-sky-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {updating ? (
              <span className="flex items-center gap-2">
                <SpinnerSvg />
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
