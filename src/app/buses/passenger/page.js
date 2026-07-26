"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import MmtLayout from "../../../components/mmt/MmtLayout";
import BusBookingSummary from "../../../components/bus/BusBookingSummary";
import { resolveBusTrip } from "../../../lib/busCatalog";
import { saveCheckoutDraft } from "../../../lib/checkoutStorage";
import { buildLoginHref, getToken, getUser } from "../../../lib/auth";

function BusPassengerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripId = searchParams.get("id") || "";
  const seatsParam = searchParams.get("seats") || "";
  const boarding = searchParams.get("boarding") || "";
  const dropping = searchParams.get("dropping") || "";
  const total = Number(searchParams.get("total") || 0);
  const [trip, setTrip] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const user = getUser();
    if (user?.mobileNumber) setPhone(user.mobileNumber);
    resolveBusTrip({
      id: tripId,
      from: searchParams.get("from") || "",
      to: searchParams.get("to") || "",
      date: searchParams.get("date") || ""
    }).then(setTrip);
  }, [tripId, searchParams]);

  const seatIds = seatsParam.split(",").filter(Boolean);
  const selectedSeats = seatIds.map((id) => {
    const seat = trip?.seatLayout?.find((s) => s.id === id);
    return { id, price: total / Math.max(seatIds.length, 1), type: seat?.type };
  });

  function payNow() {
    if (!name.trim() || !phone.trim() || seatIds.length === 0) return;
    if (!getToken()) {
      const next = `/buses/passenger?${searchParams.toString()}`;
      router.push(buildLoginHref(next, "customer"));
      return;
    }
    saveCheckoutDraft({ type: "bus", customerName: name, phone, email });
    const q = new URLSearchParams({
      type: "bus",
      id: tripId,
      pickup: boarding,
      drop: dropping,
      date: searchParams.get("date") || "",
      total: String(total),
      baseFare: String(total),
      seats: seatsParam,
      from: trip?.fromCity || searchParams.get("from") || "",
      to: trip?.toCity || searchParams.get("to") || "",
      operator: trip?.operator?.name || ""
    });
    router.push(`/payment?${q.toString()}`);
  }

  return (
    <div className="section-shell py-6">
      <Link href={`/buses/seats?${searchParams.toString()}`} className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
        ← Change seats
      </Link>

      <header className="mt-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Passenger details</h1>
        <p className="text-sm text-slate-600">Enter contact details for ticket confirmation</p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        <div className="cabzii-card space-y-4 p-5">
          <label className="block text-sm font-semibold text-slate-700">
            Full name *
            <input className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" value={name} onChange={(e) => setName(e.target.value)} placeholder="As on ID proof" />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Mobile number *
            <input className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile" inputMode="tel" />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Email (optional)
            <input className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="For e-ticket" type="email" />
          </label>
          <p className="text-xs text-slate-500">Seat numbers: {seatIds.join(", ") || "—"}</p>
        </div>
        <div>
          <BusBookingSummary trip={trip} selectedSeats={selectedSeats} boarding={boarding} dropping={dropping} total={total} />
          <button type="button" onClick={payNow} className="cabzii-btn cabzii-btn-primary mt-4 w-full py-3">
            Proceed to payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BusPassengerPage() {
  return (
    <MmtLayout>
      <Suspense fallback={<div className="section-shell py-16 text-center text-slate-500">Loading…</div>}>
        <BusPassengerContent />
      </Suspense>
    </MmtLayout>
  );
}
