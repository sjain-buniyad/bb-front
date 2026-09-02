"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth-context";
import { getRoleLabel, ROLE } from "../lib/api";
import { useRouter, usePathname } from "next/navigation";

const navItems = [
  {
    label: "Dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    path: "/dashboard",
  },
  {
    label: "Project Management",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    path: "/dashboard/projects",
  },
  {
    label: "Employees",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    path: "/dashboard/users",
  },
  {
    label: "Shapes",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 01.8.4l.6.8H18a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
      </svg>
    ),
    path: "/dashboard/shapes",
    superAdminOnly: true,
  },
  {
    label: "Imports",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
    path: "/dashboard/imports",
    disabled: true,
  },
  {
    label: "Settings",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    path: "/dashboard/settings",
    disabled: true,
  },
];

export default function Sidebar({ hoverable = false }: { hoverable?: boolean }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) setCollapsed(saved === "true");
  }, []);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar-collapsed", String(next));
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  const isCollapsed = hoverable ? !hovered : collapsed;

  return (
    <aside
      data-sidebar="global"
      onMouseEnter={() => hoverable && setHovered(true)}
      onMouseLeave={() => hoverable && setHovered(false)}
      className={`fixed top-0 left-0 h-screen z-40 flex flex-col border-r border-[#e4e4e7] transition-all duration-300 ease-out ${
        isCollapsed ? "w-[72px]" : "w-[250px]"
      }`}
      style={{ background: "#f7f7f8" }}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center px-5 border-b border-[#e4e4e7] shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <span className="text-surface-900 font-bold text-sm">S</span>
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold tracking-tight text-zinc-900 whitespace-nowrap">
              Steel
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems
          .filter((item) => !(item as any).superAdminOnly || user?.role === ROLE.SUPER_ADMIN)
          .map((item) => {
          const active = isActive(item.path);
          const disabled = item.disabled;

          return (
            <button
              key={item.label}
              onClick={() => !disabled && router.push(item.path)}
              disabled={disabled}
              title={isCollapsed ? item.label : undefined}
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
              {!isCollapsed && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
              {!isCollapsed && disabled && (
                <span className="ml-auto text-[10px] text-zinc-400 uppercase tracking-wider border border-zinc-200 px-1.5 py-0.5 rounded">
                  Soon
                </span>
              )}
              {/* Tooltip for collapsed state */}
              {isCollapsed && !disabled && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-surface-700 text-zinc-900 text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-lg shadow-black/40 z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      {!hoverable && <div className="p-3 border-t border-[#e4e4e7] shrink-0">
        <button
          onClick={toggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-zinc-500 hover:text-zinc-700 hover:bg-surface-800 transition-all duration-200"
        >
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          {!isCollapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>}

      {/* User Profile at Bottom */}
      <div className="p-3 border-t border-[#e4e4e7] shrink-0">
        <div className={`flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-surface-800 transition-colors ${isCollapsed ? "justify-center" : ""}`}>
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center text-accent text-xs font-bold shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-zinc-800 truncate">{user?.name}</p>
              <p className="text-[11px] text-zinc-500 truncate capitalize">{user ? getRoleLabel(user.role) : ""}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
