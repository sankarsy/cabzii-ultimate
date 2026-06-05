"use client";

import dynamic from "next/dynamic";
import { formatDistance, formatDuration } from "../../lib/tripCoords";
import { useTripRoute } from "../../lib/useTripRoute";
import { tripNeedsDrop } from "../../lib/mmtTrip";

const TripRouteMap = dynamic(() => import("./TripRouteMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-44 w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-500">
      Loading map…
    </div>
  )
});

export default function TripRoutePanel({ trip, compact = false }) {
  const { route, loading, error } = useTripRoute(trip);
  const showRoute = tripNeedsDrop(trip?.tripType) && trip?.from && trip?.to;

  if (!showRoute) return null;

  const distance = route?.distanceKm ?? trip?.distanceKm;
  const duration = route?.durationMin ?? trip?.durationMin;

  return (
    <div className={compact ? "mt-3" : "mt-4 space-y-3"}>
      <div className="flex flex-wrap items-center gap-3 text-sm">
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
            {route?.estimated ? (
              <span className="text-xs text-slate-500">Estimated route</span>
            ) : null}
          </>
        ) : error ? (
          <span className="text-xs text-amber-700">{error}</span>
        ) : null}
      </div>
      <TripRouteMap
        fromLat={route?.fromLat ?? trip?.fromLat}
        fromLng={route?.fromLng ?? trip?.fromLng}
        toLat={route?.toLat ?? trip?.toLat}
        toLng={route?.toLng ?? trip?.toLng}
        geometry={route?.geometry}
        className={compact ? "h-36 w-full rounded-xl" : "h-48 w-full rounded-xl sm:h-56"}
      />
    </div>
  );
}
