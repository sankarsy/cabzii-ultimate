"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import PaymentBreakdown from "../../components/PaymentBreakdown";

function firstParam(value) {
  if (Array.isArray(value)) return String(value[0] ?? "").trim();
  return String(value ?? "").trim();
}

export default function PaymentPage({ searchParams }) {
  const router = useRouter();
  const [method, setMethod] = useState("card");
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
  const baseFare = Number(searchParams?.baseFare ?? 0);
  const total = baseFare > 0 ? baseFare : Number(searchParams?.total ?? 0);
  const listPrice = Number(searchParams?.listPrice ?? baseFare);
  const discountPct = Number(searchParams?.discountPct ?? 0);
  const discountAmount = Number(searchParams?.discountAmount ?? Math.max(0, listPrice - baseFare));
  const packageLabel = firstParam(searchParams?.package);
  const serviceTab = firstParam(searchParams?.service);
  const tourPersons = Number(searchParams?.persons) || 1;

  const [selectedItem, setSelectedItem] = useState(null);

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
        const res = await fetch(base, { cache: "no-store" });
        const data = await res.json();
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
      taxes: 0,
      total,
      extraKm: Number(searchParams?.extraKm) || undefined,
      extraHr: Number(searchParams?.extraHr) || undefined
    };
  }, [type, packageLabel, serviceTab, listPrice, discountPct, discountAmount, baseFare, total, searchParams?.extraKm, searchParams?.extraHr]);

  const backHref =
    type === "cab" && itemId
      ? `/cabs/${itemId}`
      : type === "driver" && itemId
        ? `/drivers/${itemId}`
        : type === "tour" && itemId
          ? `/tour-booking?id=${itemId}`
          : type === "tour"
            ? "/packages"
            : "/drivers";

  const bookingType = type === "tour" ? "tour" : type === "driver" ? "driver" : "cab";

  const confirmBooking = async () => {
    if (!itemId) {
      setSubmitError("Missing booking item. Go back and select again.");
      return;
    }
    if (!customerName.trim() || !phone.trim()) {
      setSubmitError("Please enter your name and mobile number.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("cabzii_admin_token") : "";
      const res = await fetch("/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          customerName: customerName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          type: bookingType,
          itemId,
          pickup:
            type === "tour" && tourPersons > 1
              ? `${pickup.trim()} (${tourPersons} persons)`.trim()
              : pickup,
          drop: type === "tour" ? "" : drop,
          date,
          routeType:
            type === "tour"
              ? `${tourPersons} persons`
              : serviceTab || firstParam(searchParams?.routeType),
          tripType: firstParam(searchParams?.tripType),
          amount: total
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Booking failed");
      const id = data?.data?._id || data?.data?.id;
      setBookingId(String(id || ""));
      if (method !== "payLater") {
        setSubmitError("");
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-sky-50/40 to-white">
      <Navbar />
      <section className="py-10 md:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <nav className="mb-4 text-xs text-slate-500">
            <Link href={backHref} className="font-medium text-[#0056D2] hover:underline">
              ← Back to {type === "driver" ? "driver" : type === "tour" ? "package" : "cab"} details
            </Link>
          </nav>

          <h1 className="text-2xl font-bold text-slate-900">Secure payment</h1>
          <p className="mt-1 text-sm text-slate-600">Step 2 of 2 — confirm payment to complete your booking.</p>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md md:p-6">
              <h2 className="text-lg font-bold text-slate-900">Your details</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#0056D2]"
                  placeholder="Full name *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <input
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#0056D2]"
                  placeholder="Mobile number *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <input
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#0056D2] sm:col-span-2"
                  placeholder="Email (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#0056D2]"
                  placeholder="Pickup"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                />
                {type !== "tour" ? (
                  <input
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#0056D2]"
                    placeholder="Drop"
                    value={drop}
                    onChange={(e) => setDrop(e.target.value)}
                  />
                ) : null}
                <input
                  type="date"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#0056D2] sm:col-span-2"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              {bookingId ? (
                <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                  <p className="font-semibold">Booking confirmed!</p>
                  <p className="mt-1">Reference: {bookingId}</p>
                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="mt-3 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white"
                  >
                    Back to home
                  </button>
                </div>
              ) : (
                <>
              <h2 className="mt-6 text-lg font-bold text-slate-900">Payment method</h2>
              <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setMethod("card")}
                  className={`rounded-md px-3 py-2 text-xs font-semibold ${method === "card" ? "bg-white text-slate-900 shadow" : "text-slate-600"}`}
                >
                  Card
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("upi")}
                  className={`rounded-md px-3 py-2 text-xs font-semibold ${method === "upi" ? "bg-white text-slate-900 shadow" : "text-slate-600"}`}
                >
                  UPI
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("payLater")}
                  className={`rounded-md px-3 py-2 text-xs font-semibold ${method === "payLater" ? "bg-white text-slate-900 shadow" : "text-slate-600"}`}
                >
                  Pay later
                </button>
              </div>
              <div className="mt-5 space-y-3">
                {method === "card" && (
                  <>
                    <input
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#0056D2]"
                      placeholder="Card holder name"
                    />
                    <input
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#0056D2]"
                      placeholder="Card number"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#0056D2]"
                        placeholder="MM/YY"
                      />
                      <input
                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#0056D2]"
                        placeholder="CVV"
                      />
                    </div>
                  </>
                )}
                {method === "upi" && (
                  <input
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#0056D2]"
                    placeholder="UPI ID (name@bank)"
                  />
                )}
                {method === "payLater" && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                    Pay after your ride. Our team will call to confirm before assigning a driver.
                  </div>
                )}
                {submitError ? (
                  <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">{submitError}</p>
                ) : null}
                <button
                  type="button"
                  disabled={submitting}
                  onClick={confirmBooking}
                  className="w-full rounded-xl bg-[#0056D2] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0047b3] disabled:opacity-60"
                >
                  {submitting
                    ? "Processing…"
                    : method === "payLater"
                      ? "Confirm booking"
                      : `Pay ₹${total.toLocaleString("en-IN")}`}
                </button>
              </div>
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
                  type: "Tour",
                  vendor: selectedItem.vendor
                }}
                selection={{
                  packageLabel: selectedItem.duration || selectedItem.name,
                  serviceTab: "tour",
                  listPrice: Number(searchParams?.listPrice) || baseFare,
                  discountPct,
                  discountAmount,
                  baseFare,
                  total,
                  persons: tourPersons,
                  pickup: firstParam(searchParams?.pickup),
                  date: firstParam(searchParams?.date),
                  note:
                    tourPersons > 1
                      ? `${tourPersons} travellers — tour package total`
                      : "Tour package total"
                }}
                showExtrasNote={false}
                footerNote="Tour fare is per person × number of travellers. No extra km/hour charges."
              />
            ) : (
              <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md md:p-6">
                <h2 className="text-lg font-bold text-slate-900">Order summary</h2>
                <p className="mt-2 text-sm text-slate-700">{selectedItem?.title ?? selectedItem?.name ?? "Booking"}</p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base fare</span>
                    <span className="font-semibold">₹{baseFare.toLocaleString("en-IN")}</span>
                  </div>
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
        </div>
      </section>
      <Footer />
    </main>
  );
}


