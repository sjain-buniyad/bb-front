"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import ProjectSidebar from "@/components/project/Sidebar";
import TopHeader from "@/components/TopHeader";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SearchInput from "@/components/ui/SearchInput";
import Spinner from "@/components/ui/Spinner";
import StructureTabs from "@/components/ui/StructureTabs";
import { ChevronDownIcon, DownloadIcon } from "@/components/ui/icons";
import {
  exportBarExcel,
  getBarCropImageUrl,
  getImport,
  updateImport,
  uploadBarCropImage,
  type ImportItem,
} from "@/lib/api";
import { useSidebarSync } from "@/hooks/useSidebarSync";
import BarDetailForm from "./_components/BarDetailForm";
import PlateTable from "./_components/PlateTable";
import { findMarkQty, type BarItem, type MarkItem, type PlateItem } from "./_components/types";

export default function BarsPage() {
  const { projectId, importId } = useParams();
  const mainRef = useRef<HTMLDivElement>(null);
  useSidebarSync(mainRef, '[data-sidebar="project"]', 72);

  const [importData, setImportData] = useState<ImportItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const [barColumns, setBarColumns] = useState<BarItem[]>([]);
  const [plates, setPlates] = useState<PlateItem[]>([]);
  const [dirty, setDirty] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageVersions, setImageVersions] = useState<Record<number, number>>({});

  useEffect(() => {
    if (importId) {
      setLoading(true);
      getImport(importId as string)
        .then((data) => {
          setImportData(data);
          setBarColumns(data.bar?.columns || []);

          const marks: MarkItem[] = data.bar?.mark || [];
          const rawPlates: PlateItem[] = data.bar?.plate || [];
          setPlates(
            rawPlates.map((plate) => ({
              ...plate,
              qty: plate.qty ?? findMarkQty(plate.plate_name, marks),
            })),
          );
          setDirty(false);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [importId]);

  const filteredRows = useMemo(
    () =>
      barColumns
        .map((item, index) => ({ item, index }))
        .filter(({ item }) =>
          item.bar_mark?.toLowerCase().includes(search.toLowerCase()),
        ),
    [barColumns, search],
  );

  const totalWeight = useMemo(
    () => barColumns.reduce((sum, item) => sum + (item.total_weigth || 0), 0),
    [barColumns],
  );

  // ── Editing ──
  const updateBarField = (index: number, field: keyof BarItem, value: any) => {
    setBarColumns((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
    setDirty(true);
  };

  const updateBarDim = (index: number, key: string, value: string) => {
    setBarColumns((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const dims =
          typeof item.data === "object" && item.data ? item.data : {};
        return { ...item, data: { ...dims, [key]: value } };
      }),
    );
    setDirty(true);
  };

  const updateBarDescription = (index: number, value: string) => {
    setBarColumns((prev) =>
      prev.map((item, i) => (i === index ? { ...item, data: value } : item)),
    );
    setDirty(true);
  };

  const updatePlateField = (
    index: number,
    field: keyof PlateItem,
    value: any,
  ) => {
    setPlates((prev) =>
      prev.map((plate, i) =>
        i === index ? { ...plate, [field]: value } : plate,
      ),
    );
    setDirty(true);
  };

  const handleImageUpload = async (index: number, file: File) => {
    if (!importId) return;
    setUploadingImageIndex(index);
    setImageError(null);
    try {
      const { cropImage } = await uploadBarCropImage(
        importId as string,
        index,
        file,
      );
      // The upload endpoint already persists this on the import, so just
      // sync local state without marking the page dirty.
      setBarColumns((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, crop_image: cropImage } : item,
        ),
      );
      setImageVersions((prev) => ({ ...prev, [index]: (prev[index] || 0) + 1 }));
    } catch (err: any) {
      setImageError(err?.message || "Failed to upload image");
    } finally {
      setUploadingImageIndex(null);
    }
  };

  // ── Persistence ──
  const persistChanges = async () => {
    if (!importId) return;
    const updatedBar = {
      ...(importData?.bar || {}),
      columns: barColumns,
      plate: plates,
    };
    await updateImport(importId as string, { bar: updatedBar });
    setImportData((prev) => (prev ? { ...prev, bar: updatedBar } : prev));
    setDirty(false);
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      await persistChanges();
    } catch (err: any) {
      setSaveError(err?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    if (!importId || exporting) return;
    setExporting(true);
    setExportError(null);
    try {
      if (dirty) await persistChanges();
      const { blob, filename } = await exportBarExcel(importId as string);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setExportError(err?.message || "Failed to export bar excel");
    } finally {
      setExporting(false);
    }
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
                { label: "Bars" },
              ]}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                  Bar Bending Schedule
                </h1>
                {dirty && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border border-amber-500/30 bg-amber-500/10 text-amber-600">
                    Unsaved changes
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Search by bar mark..."
                />
                <button
                  onClick={handleSave}
                  disabled={saving || !dirty}
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#d4d4d8] text-zinc-700 font-medium text-sm hover:bg-[#e4e4e7] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {saving ? <Spinner className="h-4 w-4" /> : null}
                  Save
                </button>
                <button
                  onClick={handleExport}
                  disabled={exporting || barColumns.length === 0}
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-zinc-900 font-medium text-sm hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {exporting ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    <DownloadIcon />
                  )}
                  Export XLSX
                </button>
              </div>
            </div>

            {(saveError || exportError || imageError) && (
              <p className="text-xs text-red-600">
                {saveError || exportError || imageError}
              </p>
            )}

            <StructureTabs active="Bar" />

            {/* Plates table */}
            <PlateTable plates={plates} onChange={updatePlateField} />

            {/* Bars table */}
            <div className="bg-[#ffffff] border border-[#e4e4e7] rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#e4e4e7] text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                <div className="col-span-1">#</div>
                <div className="col-span-3">Bar Mark</div>
                <div className="col-span-2 text-center">Dia (mm)</div>
                <div className="col-span-1 text-center">Qty</div>
                <div className="col-span-2 text-center">Total Length</div>
                <div className="col-span-2 text-right">Total Weight (kg)</div>
                <div className="col-span-1" />
              </div>
              <div className="divide-y divide-[#f4f4f5]">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <Spinner />
                  </div>
                ) : filteredRows.length === 0 ? (
                  <div className="py-16 text-center text-sm text-zinc-500">
                    No bars found
                  </div>
                ) : (
                  filteredRows.map(({ item, index }) => {
                    const isExpanded = expandedIndex === index;
                    return (
                      <div key={index}>
                        <div
                          onClick={() =>
                            setExpandedIndex(isExpanded ? null : index)
                          }
                          className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-[#f4f4f5] transition-colors cursor-pointer"
                        >
                          <div className="col-span-1 text-sm text-zinc-400">
                            {index + 1}
                          </div>
                          <div className="col-span-3">
                            <span className="text-sm font-medium text-zinc-800">
                              {item.bar_mark}
                            </span>
                          </div>
                          <div className="col-span-2 text-center">
                            <span className="text-xs text-zinc-600 bg-[#f4f4f5] px-2 py-1 rounded font-mono">
                              {item.diameter}
                            </span>
                          </div>
                          <div className="col-span-1 text-center text-sm text-zinc-600">
                            {item.qty}
                          </div>
                          <div className="col-span-2 text-center text-sm text-zinc-600">
                            {item.total_bar_length}
                          </div>
                          <div className="col-span-2 text-right text-sm text-zinc-700">
                            {item.total_weigth}
                          </div>
                          <div className="col-span-1 flex justify-end">
                            <ChevronDownIcon
                              className={`w-4 h-4 text-zinc-400 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </div>

                        {isExpanded && (
                          <BarDetailForm
                            item={item}
                            imageUrl={
                              item.crop_image
                                ? `${getBarCropImageUrl(importId as string, index)}${
                                    imageVersions[index]
                                      ? `?v=${imageVersions[index]}`
                                      : ""
                                  }`
                                : undefined
                            }
                            imageUploading={uploadingImageIndex === index}
                            onFieldChange={(field, value) =>
                              updateBarField(index, field, value)
                            }
                            onDimChange={(key, value) =>
                              updateBarDim(index, key, value)
                            }
                            onDescriptionChange={(value) =>
                              updateBarDescription(index, value)
                            }
                            onImageUpload={(file) =>
                              handleImageUpload(index, file)
                            }
                          />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
              {filteredRows.length > 0 && (
                <div className="px-5 py-3 border-t border-[#e4e4e7] flex items-center justify-between">
                  <p className="text-[12px] text-zinc-400">
                    Showing {filteredRows.length} of {barColumns.length} bars
                  </p>
                  <p className="text-[12px] text-zinc-500">
                    Total weight:{" "}
                    <span className="text-zinc-700 font-medium">
                      {totalWeight.toFixed(2)} kg
                    </span>
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
