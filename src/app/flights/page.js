"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import MmtLayout from "../../components/mmt/MmtLayout";
import EmtFlightCard from "../../components/emt/EmtFlightCard";
import EmtFlightFilters from "../../components/emt/EmtFlightFilters";
import { airportByCode } from "../../lib/mock-data/airports";
import { filterFlights, searchMockFlights } from "../../lib/mock-data/flights";

function FlightsContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "DEL";
  const to = searchParams.get("to") || "BOM";
  const date = searchParams.get("date") || "";
  const [filters, setFilters] = useState({ maxPrice: 20000, sort: "cheapest", airlines: [] });
  const [sort, setSort] = useState("cheapest");

  const allFlights = useMemo(() => searchMockFlights({ from, to, date }), [from, to, date]);
  const airlines = useMemo(() => [...new Set(allFlights.map((f) => f.airline.code))], [allFlights]);
  const flights = useMemo(
    () => filterFlights(allFlights, { ...filters, sort }),
    [allFlights, filters, sort]
  );

  const origin = airportByCode(from);
  const dest = airportByCode(to);
  const queryStr = searchParams.toString();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {origin?.city || from} → {dest?.city || to}
        </h1>
        <p className="text-sm text-slate-600">
          {date || "Flexible dates"} · {flights.length} flights found
        </p>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {["cheapest", "fastest", "earliest", "latest"].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSort(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${
              sort === s ? "bg-[var(--emt-primary)] text-white" : "bg-white border border-slate-200 text-slate-700"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <EmtFlightFilters filters={filters} onChange={setFilters} airlines={airlines} />
        <div className="space-y-4">
          {flights.length ? (
            flights.map((f) => <EmtFlightCard key={f.id} flight={f} searchQuery={queryStr} />)
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
              No flights match your filters. Try adjusting price or stops.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FlightsPage() {
  return (
    <MmtLayout>
      <Suspense fallback={<div className="py-16 text-center text-slate-500">Loading flights…</div>}>
        <FlightsContent />
      </Suspense>
    </MmtLayout>
  );
}
