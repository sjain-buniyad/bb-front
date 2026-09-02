"use client";

import type { Employee } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import { ChevronDownIcon } from "@/components/ui/icons";

export interface EmployeeFormState {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface AddEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  form: EmployeeFormState;
  onChange: (patch: Partial<EmployeeFormState>) => void;
  onSubmit: (e: React.FormEvent) => void;
  creating: boolean;
  /** Super admins can also promote new users to admin/super-admin. */
  showSuperAdminOption: boolean;
}

const labelClass =
  "block text-[11px] font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider";

export default function AddEmployeeModal({
  open,
  onClose,
  form,
  onChange,
  onSubmit,
  creating,
  showSuperAdminOption,
}: AddEmployeeModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add New Employee"
      subtitle="This user will be linked to your account"
      size="md"
      icon={
        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <svg
            className="w-4 h-4 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="p-5 space-y-4">
        <div>
          <label className={labelClass}>Full Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Rahul Sharma"
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
            placeholder="employee@company.com"
            value={form.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className={labelClass}>Temporary Password</label>
          <input
            type="password"
            required
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={(e) => onChange({ password: e.target.value })}
            className="input-field"
          />
          <p className="text-[10px] text-zinc-400 mt-1.5">
            Employee will be prompted to change this on first login
          </p>
        </div>
        <RoleSelect
          value={form.role}
          onChange={(role) => onChange({ role })}
          showSuperAdminOption={showSuperAdminOption}
        />

        <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-[#f4f4f5] border border-[#e4e4e7]">
          <svg
            className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            This employee will be assigned to{" "}
            <span className="text-zinc-700 font-medium">your workspace</span> and
            can access all projects shared with your team.
          </p>
        </div>

        <ModalActions
          onCancel={onClose}
          pending={creating}
          pendingLabel="Adding..."
          label="Add Employee"
        />
      </form>
    </Modal>
  );
}

/** Role select shared by add & edit modals. */
export function RoleSelect({
  value,
  onChange,
  showSuperAdminOption,
}: {
  value: string;
  onChange: (role: string) => void;
  showSuperAdminOption: boolean;
}) {
  return (
    <div>
      <label className={labelClass}>Role</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field appearance-none cursor-pointer pr-9"
        >
          <option value="user">Employee (User)</option>
          <option value="admin">Admin</option>
          {showSuperAdminOption && (
            <option value="super-admin">Super Admin</option>
          )}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
          <ChevronDownIcon />
        </div>
      </div>
    </div>
  );
}

function ModalActions({
  onCancel,
  pending,
  pendingLabel,
  label,
}: {
  onCancel: () => void;
  pending: boolean;
  pendingLabel: string;
  label: string;
}) {
  return (
    <div className="flex justify-end gap-3 pt-1">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 rounded-lg text-[13px] font-medium text-zinc-600 border border-[#d4d4d8] hover:bg-[#e4e4e7] transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={pending}
        className="px-5 py-2 rounded-lg text-[13px] font-medium text-zinc-900 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {pending ? (
          <span className="flex items-center gap-2">
            <SpinnerSvg />
            {pendingLabel}
          </span>
        ) : (
          label
        )}
      </button>
    </div>
  );
}

export function SpinnerSvg({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
