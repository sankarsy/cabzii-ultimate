"use client";

import { Snowflake, BedDouble, Armchair, Wind, Radio, Sun, Sunset, Moon, Sunrise } from "lucide-react";

const TYPE_TILES = [
  { id: "ac", label: "AC", Icon: Snowflake },
  { id: "non-ac", label: "Non AC", Icon: Wind },
  { id: "sleeper", label: "Sleeper", Icon: BedDouble },
  { id: "seater", label: "Seater", Icon: Armchair },
  { id: "track", label: "Bus Track", Icon: Radio }
];

const DEP_SLOTS = [
  { id: "before10", label: "Before 10 AM", Icon: Sunrise },
  { id: "10to5", label: "10 AM - 5 PM", Icon: Sun },
  { id: "5to11", label: "5 PM - 11 PM", Icon: Sunset },
  { id: "after11", label: "After 11 PM", Icon: Moon }
];

export default function EmtBusFilters({ filters, onChange, operators = [], priceMax = 6500 }) {
  const types = filters.busTypes || [];

  function toggleType(id) {
    const set = new Set(types);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    onChange({ ...filters, busTypes: [...set] });
  }

  function clearAll() {
    onChange({ maxPrice: priceMax, minPrice: 300, sort: filters.sort, busTypes: [], operators: [], departureWindow: "", boardingPoint: "" });
  }

  return (
    <aside className="h-fit rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-bold text-slate-900">Filters</p>
        <button type="button" onClick={clearAll} className="text-xs font-semibold text-[#d84e55] hover:underline">
          Clear All
        </button>
      </div>

      <p className="mb-2 text-xs font-bold text-slate-700">Bus Type</p>
      <div className="mb-4 grid grid-cols-3 gap-2">
        {TYPE_TILES.map(({ id, label, Icon }) => {
          const on = types.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggleType(id)}
              className={`flex flex-col items-center gap-1 rounded-lg border px-1 py-2 text-[10px] font-semibold ${
                on ? "border-[#d84e55] bg-rose-50 text-[#d84e55]" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </button>
          );
        })}
      </div>

      <p className="mb-2 text-xs font-bold text-slate-700">Price Range</p>
      <label className="mb-4 block">
        <input
          type="range"
          min={300}
          max={priceMax}
          step={50}
          value={filters.maxPrice || priceMax}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-[#d84e55]"
        />
        <span className="mt-1 flex justify-between text-[11px] text-slate-500">
          <span>₹300</span>
          <span>₹{Number(filters.maxPrice || priceMax).toLocaleString("en-IN")}</span>
        </span>
      </label>

      <p className="mb-2 text-xs font-bold text-slate-700">Departure Time</p>
      <div className="grid grid-cols-2 gap-2">
        {DEP_SLOTS.map(({ id, label, Icon }) => {
          const on = filters.departureWindow === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange({ ...filters, departureWindow: on ? "" : id })}
              className={`flex flex-col items-center gap-1 rounded-lg border px-1 py-2 text-[10px] font-semibold ${
                on ? "border-[#d84e55] bg-rose-50 text-[#d84e55]" : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </button>
          );
        })}
      </div>

      {operators.length ? (
        <div className="mt-4">
          <p className="mb-2 text-xs font-bold text-slate-700">Operators</p>
          <div className="max-h-40 space-y-1 overflow-y-auto">
            {operators.map((op) => {
              const on = (filters.operators || []).includes(op);
              return (
                <label key={op} className="flex cursor-pointer items-center gap-2 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => {
                      const set = new Set(filters.operators || []);
                      if (on) set.delete(op);
                      else set.add(op);
                      onChange({ ...filters, operators: [...set] });
                    }}
                    className="accent-[#d84e55]"
                  />
                  {op}
                </label>
              );
            })}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
