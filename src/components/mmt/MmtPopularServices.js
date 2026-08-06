"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cityBySlug, SEO_CITIES } from "../../lib/seo/cities";
import { servicesForCityHub } from "../../lib/seo/programmaticMeta";
import { servicePath } from "../../lib/seo/services";
import { useSelectedCity } from "../../lib/useSelectedCity";
import { getIcon } from "../icons";
import { resolveMediaUrl } from "../../lib/media";

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
      className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[var(--cabzii-brand)] shadow-sm transition hover:border-[var(--cabzii-brand)]/35 hover:bg-blue-50/80 sm:flex sm:h-9 sm:w-9"
    >
      <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.25} aria-hidden />
    </button>
  );
}

function ServiceCard({ service, city, index }) {
  const href = servicePath(service, city);
  const Icon = getIcon(SERVICE_ICON_KEYS[service.slug] || "car");
  const highlight = Array.isArray(service.highlights) ? service.highlights[0] : "";
  const [imageOk, setImageOk] = useState(Boolean(service.image));
  const cover = service.image ? resolveMediaUrl(service.image) : "";

  return (
    <Link
      href={href}
      className="group min-w-[min(240px,78vw)] max-w-[280px] shrink-0 snap-start overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cabzii-brand)] focus-visible:ring-offset-2 lg:min-w-[calc(25%-0.75rem)] lg:max-w-[calc(25%-0.75rem)]"
    >
      <div
        className={`relative min-h-[6.5rem] overflow-hidden bg-linear-to-br ${SERVICE_COLORS[index % SERVICE_COLORS.length]} p-3 text-white sm:min-h-[7rem] sm:p-3.5`}
      >
        {imageOk && cover ? (
          <>
            <img
              src={cover}
              alt={`${service.name} in ${city.name}`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageOk(false)}
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-900/70 via-slate-900/25 to-transparent" aria-hidden />
          </>
        ) : null}
        <span
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/25 text-white ring-1 ring-white/30 backdrop-blur-sm sm:h-9 sm:w-9"
          aria-hidden="true"
        >
          {Icon ? <Icon className="h-4 w-4 sm:h-[1.15rem] sm:w-[1.15rem]" /> : null}
        </span>
        <div className="relative pr-10">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">{city.name}</span>
          <h3 className="mt-0.5 text-sm font-extrabold leading-snug sm:text-base">{service.name}</h3>
        </div>
        <span className="relative mt-2 inline-flex items-center gap-1 rounded border border-dashed border-white/60 bg-white/20 px-2 py-0.5 text-[11px] font-bold tracking-wide text-white backdrop-blur-sm sm:text-xs">
          From {formatINR(service.priceFrom)}
        </span>
      </div>

      <div className="flex min-h-[5.5rem] flex-col p-3 sm:min-h-[6rem] sm:p-3.5">
        <p className="line-clamp-2 text-[11px] leading-relaxed text-slate-600 sm:text-xs">
          {highlight || `Book ${service.name.toLowerCase()} online with upfront fares & instant confirmation.`}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-2">
          <span className="text-[10px] font-medium text-slate-400">Instant confirmation</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold tracking-wide text-slate-900 transition group-hover:text-[var(--cabzii-cta)] sm:text-xs">
            BOOK NOW
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function MmtPopularServices() {
  const scrollRef = useRef(null);
  const { city: selectedCity } = useSelectedCity();
  const city = useMemo(() => cityFromLabel(selectedCity || "Chennai"), [selectedCity]);
  const [cmsBySlug, setCmsBySlug] = useState({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/seo-services?limit=40&page=1", { cache: "no-store" });
        const json = await res.json();
        const rows = Array.isArray(json?.data) ? json.data : [];
        if (cancelled) return;
        const map = {};
        for (const row of rows) {
          if (row?.slug) map[row.slug] = row;
        }
        setCmsBySlug(map);
      } catch {
        /* keep static fallbacks */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = useMemo(() => {
    const merge = (svc) => {
      const cms = cmsBySlug[svc.slug];
      if (!cms) return svc;
      return {
        ...svc,
        ...cms,
        name: cms.name || svc.name,
        priceFrom: cms.priceFrom > 0 ? cms.priceFrom : svc.priceFrom,
        highlights: Array.isArray(cms.highlights) && cms.highlights.length ? cms.highlights : svc.highlights,
        image: cms.image || svc.image || ""
      };
    };
    const list = servicesForCityHub(city.slug, 4).map((service) => ({ service: merge(service), city }));
    const otherCities = SEO_CITIES.filter((c) => c.slug !== city.slug).slice(0, 8);
    for (const c of otherCities) {
      for (const service of servicesForCityHub(c.slug, 1)) {
        list.push({ service: merge(service), city: c });
      }
    }
    return list;
  }, [city, cmsBySlug]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.min(280, el.clientWidth * 0.85);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className="border-t border-slate-200 bg-slate-50/60 section-shell py-5 sm:py-8">
      <div className="relative mb-3 sm:mb-5">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--cabzii-brand)] sm:text-xs">Book online</p>
          <h2 className="mt-0.5 text-base font-extrabold tracking-tight text-slate-900 sm:text-xl">
            Cab services in all cities
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-600 sm:text-sm">
            Airport taxi, outstation, hourly rental &amp; more — Chennai, Bengaluru, Hyderabad, Madurai &amp; beyond
          </p>
        </div>
        <div className="mt-2 flex items-center justify-center gap-2 sm:absolute sm:right-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2 sm:justify-end sm:gap-3">
          <ScrollButton direction="left" onClick={() => scroll(-1)} />
          <ScrollButton direction="right" onClick={() => scroll(1)} />
          <Link
            href={`/cab-booking/${city.slug}`}
            className="text-xs font-semibold text-[var(--cabzii-brand)] hover:underline sm:text-sm"
          >
            View all →
          </Link>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="offers-scroll flex gap-3 overflow-x-auto overscroll-x-contain pb-1 pt-1 snap-x snap-mandatory scroll-smooth sm:gap-4"
        role="region"
        aria-label="Cab services in all cities"
        tabIndex={0}
      >
        {cards.map(({ service, city: cardCity }, index) => (
          <ServiceCard key={`${cardCity.slug}-${service.slug}`} service={service} city={cardCity} index={index} />
        ))}
      </div>
    </section>
  );
}
