"use client";

import EmtBusSearchForm from "./EmtBusSearchForm";
import EmtCategoryTabs from "./EmtCategoryTabs";
import EmtFlightSearchForm from "./EmtFlightSearchForm";
import EmtHeroFeatures from "./EmtHeroFeatures";
import EmtHolidaySearchForm from "./EmtHolidaySearchForm";
import EmtHotelSearchForm from "./EmtHotelSearchForm";
import EmtTrainSearchForm from "./EmtTrainSearchForm";
import { useHeroSearch } from "./HeroSearchContext";
import MmtCabSearchWidget from "../mmt/MmtCabSearchWidget";
import MmtDriverSearchWidget from "../mmt/MmtDriverSearchWidget";
import HeroHeadline from "../conversion/HeroHeadline";

export default function EmtHeroSearch({
  defaultCity = "",
  defaultTab = "cabs",
  initialCabTrip = null,
  initialDriverTrip = null,
  seoHeading = "Book Trusted Cabs & Drivers Across India",
  seoSubheading = "Airport transfers, outstation trips, local rentals & driver services — transparent fares, verified partners."
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
      <HeroHeadline title={seoHeading} subtitle={seoSubheading} />

      <div className="emt-hero-shell w-full">
        <div className="emt-hero-shell-top bg-white">
          <div className="emt-hero-inner emt-category-scroll-wrap relative">
            <EmtCategoryTabs variant="shell" activeTab={active} setActiveTab={handleTabChange} />
          </div>
        </div>

        <div className={`emt-hero-shell-body ${bodyClass}`}>
          <div className={isHoliday ? "w-full" : "emt-hero-inner"}>
            {active === "flights" ? <EmtFlightSearchForm emtHero /> : null}
            {active === "hotels" ? <EmtHotelSearchForm emtHero /> : null}
            {active === "trains" ? <EmtTrainSearchForm emtHero /> : null}
            {active === "buses" ? <EmtBusSearchForm emtHero /> : null}
            {active === "holidays" ? <EmtHolidaySearchForm emtHero /> : null}
            {active === "cabs" ? (
              <MmtCabSearchWidget defaultCity={defaultCity} initialTrip={initialCabTrip} emtLayout heroMode />
            ) : null}
            {active === "drivers" ? (
              <MmtDriverSearchWidget defaultCity={defaultCity} initialTrip={initialDriverTrip} emtLayout heroMode />
            ) : null}
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
