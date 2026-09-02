"use client";

import { useEffect, useRef, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";
import Toast from "@/components/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import SearchInput from "@/components/ui/SearchInput";
import { PlusIcon, SpinnerCircle } from "@/components/ui/icons";
import {
  createProject,
  deleteProject,
  fetchProjects,
  updateProject,
  type CreateProjectPayload,
  type Project,
} from "@/lib/api";
import { useSidebarSync } from "@/hooks/useSidebarSync";
import CreateProjectModal from "./_components/CreateProjectModal";
import EditProjectModal from "./_components/EditProjectModal";
import ProjectRow from "./_components/ProjectRow";
import ProjectsStats from "./_components/ProjectsStats";

const emptyForm: CreateProjectPayload = {
  name: "",
  type: "bbs",
  manager: "",
  developer: "",
  contrator: "",
  consultant: "",
  start_date: "",
  end_date: "",
  bar_length: 12,
  description: "",
};

type ToastState = { message: string; type: "success" | "error" } | null;

export default function ProjectsPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  useSidebarSync(mainRef);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  // Create modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState<CreateProjectPayload>(emptyForm);
  const [creating, setCreating] = useState(false);

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editForm, setEditForm] = useState<CreateProjectPayload>(emptyForm);
  const [updating, setUpdating] = useState(false);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Load ──
  const loadProjects = async () => {
    try {
      setProjects(await fetchProjects());
    } catch (err: any) {
      setToast({ message: err.message || "Failed to load projects", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!openMenuId) return;
    const handler = () => setOpenMenuId(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [openMenuId]);

  const filtered = projects.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.manager?.toLowerCase().includes(search.toLowerCase()) ||
      p.type?.toLowerCase().includes(search.toLowerCase()),
  );

  // ── Create ──
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    setCreating(true);
    setToast(null);
    try {
      await createProject(form);
      setToast({ message: "Project created successfully!", type: "success" });
      setForm(emptyForm);
      setShowCreateModal(false);
      await loadProjects();
    } catch (err: any) {
      setToast({ message: err.message || "Failed to create project", type: "error" });
    } finally {
      setCreating(false);
    }
  };

  // ── Edit ──
  const openEdit = (p: Project) => {
    setEditingProject(p);
    setEditForm({
      name: p.name || "",
      type: p.type || "bbs",
      manager: p.manager || "",
      developer: p.developer || "",
      contrator: p.contrator || "",
      consultant: p.consultant || "",
      start_date: p.start_date ? p.start_date.slice(0, 10) : "",
      end_date: p.end_date ? p.end_date.slice(0, 10) : "",
      bar_length: p.bar_length || 12,
      description: p.description || "",
    });
    setShowEditModal(true);
    setOpenMenuId(null);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setUpdating(true);
    setToast(null);
    try {
      await updateProject(editingProject._id, editForm);
      setToast({ message: "Project updated successfully!", type: "success" });
      closeEdit();
      await loadProjects();
    } catch (err: any) {
      setToast({ message: err.message || "Failed to update project", type: "error" });
    } finally {
      setUpdating(false);
    }
  };

  const closeEdit = () => {
    setShowEditModal(false);
    setEditingProject(null);
  };

  // ── Delete ──
  const openDelete = (p: Project) => {
    setDeletingProject(p);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const handleDelete = async () => {
    if (!deletingProject) return;
    setDeleting(true);
    setToast(null);
    try {
      await deleteProject(deletingProject._id);
      setToast({ message: "Project deleted successfully!", type: "success" });
      closeDelete();
      await loadProjects();
    } catch (err: any) {
      setToast({ message: err.message || "Failed to delete project", type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  const closeDelete = () => {
    setShowDeleteModal(false);
    setDeletingProject(null);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#f7f7f8] flex">
        <Sidebar />

        <div
          ref={mainRef}
          className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        >
          <TopHeader />

          <main className="flex-1 p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
                Project Management
              </h1>
              <p className="text-sm text-zinc-500 mt-0.5">
                Create and manage your construction projects
              </p>
            </div>

            <ProjectsStats projects={projects} />

            {/* Search + Add */}
            <div className="flex items-center gap-3">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search projects..."
                focusClassName="focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20"
              />
              <button
                onClick={() => setShowCreateModal(true)}
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-zinc-900 font-medium text-sm hover:bg-emerald-600 active:scale-[0.98] transition-all duration-200"
              >
                <PlusIcon />
                New Project
              </button>
            </div>

            {/* Table */}
            <div className="bg-[#ffffff] border border-[#e4e4e7] rounded-xl overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#e4e4e7] text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                <div className="col-span-3">Project</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Manager</div>
                <div className="col-span-2">Duration</div>
                <div className="col-span-1">Bar Length</div>
                <div className="col-span-2 text-right pr-1">Action</div>
              </div>

              {/* Body */}
              {loading ? (
                <TableMessage icon={<SpinnerCircle />}>
                  Loading projects...
                </TableMessage>
              ) : filtered.length === 0 ? (
                <TableMessage muted>
                  <p className="text-sm text-zinc-500 mb-0.5">
                    {search ? "No projects found" : "No projects yet"}
                  </p>
                  <p className="text-xs text-zinc-300">
                    {search
                      ? "Try a different search"
                      : 'Click "+ New Project" to get started'}
                  </p>
                </TableMessage>
              ) : (
                <div className="divide-y divide-[#f4f4f5]">
                  {filtered.map((p) => (
                    <ProjectRow
                      key={p._id}
                      project={p}
                      menuOpen={openMenuId === p._id}
                      onToggleMenu={() =>
                        setOpenMenuId(openMenuId === p._id ? null : p._id)
                      }
                      onEdit={() => openEdit(p)}
                      onDelete={() => openDelete(p)}
                    />
                  ))}
                </div>
              )}

              {/* Footer */}
              {filtered.length > 0 && (
                <div className="px-5 py-3 border-t border-[#e4e4e7]">
                  <p className="text-[12px] text-zinc-400">
                    Showing {filtered.length} of {projects.length} projects
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Modals */}
        <CreateProjectModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          form={form}
          onChange={(patch) => setForm({ ...form, ...patch })}
          onSubmit={handleCreate}
          creating={creating}
        />
        <EditProjectModal
          open={showEditModal}
          project={editingProject}
          onClose={closeEdit}
          form={editForm}
          onChange={(patch) => setEditForm({ ...editForm, ...patch })}
          onSubmit={handleEdit}
          updating={updating}
        />
        <ConfirmDialog
          open={showDeleteModal && !!deletingProject}
          onClose={() => {
            if (!deleting) closeDelete();
          }}
          onConfirm={handleDelete}
          loading={deleting}
          title="Delete Project"
          confirmLabel="Delete"
          confirmPendingLabel="Deleting..."
          message={
            <>
              Are you sure you want to delete{" "}
              <span className="text-zinc-700 font-medium">
                {deletingProject?.name}
              </span>
              ? This action cannot be undone.
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

/** Centered placeholder shown while loading or when the list is empty. */
function TableMessage({
  children,
  icon,
  muted,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      {muted ? (
        <div className="w-12 h-12 rounded-xl bg-[#f4f4f5] border border-[#e4e4e7] flex items-center justify-center mb-3">
          <svg
            className="w-5 h-5 text-zinc-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
        </div>
      ) : (
        <div className="mb-3">{icon}</div>
      )}
      {children}
    </div>
  );
}
