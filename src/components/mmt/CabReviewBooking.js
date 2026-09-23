"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Check, ChevronRight, Fuel, Gauge, MapPin, Receipt } from "lucide-react";
import { isLoggedIn } from "../../lib/auth";
import { formatRating } from "../../lib/cabFare";
import { cabTypeBucket } from "../../lib/cabListing";
import { getCabVehicleName } from "../../lib/catalogDisplay";
import { inferPassengerSeats } from "../../lib/cabSeats";
import { formatMmtListingStamp } from "../../lib/emt/heroDates";
import { formatInrCurrency } from "../../lib/formatInr";
import { couponsForTrip } from "../../lib/paymentMethods";
import { tripToSearchQuery } from "../../lib/mmtTrip";
import { resolveCabImage } from "../../lib/vehicleImages";
import { shortPlace } from "./useCabModifySearch";
import { inputBaseClass } from "../../lib/typography";

function reviewTripKind(trip) {
  if (trip?.tripType === "outstation") {
    return trip.roundTrip ? "Outstation Round Trip" : "Outstation One Way Trip";
  }
  if (trip?.tripType === "airport") return "Airport Transfer";
  if (trip?.tripType === "hourly") return "Hourly Rental";
  if (trip?.tripType === "local") return "Local Cab";
  return "Cab booking";
}

function InclusionRow({ icon: Icon, title, detail }) {
  return (
    <div className="flex gap-3 border-b border-slate-100 py-3 last:border-b-0">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
      <div>
        <p className="text-[14px] font-semibold text-slate-800">{title}</p>
        {detail ? <p className="mt-0.5 text-[12px] text-slate-500">{detail}</p> : null}
      </div>
    </div>
  );
}

export default function CabReviewBooking({
  trip,
  cab,
  fare,
  slab,
  name,
  onName,
  phone,
  onPhone,
  email,
  onEmail,
  pickup,
  onPickup,
  error,
  submitting,
  coupon,
  onCoupon,
  payMode,
  onPayMode,
  netTotal,
  payable,
  onPay,
  loginHref
}) {
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [breakupOpen, setBreakupOpen] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  useEffect(() => {
    if (payMode !== "advance") onPayMode?.("advance");
  }, [payMode, onPayMode]);

  const vehicleName = getCabVehicleName(cab);
  const ratingText = formatRating(cab);
  const typeLabel = String(cabTypeBucket(cab) || cab.type || "Cab").toUpperCase();
  const seats = inferPassengerSeats(cab);
  const offers = couponsForTrip(trip);
  const km = Number(fare?.distanceKm || trip?.distanceKm) || 0;
  const perKm = Number(fare?.perKmRate) || Number(slab?.extraKm) || 0;
  const includedKm = Number(slab?.includedKm) || 0;
  const driverBatta = Number(fare?.driverBatta) || 0;
  const resultsHref = `/cabs/results?${tripToSearchQuery(trip).toString()}`;
  const stamp = formatMmtListingStamp(trip.date, trip.time);
  const fromLabel = shortPlace(trip.from) || pickup || "Pickup";
  const toLabel = shortPlace(trip.to) || "Drop";
  const advanceAmt = Math.round(netTotal * 0.5);

  function applyCode(code) {
    const normalized = String(code || "").trim().toUpperCase();
    const match = offers.find((c) => c.code === normalized);
    if (!match) {
      setCouponMsg("This code does not apply to this trip.");
      return;
    }
    onCoupon(match.code);
    setCouponMsg(`${match.code} applied.`);
    setCouponInput("");
  }

  const inclusions = [];
  if (includedKm > 0) {
    inclusions.push({
      icon: Gauge,
      title: `${Math.round(includedKm)} km included`,
      detail: perKm > 0 ? `₹${perKm}/km applies beyond the included km` : null
    });
  } else if (fare?.usesDistance && km > 0) {
    inclusions.push({
      icon: Gauge,
      title: `${Math.round(km)} km billed for this route`,
      detail: perKm > 0 ? `₹${perKm}/km` : null
    });
  }
  inclusions.push({
    icon: Fuel,
    title: "Fuel and driver service included",
    detail: "Package fare covers fuel and the assigned driver"
  });
  inclusions.push({
    icon: Receipt,
    title: "Tolls, parking and GST extra",
    detail: "Charged as incurred — not a fixed add-on on this quote"
  });

  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      <header className="cabzii-review-bar bg-[#0b1b3a]">
        <div className="mx-auto flex w-full max-w-[var(--cabzii-content-max)] items-center justify-between px-4 py-3.5 sm:px-6">
          <h1 className="text-[20px] font-semibold tracking-tight text-white sm:text-[22px]">Review booking</h1>
          <Link href={resultsHref} className="text-[13px] font-semibold text-sky-300 hover:text-white">
            Modify
          </Link>
        </div>
      </header>

      <div className="section-shell grid items-start gap-5 py-5 pb-28 lg:grid-cols-[minmax(0,1fr)_22.5rem] lg:pb-5">
        <div className="space-y-4">
          <section className="overflow-hidden rounded-xl bg-[#e8f4ff] px-4 py-4 sm:px-5">
            <p className="text-[13px] font-medium text-slate-600">{reviewTripKind(trip)}</p>
            <div className="mt-2 flex flex-wrap items-start gap-6">
              <div>
                <p className="text-[18px] font-extrabold text-slate-900">{fromLabel}</p>
                <p className="text-[12px] text-slate-500">{trip.from}</p>
              </div>
              {trip.to ? (
                <>
                  <span className="mt-3 hidden text-slate-300 sm:inline" aria-hidden>
                    ○ ——— ●
                  </span>
                  <div>
                    <p className="text-[18px] font-extrabold text-slate-900">{toLabel}</p>
                    <p className="text-[12px] text-slate-500">{trip.to}</p>
                  </div>
                </>
              ) : null}
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-[13px] text-slate-700">
              <Calendar className="h-4 w-4 text-slate-500" aria-hidden />
              {stamp}
            </p>
          </section>

          <section className="flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-4 sm:px-5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[17px] font-extrabold text-slate-900">{vehicleName}</h2>
                {ratingText ? <span className="rounded bg-[#1a73e8] px-1.5 py-0.5 text-[11px] font-bold text-white">{ratingText}/5</span> : null}
              </div>
              <p className="mt-0.5 text-[13px] text-slate-500">or similar</p>
              <p className="mt-2 text-[12px] font-semibold uppercase tracking-wide text-slate-600">
                {typeLabel} · AC · {seats} Seats
              </p>
            </div>
            <img
              src={resolveCabImage(cab)}
              alt={vehicleName}
              className="h-[72px] w-[120px] shrink-0 object-contain"
            />
          </section>

          <section className="rounded-xl bg-white px-4 py-2 sm:px-5">
            <p className="pt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Inclusions</p>
            {inclusions.map((row) => (
              <InclusionRow key={row.title} {...row} />
            ))}
            <Link href="/tariff" className="flex items-center justify-between py-3 text-[14px] font-semibold text-[#1a73e8]">
              View policies
              <ChevronRight className="h-4 w-4" />
            </Link>
          </section>

          <section className="rounded-xl bg-white px-4 py-4 sm:px-5">
            <h2 className="text-[16px] font-bold text-slate-900">Cancellation Policy</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
              Time-based: more than 24 hours before pickup is a full refund after gateway deductions. 6–24 hours may attract
              up to 25%. Under 6 hours or no-show may be up to 100%.
            </p>
            <Link href="/cancellation-policy" className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-[#1a73e8]">
              View cancellation policy
              <ChevronRight className="h-4 w-4" />
            </Link>
          </section>

          <section className="rounded-xl bg-white px-4 py-5 sm:px-5">
            <h2 className="text-[16px] font-bold text-slate-900">Traveller Details</h2>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Pickup details</p>
            <label className="mt-1 block">
              <span className="sr-only">Pickup location</span>
              <span className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
                <input
                  value={pickup}
                  onChange={(e) => onPickup(e.target.value)}
                  className={`${inputBaseClass} pl-9`}
                  placeholder="Enter pickup location"
                />
              </span>
            </label>

            <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Traveller contact details</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">Full name</span>
                <input value={name} onChange={(e) => onName(e.target.value)} autoComplete="name" className={inputBaseClass} placeholder="As on ID" />
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">Mobile number</span>
                <input
                  value={phone}
                  onChange={(e) => onPhone(e.target.value)}
                  inputMode="numeric"
                  autoComplete="tel"
                  className={inputBaseClass}
                  placeholder="10-digit mobile"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">Email ID</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => onEmail(e.target.value)}
                  autoComplete="email"
                  className={inputBaseClass}
                  placeholder="name@email.com"
                />
              </label>
            </div>
            {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
            {!loggedIn && loginHref ? (
              <p className="mt-3 text-[12px] text-slate-500">
                Or{" "}
                <Link href={loginHref} className="font-bold uppercase tracking-wide text-[#1a73e8]">
                  Log into existing account
                </Link>
              </p>
            ) : null}
            <p className="mt-4 text-[12px] leading-relaxed text-slate-500">
              By proceeding to book, I agree to Cabzii’s{" "}
              <Link href="/terms-and-conditions" className="font-semibold text-[#1a73e8]">
                Terms &amp; conditions
              </Link>
              ,{" "}
              <Link href="/legal-declaration" className="font-semibold text-[#1a73e8]">
                Legal declaration
              </Link>{" "}
              and{" "}
              <Link href="/cancellation-policy" className="font-semibold text-[#1a73e8]">
                Cancellation policy
              </Link>
              .
            </p>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-4">
          <section className="rounded-xl bg-white p-4">
            <h2 className="text-[15px] font-bold text-slate-900">Coupon &amp; Offers</h2>
            <ul className="mt-3 space-y-2">
              {offers.length ? (
                offers.map((offer) => {
                  const on = coupon === offer.code;
                  return (
                    <li key={offer.code}>
                      <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-slate-200 px-3 py-2.5">
                        <input
                          type="radio"
                          name="coupon"
                          checked={on}
                          onChange={() => applyCode(offer.code)}
                          className="mt-1 accent-[#1a73e8]"
                        />
                        <span>
                          <span className="inline-flex items-center gap-1 text-[12px] font-extrabold text-emerald-700">
                            <Check className="h-3.5 w-3.5" /> {offer.code}
                          </span>
                          <span className="mt-0.5 block text-[12px] text-slate-500">{offer.desc}</span>
                        </span>
                      </label>
                    </li>
                  );
                })
              ) : (
                <li className="text-[12px] text-slate-500">No published coupon for this trip type.</li>
              )}
            </ul>
            {coupon ? (
              <button type="button" onClick={() => onCoupon("")} className="mt-2 text-[12px] font-semibold text-slate-500 hover:text-slate-800">
                Remove coupon
              </button>
            ) : null}
            <div className="mt-3 flex overflow-hidden rounded-lg border border-slate-200">
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="min-w-0 flex-1 px-3 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-slate-700 outline-none"
                placeholder="Enter a coupon"
              />
              <button
                type="button"
                onClick={() => applyCode(couponInput)}
                className="px-4 text-[12px] font-extrabold uppercase tracking-wide text-[#1a73e8]"
              >
                Apply
              </button>
            </div>
            {couponMsg ? <p className="mt-2 text-[12px] text-slate-600">{couponMsg}</p> : null}
          </section>

          <section className="rounded-xl bg-white p-4">
            <h2 className="text-[15px] font-bold text-slate-900">Payment options</h2>
            <p className="mt-1 text-[11px] text-slate-500">50% advance is required at booking. Balance at pickup, cash.</p>
            <div className="mt-3 flex items-center justify-between gap-3 py-2">
              <span className="flex items-center gap-2.5">
                <input type="radio" name="payMode" checked readOnly className="accent-[#1a73e8]" aria-label="Pay 50% now" />
                <span>
                  <span className="block text-[14px] font-semibold text-slate-800">Pay 50% now</span>
                  <span className="text-[12px] text-slate-500">Pay rest to the driver</span>
                </span>
              </span>
              <span className="text-[14px] font-bold text-slate-900">{formatInrCurrency(advanceAmt)}</span>
            </div>
            <button
              type="button"
              disabled={submitting}
              onClick={onPay}
              className="mt-3 hidden h-12 w-full rounded-xl bg-[#1a73e8] text-[15px] font-extrabold uppercase tracking-wide text-white hover:bg-[#1565c0] disabled:opacity-70 lg:block"
            >
              {submitting ? "Processing…" : "Pay now"}
            </button>
            <button
              type="button"
              onClick={() => setBreakupOpen((v) => !v)}
              className="mt-3 w-full text-center text-[13px] font-semibold text-[#1a73e8]"
            >
              {breakupOpen ? "Hide fare break up" : "Show fare break up"}
            </button>
            {breakupOpen ? (
              <dl className="mt-2 space-y-1.5 border-t border-slate-100 pt-3 text-[13px]">
                <div className="flex justify-between text-slate-600">
                  <dt>Package fare</dt>
                  <dd className="font-semibold text-slate-800">{formatInrCurrency(fare.total)}</dd>
                </div>
                {driverBatta > 0 ? (
                  <div className="flex justify-between text-slate-500">
                    <dt>Includes driver bata</dt>
                    <dd>{formatInrCurrency(driverBatta)}</dd>
                  </div>
                ) : null}
                {coupon ? (
                  <div className="flex justify-between text-emerald-700">
                    <dt>{coupon}</dt>
                    <dd className="font-semibold">−{formatInrCurrency(Math.max(0, fare.total - netTotal))}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between text-slate-600">
                  <dt>Tolls, parking &amp; GST</dt>
                  <dd className="font-medium">Extra if applicable</dd>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2 text-[14px] font-bold text-slate-900">
                  <dt>Pay now</dt>
                  <dd>{formatInrCurrency(payable)}</dd>
                </div>
              </dl>
            ) : null}
          </section>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0">
            <p className="text-[16px] font-extrabold text-slate-900">{formatInrCurrency(payable)}</p>
            <p className="text-[11px] text-slate-500">50% now · rest at pickup</p>
          </div>
          <button
            type="button"
            disabled={submitting}
            onClick={onPay}
            className="h-11 flex-1 rounded-xl bg-[#1a73e8] text-[14px] font-extrabold uppercase tracking-wide text-white disabled:opacity-70"
          >
            {submitting ? "Processing…" : "Pay now"}
          </button>
        </div>
      </div>
    </div>
  );
}
