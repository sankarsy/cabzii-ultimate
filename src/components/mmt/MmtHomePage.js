"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import EmtHeroSearch from "../emt/EmtHeroSearch";
import EmtWhyChooseUs from "../emt/EmtWhyChooseUs";
import MmtLayout from "./MmtLayout";
import TrustStrip from "../ui/TrustStrip";
import MmtCabResultCard from "./MmtCabResultCard";
import MmtHomeCatalogSection, { MmtHomeCatalogScroll, MmtHomeCatalogScrollItem } from "./MmtHomeCatalogSection";
import CallDriverHomeSection from "../home/CallDriverHomeSection";
import FaqSection from "../seo/FaqSection";
import SocialProofTicker from "../conversion/SocialProofTicker";
import { HeroSearchProvider, useHeroSearch } from "../emt/HeroSearchContext";
import HeroTabUrlSync from "../emt/HeroTabUrlSync";
import { HOME_PAGE_FAQS } from "../../lib/seo/content";
import { sortBySelectedCity } from "../../lib/locationPriority";
import { useSelectedCity } from "../../lib/useSelectedCity";
import { DEFAULT_HQ_CITY } from "../../lib/vehicleAdminConfig";
import { isValidDriverTripSearch, parseDriverTripSearchParams } from "../../lib/driverTrip";
import { isValidTripSearch, parseTripSearchParams } from "../../lib/mmtTrip";
import { extractCabList, fetchJson } from "../../lib/apiClient";
import HomeSeoDiscover from "../seo/HomeSeoDiscover";

const HomeShowcaseCarousel = dynamic(() => import("../home/HomeShowcaseCarousel"), { ssr: false });
const HomeBlogTeasers = dynamic(() => import("../home/HomeBlogTeasers"), { ssr: false });

const HOME_CABS_LIMIT = 8;

function resolveHeroTab(tabParam) {
  if (tabParam === "drivers") return "drivers";
  if (tabParam === "holidays") return "holidays";
  if (tabParam === "buses") return "buses";
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

function HomePageBody({
  displayCity,
  cabs,
  loadingCabs,
  cabsError,
  initialCabTrip,
  initialDriverTrip
}) {
  return (
    <MmtLayout>
      <EmtHeroSearch
        defaultCity={displayCity}
        initialCabTrip={initialCabTrip}
        initialDriverTrip={initialDriverTrip}
      />
      <SocialProofTicker />
      <TrustStrip />

      <HomeShowcaseCarousel section="offers" />
      <HomeShowcaseCarousel section="services" />
      <HomeShowcaseCarousel section="routes" />

      {cabsError ? (
        <p className="section-shell text-sm text-rose-700">{cabsError}</p>
      ) : null}

      <MmtHomeCatalogSection
        eyebrow="Our fleet"
        title="Top cabs for you"
        subtitle={`Dzire, Ertiga, Innova & Tempo taxi cars · ${DEFAULT_HQ_CITY}`}
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
              <MmtCabResultCard cab={cab} layout="card" catalogMode displayCity={cab.city || DEFAULT_HQ_CITY} />
            </MmtHomeCatalogScrollItem>
          ))}
        </MmtHomeCatalogScroll>
      </MmtHomeCatalogSection>

      <CallDriverHomeSection />
      <EmtWhyChooseUs />
      <HomeBlogTeasers />
      <HomeSeoDiscover />

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
  );
}

function HomePageWithSearchParams(props) {
  const searchParams = useSearchParams();
  const hasFrom = Boolean(searchParams.get("from") || searchParams.get("pickup"));
  const cabTrip = parseTripSearchParams(searchParams);
  const driverTrip = parseDriverTripSearchParams(searchParams);

  return (
    <>
      <ApplyLandingTab />
      <HomePageBody
        {...props}
        initialCabTrip={hasFrom && isValidTripSearch(cabTrip) ? cabTrip : null}
        initialDriverTrip={hasFrom && isValidDriverTripSearch(driverTrip) ? driverTrip : null}
      />
    </>
  );
}

export default function MmtHomePage() {
  const { city: selectedCity } = useSelectedCity();
  const displayCity = selectedCity || "Chennai";
  const [cabs, setCabs] = useState([]);
  const [loadingCabs, setLoadingCabs] = useState(true);
  const [cabsError, setCabsError] = useState("");

  const sharedProps = {
    displayCity,
    cabs,
    loadingCabs,
    cabsError
  };

  useEffect(() => {
    let cancelled = false;
    setLoadingCabs(true);
    setCabsError("");
    const q = new URLSearchParams({
      limit: String(HOME_CABS_LIMIT),
      page: "1",
      priorityCity: DEFAULT_HQ_CITY
    });

    fetchJson(`/api/cabs?${q}`)
      .then((json) => {
        if (cancelled) return;
        const list = sortCabsForHome(sortBySelectedCity(extractCabList(json), DEFAULT_HQ_CITY));
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
  }, []);

  return (
    <HeroSearchProvider defaultTab="cabs">
      <HeroTabUrlSync />
      <Suspense
        fallback={
          <HomePageBody {...sharedProps} initialCabTrip={null} initialDriverTrip={null} />
        }
      >
        <HomePageWithSearchParams {...sharedProps} />
      </Suspense>
    </HeroSearchProvider>
  );
}
