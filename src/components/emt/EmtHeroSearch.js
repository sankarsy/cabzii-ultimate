"use client";

import EmtBusSearchForm from "./EmtBusSearchForm";
import EmtCategoryTabs from "./EmtCategoryTabs";
import EmtHeroFeatures from "./EmtHeroFeatures";
import EmtHolidaySearchForm from "./EmtHolidaySearchForm";
import { useHeroSearch } from "./HeroSearchContext";
import CallDriverHeroPanel from "../call-driver/CallDriverHeroPanel";
import MmtCabSearchWidget from "../mmt/MmtCabSearchWidget";

export default function EmtHeroSearch({
  defaultCity = "Chennai",
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
  const isBus = active === "buses";
  const bodyClass = isHoliday ? "emt-hero-holidays" : isBus ? "rdb-hero-body" : "emt-hero-gradient";

  return (
    <section className="emt-hero-section">
      {/* Visually hidden — keeps the SEO h1 + intro copy without the headline block UI */}
      <h1 className="sr-only">{seoHeading}</h1>
      <p className="sr-only">{seoSubheading}</p>

      <div className="emt-hero-shell w-full">
        <div className="emt-hero-shell-top bg-white">
          <div className="emt-hero-inner emt-category-scroll-wrap relative">
            <EmtCategoryTabs variant="shell" activeTab={active} setActiveTab={handleTabChange} />
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
