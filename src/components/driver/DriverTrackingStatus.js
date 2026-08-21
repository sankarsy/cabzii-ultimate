"use client";

import useDriverTripTracking, { trackingStatusLabel } from "../../lib/useDriverTripTracking";

const STYLES = {
  off: "bg-slate-100 text-slate-600",
  starting: "bg-amber-100 text-amber-800",
  active: "bg-emerald-100 text-emerald-800",
  stale: "bg-amber-100 text-amber-800",
  stopped: "bg-slate-200 text-slate-700",
  denied: "bg-rose-100 text-rose-800"
};

export default function DriverTrackingStatus({ trip }) {
  const { state, error, retry, active } = useDriverTripTracking(trip);
  if (!trip) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Location sharing</p>
      <p className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-bold ${STYLES[state] || STYLES.off}`}>
        {trackingStatusLabel(state)}
      </p>
      {active ? (
        <p className="mt-2 text-sm text-slate-600">Keep this screen open. Location is shared only while the trip is active.</p>
      ) : (
        <p className="mt-2 text-sm text-slate-600">Location is requested only after you start the trip.</p>
      )}
      {error ? <p className="mt-2 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p> : null}
      {state === "denied" ? (
        <button
          type="button"
          onClick={retry}
          className="mt-3 w-full rounded-2xl border border-slate-300 px-4 py-3 text-base font-bold text-slate-800"
        >
          Enable location
        </button>
      ) : null}
    </section>
  );
}
