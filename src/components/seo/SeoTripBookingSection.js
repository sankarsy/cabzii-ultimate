"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import MmtCabResults from "../mmt/MmtCabResults";
import MmtDriverResultCard from "../mmt/MmtDriverResultCard";
import MmtCabSearchWidget from "../mmt/MmtCabSearchWidget";
import MmtDriverSearchWidget from "../mmt/MmtDriverSearchWidget";

function formatPrice(n) {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return null;
  return `₹${v.toLocaleString("en-IN")}`;
}

/**
 * Compact booking block for SEO service/route pages.
 * Cab list uses the same filters + horizontal row cards as /cabs/results.
 */
export default function SeoTripBookingSection({
  title,
  pickup,
  drop,
  priceFrom,
  priceLabel,
  distance,
  duration,
  cabSearchHref,
  driverSearchHref,
  cabs = [],
  drivers = [],
  trip = null,
  showCabWidget = true,
  showDriverWidget = false,
  showDriverCta = false,
  widgetDefaultCity = "",
  widgetInitialTrip = null,
  /** Lock search widget to one trip type on SEO pages (e.g. ["outstation"]). */
  allowedTripTypes = null
}) {
  const priceText = priceLabel || formatPrice(priceFrom);
  const hasDrop = Boolean(String(drop || "").trim());
  const meta = [distance, duration].filter(Boolean).join(" · ");
  const showDrivers = showDriverCta || showDriverWidget;
  const catalogMode = !trip?.to;
  const lockedTypes =
    Array.isArray(allowedTripTypes) && allowedTripTypes.length
      ? allowedTripTypes
      : trip?.tripType
        ? [trip.tripType]
        : null;

  return (
    <section className="mt-6 space-y-4" aria-label={title || "Book online"}>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-slate-100 px-3 py-2.5 text-xs sm:px-4">
          <p className="inline-flex min-w-0 items-center gap-1 font-semibold text-slate-800">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={2} />
            <span className="truncate">{pickup || "Pickup"}</span>
          </p>
          <span className="text-slate-300" aria-hidden>
            →
          </span>
          <p className="inline-flex min-w-0 items-center gap-1 font-semibold text-slate-800">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-rose-400" strokeWidth={2} />
            <span className="truncate">{hasDrop ? drop : "Drop"}</span>
          </p>
          {priceText ? (
            <p className="ml-auto text-sm font-bold text-slate-900">
              {priceText}
              {meta ? <span className="ml-1.5 text-[11px] font-normal text-slate-500">{meta}</span> : null}
            </p>
          ) : null}
        </div>

        {showCabWidget ? (
          <div className="bg-slate-50/70 p-3 sm:p-3.5">
            <MmtCabSearchWidget
              defaultCity={widgetDefaultCity || pickup}
              initialTrip={widgetInitialTrip || trip}
              allowedTripTypes={lockedTypes}
              compact
            />
          </div>
        ) : null}

        {showDriverWidget ? (
          <div className="border-t border-slate-100 bg-slate-50/70 p-3 sm:p-3.5">
            <MmtDriverSearchWidget defaultCity={widgetDefaultCity || pickup} initialTrip={widgetInitialTrip || trip} />
          </div>
        ) : null}
      </div>

      {cabs?.length ? (
        <div>
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900">Available cabs</h3>
            {cabSearchHref ? (
              <Link href={cabSearchHref} className="text-[11px] font-semibold text-[var(--cabzii-brand)] hover:underline">
                View all →
              </Link>
            ) : null}
          </div>
          <MmtCabResults
            cabs={cabs}
            trip={trip}
            embedded
            catalogMode={catalogMode}
            displayCity={pickup}
          />
        </div>
      ) : null}

      {showDrivers && drivers?.length ? (
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900">Available drivers</h3>
            {driverSearchHref ? (
              <Link href={driverSearchHref} className="text-[11px] font-semibold text-[var(--cabzii-brand)] hover:underline">
                View all →
              </Link>
            ) : null}
          </div>
          <div className="flex flex-col gap-3">
            {drivers.slice(0, 6).map((driver) => (
              <MmtDriverResultCard
                key={String(driver._id || driver.id)}
                driver={driver}
                trip={trip}
                catalogMode={!trip?.to}
                displayCity={pickup}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
