"use client";

import type { ReactNode } from "react";
import { CloseIcon } from "./icons";

type ModalSize = "sm" | "md" | "lg" | "xl";

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-3xl",
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: ReactNode;
  icon?: ReactNode;
  size?: ModalSize;
  children: ReactNode;
}

/**
 * Shared modal shell: dark overlay + panel with sticky header.
 * Body content (form fields, lists...) is passed as children.
 */
export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  icon,
  size = "lg",
  children,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full ${SIZE_CLASSES[size]} max-h-[90vh] overflow-y-auto bg-[#ffffff] border border-[#e4e4e7] rounded-xl shadow-2xl shadow-black/60 animate-slide-up`}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e4e4e7] sticky top-0 bg-[#ffffff] z-10">
          {icon}
          <div className="flex-1">
            <h2 className="text-[15px] font-semibold text-zinc-900">{title}</h2>
            {subtitle && <p className="text-[11px] text-zinc-500">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-500 hover:text-zinc-900 hover:bg-[#e4e4e7] transition-colors"
          >
            <CloseIcon />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
