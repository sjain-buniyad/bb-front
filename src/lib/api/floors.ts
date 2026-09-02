import { apiRequest } from "./client";

export interface Floor {
  _id: string;
  name: string;
  description?: string;
  blockId: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchFloors(blockId: string): Promise<Floor[]> {
  const data = await apiRequest<Floor[] | { data: Floor[] }>(
    `/floor?blockId=${blockId}`,
  );
  return Array.isArray(data) ? data : data.data || [];
}

export async function createFloor(payload: {
  name: string;
  description?: string;
  blockId: string;
}): Promise<Floor> {
  return apiRequest<Floor>("/floor", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateFloor(
  id: string,
  payload: { name: string; description?: string },
): Promise<Floor> {
  return apiRequest<Floor>(`/floor/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteFloor(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/floor/${id}`, {
    method: "DELETE",
  });
}
