import { apiRequest } from "./client";

export interface Project {
  _id: string;
  adminId: string;
  name: string;
  type: string;
  manager: string;
  developer: string;
  contrator: string;
  consultant: string;
  start_date: string;
  end_date: string;
  bar_length: number;
  description: string;
}

export interface CreateProjectPayload {
  name: string;
  type: string;
  manager: string;
  developer: string;
  contrator: string;
  consultant: string;
  start_date: string;
  end_date: string;
  bar_length: number;
  description: string;
}

export async function fetchProjects(): Promise<Project[]> {
  return apiRequest<Project[]>("/project");
}

export async function getProject(id: string): Promise<Project> {
  return apiRequest<Project>(`/project/${id}`);
}

export async function createProject(
  data: CreateProjectPayload,
): Promise<Project> {
  return apiRequest<Project>("/project", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProject(
  id: string,
  data: Partial<CreateProjectPayload>,
): Promise<Project> {
  return apiRequest<Project>(`/project/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteProject(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/project/${id}`, {
    method: "DELETE",
  });
}
