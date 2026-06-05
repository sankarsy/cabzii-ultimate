"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PlaceAutocomplete from "../../components/PlaceAutocomplete";
import TripRoutePanel from "../../components/maps/TripRoutePanel";
import PaymentBreakdown from "../../components/PaymentBreakdown";
import PaymentCheckoutFooter from "../../components/payment/PaymentCheckoutFooter";
import PaymentMethodSheet from "../../components/payment/PaymentMethodSheet";
import OffersSheet from "../../components/payment/OffersSheet";
import { authHeaders, buildLoginHref, getToken, getUser, normalizeMobileInput } from "../../lib/auth";
import { fetchJson } from "../../lib/apiClient";
import { clearCheckoutDraft, loadCheckoutDraft } from "../../lib/checkoutStorage";
import { isPaymentMethodEnabled } from "../../lib/paymentMethods";
import { readTripCoords } from "../../lib/tripCoords";

function firstParam(value) {
  if (Array.isArray(value)) return String(value[0] ?? "").trim();
  return String(value ?? "").trim();
}

export default function PaymentPage({ searchParams }) {
  const router = useRouter();
  const method = "cash";
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [offersOpen, setOffersOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pickup, setPickup] = useState(firstParam(searchParams?.pickup));
  const [drop, setDrop] = useState(firstParam(searchParams?.drop));
  const [date, setDate] = useState(firstParam(searchParams?.date));
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [bookingId, setBookingId] = useState("");
  const type = searchParams?.type ?? "cab";
  const itemId = String(searchParams?.id ?? searchParams?.cabId ?? "");
  const taxes = Number(searchParams?.taxes ?? 0);
  const baseFare = Number(searchParams?.baseFare ?? 0);
  const totalParam = Number(searchParams?.total ?? 0);
  const couponDiscount = appliedCoupon === "CABZII500" ? 500 : appliedCoupon === "FIRST100" ? 100 : appliedCoupon === "WEEKEND10" ? Math.round(baseFare * 0.1) : 0;
  const totalBeforeCoupon = totalParam > 0 ? totalParam : baseFare + taxes;
  const total = Math.max(0, totalBeforeCoupon - couponDiscount);
  const listPrice = Number(searchParams?.listPrice ?? baseFare);
  const discountPct = Number(searchParams?.discountPct ?? 0);
  const discountAmount = Number(searchParams?.discountAmount ?? Math.max(0, listPrice - baseFare));
  const packageLabel = firstParam(searchParams?.package);
  const serviceTab = firstParam(searchParams?.service);
  const tourPersons = Number(searchParams?.persons) || 1;
  const tripCoords = readTripCoords((key) => {
    const v = searchParams?.[key];
    return Array.isArray(v) ? v[0] : v ?? "";
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const paymentTrip = {
    tripType: firstParam(searchParams?.serviceTripType) || serviceTab || "outstation",
    from: pickup,
    to: drop,
    ...tripCoords
  };

  useEffect(() => {
    const user = getUser();
    if (user?.mobileNumber) setPhone(user.mobileNumber);
    if (!getToken()) {
      const next = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/payment";
      router.replace(buildLoginHref(next, "customer"));
      return;
    }
    const saved = loadCheckoutDraft();
    if (saved.customerName) setCustomerName(saved.customerName);
    if (saved.phone) setPhone(saved.phone);
    if (saved.email) setEmail(saved.email);
    if (saved.pickup) setPickup(saved.pickup);
    if (saved.drop) setDrop(saved.drop);
    if (saved.date) setDate(saved.date);
  }, [router]);

  useEffect(() => {
    if (!itemId) return;
    const base =
      type === "tour"
        ? `/api/packages/${encodeURIComponent(itemId)}`
        : type === "driver"
          ? `/api/drivers/${encodeURIComponent(itemId)}`
          : `/api/cabs/${encodeURIComponent(itemId)}`;
    (async () => {
      try {
        const data = await fetchJson(base);
        setSelectedItem(data?.data ?? null);
      } catch {
        setSelectedItem(null);
      }
    })();
  }, [itemId, type]);

  const bookingSelection = useMemo(() => {
    if (type !== "cab" && type !== "driver") return null;
    return {
      packageLabel: packageLabel || "Selected package",
      serviceTab: serviceTab || "local",
      listPrice,
      discountPct,
      discountAmount,
      baseFare,
      taxes,
      total,
      extraKm: Number(searchParams?.extraKm) || undefined,
      extraHr: Number(searchParams?.extraHr) || undefined
    };
  }, [type, packageLabel, serviceTab, listPrice, discountPct, discountAmount, baseFare, taxes, total, searchParams?.extraKm, searchParams?.extraHr]);

  const backHref =
    type === "cab" && itemId
      ? `/cabs/${itemId}`
      : type === "driver" && itemId
        ? `/drivers/${itemId}`
        : type === "tour" && itemId
          ? `/holidays/${itemId}`
          : type === "tour"
            ? "/holidays"
            : "/drivers";

  const bookingType = type === "tour" ? "tour" : type === "driver" ? "driver" : "cab";
  const bookLabel =
    type === "driver" ? "Book Driver" : type === "tour" ? "Book Package" : "Book Cab";

  const confirmBooking = async () => {
    if (!itemId) {
      setSubmitError("Missing booking item. Go back and select again.");
      return;
    }
    const mobileNumber = normalizeMobileInput(phone) || getUser()?.mobileNumber;
    if (!mobileNumber) {
      setSubmitError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          customerName: customerName.trim() || "Cabzii User",
          mobileNumber,
          phone: mobileNumber,
          email: email.trim(),
          type: bookingType,
          itemId,
          pickup: pickup.trim(),
          drop: type === "tour" ? "" : drop,
          date,
          routeType:
            type === "tour"
              ? `${tourPersons} persons`
              : serviceTab || firstParam(searchParams?.routeType),
          tripType: firstParam(searchParams?.tripType),
          pickupTime: firstParam(searchParams?.time),
          serviceTripType: firstParam(searchParams?.serviceTripType),
          roundTrip: firstParam(searchParams?.roundTrip) === "true",
          packageHours: Number(firstParam(searchParams?.packageHours)) || undefined,
          amount: total,
          paymentMethod: "cash",
          pickupLat: tripCoords.fromLat ?? undefined,
          pickupLng: tripCoords.fromLng ?? undefined,
          dropLat: tripCoords.toLat ?? undefined,
          dropLng: tripCoords.toLng ?? undefined,
          distanceKm: tripCoords.distanceKm ?? undefined,
          durationMin: tripCoords.durationMin ?? undefined,
          ...(appliedCoupon ? { coupon: appliedCoupon } : {})
        })
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) throw new Error(data?.message || "Booking failed");
      const id = data?.data?._id || data?.data?.id;
      setBookingId(String(id || ""));
      clearCheckoutDraft();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  const showCheckout = !bookingId;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 pb-8">
      <nav className="mb-4 text-xs text-slate-500">
        <Link href={backHref} className="font-medium text-[#0056D2] hover:underline">
          ← Back to {type === "driver" ? "driver" : type === "tour" ? "package" : "cab"} details
        </Link>
      </nav>

      <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Secure payment</h1>
      <p className="mt-1 text-sm text-slate-600">Review details and choose payment below.</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">Your details</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#0056D2]"
              placeholder="Full name *"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#0056D2]"
              placeholder="Mobile number *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#0056D2] sm:col-span-2"
              placeholder="Email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="sm:col-span-2">
              <PlaceAutocomplete
                label="Pickup"
                placeholder="Search pickup address"
                value={pickup}
                onChange={setPickup}
                className="w-full"
              />
            </div>
            {type !== "tour" ? (
              <div className="sm:col-span-2">
                <PlaceAutocomplete
                  label="Drop"
                  placeholder="Search drop address"
                  value={drop}
                  onChange={setDrop}
                  className="w-full"
                />
              </div>
            ) : null}
            <input
              type="date"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#0056D2] sm:col-span-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {bookingId ? (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              <p className="font-semibold">Booking confirmed!</p>
              <p className="mt-1">Reference: {bookingId}</p>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="mt-3 rounded-lg bg-[var(--cabzii-brand)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--cabzii-brand-hover)]"
              >
                Back to home
              </button>
            </div>
          ) : (
            <>
            {type !== "tour" && pickup && drop ? <TripRoutePanel trip={paymentTrip} compact /> : null}
            <PaymentCheckoutFooter
              inline
              bookLabel={bookLabel}
              submitting={submitting}
              submitError={submitError}
              appliedCoupon={appliedCoupon}
              onOpenPayments={() => setPaymentOpen(true)}
              onOpenOffers={() => setOffersOpen(true)}
              onConfirm={confirmBooking}
            />
            </>
          )}
        </div>

        {(type === "cab" || type === "driver") && selectedItem ? (
          <PaymentBreakdown
            item={
              type === "driver"
                ? {
                    title: selectedItem.name,
                    type: selectedItem.type || "Driver",
                    vendor: selectedItem.vendor || "Cabzii Partner"
                  }
                : undefined
            }
            cab={type === "cab" ? selectedItem : undefined}
            selection={bookingSelection}
            showExtrasNote
          />
        ) : type === "tour" && selectedItem ? (
          <PaymentBreakdown
            item={{
              title: selectedItem.name,
              type: "Holiday",
              vendor: selectedItem.vendor
            }}
            selection={{
              packageLabel: selectedItem.name,
              serviceTab: "tour",
              listPrice: Number(searchParams?.listPrice) || baseFare,
              discountPct,
              discountAmount,
              baseFare,
              total,
              persons: tourPersons,
              pickup: firstParam(searchParams?.pickup),
              date: firstParam(searchParams?.date),
              cabLabel: firstParam(searchParams?.cabLabel),
              note: (() => {
                const cab = firstParam(searchParams?.cabLabel);
                const cabPart = cab ? `${cab} · ` : "";
                return tourPersons > 1
                  ? `${cabPart}${tourPersons} travellers — holiday package`
                  : `${cabPart}Holiday package total`;
              })()
            }}
            showExtrasNote={false}
            footerNote="Package fare payable now. Toll, permit & driver bata billed separately as per trip."
          />
        ) : (
          <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-lg font-bold text-slate-900">Order summary</h2>
            <p className="mt-2 text-sm text-slate-700">{selectedItem?.title ?? selectedItem?.name ?? "Booking"}</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Base fare</span>
                <span className="font-semibold">₹{baseFare.toLocaleString("en-IN")}</span>
              </div>
              {couponDiscount > 0 ? (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon</span>
                  <span className="font-semibold">−₹{couponDiscount.toLocaleString("en-IN")}</span>
                </div>
              ) : null}
            </div>
            <div className="mt-4 rounded-xl bg-blue-50 p-4">
              <div className="flex justify-between font-bold text-[#0056D2]">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </aside>
        )}
      </div>

      {showCheckout ? (
        <>
          <PaymentMethodSheet
            open={paymentOpen}
            onClose={() => setPaymentOpen(false)}
            total={total}
            method={method}
            onSelect={(id) => {
              if (isPaymentMethodEnabled(id)) setPaymentOpen(false);
            }}
          />
          <OffersSheet
            open={offersOpen}
            onClose={() => setOffersOpen(false)}
            appliedCode={appliedCoupon}
            onApplyCoupon={(code) => {
              setAppliedCoupon(code);
              setOffersOpen(false);
            }}
          />
        </>
      ) : null}
    </div>
  );
}
