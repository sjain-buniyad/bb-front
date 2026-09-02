"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import ProjectSidebar from "@/components/project/Sidebar";
import TopHeader from "@/components/TopHeader";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Modal from "@/components/ui/Modal";
import SearchInput from "@/components/ui/SearchInput";
import Spinner from "@/components/ui/Spinner";
import StructureTabs from "@/components/ui/StructureTabs";
import { MergeIcon, PlusIcon } from "@/components/ui/icons";
import {
  getImport,
  updateImport,
  fetchShapes,
  type ImportItem,
  type ShapeItem,
} from "@/lib/api";
import {
  applyMergePlan,
  buildMergePlan,
  groupBeams,
} from "@/lib/beams";
import { useBeamEval } from "@/hooks/useBeamEval";
import { useSidebarSync } from "@/hooks/useSidebarSync";
import BeamGroupExpanded from "./_components/BeamGroupExpanded";
import BeamGroupRow from "./_components/BeamGroupRow";
import { makeDefaultGroupForm, type GroupFormState } from "./_components/types";

export default function BeamsPage() {
  const { projectId, importId } = useParams();
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);
  useSidebarSync(mainRef, '[data-sidebar="project"]', 72);

  const [importData, setImportData] = useState<ImportItem | null>(null);
  const [shapes, setShapes] = useState<ShapeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [shapesLoading, setShapesLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedGroup, setExpandedGroup] = useState<number | null>(null);

  const [formStates, setFormStates] = useState<Record<number, GroupFormState>>({});
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [mergeOpen, setMergeOpen] = useState(false);
  const [merging, setMerging] = useState(false);
  const [mergeError, setMergeError] = useState<string | null>(null);
  const {
    results: evalResults,
    loading: evalLoading,
    error: evalError,
    clearEval,
    requestEval,
  } = useBeamEval();

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
    fetchShapes()
      .then((data) => setShapes(data))
      .catch(() => {})
      .finally(() => setShapesLoading(false));
  }, []);

  // ── Derived data ──
  const beamData = importData?.beam?.columns || [];
  const beamGroups = useMemo(() => groupBeams(beamData), [beamData]);

  const filteredGroups = useMemo(() => {
    if (!search) return beamGroups;
    return beamGroups.filter((g) =>
      g.beams.some((b: any) =>
        b.name?.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [beamGroups, search]);

  // ── Merge selection ──
  const selectedGroupObjs = useMemo(
    () => beamGroups.filter((g) => selectedGroups.has(g.baseName)),
    [beamGroups, selectedGroups],
  );
  const mergePlan = useMemo(
    () => buildMergePlan(selectedGroupObjs),
    [selectedGroupObjs],
  );

  const toggleGroupSelect = (baseName: string) => {
    setMergeError(null);
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(baseName)) next.delete(baseName);
      else next.add(baseName);
      return next;
    });
  };

  const allFilteredSelected =
    filteredGroups.length > 0 &&
    filteredGroups.every((g) => selectedGroups.has(g.baseName));

  const toggleSelectAll = () => {
    setMergeError(null);
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        filteredGroups.forEach((g) => next.delete(g.baseName));
      } else {
        filteredGroups.forEach((g) => next.add(g.baseName));
      }
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedGroups(new Set());
    setMergeError(null);
  };

  const confirmMerge = async () => {
    if (!importData || !mergePlan || merging) return;
    setMerging(true);
    setMergeError(null);
    const newColumns = applyMergePlan(beamData, mergePlan);
    const beamPayload = { ...(importData.beam || {}), columns: newColumns };
    try {
      await updateImport(importId as string, { beam: beamPayload });
      setImportData((prev) =>
        prev ? { ...prev, beam: beamPayload } : prev,
      );
      Object.keys(evalResults).forEach(clearEval);
      setFormStates({});
      setExpandedGroup(null);
      setSelectedGroups(new Set());
      setMergeOpen(false);
    } catch (err: any) {
      setMergeError(err?.message || "Failed to merge beams");
    } finally {
      setMerging(false);
    }
  };

  // ── Form helpers ──
  const getForm = (gIdx: number): GroupFormState => {
    if (!formStates[gIdx]) {
      return makeDefaultGroupForm(beamGroups[gIdx]?.beams || []);
    }
    return formStates[gIdx];
  };

  const updateShared = (gIdx: number, field: string, value: any) => {
    setFormStates((prev) => ({
      ...prev,
      [gIdx]: { ...getForm(gIdx), [field]: value },
    }));
  };

  const updateBeam = (gIdx: number, bIdx: number, field: string, value: any) => {
    setFormStates((prev) => {
      const form = getForm(gIdx);
      return {
        ...prev,
        [gIdx]: {
          ...form,
          beams: {
            ...form.beams,
            [bIdx]: { ...form.beams[bIdx], [field]: value },
          },
        },
      };
    });
    requestBeamEval(gIdx, bIdx);
  };

  const handleShapeSelect = (gIdx: number, shapeId: string) => {
    const shape = shapes.find((s) => s._id === shapeId);
    setFormStates((prev) => ({
      ...prev,
      [gIdx]: {
        ...getForm(gIdx),
        shapeId,
        shapeName: shape?.name || "",
        shapeImage: shape?.image || "",
      },
    }));
    beamGroups[gIdx]?.beams.forEach((_: any, bi: number) => {
      clearEval(`${gIdx}-${bi}`);
      requestBeamEval(gIdx, bi);
    });
  };

  /** Build the eval payload for one beam from current form state. */
  const requestBeamEval = (gIdx: number, bIdx: number) => {
    requestEval(`${gIdx}-${bIdx}`, () => {
      const form = getForm(gIdx);
      const beamForm = form.beams[bIdx];
      const shape = shapes.find((s) => s._id === form.shapeId);
      if (!form.shapeId || !beamForm?.width || !beamForm?.depth || !shape?.formula) {
        return null;
      }
      return {
        beaminX: beamForm.width,
        beaminY: beamForm.depth,
        shape: { numberOfSides: shape.numberOfSides, formula: shape.formula },
      };
    });
  };

  const goToDetail = (gIdx: number) => {
    const group = beamGroups[gIdx];
    if (!group) return;
    if (group.isContinuous) {
      router.push(
        `/dashboard/projects/${projectId}/imports/${importId}/beams/0?group=${encodeURIComponent(group.baseName)}`,
      );
    } else {
      router.push(
        `/dashboard/projects/${projectId}/imports/${importId}/beams/${group.firstIndex}`,
      );
    }
  };

  const getEvalFor = (gIdx: number, bIdx: number) => {
    const k = `${gIdx}-${bIdx}`;
    return {
      lVals: Object.entries(evalResults[k] ?? {})
        .filter(([key]) => key.startsWith("L"))
        .map(([key, v]) => ({ key, value: v as number })),
      loading: evalLoading[k],
      error: evalError[k],
    };
  };

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
            <Breadcrumb
              items={[
                { label: "File Import", onClick: () => window.history.back() },
                { label: importData?.name || "..." },
                { label: "Beams" },
              ]}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                Beams
              </h1>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Search beams..."
                />
                <button className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-zinc-900 font-medium text-sm hover:bg-accent-hover transition-colors">
                  <PlusIcon />
                  Add Beam
                </button>
              </div>
            </div>

            <StructureTabs active="Beam" />

            {/* Merge selection bar */}
            {selectedGroupObjs.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 rounded-xl border border-accent/25 bg-accent/5">
                <p className="text-sm text-zinc-700 min-w-0 truncate">
                  <span className="font-semibold text-accent">
                    {selectedGroupObjs.length}
                  </span>{" "}
                  {selectedGroupObjs.length === 1 ? "group" : "groups"}{" "}
                  selected
                  <span className="text-zinc-500">
                    {" "}
                    · {selectedGroupObjs.map((g) => g.baseName).join(", ")}
                  </span>
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  {mergeError && (
                    <span className="text-xs text-red-600">{mergeError}</span>
                  )}
                  <button
                    onClick={clearSelection}
                    disabled={merging}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-[12px] font-medium text-zinc-600 border border-[#d4d4d8] hover:bg-[#e4e4e7] hover:text-zinc-800 transition-colors disabled:opacity-40"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setMergeOpen(true)}
                    disabled={selectedGroupObjs.length < 2 || merging}
                    title={
                      selectedGroupObjs.length < 2
                        ? "Select at least 2 groups to merge"
                        : "Merge selected groups into one continuous beam"
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[12px] font-medium text-zinc-900 bg-accent hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <MergeIcon />
                    Merge
                  </button>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="bg-[#ffffff] border border-[#e4e4e7] rounded-xl overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#e4e4e7] text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                <div className="col-span-1 flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleSelectAll}
                    className="w-3.5 h-3.5 rounded border-zinc-300 bg-zinc-200 text-accent focus:ring-accent/30 cursor-pointer"
                    title="Select all"
                  />
                  <span>#</span>
                </div>
                <div className="col-span-2">Name</div>
                <div className="col-span-3 text-center">Size (W x D)</div>
                <div className="col-span-4 text-center">Reinforcement</div>
                <div className="col-span-2 text-right pr-2">Action</div>
              </div>

              <div className="divide-y divide-[#f4f4f5]">
                {loading && (
                  <div className="flex items-center justify-center py-16">
                    <Spinner />
                  </div>
                )}
                {!loading && filteredGroups.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <p className="text-sm text-zinc-500">No beams found</p>
                    <p className="mt-1 text-xs text-zinc-400">
                      {search ? "Try a different search" : "No data extracted."}
                    </p>
                  </div>
                )}
                {!loading &&
                  filteredGroups.map((group) => {
                    const realIdx = beamGroups.indexOf(group);
                    const isExpanded = expandedGroup === realIdx;

                    return (
                      <div
                        key={group.baseName}
                        className="border-b border-[#f4f4f5] last:border-b-0"
                      >
                        <BeamGroupRow
                          group={group}
                          groupNumber={realIdx + 1}
                          selected={selectedGroups.has(group.baseName)}
                          onToggleSelect={() => toggleGroupSelect(group.baseName)}
                          onToggle={() =>
                            setExpandedGroup(isExpanded ? null : realIdx)
                          }
                          onViewDetail={() => goToDetail(realIdx)}
                        />

                        {isExpanded && (
                          <BeamGroupExpanded
                            group={group}
                            form={getForm(realIdx)}
                            shapes={shapes}
                            shapesLoading={shapesLoading}
                            selectedShape={shapes.find(
                              (s) => s._id === getForm(realIdx).shapeId,
                            )}
                            onSelectShape={(id) => handleShapeSelect(realIdx, id)}
                            onUpdateShared={(field, value) =>
                              updateShared(realIdx, field, value)
                            }
                            onBeamChange={(bIdx, field, value) =>
                              updateBeam(realIdx, bIdx, field, value)
                            }
                            getEvalFor={(bIdx) => getEvalFor(realIdx, bIdx)}
                          />
                        )}
                      </div>
                    );
                  })}
              </div>

              {filteredGroups.length > 0 && (
                <div className="px-5 py-3 border-t border-[#e4e4e7]">
                  <p className="text-[12px] text-zinc-400">
                    Showing {filteredGroups.length} of {beamGroups.length}{" "}
                    groups ({beamData.length} beams total)
                  </p>
                </div>
              )}
            </div>

            {/* Merge confirmation */}
            <Modal
              open={mergeOpen}
              onClose={() => {
                if (!merging) setMergeOpen(false);
              }}
              title="Merge beams"
              subtitle="Combine selected groups into one continuous beam"
              size="sm"
            >
              <div className="p-5 space-y-4">
                <p className="text-[13px] text-zinc-600 leading-relaxed">
                  {mergePlan && (
                    <>
                      Merge{" "}
                      <span className="text-zinc-800 font-medium">
                        {mergePlan.groups.map((g) => g.baseName).join(", ")}
                      </span>{" "}
                      into a single continuous beam group{" "}
                      <span className="text-accent font-medium">
                        {mergePlan.targetKey}
                      </span>
                      . Beam names stay unchanged — they will be treated as
                      spans:
                    </>
                  )}
                </p>
                {mergePlan && (
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                    {mergePlan.beams.map((b, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2 py-1 rounded-md bg-[#f4f4f5] border border-[#e4e4e7] text-[11px] font-mono text-accent"
                      >
                        {b.name}
                      </span>
                    ))}
                  </div>
                )}
                {mergeError && (
                  <p className="text-xs text-red-600">{mergeError}</p>
                )}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setMergeOpen(false)}
                    disabled={merging}
                    className="flex-1 px-4 py-2.5 rounded-lg text-[13px] font-medium text-zinc-600 border border-[#d4d4d8] hover:bg-[#e4e4e7] transition-colors disabled:opacity-40"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmMerge}
                    disabled={merging || !mergePlan}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium text-zinc-900 bg-accent hover:bg-accent-hover transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {merging ? (
                      <>
                        <Spinner className="h-4 w-4" />
                        Merging...
                      </>
                    ) : (
                      <>
                        <MergeIcon />
                        Merge
                      </>
                    )}
                  </button>
                </div>
              </div>
            </Modal>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
