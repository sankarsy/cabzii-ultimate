"use client";

import { useHeroSearch } from "./HeroSearchContext";
import MmtCabSearchWidget from "../mmt/MmtCabSearchWidget";
import EmtBusSearchForm from "./EmtBusSearchForm";
import HeroRouteArt from "../brand/HeroRouteArt";
import { HOME_H1, HOME_H1_LEDE } from "../../lib/seo/constants";

const HERO_TRUST = [
  { icon: "rupee", label: "Fares shown before you pay" },
  { icon: "shield", label: "Verified partner vehicles" },
  { icon: "wa", label: "WhatsApp support for changes" }
];

function TrustIcon({ name }) {
  const common = "h-[18px] w-[18px] shrink-0 text-[var(--cabzii-brand)]";
  if (name === "shield") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M8.5 12l2.5 2.5 4.5-5" />
      </svg>
    );
  }
  if (name === "wa") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M21 11.5a8.5 8.5 0 01-12.6 7.4L3 20.5l1.7-5.2A8.5 8.5 0 1121 11.5z" />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M6 4h12M6 9h12M6 14h4a4.5 4.5 0 000-9M9 14l8 7" />
    </svg>
  );
}

export default function EmtHeroSearch({
  defaultCity = "Chennai",
  defaultTab = "cabs",
  initialCabTrip = null,
  initialDriverTrip = null,
  seoHeading = HOME_H1,
  seoSubheading = HOME_H1_LEDE
}) {
  void defaultCity;
  void initialDriverTrip;
  const hero = useHeroSearch();
  const active = hero?.activeTab ?? defaultTab;

  return (
    <>
      <section className="emt-hero-section">
        <div className="emt-hero-inner">
          <div className="emt-hero-headline">
            <div>
              <h1 className="emt-hero-kicker-title">{seoHeading}</h1>
              <p className="emt-hero-kicker-lede">{seoSubheading}</p>
              <span className="emt-hero-offer">
                <svg className="h-[18px] w-[18px] text-[var(--cabzii-cta)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
                  <path d="M6 4h12M6 9h12M6 14h4a4.5 4.5 0 000-9M9 14l8 7" />
                </svg>
                Use CABZII500 for ₹200 off your first outstation trip
              </span>
            </div>
            <div className="route">
              <HeroRouteArt />
            </div>
          </div>
        </div>
      </section>
      <div className="emt-hero-search-float">
        <div className="emt-hero-inner">
          <div className="emt-hero-search-slot">
            {active === "buses" ? (
              <EmtBusSearchForm emtHero />
            ) : (
              <MmtCabSearchWidget defaultCity="" initialTrip={initialCabTrip} emtLayout heroMode />
            )}
          </div>
          <div className="emt-hero-trust">
            {HERO_TRUST.map((item) => (
              <span key={item.label} className="emt-hero-trust-item">
                <TrustIcon name={item.icon} />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
