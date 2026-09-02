"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import ProjectSidebar from "@/components/project/Sidebar";
import TopHeader from "@/components/TopHeader";
import Spinner from "@/components/ui/Spinner";
import { getImport, fetchShapes, type ImportItem, type ShapeItem } from "@/lib/api";
import { getBeamGroupId } from "@/lib/beams";
import { useBeamEval } from "@/hooks/useBeamEval";
import { useSidebarSync } from "@/hooks/useSidebarSync";
import BeamFormCard from "./_components/BeamFormCard";
import SharedParamsPanel, {
  type SharedBeamParams,
} from "./_components/SharedParamsPanel";
import { toBeamEntry, type BeamEntry } from "./_components/types";

export default function BeamDetailPage() {
  const { projectId, importId, beamIndex } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);
  useSidebarSync(mainRef, '[data-sidebar="project"]', 72);

  const groupName = searchParams.get("group");
  const isContinuous = !!groupName;

  const [importData, setImportData] = useState<ImportItem | null>(null);
  const [shapes, setShapes] = useState<ShapeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [shapesLoading, setShapesLoading] = useState(true);

  // Resolved beams for this page
  const [beams, setBeams] = useState<BeamEntry[]>([]);
  const [pageTitle, setPageTitle] = useState("");

  // Shared params + per-beam overrides
  const [params, setParams] = useState<SharedBeamParams>({
    shapeId: "",
    shapeName: "",
    shapeImage: "",
    gradeConcrete: "",
    gradeSteel: "",
    cover: "",
    repetition: 1,
  });
  const [beamForms, setBeamForms] = useState<Record<number, Partial<BeamEntry>>>({});

  const {
    results: evalResults,
    loading: evalLoading,
    error: evalError,
    clearEval,
    requestEval,
  } = useBeamEval();

  const selectedShape = shapes.find((s) => s._id === params.shapeId);

  // ── Load data ──
  useEffect(() => {
    if (!importId) return;
    setLoading(true);
    getImport(importId as string)
      .then((data) => {
        setImportData(data);
        resolveBeams(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [importId, beamIndex, groupName, isContinuous]);

  useEffect(() => {
    fetchShapes()
      .then((data) => setShapes(data))
      .catch(() => {})
      .finally(() => setShapesLoading(false));
  }, []);

  /** Pick the beams this page edits: a whole group or a single one. */
  function resolveBeams(data: ImportItem) {
    const allBeams: any[] = data?.beam?.columns || [];

    if (isContinuous) {
      const groupBeams = allBeams.filter(
        (b) => getBeamGroupId(b) === groupName,
      );
      const names = groupBeams.map((b) => b.name);
      setPageTitle(
        names.length > 1
          ? `${names[0]} - ${names[names.length - 1]}`
          : names[0] || groupName!,
      );
      setBeams(groupBeams.map(toBeamEntry));
    } else {
      const idx = parseInt(beamIndex as string);
      const beam = allBeams[idx];
      if (beam) {
        setPageTitle(beam.name);
        setBeams([toBeamEntry(beam)]);
      }
    }
  }

  // ── Handlers ──
  const handleParamChange = (field: keyof SharedBeamParams, value: any) => {
    if (field === "shapeId") {
      const shape = shapes.find((s) => s._id === value);
      setParams((p) => ({
        ...p,
        shapeId: value,
        shapeName: shape?.name || "",
        shapeImage: shape?.image || "",
      }));
      beams.forEach((_, i) => {
        clearEval(String(i));
        requestBeamEval(i);
      });
      return;
    }
    setParams((p) => ({ ...p, [field]: value }));
  };

  const updateBeamField = (idx: number, field: string, value: any) => {
    setBeamForms((prev) => ({
      ...prev,
      [idx]: { ...prev[idx], [field]: value },
    }));
    requestBeamEval(idx);
  };

  const requestBeamEval = (bIdx: number) => {
    requestEval(String(bIdx), () => {
      const bf = getBeamForm(bIdx);
      const shape = shapes.find((s) => s._id === params.shapeId);
      if (!params.shapeId || !bf.width || !bf.depth || !shape?.formula) {
        return null;
      }
      return {
        beaminX: bf.width,
        beaminY: bf.depth,
        shape: { numberOfSides: shape.numberOfSides, formula: shape.formula },
      };
    });
  };

  const getBeamForm = (idx: number): BeamEntry => {
    return { ...beams[idx], ...beamForms[idx] };
  };

  const getEvalFor = (bIdx: number) => {
    const k = String(bIdx);
    return {
      lVals: Object.entries(evalResults[k] ?? {})
        .filter(([key]) => key.startsWith("L"))
        .map(([key, v]) => ({ key, value: v as number })),
      loading: evalLoading[k],
      error: evalError[k],
    };
  };

  // ── Loading ──
  if (loading) {
    return (
      <AuthGuard>
        <div className="flex min-h-screen bg-[#f7f7f8]">
          <Sidebar hoverable />
          <ProjectSidebar projectId={projectId as string} />
          <div className="flex-1 flex items-center justify-center">
            <Spinner />
          </div>
        </div>
      </AuthGuard>
    );
  }

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
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-800"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back to Beams
                </button>
                <div className="h-5 w-px bg-zinc-200" />
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                    {pageTitle}
                  </h1>
                  {isContinuous && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-accent/10 text-accent border border-accent/20">
                      {beams.length} spans
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => alert("Save logic goes here!")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-zinc-900 font-medium text-sm hover:bg-accent-hover transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Save Parameters
              </button>
            </div>

            {/* Warning */}
            <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3">
              <svg
                className="h-5 w-5 text-amber-600 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-sm text-amber-600">
                {isContinuous
                  ? `Continuous beam — shared shape & grades apply to all ${beams.length} spans.`
                  : "Set parameters before generating the final BBS."}
              </p>
            </div>

            {/* Common parameters */}
            <SharedParamsPanel
              params={params}
              onChange={handleParamChange}
              isContinuous={isContinuous}
              shapes={shapes}
              shapesLoading={shapesLoading}
              selectedShape={selectedShape}
            />

            {/* Per-beam sections */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                <h3 className="text-[12px] font-semibold uppercase tracking-wider text-zinc-600">
                  {isContinuous ? "Span Details" : "Beam Dimensions"}
                </h3>
              </div>

              {beams.map((_, bIdx) => (
                <BeamFormCard
                  key={bIdx}
                  beam={getBeamForm(bIdx)}
                  index={bIdx}
                  isContinuous={isContinuous}
                  totalBeams={beams.length}
                  onChange={(field, value) => updateBeamField(bIdx, field, value)}
                  evalState={getEvalFor(bIdx)}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#e4e4e7]">
              <button
                onClick={() => router.back()}
                className="px-6 py-2.5 rounded-lg text-[13px] font-medium text-zinc-600 border border-[#d4d4d8] hover:bg-[#e4e4e7] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => alert("Save logic goes here!")}
                className="px-6 py-2.5 rounded-lg text-[13px] font-semibold text-zinc-900 bg-accent hover:bg-accent-hover transition-colors"
              >
                Save Parameters
              </button>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
