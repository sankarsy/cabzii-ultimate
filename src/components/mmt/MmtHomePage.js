"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import EmtHeroSearch from "../emt/EmtHeroSearch";
import MmtLayout from "./MmtLayout";
import { HeroSearchProvider, useHeroSearch } from "../emt/HeroSearchContext";
import HeroTabUrlSync from "../emt/HeroTabUrlSync";
import { useSelectedCity } from "../../lib/useSelectedCity";
import { isValidDriverTripSearch, parseDriverTripSearchParams } from "../../lib/driverTrip";
import { isValidTripSearch, parseTripSearchParams } from "../../lib/mmtTrip";

function resolveHeroTab(tabParam) {
  if (tabParam === "drivers") return "drivers";
  if (tabParam === "holidays") return "holidays";
  if (tabParam === "buses") return "buses";
  return "cabs";
}

function ApplyLandingTab() {
  const searchParams = useSearchParams();
  const hero = useHeroSearch();
  const applied = useRef(false);

  useEffect(() => {
    if (applied.current) return;
    applied.current = true;
    const tab = resolveHeroTab(searchParams.get("tab"));
    if (tab !== "cabs") hero?.setActiveTab?.(tab);
  }, [searchParams, hero]);

  return null;
}

function HeroFromUrl({ displayCity }) {
  const searchParams = useSearchParams();
  const hasFrom = Boolean(searchParams.get("from") || searchParams.get("pickup"));
  const cabTrip = parseTripSearchParams(searchParams);
  const driverTrip = parseDriverTripSearchParams(searchParams);

  return (
    <>
      <ApplyLandingTab />
      <EmtHeroSearch
        defaultCity={displayCity}
        initialCabTrip={hasFrom && isValidTripSearch(cabTrip) ? cabTrip : null}
        initialDriverTrip={hasFrom && isValidDriverTripSearch(driverTrip) ? driverTrip : null}
      />
    </>
  );
}

export default function MmtHomePage({ children }) {
  const { city: selectedCity } = useSelectedCity();
  const displayCity = selectedCity || "Chennai";

  return (
    <HeroSearchProvider defaultTab="cabs">
      <HeroTabUrlSync />
      <MmtLayout>
        <Suspense fallback={<EmtHeroSearch defaultCity={displayCity} initialCabTrip={null} initialDriverTrip={null} />}>
          <HeroFromUrl displayCity={displayCity} />
        </Suspense>
        {children}
      </MmtLayout>
    </HeroSearchProvider>
  );
}
