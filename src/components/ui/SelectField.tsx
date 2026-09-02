"use client";

import { ChevronDownIcon } from "./icons";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  className?: string;
}

/** Dark-styled select with a chevron affordance. */
export default function SelectField({
  value,
  onChange,
  options,
  placeholder,
  className = "input-field appearance-none cursor-pointer pr-9",
}: SelectFieldProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
        <ChevronDownIcon />
      </div>
    </div>
  );
}
