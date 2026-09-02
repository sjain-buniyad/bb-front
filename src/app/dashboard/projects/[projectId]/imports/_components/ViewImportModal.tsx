"use client";

import type { ImportItem } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import { STATUS_STYLES, formatImportDate } from "../_components/import-constants";

interface ViewImportModalProps {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  data: ImportItem | null;
}

/** Read-only modal showing import metadata + extracted beam data. */
export default function ViewImportModal({
  open,
  onClose,
  loading,
  data,
}: ViewImportModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Import Details"
      size="xl"
    >
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      ) : data ? (
        <div className="p-5 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <MetaField label="Name">
              <p className="text-sm text-zinc-800 truncate">{data.name}</p>
            </MetaField>
            <MetaField label="Status">
              <span
                className={`inline-flex px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider border ${STATUS_STYLES[data.status]}`}
              >
                {data.status}
              </span>
            </MetaField>
            <MetaField label="Imported By">
              <p className="text-sm text-zinc-800">
                {data.createdBy?.name || "Unknown"}
              </p>
            </MetaField>
            <MetaField label="Date">
              <p className="text-sm text-zinc-800">{formatImportDate(data.createdAt)}</p>
            </MetaField>
          </div>

          <ExtractedBeams data={data} />
        </div>
      ) : null}
    </Modal>
  );
}

function MetaField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">
        {label}
      </p>
      {children}
    </div>
  );
}

function ExtractedBeams({ data }: { data: ImportItem }) {
  const hasBeams = Array.isArray(data.beam) && data.beam.length > 0;

  if (!hasBeams) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-zinc-800 mb-3">
          Extracted Beams
        </h3>
        <div className="rounded-lg border border-dashed border-[#e4e4e7] p-8 text-center">
          <p className="text-sm text-zinc-400">No extraction data available yet.</p>
          <p className="text-xs text-zinc-300 mt-1">Status: {data.status}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-800 mb-3">Extracted Beams</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {data.beam.map((b: any, i: number) => (
          <BeamExtractCard key={i} beam={b} />
        ))}
      </div>
    </div>
  );
}

function BeamExtractCard({ beam }: { beam: any }) {
  return (
    <div className="rounded-lg border border-[#e4e4e7] bg-[#f7f7f8] p-4">
      <p className="text-sm font-medium text-accent mb-2">{beam.name}</p>
      <div className="grid grid-cols-3 gap-4 text-xs">
        <PreField label="Size" value={beam.size} />
        <PreField label="Reinforcement" value={beam.reinforcement} />
        <PreField label="Stirrups" value={beam.stirrups} />
      </div>
    </div>
  );
}

function PreField({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <span className="text-zinc-400 uppercase">{label}:</span>
      <pre className="mt-1 text-zinc-700 whitespace-pre-wrap">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}
