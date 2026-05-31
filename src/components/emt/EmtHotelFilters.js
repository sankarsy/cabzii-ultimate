"use client";

export default function EmtHotelFilters({ filters, onChange }) {
  return (
    <aside className="space-y-5 rounded-xl border border-slate-200 bg-white p-4 lg:sticky lg:top-20">
      <h2 className="font-bold text-slate-900">Filters</h2>
      <div>
        <label className="text-xs font-semibold uppercase text-slate-500">Max price / night</label>
        <input
          type="range"
          min={2000}
          max={20000}
          step={500}
          value={filters.maxPrice || 20000}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="mt-2 w-full accent-[var(--emt-primary)]"
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase text-slate-500">Star rating</label>
        <select
          value={filters.stars || ""}
          onChange={(e) => onChange({ ...filters, stars: e.target.value ? Number(e.target.value) : 0 })}
          className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-2 text-sm"
        >
          <option value="">Any</option>
          <option value="3">3+ stars</option>
          <option value="4">4+ stars</option>
          <option value="5">5 stars</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={!!filters.freeCancellation}
          onChange={(e) => onChange({ ...filters, freeCancellation: e.target.checked })}
        />
        Free cancellation only
      </label>
    </aside>
  );
}
