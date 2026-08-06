"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { UserRound } from "lucide-react";
import MmtDriverResults from "./MmtDriverResults";
import MmtDriverSearchWidget from "./MmtDriverSearchWidget";
import CabziiBrowseHeader from "./CabziiBrowseHeader";
import RelatedSeoLinks from "../seo/RelatedSeoLinks";
import { sortBySelectedCity } from "../../lib/locationPriority";
import { defaultPackageForTrip, todayStr } from "../../lib/driverTrip";
import { useSelectedCity } from "../../lib/useSelectedCity";
import { extractDriverList } from "../../lib/apiClient";

export default function DriversBrowsePage() {
  const { city: selectedCity } = useSelectedCity();
  const displayCity = selectedCity || "Chennai";
  const [drivers, setDrivers] = useState([]);
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
    packageId: defaultPackageForTrip("outstation", false),
    city: displayCity
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ limit: "20", page: String(page) });
      if (displayCity) q.set("priorityCity", displayCity);
      const res = await fetch(`/api/drivers?${q}`, { cache: "no-store" });
      const json = await res.json();
      setDrivers(sortBySelectedCity(extractDriverList(json), displayCity));
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
        title="Search & book drivers"
        subtitle="Outstation · Airport · Hourly · Local"
        icon={UserRound}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Drivers", path: "/drivers" }
        ]}
      >
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 sm:rounded-2xl sm:p-3.5">
          <MmtDriverSearchWidget defaultCity={displayCity} compact />
        </div>
      </CabziiBrowseHeader>

      {loading ? (
        <div className="py-8 text-center text-sm text-slate-500 sm:py-10">Loading all drivers…</div>
      ) : (
        <>
          <MmtDriverResults drivers={drivers} trip={defaultTrip} />
          {meta.totalPages > 1 ? (
            <div className="section-shell flex justify-center gap-3 pb-10">
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

      <div className="section-shell pb-8">
        <RelatedSeoLinks page="drivers" />
        <p className="mt-6 text-center">
          <Link href="/" className="text-sm font-semibold text-[var(--cabzii-brand)]">
            ← Back to home
          </Link>
        </p>
      </div>
    </>
  );
}
