"use client";

import { useMemo, useState } from "react";
import { buildDriverFareSlabs, num } from "../../lib/driverFare";
import { packageYouPay } from "../../lib/cabFare";
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
  const list = num(slab?.originalPrice) || num(slab?.list) || 0;
  const discount = num(slab?.discountPercentage) || num(driver?.discountPercentage);
  return num(slab?.price) > 0 ? num(slab.price) : packageYouPay(list || 1, discount);
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
    <div className="section-shell cabzii-section grid w-full grid-cols-1 gap-5 lg:grid-cols-[260px_1fr] lg:gap-6">
      <aside className="cabzii-filter-panel h-fit lg:sticky lg:top-20">
        <h2 className="mb-4 text-base font-bold text-slate-900">Filters</h2>
        {pkgLabel ? (
          <p className="mb-4 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-[var(--emt-primary)]">
            Package: {pkgLabel}
          </p>
        ) : null}
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-semibold text-slate-800">Sort by</h3>
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
            <h3 className="mb-2 text-sm font-semibold text-slate-800">Driver type</h3>
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
        <p className="mb-3 text-sm text-slate-600">
          {filtered.length} {filtered.length === 1 ? "driver" : "drivers"} available
          {pkgLabel ? ` · ${pkgLabel}` : ""}
        </p>
        <div className="flex flex-col gap-3 sm:gap-4">
          {filtered.map((driver) => (
            <MmtDriverResultCard key={String(driver._id ?? driver.id)} driver={driver} trip={trip} />
          ))}
        </div>
      </div>
    </div>
  );
}
