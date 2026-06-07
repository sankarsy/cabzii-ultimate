"use client";

import Link from "next/link";
import { MapPinIcon } from "../icons";
import { formatDistance, formatDuration } from "../../lib/tripCoords";
import { useTripRoute } from "../../lib/useTripRoute";
import { tripToHomeHref } from "../../lib/routeTrip";
import { tripSummaryLabel, tripTypeLabel, tripNeedsDrop } from "../../lib/mmtTrip";

export default function MmtTripSummaryBar({ trip }) {
  const label = tripTypeLabel(trip);
  const { route, loading } = useTripRoute(trip);
  const distance = route?.distanceKm ?? trip?.distanceKm;
  const duration = route?.durationMin ?? trip?.durationMin;
  const showDistance = tripNeedsDrop(trip?.tripType) && trip?.from && trip?.to;

  return (
    <div className="bg-mmt-header text-mmt-header-fg">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide opacity-80">{label}</p>
          <h1 className="flex items-start gap-2 text-lg font-bold text-mmt-header-fg sm:text-xl">
            <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 opacity-90" aria-hidden="true" />
            {tripSummaryLabel(trip)}
          </h1>
          {showDistance ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {loading && !distance ? (
                <span className="text-xs opacity-90">Calculating distance…</span>
              ) : distance ? (
                <>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold">
                    {formatDistance(distance)}
                  </span>
                  {duration ? (
                    <span className="text-xs opacity-90">~{formatDuration(duration)}</span>
                  ) : null}
                </>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span>📅 {trip.date}</span>
          <span>🕐 {trip.time}</span>
          <Link
            href={tripToHomeHref(trip, "cabs")}
            className="rounded-full bg-white/10 px-3 py-1.5 font-semibold transition hover:bg-white/20"
          >
            ✏️ Modify
          </Link>
        </div>
      </div>
    </div>
  );
}
