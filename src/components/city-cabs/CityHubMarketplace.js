"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import CityCabBookingWidget from "./CityCabBookingWidget";
import TaxiContactCard from "./TaxiContactCard";
import MmtCabResults from "../mmt/MmtCabResults";
import { extractCabList } from "../../lib/apiClient";
import { mergeTripDistance } from "../../lib/mergeTripDistance";
import { useTripRoute } from "../../lib/useTripRoute";
import { isSeoScopeAirportCity } from "../../config/seo-scope";
import { useCategoryRouteFares } from "../../lib/useCategoryRouteFares";
import { formatInr } from "../../lib/formatInr";
import { fareForCabCategory } from "../../lib/categoryRouteFare";
import { coordsForPlaceLabel } from "../../lib/indiaCityCoords";
import { lookupKnownRouteTripData } from "../../lib/seo/routeCatalog";
import { buildFareSlabs } from "../../lib/cabFare";
import { cabResultsHref, cabSlabForTrip } from "../../lib/mmtTrip";
import { resolveCabTripFare } from "../../lib/distanceFare";

function citySlug(name) {
  return String(name || "")
    .split(",")[0]
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function withCityCoords(trip = {}) {
  const next = { ...trip };
  const kind = String(next.tripType || "").toLowerCase();
  if (kind === "local" || kind === "airport") {
    next.packageHours = 4;
    if (!next.packageId) next.packageId = "local_4hr";
  }
  if (next.fromLat == null) {
    const hit = coordsForPlaceLabel(next.from);
    if (hit) {
      next.fromLat = hit.lat;
      next.fromLng = hit.lng;
    }
  }
  if (next.toLat == null) {
    const hit = coordsForPlaceLabel(next.to);
    if (hit) {
      next.toLat = hit.lat;
      next.toLng = hit.lng;
    }
  }
  return next;
}

/** When the cab list can't scroll further, move the page instead. */
function usePassScrollToPage(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function onWheel(e) {
      if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) return;
      const max = el.scrollHeight - el.clientHeight;
      const atTop = el.scrollTop <= 1;
      const atBottom = max <= 1 || el.scrollTop >= max - 1;
      if ((e.deltaY > 0 && atBottom) || (e.deltaY < 0 && atTop)) {
        e.preventDefault();
        window.scrollBy(0, e.deltaY);
      }
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [ref]);
}

function cabTripPrice(cab, trip) {
  const slabs = buildFareSlabs(cab);
  const slab = cabSlabForTrip(slabs, trip);
  const fare = resolveCabTripFare(cab, slab, trip);
  return Number(fare?.total) > 0 ? Number(fare.total) : 0;
}

export default function CityHubMarketplace({
  city,
  initialTrip = {},
  initialCabs = [],
  localAreas = [],
  airportLabel = "",
  heroTitle = "",
  showHero = true
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchTrip, setSearchTrip] = useState(() => withCityCoords(initialTrip));

  function handleSearch(nextTrip) {
    const next = withCityCoords(nextTrip);
    setSearchTrip(next);
    const href = cabResultsHref(next);
    if (href && !href.startsWith("/cabs/results") && href !== pathname) {
      router.push(href);
    }
  }
  useEffect(() => {
    setSearchTrip(withCityCoords(initialTrip));
  }, [initialTrip?.tripType, initialTrip?.from, initialTrip?.to, initialTrip?.date, initialTrip?.time, initialTrip?.packageHours, initialTrip?.packageId, initialTrip?.roundTrip, initialTrip?.fromLat, initialTrip?.toLat]);
  const { route } = useTripRoute(searchTrip);
  const routedTrip = useMemo(() => {
    const merged = mergeTripDistance(searchTrip, route) || searchTrip;
    if (Number(merged.distanceKm) > 0) return merged;
    const catalog = lookupKnownRouteTripData(citySlug(merged.from), citySlug(merged.to));
    if (catalog?.km > 0) return { ...merged, distanceKm: catalog.km };
    return merged;
  }, [searchTrip, route]);
  const categoryFares = useCategoryRouteFares(routedTrip);
  const trip = useMemo(
    () => (categoryFares ? { ...routedTrip, categoryFares } : routedTrip),
    [routedTrip, categoryFares]
  );
  const [cabs, setCabs] = useState(initialCabs);
  const [loading, setLoading] = useState(!initialCabs.length);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const q = new URLSearchParams({ limit: "100", page: "1", match: "0" });
    const cityName = String(trip?.from || trip?.city || city?.name || "").split(",")[0];
    if (cityName) q.set("priorityCity", cityName);
    if (trip?.date) q.set("date", trip.date);
    if (trip?.time) q.set("time", trip.time);
    if (trip?.tripType === "hourly" && trip?.packageHours) q.set("packageHours", String(trip.packageHours));
    if (trip?.packageId) q.set("packageId", trip.packageId);
    if (trip?.tripType) q.set("serviceTripType", trip.tripType);
    if (trip?.roundTrip) q.set("roundTrip", "true");

    if (!initialCabs.length) setLoading(true);

    fetch(`/api/cabs?${q}`, { cache: "no-store" })
      .then(async (r) => {
        const json = await r.json();
        if (cancelled) return;
        if (!r.ok || json?.success === false) {
          if (!initialCabs.length) setError(json.message || "Could not load cabs.");
          return;
        }
        const list = extractCabList(json);
        if (list.length) {
          setCabs(list);
          setError("");
        } else if (!initialCabs.length) {
          setCabs([]);
        }
      })
      .catch(() => {
        if (!cancelled && !initialCabs.length) setError("Could not load cabs.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    trip?.from,
    trip?.to,
    trip?.date,
    trip?.time,
    trip?.tripType,
    trip?.packageId,
    trip?.roundTrip,
    initialCabs.length,
    city?.name
  ]);

  const fleet = cabs;
  const showList = fleet.length > 0;
  const cabListRef = useRef(null);
  usePassScrollToPage(cabListRef);
  const showAirport = isSeoScopeAirportCity(city.slug);
  const dropLabel = airportLabel || `${city.name} airport`;
  const fromName = String(trip?.from || city.name || "").split(",")[0];
  const toName = String(trip?.to || "").split(",")[0];
  const isPair = Boolean(fromName && toName && fromName.toLowerCase() !== toName.toLowerCase());
  const catalogRoute = useMemo(() => {
    if (!isPair) return null;
    return lookupKnownRouteTripData(citySlug(fromName), citySlug(toName));
  }, [isPair, fromName, toName]);
  const distanceKm =
    Number(trip?.distanceKm) > 0
      ? Math.round(Number(trip.distanceKm))
      : Number(catalogRoute?.km) > 0
        ? Math.round(Number(catalogRoute.km))
        : 0;
  const fareFrom = useMemo(() => {
    const tripFares = fleet.map((cab) => cabTripPrice(cab, trip)).filter((n) => n >= 100);
    if (tripFares.length) return Math.min(...tripFares);
    const fromMap = categoryFares
      ? Math.min(...Object.values(categoryFares).filter((n) => Number(n) >= 100))
      : Infinity;
    if (Number.isFinite(fromMap) && fromMap !== Infinity) return fromMap;
    const fromCabs = fleet
      .map((cab) => fareForCabCategory(cab, categoryFares) || Number(cab.price) || 0)
      .filter((n) => n >= 100);
    if (fromCabs.length) return Math.min(...fromCabs);
    return Number(catalogRoute?.sedan) > 0 ? Number(catalogRoute.sedan) : 0;
  }, [categoryFares, fleet, trip, catalogRoute]);

  function applyAreaRoute(area) {
    setSearchTrip({
      ...searchTrip,
      tripType: showAirport ? "airport" : "local",
      from: area,
      to: showAirport ? dropLabel : city.name,
      city: city.name,
      roundTrip: false
    });
  }

  return (
    <div id="cabs" className="bg-[#f4f6fa] pb-6 lg:pb-8">
      {showHero ? (
        <div className="section-shell pt-6 pb-2 sm:pt-8">
          <h1 className="px-1 text-center text-lg font-extrabold leading-tight tracking-tight text-slate-900 sm:text-2xl md:text-[1.75rem]">
            {heroTitle ||
              (isPair ? `Cabzii ${fromName} To ${toName} Taxi Service` : `Cab booking in ${fromName}`)}
          </h1>
          {isPair ? (
            <p className="mx-auto mt-2 max-w-3xl px-1 text-center text-sm text-slate-500">
              {fromName} to {toName} taxi distance: {distanceKm ? `${distanceKm} km` : "…"}
              {fareFrom > 0 ? ` | ${fromName} to ${toName} cab fare from: ₹${formatInr(fareFrom)}` : ""}
            </p>
          ) : (
            <p className="mx-auto mt-2 max-w-2xl px-1 text-center text-sm text-slate-500">
              Book reliable and affordable cab services with Cabzii. Fare shown before you confirm.
            </p>
          )}
        </div>
      ) : null}
      <div className="section-shell grid gap-3 py-3 sm:gap-4 sm:py-4 lg:grid-cols-[minmax(17rem,20.5rem)_minmax(0,1fr)] lg:grid-rows-1 lg:py-5">
        <aside className="min-w-0 space-y-3 lg:row-start-1">
          <CityCabBookingWidget
            cityName={city.name}
            defaultFrom={searchTrip.from || city.name}
            defaultTo={searchTrip.to && searchTrip.to !== city.name ? searchTrip.to : ""}
            airportLabel={dropLabel}
            initialTrip={searchTrip}
            onSearch={handleSearch}
          />
          <div className="hidden space-y-3 lg:block">
            <TaxiContactCard cityName={city.name} />
            {localAreas.length ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-sm font-bold text-slate-900">Top cab routes in {city.name}</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {localAreas.map((area) => (
                    <li key={area}>
                      <button
                        type="button"
                        onClick={() => applyAreaRoute(area)}
                        className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-left text-[11px] font-semibold text-slate-700 hover:bg-slate-200"
                      >
                        {area} – {showAirport ? "Airport" : city.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </aside>

        <div className="min-w-0 lg:row-start-1 lg:flex lg:h-0 lg:min-h-full lg:flex-col lg:overflow-hidden lg:rounded-2xl lg:border lg:border-slate-200 lg:bg-white lg:shadow-sm">
          <div
            ref={cabListRef}
            className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-y-auto lg:p-4 lg:pb-8 lg:[scrollbar-width:thin] lg:[scrollbar-color:#cbd5e1_transparent]"
          >
            {loading && !showList ? (
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500 lg:border-0">
                Finding cabs for you…
              </div>
            ) : error && !showList ? (
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-rose-600 lg:border-0">
                {error}
              </div>
            ) : showList ? (
              <MmtCabResults cabs={fleet} trip={trip} embedded listLayout="fasttrack" />
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-slate-500 lg:border-0">
                No cabs found for this route.
                <div className="mt-3">
                  <Link href="/cabs" className="text-sm font-bold text-[#1a73e8] hover:underline">
                    Browse all cabs
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0 space-y-3 lg:hidden">
          <TaxiContactCard cityName={city.name} />
          {localAreas.length ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900">Top cab routes in {city.name}</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {localAreas.map((area) => (
                  <li key={area}>
                    <button
                      type="button"
                      onClick={() => applyAreaRoute(area)}
                      className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-left text-[11px] font-semibold text-slate-700 hover:bg-slate-200"
                    >
                      {area} – {showAirport ? "Airport" : city.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
