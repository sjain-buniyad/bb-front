"use client";

import type { Project } from "@/lib/api";

interface ProjectsStatsProps {
  projects: Project[];
}

/** Total / BBS / Waste summary cards. */
export default function ProjectsStats({ projects }: ProjectsStatsProps) {
  const stats = [
    {
      label: "Total Projects",
      value: projects.length,
      hint: "in your workspace",
      iconBg: "bg-sky-500/10",
      iconColor: "text-sky-400",
      iconPath:
        "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z",
    },
    {
      label: "BBS Projects",
      value: projects.filter((p) => p.type === "bbs").length,
      hint: "behavior-based",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
      iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      label: "Waste Projects",
      value: projects.filter((p) => p.type === "waste").length,
      hint: "waste management",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600",
      iconPath:
        "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-[#ffffff] border border-[#e4e4e7] rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
              {stat.label}
            </span>
            <div className={`w-7 h-7 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
              <svg
                className={`w-3.5 h-3.5 ${stat.iconColor}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={stat.iconPath} />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900">{stat.value}</p>
          <p className="text-[11px] text-zinc-400 mt-1">{stat.hint}</p>
        </div>
      ))}
    </div>
  );
}
