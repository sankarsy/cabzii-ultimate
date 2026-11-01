"use client";

import Link from "next/link";
import { ExternalLink, MapPin } from "../../icons/rscIcons";
import { useAdminCities } from "../../../lib/admin/useAdminCities";
import { actingDriverLandingPath, airportCabBookingPath, cityCabLandingPath } from "../../../lib/cityCabPaths";

const HUBS = {
  airportTaxi: {
    title: "Airport Taxi",
    kicker: "CMS",
    intro: "Pickup and drop pages reuse the Cities collection. Airport details live on the city record — no duplicate airport menu.",
    livePath: (slug) => (slug === "chennai" ? airportCabBookingPath(slug) : `/services/airport-taxi/${slug}`),
    seoHint: "Edit ranking copy in SEO Pages. Booking still uses the existing cab tariff."
  },
  actingDriver: {
    title: "Acting Driver Services",
    kicker: "CMS",
    intro: "Public acting-driver pages by city. Driver profiles and assignments stay under Operations.",
    livePath: (slug) => actingDriverLandingPath(slug),
    seoHint: "Publish city pages here. Manage actual drivers in Acting Drivers."
  },
  cabBooking: {
    title: "Cab booking hubs",
    kicker: "CMS",
    intro: "City cab hubs for local, hourly, outstation and one-way booking.",
    livePath: (slug) => cityCabLandingPath(slug),
    seoHint: "Outstation, one-way and tempo pages are under Services."
  }
};

export default function AdminCityServiceHub({ token, serviceKey = "airportTaxi" }) {
  const hub = HUBS[serviceKey] || HUBS.airportTaxi;
  const { cities, loading, error } = useAdminCities({ token, activeOnly: false, service: serviceKey });

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-sky-700">{hub.kicker}</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{hub.title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">{hub.intro}</p>
        <p className="mt-1 text-xs text-slate-500">{hub.seoHint}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href="/admin?tab=cities" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-sky-300">
          Manage cities
        </Link>
        <Link href="/admin?tab=seoPagesHub" className="rounded-xl bg-sky-600 px-3 py-2 text-xs font-semibold text-white hover:bg-sky-700">
          Edit SEO pages
        </Link>
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-500">Loading cities…</p> : null}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cities.map((city) => {
          const path = hub.livePath(city.slug);
          return (
            <article key={city._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-900">{city.name}</p>
                  <p className="text-[11px] text-slate-500">{city.state || "India"}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${city.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}>
                  {city.isActive ? "Active" : "Off"}
                </span>
              </div>
              {serviceKey === "airportTaxi" && city.airportDetails ? (
                <p className="mt-2 line-clamp-2 text-xs text-slate-600">{city.airportDetails}</p>
              ) : null}
              <p className="mt-2 font-mono text-[11px] text-slate-500">{path}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href={path} target="_blank" className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:underline">
                  View live <ExternalLink className="h-3 w-3" />
                </Link>
                <Link href="/admin?tab=cities" className="text-xs font-semibold text-slate-600 hover:underline">
                  Edit city
                </Link>
              </div>
            </article>
          );
        })}
      </div>
      {!loading && !cities.length ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <MapPin className="mx-auto h-6 w-6 text-slate-400" />
          <p className="mt-2 text-sm text-slate-600">No cities have this service enabled. Open Cities, add a city, and tick the service.</p>
        </div>
      ) : null}
    </div>
  );
}
