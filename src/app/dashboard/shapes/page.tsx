"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  createShapeFile,
  deleteShape,
  fetchShapes,
  ROLE,
  type ShapeItem,
} from "@/lib/api";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";
import Toast from "@/components/Toast";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import SearchInput from "@/components/ui/SearchInput";
import Spinner from "@/components/ui/Spinner";
import { PlusIcon } from "@/components/ui/icons";
import { useSidebarSync } from "@/hooks/useSidebarSync";
import ShapeCard from "./_components/ShapeCard";
import CreateShapeModal from "./_components/CreateShapeModal";
import {
  buildShapeFormData,
  emptyShapeForm,
  type ShapeFormState,
} from "./_components/shape-form";

type ToastState = { message: string; type: "success" | "error" } | null;

export default function ShapesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);
  useSidebarSync(mainRef, '[data-sidebar="global"]');

  const [shapes, setShapes] = useState<ShapeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<ToastState>(null);

  // Create modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<ShapeFormState>(emptyShapeForm);

  // Delete modal
  const [deletingShape, setDeletingShape] = useState<ShapeItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const isSuperAdmin = user?.role === ROLE.SUPER_ADMIN;

  // ── Load ──
  const loadShapes = async () => {
    try {
      setShapes(await fetchShapes());
    } catch (err: any) {
      setToast({ message: err.message || "Failed to load shapes", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShapes();
  }, []);

  const resetForm = () => setForm(emptyShapeForm);

  const closeCreateModal = () => {
    setShowCreateModal(false);
    resetForm();
  };

  // ── Create ──
  const handleCreate = async () => {
    if (!form.name.trim() || !form.file) {
      setToast({ message: "Name and image are required", type: "error" });
      return;
    }
    setCreating(true);
    try {
      await createShapeFile(buildShapeFormData(form));
      setToast({ message: "Shape created successfully", type: "success" });
      closeCreateModal();
      await loadShapes();
    } catch (err: any) {
      setToast({ message: err.message || "Failed to create shape", type: "error" });
    } finally {
      setCreating(false);
    }
  };

  // ── Delete ──
  const handleDelete = async () => {
    if (!deletingShape) return;
    setDeleting(true);
    try {
      await deleteShape(deletingShape._id);
      setToast({ message: "Shape deleted", type: "success" });
      closeDelete();
      await loadShapes();
    } catch (err: any) {
      setToast({ message: err.message || "Failed to delete shape", type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  const closeDelete = () => {
    setDeletingShape(null);
  };

  const filteredShapes = shapes.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase()),
  );

  // ── Access guard ──
  if (!loading && !isSuperAdmin) {
    return (
      <AuthGuard>
        <div className="flex min-h-screen bg-[#f7f7f8]">
          <Sidebar />
          <div
            ref={mainRef}
            className="flex min-h-screen flex-1 flex-col transition-all duration-300"
          >
            <TopHeader />
            <main className="flex-1 p-6 lg:p-8">
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <p className="text-sm text-zinc-500">Access denied</p>
                <p className="mt-1 text-xs text-zinc-400">
                  Only super admin can manage shapes.
                </p>
              </div>
            </main>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#f7f7f8]">
        <Sidebar />
        <div
          ref={mainRef}
          className="flex min-h-screen flex-1 flex-col transition-all duration-300"
        >
          <TopHeader />
          <main className="flex-1 p-6 lg:p-8 space-y-6">
            <Breadcrumb
              items={[
                { label: "Dashboard", onClick: () => router.push("/dashboard") },
                { label: "Shapes" },
              ]}
            />

            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                Shape Management
              </h1>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Search shapes..."
                />
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-zinc-900 font-medium text-sm hover:bg-accent-hover transition-colors"
                >
                  <PlusIcon />
                  New Shape
                </button>
              </div>
            </div>

            <ShapesStats shapes={shapes} />

            {/* Shape Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Spinner />
              </div>
            ) : filteredShapes.length === 0 ? (
              <EmptyShapes search={search} />
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredShapes.map((shape) => (
                  <ShapeCard
                    key={shape._id}
                    shape={shape}
                    onDelete={() => setDeletingShape(shape)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>

        {/* Modals + toast (outside main scroll area) */}
        {showCreateModal && (
          <CreateShapeModal
            open
            onClose={closeCreateModal}
            form={form}
            onChange={(patch) => setForm({ ...form, ...patch })}
            onSubmit={handleCreate}
            creating={creating}
          />
        )}

        <ConfirmDialog
          open={!!deletingShape}
          onClose={() => {
            if (!deleting) closeDelete();
          }}
          onConfirm={handleDelete}
          loading={deleting}
          title="Delete Shape"
          confirmPendingLabel="Deleting..."
          message={
            <>
              Are you sure you want to delete{" "}
              <span className="text-zinc-700">{deletingShape?.name}</span>? This
              action cannot be undone.
            </>
          }
        />

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </AuthGuard>
  );
}

function ShapesStats({ shapes }: { shapes: ShapeItem[] }) {
  const stats = [
    { label: "Total Shapes", value: shapes.length },
    { label: "NFB Shapes", value: shapes.filter((s) => s.isNFB).length },
    { label: "With Stirrups", value: shapes.filter((s) => s.hasStirrup).length },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-[#ffffff] border border-[#e4e4e7] rounded-xl p-5"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">
            {stat.label}
          </p>
          <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

function EmptyShapes({ search }: { search: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[360px] rounded-xl border border-[#e4e4e7] bg-[#ffffff]">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e4e4e7] bg-[#f4f4f5]">
        <svg
          className="w-6 h-6 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 5a1 1 0 011-1h4a1 1 0 01.8.4l.6.8H18a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V5z"
          />
        </svg>
      </div>
      <p className="text-sm font-medium text-zinc-600">No shapes found</p>
      <p className="mt-1 text-xs text-zinc-400">
        {search ? "Try a different search" : 'Click "New Shape" to get started.'}
      </p>
    </div>
  );
}
