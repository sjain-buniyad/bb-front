import { apiRequest, getToken, removeToken, setToken } from "./client";
import type { Employee } from "./users";

const USER_KEY = "auth_user";

export interface SignupPayload {
  name: string;
  email?: string;
  role: string;
  username?: string;
  password: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email?: string;
    username?: string;
    role: number;
    avatar?: string;
    verified: boolean;
    provider: string;
  };
}

function storeAuth(response: AuthResponse): AuthResponse {
  if (!response.token || !response.user) {
    throw new Error("Invalid authentication response");
  }
  setToken(response.token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(response.user));
  return response;
}

export function getStoredUser(): AuthResponse["user"] | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(USER_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value) as AuthResponse["user"];
  } catch {
    window.localStorage.removeItem(USER_KEY);
    return null;
  }
}

function clearStoredUser(): void {
  window.localStorage.removeItem(USER_KEY);
}

export { removeToken as logoutStorage, clearStoredUser };

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  const res = await apiRequest<
    AuthResponse & { newUser?: AuthResponse["user"] }
  >("/signup", {
    method: "POST",
    body: JSON.stringify(payload),
    noAuth: true,
  });
  return storeAuth({ ...res, user: res.user ?? res.newUser! });
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  console.log("[login] payload:", payload);
  const res = await apiRequest<AuthResponse>("/login", {
    method: "POST",
    body: JSON.stringify(payload),
    noAuth: true,
  });
  return storeAuth(res);
}

export async function googleVerify(payload: {
  idToken: string;
}): Promise<AuthResponse> {
  const res = await apiRequest<AuthResponse>("/auth/google/verify", {
    method: "POST",
    body: JSON.stringify(payload),
    noAuth: true,
  });
  return storeAuth(res);
}

export async function fetchCurrentUser(): Promise<Employee> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  let userId: string;
  try {
    const encodedPayload = token.split(".")[1];
    const base64Payload = encodedPayload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(encodedPayload.length / 4) * 4, "=");
    const payload = JSON.parse(atob(base64Payload)) as {
      id?: string;
      exp?: number;
    };
    if (!payload.id || (payload.exp && payload.exp * 1000 <= Date.now())) {
      throw new Error("Session expired");
    }
    userId = payload.id;
  } catch {
    throw new Error("Invalid session");
  }

  // The Feathers backend has no /me service. Its protected /user service
  // returns the current user's permitted employee list instead.
  const users = await apiRequest<Employee[]>("/user");
  const currentUser = users.find((user) => user._id === userId);
  if (!currentUser) throw new Error("User not found");
  return currentUser;
}
