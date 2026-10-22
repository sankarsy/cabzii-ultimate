"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CityHubMarketplace from "../../../components/city-cabs/CityHubMarketplace";
import { resolveScopedCity } from "../../../lib/cityShowcase";
import { cabResultsHref, isValidTripSearch, parseTripSearchParams } from "../../../lib/mmtTrip";
import { airportInfoForCity } from "../../../lib/seo/airports";

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trip = parseTripSearchParams(searchParams);
  const prettyHref = cabResultsHref(trip);
  const prettyOutstation = prettyHref.startsWith("/") && !prettyHref.startsWith("/cabs/results");

  useEffect(() => {
    if (!isValidTripSearch(trip)) {
      router.replace("/");
      return;
    }
    if (prettyOutstation) router.replace(prettyHref);
  }, [router, trip.from, trip.to, trip.tripType, prettyHref, prettyOutstation]);

  const city = resolveScopedCity(trip.from || trip.city);
  const airport = airportInfoForCity(city.slug);
  const airportLabel = airport?.name ? `${airport.name} taxi` : "";

  if (!isValidTripSearch(trip) || prettyOutstation) {
    return <div className="py-16 text-center text-slate-500">Redirecting…</div>;
  }

  return <CityHubMarketplace city={city} initialTrip={trip} airportLabel={airportLabel} />;
}

export default function CabResultsPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-slate-500">Loading…</div>}>
      <ResultsContent />
    </Suspense>
  );
}
