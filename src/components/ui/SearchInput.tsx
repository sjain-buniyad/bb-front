"use client";

import { SearchIcon } from "./icons";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  focusClassName?: string;
  className?: string;
}

/** Text input with a leading magnifier icon, used for list filtering. */
export default function SearchInput({
  value,
  onChange,
  placeholder,
  focusClassName = "focus:border-accent/40 focus:ring-1 focus:ring-accent/20",
  className = "",
}: SearchInputProps) {
  return (
    <div className={`relative flex-1 sm:max-w-xs ${className}`}>
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full py-2 pl-9 pr-4 rounded-lg text-sm bg-[#ffffff] border border-[#e4e4e7] text-zinc-900 placeholder:text-zinc-400 outline-none transition-all ${focusClassName}`}
      />
    </div>
  );
}
