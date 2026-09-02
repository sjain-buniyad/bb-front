"use client";

export interface Crumb {
  label: string;
  onClick?: () => void;
}

/** Small breadcrumb trail; last item is always rendered as current. */
export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <div className="flex items-center gap-2 text-xs text-zinc-400">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="flex items-center gap-2">
            {i > 0 && <span>/</span>}
            <span
              onClick={item.onClick}
              className={
                isLast
                  ? "text-zinc-600 truncate max-w-[200px]"
                  : "hover:text-zinc-700 cursor-pointer transition-colors"
              }
            >
              {item.label}
            </span>
          </span>
        );
      })}
    </div>
  );
}
