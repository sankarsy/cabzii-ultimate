"use client";

import { useEffect, useState } from "react";

export default function PickupPlaceInput({
  value,
  onChange,
  onSelect,
  label = "Pickup location",
  placeholder = "Enter city or pickup point",
  required = true
}) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (!value || value.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`/api/places?input=${encodeURIComponent(value)}`);
        const data = await res.json();
        const list = (data?.predictions ?? []).map((p) => (typeof p === "string" ? p : p.label));
        if (!cancelled) setSuggestions(list);
      } catch {
        if (!cancelled) setSuggestions([]);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [value]);

  return (
    <div className="relative">
      <label className="mb-1 block text-xs font-semibold text-slate-700">
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0056D2]"
        autoComplete="off"
      />
      {suggestions.length > 0 ? (
        <ul className="absolute z-20 mt-1 max-h-40 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 text-sm shadow-lg">
          {suggestions.map((place) => (
            <li key={place}>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-slate-700 hover:bg-sky-50"
                onClick={() => {
                  onChange(place);
                  onSelect?.(place);
                  setSuggestions([]);
                }}
              >
                {place}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
