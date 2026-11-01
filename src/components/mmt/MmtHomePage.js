"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EmtHeroSearch from "../emt/EmtHeroSearch";
import SocialProofTicker from "../conversion/SocialProofTicker";
import TrustStrip from "../ui/TrustStrip";
import HomeBelowFold from "../home/HomeBelowFold";
import MmtLayout from "./MmtLayout";
import { HeroSearchProvider, useHeroSearch } from "../emt/HeroSearchContext";
import HeroTabUrlSync from "../emt/HeroTabUrlSync";
import { useSelectedCity } from "../../lib/useSelectedCity";
import { isValidDriverTripSearch, parseDriverTripSearchParams } from "../../lib/driverTrip";
import { isValidTripSearch, parseTripSearchParams } from "../../lib/mmtTrip";
import { resolveProductTab } from "../../lib/emt/productNav";

function HomeProviders({ displayCity, belowFold }) {
  const searchParams = useSearchParams();
  const requestedTab = resolveProductTab(searchParams.get("tab"));
  const defaultTab = requestedTab === "drivers" ? "cabs" : requestedTab;

  return (
    <HeroSearchProvider defaultTab={defaultTab}>
      <HeroTabUrlSync />
      <MmtLayout>
        <Suspense fallback={<EmtHeroSearch defaultCity={displayCity} initialCabTrip={null} initialDriverTrip={null} />}>
          <HeroFromUrl displayCity={displayCity} />
        </Suspense>
        <SocialProofTicker />
        <TrustStrip />
        {belowFold}
      </MmtLayout>
    </HeroSearchProvider>
  );
}

export default function MmtHomePage({
  cabs,
  showcase,
  blogs,
  callDriverServices,
  siteSettings
}) {
  const { city: selectedCity } = useSelectedCity();
  const displayCity = selectedCity || "Chennai";
  const belowFold = (
    <HomeBelowFold
      cabs={cabs}
      showcase={showcase}
      blogs={blogs}
      callDriverServices={callDriverServices}
      siteSettings={siteSettings}
    />
  );

  return (
    <Suspense
      fallback={
        <HeroSearchProvider defaultTab="cabs">
          <MmtLayout>
            <EmtHeroSearch defaultCity={displayCity} initialCabTrip={null} initialDriverTrip={null} />
            <SocialProofTicker />
            <TrustStrip />
            {belowFold}
          </MmtLayout>
        </HeroSearchProvider>
      }
    >
      <HomeProviders displayCity={displayCity} belowFold={belowFold} />
    </Suspense>
  );
}

function ApplyLandingTab() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hero = useHeroSearch();
  const applied = useRef(false);

  useEffect(() => {
    if (applied.current) return;
    applied.current = true;
    const tab = resolveProductTab(searchParams.get("tab"));
    if (tab === "drivers") {
      router.replace("/call-driver");
      return;
    }
    if (tab !== "cabs") hero?.setActiveTab?.(tab);
  }, [searchParams, hero, router]);

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
