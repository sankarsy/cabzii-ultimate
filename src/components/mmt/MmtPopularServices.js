"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

/* Banner gradients rotated per card — matches the Exclusive Offers palette */
const SERVICE_COLORS = [
  "from-[var(--cabzii-brand)] to-blue-500",
  "from-emerald-500 to-teal-400",
  "from-indigo-500 to-violet-400",
  "from-rose-500 to-pink-400",
  "from-amber-500 to-orange-400",
  "from-slate-700 to-slate-500"
];

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
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Scroll services left" : "Scroll services right"}
      className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[var(--cabzii-brand)] shadow-[var(--cabzii-shadow-card)] transition hover:border-[var(--cabzii-brand)]/35 hover:bg-blue-50/80 sm:flex"
    >
      <Icon className="h-5 w-5" strokeWidth={2.25} aria-hidden />
    </button>
  );
}

export default function MmtPopularServices() {
  const scrollRef = useRef(null);
  const { city: selectedCity } = useSelectedCity();
  const city = useMemo(() => cityFromLabel(selectedCity || "Chennai"), [selectedCity]);

  /* Selected city's top services first, then the top service in other major cities */
  const cards = useMemo(() => {
    const list = servicesForCityHub(city.slug, 4).map((service) => ({ service, city }));
    const otherCities = SEO_CITIES.filter((c) => c.slug !== city.slug).slice(0, 8);
    for (const c of otherCities) {
      for (const service of servicesForCityHub(c.slug, 1)) {
        list.push({ service, city: c });
      }
    }
    return list;
  }, [city]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.min(320, el.clientWidth * 0.85);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className="border-t border-slate-200 bg-slate-50/60 section-shell py-8 sm:py-10">
      <div className="relative mb-5 sm:mb-7">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--cabzii-brand)]">Book online</p>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-[1.75rem]">
            Cab services in all cities
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Airport taxi, outstation, hourly rental &amp; more — Chennai, Bengaluru, Hyderabad, Madurai &amp; beyond
          </p>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 sm:absolute sm:right-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2 sm:justify-end sm:gap-3">
          <ScrollButton direction="left" onClick={() => scroll(-1)} />
          <ScrollButton direction="right" onClick={() => scroll(1)} />
          <Link
            href={`/cab-booking/${city.slug}`}
            className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline"
          >
            View all →
          </Link>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="offers-scroll flex gap-4 overflow-x-auto overscroll-x-contain pb-1 pt-1 snap-x snap-mandatory scroll-smooth"
        role="region"
        aria-label="Cab services in all cities"
        tabIndex={0}
      >
        {cards.map(({ service, city: cardCity }, index) => {
          const href = servicePath(service, cardCity);
          const Icon = getIcon(SERVICE_ICON_KEYS[service.slug] || "car");
          const highlight = Array.isArray(service.highlights) ? service.highlights[0] : "";
          return (
            <Link
              key={`${cardCity.slug}-${service.slug}`}
              href={href}
              className="group min-w-[min(280px,85vw)] max-w-[320px] shrink-0 snap-start overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[var(--emt-shadow-card)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--emt-shadow-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cabzii-brand)] focus-visible:ring-offset-2 lg:min-w-[calc(25%-0.75rem)] lg:max-w-[calc(25%-0.75rem)]"
            >
              {/* Banner */}
              <div className={`relative min-h-[7rem] overflow-hidden bg-linear-to-br ${SERVICE_COLORS[index % SERVICE_COLORS.length]} p-4 text-white`}>
                <span
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/25 text-white ring-1 ring-white/30 backdrop-blur-sm"
                  aria-hidden="true"
                >
                  {Icon ? <Icon className="h-[1.35rem] w-[1.35rem]" /> : null}
                </span>
                <div className="relative pr-12">
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-90">{cardCity.name}</span>
                  <h3 className="mt-1 text-base font-extrabold leading-snug">{service.name}</h3>
                </div>
                <span className="relative mt-3 inline-flex items-center gap-1.5 rounded border-[1.5px] border-dashed border-white/60 bg-white/20 px-2.5 py-1 text-xs font-bold tracking-wide text-white backdrop-blur-sm">
                  From {formatINR(service.priceFrom)}
                </span>
              </div>

              {/* Body */}
              <div className="flex min-h-[7.25rem] flex-col p-4">
                <p className="line-clamp-2 text-[13px] leading-relaxed text-slate-600">
                  {highlight || `Book ${service.name.toLowerCase()} online with upfront fares & instant confirmation.`}
                </p>
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-[11px] font-medium text-slate-400">Instant confirmation</span>
                  <span className="inline-flex items-center gap-1 text-xs font-extrabold tracking-wide text-slate-900 transition group-hover:text-[var(--cabzii-cta)]">
                    BOOK NOW
                    <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
