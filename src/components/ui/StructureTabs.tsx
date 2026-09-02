"use client";

import { useParams, useRouter } from "next/navigation";
import { STRUCTURE_TABS } from "@/lib/constants";

/** Beam / Slab / Column / Footing tab strip shared by the import pages. */
export default function StructureTabs({ active }: { active: string }) {
  const router = useRouter();
  const { projectId, importId } = useParams();

  return (
    <div className="flex gap-1 border-b border-[#e4e4e7]">
      {STRUCTURE_TABS.map((tab) => {
        const isActive = tab.label === active;
        return (
          <button
            key={tab.label}
            onClick={() =>
              router.push(
                `/dashboard/projects/${projectId}/imports/${importId}/${tab.path}`,
              )
            }
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${isActive ? "text-accent" : "text-zinc-500 hover:text-zinc-700"}`}
          >
            {tab.label}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
        );
      })}
    </div>
  );
}
