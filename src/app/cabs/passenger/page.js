"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MmtTripSummaryBar from "../../../components/mmt/MmtTripSummaryBar";
import MmtCardPriceBlock from "../../../components/mmt/MmtCardPriceBlock";
import TripRoutePanel from "../../../components/maps/TripRoutePanel";
import { buildFareSlabs } from "../../../lib/cabFare";
import { resolveCabTripFare } from "../../../lib/distanceFare";
import { buildLoginHref, getUser, isLoggedIn } from "../../../lib/auth";
import { loadCheckoutDraft, saveCheckoutDraft } from "../../../lib/checkoutStorage";
import { mergeTripDistance } from "../../../lib/mergeTripDistance";
import { appendTripCoords } from "../../../lib/tripCoords";
import { useTripRoute } from "../../../lib/useTripRoute";
import { resolveCabImage } from "../../../lib/vehicleImages";
import {
  getCabDisplaySubtitle,
  getCabDisplayTitle,
  getCabPackageLine
} from "../../../lib/catalogDisplay";
import { cabSlabForTrip, parseTripSearchParams, tripToSearchQuery } from "../../../lib/mmtTrip";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    Number(n) || 0
  );
}

function PassengerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripParsed = parseTripSearchParams(searchParams);
  const { route } = useTripRoute(tripParsed);
  const trip = useMemo(() => mergeTripDistance(tripParsed, route), [tripParsed, route]);
  const cabId = searchParams.get("cabId") || searchParams.get("id");

  const [cab, setCab] = useState(null);
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
    if (!autoContinue || loading || !cab) return;
    setAutoContinue(false);
    handleContinue();
  }, [autoContinue, loading, cab]);

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
  const fare = cab && slab ? resolveCabTripFare(cab, slab, trip) : { listPrice: 0, total: 0, discountPct: 0, discountAmount: 0, perKmRate: 0, usesDistance: false };
  const listPrice = fare.listPrice;
  const discount = fare.discountPct;
  const total = fare.total;

  async function handleContinue() {
    setError("");
    if (!name.trim() || !phone.trim()) {
      setError("Enter passenger name and mobile number.");
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
      const next = `/cabs/passenger?${searchParams.toString()}`;
      router.push(buildLoginHref(next, "customer"));
      return;
    }
    setSubmitting(true);
    try {
      const payParams = new URLSearchParams(tripToSearchQuery(trip));
      payParams.set("type", "cab");
      payParams.set("id", cabId);
      payParams.set("total", String(total));
      payParams.set("baseFare", String(total));
      payParams.set("taxes", "0");
      payParams.set("pickup", trip.from);
      if (trip.to) payParams.set("drop", trip.to);
      payParams.set("date", trip.date);
      payParams.set("time", trip.time);
      if (trip.roundTrip) payParams.set("roundTrip", "true");
      if (trip.packageHours && trip.tripType === "hourly") {
        payParams.set("packageHours", String(trip.packageHours));
      }
      if (slab?.id) payParams.set("packageId", slab.id);
      if (slab?.label) payParams.set("package", slab.label);
      if (fare.perKmRate) payParams.set("extraKm", String(fare.perKmRate));
      if (fare.usesDistance) payParams.set("usesDistance", "true");
      if (fare.distanceKm) payParams.set("distanceKm", String(fare.distanceKm));
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

  if (!cab) {
    return <div className="py-16 text-center text-rose-600">{error || "Cab not found"}</div>;
  }

  const displayTitle = getCabDisplayTitle(cab, trip);
  const displaySubtitle = getCabDisplaySubtitle(cab, trip);
  const packageLine = getCabPackageLine(cab, trip, { slab, fare });

  return (
    <>
      <MmtTripSummaryBar trip={trip} />
      <div className="section-shell">
        <TripRoutePanel trip={trip} compact />
      </div>
      <div className="section-shell grid w-full grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[1fr_320px]">
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
          <img
            src={resolveCabImage(cab)}
            alt={displayTitle}
            className="mb-3 h-24 w-full rounded-lg object-cover"
          />
          <h3 className="font-bold text-slate-900">{displayTitle}</h3>
          <p className="text-sm text-slate-500">{displaySubtitle}</p>
          <hr className="my-4 border-slate-100" />
          <div className="flex justify-end">
            <MmtCardPriceBlock
              originalPrice={listPrice}
              finalPrice={total}
              discountPct={discount}
              perKmRate={fare.usesDistance ? fare.perKmRate : undefined}
              distanceKm={fare.usesDistance ? fare.distanceKm : undefined}
              roundTrip={Boolean(trip.roundTrip)}
            />
          </div>
          {!fare.usesDistance && packageLine ? (
            <p className="mt-2 text-right text-sm text-slate-600">{packageLine}</p>
          ) : null}
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
