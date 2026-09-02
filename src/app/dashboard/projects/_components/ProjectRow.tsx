"use client";

import { useRouter } from "next/navigation";
import type { Project } from "@/lib/api";
import { DotsVerticalIcon, PencilIcon, TrashIcon } from "@/components/ui/icons";

export const PROJECT_TYPE_BADGE: Record<string, string> = {
  bbs: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
  waste: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
};

export function formatDate(d?: string): string {
  if (!d) return "\u2014";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface ProjectRowProps {
  project: Project;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/** One clickable table row + overflow action menu. */
export default function ProjectRow({
  project: p,
  menuOpen,
  onToggleMenu,
  onEdit,
  onDelete,
}: ProjectRowProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/dashboard/projects/${p._id}`)}
      className="grid grid-cols-12 gap-4 px-5 py-3.5 items-center hover:bg-[#f4f4f5] transition-colors cursor-pointer"
    >
      {/* Project Name */}
      <div className="col-span-3 min-w-0">
        <span className="text-sm text-zinc-800 truncate block font-medium">
          {p.name || "\u2014"}
        </span>
        <span className="text-[10px] text-zinc-400 truncate block">
          {p.description?.slice(0, 40) || "No description"}
        </span>
      </div>

      {/* Type */}
      <div className="col-span-2">
        <span
          className={`inline-flex px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider ${PROJECT_TYPE_BADGE[p.type] || PROJECT_TYPE_BADGE.bbs}`}
        >
          {p.type || "bbs"}
        </span>
      </div>

      {/* Manager */}
      <div className="col-span-2 min-w-0">
        <span className="text-sm text-zinc-500 truncate block">
          {p.manager || "\u2014"}
        </span>
      </div>

      {/* Duration */}
      <div className="col-span-2 min-w-0">
        <span className="text-[12px] text-zinc-500 block">
          {formatDate(p.start_date)} &mdash; {formatDate(p.end_date)}
        </span>
      </div>

      {/* Bar Length */}
      <div className="col-span-1">
        <span className="text-sm text-zinc-600">{p.bar_length ?? 12}</span>
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
                Edit Project
              </button>
              <div className="h-px bg-[#e4e4e7]" />
              <button
                onClick={onDelete}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-red-600 hover:bg-red-500/10 transition-colors"
              >
                <TrashIcon />
                Delete Project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
