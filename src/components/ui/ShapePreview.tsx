"use client";

import { API_URL } from "@/lib/api";

interface ShapePreviewProps {
  src?: string;
  name: string;
  formula?: Record<string, string>;
  isNFB?: boolean;
  hasStirrup?: boolean;
  size?: "sm" | "lg";
}

/** Shape thumbnail + formula chips + NFB/Stirrup badges. */
export default function ShapePreview({
  src,
  name,
  formula,
  isNFB,
  hasStirrup,
  size = "sm",
}: ShapePreviewProps) {
  if (!src) return null;

  const boxSize = size === "lg" ? "w-24 h-24" : "w-20 h-20";
  const formulaEntries = formula ? Object.entries(formula) : [];

  return (
    <div
      className={
        size === "lg"
          ? "flex items-start gap-5 mt-5 pt-4 border-t border-[#e4e4e7]"
          : "flex items-center gap-4 mb-5 pb-5 border-b border-[#e4e4e7]"
      }
    >
      <div
        className={`${boxSize} border border-[#e4e4e7] rounded-lg flex items-center justify-center bg-[#ffffff] overflow-hidden shrink-0`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${API_URL}/${src}`}
          alt={name}
          className={`max-h-full max-w-full object-contain ${size === "lg" ? "p-1.5" : "p-1"}`}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
      <div className={size === "lg" ? "flex-1 min-w-0 space-y-2" : "flex-1 min-w-0"}>
        {formulaEntries.length > 0 && (
          <div>
            {size === "lg" && (
              <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Formulas
              </p>
            )}
            <div className="flex flex-wrap gap-1.5">
              {formulaEntries.map(([k, v]) => (
                <span
                  key={k}
                  className="text-[10px] text-zinc-500 bg-[#f4f4f5] border border-[#e4e4e7] px-1.5 py-0.5 rounded font-mono"
                >
                  {k} = {v}
                </span>
              ))}
            </div>
          </div>
        )}
        {(isNFB || hasStirrup) && (
          <div className="flex gap-1.5 mt-1.5">
            {isNFB && (
              <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase bg-amber-500/10 text-amber-600 border border-amber-500/20">
                NFB
              </span>
            )}
            {hasStirrup && (
              <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase bg-blue-500/10 text-blue-600 border border-blue-500/20">
                Stirrup
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
