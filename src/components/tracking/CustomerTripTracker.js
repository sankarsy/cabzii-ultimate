"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useBookingLocation from "../../lib/useBookingLocation";
import {
  formatUpdatedAgo,
  locationErrorMessage,
  trackingHeadline,
  trackingStateLabel
} from "../../lib/customerTrackingUi";
import { buildLoginHref } from "../../lib/auth";

const LiveTripMap = dynamic(() => import("../maps/LiveTripMap"), {
  ssr: false,
  loading: () => <div className="h-64 w-full animate-pulse rounded-xl bg-slate-100" />
});

const STATE_STYLES = {
  live: "bg-emerald-100 text-emerald-800",
  recent: "bg-sky-100 text-sky-800",
  stale: "bg-amber-100 text-amber-800",
  not_started: "bg-slate-100 text-slate-700",
  finished: "bg-slate-200 text-slate-700"
};

export default function CustomerTripTracker({ bookingId }) {
  const router = useRouter();
  const { data, error, statusCode, loading } = useBookingLocation(bookingId);
  const vehicle = data?.latestLocation;
  const state = String(data?.trackingState || "");
  const headline = trackingHeadline(data);
  const updatedLabel = formatUpdatedAgo(vehicle?.updatedAt);

  useEffect(() => {
    if (statusCode === 401) {
      router.replace(buildLoginHref(`/my-bookings/${bookingId}/track`, "customer"));
    }
  }, [statusCode, bookingId, router]);

  return (
    <div className="section-shell py-6">
      <Link href="/my-bookings" className="text-sm font-semibold text-[#0056D2]">
        ← My Bookings
      </Link>

      <h1 className="mt-4 text-xl font-bold text-slate-900 sm:text-2xl">{headline}</h1>

      {loading && !data ? (
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-slate-100" />
      ) : statusCode === 401 ? (
        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {locationErrorMessage(401)}
        </p>
      ) : statusCode === 403 || statusCode === 404 ? (
        <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          {error || locationErrorMessage(statusCode)}
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          <LiveTripMap
            pickupLat={data?.pickupLat}
            pickupLng={data?.pickupLng}
            dropLat={data?.dropLat}
            dropLng={data?.dropLng}
            vehicleLat={vehicle?.latitude}
            vehicleLng={vehicle?.longitude}
            className="h-64 w-full rounded-2xl sm:h-80"
          />

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#0056D2]" />
                Vehicle location
              </span>
              {state ? (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${STATE_STYLES[state] || STATE_STYLES.not_started}`}
                >
                  {trackingStateLabel(state)}
                </span>
              ) : null}
            </div>

            {state === "finished" ? (
              <p className="mt-2 text-sm text-slate-600">Trip completed</p>
            ) : null}

            {vehicle && state !== "not_started" && state !== "finished" ? (
              <p className="mt-1 text-sm text-slate-600">{updatedLabel || "Last update time unavailable"}</p>
            ) : state === "finished" && vehicle ? (
              <p className="mt-1 text-sm text-slate-600">
                Last known location{updatedLabel ? ` · ${updatedLabel}` : ""}
              </p>
            ) : state === "not_started" ? (
              <p className="mt-2 text-sm text-slate-600">Tracking will be available when your trip starts.</p>
            ) : (
              <p className="mt-2 text-sm text-slate-600">Location unavailable right now.</p>
            )}

            {error && statusCode !== 401 && statusCode !== 403 && statusCode !== 404 ? (
              <p className="mt-2 text-sm text-amber-800">{error}</p>
            ) : null}

            {data?.driverName ? (
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase text-slate-500">Driver</p>
                <p className="text-sm font-semibold text-slate-900">{data.driverName}</p>
              </div>
            ) : null}

            {data?.vehicleTitle ? (
              <div className="mt-3">
                <p className="text-[11px] font-bold uppercase text-slate-500">Vehicle</p>
                <p className="text-sm font-semibold text-slate-900">{data.vehicleTitle}</p>
              </div>
            ) : null}

            <div className="mt-3">
              <p className="text-[11px] font-bold uppercase text-slate-500">Pickup</p>
              <p className="text-sm text-slate-800">{data?.pickup || "—"}</p>
            </div>
            <div className="mt-3">
              <p className="text-[11px] font-bold uppercase text-slate-500">Drop</p>
              <p className="text-sm text-slate-800">{data?.drop || "—"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
