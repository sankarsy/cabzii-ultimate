"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import MmtCabResults from "../../components/mmt/MmtCabResults";
import MmtCabSearchWidget from "../../components/mmt/MmtCabSearchWidget";
import CabziiBrowseHeader from "../../components/mmt/CabziiBrowseHeader";
import { sortBySelectedCity } from "../../lib/locationPriority";
import { todayStr } from "../../lib/mmtTrip";
import { useSelectedCity } from "../../lib/useSelectedCity";

export default function CabsBrowsePage() {
  const { city: selectedCity } = useSelectedCity();
  const displayCity = selectedCity || "Chennai";
  const [cabs, setCabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalPages: 1 });

  const defaultTrip = {
    tripType: "outstation",
    from: displayCity,
    to: "",
    date: todayStr(),
    time: "09:00",
    roundTrip: false,
    direction: "pickup",
    packageHours: 8,
    city: displayCity
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ limit: "20", page: String(page) });
      if (displayCity) q.set("priorityCity", displayCity);
      const res = await fetch(`/api/cabs?${q}`, { cache: "no-store" });
      const json = await res.json();
      setCabs(sortBySelectedCity(Array.isArray(json?.data) ? json.data : [], displayCity));
      if (json?.meta) setMeta(json.meta);
    } finally {
      setLoading(false);
    }
  }, [page, displayCity]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <CabziiBrowseHeader
        title="Search & book cabs"
        subtitle="Outstation · Airport · Hourly · Local"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Cabs", path: "/cabs" }
        ]}
      >
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <MmtCabSearchWidget defaultCity={displayCity} />
        </div>
      </CabziiBrowseHeader>

      {loading ? (
        <div className="py-16 text-center text-slate-500">Loading all cabs…</div>
      ) : (
        <>
          <MmtCabResults cabs={cabs} trip={defaultTrip} />
          {meta.totalPages > 1 ? (
            <div className="mx-auto flex max-w-5xl justify-center gap-3 px-4 pb-10">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-40"
              >
                Previous
              </button>
              <span className="py-2 text-sm text-slate-600">
                Page {page} of {meta.totalPages}
              </span>
              <button
                type="button"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          ) : null}
        </>
      )}

      <div className="mx-auto max-w-5xl px-4 pb-8 text-center">
        <Link href="/" className="text-sm font-semibold text-[var(--cabzii-brand)]">
          ← Back to home
        </Link>
      </div>
    </>
  );
}
