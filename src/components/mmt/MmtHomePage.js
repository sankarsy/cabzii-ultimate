"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import EmtHeroSearch from "../emt/EmtHeroSearch";
import EmtWhyChooseUs from "../emt/EmtWhyChooseUs";
import MmtLayout from "./MmtLayout";
import InternalLinksHub from "../seo/InternalLinksHub";
import TrustStrip from "../ui/TrustStrip";
import MmtCabResultCard from "./MmtCabResultCard";
import MmtDriverResultCard from "./MmtDriverResultCard";
import MmtHomeCatalogSection, { MmtHomeCatalogScroll, MmtHomeCatalogScrollItem } from "./MmtHomeCatalogSection";
import FaqSection from "../seo/FaqSection";
import SocialProofTicker from "../conversion/SocialProofTicker";
import { HeroSearchProvider } from "../emt/HeroSearchContext";
import HeroTabUrlSync from "../emt/HeroTabUrlSync";
import { HOME_PAGE_FAQS } from "../../lib/seo/content";
import { sortBySelectedCity } from "../../lib/locationPriority";
import { useSelectedCity } from "../../lib/useSelectedCity";
import { isValidDriverTripSearch, parseDriverTripSearchParams } from "../../lib/driverTrip";
import { isValidTripSearch, parseTripSearchParams } from "../../lib/mmtTrip";
import { extractCabList, extractDriverList, fetchJson } from "../../lib/apiClient";

const EmtHolidayExplore = dynamic(() => import("../emt/EmtHolidayExplore"), { ssr: false });
const EmtOffersCarousel = dynamic(() => import("../emt/EmtOffersCarousel"), { ssr: false });
const PopularRoutesStrip = dynamic(() => import("../home/PopularRoutesStrip"), { ssr: false });
const PilgrimagePackagesSection = dynamic(() => import("../home/PilgrimagePackagesSection"), { ssr: false });
const MmtPopularServices = dynamic(() => import("./MmtPopularServices"), { ssr: false });
const HomeBlogTeasers = dynamic(() => import("../home/HomeBlogTeasers"), { ssr: false });

const HOME_CABS_LIMIT = 8;
const HOME_DRIVERS_LIMIT = 8;

function resolveHeroTab(tabParam) {
  if (tabParam === "drivers") return "drivers";
  if (tabParam === "flights") return "flights";
  if (tabParam === "hotels") return "hotels";
  if (tabParam === "holidays") return "holidays";
  if (tabParam === "buses") return "buses";
  if (tabParam === "trains") return "trains";
  return "cabs";
}

function sortCabsForHome(list) {
  return [...list].sort((a, b) => {
    const featuredDiff = (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    if (featuredDiff !== 0) return featuredDiff;
    const recommendedDiff = (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0);
    if (recommendedDiff !== 0) return recommendedDiff;
    return 0;
  });
}

function HomePageBody({
  displayCity,
  cabs,
  drivers,
  loadingCabs,
  loadingDrivers,
  cabsError,
  driversError,
  heroTab,
  initialCabTrip,
  initialDriverTrip
}) {
  return (
    <HeroSearchProvider defaultTab={heroTab}>
      <Suspense fallback={null}>
        <HeroTabUrlSync />
      </Suspense>
      <MmtLayout>
        <EmtHeroSearch
          defaultCity={displayCity}
          defaultTab={heroTab}
          initialCabTrip={initialCabTrip}
          initialDriverTrip={initialDriverTrip}
        />
        {/* 1. Trust signals right under the search — reassure before anything else */}
        <SocialProofTicker />
        <TrustStrip />

        {/* 2. Deals — hook visitors with offers while intent is highest */}
        <EmtOffersCarousel />

        {/* 3. Core product — what we do and where, then the routes people book most */}
        <MmtPopularServices />
        <PopularRoutesStrip />

        {/* 4. Live inventory — actual cabs & drivers to pick from */}
        {cabsError ? (
          <p className="section-shell text-sm text-rose-700">{cabsError}</p>
        ) : null}

        <MmtHomeCatalogSection
          eyebrow="Our fleet"
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
                <MmtCabResultCard cab={cab} layout="card" catalogMode displayCity={displayCity} />
              </MmtHomeCatalogScrollItem>
            ))}
          </MmtHomeCatalogScroll>
        </MmtHomeCatalogSection>

        {driversError ? (
          <p className="section-shell text-sm text-rose-700">{driversError}</p>
        ) : null}

        <MmtHomeCatalogSection
          eyebrow="Verified chauffeurs"
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
                <MmtDriverResultCard driver={driver} layout="card" catalogMode displayCity={displayCity} />
              </MmtHomeCatalogScrollItem>
            ))}
          </MmtHomeCatalogScroll>
        </MmtHomeCatalogSection>

        {/* 5. Cross-sell — temple tours & holiday packages */}
        <PilgrimagePackagesSection />
        <EmtHolidayExplore />

        {/* 6. Why us — proof & credibility before the final push */}
        <EmtWhyChooseUs />

        {/* 7. Content & SEO — blog, internal links, FAQ */}
        <HomeBlogTeasers />

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
      </MmtLayout>
    </HeroSearchProvider>
  );
}

function HomePageWithSearchParams(props) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const heroTab = resolveHeroTab(tabParam);
  const hasFrom = Boolean(searchParams.get("from") || searchParams.get("pickup"));
  const cabTrip = parseTripSearchParams(searchParams);
  const driverTrip = parseDriverTripSearchParams(searchParams);

  return (
    <HomePageBody
      {...props}
      heroTab={heroTab}
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
  const [cabsError, setCabsError] = useState("");
  const [driversError, setDriversError] = useState("");

  const sharedProps = {
    displayCity,
    cabs,
    drivers,
    loadingCabs,
    loadingDrivers,
    cabsError,
    driversError
  };

  useEffect(() => {
    let cancelled = false;
    setLoadingCabs(true);
    setCabsError("");
    const q = new URLSearchParams({
      limit: String(HOME_CABS_LIMIT),
      page: "1"
    });
    if (displayCity) q.set("priorityCity", displayCity);

    fetchJson(`/api/cabs?${q}`)
      .then((json) => {
        if (cancelled) return;
        const list = sortCabsForHome(sortBySelectedCity(extractCabList(json), displayCity));
        setCabs(list.slice(0, HOME_CABS_LIMIT));
      })
      .catch((err) => {
        if (!cancelled) {
          setCabs([]);
          setCabsError(err.message || "Could not load cabs");
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
    const q = new URLSearchParams({ limit: String(HOME_DRIVERS_LIMIT), page: "1" });
    if (displayCity) q.set("priorityCity", displayCity);
    fetchJson(`/api/drivers?${q}`)
      .then((json) => {
        if (!cancelled) setDrivers(sortBySelectedCity(extractDriverList(json), displayCity).slice(0, HOME_DRIVERS_LIMIT));
      })
      .catch((err) => {
        if (!cancelled) {
          setDrivers([]);
          setDriversError(err.message || "Could not load drivers");
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
    <Suspense
      fallback={
        <HomePageBody {...sharedProps} heroTab="cabs" initialCabTrip={null} initialDriverTrip={null} />
      }
    >
      <HomePageWithSearchParams {...sharedProps} />
    </Suspense>
  );
}
