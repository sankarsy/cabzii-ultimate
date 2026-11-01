"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LocateFixed, X } from "./icons/rscIcons";
import { writeServiceArea } from "../lib/locationPriority";
import { inputBaseClass, typo } from "../lib/typography";
import { useHasMounted } from "../lib/useTodayStr";

function newSessionToken() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function geoErrorMessage(err) {
  if (typeof window !== "undefined" && !window.isSecureContext && window.location.hostname !== "localhost") {
    return "Current location needs HTTPS. Search for the address instead.";
  }
  if (!err) return "Could not read your location.";
  if (err.code === 1) return "Location permission denied. Search for the address instead.";
  if (err.code === 2) return "Location unavailable. Search for the address instead.";
  if (err.code === 3) return "Location timed out. Search for the address instead.";
  return err.message || "Could not read your location.";
}

/**
 * Google Places (New) address search. Place ID is resolved to lat/lng before onResolved.
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
  allowCurrentLocation = true,
  biasLat,
  biasLng,
  leadingIcon: LeadingIcon,
  leadingIconClassName = "text-slate-400"
}) {
  const mounted = useHasMounted();
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [accuracyNote, setAccuracyNote] = useState("");
  const [highlight, setHighlight] = useState(-1);
  const [retryNonce, setRetryNonce] = useState(0);
  const [dropdownRect, setDropdownRect] = useState(null);
  const wrapRef = useRef(null);
  const inputWrapRef = useRef(null);
  const dropdownRef = useRef(null);
  const requestIdRef = useRef(0);
  const sessionTokenRef = useRef(newSessionToken());
  const selectedLabelRef = useRef(value || "");

  useEffect(() => {
    setQuery(value || "");
    selectedLabelRef.current = value || "";
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
  }, [open, suggestions.length, query, error, locating]);

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
      return undefined;
    }

    let cancelled = false;
    const requestId = ++requestIdRef.current;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({
          input: trimmed,
          types,
          sessionToken: sessionTokenRef.current
        });
        if (Number.isFinite(Number(biasLat)) && Number.isFinite(Number(biasLng))) {
          params.set("lat", String(biasLat));
          params.set("lng", String(biasLng));
        }
        const res = await fetch(`/api/places?${params}`, { cache: "no-store" });
        const data = await res.json();
        if (cancelled || requestId !== requestIdRef.current) return;
        const remote = Array.isArray(data?.predictions) ? data.predictions : [];
        setSuggestions(remote);
        if (remote.length === 0) {
          setError("No matching places. Try a landmark, street, station, or PIN.");
        }
      } catch {
        if (!cancelled && requestId === requestIdRef.current) {
          setSuggestions([]);
          setError("Could not search places. Check your connection and try again.");
        }
      } finally {
        if (!cancelled && requestId === requestIdRef.current) setLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, open, types, biasLat, biasLng, retryNonce]);

  const applyResolved = (area) => {
    const labelText = area?.label || "";
    selectedLabelRef.current = labelText;
    setQuery(labelText);
    onChange?.(labelText);
    setOpen(false);
    setSuggestions([]);
    setHighlight(-1);
    sessionTokenRef.current = newSessionToken();
    if (area?.lat != null && area?.lng != null) {
      writeServiceArea(area);
    }
    onResolved?.(area);
  };

  const resolvePlace = async (item) => {
    const labelText = item.label || "";
    setQuery(labelText);
    onChange?.(labelText);
    setOpen(false);
    setSuggestions([]);
    setError("");
    setAccuracyNote("");

    if (item.lat != null && item.lng != null) {
      applyResolved({
        label: labelText,
        placeId: item.placeId || null,
        city: item.city,
        lat: item.lat,
        lng: item.lng
      });
      return;
    }

    if (!item.placeId) {
      onResolved?.(null);
      return;
    }

    try {
      const params = new URLSearchParams({
        placeId: item.placeId,
        sessionToken: sessionTokenRef.current
      });
      const res = await fetch(`/api/places/details?${params}`, { cache: "no-store" });
      const json = await res.json();
      const data = json?.data;
      if (!res.ok || data?.lat == null || data?.lng == null) {
        setError(json?.error || "Could not load that place. Try another suggestion.");
        onResolved?.(null);
        return;
      }
      applyResolved({
        label: data.label || labelText,
        placeId: data.placeId || item.placeId,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        lat: data.lat,
        lng: data.lng
      });
    } catch {
      setError("Could not load that place. Try again.");
      onResolved?.(null);
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("This browser cannot share location. Search for the address instead.");
      setOpen(true);
      return;
    }
    if (typeof window !== "undefined" && !window.isSecureContext && window.location.hostname !== "localhost") {
      setError("Current location needs HTTPS. Search for the address instead.");
      setOpen(true);
      return;
    }

    setLocating(true);
    setError("");
    setAccuracyNote("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        try {
          const res = await fetch(`/api/geocode?lat=${encodeURIComponent(latitude)}&lng=${encodeURIComponent(longitude)}`, {
            cache: "no-store"
          });
          const json = await res.json();
          const data = json?.data;
          if (!res.ok || data?.lat == null) {
            setError(json?.error || "Could not turn GPS into an address. Search manually.");
            setLocating(false);
            return;
          }
          const metres = Number(accuracy);
          if (Number.isFinite(metres) && metres > 150) {
            setAccuracyNote(`GPS is about ${Math.round(metres)} m off — confirm or edit the pickup.`);
          }
          applyResolved({
            label: data.label,
            placeId: data.placeId,
            city: data.city,
            state: data.state,
            pincode: data.pincode,
            lat: data.lat,
            lng: data.lng,
            accuracy: metres,
            source: "gps"
          });
        } catch {
          setError("Could not reverse-geocode your location. Search manually.");
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        setError(geoErrorMessage(err));
        setOpen(true);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const clearValue = () => {
    setQuery("");
    selectedLabelRef.current = "";
    onChange?.("");
    onResolved?.(null);
    setSuggestions([]);
    setAccuracyNote("");
    setError("");
    sessionTokenRef.current = newSessionToken();
  };

  const showCurrent = allowCurrentLocation && types !== "cities" && query.trim().length < 2 && !loading;
  const showList = open && (showCurrent || suggestions.length > 0 || loading || error);
  const defaultInput = inputBaseClass;

  const dropdown =
    showList && dropdownRect ? (
      <div
        ref={dropdownRef}
        className="fixed z-[9999] overflow-hidden rounded-xl border border-slate-200/90 bg-white py-1 shadow-[var(--cabzii-shadow-hover)]"
        style={{
          top: dropdownRect.top,
          left: dropdownRect.left,
          width: dropdownRect.width
        }}
      >
        {showCurrent ? (
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              useCurrentLocation();
            }}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-[var(--cabzii-brand)] hover:bg-blue-50"
          >
            <LocateFixed className="h-4 w-4 shrink-0" aria-hidden />
            {locating ? "Finding your location…" : "Use current location"}
          </button>
        ) : null}
        {suggestions.length > 0 ? (
          <ul role="listbox" className="max-h-52 overflow-auto">
            {suggestions.map((item, index) => (
              <li key={`${item.placeId || "x"}-${item.label}`} role="option" aria-selected={highlight === index}>
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    resolvePlace(item);
                  }}
                  className={`w-full px-3 py-2.5 text-left sm:py-2 ${highlight === index ? "bg-blue-50" : "hover:bg-blue-50"}`}
                >
                  <span className="block text-sm font-medium text-slate-800">{item.mainText || item.label}</span>
                  {item.secondaryText ? (
                    <span className="block text-[11px] leading-snug text-slate-500">{item.secondaryText}</span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        {loading ? <p className="px-3 py-2 text-[11px] text-slate-400">Searching places…</p> : null}
        {error && !loading ? (
          <div className="flex items-start justify-between gap-2 px-3 py-2">
            <p className="text-[11px] leading-snug text-rose-600">{error}</p>
            <button
              type="button"
              className="shrink-0 text-[11px] font-semibold text-[var(--cabzii-brand)]"
              onPointerDown={(e) => {
                e.preventDefault();
                setError("");
                setOpen(true);
                setRetryNonce((n) => n + 1);
              }}
            >
              Retry
            </button>
          </div>
        ) : null}
      </div>
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
            const next = e.target.value;
            setQuery(next);
            onChange?.(next);
            if (next.trim() !== String(selectedLabelRef.current || "").trim()) {
              onResolved?.(null);
              setAccuracyNote("");
            }
            setOpen(true);
            setHighlight(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              return;
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setHighlight((i) => Math.min(i + 1, suggestions.length - 1));
              return;
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlight((i) => Math.max(i - 1, 0));
              return;
            }
            if (e.key === "Enter" && highlight >= 0 && suggestions[highlight]) {
              e.preventDefault();
              resolvePlace(suggestions[highlight]);
            }
          }}
          placeholder={placeholder}
          className={`${inputClassName || defaultInput}${LeadingIcon ? " pl-11" : ""} ${query ? " pr-9" : ""}`}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="search"
          aria-autocomplete="list"
          aria-expanded={Boolean(showList)}
          aria-label={label || placeholder || "Location search"}
        />
        {query ? (
          <button
            type="button"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700"
            aria-label="Clear location"
            onClick={clearValue}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : loading && open ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">…</span>
        ) : null}
      </div>
      {accuracyNote ? <p className="mt-1 text-[11px] leading-snug text-amber-700">{accuracyNote}</p> : null}
      {mounted && dropdown ? createPortal(dropdown, document.body) : null}
    </div>
  );
}
