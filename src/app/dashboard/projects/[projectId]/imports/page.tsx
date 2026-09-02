"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import ProjectSidebar from "@/components/project/Sidebar";
import TopHeader from "@/components/TopHeader";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SearchInput from "@/components/ui/SearchInput";
import Spinner from "@/components/ui/Spinner";
import { DotsVerticalIcon, EyeIcon, PlusIcon, TrashIcon } from "@/components/ui/icons";
import {
  deleteImport,
  fetchBlocks,
  fetchFloors,
  fetchImports,
  getImport,
  uploadImportFile,
  type Block,
  type Floor,
  type ImportItem,
} from "@/lib/api";
import { useSidebarSync } from "@/hooks/useSidebarSync";
import {
  STATUS_STYLES,
  formatImportDate,
} from "./_components/import-constants";
import UploadImportModal from "./_components/UploadImportModal";
import ViewImportModal from "./_components/ViewImportModal";

export default function ImportsPage() {
  const { projectId } = useParams();
  const mainRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  useSidebarSync(mainRef, '[data-sidebar="project"]', 72);

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [imports, setImports] = useState<ImportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Upload modal fields
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("637");
  const [drgNumber, setDrgNumber] = useState("");
  const [drgDate, setDrgDate] = useState("");
  const [structureName, setStructureName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // View modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState<ImportItem | null>(null);
  const [loadingView, setLoadingView] = useState(false);

  // ── Load ──
  useEffect(() => {
    if (projectId) {
      Promise.all([
        fetchBlocks(projectId as string),
        fetchImports(projectId as string),
      ])
        .then(([blocksData, importsData]) => {
          setBlocks(blocksData);
          setImports(importsData);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [projectId]);

  // Load floors when block changes
  useEffect(() => {
    if (selectedBlock) {
      fetchFloors(selectedBlock)
        .then(setFloors)
        .catch(() => setFloors([]));
    } else {
      setFloors([]);
    }
    setSelectedFloor("");
  }, [selectedBlock]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!openMenuId) return;
    const handler = () => setOpenMenuId(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [openMenuId]);

  const reloadList = () => fetchImports(projectId as string).then(setImports);

  const resetUploadForm = () => {
    setName("");
    setFile(null);
    setDrgNumber("");
    setDrgDate("");
    setStructureName("");
    setSelectedBlock("");
    setSelectedFloor("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Actions ──
  const handleViewDetails = async (id: string) => {
    setOpenMenuId(null);
    setLoadingView(true);
    setShowViewModal(true);
    try {
      setViewData(await getImport(id));
    } catch {
      alert("Failed to fetch details");
      setShowViewModal(false);
    } finally {
      setLoadingView(false);
    }
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewData(null);
  };

  const handleDelete = async (id: string) => {
    setOpenMenuId(null);
    if (!confirm("Are you sure you want to delete this import?")) return;
    try {
      await deleteImport(id);
      reloadList();
    } catch (err: any) {
      alert(err.message || "Failed to delete");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name || !selectedBlock || !selectedFloor) {
      alert("Please fill all required fields and select a file.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("type", type);
    formData.append("projectId", projectId as string);
    formData.append("blockId", selectedBlock);
    formData.append("floorId", selectedFloor);
    if (drgNumber) formData.append("drgNumber", drgNumber);
    if (drgDate) formData.append("drgDate", drgDate);
    if (structureName) formData.append("structureName", structureName);

    try {
      await uploadImportFile(formData);
      resetUploadForm();
      setShowUploadModal(false);
      reloadList();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const filteredImports = imports.filter((imp) =>
    imp.name?.toLowerCase().includes(search.toLowerCase()),
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
            <Breadcrumb
              items={[
                { label: "Home" },
                { label: "Project" },
                { label: "File Import" },
              ]}
            />

            {/* Header & Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                File Import
              </h1>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-zinc-900 font-medium text-sm hover:bg-accent-hover transition-colors"
                >
                  <PlusIcon />
                  New Import
                </button>
                <button className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#d4d4d8] text-zinc-600 font-medium text-sm hover:bg-[#e4e4e7] transition-colors">
                  Merge Dwg
                </button>
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Search files..."
                  className="sm:max-w-xs"
                />
              </div>
            </div>

            {/* Table */}
            <div className="bg-[#ffffff] border border-[#e4e4e7] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#e4e4e7] text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                      <th className="px-5 py-3">Name</th>
                      <th className="px-4 py-3">Imported By</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Block</th>
                      <th className="px-4 py-3">Floor</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-5 py-3 text-right pr-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f4f4f5]">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="py-16 text-center">
                          <div className="mx-auto w-fit">
                            <Spinner />
                          </div>
                        </td>
                      </tr>
                    ) : filteredImports.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-16 text-center text-sm text-zinc-500"
                        >
                          No files found
                        </td>
                      </tr>
                    ) : (
                      filteredImports.map((imp) => (
                        <ImportRow
                          key={imp._id}
                          imp={imp}
                          menuOpen={openMenuId === imp._id}
                          onToggleMenu={() =>
                            setOpenMenuId(openMenuId === imp._id ? null : imp._id)
                          }
                          onOpen={() =>
                            router.push(
                              `/dashboard/projects/${projectId}/imports/${imp._id}/beams`,
                            )
                          }
                          onViewDetails={() => handleViewDetails(imp._id)}
                          onDelete={() => handleDelete(imp._id)}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {filteredImports.length > 0 && (
                <div className="px-5 py-3 border-t border-[#e4e4e7]">
                  <p className="text-[12px] text-zinc-400">
                    Showing {filteredImports.length} of {imports.length} files
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Modals */}
        <UploadImportModal
          open={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onSubmit={handleSubmit}
          uploading={uploading}
          blocks={blocks}
          floors={floors}
          fileInputRef={fileInputRef}
          file={file}
          name={name}
          type={type}
          selectedBlock={selectedBlock}
          selectedFloor={selectedFloor}
          drgNumber={drgNumber}
          drgDate={drgDate}
          structureName={structureName}
          onFileChange={setFile}
          onNameChange={setName}
          onTypeChange={setType}
          onBlockChange={setSelectedBlock}
          onFloorChange={setSelectedFloor}
          onDrgNumberChange={setDrgNumber}
          onDrgDateChange={setDrgDate}
          onStructureNameChange={setStructureName}
        />
        <ViewImportModal
          open={showViewModal}
          onClose={closeViewModal}
          loading={loadingView}
          data={viewData}
        />
      </div>
    </AuthGuard>
  );
}

// ── Table row ────────────────────────────────────────────────

interface ImportRowProps {
  imp: ImportItem;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onOpen: () => void;
  onViewDetails: () => void;
  onDelete: () => void;
}

function ImportRow({
  imp,
  menuOpen,
  onToggleMenu,
  onOpen,
  onViewDetails,
  onDelete,
}: ImportRowProps) {
  return (
    <tr
      className="hover:bg-[#f4f4f5] transition-colors cursor-pointer"
      onClick={onOpen}
    >
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center shrink-0">
            <svg
              className="w-4 h-4 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>
          <span className="text-sm text-zinc-800 font-medium truncate">
            {imp.name}
          </span>
        </div>
      </td>
      <td className="px-4 py-3.5 text-sm text-zinc-500">
        {imp.createdBy?.name || "Unknown"}
      </td>
      <td className="px-4 py-3.5 text-sm text-zinc-500">
        {formatImportDate(imp.createdAt)}
      </td>
      <td className="px-4 py-3.5 text-sm text-zinc-500">
        {imp.blockId?.slice(0, 8) || "\u2014"}
      </td>
      <td className="px-4 py-3.5 text-sm text-zinc-500">
        {imp.floorId?.slice(0, 8) || "\u2014"}
      </td>
      <td className="px-4 py-3.5">
        <span
          className={`inline-flex px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider border ${STATUS_STYLES[imp.status] || STATUS_STYLES.Pending}`}
        >
          {imp.status}
        </span>
      </td>
      <td className="px-5 py-3.5 text-right">
        <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onToggleMenu}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-[#e4e4e7] transition-colors"
          >
            <DotsVerticalIcon />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-[#ffffff] border border-[#d4d4d8] rounded-lg shadow-xl shadow-black/60 z-50 overflow-hidden animate-fade-in">
              <button
                onClick={onViewDetails}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-zinc-700 hover:bg-[#e4e4e7] transition-colors"
              >
                <EyeIcon />
                View Details
              </button>
              <div className="h-px bg-[#e4e4e7]" />
              <button
                onClick={onDelete}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-red-600 hover:bg-red-500/10 transition-colors"
              >
                <TrashIcon />
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
