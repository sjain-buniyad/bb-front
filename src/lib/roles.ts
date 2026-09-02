import { ROLE } from "./api";

export { ROLE };

export const ROLE_LABEL: Record<number | string, string> = {
  [ROLE.SUPER_ADMIN]: "super-admin",
  [ROLE.ADMIN]: "admin",
  [ROLE.USER]: "user",
};

export const ROLE_FROM_STRING: Record<string, number> = {
  "super-admin": ROLE.SUPER_ADMIN,
  admin: ROLE.ADMIN,
  user: ROLE.USER,
};

export const isAdminRole = (r: number | string) =>
  r === ROLE.ADMIN || r === ROLE.SUPER_ADMIN || r === "admin" || r === "super-admin";

export const isUserRole = (r: number | string) => r === ROLE.USER || r === "user";

/** Tailwind classes for the colored role badge in user tables. */
export const ROLE_BADGE: Record<number | string, string> = {
  [ROLE.SUPER_ADMIN]: "bg-red-500/10 text-red-600 border border-red-500/20",
  [ROLE.ADMIN]: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
  [ROLE.USER]: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
  "super-admin": "bg-red-500/10 text-red-600 border border-red-500/20",
  admin: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
  user: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
};
