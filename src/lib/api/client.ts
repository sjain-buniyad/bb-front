import Cookies from "js-cookie";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

interface RequestOptions extends RequestInit {
  noAuth?: boolean;
}

export function getToken(): string | undefined {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (token) return token;
  }
  return Cookies.get(TOKEN_KEY);
}

export function setToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
  Cookies.set(TOKEN_KEY, token, { expires: 7, sameSite: "lax", path: "/" });
}

export function removeToken(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  }
  Cookies.remove(TOKEN_KEY, { path: "/" });
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { noAuth = false, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers);
  if (
    !(fetchOptions.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }
  if (!noAuth) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;
  console.log("[apiRequest]", fetchOptions.method ?? "GET", url);
  const response = await fetch(url, { ...fetchOptions, headers });
  console.log("[apiRequest] status:", response.status);

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      data.error || data.message || `Request failed (${response.status})`,
    );
  }
  return data as T;
}

/** POST raw FormData with auth header (fetch sets the multipart boundary). */
export async function uploadFormData<T>(endpoint: string, payload: FormData, errorMessage: string): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: payload,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || errorMessage);
  return data as T;
}
