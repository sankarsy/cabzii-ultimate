"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MmtDriverResults from "../../../components/mmt/MmtDriverResults";
import MmtDriverTripSummaryBar from "../../../components/mmt/MmtDriverTripSummaryBar";
import TripRoutePanel from "../../../components/maps/TripRoutePanel";
import { parseDriverTripSearchParams, isValidDriverTripSearch } from "../../../lib/driverTrip";
import { useSelectedCity } from "../../../lib/useSelectedCity";
import { extractDriverList } from "../../../lib/apiClient";

function DriverResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trip = parseDriverTripSearchParams(searchParams);
  const { city: selectedCity } = useSelectedCity();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isValidDriverTripSearch(trip)) {
      router.replace("/");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    const q = new URLSearchParams({ limit: "50", page: "1" });
    const city = trip.from?.split(",")[0] || trip.city || selectedCity;
    if (city) q.set("priorityCity", city);
    fetch(`/api/drivers?${q.toString()}`, {
      cache: "no-store"
    })
      .then(async (r) => {
        const json = await r.json();
        if (cancelled) return;
        if (!r.ok || json?.success === false) {
          setError(json.message || "Could not load drivers.");
          setDrivers([]);
          return;
        }
        setDrivers(extractDriverList(json));
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not reach server. Check BACKEND_URL.");
          setDrivers([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams.toString(), selectedCity, trip.from, trip.tripType, router]);

  return (
    <>
      <MmtDriverTripSummaryBar trip={trip} />
      <div className="mx-auto max-w-5xl px-4">
        <TripRoutePanel trip={trip} />
      </div>
      {loading ? (
        <div className="py-16 text-center text-slate-500">Finding best drivers for you…</div>
      ) : error ? (
        <div className="py-16 text-center text-rose-600">{error}</div>
      ) : (
        <MmtDriverResults drivers={drivers} trip={trip} />
      )}
    </>
  );
}

export default function DriverResultsPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-slate-500">Loading…</div>}>
      <DriverResultsContent />
    </Suspense>
  );
}
