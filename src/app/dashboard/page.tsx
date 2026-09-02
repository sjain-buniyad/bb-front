"use client";

import { useAuth } from "../../lib/auth-context";
import { createEmployee, fetchEmployees, type Employee } from "../../lib/api";
import AuthGuard from "../../components/AuthGuard";
import Sidebar from "../../components/Sidebar";
import TopHeader from "../../components/TopHeader";
import StatCard from "../../components/StatCard";
import Toast from "../../components/Toast";
import { useState, useEffect } from "react";
import { ROLE, isAdminRole } from "@/lib/roles";

export default function DashboardPage() {
  const { user, authenticated, loading: authLoading } = useAuth();

  const [employees, setEmployees] = useState<Employee[]>([]);

  // Create Employee State
  const [empForm, setEmpForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [creating, setCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const isAdmin = isAdminRole(user?.role ?? "");

  useEffect(() => {
    if (authLoading || !authenticated) return;
    fetchEmployees()
      .then((data) => {
        const merged = user ? [user as unknown as Employee, ...data.filter((d) => d._id !== user?._id)] : data;
        setEmployees(merged);
      })
      .catch(() => {});
  }, [authLoading, authenticated, user]);

  // Sync sidebar width with main area
  useEffect(() => {
    const sidebar = document.querySelector("aside");
    const main = document.getElementById("main-area");
    if (!sidebar || !main) return;

    const syncWidth = () => {
      main.style.marginLeft = `${sidebar.offsetWidth}px`;
    };

    syncWidth();

    const observer = new MutationObserver(syncWidth);
    observer.observe(sidebar, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => observer.disconnect();
  }, []);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empForm.name || !empForm.email || !empForm.password) return;
    setCreating(true);
    setToast(null);
    try {
      await createEmployee(empForm);
      setToast({ message: "Employee created successfully!", type: "success" });
      setEmpForm({ name: "", email: "", password: "", role: "user" });
      setShowCreateModal(false);
    } catch (err: any) {
      setToast({
        message: err.message || "Failed to create employee",
        type: "error",
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#f7f7f8] flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Area */}
        <div
          className="flex-1 ml-[250px] lg:ml-[250px] flex flex-col min-h-screen transition-all duration-300"
          id="main-area"
        >
          <TopHeader />

          <main className="flex-1 p-6 lg:p-8 space-y-6">
            {/* Subscription Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-[#e4e4e7] bg-gradient-to-br from-surface-800 via-surface-800 to-surface-900 p-6 lg:p-8">
              <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-200 border border-zinc-300 text-[11px] font-medium text-zinc-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                      No Active Subscription
                    </span>
                  </div>
                  <h2 className="text-xl lg:text-2xl font-bold text-zinc-900 mb-2">
                    Unlock the full power of Steel
                  </h2>
                  <p className="text-sm text-zinc-600 max-w-lg leading-relaxed">
                    Subscribe to a plan to manage unlimited projects, add team
                    members, and access advanced import analytics and reporting
                    tools.
                  </p>
                </div>
                <button className="shrink-0 px-8 py-3 rounded-xl bg-accent text-surface-900 font-semibold text-sm hover:bg-accent-hover active:scale-[0.98] transition-all duration-200 shadow-lg shadow-accent/20">
                  Subscribe Now
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard
                label="Total Employees"
                value={employees.length}
                accent
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                }
              />
              <StatCard
                label="Total Projects"
                value={0}
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                }
              />
              <StatCard
                label="Total Imports"
                value={0}
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                }
              />
              <StatCard
                label="Current Plan"
                value="---"
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                }
              />
            </div>

            {/* Admin: Create Employee Button + Quick Info */}
            {isAdmin && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="border-2 border-dashed border-[#d4d4d8] rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-zinc-500 hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-surface-800 border border-[#e4e4e7] flex items-center justify-center group-hover:bg-accent/10 group-hover:border-accent/30 transition-colors">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">
                    Create New Employee
                  </span>
                  <span className="text-xs text-zinc-400">
                    Add a team member to your workspace
                  </span>
                </button>

                <div className="bg-[#ffffff] border border-[#e4e4e7] rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-zinc-700">
                      Total Estimated Value
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-zinc-900">0</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Across all projects
                  </p>
                </div>

                <div className="bg-[#ffffff] border border-[#e4e4e7] rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-surface-700 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-zinc-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-zinc-700">
                      Recent Activity
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500">No activity yet</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Start by creating a project
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Create Employee Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowCreateModal(false)}
            />
            <div className="relative w-full max-w-lg bg-surface-800 border border-[#e4e4e7] rounded-2xl shadow-2xl shadow-black/50 animate-slide-up">
              <div className="flex items-center justify-between p-6 border-b border-[#e4e4e7]">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">
                    Create Employee
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Add a new team member to your workspace
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-surface-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
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

              <form onSubmit={handleCreateEmployee} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1.5 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={empForm.name}
                    onChange={(e) =>
                      setEmpForm({ ...empForm, name: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1.5 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="employee@company.com"
                    value={empForm.email}
                    onChange={(e) =>
                      setEmpForm({ ...empForm, email: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1.5 uppercase tracking-wider">
                    Temporary Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min. 8 characters"
                    value={empForm.password}
                    onChange={(e) =>
                      setEmpForm({ ...empForm, password: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1.5 uppercase tracking-wider">
                    Role
                  </label>
                  <select
                    value={empForm.role}
                    onChange={(e) =>
                      setEmpForm({ ...empForm, role: e.target.value })
                    }
                    className="input-field appearance-none cursor-pointer"
                  >
                    <option value="user">User (Employee)</option>
                    {user?.role === ROLE.SUPER_ADMIN && (
                      <option value="admin">Admin</option>
                    )}
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-600 border border-[#d4d4d8] hover:bg-surface-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="btn-primary w-auto px-8"
                  >
                    {creating ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="opacity-20"
                          />
                          <path
                            d="M4 12a8 8 0 018-8"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </svg>
                        Creating...
                      </span>
                    ) : (
                      "Create Employee"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
