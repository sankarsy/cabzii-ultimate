"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Car } from "lucide-react";
import MmtCabResults from "./MmtCabResults";
import MmtCabSearchWidget from "./MmtCabSearchWidget";
import CabziiBrowseHeader from "./CabziiBrowseHeader";
import RelatedSeoLinks from "../seo/RelatedSeoLinks";
import { sortBySelectedCity } from "../../lib/locationPriority";
import { todayStr } from "../../lib/mmtTrip";
import { useSelectedCity } from "../../lib/useSelectedCity";
import { extractCabList } from "../../lib/apiClient";

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
      const q = new URLSearchParams({ limit: "24", page: String(page) });
      const res = await fetch(`/api/cabs?${q}`, { cache: "no-store" });
      const json = await res.json();
      setCabs(sortBySelectedCity(extractCabList(json), displayCity));
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
        icon={Car}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Cabs", path: "/cabs" }
        ]}
      >
        <p className="mb-3 text-sm text-slate-600">
          Current rates: Swift Dzire from ₹1,200 · Innova Crysta from ₹2,200 · Tempo Traveller from ₹3,000.{" "}
          <Link href="/tariff" className="font-semibold text-[var(--cabzii-brand)] hover:underline">
            View full cab tariff
          </Link>
        </p>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 sm:rounded-2xl sm:p-3.5">
          <MmtCabSearchWidget defaultCity={displayCity} compact />
        </div>
      </CabziiBrowseHeader>

      {loading ? (
        <div className="py-8 text-center text-sm text-slate-500 sm:py-10">Loading all cabs…</div>
      ) : (
        <div className="bg-[#f4f5f7] py-5">
          <div className="section-shell">
            <MmtCabResults cabs={cabs} trip={defaultTrip} catalogMode displayCity={displayCity} />
          </div>
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
        </div>
      )}

      <div className="section-shell pb-8">
        <RelatedSeoLinks page="cabs" />
        <p className="mt-6 text-center">
          <Link href="/" className="text-sm font-semibold text-[var(--cabzii-brand)]">
            ← Back to home
          </Link>
        </p>
      </div>
    </>
  );
}
