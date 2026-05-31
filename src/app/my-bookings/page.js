"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { authHeaders, formatMobileDisplay, getUser, isLoggedIn } from "../../lib/auth";
import { useRouter } from "next/navigation";

const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-slate-200 text-slate-700"
};

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = getUser();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login?next=/my-bookings");
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/bookings", { headers: authHeaders(), cache: "no-store" });
        const json = await res.json();
        if (!res.ok || json?.success === false) throw new Error(json?.message || "Could not load bookings");
        if (!cancelled) setBookings(Array.isArray(json?.data) ? json.data : []);
      } catch (err) {
        if (!cancelled) {
          setBookings([]);
          setError(err instanceof Error ? err.message : "Failed to load bookings");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const { upcoming, completed } = useMemo(() => {
    const up = [];
    const done = [];
    const today = new Date().toISOString().split("T")[0];
    for (const b of bookings) {
      if (b.status === "cancelled") {
        done.push(b);
      } else if (b.status === "confirmed" && b.date && b.date >= today) {
        up.push(b);
      } else if (b.status === "pending") {
        up.push(b);
      } else {
        done.push(b);
      }
    }
    return { upcoming: up, completed: done };
  }, [bookings]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
          <p className="mt-1 text-sm text-slate-600">
            {user?.mobileNumber ? formatMobileDisplay(user.mobileNumber) : "Your account"} · upcoming and past trips
          </p>

          {loading ? (
            <div className="mt-8 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-white shadow-sm" />
              ))}
            </div>
          ) : error ? (
            <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p>
          ) : (
            <div className="mt-6 space-y-8">
              <BookingGroup title="Upcoming" items={upcoming} empty="No upcoming bookings." />
              <BookingGroup title="Completed / other" items={completed} empty="No past bookings yet." />
            </div>
          )}

          <Link
            href="/cabs"
            className="mt-8 inline-flex rounded-xl bg-[#0056D2] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0047b3]"
          >
            Book a new cab
          </Link>
        </div>
      </section>
    </div>
  );
}

function BookingGroup({ title, items, empty }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {items.map((b) => (
            <li key={String(b._id)} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase text-[#0056D2]">{b.type}</p>
                  <p className="text-sm font-bold text-slate-900">
                    {b.pickup || "—"}
                    {b.drop ? ` → ${b.drop}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {b.date ? `Date: ${b.date}` : "Date TBD"} · ₹{Number(b.amount || 0).toLocaleString("en-IN")}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[b.status] || STATUS_STYLES.pending}`}
                >
                  {b.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
