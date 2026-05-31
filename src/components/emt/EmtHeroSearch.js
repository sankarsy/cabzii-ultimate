"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BRAND, HERO_TABS, TRENDING_SEARCHES } from "../../lib/emt/constants";
import { cn } from "../../lib/emt/cn";
import MmtCabSearchWidget from "../mmt/MmtCabSearchWidget";
import MmtDriverSearchWidget from "../mmt/MmtDriverSearchWidget";
import EmtFlightSearchForm from "./EmtFlightSearchForm";
import EmtHotelSearchForm from "./EmtHotelSearchForm";

const COMING_SOON = {
  holidays: { title: "Holiday packages", href: "/holidays", cta: "Browse packages" },
  buses: { title: "Bus booking", href: "/buses", cta: "View buses" },
  trains: { title: "Train booking", href: "/trains", cta: "View trains" }
};

export default function EmtHeroSearch({ defaultCity = "", defaultTab = "cabs" }) {
  const [active, setActive] = useState(defaultTab);

  useEffect(() => {
    if (defaultTab) setActive(defaultTab);
  }, [defaultTab]);

  return (
    <section className="relative isolate min-h-[380px]">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[var(--cabzii-header)]/90 via-[var(--cabzii-header)]/75 to-[var(--cabzii-header)]/50" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-8 pt-5">
        <h1 className="text-center text-xl font-extrabold tracking-tight text-white sm:text-3xl">
          {BRAND.tagline}
        </h1>
        <p className="mt-1.5 text-center text-xs text-white/90 sm:text-sm">
          {BRAND.domain} — compare fares, verified partners, instant OTP booking
        </p>

        <div className="mt-5 rounded-xl bg-white shadow-[var(--cabzii-shadow-card)]">
          <div className="hero-tabs-scroll flex gap-1 overflow-x-auto border-b border-slate-100 px-2 pt-2 sm:justify-center sm:gap-1.5">
            {HERO_TABS.map((tab) => {
              const isActive = tab.id === active;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActive(tab.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex shrink-0 flex-col items-center rounded-lg px-3 py-2.5 text-[11px] font-semibold transition sm:min-w-[3.75rem] sm:text-xs",
                    isActive
                      ? "bg-[var(--cabzii-brand)]/10 text-[var(--cabzii-brand)] ring-1 ring-[var(--cabzii-brand)]/30"
                      : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  <span className="mb-1.5 block text-xl leading-none sm:text-2xl" aria-hidden="true">
                    {tab.icon}
                  </span>
                  <span className="leading-tight">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="px-4 py-5 sm:px-6">
            {active === "flights" ? <EmtFlightSearchForm /> : null}
            {active === "hotels" ? <EmtHotelSearchForm /> : null}
            {active === "cabs" ? <MmtCabSearchWidget defaultCity={defaultCity} /> : null}
            {active === "drivers" ? <MmtDriverSearchWidget defaultCity={defaultCity} /> : null}
            {COMING_SOON[active] ? <ComingSoonPanel {...COMING_SOON[active]} /> : null}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          <span className="text-[11px] font-medium text-white/80">Trending:</span>
          {TRENDING_SEARCHES.map((t) => (
            <Link
              key={t.label}
              href={t.href}
              className="rounded-full border border-white/30 bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur hover:bg-white/20"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComingSoonPanel({ title, href, cta }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <p className="text-lg font-bold text-slate-900">{title}</p>
      <p className="max-w-md text-sm text-slate-600">Browse packages and book on cabzii.in.</p>
      <Link
        href={href}
        className="rounded-full bg-[var(--cabzii-brand)] px-8 py-2.5 text-sm font-bold text-white hover:bg-[var(--cabzii-brand-hover)]"
      >
        {cta}
      </Link>
    </div>
  );
}
