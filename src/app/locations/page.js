"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import CityAutocomplete from "../../components/CityAutocomplete";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

function cityQueryFromLabel(label) {
  if (!label) return "";
  return label.split(",")[0].trim();
}

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(true);

  const loadLocations = useCallback(async (cityLabel) => {
    setLoading(true);
    try {
      const cityQ = cityQueryFromLabel(cityLabel);
      const url = cityQ
        ? `/api/locations?active=1&city=${encodeURIComponent(cityQ)}`
        : "/api/locations?active=1";
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      setLocations(Array.isArray(json?.data) ? json.data : []);
    } catch {
      setLocations([]);
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
    const name = cityQueryFromLabel(label);
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

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-sky-50/60 to-violet-50/40">
      <Navbar />
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
              {selectedCity
                ? `Showing locations near ${cityQueryFromLabel(selectedCity)}`
                : "Choose a city to filter locations"}
              {" · "}
              {locations.length} location(s)
            </p>
          </div>

          {loading ? (
            <p className="mt-8 text-sm text-slate-600">Loading locations…</p>
          ) : !grouped.length ? (
            <p className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
              {selectedCity
                ? `No saved locations for ${cityQueryFromLabel(selectedCity)} yet. Try another city or ask admin to add points.`
                : "Select a city above to see service locations."}
            </p>
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
      <Footer />
    </main>
  );
}
