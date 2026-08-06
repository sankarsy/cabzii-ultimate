"use client";

import { useMemo, useState } from "react";
import { buildFareSlabs } from "../../lib/cabFare";
import { resolveCabTripFare } from "../../lib/distanceFare";
import { cabSlabForTrip } from "../../lib/mmtTrip";
import MmtCabResultCard from "./MmtCabResultCard";
import { CheckboxOption, RadioOption } from "../ui/RadioOption";

const SORTS = [
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "title", label: "Name A–Z" }
];

function cabTripPrice(cab, trip) {
  const slabs = buildFareSlabs(cab);
  const slab = cabSlabForTrip(slabs, trip);
  const fare = resolveCabTripFare(cab, slab, trip);
  return fare.total > 0 ? fare.total : Number(cab.price) || 0;
}

export default function MmtCabResults({ cabs, trip, embedded = false, catalogMode = false, displayCity = "" }) {
  const [sort, setSort] = useState("price-asc");
  const [typeFilters, setTypeFilters] = useState([]);

  const types = useMemo(() => {
    const set = new Set(cabs.map((c) => c.type).filter(Boolean));
    return Array.from(set);
  }, [cabs]);

  const filtered = useMemo(() => {
    let list = [...cabs];
    if (typeFilters.length) {
      list = list.filter((c) => typeFilters.includes(c.type));
    }
    list.sort((a, b) => {
      if (sort === "price-asc") return cabTripPrice(a, trip) - cabTripPrice(b, trip);
      if (sort === "price-desc") return cabTripPrice(b, trip) - cabTripPrice(a, trip);
      return String(a.title || a.vehicleName || "").localeCompare(String(b.title || b.vehicleName || ""));
    });
    return list;
  }, [cabs, sort, typeFilters, trip]);

  function toggleType(type, checked) {
    setTypeFilters((prev) => (checked ? [...prev, type] : prev.filter((t) => t !== type)));
  }

  const kmHint = trip?.distanceKm > 0 ? `${Math.ceil(Number(trip.distanceKm))} km route` : null;
  const sortName = embedded ? "seo-sort" : "sort";

  return (
    <div
      className={`${embedded ? "w-full" : "section-shell cabzii-section"} grid grid-cols-1 gap-2.5 ${
        embedded ? "lg:gap-3" : "gap-2.5 lg:grid-cols-[200px_1fr] lg:gap-4"
      }`}
    >
      <aside
        className={`cabzii-filter-panel h-fit ${
          embedded
            ? "p-2 sm:p-2.5"
            : "lg:sticky lg:top-20"
        }`}
      >
        <h2 className={`font-bold text-slate-900 ${embedded ? "mb-1.5 text-[11px]" : "mb-1.5 text-xs sm:mb-2 sm:text-sm"}`}>
          Filters
        </h2>
        {kmHint ? (
          <p className="mb-1.5 rounded-md bg-sky-50 px-2 py-1 text-[10px] font-semibold text-sky-800 sm:mb-2 sm:text-[11px]">
            Fares for {kmHint} · per km × distance
          </p>
        ) : null}
        <div className={embedded ? "mb-2" : "mb-2.5 sm:mb-3"}>
          <h3 className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[11px]">Sort by</h3>
          <div
            className={embedded ? "flex flex-wrap gap-1.5" : "cabzii-radio-group"}
            role="radiogroup"
            aria-label="Sort cabs"
          >
            {SORTS.map((s) =>
              embedded ? (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={sort === s.id}
                  onClick={() => setSort(s.id)}
                  className={`cabzii-tap rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
                    sort === s.id
                      ? "border-[var(--cabzii-brand)] bg-[var(--cabzii-brand)] text-white"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {s.label}
                </button>
              ) : (
                <RadioOption
                  key={s.id}
                  name={sortName}
                  value={s.id}
                  checked={sort === s.id}
                  onChange={() => setSort(s.id)}
                  label={s.label}
                />
              )
            )}
          </div>
        </div>
        {types.length > 0 ? (
          <div>
            <h3 className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[11px]">Vehicle type</h3>
            <div className={embedded ? "flex flex-wrap gap-1.5" : "cabzii-checkbox-group"}>
              {types.map((type) =>
                embedded ? (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={typeFilters.includes(type)}
                    onClick={() => toggleType(type, !typeFilters.includes(type))}
                    className={`cabzii-tap rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
                      typeFilters.includes(type)
                        ? "border-[var(--cabzii-brand)] bg-sky-50 text-[var(--cabzii-brand)]"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    {type}
                  </button>
                ) : (
                  <CheckboxOption
                    key={type}
                    checked={typeFilters.includes(type)}
                    onChange={(e) => toggleType(type, e.target.checked)}
                    label={type}
                  />
                )
              )}
            </div>
          </div>
        ) : null}
      </aside>
      <div className="min-w-0">
        <p className="mb-1.5 text-[11px] text-slate-600 sm:mb-2 sm:text-xs">
          {filtered.length} {filtered.length === 1 ? "cab" : "cabs"} available
          {kmHint ? ` · ${kmHint}` : ""}
        </p>
        <div className="flex flex-col gap-2 sm:gap-2.5">
          {filtered.map((cab) => (
            <MmtCabResultCard
              key={String(cab._id ?? cab.id)}
              cab={cab}
              trip={trip}
              catalogMode={catalogMode}
              displayCity={displayCity}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
