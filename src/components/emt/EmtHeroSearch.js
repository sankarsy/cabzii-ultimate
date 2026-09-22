"use client";

import dynamic from "next/dynamic";
import EmtCategoryTabs from "./EmtCategoryTabs";
import EmtHeroFeatures from "./EmtHeroFeatures";
import { useHeroSearch } from "./HeroSearchContext";
import MmtCabSearchWidget from "../mmt/MmtCabSearchWidget";

function HeroSearchFallback() {
  return (
    <div className="emt-hero-search-card emt-cab-search-card min-h-[11.5rem] sm:min-h-[12.75rem]" aria-hidden>
      <div className="emt-search-wrap">
        <div className="emt-search-bar min-h-[4.75rem] animate-pulse rounded-xl bg-white/50" />
      </div>
    </div>
  );
}

const CallDriverHeroPanel = dynamic(() => import("../call-driver/CallDriverHeroPanel"), {
  ssr: false,
  loading: HeroSearchFallback
});
const EmtBusSearchForm = dynamic(() => import("./EmtBusSearchForm"), {
  ssr: false,
  loading: HeroSearchFallback
});
const EmtHolidaySearchForm = dynamic(() => import("./EmtHolidaySearchForm"), {
  ssr: false,
  loading: HeroSearchFallback
});

export default function EmtHeroSearch({
  defaultCity = "Chennai",
  defaultTab = "cabs",
  initialCabTrip = null,
  initialDriverTrip = null,
  seoHeading = "Cab booking in Chennai",
  seoSubheading = "Airport taxi, local packages, outstation and acting driver. Fares shown before you confirm."
}) {
  const hero = useHeroSearch();
  const active = hero?.activeTab ?? defaultTab;

  const handleTabChange = (id) => {
    if (hero?.setActiveTab) hero.setActiveTab(id);
  };

  const isHoliday = active === "holidays";
  const bodyClass = isHoliday ? "emt-hero-holidays" : "emt-hero-gradient";

  return (
    <section className="emt-hero-section">
      <div className="emt-hero-shell w-full">
        <div className="emt-hero-shell-top bg-white">
          <div className="emt-hero-inner emt-category-scroll-wrap relative">
            <EmtCategoryTabs variant="shell" activeTab={active} setActiveTab={handleTabChange} />
          </div>
        </div>

        <div className="emt-hero-kicker bg-white">
          <div className="emt-hero-inner">
            <h1 className="emt-hero-kicker-title">{seoHeading}</h1>
            <p className="emt-hero-kicker-lede">{seoSubheading}</p>
          </div>
        </div>

        <div className={`emt-hero-shell-body ${bodyClass}`}>
          <div className={isHoliday ? "w-full" : "emt-hero-inner"}>
            {active === "buses" ? <EmtBusSearchForm emtHero /> : null}
            {active === "holidays" ? <EmtHolidaySearchForm emtHero /> : null}
            {active === "cabs" ? (
              <MmtCabSearchWidget defaultCity={defaultCity} initialTrip={initialCabTrip} emtLayout heroMode />
            ) : null}
            {active === "drivers" ? <CallDriverHeroPanel /> : null}
          </div>
        </div>

        <div className="emt-hero-shell-bottom bg-white">
          <div className="emt-hero-inner emt-category-scroll-wrap relative">
            <EmtHeroFeatures />
          </div>
        </div>
      </div>
    </section>
  );
}
