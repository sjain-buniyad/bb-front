"use client";

import type { ReactNode } from "react";
import Modal from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  confirmPendingLabel?: string;
  loading?: boolean;
}

/** Red-styled confirmation dialog for destructive actions. */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Delete",
  confirmPendingLabel = "Deleting...",
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={() => {
        if (!loading) onClose();
      }}
      title={title}
      size="sm"
    >
      <div className="p-5 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
        <h3 className="text-[15px] font-semibold text-zinc-900 mb-1">{title}</h3>
        <p className="text-[13px] text-zinc-500 leading-relaxed">{message}</p>
      </div>
      <div className="flex gap-3 px-5 pb-5">
        <button
          onClick={onClose}
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-lg text-[13px] font-medium text-zinc-600 border border-[#d4d4d8] hover:bg-[#e4e4e7] transition-colors disabled:opacity-40"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-lg text-[13px] font-medium text-zinc-900 bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {loading ? confirmPendingLabel : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
