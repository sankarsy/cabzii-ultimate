"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authHeaders } from "../../lib/auth";
import {
  formatClock,
  isOnTrip,
  mapsSearchHref,
  shortBookingId,
  telHref,
  tripPackageLabel,
  tripStatusLabel
} from "../../lib/driverUi";
import DriverTrackingStatus from "./DriverTrackingStatus";

export default function DriverTripDetail({ tripId }) {
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/driver/trips/${tripId}`, { headers: authHeaders(), cache: "no-store" });
      const json = await res.json();
      if (!res.ok || json?.success === false) throw new Error(json?.message || "Trip not found");
      setTrip(json.data);
    } catch (err) {
      setTrip(null);
      setError(err instanceof Error ? err.message : "Trip not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [tripId]);

  const act = async (action) => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/driver/trips/${tripId}/${action}`, {
        method: "POST",
        headers: authHeaders()
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) throw new Error(json?.message || "Action failed");
      setTrip(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-slate-600">Loading trip…</p>;
  if (!trip) {
    return (
      <div className="space-y-4">
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-800">{error || "Trip not found"}</p>
        <Link href="/driver/trips" className="text-sm font-semibold text-sky-700">
          ← Back to trips
        </Link>
      </div>
    );
  }

  const phone = telHref(trip.customerPhone);
  const canStart = trip.status === "confirmed" && !trip.tripStartedAt && !trip.tripFinishedAt;
  const canFinish = isOnTrip(trip);
  const pickupMap = mapsSearchHref(trip.pickup);
  const dropMap = mapsSearchHref(trip.drop);

  return (
    <div className="space-y-4">
      <Link href="/driver/trips" className="text-sm font-semibold text-sky-700">
        ← Back to trips
      </Link>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Booking #{shortBookingId(trip._id)}</p>
        <h1 className="mt-1 text-2xl font-bold">{trip.customerName || "Customer"}</h1>
        <p className="mt-1 text-base font-semibold text-slate-800">{tripStatusLabel(trip)}</p>
        {trip.customerPhone ? <p className="mt-1 text-lg font-bold">{trip.customerPhone}</p> : null}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 text-base">
        <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Schedule</p>
        <p className="mt-1 font-semibold">
          {trip.date || "—"} {trip.pickupTime ? `· ${trip.pickupTime}` : ""}
        </p>
        {trip.startAt ? <p className="text-sm text-slate-600">Window {formatClock(trip.startAt)} – {formatClock(trip.endAt)}</p> : null}
        {trip.tripStartedAt ? <p className="text-sm text-slate-600">Started {formatClock(trip.tripStartedAt)}</p> : null}
        {trip.tripFinishedAt ? <p className="text-sm text-slate-600">Finished {formatClock(trip.tripFinishedAt)}</p> : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 text-base">
        <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Pickup</p>
        <p className="mt-1 font-semibold">{trip.pickup || "TBD"}</p>
        {pickupMap ? (
          <a href={pickupMap} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-bold text-sky-700">
            Open pickup map
          </a>
        ) : null}
        <p className="mt-4 text-sm font-bold uppercase tracking-wide text-slate-500">Drop</p>
        <p className="mt-1 font-semibold">{trip.drop || "TBD"}</p>
        {dropMap ? (
          <a href={dropMap} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-bold text-sky-700">
            Open drop map
          </a>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 text-base">
        <p><span className="font-semibold">Vehicle:</span> {trip.assignedVehicleTitle || "TBD"}</p>
        <p className="mt-1"><span className="font-semibold">Package:</span> {tripPackageLabel(trip)}</p>
      </section>

      <DriverTrackingStatus trip={trip} />

      {error ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p> : null}

      {phone ? (
        <a href={phone} className="block rounded-2xl bg-emerald-600 px-4 py-4 text-center text-lg font-bold text-white">
          Call customer
        </a>
      ) : null}

      {canStart ? (
        <button
          type="button"
          disabled={saving}
          onClick={() => act("start")}
          className="w-full rounded-2xl bg-sky-600 px-4 py-4 text-lg font-bold text-white disabled:opacity-50"
        >
          {saving ? "Starting…" : "Start trip"}
        </button>
      ) : null}

      {canFinish ? (
        <button
          type="button"
          disabled={saving}
          onClick={() => act("finish")}
          className="w-full rounded-2xl bg-slate-900 px-4 py-4 text-lg font-bold text-white disabled:opacity-50"
        >
          {saving ? "Finishing…" : "Finish trip"}
        </button>
      ) : null}
    </div>
  );
}
