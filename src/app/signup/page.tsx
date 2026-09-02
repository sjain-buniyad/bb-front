"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import Toast from "@/components/Toast";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "admin",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};

    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Invalid email format";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 8)
      errs.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setToast(null);

      if (!validate()) return;

      setLoading(true);
      try {
        await signup({
          name: form.name,
          role: form.role,
          email: form.email,
          password: form.password,
        });
        router.push("/dashboard");
      } catch (err: any) {
        setToast({ message: err.message, type: "error" });
      } finally {
        setLoading(false);
      }
    },
    [form, validate, signup, router],
  );

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-accent/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-accent/3 rounded-full blur-[90px]" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(226,169,59,0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(226,169,59,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="card-auth animate-fade-in relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-1 tracking-tight">
          Create account
        </h1>
        <p className="text-zinc-500 text-sm text-center mb-8">
          Get started with your free account
        </p>

        {/* Google 登录 */}
        <GoogleLoginButton
          className="btn-google"
          onSuccess={() => router.push("/dashboard")}
          onError={(err) => setToast({ message: err, type: "error" })}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign up with Google
        </GoogleLoginButton>

        <div className="divider">or</div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-medium text-zinc-600 mb-1.5 uppercase tracking-wider"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={`input-field ${errors.name ? "input-error" : ""}`}
            />
            {errors.name && (
              <p className="text-danger text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-zinc-600 mb-1.5 uppercase tracking-wider"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              className={`input-field ${errors.email ? "border-danger/60 focus:border-danger/80 focus:ring-danger/30" : ""}`}
            />
            {errors.email && (
              <p className="text-danger text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-zinc-600 mb-1.5 uppercase tracking-wider"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              required
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              className={`input-field ${errors.password ? "border-danger/60 focus:border-danger/80 focus:ring-danger/30" : ""}`}
            />
            {errors.password && (
              <p className="text-danger text-xs mt-1">{errors.password}</p>
            )}
            {/* 密码强度指示器 */}
            {form.password && (
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4].map((level) => {
                  const strength = getStrength(form.password);
                  const active = strength >= level;
                  return (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        active
                          ? strength <= 1
                            ? "bg-danger"
                            : strength <= 2
                              ? "bg-yellow-500"
                              : strength <= 3
                                ? "bg-accent"
                                : "bg-success"
                          : "bg-surface-600"
                      }`}
                    />
                  );
                })}
                <span className="text-[10px] text-zinc-500 ml-2 leading-none self-center">
                  {form.password.length < 8
                    ? "too short"
                    : getStrength(form.password) <= 1
                      ? "weak"
                      : getStrength(form.password) <= 2
                        ? "fair"
                        : getStrength(form.password) <= 3
                          ? "good"
                          : "strong"}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-medium text-zinc-600 mb-1.5 uppercase tracking-wider"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              required
              value={form.confirmPassword}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  confirmPassword: e.target.value,
                }))
              }
              className={`input-field ${
                errors.confirmPassword
                  ? "border-danger/60 focus:border-danger/80 focus:ring-danger/30"
                  : ""
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-danger text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? (
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
                Creating account...
              </span>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="link-accent">
            Sign in
          </Link>
        </p>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

/** 简易密码强度计算 */
function getStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return score;
}
