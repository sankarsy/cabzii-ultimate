"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BRAND, HERO_TABS, TRENDING_SEARCHES } from "../../lib/emt/constants";
import { routeBySlug } from "../../lib/seo/routes";
import { routeToCabSearchHref } from "../../lib/routeTrip";
import { HOLIDAY_THEMES, themeHref } from "../../lib/holidayHome";
import { cn } from "../../lib/emt/cn";
import MmtCabSearchWidget from "../mmt/MmtCabSearchWidget";
import { getIcon, HERO_TAB_ICONS } from "../icons";
import MmtDriverSearchWidget from "../mmt/MmtDriverSearchWidget";
import EmtFlightSearchForm from "./EmtFlightSearchForm";
import EmtHotelSearchForm from "./EmtHotelSearchForm";

const COMING_SOON = {
  buses: {
    title: "Bus booking",
    message: "Intercity bus search is coming soon.",
    href: "/buses",
    cta: "Learn more"
  },
  trains: {
    title: "Train booking",
    message: "IRCTC-style train booking is coming soon.",
    href: "/trains",
    cta: "Learn more"
  }
};

export default function EmtHeroSearch({
  defaultCity = "",
  defaultTab = "cabs",
  initialCabTrip = null,
  initialDriverTrip = null
}) {
  const [active, setActive] = useState(defaultTab);

  useEffect(() => {
    if (defaultTab) setActive(defaultTab);
  }, [defaultTab]);

  return (
    <section className="relative isolate -mt-14 pt-14 sm:-mt-[4.25rem] sm:min-h-[420px] sm:pt-[4.25rem]">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[var(--cabzii-header)]/90 via-[var(--cabzii-header)]/75 to-[var(--cabzii-header)]/50" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-3 pb-6 pt-4 sm:px-4 sm:pb-8 sm:pt-5">
        <h1 className="text-balance text-center text-lg font-extrabold leading-snug tracking-tight text-white sm:text-3xl">
          {BRAND.tagline}
        </h1>
        <p className="mt-1.5 text-balance text-center text-[11px] leading-relaxed text-white/90 sm:text-sm">
          {BRAND.domain} — compare fares, verified partners, instant OTP booking
        </p>

        <div className="mt-4 w-full min-w-0 overflow-visible rounded-xl bg-white shadow-[var(--cabzii-shadow-card)] sm:mt-5">
          <div className="hero-tabs-scroll flex gap-0.5 overflow-x-auto border-b border-slate-100 px-1.5 pt-2 sm:justify-center sm:gap-1.5 sm:px-2">
            {HERO_TABS.map((tab) => {
              const isActive = tab.id === active;
              const TabIcon = HERO_TAB_ICONS[tab.id] || getIcon(tab.iconKey);
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActive(tab.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex shrink-0 flex-col items-center rounded-lg px-2.5 py-2 text-[10px] font-semibold transition sm:min-w-[3.75rem] sm:px-3 sm:py-2.5 sm:text-xs",
                    isActive
                      ? "bg-[var(--cabzii-brand)]/10 text-[var(--cabzii-brand)] ring-1 ring-[var(--cabzii-brand)]/30"
                      : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  <span className="mb-1.5 flex h-6 w-6 items-center justify-center sm:h-7 sm:w-7" aria-hidden="true">
                    {TabIcon ? <TabIcon className="h-5 w-5 sm:h-6 sm:w-6" /> : null}
                  </span>
                  <span className="leading-tight">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="px-3 py-4 sm:px-6 sm:py-5">
            {active === "flights" ? <EmtFlightSearchForm /> : null}
            {active === "hotels" ? <EmtHotelSearchForm /> : null}
            {active === "cabs" ? (
              <MmtCabSearchWidget defaultCity={defaultCity} initialTrip={initialCabTrip} />
            ) : null}
            {active === "drivers" ? (
              <MmtDriverSearchWidget defaultCity={defaultCity} initialTrip={initialDriverTrip} />
            ) : null}
            {active === "holidays" ? <HolidaysHeroPanel /> : null}
            {COMING_SOON[active] ? <ComingSoonPanel {...COMING_SOON[active]} /> : null}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          <span className="text-[11px] font-medium text-white/80">Trending:</span>
          {TRENDING_SEARCHES.map((t) => {
            const route = t.slug ? routeBySlug(t.slug) : null;
            const href = t.href || (route ? routeToCabSearchHref(route) : "/cabs");
            return (
              <Link
                key={t.label}
                href={href}
                className="rounded-full border border-white/30 bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur hover:bg-white/20"
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HolidaysHeroPanel() {
  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center sm:py-6">
      <p className="text-lg font-bold text-slate-900">Holiday packages</p>
      <p className="max-w-md text-sm text-slate-600">
        Pilgrimage, beach, family &amp; honeymoon tours across India — book on cabzii.in.
      </p>
      <Link
        href="/holidays"
        className="rounded-full bg-[var(--cabzii-brand)] px-8 py-2.5 text-sm font-bold text-white hover:bg-[var(--cabzii-brand-hover)]"
      >
        Browse all packages
      </Link>
      <div className="flex flex-wrap justify-center gap-2">
        {HOLIDAY_THEMES.map((theme) => (
          <Link
            key={theme.id}
            href={themeHref(theme)}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-[var(--cabzii-brand)]/40 hover:text-[var(--cabzii-brand)]"
          >
            {theme.emoji} {theme.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

function ComingSoonPanel({ title, message, href, cta }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-800">
        Coming soon
      </span>
      <p className="text-lg font-bold text-slate-900">{title}</p>
      <p className="max-w-md text-sm text-slate-600">{message}</p>
      <Link
        href={href}
        className="rounded-full bg-[var(--cabzii-brand)] px-8 py-2.5 text-sm font-bold text-white hover:bg-[var(--cabzii-brand-hover)]"
      >
        {cta}
      </Link>
      <Link href="/cabs" className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
        Book a cab instead →
      </Link>
    </div>
  );
}
