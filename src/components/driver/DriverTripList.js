"use client";

import { useEffect, useState } from "react";
import { authHeaders } from "../../lib/auth";
import DriverTripCard from "./DriverTripCard";

export default function DriverTripList() {
  const [data, setData] = useState({ today: [], upcoming: [] });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/driver/trips", { headers: authHeaders(), cache: "no-store" });
        const json = await res.json();
        if (!res.ok || json?.success === false) throw new Error(json?.message || "Could not load trips");
        if (!cancelled) setData(json.data || { today: [], upcoming: [] });
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load trips");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Trips</h1>
      {error ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-600">Loading trips…</p> : null}

      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Today</h2>
        {(data.today || []).length ? (
          data.today.map((trip) => <DriverTripCard key={trip._id} trip={trip} />)
        ) : (
          <p className="text-sm text-slate-600">No trips today.</p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Upcoming</h2>
        {(data.upcoming || []).length ? (
          data.upcoming.map((trip) => <DriverTripCard key={trip._id} trip={trip} />)
        ) : (
          <p className="text-sm text-slate-600">No upcoming trips.</p>
        )}
      </section>
    </div>
  );
}
