"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isLoggedIn } from "../../lib/auth";
import { getCabVehicleName } from "../../lib/catalogDisplay";
import { inferPassengerSeats } from "../../lib/cabSeats";
import { formatMmtListingStamp } from "../../lib/emt/heroDates";
import { formatInrCurrency } from "../../lib/formatInr";
import { cabResultsHref } from "../../lib/mmtTrip";
import { resolveCabImage } from "../../lib/vehicleImages";
import { telUrl } from "../../lib/conversion";
import { ORG_PHONE } from "../../lib/seo/constants";
import OffersSheet from "../payment/OffersSheet";

function reviewTripKind(trip) {
  if (trip?.tripType === "outstation") return trip.roundTrip ? "Outstation round trip" : "Outstation";
  if (trip?.tripType === "airport") return "Airport";
  if (trip?.tripType === "hourly") return "Hourly";
  return "Local";
}

function fieldClass() {
  return "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base text-slate-800 outline-none placeholder:text-slate-400 focus:border-[var(--cabzii-cta)] sm:text-sm";
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
  const [offersOpen, setOffersOpen] = useState(false);
  const [cabOpen, setCabOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  useEffect(() => {
    if (payMode !== "advance") onPayMode?.("advance");
  }, [payMode, onPayMode]);

  const vehicleName = getCabVehicleName(cab);
  const seats = inferPassengerSeats(cab);
  const km = Number(fare?.distanceKm || trip?.distanceKm) || 0;
  const perKm = Number(fare?.perKmRate) || Number(slab?.extraKm) || 0;
  const includedKm = Number(slab?.includedKm) || km;
  const resultsHref = cabResultsHref(trip);
  const stamp = formatMmtListingStamp(trip.date, trip.time);
  const pickupLabel = pickup || trip.from || "Pickup";
  const dropLabel = trip.to || "";
  const couponOff = Math.max(0, Number(fare.total) - Number(netTotal));
  const kind = reviewTripKind(trip);
  const kmLabel = includedKm > 0 ? String(includedKm) : km > 0 ? String(Math.round(km * 10) / 10) : "";

  const bookLabel = submitting ? "Processing…" : "Book";

  return (
    <div className="min-h-screen bg-[#f4f6fa] pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))] lg:pb-8">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white pt-[env(safe-area-inset-top,0px)]">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href={resultsHref}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100"
              aria-label="Back to cabs"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-[17px] font-extrabold tracking-tight text-slate-900">Review Booking</h1>
          </div>
          <a
            href={telUrl(ORG_PHONE)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-[var(--cabzii-brand)] hover:bg-slate-50"
            aria-label={`Call ${ORG_PHONE}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </a>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-5xl gap-4 px-4 py-5 sm:px-6 lg:grid-cols-2 lg:items-start">
        <div className="space-y-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-[13px] font-semibold text-slate-800">
              {kind}
              {kmLabel ? ` | ${kmLabel} km` : ""}
            </p>
            <div className="mt-3 space-y-3">
              <div className="flex gap-2.5">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" aria-hidden />
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-slate-400">Pickup location</p>
                  <input
                    value={pickupLabel}
                    onChange={(e) => onPickup(e.target.value)}
                    className="mt-0.5 w-full bg-transparent text-base font-semibold leading-snug text-slate-800 outline-none sm:text-[13px]"
                  />
                </div>
              </div>
              {dropLabel ? (
                <div className="flex gap-2.5">
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-rose-500" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-slate-400">Drop location</p>
                    <p className="mt-0.5 text-[13px] font-semibold leading-snug text-slate-800">{dropLabel}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </section>

          <section className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <div>
              <p className="text-[11px] font-medium text-slate-400">Pickup Time</p>
              <p className="mt-0.5 text-[14px] font-extrabold uppercase tracking-wide text-slate-900">{stamp || "NOW"}</p>
            </div>
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white">
            <button
              type="button"
              onClick={() => setCabOpen((v) => !v)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left"
            >
              <img src={resolveCabImage(cab)} alt={vehicleName} className="h-12 w-[4.5rem] object-contain" />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-extrabold text-slate-900">{vehicleName}</p>
                <p className="text-[12px] text-slate-500">
                  {seats} seats{kmLabel ? ` · ${kmLabel} km` : ""}
                </p>
              </div>
              <svg
                className={`h-5 w-5 text-slate-400 transition ${cabOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {cabOpen ? (
              <ul className="space-y-1 border-t border-slate-100 px-4 py-3 text-[12px] text-slate-600">
                {includedKm > 0 ? (
                  <li>
                    {includedKm} km included.
                    {perKm > 0 ? ` After that ₹${Number(perKm).toFixed(0)}/km.` : ""}
                  </li>
                ) : null}
                <li>Time-based cancellation — more than 24 hours before pickup is a full refund after gateway deductions.</li>
                <li>Driver assigned after you confirm.</li>
              </ul>
            ) : null}
          </section>
        </div>

        <div className="space-y-3">
          <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
            <button
              type="button"
              onClick={() => setOffersOpen(true)}
              className={`${fieldClass()} flex items-center gap-3 text-left font-medium ${
                coupon ? "text-emerald-700" : "text-slate-500"
              }`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </span>
              <span className="min-w-0 flex-1">{coupon ? `${coupon} applied` : "Coupons and Offer"}</span>
              <span className="text-slate-300">›</span>
            </button>
            <input
              value={name}
              onChange={(e) => onName(e.target.value)}
              autoComplete="name"
              className={fieldClass()}
              placeholder="Name"
            />
            <input
              value={phone}
              onChange={(e) => onPhone(e.target.value)}
              inputMode="numeric"
              autoComplete="tel"
              className={fieldClass()}
              placeholder="Mobile number"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => onEmail(e.target.value)}
              autoComplete="email"
              className={fieldClass()}
              placeholder="Email (optional)"
            />
            <div className="flex items-center justify-between px-1 pt-1 text-[13px] text-slate-500">
              <span>Payment Method</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                By Cash
              </span>
            </div>
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            {!loggedIn && loginHref ? (
              <p className="text-[12px] text-slate-500">
                You will sign in with OTP before payment.{" "}
                <Link href={loginHref} className="font-semibold text-[var(--cabzii-cta)]">
                  Login
                </Link>
              </p>
            ) : null}
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="space-y-2 bg-slate-50 px-4 py-4 text-[13px]">
              <div className="flex justify-between text-slate-600">
                <span>Estimated fare</span>
                <span className="font-semibold text-slate-800">{formatInrCurrency(fare.total)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Coupon &amp; Offer</span>
                <span className={couponOff > 0 ? "font-semibold text-emerald-700" : "text-slate-400"}>
                  {couponOff > 0 ? `−${formatInrCurrency(couponOff)}` : "—"}
                </span>
              </div>
              <div className="flex justify-between text-[16px] font-extrabold text-slate-900">
                <span>Total</span>
                <span>{formatInrCurrency(netTotal)}</span>
              </div>
            </div>
            {perKm > 0 ? (
              <p className="flex items-center justify-between bg-[#eef6ff] px-4 py-2.5 text-[12px] text-sky-800">
                <span className="inline-flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Additional km fee
                </span>
                <span className="font-semibold">₹{Number(perKm).toFixed(0)}/km</span>
              </p>
            ) : null}
            <div className="hidden p-3 lg:block">
              <p className="mb-2 text-center text-[11px] text-slate-500">
                Pay {formatInrCurrency(payable)} now (50% advance). Balance in cash at pickup.
              </p>
              <button
                type="button"
                disabled={submitting}
                onClick={onPay}
                className="h-12 w-full rounded-xl bg-[var(--cabzii-cta)] text-[15px] font-extrabold text-white hover:bg-[var(--cabzii-cta-hover)] disabled:opacity-70"
              >
                {bookLabel}
              </button>
            </div>
          </section>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] lg:hidden">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-extrabold leading-none text-slate-900">{formatInrCurrency(netTotal)}</p>
            <p className="mt-1 text-[11px] text-slate-500">
              Pay {formatInrCurrency(payable)} now · 50% advance
            </p>
          </div>
          <button
            type="button"
            disabled={submitting}
            onClick={onPay}
            className="h-12 min-w-[8.5rem] rounded-xl bg-[var(--cabzii-cta)] px-6 text-[15px] font-extrabold text-white hover:bg-[var(--cabzii-cta-hover)] disabled:opacity-70"
          >
            {bookLabel}
          </button>
        </div>
      </div>

      <OffersSheet
        open={offersOpen}
        onClose={() => setOffersOpen(false)}
        appliedCode={coupon}
        trip={trip}
        loginHref={loginHref || "/login"}
        onApplyCoupon={(code) => {
          onCoupon(code);
          setOffersOpen(false);
        }}
      />
    </div>
  );
}
