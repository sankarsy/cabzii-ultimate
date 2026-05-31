"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import MmtLayout from "../../components/mmt/MmtLayout";
import EmtHotelCard from "../../components/emt/EmtHotelCard";
import EmtHotelFilters from "../../components/emt/EmtHotelFilters";
import { filterHotels, searchMockHotels } from "../../lib/mock-data/hotels";

function HotelsContent() {
  const searchParams = useSearchParams();
  const city = searchParams.get("city") || "";
  const [filters, setFilters] = useState({ maxPrice: 20000, stars: 0, freeCancellation: false });

  const all = useMemo(() => searchMockHotels({ city }), [city]);
  const hotels = useMemo(() => filterHotels(all, filters), [all, filters]);
  const queryStr = searchParams.toString();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Hotels in {city || "India"}</h1>
        <p className="text-sm text-slate-600">{hotels.length} properties</p>
      </header>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <EmtHotelFilters filters={filters} onChange={setFilters} />
        <div className="space-y-4">
          {hotels.length ? (
            hotels.map((h) => <EmtHotelCard key={h.id} hotel={h} searchQuery={queryStr} />)
          ) : (
            <div className="rounded-xl border border-dashed p-12 text-center text-slate-500">No hotels found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HotelsPage() {
  return (
    <MmtLayout>
      <Suspense fallback={<div className="py-16 text-center">Loading hotels…</div>}>
        <HotelsContent />
      </Suspense>
    </MmtLayout>
  );
}
