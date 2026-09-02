import { apiRequest } from "./client";

export interface Block {
  _id: string;
  name: string;
  description?: string;
  projectId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchBlocks(projectId: string): Promise<Block[]> {
  const data = await apiRequest<Block[] | { data: Block[] }>(
    `/block?projectId=${projectId}`,
  );
  return Array.isArray(data) ? data : data.data || [];
}

export async function createBlock(payload: {
  name: string;
  description?: string;
  projectId: string;
}): Promise<Block> {
  return apiRequest<Block>("/block", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateBlock(
  id: string,
  payload: { name: string; description?: string },
): Promise<Block> {
  return apiRequest<Block>(`/block/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteBlock(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/block/${id}`, {
    method: "DELETE",
  });
}
