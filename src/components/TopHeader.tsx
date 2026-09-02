"use client";

import { useAuth } from "../lib/auth-context";
import { getRoleLabel } from "../lib/api";
import { useState } from "react";

export default function TopHeader() {
  const { user, logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <header className="h-16 border-b border-[#e4e4e7] bg-[#f7f7f8]/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0">
      {/* Left: Mobile menu + Page title placeholder */}
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-surface-800 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Sign Out Button */}
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-zinc-600 border border-[#d4d4d8] hover:text-red-600 hover:border-red-500/30 hover:bg-red-500/10 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Sign out</span>
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-[#e4e4e7]" />

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowLogout(!showLogout)}
            className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-surface-800 transition-colors"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-surface-700" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center text-accent text-xs font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-zinc-800 leading-tight">{user?.name}</p>
              <p className="text-[11px] text-zinc-500 leading-tight capitalize">{user ? getRoleLabel(user.role) : ""}</p>
            </div>
            <svg className="w-4 h-4 text-zinc-500 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showLogout && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowLogout(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-surface-800 border border-[#e4e4e7] rounded-xl shadow-xl shadow-black/50 z-50 overflow-hidden animate-fade-in">
                <div className="p-3 border-b border-[#e4e4e7]">
                  <p className="text-sm font-medium text-zinc-800">{user?.name}</p>
                  <p className="text-xs text-zinc-500">{user?.email}</p>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-600 hover:text-zinc-900 hover:bg-surface-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Profile
                  </button>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-danger hover:bg-danger/10 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
