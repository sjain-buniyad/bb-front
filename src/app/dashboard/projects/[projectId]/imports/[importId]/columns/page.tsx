"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthGuard from "../../../../../../../components/AuthGuard";
import Sidebar from "../../../../../../../components/Sidebar";
import ProjectSidebar from "../../../../../../../components/project/Sidebar";
import TopHeader from "../../../../../../../components/TopHeader";
import { getImport, type ImportItem } from "../../../../../../../lib/api";

export default function ColumnsPage() {
  const { projectId, importId } = useParams();
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);

  const [importData, setImportData] = useState<ImportItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (importId) {
      setLoading(true);
      getImport(importId as string)
        .then((data) => setImportData(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [importId]);

  useEffect(() => {
    const sidebar = document.querySelector<HTMLElement>(
      '[data-sidebar="project"]',
    );
    const main = mainRef.current;
    if (!sidebar || !main) return;
    const sync = () => {
      main.style.marginLeft = `${72 + sidebar.offsetWidth}px`;
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(sidebar, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    window.addEventListener("resize", sync);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);

  // Fallback in case your data doesn't have a "columns" wrapper
  const columnData = importData?.column?.columns || importData?.column || [];
  const filteredData = columnData.filter((item: any) =>
    item.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#f7f7f8]">
        <Sidebar hoverable />
        <ProjectSidebar projectId={projectId as string} />
        <div
          ref={mainRef}
          className="flex min-h-screen flex-1 flex-col transition-all duration-300"
        >
          <TopHeader />
          <main className="flex-1 p-6 lg:p-8 space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span
                onClick={() =>
                  router.push(`/dashboard/projects/${projectId}/imports`)
                }
                className="hover:text-zinc-700 cursor-pointer"
              >
                File Import
              </span>
              <span>/</span>
              <span className="text-zinc-600 truncate max-w-[200px]">
                {importData?.name || "..."}
              </span>
              <span>/</span>
              <span className="text-zinc-600">Columns</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                Columns
              </h1>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:max-w-xs">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search columns..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full py-2 pl-9 pr-4 rounded-lg text-sm bg-[#ffffff] border border-[#e4e4e7] text-zinc-900 placeholder:text-zinc-400 focus:border-accent/40 focus:ring-1 focus:ring-accent/20 outline-none transition-all"
                  />
                </div>
                <button className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-zinc-900 font-medium text-sm hover:bg-accent-hover transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Column
                </button>
              </div>
            </div>

            {/* Tabs (Copy-pasted for navigation consistency) */}
            <div className="flex gap-1 border-b border-[#e4e4e7]">
              {["Beam", "Slab", "Column", "Footing", "Bar"].map((tab) => {
                const paths: Record<string, string> = {
                  Beam: "beams",
                  Slab: "slabs",
                  Column: "columns",
                  Footing: "footings",
                  Bar: "bars",
                };
                const isActive = tab === "Column";
                return (
                  <button
                    key={tab}
                    onClick={() =>
                      router.push(
                        `/dashboard/projects/${projectId}/imports/${importId}/${paths[tab]}`,
                      )
                    }
                    className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${isActive ? "text-accent" : "text-zinc-500 hover:text-zinc-700"}`}
                  >
                    {tab}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Table */}
            <div className="bg-[#ffffff] border border-[#e4e4e7] rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#e4e4e7] text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                <div className="col-span-1">#</div>
                <div className="col-span-2">Name</div>
                <div className="col-span-3 text-center">Size</div>
                <div className="col-span-4 text-center">Reinforcement</div>
                <div className="col-span-2 text-right pr-2">Action</div>
              </div>
              <div className="divide-y divide-[#f4f4f5]">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="animate-spin h-6 w-6 rounded-full border-2 border-zinc-200 border-t-accent" />
                  </div>
                ) : filteredData.length === 0 ? (
                  <div className="py-16 text-center text-sm text-zinc-500">
                    No columns found
                  </div>
                ) : (
                  filteredData.map((item: any, index: number) => (
                    <div
                      key={item.name || index}
                      className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-[#f4f4f5] transition-colors"
                    >
                      <div className="col-span-1 text-sm text-zinc-400">
                        {index + 1}
                      </div>
                      <div className="col-span-2">
                        <span className="text-sm font-medium text-zinc-800">
                          {item.name}
                        </span>
                      </div>
                      <div className="col-span-3 text-center">
                        <span className="text-xs text-zinc-600 bg-[#f4f4f5] px-2 py-1 rounded font-mono">
                          {item.size?.width || 0} x {item.size?.depth || 0}
                        </span>
                      </div>
                      <div className="col-span-4 text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {item.reinforcement?.map((r: string, i: number) => (
                            <span
                              key={i}
                              className="text-[10px] text-zinc-500 bg-[#f4f4f5] border border-[#e4e4e7] px-1.5 py-0.5 rounded"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="col-span-2 flex justify-end pr-2">
                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-zinc-600 border border-[#d4d4d8] hover:bg-[#e4e4e7] hover:text-zinc-800 transition-colors">
                          Merge
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
