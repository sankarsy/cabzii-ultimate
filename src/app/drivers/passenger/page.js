"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MmtDriverTripSummaryBar from "../../../components/mmt/MmtDriverTripSummaryBar";
import TripRoutePanel from "../../../components/maps/TripRoutePanel";
import { buildDriverFareSlabs } from "../../../lib/driverFare";
import { resolveDriverTripFare } from "../../../lib/distanceFare";
import { buildLoginHref, getUser, isLoggedIn } from "../../../lib/auth";
import { loadCheckoutDraft, saveCheckoutDraft } from "../../../lib/checkoutStorage";
import { appendTripCoords } from "../../../lib/tripCoords";
import { resolveMediaUrl } from "../../../lib/media";
import {
  driverSlabForTrip,
  driverTripToSearchQuery,
  parseDriverTripSearchParams
} from "../../../lib/driverTrip";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    Number(n) || 0
  );
}

function DriverPassengerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trip = parseDriverTripSearchParams(searchParams);
  const driverId = searchParams.get("driverId") || searchParams.get("id");

  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [autoContinue, setAutoContinue] = useState(false);

  useEffect(() => {
    const saved = loadCheckoutDraft();
    const user = getUser();
    const restoredName = saved.customerName || "";
    const restoredPhone = saved.phone || user?.mobileNumber || "";
    const restoredEmail = saved.email || "";
    if (restoredName) setName(restoredName);
    if (restoredEmail) setEmail(restoredEmail);
    if (restoredPhone) setPhone(restoredPhone);
    if (saved.pendingResume && isLoggedIn() && restoredName.trim() && restoredPhone.trim()) {
      saveCheckoutDraft({ pendingResume: false });
      setAutoContinue(true);
    }
  }, []);

  useEffect(() => {
    if (!autoContinue || loading || !driver) return;
    setAutoContinue(false);
    handleContinue();
  }, [autoContinue, loading, driver]);

  useEffect(() => {
    if (!driverId) {
      router.replace("/");
      return;
    }
    fetch(`/api/drivers/${driverId}`)
      .then((r) => r.json())
      .then((json) => {
        if (json?.data) setDriver(json.data);
        else setError("Driver not found");
      })
      .catch(() => setError("Could not load driver"))
      .finally(() => setLoading(false));
  }, [driverId, router]);

  const slabs = driver ? buildDriverFareSlabs(driver) : [];
  const slab = driverSlabForTrip(slabs, trip);
  const fare = driver && slab ? resolveDriverTripFare(driver, slab, trip) : { listPrice: 0, total: 0, discountPct: 0, discountAmount: 0, perKmRate: 0, usesDistance: false };
  const listPrice = fare.listPrice;
  const discount = fare.discountPct;
  const total = fare.total;
  const displayName = driver?.name || driver?.serviceTitle || "Driver";

  async function handleContinue() {
    setError("");
    if (!name.trim() || !phone.trim()) {
      setError("Enter your name and mobile number.");
      return;
    }
    saveCheckoutDraft({
      customerName: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      pickup: trip.from,
      drop: trip.to || "",
      date: trip.date
    });
    if (!isLoggedIn()) {
      saveCheckoutDraft({ pendingResume: true });
      const next = `/drivers/passenger?${searchParams.toString()}`;
      router.push(buildLoginHref(next, "customer"));
      return;
    }
    setSubmitting(true);
    try {
      const payParams = new URLSearchParams(driverTripToSearchQuery(trip));
      payParams.set("type", "driver");
      payParams.set("id", driverId);
      payParams.set("total", String(total));
      payParams.set("baseFare", String(total));
      payParams.set("taxes", "0");
      payParams.set("pickup", trip.from);
      if (trip.to) payParams.set("drop", trip.to);
      payParams.set("date", trip.date);
      payParams.set("time", trip.time);
      if (trip.roundTrip) payParams.set("roundTrip", "true");
      if (trip.packageHours) payParams.set("packageHours", String(trip.packageHours));
      if (slab?.id) payParams.set("packageId", slab.id);
      if (slab?.label) payParams.set("package", slab.label);
      if (fare.perKmRate) payParams.set("extraKm", String(fare.perKmRate));
      payParams.set("listPrice", String(listPrice));
      payParams.set("discountPct", String(discount));
      payParams.set("discountAmount", String(Math.max(0, listPrice - total)));
      appendTripCoords(payParams, trip);

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

  if (!driver) {
    return <div className="py-16 text-center text-rose-600">{error || "Driver not found"}</div>;
  }

  return (
    <>
      <MmtDriverTripSummaryBar trip={trip} />
      <div className="mx-auto max-w-5xl px-4">
        <TripRoutePanel trip={trip} compact />
      </div>
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Your details</h2>
          <p className="mt-1 text-sm text-slate-600">Enter contact details for this driver booking</p>
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
          {resolveMediaUrl(driver.image) ? (
            <img src={resolveMediaUrl(driver.image)} alt="" className="mb-3 h-24 w-full rounded-lg object-cover object-top" />
          ) : null}
          <h3 className="font-bold text-slate-900">{displayName}</h3>
          <p className="text-sm text-slate-500">
            {driver.vendor}
            {driver.city ? ` · ${driver.city}` : ""}
          </p>
          {fare.usesDistance ? (
            <p className="mt-2 text-xs text-slate-600">
              ₹{fare.perKmRate}/km × {fare.distanceKm} km{trip.roundTrip ? " × 2" : ""}
            </p>
          ) : slab?.label ? (
            <p className="mt-2 text-xs text-slate-500">Package: {slab.label}</p>
          ) : null}
          <hr className="my-4 border-slate-100" />
          <div className="mt-4 flex justify-between border-t border-slate-100 pt-3 text-base font-bold text-slate-900">
            <span>Total payable</span>
            <span>{formatINR(total)}</span>
          </div>
        </aside>
      </div>
    </>
  );
}

export default function DriverPassengerPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center">Loading…</div>}>
      <DriverPassengerContent />
    </Suspense>
  );
}
