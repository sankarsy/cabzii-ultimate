"use client";

import Link from "next/link";
import { isOnTrip, mapsSearchHref, shortBookingId, telHref, tripPackageLabel, tripStatusLabel } from "../../lib/driverUi";

const STATUS_CLASS = {
  Pending: "bg-amber-100 text-amber-800",
  Confirmed: "bg-emerald-100 text-emerald-800",
  "On trip": "bg-sky-100 text-sky-800",
  Finished: "bg-slate-200 text-slate-700",
  Cancelled: "bg-rose-100 text-rose-800"
};

export default function DriverTripCard({ trip }) {
  if (!trip) return null;
  const status = tripStatusLabel(trip);
  const phone = telHref(trip.customerPhone);
  const pickupMap = mapsSearchHref(trip.pickup);
  const dropMap = mapsSearchHref(trip.drop);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">#{shortBookingId(trip._id)}</p>
          <p className="text-lg font-bold leading-tight">{trip.customerName || "Customer"}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${STATUS_CLASS[status] || "bg-slate-100 text-slate-700"}`}>
          {status}
        </span>
      </div>
      <p className="mt-3 text-base font-semibold">
        {trip.date || "—"} {trip.pickupTime ? `· ${trip.pickupTime}` : ""}
      </p>
      <p className="mt-2 text-sm text-slate-800">
        {trip.pickup || "Pickup TBD"}
        {trip.drop ? ` → ${trip.drop}` : ""}
      </p>
      <p className="mt-1 text-sm text-slate-600">
        {trip.assignedVehicleTitle || "Vehicle TBD"} · {tripPackageLabel(trip)}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {phone ? (
          <a href={phone} className="rounded-2xl bg-emerald-600 px-3 py-3 text-center text-sm font-bold text-white">
            Call
          </a>
        ) : (
          <span className="rounded-2xl bg-slate-100 px-3 py-3 text-center text-sm font-semibold text-slate-400">No phone</span>
        )}
        <Link
          href={`/driver/trips/${trip._id}`}
          className="rounded-2xl bg-slate-900 px-3 py-3 text-center text-sm font-bold text-white"
        >
          {isOnTrip(trip) ? "Continue" : "Open"}
        </Link>
      </div>
      {(pickupMap || dropMap) && (
        <div className="mt-2 flex gap-3 text-sm font-semibold text-sky-700">
          {pickupMap ? (
            <a href={pickupMap} target="_blank" rel="noreferrer">
              Pickup map
            </a>
          ) : null}
          {dropMap ? (
            <a href={dropMap} target="_blank" rel="noreferrer">
              Drop map
            </a>
          ) : null}
        </div>
      )}
    </article>
  );
}
