"use client";

import Link from "next/link";

export default function BookingForm({ selectedItem, itemType = "cab", onProceed, proceedHref }) {
  const title =
    itemType === "tour"
      ? selectedItem?.name ?? "—"
      : selectedItem?.name ?? selectedItem?.title ?? "—";
  const provider =
    itemType === "tour" ? selectedItem?.vendor ?? "—" : itemType === "driver" ? selectedItem?.vendor ?? "—" : selectedItem?.vendor ?? "—";
  const baseFare =
    itemType === "tour"
      ? Number(selectedItem?.price) || 0
      : itemType === "driver"
        ? Number(selectedItem?.pricing?.day) || Number(selectedItem?.pricing?.hourly) || 0
        : Number(selectedItem?.price) || 0;
  const total = baseFare;
  const langLine =
    itemType === "driver" ? (selectedItem?.languages?.length ? selectedItem.languages.join(", ") : "—") : provider;

  return (
    <section id="booking" className="py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-md md:p-6">
            <h2 className="text-2xl font-bold text-slate-900">Complete Your Booking</h2>
            <p className="mt-1 text-sm text-slate-600">Fill in your details to continue to payment.</p>
            <form className="mt-5 space-y-3">
              <input className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-sky-600" placeholder="Full Name" />
              <input className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-sky-600" placeholder="Phone Number" />
              <input className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-sky-600" placeholder="Email Address" />
              <textarea
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-sky-600"
                placeholder="Pickup Address"
                rows={3}
              />
              {proceedHref ? (
                <Link
                  href={proceedHref}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:scale-[1.01] hover:bg-sky-700"
                >
                  Proceed to Payment
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-500"
                >
                  Load a cab, driver, or tour to continue
                </button>
              )}
            </form>
          </div>

          <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-md md:p-6">
            <h3 className="text-xl font-bold text-slate-900">Booking Summary</h3>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>{itemType === "tour" ? "Tour Package" : itemType === "driver" ? "Driver" : "Cab Type"}</span>
                <span className="max-w-[60%] text-right font-semibold">{title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{itemType === "driver" ? "Languages" : "Vendor"}</span>
                <span className="max-w-[60%] text-right font-semibold">{langLine}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Base Fare</span>
                <span className="font-semibold">₹{baseFare.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-fuchsia-50 p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">Total Payable</span>
                <span className="text-xl font-bold text-fuchsia-600">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

