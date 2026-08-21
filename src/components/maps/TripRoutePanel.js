"use client";

import dynamic from "next/dynamic";
import { formatDistance, formatDuration } from "../../lib/tripCoords";
import { useTripRoute } from "../../lib/useTripRoute";
import { tripNeedsDrop } from "../../lib/mmtTrip";

const TripRouteMap = dynamic(() => import("./TripRouteMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[7.25rem] w-[11.5rem] animate-pulse rounded-lg bg-slate-100 sm:w-[13.5rem]" />
  )
});

function cityName(value) {
  return String(value || "")
    .split(",")[0]
    .trim();
}

export default function TripRoutePanel({ trip, compact = false }) {
  const { route, loading, error } = useTripRoute(trip);
  const showRoute = tripNeedsDrop(trip?.tripType) && trip?.from && trip?.to;

  if (!showRoute) return null;

  const distance = route?.distanceKm ?? trip?.distanceKm;
  const duration = route?.durationMin ?? trip?.durationMin;
  const fromLabel = cityName(trip.from);
  const toLabel = cityName(trip.to);

  const map = (
    <TripRouteMap
      fromLat={route?.fromLat ?? trip?.fromLat}
      fromLng={route?.fromLng ?? trip?.fromLng}
      toLat={route?.toLat ?? trip?.toLat}
      toLng={route?.toLng ?? trip?.toLng}
      geometry={route?.geometry}
      compact={compact}
      className={
        compact
          ? "h-[7.25rem] w-full max-w-[13.5rem] shrink-0 rounded-lg sm:h-[7.5rem] sm:w-[13.5rem]"
          : "h-36 w-full max-w-xl rounded-xl"
      }
    />
  );

  if (compact) {
    return (
      <div className="flex flex-col items-stretch gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-slate-900">
            {fromLabel} <span className="font-semibold text-slate-400">→</span> {toLabel}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            {loading && !distance ? (
              <span className="text-slate-500">Calculating route…</span>
            ) : distance ? (
              <>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-[var(--cabzii-brand)]">
                  {formatDistance(distance)}
                </span>
                {duration ? (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                    ~{formatDuration(duration)}
                  </span>
                ) : null}
                {route?.estimated ? <span className="text-[11px] text-slate-400">Estimated</span> : null}
              </>
            ) : error ? (
              <span className="text-amber-700">{error}</span>
            ) : null}
          </div>
        </div>
        <div className="flex justify-start sm:justify-end">{map}</div>
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {loading && !distance ? (
          <span className="text-slate-500">Calculating route…</span>
        ) : distance ? (
          <>
            <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-[var(--cabzii-brand)]">
              {formatDistance(distance)}
            </span>
            {duration ? (
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                ~{formatDuration(duration)}
              </span>
            ) : null}
          </>
        ) : error ? (
          <span className="text-xs text-amber-700">{error}</span>
        ) : null}
      </div>
      {map}
    </div>
  );
}
