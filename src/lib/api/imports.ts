import { API_URL, apiRequest, getToken, uploadFormData } from "./client";

export interface ImportItem {
  _id: string;
  name: string;
  type: number;
  file: string;
  projectId: string;
  blockId: string;
  floorId: string;
  drgNumber?: number;
  drgDate?: string;
  structureName?: string;
  status: "In Progress" | "Pending" | "Exported" | "Completed" | "Failed";
  beam?: any;
  column?: any;
  slab?: any;
  footing?: any;
  bar?: any;
  createdAt: string;
  createdBy?: {
    _id: string;
    name: string;
  };
}

export async function fetchImports(projectId: string): Promise<ImportItem[]> {
  return apiRequest<ImportItem[] | { data: ImportItem[] }>(
    `/import?projectId=${projectId}`,
  ).then((data) => (Array.isArray(data) ? data : data.data || []));
}

export async function uploadImportFile(
  payload: FormData,
): Promise<ImportItem> {
  return uploadFormData<ImportItem>("/import", payload, "Failed to upload file");
}

export async function getImport(id: string): Promise<ImportItem> {
  return apiRequest<ImportItem>(`/import/${id}`);
}

export async function updateImport(
  id: string,
  data: Partial<ImportItem>,
): Promise<ImportItem> {
  return apiRequest<ImportItem>(`/import/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteImport(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/import/${id}`, {
    method: "DELETE",
  });
}

/** Download the extracted bar bending schedule for an import as an xlsx file. */
export async function exportBarExcel(
  id: string,
): Promise<{ blob: Blob; filename: string }> {
  const token = getToken();
  const res = await fetch(`${API_URL}/import/${id}/export-bar`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to export bar excel");
  }

  const disposition = res.headers.get("Content-Disposition") || "";
  const match = disposition.match(/filename="?([^"]+)"?/);

  return { blob: await res.blob(), filename: match?.[1] || "bar.xlsx" };
}
