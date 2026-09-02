"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthGuard from "../../../../../../../components/AuthGuard";
import Sidebar from "../../../../../../../components/Sidebar";
import ProjectSidebar from "../../../../../../../components/project/Sidebar";
import TopHeader from "../../../../../../../components/TopHeader";
import {
  fetchFloors,
  createFloor,
  updateFloor,
  deleteFloor,
  type Floor,
} from "../../../../../../../lib/api";

const emptyForm = { name: "", description: "" };

export default function FloorsPage() {
  const { projectId, blockId } = useParams();
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);

  const [floors, setFloors] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [activeFloor, setActiveFloor] = useState<Floor | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingFloor, setDeletingFloor] = useState<Floor | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadFloors = async () => {
    try {
      const data = await fetchFloors(blockId as string);
      setFloors(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      if (isEditing && activeFloor) {
        await updateFloor(activeFloor._id, form);
      } else {
        await createFloor({ ...form, blockId: blockId as string });
      }
      closeModal();
      await loadFloors();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingFloor) return;
    setDeleting(true);
    try {
      await deleteFloor(deletingFloor._id);
      setShowDeleteModal(false);
      setDeletingFloor(null);
      await loadFloors();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const openEdit = (floor: Floor) => {
    setForm({ name: floor.name, description: floor.description || "" });
    setActiveFloor(floor);
    setIsEditing(true);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setActiveFloor(null);
    setForm(emptyForm);
  };

  // Sidebar Sync
  useEffect(() => {
    loadFloors();
  }, [blockId]);

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

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

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

          <main className="flex-1 space-y-6 p-6 lg:p-8">
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
                  Back to Blocks
                </button>
                <div className="h-5 w-px bg-zinc-200" />
                <div>
                  <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                    Floors
                  </h1>
                  <p className="mt-0.5 text-sm text-zinc-500">
                    Manage floors for this block
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-surface-900 transition-colors hover:bg-accent-hover"
              >
                <svg
                  className="h-4 w-4"
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
                New Floor
              </button>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex min-h-[360px] items-center justify-center rounded-xl border border-[#e4e4e7] bg-[#ffffff]">
                <div className="text-center">
                  <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-zinc-200 border-t-accent" />
                  <p className="text-sm text-zinc-500">Loading floors...</p>
                </div>
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            ) : floors.length === 0 ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-[#e4e4e7] bg-[#ffffff]">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e4e4e7] bg-[#f4f4f5]">
                  <svg
                    className="h-6 w-6 text-zinc-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-zinc-600">
                  No floors created yet
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  Click &quot;New Floor&quot; to get started.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {floors.map((floor) => (
                  <div
                    key={floor._id}
                    className="group relative rounded-xl border border-[#e4e4e7] bg-[#ffffff] p-5 transition-colors hover:border-[#d4d4d8]"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 text-accent">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.8}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => openEdit(floor)}
                          className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-[#e4e4e7] hover:text-zinc-800"
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
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setDeletingFloor(floor);
                            setShowDeleteModal(true);
                          }}
                          className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-600"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <h3 className="text-base font-medium text-zinc-900">
                      {floor.name}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500 line-clamp-2">
                      {floor.description || "No description provided"}
                    </p>
                    <div className="mt-4 border-t border-[#e4e4e7] pt-3">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-300">
                        Created {formatDate(floor.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-md rounded-xl border border-[#e4e4e7] bg-[#ffffff] shadow-2xl shadow-black/60 animate-slide-up">
            <div className="flex items-center justify-between border-b border-[#e4e4e7] px-5 py-4">
              <h2 className="text-[15px] font-semibold text-zinc-900">
                {isEditing ? "Edit Floor" : "New Floor"}
              </h2>
              <button
                onClick={closeModal}
                className="rounded p-1 text-zinc-500 transition-colors hover:bg-[#e4e4e7] hover:text-zinc-900"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  Floor Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ground Floor, Level 1"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Optional details..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="input-field resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-[#d4d4d8] px-4 py-2 text-[13px] font-medium text-zinc-600 transition-colors hover:bg-[#e4e4e7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-accent px-5 py-2 text-[13px] font-semibold text-surface-900 transition-colors hover:bg-accent-hover disabled:opacity-40"
                >
                  {submitting
                    ? "Saving..."
                    : isEditing
                      ? "Update Floor"
                      : "Create Floor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && deletingFloor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !deleting && setShowDeleteModal(false)}
          />
          <div className="relative w-full max-w-sm rounded-xl border border-[#e4e4e7] bg-[#ffffff] p-6 text-center shadow-2xl shadow-black/60 animate-slide-up">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <h3 className="text-[15px] font-semibold text-zinc-900">
              Delete Floor
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-zinc-500">
              Are you sure you want to delete{" "}
              <span className="font-medium text-zinc-700">
                {deletingFloor.name}
              </span>
              ?
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 rounded-lg border border-[#d4d4d8] px-4 py-2.5 text-[13px] font-medium text-zinc-600 transition-colors hover:bg-[#e4e4e7] disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-[13px] font-medium text-zinc-900 transition-colors hover:bg-red-600 disabled:opacity-40"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
