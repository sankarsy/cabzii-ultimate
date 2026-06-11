"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { HERO_TABS, TRENDING_SEARCHES } from "../../lib/emt/constants";
import { routeBySlug } from "../../lib/seo/routes";
import { routeToCabSearchHref } from "../../lib/routeTrip";
import { HOLIDAY_THEMES, themeHref } from "../../lib/holidayHome";
import { cn } from "../../lib/emt/cn";
import MmtCabSearchWidget from "../mmt/MmtCabSearchWidget";
import { getIcon, HERO_TAB_ICONS } from "../icons";
import MmtDriverSearchWidget from "../mmt/MmtDriverSearchWidget";
import BookingCtaBar from "../seo/BookingCtaBar";
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
  initialDriverTrip = null,
  seoHeading = "Cab Booking Chennai — Airport Taxi, Local & Outstation Cabs",
  seoSubheading = "Book airport taxi, local taxi, outstation taxi and one-way cabs in Chennai. Instant confirmation, affordable fares and professional drivers."
}) {
  const [active, setActive] = useState(defaultTab);

  useEffect(() => {
    if (defaultTab) setActive(defaultTab);
  }, [defaultTab]);

  return (
    <section className="relative isolate min-h-[min(100dvh,720px)] pt-[calc(3.5rem+env(safe-area-inset-top,0px))] sm:min-h-[440px] sm:pt-[calc(4.25rem+env(safe-area-inset-top,0px))]">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <Image
          src="/images/hero-banner.svg"
          alt="Cabzii cab booking Chennai — airport taxi and outstation cabs"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[var(--cabzii-header)]/90 via-[var(--cabzii-header)]/75 to-[var(--cabzii-header)]/50" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-3 pb-6 pt-3 sm:px-4 sm:pb-8 sm:pt-4">
        <h1 className="text-balance px-1 text-center text-[1.125rem] font-extrabold leading-[1.3] tracking-tight text-white sm:text-[1.65rem] lg:text-3xl">
          {seoHeading}
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-balance px-1 text-center text-xs leading-relaxed text-white/90 sm:text-sm">
          {seoSubheading}
        </p>

        {/* Above-the-fold trust signals — visible on every screen size */}
        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] font-semibold text-white/95 sm:text-xs">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" strokeWidth={0} aria-hidden /> 4.9 rated
          </span>
          <span className="text-white/40" aria-hidden>·</span>
          <span>Verified drivers</span>
          <span className="text-white/40" aria-hidden>·</span>
          <span>10,000+ trips</span>
          <span className="text-white/40" aria-hidden>·</span>
          <a href="tel:+919944197416" className="underline decoration-white/40 underline-offset-2 hover:decoration-white">
            99441 97416
          </a>
        </div>

        <div className="cabzii-widget mt-4 w-full min-w-0 max-w-full overflow-hidden sm:mt-5">
          <div className="hero-tabs-wrap relative border-b border-slate-100/80">
          <div className="hero-tabs-scroll flex gap-1 overflow-x-auto px-2 pb-px pt-2.5 sm:justify-center sm:gap-1.5 sm:px-3">
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
                    "cabzii-tap flex shrink-0 flex-col items-center rounded-xl px-2.5 py-2 text-[10px] font-semibold transition sm:min-w-[3.75rem] sm:px-3 sm:py-2.5 sm:text-xs",
                    isActive
                      ? "bg-[var(--cabzii-brand)]/10 text-[var(--cabzii-brand)] shadow-[inset_0_0_0_1px_rgba(0,86,210,0.2)]"
                      : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  <span
                    className={cn(
                      "mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg sm:h-8 sm:w-8",
                      isActive ? "bg-[var(--cabzii-brand)]/12 text-[var(--cabzii-brand)]" : "bg-slate-50 text-slate-500"
                    )}
                    aria-hidden="true"
                  >
                    {TabIcon ? <TabIcon className="h-[1.125rem] w-[1.125rem] sm:h-5 sm:w-5" strokeWidth={1.75} /> : null}
                  </span>
                  <span className="leading-tight">{tab.label}</span>
                </button>
              );
            })}
          </div>
          </div>

          <div className="px-3 py-4 sm:px-5 sm:py-5 md:px-6">
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

        <div className="mt-4 hidden sm:block">
          <BookingCtaBar
            bookHref="/cabs"
            bookLabel="Book cab now"
            quoteLabel="WhatsApp instant quote"
            callLabel="Call 99441 97416"
            variant="compact"
          />
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
