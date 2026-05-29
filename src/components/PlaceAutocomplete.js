"use client";

import { useEffect, useRef, useState } from "react";
import { writeServiceArea } from "../lib/locationPriority";
import { inputBaseClass, typo } from "../lib/typography";

/**
 * Google Places address autocomplete with pincode + city resolution.
 */
export default function PlaceAutocomplete({
  label,
  labelDesktop,
  placeholder,
  value,
  onChange,
  onResolved,
  className = "",
  inputClassName = "",
  types = "address",
  leadingIcon: LeadingIcon,
  leadingIconClassName = "text-slate-400"
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
    const onDocPointerDown = (e) => {
      if (wrapRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
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
          `/api/places?input=${encodeURIComponent(query.trim())}&types=${types}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        const list = (data?.predictions ?? []).map((p) =>
          typeof p === "string" ? { label: p, placeId: null } : p
        );
        if (!cancelled) setSuggestions(list);
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
  }, [query, open, types]);

  const resolvePlace = async (item) => {
    const labelText = item.label || item;
    setQuery(labelText);
    onChange?.(labelText);
    setOpen(false);
    setSuggestions([]);

    if (!item.placeId) {
      onResolved?.({ label: labelText });
      return;
    }

    try {
      const res = await fetch(`/api/places/details?placeId=${encodeURIComponent(item.placeId)}`);
      const json = await res.json();
      const data = json?.data;
      if (data) {
        const area = {
          label: data.label || labelText,
          placeId: data.placeId,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          lat: data.lat,
          lng: data.lng
        };
        writeServiceArea(area);
        onResolved?.(area);
        return;
      }
    } catch {
      /* fallback */
    }
    onResolved?.({ label: labelText, placeId: item.placeId });
  };

  const defaultInput = inputBaseClass;

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {label ? (
        <label className={`mb-1.5 block ${typo.label}`}>
          {labelDesktop ? (
            <>
              <span className="sm:hidden">{label}</span>
              <span className="hidden sm:inline">{labelDesktop}</span>
            </>
          ) : (
            label
          )}
        </label>
      ) : null}
      <div className="relative">
        {LeadingIcon ? (
          <span
            className={`pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 ${leadingIconClassName}`}
            aria-hidden="true"
          >
            <LeadingIcon className="h-4 w-4" />
          </span>
        ) : null}
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange?.(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder={placeholder}
          className={`${inputClassName || defaultInput}${LeadingIcon ? " pl-10" : ""}`}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="search"
        />
        {loading && open ? (
          <span className={`absolute text-[10px] text-slate-400 ${LeadingIcon ? "right-3 top-1/2 -translate-y-1/2" : "right-3 top-1/2 -translate-y-1/2"}`}>
            …
          </span>
        ) : null}
      </div>
      {open && suggestions.length > 0 ? (
        <ul className="absolute left-0 right-0 z-[100] mt-1 max-h-52 overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
          {suggestions.map((item) => (
            <li key={item.placeId || item.label}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => resolvePlace(item)}
                className="w-full px-3 py-3 text-left text-sm text-slate-700 active:bg-blue-50 sm:py-2 sm:hover:bg-blue-50"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
