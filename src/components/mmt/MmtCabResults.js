"use client";

import { useMemo, useState } from "react";
import MmtCabResultCard from "./MmtCabResultCard";

const SORTS = [
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "title", label: "Name A–Z" }
];

function cabPrice(cab) {
  return Number(cab.price) || 0;
}

export default function MmtCabResults({ cabs, trip }) {
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
      if (sort === "price-asc") return cabPrice(a) - cabPrice(b);
      if (sort === "price-desc") return cabPrice(b) - cabPrice(a);
      return String(a.title).localeCompare(String(b.title));
    });
    return list;
  }, [cabs, sort, typeFilters]);

  function toggleType(type, checked) {
    setTypeFilters((prev) => (checked ? [...prev, type] : prev.filter((t) => t !== type)));
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[260px_1fr]">
      <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 lg:sticky lg:top-20">
        <h2 className="mb-4 text-base font-bold text-slate-900">Filters</h2>
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-semibold text-slate-800">Sort by</h3>
          <div className="flex flex-col gap-2">
            {SORTS.map((s) => (
              <label key={s.id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                <input
                  type="radio"
                  name="sort"
                  checked={sort === s.id}
                  onChange={() => setSort(s.id)}
                  className="accent-[var(--emt-primary)]"
                />
                {s.label}
              </label>
            ))}
          </div>
        </div>
        {types.length > 0 ? (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-800">Cab type</h3>
            <div className="flex flex-col gap-2">
              {types.map((type) => (
                <label key={type} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={typeFilters.includes(type)}
                    onChange={(e) => toggleType(type, e.target.checked)}
                    className="accent-[var(--emt-primary)]"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
        ) : null}
      </aside>
      <div>
        <p className="mb-3 text-sm text-slate-600">
          {filtered.length} {filtered.length === 1 ? "cab" : "cabs"} available
        </p>
        <div className="flex flex-col gap-4">
          {filtered.map((cab) => (
            <MmtCabResultCard key={String(cab._id ?? cab.id)} cab={cab} trip={trip} />
          ))}
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
              No cabs match your search. Try different cities or check back later.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
