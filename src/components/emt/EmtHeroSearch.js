"use client";

import EmtHeroFeatures from "./EmtHeroFeatures";
import { useHeroSearch } from "./HeroSearchContext";
import MmtCabSearchWidget from "../mmt/MmtCabSearchWidget";
import EmtBusSearchForm from "./EmtBusSearchForm";
import { HOME_H1, HOME_H1_LEDE } from "../../lib/seo/constants";
export default function EmtHeroSearch({
  defaultCity = "Chennai",
  defaultTab = "cabs",
  initialCabTrip = null,
  initialDriverTrip = null,
  seoHeading = HOME_H1,
  seoSubheading = HOME_H1_LEDE
}) {
  const hero = useHeroSearch();
  const active = hero?.activeTab ?? defaultTab;
  const bodyClass = "emt-hero-gradient";

  return (
    <section className="emt-hero-section">
      <div className="emt-hero-shell w-full">
        <div className="emt-hero-kicker bg-white">
          <div className="emt-hero-inner">
            <h1 className="emt-hero-kicker-title">{seoHeading}</h1>
            <p className="emt-hero-kicker-lede">{seoSubheading}</p>
          </div>
        </div>

        <div className={`emt-hero-shell-body ${bodyClass}`}>
          <div className="emt-hero-inner">
            {active === "buses" ? <EmtBusSearchForm emtHero /> : null}
            {active !== "buses" ? (
              <MmtCabSearchWidget defaultCity={defaultCity} initialTrip={initialCabTrip} emtLayout heroMode />
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
