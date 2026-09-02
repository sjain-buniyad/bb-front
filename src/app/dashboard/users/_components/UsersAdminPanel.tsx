"use client";

import { PlusIcon } from "@/components/ui/icons";

interface UsersAdminPanelProps {
  employeeCount: number;
  adminCount: number;
  totalUsers: number;
  onAdd: () => void;
}

/** Top section visible to admins: add-employee promo + quick info cards. */
export default function UsersAdminPanel({
  employeeCount,
  adminCount,
  totalUsers,
  onAdd,
}: UsersAdminPanelProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Add Employee Card */}
      <div className="lg:col-span-2 relative overflow-hidden rounded-xl border border-[#e4e4e7] bg-gradient-to-br from-[#ffffff] to-[#f7f7f8]">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative p-6 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-emerald-600"
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
              <div>
                <h2 className="text-[15px] font-semibold text-zinc-900">
                  Add Employee
                </h2>
                <p className="text-[12px] text-zinc-500">
                  Create accounts for your team members
                </p>
              </div>
            </div>

            <CountPill label="Employees" value={employeeCount} dotClass="bg-sky-400" />
            <span className="inline-block w-2" />
            <CountPill label="Admins" value={adminCount} dotClass="bg-emerald-400" />

            <p className="text-[12px] text-zinc-400 leading-relaxed max-w-md mt-4">
              Employees will be linked to your account and can access
              shared projects. They&apos;ll receive a temporary
              password to log in for the first time.
            </p>
          </div>

          <div className="sm:ml-auto shrink-0 flex sm:flex-col gap-3">
            <button
              onClick={onAdd}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-zinc-900 font-semibold text-sm hover:bg-emerald-600 active:scale-[0.97] transition-all duration-200 shadow-lg shadow-emerald-500/20"
            >
              <PlusIcon />
              Add Employee
            </button>
          </div>
        </div>
      </div>

      {/* Right: Quick Info Cards */}
      <div className="flex flex-col gap-4">
        <InfoCard
          label="Total Users"
          value={String(totalUsers)}
          hint="in your workspace"
          iconPath="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          iconBg="bg-[#f4f4f5]"
          iconColor="text-zinc-500"
        />

        <InfoCard
          label="Active Today"
          value={"\u2014"}
          hint="no tracking yet"
          iconPath="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z"
          iconBg="bg-emerald-500/10"
          iconColor="text-emerald-500"
        />
      </div>
    </div>
  );
}

function CountPill({
  label,
  value,
  dotClass,
}: {
  label: string;
  value: number;
  dotClass: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ffffff] border border-[#e4e4e7]">
      <span className={`w-2 h-2 rounded-full ${dotClass}`} />
      <span className="text-[12px] text-zinc-600">
        <span className="text-zinc-900 font-semibold">{value}</span> {label}
      </span>
    </span>
  );
}

function InfoCard({
  label,
  value,
  hint,
  iconPath,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string;
  hint: string;
  iconPath: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="flex-1 bg-[#ffffff] border border-[#e4e4e7] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
          {label}
        </span>
        <div className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center`}>
          <svg
            className={`w-3.5 h-3.5 ${iconColor}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
          </svg>
        </div>
      </div>
      <p className="text-3xl font-bold text-zinc-900">{value}</p>
      <p className="text-[11px] text-zinc-400 mt-1">{hint}</p>
    </div>
  );
}
