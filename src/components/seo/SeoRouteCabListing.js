"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CabResultsModifyBar from "../mmt/CabResultsModifyBar";
import MmtCabResults from "../mmt/MmtCabResults";
import { extractCabList } from "../../lib/apiClient";
import { mergeTripDistance } from "../../lib/mergeTripDistance";
import { useTripRoute } from "../../lib/useTripRoute";

export default function SeoRouteCabListing({ initialTrip = {}, initialCabs = [] }) {
  const { route } = useTripRoute(initialTrip);
  const trip = useMemo(() => mergeTripDistance(initialTrip, route) || initialTrip, [initialTrip, route]);
  const [cabs, setCabs] = useState(initialCabs);
  const [loading, setLoading] = useState(!initialCabs.length);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const q = new URLSearchParams({ limit: "50", page: "1" });
    const city = String(trip?.from || trip?.city || "").split(",")[0];
    if (city) q.set("priorityCity", city);
    if (trip?.date) q.set("date", trip.date);
    if (trip?.time) q.set("time", trip.time);
    if (trip?.packageHours) q.set("packageHours", String(trip.packageHours));
    if (trip?.packageId) q.set("packageId", trip.packageId);
    if (trip?.tripType) q.set("serviceTripType", trip.tripType);
    if (trip?.roundTrip) q.set("roundTrip", "true");

    if (!initialCabs.length) setLoading(true);

    fetch(`/api/cabs?${q}`, { cache: "no-store" })
      .then(async (r) => {
        const json = await r.json();
        if (cancelled) return;
        if (!r.ok || json?.success === false) {
          if (!initialCabs.length) setError(json.message || "Could not load cabs.");
          return;
        }
        const list = extractCabList(json);
        if (list.length) {
          setCabs(list);
          setError("");
        } else if (!initialCabs.length) {
          setCabs([]);
        }
      })
      .catch(() => {
        if (!cancelled && !initialCabs.length) setError("Could not load cabs.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [trip?.from, trip?.to, trip?.date, trip?.time, trip?.tripType, trip?.packageId, trip?.roundTrip, initialCabs.length]);

  const showList = cabs.length > 0;

  return (
    <div id="cabs" className="bg-[#eef1f6] pb-4 lg:pb-8">
      <CabResultsModifyBar initialTrip={trip} />
      <div className="section-shell py-3 lg:py-5">
        {loading && !showList ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            Finding best cabs for you…
          </div>
        ) : error && !showList ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-rose-600">{error}</div>
        ) : showList ? (
          <MmtCabResults cabs={cabs} trip={trip} />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
            No cabs found for this route.
            <div className="mt-3">
              <Link href="/cabs" className="text-sm font-bold text-[#1a73e8] hover:underline">
                Browse all cabs
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
