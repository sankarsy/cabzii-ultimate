"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import CabResultsModifyBar from "../../../components/mmt/CabResultsModifyBar";
import MmtCabResults from "../../../components/mmt/MmtCabResults";
import { mergeTripDistance } from "../../../lib/mergeTripDistance";
import { parseTripSearchParams, isValidTripSearch } from "../../../lib/mmtTrip";
import { useSelectedCity } from "../../../lib/useSelectedCity";
import { useTripRoute } from "../../../lib/useTripRoute";
import { extractCabList } from "../../../lib/apiClient";
import { trackEvent } from "../../../lib/analytics";

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trip = parseTripSearchParams(searchParams);
  const { route } = useTripRoute(trip);
  const tripWithDistance = useMemo(() => mergeTripDistance(trip, route), [trip, route]);
  const { city: selectedCity } = useSelectedCity();
  const [cabs, setCabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isValidTripSearch(trip)) {
      router.replace("/");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    const q = new URLSearchParams({ limit: "50", page: "1" });
    const city = trip.from?.split(",")[0] || trip.city || selectedCity;
    if (city) q.set("priorityCity", city);
    if (trip.date) q.set("date", trip.date);
    if (trip.time) q.set("time", trip.time);
    if (trip.packageHours) q.set("packageHours", String(trip.packageHours));
    if (trip.packageId) q.set("packageId", trip.packageId);
    if (trip.tripType) q.set("serviceTripType", trip.tripType);
    if (trip.roundTrip) q.set("roundTrip", "true");

    fetch(`/api/cabs?${q}`, { cache: "no-store" })
      .then(async (r) => {
        const json = await r.json();
        if (cancelled) return;
        if (!r.ok || json?.success === false) {
          setError(json.message || "Could not load cabs.");
          setCabs([]);
          return;
        }
        const list = extractCabList(json);
        setCabs(list);
        trackEvent("search_results_viewed", {
          service_type: "cab",
          city,
          route: [trip.from, trip.to].filter(Boolean).join(" → "),
          result_count: list.length
        });
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not reach server. Check BACKEND_URL.");
          setCabs([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams.toString(), selectedCity, trip.from, trip.to, trip.tripType, router]);

  return (
    <div className="bg-[#eef1f6] pb-4 lg:pb-10">
      <CabResultsModifyBar initialTrip={tripWithDistance} />

      <div className="section-shell py-3 lg:py-5">
        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            Finding best cabs for you…
          </div>
        ) : error ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-rose-600">{error}</div>
        ) : cabs.length ? (
          <MmtCabResults cabs={cabs} trip={tripWithDistance} />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
            No cabs found for this route.
            <div className="mt-3">
              <Link href="/cabs" className="text-sm font-bold text-[#1a73e8] hover:underline">
                Modify search
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CabResultsPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-slate-500">Loading…</div>}>
      <ResultsContent />
    </Suspense>
  );
}
