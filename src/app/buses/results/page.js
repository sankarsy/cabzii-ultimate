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

const SORTS = [
  { id: "cheapest", label: "Price" },
  { id: "seats", label: "Seats" },
  { id: "ratings", label: "Ratings" },
  { id: "arrival", label: "Arrival Time" },
  { id: "departure", label: "Departure Time" }
];

function BusResultsContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "Chennai";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ maxPrice: 6500, minPrice: 300, sort: "cheapest", busTypes: [], operators: [], departureWindow: "", boardingPoint: "" });
  const [sort, setSort] = useState("cheapest");
  const [chipTab, setChipTab] = useState("boarding");

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
  const boardingChips = useMemo(() => {
    const counts = {};
    trips.forEach((t) => {
      (t.boardingPoints || []).forEach((p) => {
        const name = (p.name || "").split(/,|\|/)[0].trim();
        if (name) counts[name] = (counts[name] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name]) => name);
  }, [trips]);
  const priceMax = useMemo(() => {
    const max = Math.max(300, ...trips.map((t) => t.fares?.seater || 0), ...trips.map((t) => t.fares?.sleeper || 0));
    return Math.max(2500, Math.ceil(max / 100) * 100);
  }, [trips]);
  const filtered = useMemo(() => filterBuses(trips, { ...filters, sort }), [trips, filters, sort]);
  const queryStr = searchParams.toString();

  return (
    <div className="bg-[#f4f5f7] pb-10">
      <div className="border-b border-slate-200 bg-white py-3 shadow-sm">
        <div className="section-shell">
          <EmtBusSearchForm compact initialFrom={from} initialTo={to} initialDate={date} />
        </div>
      </div>

      <div className="section-shell py-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
          <EmtBusFilters filters={filters} onChange={setFilters} operators={operators} priceMax={priceMax} />
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
                Showing {loading ? "…" : filtered.length} Buses on this route
              </span>
            </div>

            {boardingChips.length || operators.length ? (
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="mb-2 flex gap-3 text-xs font-bold">
                  <button type="button" onClick={() => setChipTab("boarding")} className={chipTab === "boarding" ? "text-[#d84e55] underline" : "text-slate-600"}>
                    Boarding Points
                  </button>
                  <button type="button" onClick={() => setChipTab("operators")} className={chipTab === "operators" ? "text-[#d84e55] underline" : "text-slate-600"}>
                    Operators
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(chipTab === "boarding" ? boardingChips : operators).map((name, i) => {
                    const active = chipTab === "boarding" ? filters.boardingPoint === name : (filters.operators || []).includes(name);
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => {
                          if (chipTab === "boarding") {
                            setFilters({ ...filters, boardingPoint: active ? "" : name });
                          } else {
                            const set = new Set(filters.operators || []);
                            if (active) set.delete(name);
                            else set.add(name);
                            setFilters({ ...filters, operators: [...set] });
                          }
                        }}
                        className={`relative rounded-full border px-3 py-1 text-[11px] font-semibold ${
                          active ? "border-[#d84e55] bg-rose-50 text-[#d84e55]" : "border-slate-200 bg-white text-slate-700"
                        }`}
                      >
                        {i === 0 && chipTab === "boarding" ? (
                          <span className="absolute -top-2 left-2 rounded bg-amber-300 px-1 text-[8px] font-extrabold text-slate-800">Popular</span>
                        ) : null}
                        {name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {loading ? (
              <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">Loading buses…</div>
            ) : filtered.length ? (
              filtered.map((trip) => <EmtBusCard key={trip.id} trip={trip} searchQuery={queryStr} />)
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
                No buses match your search. Try Chennai to Bengaluru, Madurai or Tirupati.
                <div className="mt-3">
                  <Link href="/buses" className="text-sm font-bold text-[#d84e55] hover:underline">
                    Modify search
                  </Link>
                </div>
              </div>
            )}
          </div>
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
