"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";
import { cityBySlug, SEO_CITIES } from "../../lib/seo/cities";
import { servicesForCityHub } from "../../lib/seo/programmaticMeta";
import { servicePath } from "../../lib/seo/services";
import { useSelectedCity } from "../../lib/useSelectedCity";
import { getIcon } from "../icons";

const SERVICE_ICON_KEYS = {
  "airport-taxi": "planeTakeoff",
  "outstation-cab": "route",
  "one-way-cab": "twoWay",
  "driver-on-hire": "driver",
  "chauffeur-service": "user",
  "tempo-traveller": "users",
  "car-rental": "car",
  "cab-rental": "car",
  "local-taxi": "navigation",
  "hourly-rental": "clock",
  "tour-packages": "landmark"
};

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(n) || 0);
}

function cityFromLabel(label) {
  const trimmed = String(label || "").trim();
  if (!trimmed) return cityBySlug("chennai");
  const byName = SEO_CITIES.find((c) => c.name.toLowerCase() === trimmed.toLowerCase());
  if (byName) return byName;
  const bySlug = cityBySlug(trimmed.toLowerCase().replace(/\s+/g, "-"));
  return bySlug || cityBySlug("chennai");
}

function ScrollButton({ direction, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Scroll services left" : "Scroll services right"}
      className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[var(--cabzii-brand)] shadow-[var(--cabzii-shadow-card)] transition hover:border-[var(--cabzii-brand)]/35 hover:bg-blue-50/80 sm:flex"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
        {direction === "left" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        )}
      </svg>
    </button>
  );
}

export default function MmtPopularServices() {
  const scrollRef = useRef(null);
  const { city: selectedCity } = useSelectedCity();
  const city = useMemo(() => cityFromLabel(selectedCity || "Chennai"), [selectedCity]);
  const services = useMemo(() => servicesForCityHub(city.slug, 10), [city.slug]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 420, behavior: "smooth" });
  };

  return (
    <section className="border-t border-slate-200 bg-slate-50/60 section-shell py-8 sm:py-10">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Cab services in {city.name}</h2>
          <p className="mt-0.5 text-sm text-slate-600">
            Airport taxi, outstation, hourly rental &amp; more — book online on cabzii.in
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ScrollButton direction="left" onClick={() => scroll(-1)} />
          <ScrollButton direction="right" onClick={() => scroll(1)} />
          <Link
            href={`/cab-booking/${city.slug}`}
            className="text-sm font-semibold text-[var(--emt-primary)] hover:underline"
          >
            All services
          </Link>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="offers-scroll flex min-h-[120px] flex-nowrap items-stretch gap-3 overflow-x-auto overscroll-x-contain pb-1 pt-1 snap-x snap-mandatory scroll-smooth"
        aria-label={`Cab services in ${city.name}`}
      >
        {services.map((service) => {
          const href = servicePath(service, city);
          const Icon = getIcon(SERVICE_ICON_KEYS[service.slug] || "car");
          const highlight = Array.isArray(service.highlights) ? service.highlights[0] : "";
          return (
            <Link
              key={service.slug}
              href={href}
              className="group flex h-full min-w-[200px] max-w-[200px] shrink-0 snap-start flex-col justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-3 transition hover:border-[var(--emt-primary)]/40 hover:shadow-md"
            >
              <div>
                <span
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--emt-primary)]/10 text-[var(--emt-primary)]"
                  aria-hidden
                >
                  {Icon ? <Icon className="h-4 w-4" /> : null}
                </span>
                <p className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-slate-900 group-hover:text-[var(--emt-primary)]">
                  {service.name}
                </p>
                {highlight ? (
                  <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-slate-500">{highlight}</p>
                ) : null}
              </div>
              <p className="mt-2 text-sm font-semibold text-[var(--emt-primary)]">
                From {formatINR(service.priceFrom)}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
