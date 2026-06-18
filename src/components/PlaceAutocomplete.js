"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { coordsForPlaceLabel } from "../lib/indiaCityCoords";
import { localPlaceSuggestions, mergePlaceSuggestions } from "../lib/localPlaceSuggestions";
import { writeServiceArea } from "../lib/locationPriority";
import { inputBaseClass, typo } from "../lib/typography";

/**
 * Address autocomplete via instant local list + /api/places (Nominatim + DB + optional Google).
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
  const [dropdownRect, setDropdownRect] = useState(null);
  const wrapRef = useRef(null);
  const inputWrapRef = useRef(null);
  const dropdownRef = useRef(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useLayoutEffect(() => {
    if (!open || !inputWrapRef.current) {
      setDropdownRect(null);
      return;
    }
    const update = () => {
      const rect = inputWrapRef.current?.getBoundingClientRect();
      if (!rect) return;
      setDropdownRect({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width
      });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, suggestions.length, query]);

  useEffect(() => {
    const onDocPointerDown = (e) => {
      const target = e.target;
      if (wrapRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (!open || trimmed.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const local = localPlaceSuggestions(trimmed, types);
    if (local.length) {
      setSuggestions(local);
      setOpen(true);
    }

    let cancelled = false;
    const requestId = ++requestIdRef.current;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/places?input=${encodeURIComponent(trimmed)}&types=${types}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        if (cancelled || requestId !== requestIdRef.current) return;
        const remote = (data?.predictions ?? []).map((p) =>
          typeof p === "string" ? { label: p, placeId: null } : p
        );
        const merged = mergePlaceSuggestions(local, remote);
        setSuggestions(merged);
        if (merged.length > 0) setOpen(true);
      } catch {
        if (!cancelled && requestId === requestIdRef.current && local.length) {
          setSuggestions(local);
        }
      } finally {
        if (!cancelled && requestId === requestIdRef.current) setLoading(false);
      }
    }, 180);

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

    if (item.lat == null || item.lng == null) {
      const local = coordsForPlaceLabel(labelText);
      if (local) {
        item = { ...item, lat: local.lat, lng: local.lng, city: local.city };
      }
    }

    if (item.lat != null && item.lng != null) {
      const area = {
        label: labelText,
        placeId: item.placeId || null,
        city: item.city,
        lat: item.lat,
        lng: item.lng
      };
      writeServiceArea(area);
      onResolved?.(area);
      return;
    }

    if (!item.placeId) {
      try {
        const res = await fetch(`/api/places/details?label=${encodeURIComponent(labelText)}`);
        const json = await res.json();
        const data = json?.data;
        if (data?.lat != null && data?.lng != null) {
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

  const dropdown =
    open && suggestions.length > 0 && dropdownRect ? (
      <ul
        ref={dropdownRef}
        role="listbox"
        className="fixed z-[9999] max-h-52 overflow-auto rounded-xl border border-slate-200/90 bg-white py-1 shadow-[var(--cabzii-shadow-hover)]"
        style={{
          top: dropdownRect.top,
          left: dropdownRect.left,
          width: dropdownRect.width
        }}
      >
        {suggestions.map((item) => (
          <li key={`${item.placeId || "x"}-${item.label}`} role="option">
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                resolvePlace(item);
              }}
              className="w-full px-3 py-3 text-left text-sm text-slate-700 active:bg-blue-50 sm:py-2 sm:hover:bg-blue-50"
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    ) : null;

  return (
    <div ref={wrapRef} className={`relative z-20 ${className}`}>
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
      <div ref={inputWrapRef} className="relative">
        {LeadingIcon ? (
          <span
            className={`pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 ${leadingIconClassName}`}
            aria-hidden="true"
          >
            <LeadingIcon className="h-[1.0625rem] w-[1.0625rem]" />
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
          className={`${inputClassName || defaultInput}${LeadingIcon ? " pl-11" : ""}`}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="search"
          aria-autocomplete="list"
          aria-expanded={open && suggestions.length > 0}
        />
        {loading && open ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">…</span>
        ) : null}
      </div>
      {typeof document !== "undefined" && dropdown ? createPortal(dropdown, document.body) : null}
    </div>
  );
}
