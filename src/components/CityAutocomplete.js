"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Google + database city picker.
 * @param {{ value: string, onChange: (label: string, meta?: { placeId?: string }) => void, placeholder?: string, className?: string, inputClassName?: string }} props
 */
export default function CityAutocomplete({
  value,
  onChange,
  placeholder = "Search city…",
  className = "",
  inputClassName = ""
}) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (!open || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/places?input=${encodeURIComponent(query.trim())}&types=cities`,
          { cache: "no-store" }
        );
        const data = await res.json();
        if (!cancelled) setSuggestions(data?.predictions ?? []);
      } catch {
        if (!cancelled) setSuggestions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 280);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, open]);

  const pick = (label, placeId) => {
    setQuery(label);
    onChange(label, placeId ? { placeId } : undefined);
    setOpen(false);
    setSuggestions([]);
  };

  const defaultInput =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100";

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          if (!e.target.value.trim()) onChange("");
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className={inputClassName || defaultInput}
        autoComplete="off"
        aria-label="Search city"
      />
      {loading && open ? (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">…</span>
      ) : null}
      {open && suggestions.length > 0 ? (
        <ul className="absolute z-40 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {suggestions.map((item) => (
            <li key={item}>
              <button
                type="button"
                onClick={() => pick(item.label, item.placeId)}
                className="flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-slate-50"
              >
                <span className="font-medium text-slate-800">{item.label}</span>
                {item.source === "google" ? (
                  <span className="text-[10px] text-slate-400">Google Places</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
