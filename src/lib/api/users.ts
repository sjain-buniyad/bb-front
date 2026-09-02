import { apiRequest } from "./client";

export interface Employee {
  _id: string;
  name: string;
  email?: string;
  role: number;
  avatar?: string;
  verified: boolean;
  provider: string;
  adminId?: string;
  createAt?: string;
}

export const ROLE = { SUPER_ADMIN: 1, ADMIN: 512, USER: 1024 } as const;

const ROLE_LABEL: Record<number | string, string> = {
  [ROLE.SUPER_ADMIN]: "super-admin",
  [ROLE.ADMIN]: "admin",
  [ROLE.USER]: "user",
  "super-admin": "super-admin",
  admin: "admin",
  user: "user",
};

export const getRoleLabel = (role: number | string): string =>
  ROLE_LABEL[role] || "user";

export async function createEmployee(payload: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  return apiRequest("/user", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchEmployees(): Promise<Employee[]> {
  return apiRequest<Employee[]>("/user");
}

export async function getEmployee(id: string): Promise<Employee> {
  return apiRequest<Employee>(`/user/${id}`);
}

export async function updateEmployee(
  id: string,
  data: Partial<Pick<Employee, "name" | "email" | "role">>,
): Promise<Employee> {
  return apiRequest<Employee>(`/user/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteEmployee(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/user/${id}`, {
    method: "DELETE",
  });
}
