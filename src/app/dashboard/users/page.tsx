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
  createEmployee,
  deleteEmployee,
  fetchEmployees,
  updateEmployee,
  type Employee,
} from "@/lib/api";
import {
  ROLE,
  ROLE_FROM_STRING,
  ROLE_LABEL,
  isAdminRole,
  isUserRole,
} from "@/lib/roles";
import { useSidebarSync } from "@/hooks/useSidebarSync";
import { useAuth } from "@/lib/auth-context";
import AddEmployeeModal, { type EmployeeFormState } from "./_components/AddEmployeeModal";
import EditUserModal, { type EditUserFormState } from "./_components/EditUserModal";
import UserRow from "./_components/UserRow";
import UsersAdminPanel from "./_components/UsersAdminPanel";

const emptyForm: EmployeeFormState = {
  name: "",
  email: "",
  password: "",
  role: "user",
};

type ToastState = { message: string; type: "success" | "error" } | null;

export default function UsersPage() {
  const { user } = useAuth();
  const mainRef = useRef<HTMLDivElement>(null);
  useSidebarSync(mainRef);

  const [users, setUsers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  // Create modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<EmployeeFormState>(emptyForm);

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Employee | null>(null);
  const [editForm, setEditForm] = useState<EditUserFormState>({
    name: "",
    email: "",
    role: "user",
  });
  const [updating, setUpdating] = useState(false);

  // Delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState(false);

  const isAdmin = isAdminRole(user?.role ?? "");
  const showSuperAdminOption =
    isAdmin && user?.role !== ROLE.ADMIN;
  const employeeCount = users.filter((u) => isUserRole(u.role)).length;
  const adminCount = users.filter((u) => isAdminRole(u.role)).length;

  // ── Load ──
  const loadEmployees = async () => {
    try {
      const data = await fetchEmployees();
      const adminAsEmployee = user ? [user as unknown as Employee] : [];
      setUsers([
        ...adminAsEmployee,
        ...data.filter((d) => d._id !== user?._id),
      ]);
    } catch (err: any) {
      if (user) setUsers([user as unknown as Employee]);
      setToast({
        message: err.message || "Failed to load employees",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!openMenuId) return;
    const handler = () => setOpenMenuId(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [openMenuId]);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase())),
  );

  // ── Create ──
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;
    setCreating(true);
    setToast(null);
    try {
      await createEmployee(form);
      setToast({ message: "Employee added successfully!", type: "success" });
      setForm(emptyForm);
      setShowCreateModal(false);
      await loadEmployees();
    } catch (err: any) {
      setToast({
        message: err.message || "Failed to add employee",
        type: "error",
      });
    } finally {
      setCreating(false);
    }
  };

  // ── Edit ──
  const openEdit = (u: Employee) => {
    setEditingUser(u);
    setEditForm({
      name: u.name,
      email: u.email || "",
      role: ROLE_LABEL[u.role] || "user",
    });
    setShowEditModal(true);
    setOpenMenuId(null);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUpdating(true);
    setToast(null);
    try {
      await updateEmployee(editingUser._id, {
        name: editForm.name,
        email: editForm.email,
        role: ROLE_FROM_STRING[editForm.role] ?? ROLE.USER,
      });
      setToast({ message: "User updated successfully!", type: "success" });
      closeEdit();
      await loadEmployees();
    } catch (err: any) {
      setToast({ message: err.message || "Failed to update user", type: "error" });
    } finally {
      setUpdating(false);
    }
  };

  const closeEdit = () => {
    setShowEditModal(false);
    setEditingUser(null);
  };

  // ── Delete ──
  const openDelete = (u: Employee) => {
    setDeletingUser(u);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setDeleting(true);
    setToast(null);
    try {
      await deleteEmployee(deletingUser._id);
      setToast({ message: "User deleted successfully!", type: "success" });
      closeDelete();
      await loadEmployees();
    } catch (err: any) {
      setToast({ message: err.message || "Failed to delete user", type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  const closeDelete = () => {
    setShowDeleteModal(false);
    setDeletingUser(null);
  };

  // Pagination
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = 1;
  const pageUsers = filteredUsers.slice(0, pageSize);
  const startIdx =
    filteredUsers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, filteredUsers.length);

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
            {/* Page Header */}
            <div>
              <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
                Manage Users
              </h1>
              <p className="text-sm text-zinc-500 mt-0.5">
                Add employees to your workspace and manage their access
              </p>
            </div>

            {/* Admin panel */}
            {isAdmin && (
              <UsersAdminPanel
                employeeCount={employeeCount}
                adminCount={adminCount}
                totalUsers={users.length}
                onAdd={() => setShowCreateModal(true)}
              />
            )}

            {/* Search */}
            <div className="flex items-center gap-3">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by name or email..."
                focusClassName="focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20"
              />
              {isAdmin && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-zinc-900 font-medium text-sm hover:bg-emerald-600 active:scale-[0.98] transition-all duration-200"
                >
                  <PlusIcon />
                  New User
                </button>
              )}
            </div>

            {/* Table */}
            <div className="bg-[#ffffff] border border-[#e4e4e7] rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#e4e4e7] text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                <div className="col-span-4">Name</div>
                <div className="col-span-4">Email</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2 text-right pr-1">Action</div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                  <SpinnerCircle className="w-6 h-6 mb-3" />
                  <p className="text-sm text-zinc-500">Loading employees...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6">
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-zinc-500 mb-0.5">
                    {search ? "No users found" : "No employees yet"}
                  </p>
                  <p className="text-xs text-zinc-300">
                    {search
                      ? "Try a different search"
                      : 'Click "+ Add Employee" to get started'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#f4f4f5]">
                  {pageUsers.map((u) => (
                    <UserRow
                      key={u._id}
                      user={u}
                      menuOpen={openMenuId === u._id}
                      onToggleMenu={() =>
                        setOpenMenuId(openMenuId === u._id ? null : u._id)
                      }
                      onEdit={() => openEdit(u)}
                      onDelete={() => openDelete(u)}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {filteredUsers.length > 0 && (
                <div className="px-5 py-3 border-t border-[#e4e4e7] flex items-center justify-between">
                  <p className="text-[12px] text-zinc-400">
                    Showing {startIdx} to {endIdx} of {filteredUsers.length}{" "}
                    entries
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-[12px] text-zinc-500 mr-2">
                      Page {currentPage} of {totalPages}
                    </p>
                    <button
                      disabled
                      className="px-2.5 py-1 rounded text-[12px] text-zinc-400 border border-[#e4e4e7] bg-[#ffffff] cursor-not-allowed"
                    >
                      Prev
                    </button>
                    <button className="px-2.5 py-1 rounded text-[12px] text-emerald-600 border border-emerald-500/30 bg-emerald-500/10 font-medium">
                      {currentPage}
                    </button>
                    <button
                      disabled
                      className="px-2.5 py-1 rounded text-[12px] text-zinc-400 border border-[#e4e4e7] bg-[#ffffff] cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Modals */}
        <AddEmployeeModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          form={form}
          onChange={(patch) => setForm({ ...form, ...patch })}
          onSubmit={handleCreate}
          creating={creating}
          showSuperAdminOption={showSuperAdminOption}
        />
        <EditUserModal
          open={showEditModal}
          user={editingUser}
          onClose={closeEdit}
          form={editForm}
          onChange={(patch) => setEditForm({ ...editForm, ...patch })}
          onSubmit={handleEdit}
          updating={updating}
          showSuperAdminOption={showSuperAdminOption}
        />
        <ConfirmDialog
          open={showDeleteModal && !!deletingUser}
          onClose={() => {
            if (!deleting) closeDelete();
          }}
          onConfirm={handleDelete}
          loading={deleting}
          title="Remove User"
          confirmLabel="Remove"
          confirmPendingLabel="Removing..."
          message={
            <>
              Are you sure you want to remove{" "}
              <span className="text-zinc-700 font-medium">
                {deletingUser?.name}
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
