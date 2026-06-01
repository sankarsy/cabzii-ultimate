"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MOCK_HOTELS } from "../../lib/mock-data/hotels";
import { searchMockFlights } from "../../lib/mock-data/flights";
import { buildLoginHref, isLoggedIn } from "../../lib/auth";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

/**
 * Cabzii.in 2-step booking (traveller → payment) for demo flight/hotel.
 */
export default function EmtBookingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "flight";
  const id = searchParams.get("id") || "";
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [promo, setPromo] = useState("");
  const [promoOk, setPromoOk] = useState(null);
  const [error, setError] = useState("");

  const item =
    type === "hotel"
      ? MOCK_HOTELS.find((h) => h.id === id)
      : searchMockFlights({
          from: searchParams.get("from") || "DEL",
          to: searchParams.get("to") || "BOM"
        }).find((f) => f.id === id);

  const base = type === "hotel" ? item?.pricePerNight || 0 : item?.price || 0;
  const taxes = Math.round(base * 0.12);
  const fee = 299;
  const discount = promoOk ? Math.round(base * 0.05) : 0;
  const total = base + taxes + fee - discount;

  function validatePromo() {
    const ok = promo.trim().toUpperCase() === "CABZII500";
    setPromoOk(ok);
  }

  function continuePayment() {
    setError("");
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError("Fill traveller name, email and phone.");
      return;
    }
    if (!isLoggedIn()) {
      router.push(buildLoginHref(`/booking?${searchParams.toString()}&step=2`, "customer"));
      return;
    }
    setStep(2);
  }

  function pay() {
    const bookingId = `CZ${Date.now().toString(36).toUpperCase()}`;
    const q = new URLSearchParams({
      bookingId,
      type,
      title: type === "hotel" ? item?.name : `${item?.airline?.name} ${item?.flightNumber}`,
      total: String(total)
    });
    router.push(`/booking/confirmation?${q.toString()}`);
  }

  if (!item) {
    return <p className="py-12 text-center text-rose-600">Booking item not found.</p>;
  }

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-[1fr_300px]">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex gap-2 text-sm font-semibold">
          <span className={step === 1 ? "text-[var(--emt-primary)]" : "text-slate-400"}>1. Traveller</span>
          <span className="text-slate-300">→</span>
          <span className={step === 2 ? "text-[var(--emt-primary)]" : "text-slate-400"}>2. Payment</span>
        </div>

        {step === 1 ? (
          <>
            <h2 className="text-lg font-bold">Traveller details</h2>
            <div className="mt-4 space-y-3">
              <input
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
              />
              <input
                placeholder="Mobile"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
              />
            </div>
            {error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}
            <button
              type="button"
              onClick={continuePayment}
              className="mt-6 rounded-full bg-[var(--emt-primary)] px-8 py-3 font-bold text-white"
            >
              Continue to payment
            </button>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold">Payment</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {["Card", "UPI", "Net Banking", "Wallet"].map((m) => (
                <button key={m} type="button" className="rounded-lg border border-slate-200 py-2 font-medium hover:border-[var(--emt-primary)]">
                  {m}
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                placeholder="Promo code (try CABZII500)"
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <button type="button" onClick={validatePromo} className="rounded-lg border px-3 text-sm font-semibold">
                Apply
              </button>
            </div>
            {promoOk === true ? <p className="text-sm text-emerald-600">Promo applied — 5% off</p> : null}
            {promoOk === false ? <p className="text-sm text-rose-600">Invalid promo code</p> : null}
            <button type="button" onClick={pay} className="mt-6 w-full rounded-full bg-[var(--emt-primary)] py-3 font-bold text-white">
              Pay securely {formatINR(total)}
            </button>
          </>
        )}
      </div>

      <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-20">
        <h3 className="font-bold">{type === "hotel" ? item.name : `${item.airline.name} · ${item.flightNumber}`}</h3>
        <hr className="my-3 border-slate-100" />
        <div className="space-y-1 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>Base fare</span>
            <span>{formatINR(base)}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes</span>
            <span>{formatINR(taxes)}</span>
          </div>
          <div className="flex justify-between">
            <span>Convenience fee</span>
            <span>{formatINR(fee)}</span>
          </div>
          {discount ? (
            <div className="flex justify-between text-emerald-600">
              <span>Promo</span>
              <span>-{formatINR(discount)}</span>
            </div>
          ) : null}
        </div>
        <div className="mt-3 flex justify-between border-t pt-3 font-bold">
          <span>Total</span>
          <span>{formatINR(total)}</span>
        </div>
      </aside>
    </div>
  );
}
