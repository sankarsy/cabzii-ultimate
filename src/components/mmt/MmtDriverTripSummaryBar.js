"use client";

import Link from "next/link";
import { UserCheckIcon } from "../icons";
import { formatDistance, formatDuration } from "../../lib/tripCoords";
import { useTripRoute } from "../../lib/useTripRoute";
import { tripNeedsDrop } from "../../lib/mmtTrip";
import { driverPackageLabel, driverTripSummaryLabel, driverTripTypeLabel } from "../../lib/driverTrip";
import { tripToHomeHref } from "../../lib/routeTrip";

export default function MmtDriverTripSummaryBar({ trip }) {
  const label = driverTripTypeLabel(trip);
  const pkg = driverPackageLabel(trip.packageId);
  const { route, loading } = useTripRoute(trip);
  const distance = route?.distanceKm ?? trip?.distanceKm;
  const duration = route?.durationMin ?? trip?.durationMin;
  const showDistance = tripNeedsDrop(trip?.tripType) && trip?.from && trip?.to;

  return (
    <div className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-sky-700">{label}</p>
          <h1 className="flex items-start gap-2 text-base font-bold text-slate-900 sm:text-lg">
            <UserCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" aria-hidden="true" />
            {driverTripSummaryLabel(trip)}
          </h1>
          <p className="mt-0.5 text-xs text-slate-600">Package: {pkg}</p>
          {showDistance ? (
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              {loading && !distance ? (
                <span className="text-xs text-slate-500">Calculating distance…</span>
              ) : distance ? (
                <>
                  <span className="rounded-full bg-white px-3 py-0.5 text-xs font-bold text-slate-800 ring-1 ring-slate-200">
                    {formatDistance(distance)}
                  </span>
                  {duration ? <span className="text-xs text-slate-600">~{formatDuration(duration)}</span> : null}
                </>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span>📅 {trip.date}</span>
          <span>🕐 {trip.time}</span>
          <Link
            href={tripToHomeHref(trip, "drivers")}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100"
          >
            ✏️ Modify
          </Link>
        </div>
      </div>
    </div>
  );
}
