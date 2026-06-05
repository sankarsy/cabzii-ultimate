"use client";

import PaymentBrandIcon from "./PaymentBrandIcon";

export default function PaymentCheckoutFooter({
  bookLabel = "Confirm booking",
  submitting = false,
  submitError = "",
  appliedCoupon = "",
  onOpenPayments,
  onOpenOffers,
  onConfirm,
  inline = false
}) {
  const ctaLabel = submitting ? "Processing…" : bookLabel;

  const wrapperClass = inline
    ? "mt-6"
    : "fixed inset-x-0 bottom-0 z-[90] border-t border-slate-200 bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.08)]";

  return (
    <div className={wrapperClass}>
      {appliedCoupon ? (
        <div
          className={`text-center text-xs font-semibold text-emerald-800 ${
            inline ? "mb-2 rounded-lg bg-emerald-50 px-3 py-2" : "border-b border-emerald-100 bg-emerald-50 px-4 py-2"
          }`}
        >
          Coupon {appliedCoupon} applied
        </div>
      ) : null}

      <div className={inline ? "" : "mx-auto max-w-5xl px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-4"}>
        <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white">
          <button
            type="button"
            onClick={onOpenPayments}
            className="flex min-w-0 flex-1 items-center gap-2.5 border-r border-slate-200 px-3 py-3.5 text-left transition active:bg-slate-50"
            aria-label="Payment method Cash, tap to see other options"
          >
            <PaymentBrandIcon type="cash" className="h-8 w-8 rounded-lg" />
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900">Cash</span>
            <svg className="h-4 w-4 shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onOpenOffers}
            className="flex min-w-0 flex-1 items-center gap-2.5 px-3 py-3.5 text-left transition active:bg-slate-50"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--cabzii-brand)]/10 text-sm font-bold text-[var(--cabzii-brand)]">
              %
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900">Offers</span>
            <svg className="h-4 w-4 shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {submitError ? (
          <p className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">{submitError}</p>
        ) : null}

        <button
          type="button"
          disabled={submitting}
          onClick={onConfirm}
          className="mt-2 w-full rounded-full bg-[var(--cabzii-brand)] py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-[var(--cabzii-brand-hover)] disabled:opacity-60"
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
