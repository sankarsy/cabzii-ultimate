"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import MmtLayout from "../../../components/mmt/MmtLayout";
import EmtBusCard from "../../../components/emt/EmtBusCard";
import EmtBusFilters from "../../../components/emt/EmtBusFilters";
import EmtBusSearchForm from "../../../components/emt/EmtBusSearchForm";
import { filterBuses } from "../../../lib/busBooking";
import { searchBuses } from "../../../lib/busCatalog";

function BusResultsContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ maxPrice: 2500, sort: "cheapest", busTypes: [], operators: [], departureWindow: "" });
  const [sort, setSort] = useState("cheapest");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    searchBuses({ from, to, date }).then((rows) => {
      if (!cancelled) {
        setTrips(rows);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [from, to, date]);

  const operators = useMemo(() => [...new Set(trips.map((t) => t.operator?.name).filter(Boolean))], [trips]);
  const filtered = useMemo(() => filterBuses(trips, { ...filters, sort }), [trips, filters, sort]);
  const queryStr = searchParams.toString();

  return (
    <div className="section-shell py-6">
      <div className="mb-4">
        <Link href="/buses" className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
          ← Modify search
        </Link>
      </div>

      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {from || "All cities"} → {to || "All destinations"}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {date || "Flexible date"} · {loading ? "Searching…" : `${filtered.length} buses found`}
        </p>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {["cheapest", "earliest", "latest", "fastest"].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSort(s)}
            className={`cabzii-chip ${sort === s ? "cabzii-chip-active" : ""}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <EmtBusFilters filters={filters} onChange={setFilters} operators={operators} />
        <div className="space-y-4">
          {loading ? (
            <div className="cabzii-card p-12 text-center text-slate-500">Loading buses…</div>
          ) : filtered.length ? (
            filtered.map((trip) => <EmtBusCard key={trip.id} trip={trip} searchQuery={queryStr} />)
          ) : (
            <div className="cabzii-card border-dashed p-12 text-center text-slate-500">
              No buses match your search. Try different cities or filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BusResultsPage() {
  return (
    <MmtLayout>
      <Suspense fallback={<div className="section-shell py-16 text-center text-slate-500">Loading…</div>}>
        <BusResultsContent />
      </Suspense>
    </MmtLayout>
  );
}
