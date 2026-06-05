"use client";

import { isPaymentMethodEnabled, PAYMENT_SECTIONS } from "../../lib/paymentMethods";
import BottomSheet from "./BottomSheet";
import PaymentBrandIcon from "./PaymentBrandIcon";

function RadioMark({ selected, disabled = false }) {
  return (
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
        disabled ? "border-slate-200" : selected ? "border-[var(--cabzii-brand)]" : "border-slate-300"
      }`}
      aria-hidden
    >
      {selected && !disabled ? <span className="h-2.5 w-2.5 rounded-full bg-[var(--cabzii-brand)]" /> : null}
    </span>
  );
}

function OfferTag({ text, muted = false }) {
  return (
    <div
      className={`mt-2 flex gap-2 rounded-lg px-3 py-2.5 text-[11px] leading-relaxed ${
        muted ? "bg-slate-50 text-slate-400" : "bg-sky-50 text-slate-600"
      }`}
    >
      <svg className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
      <span>{text}</span>
    </div>
  );
}

export default function PaymentMethodSheet({ open, onClose, total, method, onSelect }) {
  const formatTotal = `₹${Number(total || 0).toLocaleString("en-IN")}`;

  return (
    <BottomSheet open={open} onClose={onClose} title="Payments" tall>
      <div className="px-4 pb-6">
        <div className="flex items-center justify-between py-2">
          <span className="text-sm font-medium text-slate-600">Total Fare</span>
          <span className="text-base font-bold text-slate-900">{formatTotal}</span>
        </div>
        <div className="mb-4 border-b border-dashed border-slate-300" aria-hidden />

        <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Only <strong>Cash</strong> is available right now. UPI, wallets & cards coming soon.
        </p>

        {PAYMENT_SECTIONS.map((section) => (
          <div key={section.id} className="mb-5">
            <div className="mb-2 flex items-center gap-2">
              {section.showUpiBadge ? <PaymentBrandIcon type="upi" className="h-6 w-6 rounded opacity-40" /> : null}
              <h3 className={`text-sm font-bold ${section.id === "others" ? "text-slate-800" : "text-slate-500"}`}>
                {section.title}
              </h3>
            </div>

            <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-white">
              {section.items.map((item) => {
                const enabled = isPaymentMethodEnabled(item.id);
                const selected = enabled && method === item.id;

                return (
                  <div
                    key={item.id}
                    className={`px-3 py-3 ${enabled ? "" : "opacity-45"}`}
                    aria-disabled={!enabled}
                  >
                    <button
                      type="button"
                      disabled={!enabled}
                      onClick={() => {
                        if (enabled) onSelect(item.id);
                      }}
                      className={`flex w-full items-center gap-3 text-left ${enabled ? "cursor-pointer" : "cursor-not-allowed"}`}
                    >
                      <PaymentBrandIcon type={item.icon} className={enabled ? "" : "grayscale"} />
                      <span className="min-w-0 flex-1">
                        <span className={`block text-sm font-semibold ${enabled ? "text-slate-900" : "text-slate-500"}`}>
                          {item.label}
                        </span>
                        {item.sublabel ? (
                          <span className="mt-0.5 block text-xs font-medium text-rose-400">{item.sublabel}</span>
                        ) : null}
                        {!enabled ? (
                          <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            Coming soon
                          </span>
                        ) : null}
                      </span>

                      {item.action === "add_money" ? (
                        <span className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-[11px] font-bold text-slate-400">
                          + Add Money
                        </span>
                      ) : null}

                      {item.action === "link" ? (
                        <span className="shrink-0 text-xs font-bold uppercase tracking-wide text-slate-400">Link</span>
                      ) : null}

                      {item.action === "choose" ? (
                        <span className="shrink-0 text-xs font-bold uppercase tracking-wide text-slate-400">Choose</span>
                      ) : null}

                      {!item.action ? <RadioMark selected={selected} disabled={!enabled} /> : null}
                    </button>

                    {item.offer ? <OfferTag text={item.offer} muted={!enabled} /> : null}
                    {item.hint ? <OfferTag text={item.hint} muted={!enabled} /> : null}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-[var(--cabzii-brand)] py-3.5 text-sm font-bold text-white transition hover:bg-[var(--cabzii-brand-hover)]"
        >
          Done
        </button>
      </div>
    </BottomSheet>
  );
}
