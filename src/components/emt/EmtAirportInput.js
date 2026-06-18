"use client";

import { useEffect, useRef, useState } from "react";
import { filterAirports } from "../../lib/mock-data/airports";
import { cn } from "../../lib/emt/cn";

export default function EmtAirportInput({
  label,
  value,
  onChange,
  placeholder = "City or airport",
  variant = "default",
  displayCity = "",
  displaySub = ""
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const wrapRef = useRef(null);
  const isCell = variant === "cell";

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

  if (isCell) {
    return (
      <div ref={wrapRef} className="relative">
        <button
          type="button"
          className="cabzii-tap relative z-10 w-full text-left"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
          aria-expanded={open}
        >
          <span className="text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-slate-400">{label}</span>
          <span className="mt-1 block truncate text-lg font-bold leading-tight text-slate-900 sm:text-xl">
            {displayCity || placeholder}
          </span>
          {displaySub ? (
            <span className="mt-1 block truncate text-xs leading-snug text-slate-500">{displaySub}</span>
          ) : null}
        </button>
        {open ? (
          <div className="absolute left-0 right-0 top-full z-[200] mt-2 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                onChange("", e.target.value);
              }}
              placeholder={placeholder}
              className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-[var(--emt-primary)]"
              autoComplete="off"
            />
            <ul className="max-h-48 overflow-auto" role="listbox">
              {options.map((a) => (
                <li key={a.code}>
                  <button
                    type="button"
                    role="option"
                    className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
                    onClick={() => pick(a)}
                  >
                    <span className="font-bold text-[var(--emt-primary)]">{a.code}</span> — {a.city}
                    <span className="block text-xs text-slate-500">{a.airport}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    );
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
