"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
  /** Roles allowed past the guard; user.role is numeric (see lib/roles). */
  requireRole?: (number | string)[];
}

/**
 * /login
 */
export default function AuthGuard({ children, requireRole }: AuthGuardProps) {
  const { user, loading, authenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authenticated) {
      router.replace("/login");
    }

    if (!loading && authenticated && requireRole && user) {
      if (!requireRole.includes(user.role)) {
        router.replace("/dashboard");
      }
    }
  }, [loading, authenticated, user, requireRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-900">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
          </div>
          <p className="text-zinc-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) return null;

  if (requireRole && user && !requireRole.includes(user.role)) return null;

  return <>{children}</>;
}
