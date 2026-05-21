"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import PaymentBreakdown from "../../components/PaymentBreakdown";
import PickupPlaceInput from "../../components/PickupPlaceInput";
import SimilarPackages from "../../components/SimilarPackages";
import {
  CARD_BOOK_BTN_CLASS,
  MetaPill,
  ProductImageFrame,
  ProductMetaBlock
} from "../../components/productCardShared";
import {
  MAX_TOUR_PERSONS,
  MIN_TOUR_PERSONS,
  buildTourPaymentParams,
  calculateTourTotals,
  clampTourPersons,
  tourSelectionFromTotals
} from "../../lib/tourFare";

const FALLBACK_TOUR_IMAGE =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=60";

const SECTION_LINKS = [
  { href: "#booking-details", label: "Booking" },
  { href: "#about", label: "About" },
  { href: "#similar-packages", label: "Similar tours" }
];

function firstParam(value) {
  if (Array.isArray(value)) return String(value[0] ?? "").trim();
  return String(value ?? "").trim();
}

export default function TourBookingPage({ searchParams }) {
  const rawId = firstParam(searchParams?.id);
  const [pkg, setPkg] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [pickup, setPickup] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [persons, setPersons] = useState(2);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!rawId) {
      setPkg(null);
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
            setPkg(null);
            setLoadError(json?.message || "Package not found.");
          }
        } else if (!cancelled) {
          setPkg(json.data);
        }
      } catch {
        if (!cancelled) {
          setPkg(null);
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

  const pkgId = pkg ? String(pkg._id ?? pkg.id ?? "") : "";
  const discountPct = Number(pkg?.discountPercentage) || 0;
  const totals = useMemo(
    () => (pkg ? calculateTourTotals(pkg.price, persons, discountPct) : null),
    [pkg, persons, discountPct]
  );

  const selection = useMemo(
    () => (pkg && totals ? tourSelectionFromTotals(pkg, totals, { pickup, date: travelDate }) : null),
    [pkg, totals, pickup, travelDate]
  );

  const payHref = useMemo(() => {
    if (!pkgId || !totals) return undefined;
    if (!pickup.trim()) return undefined;
    const q = buildTourPaymentParams(pkgId, { totals, pickup, date: travelDate });
    return `/payment?${q.toString()}`;
  }, [pkgId, totals, pickup, travelDate]);

  const tagLabel =
    pkg?.tag || (Array.isArray(pkg?.tags) && pkg.tags[0] ? String(pkg.tags[0]) : "Tour");
  const imageSrc = (pkg?.image && String(pkg.image).trim()) || FALLBACK_TOUR_IMAGE;
  const d = Math.min(99, Math.max(0, discountPct));

  const seoTitle = pkg?.seoTitle || (pkg ? `${pkg.name} – Tour Package` : "Tour");
  const seoDescription =
    pkg?.seoDescription ||
    (pkg ? `Book ${pkg.name} with ${pkg.vendor}. Choose pickup and number of travellers on cabzii.in.` : "");
  const seoKeywords = (pkg?.seo || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const imageBadges = pkg ? (
    <>
      <div className="absolute left-1.5 top-1.5 flex items-center gap-1">
        {d > 0 && (
          <span className="rounded-md bg-orange-500 px-1.5 py-0.5 text-[8px] font-bold text-white shadow">
            {d}% OFF
          </span>
        )}
        <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-white backdrop-blur">
          {tagLabel}
        </span>
      </div>
      {pkg.duration ? (
        <span className="absolute right-1.5 top-1.5 rounded-full bg-white px-1.5 py-0.5 text-[8px] font-semibold text-slate-700 shadow-sm">
          {pkg.duration}
        </span>
      ) : null}
    </>
  ) : null;

  const handleProceed = () => {
    if (!pickup.trim()) {
      setFormError("Please enter a pickup location.");
      return;
    }
    if (!payHref) return;
    setFormError("");
    window.location.href = payHref;
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-sky-50/60 to-violet-50/40">
      <Navbar />
      <section className="py-8 md:py-10">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <nav className="mb-4 text-xs text-slate-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#0056D2]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/packages" className="hover:text-[#0056D2]">
              Tours
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-700">{pkg?.name ?? "Details"}</span>
          </nav>

          {loading ? (
            <div className="rounded-[18px] border border-slate-200 bg-white p-12 text-center text-sm text-slate-600">
              Loading tour package…
            </div>
          ) : loadError || !pkg ? (
            <div className="rounded-[18px] border border-amber-200 bg-amber-50 p-8 text-center">
              <p className="font-semibold text-amber-900">{loadError || "Package not available."}</p>
              <Link href="/packages" className="mt-4 inline-block text-sm font-semibold text-[#0056D2] hover:underline">
                ← Browse all tours
              </Link>
            </div>
          ) : (
            <>
              <header className="mb-5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#0056D2]">Tour package</p>
                <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">{seoTitle}</h1>
                {seoDescription ? <p className="mt-1.5 max-w-3xl text-xs text-slate-600">{seoDescription}</p> : null}
              </header>

              <nav
                className="mb-5 flex gap-1.5 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 text-xs shadow-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                aria-label="Page sections"
              >
                {SECTION_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="shrink-0 rounded-lg px-2.5 py-1 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-[#0056D2]"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                  <article className="overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-lg">
                    <ProductImageFrame
                      src={imageSrc}
                      alt={pkg.name}
                      badges={imageBadges}
                      imageClassName="h-[200px] w-full object-cover object-center sm:h-[240px]"
                    />
                    <ProductMetaBlock title={pkg.name} vendor={pkg.vendor}>
                      {pkg.duration ? (
                        <MetaPill icon={<CalendarIcon className="h-2.5 w-2.5" />} label={pkg.duration} />
                      ) : null}
                      <MetaPill icon={<UsersIcon className="h-2.5 w-2.5" />} label="Per person fare" />
                      <MetaPill icon={<MapPinIcon className="h-2.5 w-2.5" />} label="Flexible pickup" />
                    </ProductMetaBlock>
                  </article>

                  <section
                    id="booking-details"
                    className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"
                  >
                    <h2 className="text-base font-bold text-slate-900">Booking details</h2>
                    <p className="mt-1 text-xs text-slate-600">
                      Enter pickup and how many people are travelling. Total updates automatically.
                    </p>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <PickupPlaceInput value={pickup} onChange={setPickup} />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                          Number of persons <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPersons((p) => clampTourPersons(p - 1))}
                            disabled={persons <= MIN_TOUR_PERSONS}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-lg font-bold text-slate-700 disabled:opacity-40"
                            aria-label="Decrease persons"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min={MIN_TOUR_PERSONS}
                            max={MAX_TOUR_PERSONS}
                            value={persons}
                            onChange={(e) => setPersons(clampTourPersons(e.target.value))}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-center text-sm font-semibold outline-none focus:border-[#0056D2]"
                          />
                          <button
                            type="button"
                            onClick={() => setPersons((p) => clampTourPersons(p + 1))}
                            disabled={persons >= MAX_TOUR_PERSONS}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-lg font-bold text-slate-700 disabled:opacity-40"
                            aria-label="Increase persons"
                          >
                            +
                          </button>
                        </div>
                        <p className="mt-1 text-[10px] text-slate-500">
                          ₹{totals?.perPersonPay.toLocaleString("en-IN")} per person × {totals?.persons} = ₹
                          {totals?.total.toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Travel date</label>
                        <input
                          type="date"
                          value={travelDate}
                          onChange={(e) => setTravelDate(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0056D2]"
                        />
                      </div>
                    </div>

                    {formError ? (
                      <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
                        {formError}
                      </p>
                    ) : null}
                  </section>

                  <article
                    id="about"
                    className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"
                  >
                    <h2 className="text-base font-bold text-slate-900">About this tour</h2>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {seoDescription ||
                        `Book ${pkg.name} (${pkg.duration}) with ${pkg.vendor} on cabzii.in. All-inclusive tour transport with clear per-person pricing.`}
                    </p>
                    {seoKeywords.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {seoKeywords.map((kw) => (
                          <span
                            key={kw}
                            className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-700"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <ul className="mt-3 grid gap-1.5 text-xs text-slate-600 sm:grid-cols-2">
                      <li>✓ Per person transparent pricing</li>
                      <li>✓ Pickup location of your choice</li>
                      <li>✓ Verified tour partner</li>
                      <li>✓ Secure online booking</li>
                    </ul>
                  </article>

                  <SimilarPackages
                    currentPackageId={pkgId}
                    duration={pkg.duration}
                    vendor={pkg.vendor}
                  />
                </div>

                <aside className="lg:col-span-1">
                  <div className="sticky top-24 space-y-4">
                    <PaymentBreakdown
                      item={{
                        title: pkg.name,
                        type: "Tour",
                        vendor: pkg.vendor
                      }}
                      selection={selection}
                      showExtrasNote={false}
                      compact
                      footerNote="Tour package price is all-inclusive per person. No extra km or hour charges."
                    />
                    <button type="button" onClick={handleProceed} className={CARD_BOOK_BTN_CLASS}>
                      Continue to payment
                    </button>
                  </div>
                </aside>
              </div>
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}

function CalendarIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function MapPinIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function UsersIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3 20a6 6 0 0 1 12 0M14 20a5 5 0 0 1 8 0" />
    </svg>
  );
}
