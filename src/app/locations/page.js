"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import CityAutocomplete from "../../components/CityAutocomplete";
import { extractCityFromLabel } from "../../lib/locationPriority";

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLocations = useCallback(async (cityLabel) => {
    setLoading(true);
    setError("");
    try {
      const cityQ = extractCityFromLabel(cityLabel);
      const url = cityQ
        ? `/api/locations?active=1&city=${encodeURIComponent(cityQ)}`
        : "/api/locations?active=1";
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();

      if (!res.ok || json.success === false) {
        setLocations([]);
        setError(json.message || "Could not load service locations. Please try again.");
        return;
      }

      setLocations(Array.isArray(json?.data) ? json.data : []);
    } catch {
      setLocations([]);
      setError("Network error — could not reach the server. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("cabzii-selected-location") : "";
    if (saved) setSelectedCity(saved.includes(",") ? saved : `${saved}, Tamil Nadu, India`);
    loadLocations(saved || "");
  }, [loadLocations]);

  const handleCityChange = (label) => {
    setSelectedCity(label);
    const name = extractCityFromLabel(label);
    if (name) {
      localStorage.setItem("cabzii-selected-location", name);
      window.dispatchEvent(new CustomEvent("cabzii-city-change", { detail: { city: name } }));
    } else localStorage.removeItem("cabzii-selected-location");
    loadLocations(label);
  };

  const grouped = useMemo(() => {
    const map = new Map();
    locations.forEach((loc) => {
      const key = loc.cityName || "Other";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(loc);
    });
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [locations]);

  const cityLabel = selectedCity ? extractCityFromLabel(selectedCity) : "";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900">Service locations</h1>
          <p className="mt-2 text-sm text-slate-600">
            Search any city in India via Google, then browse pickup and drop points we serve in that area.
          </p>

          <div className="mt-6 max-w-md">
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Select city</label>
            <CityAutocomplete
              value={selectedCity}
              onChange={handleCityChange}
              placeholder="Type city name (Google Places)"
            />
            <p className="mt-2 text-xs text-slate-500">
              {cityLabel ? `Showing locations near ${cityLabel}` : "Choose a city to filter locations"}
              {" · "}
              {locations.length} location(s)
            </p>
          </div>

          {loading ? (
            <p className="mt-8 text-sm text-slate-600">Loading locations…</p>
          ) : error ? (
            <div className="mt-8 rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
              <p className="text-sm font-semibold text-rose-800">{error}</p>
              <button
                type="button"
                onClick={() => loadLocations(selectedCity)}
                className="mt-3 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Retry
              </button>
            </div>
          ) : !grouped.length ? (
            <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <p className="text-sm text-slate-600">
                {cityLabel
                  ? `No pickup points listed for ${cityLabel} yet. Try Bengaluru, Coimbatore, or another served city.`
                  : "Select a city above to see service locations."}
              </p>
              {cityLabel ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCity("");
                    localStorage.removeItem("cabzii-selected-location");
                    loadLocations("");
                  }}
                  className="mt-4 text-sm font-semibold text-[var(--emt-primary)] hover:underline"
                >
                  View all service locations
                </button>
              ) : null}
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {grouped.map(([cityName, locs]) => (
                <article key={cityName} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900">{cityName}</h2>
                  <ul className="mt-3 space-y-2">
                    {locs.map((loc) => (
                      <li key={loc._id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm">
                        <p className="font-semibold text-slate-800">{loc.name}</p>
                        {loc.address ? <p className="text-xs text-slate-500">{loc.address}</p> : null}
                        {loc.pincode ? <p className="text-xs text-slate-400">PIN {loc.pincode}</p> : null}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
