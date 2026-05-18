"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

function firstParam(value) {
  if (Array.isArray(value)) return String(value[0] ?? "").trim();
  return String(value ?? "").trim();
}

export default function TourBookingPage({ searchParams }) {
  const rawId = firstParam(searchParams?.id);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [distanceKm, setDistanceKm] = useState(40);

  useEffect(() => {
    if (!rawId) {
      setSelectedPackage(null);
      setLoadError("Missing package id.");
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError("");
      try {
        const res = await fetch(`/api/packages/${encodeURIComponent(rawId)}`, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok || !json?.data) {
          if (!cancelled) {
            setSelectedPackage(null);
            setLoadError(json?.message || "Package not found.");
          }
        } else if (!cancelled) {
          setSelectedPackage(json.data);
        }
      } catch {
        if (!cancelled) {
          setSelectedPackage(null);
          setLoadError("Could not load package.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [rawId]);

  const pkgId = selectedPackage ? String(selectedPackage._id ?? selectedPackage.id ?? "") : "";
  const baseFare = selectedPackage?.price ?? 0;
  const distanceValue = Number(distanceKm) || 0;
  const extraDistanceFare = distanceValue > 100 ? Math.round((distanceValue - 100) * 14) : 0;
  const subtotal = baseFare + extraDistanceFare;
  const total = subtotal;
  const discountPct = selectedPackage?.discountPercentage ?? 0;

  const payHref = useMemo(
    () =>
      `/payment?type=tour&id=${pkgId}&baseFare=${subtotal}&taxes=0&total=${total}&distanceKm=${distanceKm}`,
    [distanceKm, pkgId, subtotal, total]
  );

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-sky-50/60 to-violet-50/40">
      <Navbar />
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6 px-4 md:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-md md:p-6">
            <h1 className="text-2xl font-bold text-slate-900">Tour Booking</h1>
            <p className="mt-1 text-sm text-slate-600">Select from/to and distance to calculate final price.</p>

            {loading ? (
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">Loading package…</div>
            ) : loadError || !selectedPackage ? (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{loadError || "Package not available."}</div>
            ) : (
              <>
                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-900">{selectedPackage.name}</p>
                  <p className="text-xs text-slate-500">
                    Starting from ₹{selectedPackage.price?.toLocaleString("en-IN")} • {discountPct}% OFF
                  </p>
                </div>

                <div className="mt-4 space-y-3">
                  <input
                    type="number"
                    min={1}
                    value={distanceKm}
                    onChange={(event) => setDistanceKm(event.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-600"
                    placeholder="Distance in KM"
                  />
                  <p className="text-xs text-slate-500">Applicable distance 100 km, extra distance charged at ₹14/km.</p>
                  <Link
                    href={payHref}
                    className="inline-flex w-full items-center justify-center rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
                  >
                    Proceed to Payment
                  </Link>
                </div>
              </>
            )}
          </div>

          <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-md md:p-6">
            <h2 className="text-xl font-bold text-slate-900">Fare Summary</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>Package starting from</span>
                <span className="font-semibold">₹{baseFare.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Applicable distance</span>
                <span className="font-semibold">100 km</span>
              </div>
              {extraDistanceFare > 0 && (
                <div className="flex items-center justify-between">
                  <span>Extra fare ({Math.max(0, distanceValue - 100)} km × ₹14)</span>
                  <span className="font-semibold">₹{extraDistanceFare.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-sky-50 p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">Total Payable</span>
                <span className="text-xl font-bold text-sky-700">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </main>
  );
}
