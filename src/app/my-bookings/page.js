"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { authHeaders, buildLoginHref, formatMobileDisplay, getUser, isLoggedIn } from "../../lib/auth";
import { useRouter } from "next/navigation";
import BookingReviewForm from "../../components/reviews/BookingReviewForm";

const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  finished: "bg-sky-100 text-sky-800",
  cancelled: "bg-slate-200 text-slate-700"
};

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [finishingId, setFinishingId] = useState("");
  const user = getUser();

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", { headers: authHeaders(), cache: "no-store" });
      const json = await res.json();
      if (!res.ok || json?.success === false) throw new Error(json?.message || "Could not load bookings");
      setBookings(Array.isArray(json?.data) ? json.data : []);
    } catch (err) {
      setBookings([]);
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace(buildLoginHref("/my-bookings", "customer"));
      return;
    }
    loadBookings();
  }, [router, loadBookings]);

  const handleFinish = async (bookingId) => {
    setFinishingId(bookingId);
    setError("");
    try {
      const res = await fetch(`/api/bookings/${bookingId}/finish`, {
        method: "PATCH",
        headers: authHeaders()
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Could not finish booking");
      }
      await loadBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not finish booking");
    } finally {
      setFinishingId("");
    }
  };

  const { upcoming, completed, summary } = useMemo(() => {
    const up = [];
    const done = [];
    let totalAmount = 0;
    for (const b of bookings) {
      totalAmount += Number(b.amount || 0);
      if (b.status === "finished" || b.status === "cancelled") {
        done.push(b);
      } else if (b.status === "confirmed" || b.status === "pending") {
        up.push(b);
      } else {
        done.push(b);
      }
    }
    return {
      upcoming: up,
      completed: done,
      summary: {
        count: bookings.length,
        total: totalAmount
      }
    };
  }, [bookings]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
          <p className="mt-1 text-sm text-slate-600">
            {user?.mobileNumber ? formatMobileDisplay(user.mobileNumber) : "Your account"} · upcoming and past trips
          </p>
          {!loading && !error && bookings.length > 0 ? (
            <p className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0056D2]">
              {summary.count} booking{summary.count === 1 ? "" : "s"} · ₹{summary.total.toLocaleString("en-IN")} total
            </p>
          ) : null}

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
              <BookingGroup
                title="Upcoming"
                items={upcoming}
                empty="No upcoming bookings."
                onFinish={handleFinish}
                finishingId={finishingId}
              />
              <BookingGroup
                title="Completed / other"
                items={completed}
                empty="No past bookings yet."
                onFinish={handleFinish}
                finishingId={finishingId}
              />
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

function BookingGroup({ title, items, empty, onFinish, finishingId }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {items.map((b) => (
            <BookingCard
              key={String(b._id)}
              booking={b}
              onFinish={onFinish}
              finishing={finishingId === String(b._id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function BookingCard({ booking, onFinish, finishing }) {
  const contact = booking.vendorContact;
  const showContact = booking.status === "confirmed" && contact && (contact.phone || contact.whatsapp || contact.name);

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase text-[#0056D2]">{booking.type}</p>
          <p className="text-sm font-bold text-slate-900">
            {booking.itemTitle || booking.type || "Booking"}
          </p>
          <p className="mt-0.5 text-xs text-slate-600">
            {booking.pickup || "—"}
            {booking.drop ? ` → ${booking.drop}` : ""}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {booking.date ? `Date: ${booking.date}` : "Date TBD"}
            {booking.pickupTime ? ` · ${booking.pickupTime}` : ""} · ₹
            {Number(booking.amount || 0).toLocaleString("en-IN")}
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[booking.status] || STATUS_STYLES.pending}`}
        >
          {booking.status}
        </span>
      </div>

      {showContact ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-950">
          <p className="font-semibold">Your trip contact</p>
          {contact.name ? <p className="mt-1">{contact.name}</p> : null}
          {contact.phone ? (
            <p className="mt-1">
              Phone:{" "}
              <a href={`tel:${contact.phone}`} className="font-semibold underline">
                {contact.phone}
              </a>
            </p>
          ) : null}
          {contact.whatsapp ? (
            <p className="mt-1">
              WhatsApp:{" "}
              <a
                href={`https://wa.me/91${String(contact.whatsapp).replace(/\D/g, "").slice(-10)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
              >
                {contact.whatsapp}
              </a>
            </p>
          ) : null}
          {contact.email ? <p className="mt-1">Email: {contact.email}</p> : null}
          {contact.notes ? <p className="mt-2 text-xs text-emerald-800">{contact.notes}</p> : null}
        </div>
      ) : null}

      {booking.status === "confirmed" ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onFinish(String(booking._id))}
            disabled={finishing}
            className="rounded-lg bg-[#0056D2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0047b3] disabled:opacity-60"
          >
            {finishing ? "Saving…" : "Mark trip as finished"}
          </button>
          <p className="text-xs text-slate-500">Contact details are removed after you finish the trip.</p>
        </div>
      ) : null}

      {booking.status === "finished" ? (
        <>
          <p className="mt-3 text-xs text-slate-500">Trip completed. Contact details are no longer shown.</p>
          {booking.type === "cab" || booking.type === "driver" ? <BookingReviewForm booking={booking} /> : null}
        </>
      ) : null}

      {booking.status === "pending" ? (
        <p className="mt-3 text-xs text-amber-800">Waiting for confirmation. Driver contact will appear here once confirmed.</p>
      ) : null}
    </li>
  );
}
