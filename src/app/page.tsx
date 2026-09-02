"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { authenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      router.replace(authenticated ? "/dashboard" : "/login");
    }
  }, [authenticated, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-900">
      <div className="w-10 h-10 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
    </div>
  );
}
