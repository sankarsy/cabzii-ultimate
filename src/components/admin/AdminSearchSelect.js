"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

/**
 * Searchable select: pick from presets or type a custom value.
 * Ideal for city, vendor, vehicle type, fuel, etc.
 */
export default function AdminSearchSelect({
  value = "",
  onChange,
  options = [],
  placeholder = "Search or select…",
  disabled = false,
  allowCustom = true,
  emptyLabel = "No matches — type to add",
  className = ""
}) {
  const listId = useId();
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(String(value || ""));

  useEffect(() => {
    setQuery(String(value || ""));
  }, [value]);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const normalized = useMemo(() => {
    const seen = new Set();
    const out = [];
    for (const raw of options) {
      const label = typeof raw === "string" ? raw : raw?.label || raw?.name || "";
      const val = typeof raw === "string" ? raw : raw?.value || raw?.name || label;
      const key = String(val).trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push({ label: String(label).trim(), value: String(val).trim() });
    }
    return out.sort((a, b) => a.label.localeCompare(b.label));
  }, [options]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return normalized.slice(0, 80);
    return normalized.filter((o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)).slice(0, 80);
  }, [normalized, query]);

  const commit = (next) => {
    const v = String(next || "").trim();
    onChange?.(v);
    setQuery(v);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <input
        type="text"
        disabled={disabled}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-600 disabled:bg-slate-50"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          if (allowCustom) onChange?.(e.target.value);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (filtered[0]) commit(filtered[0].value);
            else if (allowCustom) commit(query);
          }
          if (e.key === "Escape") setOpen(false);
        }}
      />
      {open && !disabled ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1 max-h-52 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-xs text-slate-500">
              {allowCustom && query.trim() ? `Press Enter to use “${query.trim()}”` : emptyLabel}
            </li>
          ) : (
            filtered.map((o) => (
              <li key={o.value}>
                <button
                  type="button"
                  role="option"
                  className={`flex w-full px-3 py-2 text-left text-sm hover:bg-sky-50 ${
                    o.value === value ? "bg-sky-50 font-semibold text-sky-900" : "text-slate-800"
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => commit(o.value)}
                >
                  {o.label}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
