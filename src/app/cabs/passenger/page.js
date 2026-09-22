"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CabReviewBooking from "../../../components/mmt/CabReviewBooking";
import { buildFareSlabs } from "../../../lib/cabFare";
import { resolveCabTripFare } from "../../../lib/distanceFare";
import { buildLoginHref, getUser, isLoggedIn } from "../../../lib/auth";
import { loadCheckoutDraft, saveCheckoutDraft } from "../../../lib/checkoutStorage";
import { mergeTripDistance } from "../../../lib/mergeTripDistance";
import { appendTripCoords } from "../../../lib/tripCoords";
import { useTripRoute } from "../../../lib/useTripRoute";
import { getCabDisplayTitle, getCabPackageLine, getCabVehicleName } from "../../../lib/catalogDisplay";
import { cabSlabForTrip, parseTripSearchParams, tripToSearchQuery } from "../../../lib/mmtTrip";
import { trackEvent } from "../../../lib/analytics";
import { beaconSeoEvent } from "../../../lib/seoAttribution";
import { upsertEnquiry } from "../../../lib/enquiryCapture";
import { couponDiscountAmount } from "../../../lib/paymentMethods";

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
  const [pickup, setPickup] = useState("");
  const [coupon, setCoupon] = useState("");
  const [payMode, setPayMode] = useState("advance");
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
    if (saved.pickup) setPickup(saved.pickup);
    if (saved.pendingResume && isLoggedIn() && restoredName.trim() && restoredPhone.trim()) {
      saveCheckoutDraft({ pendingResume: false });
      setAutoContinue(true);
    }
  }, []);

  useEffect(() => {
    if (!pickup && trip.from) setPickup(trip.from);
  }, [pickup, trip.from]);

  useEffect(() => {
    if (!cabId) {
      router.replace("/");
      return;
    }
    fetch(`/api/cabs/${cabId}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (json?.data) {
          setCab(json.data);
          trackEvent("passenger_details_started", {
            service_type: "cab",
            vehicle_id: cabId,
            vehicle_name: getCabVehicleName(json.data),
            city: tripParsed.from || json.data.city || "",
            source_page: "/cabs/passenger"
          });
        } else setError("Cab not found");
      })
      .catch(() => setError("Could not load cab"))
      .finally(() => setLoading(false));
  }, [cabId, router]);

  const slabs = cab ? buildFareSlabs(cab) : [];
  const slab = cabSlabForTrip(slabs, trip);
  const fare =
    cab && slab
      ? resolveCabTripFare(cab, slab, trip)
      : { listPrice: 0, total: 0, discountPct: 0, discountAmount: 0, perKmRate: 0, usesDistance: false };
  const listPrice = fare.listPrice;
  const discount = fare.discountPct;
  const couponOff = couponDiscountAmount(coupon, fare.total);
  const netTotal = Math.max(0, Number(fare.total) - couponOff);
  const payable = payMode === "full" ? netTotal : Math.round(netTotal * 0.5);

  async function handleContinue() {
    setError("");
    if (!name.trim() || !phone.trim()) {
      setError("Enter passenger name and mobile number.");
      return;
    }
    const pickupValue = pickup.trim() || trip.from;
    saveCheckoutDraft({
      customerName: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      pickup: pickupValue,
      drop: trip.to || "",
      date: trip.date,
      time: trip.time,
      cabId,
      vehicleName: cab ? getCabDisplayTitle(cab, trip) : "",
      total: payable,
      distanceKm: fare.distanceKm || trip.distanceKm || "",
      packageLine: cab ? getCabPackageLine(cab, trip, { slab, fare }) : "",
      tripType: trip.tripType
    });
    await upsertEnquiry({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      pickup: pickupValue,
      drop: trip.to || "",
      travelDate: trip.date,
      pickupTime: trip.time,
      service: "cab",
      tripType: trip.tripType,
      vehicleId: cabId,
      vehicleName: cab ? getCabVehicleName(cab) : "",
      estimatedFare: netTotal,
      distanceKm: fare.distanceKm || trip.distanceKm || 0,
      packageLabel: cab ? getCabPackageLine(cab, trip, { slab, fare }) : "",
      ctaLocation: "passenger_details"
    });
    trackEvent("booking_started", {
      service_type: "cab",
      vehicle_id: cabId,
      vehicle_name: cab ? getCabVehicleName(cab) : "",
      city: pickupValue || "",
      route: [pickupValue, trip.to].filter(Boolean).join(" → "),
      cta_location: "passenger_details"
    });
    beaconSeoEvent("booking_started", {
      city: pickupValue || "",
      route: [pickupValue, trip.to].filter(Boolean).join(" → ")
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
      payParams.set("total", String(fare.total));
      payParams.set("baseFare", String(fare.total));
      payParams.set("taxes", "0");
      payParams.set("pickup", pickupValue);
      payParams.set("passengerName", name.trim());
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
      payParams.set("discountAmount", String(Math.max(0, listPrice - fare.total)));
      payParams.set("payMode", payMode);
      if (coupon) payParams.set("coupon", coupon);
      appendTripCoords(payParams, trip);

      router.push(`/payment?${payParams.toString()}`);
    } catch (e) {
      setError(e.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (!autoContinue || loading || !cab) return;
    setAutoContinue(false);
    handleContinue();
  }, [autoContinue, loading, cab]);

  if (loading) {
    return <div className="py-16 text-center text-slate-500">Loading…</div>;
  }

  if (!cab) {
    return <div className="py-16 text-center text-rose-600">{error || "Cab not found"}</div>;
  }

  return (
    <CabReviewBooking
      trip={trip}
      cab={cab}
      fare={fare}
      slab={slab}
      name={name}
      onName={setName}
      phone={phone}
      onPhone={setPhone}
      email={email}
      onEmail={setEmail}
      pickup={pickup}
      onPickup={setPickup}
      error={error}
      submitting={submitting}
      coupon={coupon}
      onCoupon={setCoupon}
      payMode={payMode}
      onPayMode={setPayMode}
      netTotal={netTotal}
      payable={payable}
      onPay={handleContinue}
      loginHref={buildLoginHref(`/cabs/passenger?${searchParams.toString()}`, "customer")}
    />
  );
}

export default function PassengerPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center">Loading…</div>}>
      <PassengerContent />
    </Suspense>
  );
}
