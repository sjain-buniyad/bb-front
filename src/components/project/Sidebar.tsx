"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../lib/auth-context";
import { getRoleLabel } from "../../lib/api";
import { useRouter, usePathname } from "next/navigation";

const getNavItems = (projectId: string) => [
  {
    label: "Dashboard",
    icon: (
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
          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
        />
      </svg>
    ),
    path: `/dashboard/projects/${projectId}`,
  },
  {
    label: "Blocks",
    icon: (
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
          d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
        />
      </svg>
    ),
    path: `/dashboard/projects/${projectId}/blocks`,
  },
  {
    label: "File Import",
    icon: (
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
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
        />
      </svg>
    ),
    path: `/dashboard/projects/${projectId}/imports`,
  },
  {
    label: "Waste Inventory",
    icon: (
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
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
        />
      </svg>
    ),
    path: `/dashboard/projects/${projectId}/waste-inventory`,
    disabled: true,
  },
  {
    label: "Access Control",
    icon: (
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
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
    path: `/dashboard/projects/${projectId}/access-control`,
    disabled: true,
  },
];

export default function Sidebar({ projectId }: { projectId: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const navItems = getNavItems(projectId);

  useEffect(() => {
    const saved = localStorage.getItem("project-sidebar-collapsed");
    if (saved !== null) setCollapsed(saved === "true");
  }, []);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("project-sidebar-collapsed", String(next));
  };

  const isActive = (path: string) => {
    if (path === `/dashboard/projects/${projectId}`) {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <aside
      data-sidebar="project"
      className={`fixed top-0 left-[72px] h-screen z-30 flex flex-col border-r border-[#e4e4e7] transition-all duration-300 ease-out ${
        collapsed ? "w-[72px]" : "w-[250px]"
      }`}
      style={{ background: "#f7f7f8" }}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center px-5 border-b border-[#e4e4e7] shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <span className="text-surface-900 font-bold text-sm">S</span>
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-zinc-900 whitespace-nowrap">
              Steel
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const disabled = item.disabled;

          return (
            <button
              key={item.label}
              onClick={() => !disabled && router.push(item.path)}
              disabled={disabled}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                active
                  ? "bg-accent/10 text-accent"
                  : disabled
                    ? "text-zinc-400 cursor-not-allowed"
                    : "text-zinc-600 hover:text-zinc-800 hover:bg-surface-800"
              }`}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent rounded-r-full" />
              )}
              <span className={`shrink-0 ${active ? "text-accent" : ""}`}>
                {item.icon}
              </span>
              {!collapsed && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
              {!collapsed && disabled && (
                <span className="ml-auto text-[10px] text-zinc-400 uppercase tracking-wider border border-zinc-200 px-1.5 py-0.5 rounded">
                  Soon
                </span>
              )}
              {/* Tooltip for collapsed state */}
              {collapsed && !disabled && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-surface-700 text-zinc-900 text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-lg shadow-black/40 z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-[#e4e4e7] shrink-0">
        <button
          onClick={toggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-zinc-500 hover:text-zinc-700 hover:bg-surface-800 transition-all duration-200"
        >
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>

      {/* User Profile at Bottom */}
      <div className="p-3 border-t border-[#e4e4e7] shrink-0">
        <div
          className={`flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-surface-800 transition-colors ${collapsed ? "justify-center" : ""}`}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt=""
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center text-accent text-xs font-bold shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-zinc-800 truncate">
                {user?.name}
              </p>
              <p className="text-[11px] text-zinc-500 truncate capitalize">
                {user ? getRoleLabel(user.role) : ""}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
