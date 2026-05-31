"use client";

import { useEffect, useRef, useState } from "react";
import { filterAirports } from "../../lib/mock-data/airports";
import { cn } from "../../lib/emt/cn";

export default function EmtAirportInput({ label, value, onChange, placeholder = "City or airport" }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const wrapRef = useRef(null);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    function onDoc(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const options = filterAirports(query);

  function pick(a) {
    const display = `${a.city} (${a.code})`;
    setQuery(display);
    onChange(a.code, display);
    setOpen(false);
  }

  return (
    <div ref={wrapRef} className="relative flex flex-col gap-1">
      <label className="emt-search-label">{label}</label>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          onChange("", e.target.value);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-[var(--emt-primary)] focus:ring-2 focus:ring-[var(--emt-primary)]/20"
        autoComplete="off"
      />
      {open && options.length ? (
        <ul
          className="absolute left-0 right-0 top-full z-30 mt-1 max-h-48 overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
          role="listbox"
        >
          {options.map((a) => (
            <li key={a.code}>
              <button
                type="button"
                role="option"
                className={cn("w-full px-3 py-2 text-left text-sm hover:bg-slate-50")}
                onClick={() => pick(a)}
              >
                <span className="font-bold text-[var(--emt-primary)]">{a.code}</span> — {a.city}
                <span className="block text-xs text-slate-500">{a.airport}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
