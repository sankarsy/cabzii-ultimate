"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MmtCabResults from "./MmtCabResults";
import CityCabBookingWidget from "../city-cabs/CityCabBookingWidget";
import Breadcrumbs from "../seo/Breadcrumbs";
import TrackedLeadCtas from "../conversion/TrackedLeadCtas";
import { buildCabTypes } from "../../data/cabTypes";
import { actingDriverLandingPath } from "../../lib/cityCabPaths";
import { cityBySlug } from "../../lib/seo/cities";
import { sortBySelectedCity } from "../../lib/locationPriority";
import { todayStr } from "../../lib/mmtTrip";
import { extractCabList } from "../../lib/apiClient";

const HQ_CITY = cityBySlug("chennai") || { slug: "chennai", name: "Chennai" };

export default function CabsBrowsePage({ heading = "", intro = "", extraBody = "" }) {
  const city = HQ_CITY;
  const displayCity = city.name;
  const cabTypes = useMemo(() => buildCabTypes(city.name), [city.name]);
  const [cabs, setCabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalPages: 1 });

  const defaultTrip = {
    tripType: "outstation",
    from: displayCity,
    to: "",
    date: todayStr(),
    time: "09:00",
    roundTrip: false,
    direction: "pickup",
    packageHours: 8,
    city: displayCity
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ limit: "24", page: String(page) });
      const res = await fetch(`/api/cabs?${q}`, { cache: "no-store" });
      const json = await res.json();
      setCabs(sortBySelectedCity(extractCabList(json), displayCity));
      if (json?.meta) setMeta(json.meta);
    } finally {
      setLoading(false);
    }
  }, [page, displayCity]);

  useEffect(() => {
    load();
  }, [load]);

  const serviceCards = [
    { href: `/services/airport-taxi/${city.slug}`, label: "Airport taxi", hint: "Pickup and drop" },
    { href: `/services/outstation-cab/${city.slug}`, label: "Outstation cab", hint: "One-way and round-trip" },
    { href: `/services/hourly-rental/${city.slug}`, label: "Local package", hint: "4 hr / 8 hr hire" },
    { href: actingDriverLandingPath(city.slug), label: "Acting driver", hint: "Driver for your car" }
  ];

  return (
    <article className="section-shell py-6 sm:py-8">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Cabs", path: "/cabs" }
        ]}
      />

      <header className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {heading || `Cab booking in ${city.name}`}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            {intro ||
              "Airport taxi, local packages and outstation cabs. Pay 50% to confirm. Fuel and driver included. Tolls extra. First outstation ₹500 off with CABZII500."}
          </p>
          {extraBody ? (
            <div
              className="prose prose-slate mt-4 max-w-none text-sm text-slate-700"
              dangerouslySetInnerHTML={{ __html: extraBody }}
            />
          ) : null}
          <div className="mt-3">
            <TrackedLeadCtas
              source="cabs_browse_hero"
              message={`Hi Cabzii, I need a cab in ${city.name}.\nPickup:\nDrop:\nDate:\nPassengers:\nVehicle:`}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {serviceCards.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 hover:border-[var(--cabzii-brand)]"
              >
                <span className="block text-sm font-bold text-slate-900">{item.label}</span>
                <span className="mt-0.5 block text-xs text-slate-500">{item.hint}</span>
              </Link>
            ))}
          </div>
        </div>
        <CityCabBookingWidget
          cityName={city.name}
          defaultFrom={city.name}
          airportLabel={`${city.name} airport`}
        />
      </header>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-xl font-bold text-slate-900">Cab Types</h2>
          <Link href="/tariff" className="text-xs font-semibold text-[var(--cabzii-brand)] hover:underline">
            View full cab tariff
          </Link>
        </div>
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cabTypes.map((cab) => (
            <li key={cab.id} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3">
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                <Image
                  src={cab.image}
                  alt={cab.imageAlt}
                  width={80}
                  height={64}
                  loading="lazy"
                  unoptimized={cab.image.endsWith(".svg")}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900">{cab.name}</h3>
                <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-600">{cab.subtitle}</p>
                <p className="mt-1.5 text-xs font-semibold text-slate-900">{cab.fareLabel}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {cab.capacity} · {cab.luggage}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Available cabs</h2>
        <p className="mt-1 text-sm text-slate-600">
          Live inventory with per-km rates. Search a route above to see a full trip fare.
        </p>
        {loading ? (
          <div className="py-8 text-center text-sm text-slate-500 sm:py-10">Loading all cabs…</div>
        ) : (
          <div className="mt-4">
            <MmtCabResults cabs={cabs} trip={defaultTrip} catalogMode listLayout="row" displayCity={displayCity} />
          </div>
        )}
        {!loading && meta.totalPages > 1 ? (
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-40"
            >
              Previous
            </button>
            <span className="py-2 text-sm text-slate-600">
              Page {page} of {meta.totalPages}
            </span>
            <button
              type="button"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        ) : null}
      </section>
    </article>
  );
}
