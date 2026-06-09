"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import EmtAppDownloadBanner from "../emt/EmtAppDownloadBanner";
import EmtHeroSearch from "../emt/EmtHeroSearch";
import EmtWhyChooseUs from "../emt/EmtWhyChooseUs";
import MmtLayout from "./MmtLayout";
import InternalLinksHub from "../seo/InternalLinksHub";
import TrustStrip from "../ui/TrustStrip";

const EmtHolidayExplore = dynamic(() => import("../emt/EmtHolidayExplore"), { ssr: false });
const EmtOffersCarousel = dynamic(() => import("../emt/EmtOffersCarousel"), { ssr: false });
const MmtPopularRoutes = dynamic(() => import("./MmtPopularRoutes"), { ssr: false });
const MmtPopularServices = dynamic(() => import("./MmtPopularServices"), { ssr: false });
import MmtCabResultCard from "./MmtCabResultCard";
import MmtDriverResultCard from "./MmtDriverResultCard";
import MmtHomeCatalogSection, { MmtHomeCatalogScroll, MmtHomeCatalogScrollItem } from "./MmtHomeCatalogSection";
import FaqSection from "../seo/FaqSection";
import { HOME_PAGE_FAQS } from "../../lib/seo/content";
import { sortBySelectedCity } from "../../lib/locationPriority";
import { useSelectedCity } from "../../lib/useSelectedCity";
import { isValidDriverTripSearch, parseDriverTripSearchParams } from "../../lib/driverTrip";
import { isValidTripSearch, parseTripSearchParams, todayStr } from "../../lib/mmtTrip";
import { extractCabList, extractDriverList, fetchJson } from "../../lib/apiClient";

function EmtHeroSearchFromUrl({ defaultCity }) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const tab = tabParam === "drivers" ? "drivers" : "cabs";
  const hasFrom = Boolean(searchParams.get("from") || searchParams.get("pickup"));
  const cabTrip = parseTripSearchParams(searchParams);
  const driverTrip = parseDriverTripSearchParams(searchParams);

  return (
    <EmtHeroSearch
      defaultCity={defaultCity}
      defaultTab={tab}
      initialCabTrip={hasFrom && isValidTripSearch(cabTrip) ? cabTrip : null}
      initialDriverTrip={hasFrom && isValidDriverTripSearch(driverTrip) ? driverTrip : null}
    />
  );
}

export default function MmtHomePage() {
  const { city: selectedCity } = useSelectedCity();
  const displayCity = selectedCity || "Chennai";
  const [cabs, setCabs] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loadingCabs, setLoadingCabs] = useState(true);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [catalogError, setCatalogError] = useState("");

  const defaultTrip = {
    tripType: "outstation",
    from: displayCity,
    to: "Bengaluru",
    date: todayStr(),
    time: "09:00",
    roundTrip: false,
    direction: "pickup",
    packageHours: 8,
    city: displayCity
  };

  useEffect(() => {
    let cancelled = false;
    setLoadingCabs(true);
    setCatalogError("");
    const q = new URLSearchParams({ limit: "4", page: "1" });
    if (displayCity) q.set("priorityCity", displayCity);
    fetchJson(`/api/cabs?${q}`)
      .then((json) => {
        if (!cancelled) {
          setCabs(sortBySelectedCity(extractCabList(json), displayCity));
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setCabs([]);
          setCatalogError(err.message || "Could not load catalog");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingCabs(false);
      });
    return () => {
      cancelled = true;
    };
  }, [displayCity]);

  useEffect(() => {
    let cancelled = false;
    setLoadingDrivers(true);
    const q = new URLSearchParams({ limit: "4", page: "1" });
    if (displayCity) q.set("priorityCity", displayCity);
    fetchJson(`/api/drivers?${q}`)
      .then((json) => {
        if (!cancelled) {
          setDrivers(sortBySelectedCity(extractDriverList(json), displayCity));
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setDrivers([]);
          if (!catalogError) setCatalogError(err.message || "Could not load catalog");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingDrivers(false);
      });
    return () => {
      cancelled = true;
    };
  }, [displayCity]);

  return (
    <MmtLayout headerTransparent>
      <Suspense fallback={<EmtHeroSearch defaultCity={displayCity} defaultTab="cabs" />}>
        <EmtHeroSearchFromUrl defaultCity={displayCity} />
      </Suspense>
      <EmtOffersCarousel />
      <EmtHolidayExplore />
      <MmtPopularServices />
      <MmtPopularRoutes />
      <TrustStrip />
      <EmtWhyChooseUs />

      {catalogError ? (
        <p className="mx-auto max-w-6xl px-4 text-sm text-rose-700">{catalogError}</p>
      ) : null}

      <MmtHomeCatalogSection
        title="Top cabs for you"
        subtitle={`Dzire, Ertiga, Innova & Tempo taxi cars · ${displayCity}`}
        viewAllHref="/cabs"
        viewAllLabel="View all cabs"
        loading={loadingCabs}
        loadingLabel="Loading cabs…"
        isEmpty={!loadingCabs && cabs.length === 0}
        emptyMessage="No cabs yet. Start the backend and add listings in admin."
      >
        <MmtHomeCatalogScroll>
          {cabs.map((cab) => (
            <MmtHomeCatalogScrollItem key={String(cab._id ?? cab.id)}>
              <MmtCabResultCard cab={cab} trip={defaultTrip} layout="card" />
            </MmtHomeCatalogScrollItem>
          ))}
        </MmtHomeCatalogScroll>
      </MmtHomeCatalogSection>

      <MmtHomeCatalogSection
        title="Top acting drivers for you"
        subtitle={`Chauffeur for Dzire, Ertiga, Innova & Tempo · same packages as cabs · ${displayCity}`}
        viewAllHref="/drivers"
        viewAllLabel="View all drivers"
        loading={loadingDrivers}
        loadingLabel="Loading drivers…"
        isEmpty={!loadingDrivers && drivers.length === 0}
        emptyMessage="No acting drivers yet. Restart the backend (it auto-creates drivers from cabs), or add drivers in admin."
        borderedTop
      >
        <MmtHomeCatalogScroll>
          {drivers.map((driver) => (
            <MmtHomeCatalogScrollItem key={String(driver._id ?? driver.id)}>
              <MmtDriverResultCard driver={driver} trip={defaultTrip} layout="card" />
            </MmtHomeCatalogScrollItem>
          ))}
        </MmtHomeCatalogScroll>
      </MmtHomeCatalogSection>

      <InternalLinksHub title="Explore cab booking, routes & services across South India" />

      <section className="border-t border-slate-200 bg-white py-8 sm:py-10">
        <div className="section-shell">
          <FaqSection
            eyebrow="Help"
            title="Frequently asked questions"
            subtitle="Quick answers about booking on cabzii.in."
            faqs={HOME_PAGE_FAQS}
            scrollable
            scrollMaxClass="max-h-[min(18rem,48vh)] sm:max-h-[min(20rem,50vh)]"
          />
        </div>
      </section>

      <EmtAppDownloadBanner />
    </MmtLayout>
  );
}
