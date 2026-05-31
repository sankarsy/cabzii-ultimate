"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MmtTripSummaryBar from "../../../components/mmt/MmtTripSummaryBar";
import { buildFareSlabs, num, packageYouPay } from "../../../lib/cabFare";
import { getUser, isLoggedIn } from "../../../lib/auth";
import { resolveMediaUrl } from "../../../lib/media";
import { cabSlabForTrip, parseTripSearchParams, tripToSearchQuery } from "../../../lib/mmtTrip";

const CHECKOUT_KEY = "cabzii-checkout";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    Number(n) || 0
  );
}

function PassengerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trip = parseTripSearchParams(searchParams);
  const cabId = searchParams.get("cabId") || searchParams.get("id");

  const [cab, setCab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const user = getUser();
    if (user?.mobileNumber) setPhone(user.mobileNumber);
  }, []);

  useEffect(() => {
    if (!cabId) {
      router.replace("/");
      return;
    }
    fetch(`/api/cabs/${cabId}`)
      .then((r) => r.json())
      .then((json) => {
        if (json?.data) setCab(json.data);
        else setError("Cab not found");
      })
      .catch(() => setError("Could not load cab"))
      .finally(() => setLoading(false));
  }, [cabId, router]);

  const slabs = cab ? buildFareSlabs(cab) : [];
  const slab = cabSlabForTrip(slabs, trip);
  const listPrice = num(slab?.originalPrice) || num(slab?.list) || num(cab?.price);
  const discount = num(slab?.discountPercentage) || num(cab?.discountPercentage);
  const total = num(slab?.price) > 0 ? num(slab.price) : packageYouPay(listPrice, discount);
  const gst = Math.round(total * 0.05);
  const grandTotal = total + gst;

  async function handleContinue() {
    setError("");
    if (!isLoggedIn()) {
      const next = `/cabs/passenger?${searchParams.toString()}`;
      router.push(`/login?next=${encodeURIComponent(next)}`);
      return;
    }
    if (!name.trim() || !phone.trim()) {
      setError("Enter passenger name and mobile number.");
      return;
    }
    setSubmitting(true);
    try {
      const payParams = new URLSearchParams(tripToSearchQuery(trip));
      payParams.set("type", "cab");
      payParams.set("id", cabId);
      payParams.set("total", String(grandTotal));
      payParams.set("baseFare", String(total));
      payParams.set("taxes", String(gst));
      payParams.set("pickup", trip.from);
      if (trip.to) payParams.set("drop", trip.to);
      payParams.set("date", trip.date);
      payParams.set("time", trip.time);
      if (trip.roundTrip) payParams.set("roundTrip", "true");
      if (trip.packageHours) payParams.set("packageHours", String(trip.packageHours));
      if (slab?.id) payParams.set("packageId", slab.id);
      if (slab?.label) payParams.set("package", slab.label);
      payParams.set("listPrice", String(listPrice));
      payParams.set("discountPct", String(discount));
      payParams.set("discountAmount", String(Math.max(0, listPrice - total)));

      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          CHECKOUT_KEY,
          JSON.stringify({ customerName: name.trim(), phone: phone.trim(), email: email.trim() })
        );
      }
      router.push(`/payment?${payParams.toString()}`);
    } catch (e) {
      setError(e.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="py-16 text-center text-slate-500">Loading…</div>;
  }

  if (!cab) {
    return <div className="py-16 text-center text-rose-600">{error || "Cab not found"}</div>;
  }

  return (
    <>
      <MmtTripSummaryBar trip={trip} />
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Traveller details</h2>
          <p className="mt-1 text-sm text-slate-600">Enter details for the primary passenger</p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mmt-search-label">Full name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                placeholder="As on ID"
              />
            </div>
            <div>
              <label className="mmt-search-label">Mobile number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                placeholder="10-digit mobile"
              />
            </div>
            <div>
              <label className="mmt-search-label">Email (optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
              />
            </div>
          </div>
          {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
          <button
            type="button"
            disabled={submitting}
            onClick={handleContinue}
            className="mt-6 w-full rounded-full bg-[var(--cabzii-brand)] py-3 text-base font-bold text-white hover:bg-[var(--cabzii-brand-hover)] disabled:opacity-60"
          >
            {submitting ? "Processing…" : "Continue to payment"}
          </button>
        </div>

        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-20">
          {resolveMediaUrl(cab.image) ? (
            <img src={resolveMediaUrl(cab.image)} alt="" className="mb-3 h-24 w-full rounded-lg object-cover" />
          ) : null}
          <h3 className="font-bold text-slate-900">{cab.title}</h3>
          <p className="text-sm text-slate-500">{cab.type} · {cab.vendor}</p>
          <hr className="my-4 border-slate-100" />
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Base fare</span>
              <span>{formatINR(total)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span>{formatINR(gst)}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-slate-100 pt-3 text-base font-bold text-slate-900">
            <span>Total</span>
            <span>{formatINR(grandTotal)}</span>
          </div>
        </aside>
      </div>
    </>
  );
}

export default function PassengerPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center">Loading…</div>}>
      <PassengerContent />
    </Suspense>
  );
}
