"use client";

export default function EmtFlightFilters({ filters, onChange, airlines }) {
  return (
    <aside className="space-y-6 rounded-xl border border-slate-200 bg-white p-4 lg:sticky lg:top-20">
      <h2 className="font-bold text-slate-900">Filters</h2>

      <div>
        <label className="text-xs font-semibold uppercase text-slate-500">Max price (₹)</label>
        <input
          type="range"
          min={3000}
          max={20000}
          step={500}
          value={filters.maxPrice || 20000}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="mt-2 w-full accent-[var(--emt-primary)]"
        />
        <p className="text-xs text-slate-600">Up to ₹{(filters.maxPrice || 20000).toLocaleString("en-IN")}</p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase text-slate-500">Stops</p>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!filters.nonStop}
            onChange={(e) => onChange({ ...filters, nonStop: e.target.checked, oneStop: false })}
          />
          Non-stop
        </label>
        <label className="mt-1 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!filters.oneStop}
            onChange={(e) => onChange({ ...filters, oneStop: e.target.checked, nonStop: false })}
          />
          1 Stop
        </label>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase text-slate-500">Airlines</p>
        <div className="mt-2 space-y-1">
          {airlines.map((code) => (
            <label key={code} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.airlines?.includes(code) ?? false}
                onChange={(e) => {
                  const set = new Set(filters.airlines || []);
                  if (e.target.checked) set.add(code);
                  else set.delete(code);
                  onChange({ ...filters, airlines: [...set] });
                }}
              />
              {code}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
