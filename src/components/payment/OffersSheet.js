"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { OFFER_COUPONS } from "../../lib/paymentMethods";
import BottomSheet from "./BottomSheet";

export default function OffersSheet({ open, onClose, onApplyCoupon, appliedCode = "" }) {
  const [couponInput, setCouponInput] = useState("");
  const [message, setMessage] = useState("");

  const tryApply = (code) => {
    const normalized = String(code || "").trim().toUpperCase();
    const match = OFFER_COUPONS.find((c) => c.code === normalized);
    if (!match) {
      setMessage("Invalid coupon code.");
      return;
    }
    setMessage(`Coupon ${match.code} applied!`);
    onApplyCoupon(match.code);
    setCouponInput("");
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={null}
      tall
    >
      <div className="px-4 pb-6">
        <div className="flex items-center justify-between py-3">
          <h2 className="text-xl font-bold text-slate-900">Offers</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={2} aria-hidden />
          </button>
        </div>

        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-sm font-bold text-slate-900">Use Cabzii Rewards</p>
          <p className="text-xs text-slate-500">You don&apos;t have any rewards currently</p>
          <div className="mt-2 flex items-center justify-end gap-1 text-sm font-bold text-amber-600">
            0 <Star className="h-4 w-4 fill-amber-500 text-amber-500" strokeWidth={0} aria-hidden />
          </div>
        </div>

        <div className="mb-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-100 px-3 py-3">
          <p className="text-sm font-bold text-slate-900">
            UNLIMITED Discounts! <span className="text-rose-600">Buy Pass Now →</span>
          </p>
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Coupons</p>
        <div className="mb-4 flex gap-2">
          <input
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder="Enter Coupon Code"
            className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#0056D2]"
          />
          <button
            type="button"
            onClick={() => tryApply(couponInput)}
            disabled={!couponInput.trim()}
            className="shrink-0 rounded-xl bg-[var(--cabzii-brand)] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[var(--cabzii-brand-hover)] disabled:bg-slate-200 disabled:text-slate-400"
          >
            Apply
          </button>
        </div>

        {message ? <p className="mb-3 text-xs font-medium text-emerald-700">{message}</p> : null}
        {appliedCode ? (
          <p className="mb-3 text-xs text-slate-600">
            Applied: <span className="font-bold text-slate-900">{appliedCode}</span>
          </p>
        ) : null}

        <div className="space-y-3">
          {OFFER_COUPONS.map((coupon) => (
            <article key={coupon.code} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--cabzii-brand)]/10 text-xs font-bold text-[var(--cabzii-brand)]">
                  {coupon.code.slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900">{coupon.title}</p>
                  <p className="mt-0.5 text-xs text-[var(--cabzii-brand)]">{coupon.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => tryApply(coupon.code)}
                  className="shrink-0 rounded-full bg-[var(--cabzii-brand)] px-4 py-1.5 text-xs font-bold text-white transition hover:bg-[var(--cabzii-brand-hover)]"
                >
                  Apply
                </button>
              </div>
              <div className="mt-3 border-t border-dashed border-slate-200 pt-2 text-xs text-slate-600">
                {coupon.save}
              </div>
            </article>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
}
