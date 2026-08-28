"use client";

import { useMemo, useState } from "react";
import { Car, Snowflake, Users } from "lucide-react";
import { buildFareSlabs, formatRating } from "../../lib/cabFare";
import { resolveCabTripFare } from "../../lib/distanceFare";
import { cabSlabForTrip } from "../../lib/mmtTrip";
import MmtCabResultCard from "./MmtCabResultCard";
import { formatInr } from "../../lib/formatInr";

const SORTS = [
  { id: "price-asc", label: "Price" },
  { id: "ratings", label: "Ratings" },
  { id: "title", label: "Name" }
];

const TYPE_ICONS = {
  hatchback: Car,
  sedan: Car,
  suv: Users,
  innova: Users,
  tempo: Users,
  van: Users,
  ac: Snowflake
};

function cabTripPrice(cab, trip) {
  const slabs = buildFareSlabs(cab);
  const slab = cabSlabForTrip(slabs, trip);
  const fare = resolveCabTripFare(cab, slab, trip);
  return fare.total > 0 ? fare.total : Number(cab.price) || 0;
}

function cabHasAc(cab) {
  const features = Array.isArray(cab.features) ? cab.features : [];
  return features.some((f) => /^(ac|a\/c|air\s*condition)/i.test(String(f).trim())) || /ac/i.test(String(cab.type || ""));
}

export default function MmtCabResults({ cabs, trip, embedded = false, catalogMode = false, displayCity = "" }) {
  const [sort, setSort] = useState("price-asc");
  const [typeFilters, setTypeFilters] = useState([]);
  const [acOnly, setAcOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(0);

  const types = useMemo(() => {
    const set = new Set(cabs.map((c) => c.type).filter(Boolean));
    return Array.from(set);
  }, [cabs]);

  const priceMax = useMemo(() => {
    const max = Math.max(500, ...cabs.map((c) => cabTripPrice(c, trip)));
    return Math.max(2500, Math.ceil(max / 100) * 100);
  }, [cabs, trip]);

  const priceCap = maxPrice > 0 ? maxPrice : priceMax;

  const filtered = useMemo(() => {
    let list = [...cabs];
    if (typeFilters.length) {
      list = list.filter((c) => typeFilters.includes(c.type));
    }
    if (acOnly) {
      list = list.filter(cabHasAc);
    }
    list = list.filter((c) => cabTripPrice(c, trip) <= priceCap);
    list.sort((a, b) => {
      if (sort === "price-asc") return cabTripPrice(a, trip) - cabTripPrice(b, trip);
      if (sort === "ratings") {
        const ra = Number(formatRating(a) || a.rating || 0);
        const rb = Number(formatRating(b) || b.rating || 0);
        return rb - ra;
      }
      return String(a.title || a.vehicleName || "").localeCompare(String(b.title || b.vehicleName || ""));
    });
    return list;
  }, [cabs, sort, typeFilters, acOnly, priceCap, trip]);

  function toggleType(type) {
    setTypeFilters((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  }

  function clearAll() {
    setTypeFilters([]);
    setAcOnly(false);
    setMaxPrice(priceMax);
    setSort("price-asc");
  }

  const kmHint = trip?.distanceKm > 0 ? `${Math.ceil(Number(trip.distanceKm))} km route` : null;

  const filterAside = (
    <aside className="h-fit rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-bold text-slate-900">Filters</p>
        <button type="button" onClick={clearAll} className="text-xs font-semibold text-[#d84e55] hover:underline">
          Clear All
        </button>
      </div>

      {kmHint ? (
        <p className="mb-3 rounded-md bg-sky-50 px-2 py-1.5 text-[11px] font-semibold text-sky-800">Fares for {kmHint}</p>
      ) : null}

      <p className="mb-2 text-xs font-bold text-slate-700">Cab Type</p>
      <div className="mb-4 grid grid-cols-3 gap-2">
        {types.map((type) => {
          const on = typeFilters.includes(type);
          const Icon = TYPE_ICONS[String(type).toLowerCase()] || Car;
          return (
            <button
              key={type}
              type="button"
              onClick={() => toggleType(type)}
              className={`flex flex-col items-center gap-1 rounded-lg border px-1 py-2 text-[10px] font-semibold ${
                on ? "border-[#d84e55] bg-rose-50 text-[#d84e55]" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {type}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setAcOnly((v) => !v)}
          className={`flex flex-col items-center gap-1 rounded-lg border px-1 py-2 text-[10px] font-semibold ${
            acOnly ? "border-[#d84e55] bg-rose-50 text-[#d84e55]" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
          }`}
        >
          <Snowflake className="h-4 w-4" aria-hidden />
          AC
        </button>
      </div>

      <p className="mb-2 text-xs font-bold text-slate-700">Price Range</p>
      <label className="mb-1 block">
        <input
          type="range"
          min={300}
          max={priceMax}
          step={50}
          value={priceCap}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#d84e55]"
        />
        <span className="mt-1 flex justify-between text-[11px] text-slate-500">
          <span>₹300</span>
          <span>₹{formatInr(priceCap)}</span>
        </span>
      </label>
    </aside>
  );

  const list = (
    <div className="min-w-0 space-y-3">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">
        {SORTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSort(s.id)}
            className={`rounded-full px-3 py-1.5 font-semibold ${sort === s.id ? "bg-[#d84e55] text-white" : "text-slate-600 hover:bg-slate-50"}`}
          >
            {s.label}
          </button>
        ))}
        <span className="ml-auto text-slate-500">
          Showing {filtered.length} {filtered.length === 1 ? "cab" : "cabs"}
          {kmHint ? ` · ${kmHint}` : ""}
        </span>
      </div>

      {filtered.length ? (
        catalogMode ? (
          <div className="cabzii-catalog-grid pt-1">
            {filtered.map((cab) => (
              <div className="cabzii-catalog-item" key={String(cab._id ?? cab.id)}>
                <MmtCabResultCard
                  cab={cab}
                  trip={trip}
                  layout="card"
                  catalogMode
                  displayCity={displayCity}
                />
              </div>
            ))}
          </div>
        ) : (
          filtered.map((cab) => (
            <MmtCabResultCard
              key={String(cab._id ?? cab.id)}
              cab={cab}
              trip={trip}
              catalogMode={catalogMode}
              displayCity={displayCity}
            />
          ))
        )
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
          No cabs match your filters. Try clearing filters or changing the route.
        </div>
      )}
    </div>
  );

  if (embedded) {
    return (
      <div className="w-full space-y-3">
        {list}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
      {filterAside}
      {list}
    </div>
  );
}
