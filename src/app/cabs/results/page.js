"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MmtCabResults from "../../../components/mmt/MmtCabResults";
import MmtTripSummaryBar from "../../../components/mmt/MmtTripSummaryBar";
import TripRoutePanel from "../../../components/maps/TripRoutePanel";
import { parseTripSearchParams, isValidTripSearch } from "../../../lib/mmtTrip";
import { useSelectedCity } from "../../../lib/useSelectedCity";
import { extractCabList } from "../../../lib/apiClient";

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trip = parseTripSearchParams(searchParams);
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

    fetch(`/api/cabs?${q}`, { cache: "no-store" })
      .then(async (r) => {
        const json = await r.json();
        if (cancelled) return;
        if (!r.ok || json?.success === false) {
          setError(json.message || "Could not load cabs.");
          setCabs([]);
          return;
        }
        setCabs(extractCabList(json));
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
    <>
      <MmtTripSummaryBar trip={trip} />
      <div className="mx-auto max-w-5xl px-4">
        <TripRoutePanel trip={trip} />
      </div>
      {loading ? (
        <div className="py-16 text-center text-slate-500">Finding best cabs for you…</div>
      ) : error ? (
        <div className="py-16 text-center text-rose-600">{error}</div>
      ) : (
        <MmtCabResults cabs={cabs} trip={trip} />
      )}
    </>
  );
}

export default function CabResultsPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-slate-500">Loading…</div>}>
      <ResultsContent />
    </Suspense>
  );
}
