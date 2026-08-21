"use client";

import { useMemo, useState } from "react";
import { buildDriverFareSlabs, num } from "../../lib/driverFare";
import { driverSlabForTrip, DRIVER_HERO_PACKAGES } from "../../lib/driverTrip";
import MmtDriverResultCard from "./MmtDriverResultCard";
import { CheckboxOption, RadioOption } from "../ui/RadioOption";

const SORTS = [
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "name", label: "Name A–Z" }
];

function driverPrice(driver, trip) {
  const slabs = buildDriverFareSlabs(driver);
  const slab = driverSlabForTrip(slabs, trip);
  return num(slab?.price) > 0 ? num(slab.price) : num(slab?.originalPrice) || num(slab?.list) || 0;
}

export default function MmtDriverResults({ drivers, trip }) {
  const [sort, setSort] = useState("price-asc");
  const [typeFilters, setTypeFilters] = useState([]);

  const types = useMemo(() => {
    const set = new Set(drivers.map((d) => d.type).filter(Boolean));
    return Array.from(set);
  }, [drivers]);

  const filtered = useMemo(() => {
    let list = [...drivers];
    if (typeFilters.length) {
      list = list.filter((d) => typeFilters.includes(d.type));
    }
    list.sort((a, b) => {
      if (sort === "price-asc") {
        return driverPrice(a, trip) - driverPrice(b, trip);
      }
      if (sort === "price-desc") {
        return driverPrice(b, trip) - driverPrice(a, trip);
      }
      return String(a.name).localeCompare(String(b.name));
    });
    return list;
  }, [drivers, sort, typeFilters, trip.packageId]);

  function toggleType(type, checked) {
    setTypeFilters((prev) => (checked ? [...prev, type] : prev.filter((t) => t !== type)));
  }

  const pkgLabel = DRIVER_HERO_PACKAGES.find((p) => p.id === trip.packageId)?.label;

  return (
    <div className="section-shell cabzii-section grid w-full grid-cols-1 gap-2.5 lg:grid-cols-[200px_1fr] lg:gap-4">
      <aside className="cabzii-filter-panel h-fit lg:sticky lg:top-20">
        <h2 className="mb-1.5 text-xs font-bold text-slate-900 sm:mb-2 sm:text-sm">Filters</h2>
        {pkgLabel ? (
          <p className="mb-1.5 rounded-md bg-blue-50 px-2 py-1 text-[10px] font-semibold text-[var(--emt-primary)] sm:mb-2 sm:text-[11px]">
            Package: {pkgLabel}
          </p>
        ) : null}
        <div className="mb-2.5 sm:mb-3">
          <h3 className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[11px]">Sort by</h3>
          <div className="cabzii-radio-group" role="radiogroup" aria-label="Sort drivers">
            {SORTS.map((s) => (
              <RadioOption
                key={s.id}
                name="driver-sort"
                value={s.id}
                checked={sort === s.id}
                onChange={() => setSort(s.id)}
                label={s.label}
              />
            ))}
          </div>
        </div>
        {types.length > 0 ? (
          <div>
            <h3 className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[11px]">Driver type</h3>
            <div className="cabzii-checkbox-group">
              {types.map((type) => (
                <CheckboxOption
                  key={type}
                  checked={typeFilters.includes(type)}
                  onChange={(e) => toggleType(type, e.target.checked)}
                  label={type}
                />
              ))}
            </div>
          </div>
        ) : null}
      </aside>
      <div>
        <p className="mb-1.5 text-[11px] text-slate-600 sm:mb-2 sm:text-xs">
          {filtered.length} {filtered.length === 1 ? "driver" : "drivers"} available
          {pkgLabel ? ` · ${pkgLabel}` : ""}
        </p>
        <div className="flex flex-col gap-2 sm:gap-2.5">
          {filtered.map((driver) => (
            <MmtDriverResultCard key={String(driver._id ?? driver.id)} driver={driver} trip={trip} />
          ))}
        </div>
      </div>
    </div>
  );
}
