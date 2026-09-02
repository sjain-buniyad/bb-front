export const FILE_TYPES = [
  { value: 1, label: "Excel" },
  { value: 132, label: "DWG" },
  { value: 637, label: "PDF" },
  { value: 1103, label: "RVT" },
];

export const STATUS_STYLES: Record<string, string> = {
  "In Progress": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Failed: "bg-red-500/10 text-red-600 border-red-500/20",
  Pending: "bg-zinc-500/10 text-zinc-600 border-zinc-500/20",
  Exported: "bg-sky-500/10 text-sky-400 border-sky-500/20",
};

export function formatImportDate(d: string): string {
  if (!d) return "\u2014";
  const parsed = new Date(d);
  if (Number.isNaN(parsed.getTime())) return "\u2014";
  return parsed.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}
