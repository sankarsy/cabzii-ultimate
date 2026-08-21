"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authHeaders } from "../../lib/auth";
import { useDriverUser } from "./DriverGuard";
import { isOnTrip, pickNextTrip } from "../../lib/driverUi";
import DriverTripCard from "./DriverTripCard";

export default function DriverDashboard() {
  const driver = useDriverUser();
  const [data, setData] = useState({ today: [], upcoming: [], current: [] });
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
        if (!cancelled) setData(json.data || { today: [], upcoming: [], current: [] });
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

  const current = (data.current || []).find(isOnTrip) || null;
  const next = pickNextTrip(data.today, data.upcoming);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl bg-slate-900 px-4 py-5 text-white">
        <p className="text-sm text-slate-300">Hello</p>
        <h1 className="text-2xl font-bold">{driver?.name || "Driver"}</h1>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/10 px-3 py-3">
            <p className="text-3xl font-bold">{data.today?.length || 0}</p>
            <p className="text-sm text-slate-200">Today</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-3 py-3">
            <p className="text-3xl font-bold">{data.upcoming?.length || 0}</p>
            <p className="text-sm text-slate-200">Upcoming</p>
          </div>
        </div>
      </section>

      {error ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-600">Loading trips…</p> : null}

      {current ? (
        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wide text-sky-700">Current trip</h2>
          <DriverTripCard trip={current} />
        </section>
      ) : null}

      {!current && next ? (
        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Next trip</h2>
          <DriverTripCard trip={next} />
        </section>
      ) : null}

      {!loading && !current && !next ? (
        <p className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-600">
          No assigned trips right now.
        </p>
      ) : null}

      <Link href="/driver/trips" className="block rounded-2xl bg-sky-600 px-4 py-4 text-center text-base font-bold text-white">
        View all trips
      </Link>
    </div>
  );
}
