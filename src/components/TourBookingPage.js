"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import PaymentBreakdown from "./PaymentBreakdown";
import PickupPlaceInput from "./PickupPlaceInput";
import SimilarPackages from "./SimilarPackages";
import AdditionalChargesGrid from "./AdditionalChargesGrid";
import { resolveMediaUrl } from "../lib/media";
import { MapPinIcon } from "./icons";
import { buildTourChargeItems } from "../lib/productCharges";
import {
  CARD_BOOK_BTN_CLASS,
  MetaPill,
  ProductImageFrame,
  ProductMetaBlock
} from "./productCardShared";
import { cabTypeById, categoryLabel, resolveHolidayCabTypes } from "../lib/holidays";
import {
  MAX_TOUR_PERSONS,
  MIN_TOUR_PERSONS,
  buildTourPaymentParams,
  calculateTourTotals,
  clampTourPersons,
  tourSelectionFromTotals
} from "../lib/tourFare";

const FALLBACK_TOUR_IMAGE =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=60";

const SECTION_LINKS = [
  { href: "#booking-details", label: "Booking" },
  { href: "#about", label: "About" },
  { href: "#similar-packages", label: "Similar packages" }
];

function firstParam(value) {
  if (Array.isArray(value)) return String(value[0] ?? "").trim();
  return String(value ?? "").trim();
}

export default function TourBookingPage({ searchParams, initialPackage = null }) {
  const rawId = firstParam(searchParams?.id);
  const [pkg, setPkg] = useState(initialPackage);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(!initialPackage);
  const [pickup, setPickup] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [persons, setPersons] = useState(2);
  const [formError, setFormError] = useState("");

  const cabTypes = useMemo(() => (pkg ? resolveHolidayCabTypes(pkg) : []), [pkg]);
  const [cabTypeId, setCabTypeId] = useState("sedan");

  useEffect(() => {
    if (cabTypes.length) setCabTypeId(cabTypes[0].id);
  }, [pkg?._id, cabTypes]);

  const selectedCab = useMemo(() => cabTypeById(cabTypes, cabTypeId), [cabTypes, cabTypeId]);
  const cabMultiplier = selectedCab?.multiplier ?? 1;

  useEffect(() => {
    if (initialPackage) {
      setPkg(initialPackage);
      setLoading(false);
      return undefined;
    }
    if (!rawId) {
      setPkg(null);
      setLoadError("Missing package id.");
      setLoading(false);
      return undefined;
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
  }, [rawId, initialPackage]);

  const pkgId = pkg ? String(pkg._id ?? pkg.id ?? "") : "";
  const discountPct = Number(pkg?.discountPercentage) || 0;
  const listBase = Number(pkg?.originalPrice) > 0 ? Number(pkg.originalPrice) : Number(pkg?.price) || 0;
  const totals = useMemo(
    () => (pkg ? calculateTourTotals(listBase, persons, discountPct, cabMultiplier) : null),
    [pkg, persons, discountPct, cabMultiplier, listBase]
  );

  const selection = useMemo(
    () =>
      pkg && totals
        ? tourSelectionFromTotals(pkg, totals, {
            pickup,
            date: travelDate,
            cabType: selectedCab?.id,
            cabLabel: selectedCab?.label
          })
        : null,
    [pkg, totals, pickup, travelDate, selectedCab]
  );

  const payHref = useMemo(() => {
    if (!pkgId || !totals) return undefined;
    if (!pickup.trim()) return undefined;
    const q = buildTourPaymentParams(pkgId, {
      totals,
      pickup,
      date: travelDate,
      cabType: selectedCab?.id,
      cabLabel: selectedCab?.label
    });
    return `/payment?${q.toString()}`;
  }, [pkgId, totals, pickup, travelDate, selectedCab]);

  const tagLabel = pkg?.category
    ? categoryLabel(pkg.category)
    : pkg?.tag || (Array.isArray(pkg?.tags) && pkg.tags[0] ? String(pkg.tags[0]) : "Holiday");
  const tourChargeItems = buildTourChargeItems();
  const imageSrc = resolveMediaUrl(pkg?.image) || FALLBACK_TOUR_IMAGE;
  const d = Math.min(99, Math.max(0, discountPct));

  const seoTitle = pkg?.seoTitle || (pkg ? `${pkg.name} – Holiday Package` : "Holiday");
  const seoDescription =
    pkg?.seoDescription ||
    (pkg ? `Book ${pkg.name} with ${pkg.vendor}. Choose pickup and number of travellers on cabzii.in.` : "");
  const seoKeywords = (pkg?.seo || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const imageBadges = pkg ? (
    <div className="absolute left-1.5 top-1.5 flex items-center gap-1">
      {d > 0 && (
        <span className="rounded-md bg-[var(--cabzii-brand)] px-1.5 py-0.5 text-[8px] font-bold text-white shadow">
          {d}% OFF
        </span>
      )}
      <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-white backdrop-blur">
        {tagLabel}
      </span>
    </div>
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
    <section className="bg-cabzii-page py-8 md:py-10">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
          <nav className="mb-4 text-xs text-slate-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[var(--cabzii-brand)]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/holidays" className="hover:text-[var(--cabzii-brand)]">
              Holidays
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-700">{pkg?.name ?? "Details"}</span>
          </nav>

          {loading ? (
            <div className="rounded-[18px] border border-slate-200 bg-white p-12 text-center text-sm text-slate-600">
              Loading holiday package…
            </div>
          ) : loadError || !pkg ? (
            <div className="rounded-[18px] border border-amber-200 bg-amber-50 p-8 text-center">
              <p className="font-semibold text-amber-900">{loadError || "Package not available."}</p>
              <Link href="/holidays" className="mt-4 inline-block text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
                ← Browse all holidays
              </Link>
            </div>
          ) : (
            <>
              <header className="mb-5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--cabzii-brand)]">Holiday package</p>
                <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">{seoTitle}</h1>
                {seoDescription ? <p className="mt-1.5 max-w-3xl text-xs text-slate-600">{seoDescription}</p> : null}
              </header>

              <nav
                className="scroll-x-touch mb-5 flex gap-1.5 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 text-xs shadow-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                aria-label="Page sections"
              >
                {SECTION_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="shrink-0 rounded-lg px-2.5 py-1 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-[var(--cabzii-brand)]"
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
                      {pkg.city ? <MetaPill icon={<MapPinIcon className="h-2.5 w-2.5" />} label={pkg.city} /> : null}
                      <MetaPill label="Toll, permit & driver bata extra" />
                    </ProductMetaBlock>
                  </article>

                  <section
                    id="booking-details"
                    className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"
                  >
                    <h2 className="text-base font-bold text-slate-900">Booking details</h2>
                    <p className="mt-1 text-xs text-slate-600">
                      Enter pickup, cab type and group size. Package fare is flat — toll, permit & driver bata are extra.
                    </p>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="mb-2 block text-xs font-semibold text-slate-700">
                          Cab type <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {cabTypes.map((cab) => (
                            <button
                              key={cab.id}
                              type="button"
                              onClick={() => setCabTypeId(cab.id)}
                              className={`rounded-xl border px-3 py-2 text-left text-xs transition ${
                                cabTypeId === cab.id
                                  ? "border-[var(--cabzii-brand)] bg-blue-50 font-semibold text-[var(--cabzii-brand)]"
                                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                              }`}
                            >
                              <span className="block font-semibold">{cab.label}</span>
                              <span className="text-[10px] text-slate-500">{cab.seats} seats</span>
                              {cab.multiplier > 1 ? (
                                <span className="text-[10px] text-amber-700">+{Math.round((cab.multiplier - 1) * 100)}% fare</span>
                              ) : null}
                            </button>
                          ))}
                        </div>
                      </div>

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
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-center text-sm font-semibold outline-none focus:border-[var(--cabzii-brand)]"
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
                          Package fare: ₹{totals?.total.toLocaleString("en-IN")} (excl. toll, permit & driver bata)
                        </p>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">Travel date</label>
                        <input
                          type="date"
                          value={travelDate}
                          onChange={(e) => setTravelDate(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[var(--cabzii-brand)]"
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
                    <h2 className="text-base font-bold text-slate-900">About this package</h2>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {seoDescription ||
                        `Book ${pkg.name} with ${pkg.vendor} on cabzii.in. Flat package fare — toll, permit and driver bata billed separately.`}
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
                      {[
                        "Flat package fare shown upfront",
                        "Toll, permit & driver bata as per actuals",
                        "Pickup location of your choice",
                        "Verified tour partner"
                      ].map((point) => (
                        <li key={point} className="flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" strokeWidth={2.5} aria-hidden />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </article>

                  <AdditionalChargesGrid items={tourChargeItems} />

                  <SimilarPackages
                    currentPackageId={pkgId}
                    category={pkg.category}
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
                      footerNote="Package fare payable now. Toll, permit & driver bata billed separately as per trip."
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
  );
}

