"use client";

import { cn } from "../../lib/emt/cn";

export default function EmtHeroPills({ options, value, onChange, className = "" }) {
  return (
    <div className={`emt-hero-pills flex flex-wrap gap-2 ${className}`} role="tablist">
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.id)}
            className={cn("emt-hero-pill cabzii-tap", active && "emt-hero-pill-active")}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function EmtHeroPriceHint({ className = "", children = "Search Lowest Price" }) {
  return (
    <p className={`emt-hero-price-hint hidden sm:block ${className}`}>
      {children}
    </p>
  );
}
