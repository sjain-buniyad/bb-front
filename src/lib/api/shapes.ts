import { apiRequest, uploadFormData } from "./client";

export interface ShapeItem {
  _id: string;
  name: string;
  numberOfSides: number;
  formula: Record<string, string>;
  isNFB: boolean;
  hasStirrup: boolean;
  image: string;
  LD: number;
  allL: number[];
  L: number;
  numberOfStirrups: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchShapes(): Promise<ShapeItem[]> {
  const data = await apiRequest<ShapeItem[] | { data: ShapeItem[] }>("/shape");
  return Array.isArray(data) ? data : data.data || [];
}

export async function getShape(id: string): Promise<ShapeItem> {
  return apiRequest<ShapeItem>(`/shape/${id}`);
}

export async function createShapeFile(payload: FormData): Promise<ShapeItem> {
  return uploadFormData<ShapeItem>("/shape", payload, "Failed to create shape");
}

export async function deleteShape(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/shape/${id}`, {
    method: "DELETE",
  });
}
