"use client";

import { DotsVerticalIcon, PencilIcon, TrashIcon } from "@/components/ui/icons";
import { ROLE_BADGE, ROLE_LABEL, isUserRole } from "@/lib/roles";
import type { Employee } from "@/lib/api";

interface UserRowProps {
  user: Employee;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/** One employee row: avatar, email, role badge and overflow menu. */
export default function UserRow({
  user: u,
  menuOpen,
  onToggleMenu,
  onEdit,
  onDelete,
}: UserRowProps) {
  return (
    <div className="grid grid-cols-12 gap-4 px-5 py-3.5 items-center hover:bg-[#f4f4f5] transition-colors group">
      {/* Name */}
      <div className="col-span-4 flex items-center gap-3 min-w-0">
        {u.avatar ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={u.avatar}
            alt=""
            className="w-8 h-8 rounded-full object-cover ring-1 ring-[#e4e4e7] shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#f4f4f5] border border-[#d4d4d8] flex items-center justify-center text-xs font-semibold text-zinc-600 shrink-0">
            {u.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <span className="text-sm text-zinc-800 truncate block">{u.name}</span>
          <span className="text-[10px] text-zinc-400 block">
            {isUserRole(u.role) ? "Your Employee" : "Workspace Admin"}
          </span>
        </div>
      </div>

      {/* Email */}
      <div className="col-span-4 min-w-0">
        <span className="text-sm text-zinc-500 truncate block">
          {u.email || "\u2014"}
        </span>
      </div>

      {/* Role */}
      <div className="col-span-2">
        <span
          className={`inline-flex px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider ${ROLE_BADGE[u.role] || ROLE_BADGE.user}`}
        >
          {typeof u.role === "number" ? ROLE_LABEL[u.role] || "user" : u.role}
        </span>
      </div>

      {/* Action */}
      <div className="col-span-2 flex justify-end" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <button
            onClick={onToggleMenu}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-[#e4e4e7] transition-colors"
          >
            <DotsVerticalIcon />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-[#ffffff] border border-[#d4d4d8] rounded-lg shadow-xl shadow-black/60 z-50 overflow-hidden animate-fade-in">
              <button
                onClick={onEdit}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-zinc-700 hover:bg-[#e4e4e7] transition-colors"
              >
                <PencilIcon className="w-3.5 h-3.5 text-zinc-500" />
                Edit Details
              </button>
              <div className="h-px bg-[#e4e4e7]" />
              <button
                onClick={onDelete}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-red-600 hover:bg-red-500/10 transition-colors"
              >
                <TrashIcon />
                Remove Employee
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
