"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { OFFER_COUPONS, couponsForTrip } from "../../lib/paymentMethods";
import { formatInrCurrency } from "../../lib/formatInr";
import { isLoggedIn } from "../../lib/auth";
import BottomSheet from "./BottomSheet";

function CouponTicket({ coupon, selected, onApply }) {
  const min = Number(coupon.minOrder) > 0 ? formatInrCurrency(coupon.minOrder) : "";
  return (
    <button
      type="button"
      onClick={() => onApply(coupon.code)}
      className={`relative flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition ${
        selected
          ? "border-[var(--cabzii-cta)] ring-1 ring-[var(--cabzii-cta)]"
          : "border-slate-200 hover:border-amber-300"
      }`}
    >
      <div className="px-4 pb-3 pt-4">
        <p className="flex items-center gap-2 text-base font-extrabold text-slate-900">
          <svg className="h-4 w-4 text-[var(--cabzii-cta)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          {coupon.amountLabel || coupon.title}
        </p>
        <p className="mt-1 text-[13px] font-semibold text-[var(--cabzii-cta)]">
          Use Code {coupon.code}
          {coupon.offHint ? ` to get ${coupon.offHint} Off` : ""}
        </p>
      </div>
      <div className="relative">
        <span
          className="pointer-events-none absolute -left-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-[#f4f6fa] ring-1 ring-slate-200"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute -right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-[#f4f6fa] ring-1 ring-slate-200"
          aria-hidden
        />
        <div className="mx-4 border-t border-dashed border-amber-300" />
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        {min ? (
          <p className="text-[12px] font-semibold text-[var(--cabzii-cta)]">Minimum order value: {min}</p>
        ) : (
          <p className="text-[12px] font-semibold text-[var(--cabzii-cta)]">No minimum fare</p>
        )}
        <p className="mt-2 text-[12px] leading-relaxed text-slate-600">{coupon.desc}</p>
        {selected ? <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-emerald-700">Applied</p> : null}
      </div>
    </button>
  );
}

export default function OffersSheet({ open, onClose, onApplyCoupon, appliedCode = "", trip = null, loginHref = "/login" }) {
  const [couponInput, setCouponInput] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const applicable = trip ? couponsForTrip(trip) : OFFER_COUPONS;

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, [open]);

  const tryApply = (code) => {
    const normalized = String(code || "").trim().toUpperCase();
    const match = OFFER_COUPONS.find((c) => c.code === normalized);
    if (!match) {
      setMessage("This code is not valid.");
      return;
    }
    if (trip && !applicable.some((c) => c.code === match.code)) {
      setMessage(`${match.code} does not apply to this trip.`);
      return;
    }
    setMessage(`Coupon ${match.code} applied.`);
    onApplyCoupon(match.code);
    setCouponInput("");
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Coupon & Offers" tall wide>
      <div className="bg-[#f4f6fa] px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-3 sm:px-6">
        <div className="mb-4 flex gap-2">
          <input
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder="Enter coupon code"
            className="min-h-12 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-base uppercase outline-none focus:border-[var(--cabzii-cta)] sm:text-sm"
          />
          <button
            type="button"
            onClick={() => tryApply(couponInput)}
            disabled={!couponInput.trim()}
            className="min-h-12 shrink-0 rounded-xl bg-[var(--cabzii-cta)] px-4 text-xs font-bold uppercase tracking-wide text-white hover:bg-[var(--cabzii-cta-hover)] disabled:bg-slate-200 disabled:text-slate-400"
          >
            Apply
          </button>
        </div>
        {message ? <p className="mb-3 text-xs font-medium text-slate-700">{message}</p> : null}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {OFFER_COUPONS.map((coupon) => (
            <CouponTicket
              key={coupon.code}
              coupon={coupon}
              selected={appliedCode === coupon.code}
              onApply={tryApply}
            />
          ))}
        </div>

        {!loggedIn ? (
          <p className="mt-6 text-right">
            <Link href={loginHref} className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
              Login to avail more coupon →
            </Link>
          </p>
        ) : null}
      </div>
    </BottomSheet>
  );
}
