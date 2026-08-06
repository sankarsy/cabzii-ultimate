"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, X as XIcon } from "lucide-react";
import TourPriceBreakdown from "./TourPriceBreakdown";
import PickupPlaceInput from "./PickupPlaceInput";
import SimilarPackages from "./SimilarPackages";
import AdditionalChargesGrid from "./AdditionalChargesGrid";
import { resolveMediaUrl } from "../lib/media";
import { optimizeImageUrl } from "../lib/imageOptimize";
import { MapPinIcon } from "./icons";
import { buildTourChargeItems } from "../lib/productCharges";
import {
  CARD_BOOK_BTN_CLASS,
  MetaPill
} from "./productCardShared";
import { cabTypeById, categoryLabel, resolveHolidayCabTypes } from "../lib/holidays";
import { formatCabSeatText } from "../lib/cabSeats";
import { extractCityFromLabel } from "../lib/locationPriority";
import { useSelectedCity } from "../lib/useSelectedCity";
import { cityLabel } from "../lib/tamilNaduCities";
import {
  MAX_TOUR_PERSONS,
  MIN_TOUR_PERSONS,
  buildTourPaymentParams,
  calculateTourTotals,
  clampTourPersons,
  resolveTourTransportAdjustment,
  tourSelectionFromTotals
} from "../lib/tourFare";
import { withPublicTourPackageContent } from "../lib/tourPackageContent";
import { packageHasManualDiscount, packageListPrice } from "../lib/tourPackagePricing";

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

function TourPackageProductContent({ pkg, seoKeywords = [] }) {
  const content = withPublicTourPackageContent(pkg);
  const overview = content.description || "";
  const highlights = content.highlights || [];
  const itinerary = (content.itinerary || []).filter((d) => d?.title || d?.details);
  const inclusions = content.inclusions || [];
  const exclusions = content.exclusions || [];
  const durationLabel =
    content.days > 0
      ? `${content.days} Day${content.days > 1 ? "s" : ""}${content.nights > 0 ? ` / ${content.nights} Night${content.nights > 1 ? "s" : ""}` : ""}`
      : content.duration || "";

  return (
    <article id="about" className="scroll-mt-24 space-y-3">
      <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs font-semibold text-slate-900 sm:text-sm">About this package</h2>
          {durationLabel ? (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
              {durationLabel}
            </span>
          ) : null}
        </div>
        <p className="mt-1.5 whitespace-pre-line text-[11px] leading-relaxed text-slate-600 sm:text-xs">{overview}</p>
        {highlights.length > 0 ? (
          <ul className="mt-2.5 grid gap-1 text-[11px] text-slate-600 sm:grid-cols-2 sm:text-xs">
            {highlights.map((point) => (
              <li key={point} className="flex items-start gap-1.5">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={2.5} aria-hidden />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {seoKeywords.length > 0 ? (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {seoKeywords.map((kw) => (
              <span key={kw} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                {kw}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      {itinerary.length > 0 ? (
        <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <h2 className="text-xs font-semibold text-slate-900 sm:text-sm">Day-wise itinerary</h2>
          <ol className="mt-2.5 space-y-2.5 border-l-2 border-blue-100 pl-4">
            {itinerary.map((day, i) => (
              <li key={`${day.day}-${i}`} className="relative">
                <span className="absolute -left-[1.4rem] flex h-5 w-5 items-center justify-center rounded-full bg-[var(--cabzii-brand)] text-[9px] font-bold text-white">
                  {day.day || i + 1}
                </span>
                <h3 className="text-[11px] font-semibold text-slate-900 sm:text-xs">
                  Day {day.day || i + 1}
                  {day.title ? ` — ${day.title}` : ""}
                </h3>
                {day.details ? (
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600 sm:text-xs">{day.details}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {inclusions.length > 0 || exclusions.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {inclusions.length > 0 ? (
            <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
              <h2 className="text-xs font-semibold text-slate-900 sm:text-sm">Inclusions</h2>
              <ul className="mt-2 space-y-1">
                {inclusions.map((item) => (
                  <li key={item} className="flex items-start gap-1.5 text-[11px] text-slate-700 sm:text-xs">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={2.5} aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {exclusions.length > 0 ? (
            <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
              <h2 className="text-xs font-semibold text-slate-900 sm:text-sm">Exclusions</h2>
              <ul className="mt-2 space-y-1">
                {exclusions.map((item) => (
                  <li key={item} className="flex items-start gap-1.5 text-[11px] text-slate-600 sm:text-xs">
                    <XIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" strokeWidth={2.5} aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

export default function TourBookingPage({ searchParams, initialPackage = null }) {
  const rawId = firstParam(searchParams?.id);
  const { city: selectedCity } = useSelectedCity();
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

  useEffect(() => {
    if (!selectedCity) return;
    setPickup(cityLabel(selectedCity));
  }, [selectedCity]);

  const selectedCab = useMemo(() => cabTypeById(cabTypes, cabTypeId), [cabTypes, cabTypeId]);
  const cabMultiplier = selectedCab?.multiplier ?? 1;
  const pickupCity = useMemo(
    () => extractCityFromLabel(pickup) || selectedCity || "",
    [pickup, selectedCity]
  );
  const transport = useMemo(
    () => (pkg && pickupCity ? resolveTourTransportAdjustment(pickupCity, pkg, cabMultiplier) : null),
    [pkg, pickupCity, cabMultiplier]
  );

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
  const discountPct = packageHasManualDiscount(pkg) ? Number(pkg.discountPercentage) || 0 : 0;
  const listBase = packageListPrice(pkg);
  const totals = useMemo(
    () =>
      pkg
        ? calculateTourTotals(listBase, persons, discountPct, cabMultiplier, transport?.adjustment ?? 0)
        : null,
    [pkg, persons, discountPct, cabMultiplier, listBase, transport?.adjustment]
  );

  const selection = useMemo(
    () =>
      pkg && totals
        ? tourSelectionFromTotals(pkg, totals, {
            pickup,
            date: travelDate,
            cabType: selectedCab?.id,
            cabLabel: selectedCab?.label,
            cabMultiplier,
            transport
          })
        : null,
    [pkg, totals, pickup, travelDate, selectedCab, transport]
  );

  const payHref = useMemo(() => {
    if (!pkgId || !totals) return undefined;
    if (!pickup.trim()) return undefined;
    const q = buildTourPaymentParams(pkgId, {
      totals,
      pickup,
      date: travelDate,
      cabType: selectedCab?.id,
      cabLabel: selectedCab?.label,
      transport,
      slug: pkg?.slug
    });
    return `/payment?${q.toString()}`;
  }, [pkgId, totals, pickup, travelDate, selectedCab, transport, pkg?.slug]);

  const tagLabel = pkg?.category
    ? categoryLabel(pkg.category)
    : pkg?.tag || (Array.isArray(pkg?.tags) && pkg.tags[0] ? String(pkg.tags[0]) : "Holiday");
  const tourChargeItems = buildTourChargeItems();
  const imageSrc = resolveMediaUrl(pkg?.image) || FALLBACK_TOUR_IMAGE;
  const d = Math.min(99, Math.max(0, discountPct));

  const publicPkg = pkg ? withPublicTourPackageContent(pkg) : null;
  const seoTitle = publicPkg?.seoTitle || (pkg ? `${pkg.name} – Holiday Package` : "Holiday");
  const seoDescription = publicPkg?.seoDescription || "";
  const seoKeywords = (pkg?.seo || pkg?.metaKeywords || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

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
    <section className="bg-cabzii-page py-3 sm:py-6 md:py-8">
      <div className="section-shell">
          <nav className="mb-2.5 text-[10px] text-slate-500 sm:mb-3 sm:text-xs" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[var(--cabzii-brand)]">
              Home
            </Link>
            <span className="mx-1.5 text-slate-300">/</span>
            <Link href="/holidays" className="hover:text-[var(--cabzii-brand)]">
              Holidays
            </Link>
            <span className="mx-1.5 text-slate-300">/</span>
            <span className="text-slate-600">{pkg?.name ?? "Details"}</span>
          </nav>

          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
              Loading holiday package…
            </div>
          ) : loadError || !pkg ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
              <p className="font-semibold text-amber-900">{loadError || "Package not available."}</p>
              <Link href="/holidays" className="mt-3 inline-block text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
                ← Browse all holidays
              </Link>
            </div>
          ) : (
            <>
              <header className="mb-2.5 sm:mb-3">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--cabzii-brand)] sm:text-[10px]">Holiday package</p>
                <h1 className="mt-0.5 text-base font-bold text-slate-900 sm:text-xl">{pkg.name || seoTitle}</h1>
                {seoDescription ? <p className="mt-1 max-w-3xl text-[11px] text-slate-600 sm:text-xs">{seoDescription}</p> : null}
              </header>

              <nav
                className="scroll-x-touch mb-2.5 flex gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-white p-0.5 text-[11px] shadow-sm sm:mb-3 sm:gap-1.5 sm:rounded-xl sm:p-1 sm:text-xs [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                aria-label="Page sections"
              >
                {SECTION_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="shrink-0 rounded-md px-2 py-1 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-[var(--cabzii-brand)] sm:rounded-lg sm:px-2.5"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-5">
                <div className="space-y-3 sm:space-y-4 lg:col-span-2">
                  <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-stretch">
                      {/* True 1:1 square media */}
                      <div className="relative aspect-square w-[6.75rem] shrink-0 overflow-hidden bg-slate-100 sm:w-[8.5rem]">
                        <img
                          src={optimizeImageUrl(imageSrc, 400)}
                          alt={pkg.name || "Holiday package"}
                          width={340}
                          height={340}
                          loading="eager"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover object-center"
                          onError={(e) => {
                            if (e.currentTarget.src !== FALLBACK_TOUR_IMAGE) {
                              e.currentTarget.src = FALLBACK_TOUR_IMAGE;
                            }
                          }}
                        />
                        <div className="absolute left-1.5 top-1.5 flex flex-col gap-1">
                          {d > 0 ? (
                            <span className="w-fit rounded-md bg-[var(--cabzii-brand)] px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
                              {d}% OFF
                            </span>
                          ) : null}
                          <span className="w-fit rounded-md bg-slate-900/70 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                            {tagLabel}
                          </span>
                        </div>
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-center px-2.5 py-2 sm:px-3.5 sm:py-2.5">
                        <h2 className="line-clamp-2 text-[13px] font-bold leading-snug text-slate-900 sm:text-sm">
                          {pkg.name}
                        </h2>
                        <p className="mt-0.5 text-[10px] text-slate-500 sm:text-[11px]">
                          by {pkg.vendor || "Tour Partner"}
                          <span className="ml-1.5 inline-flex items-center gap-0.5 font-medium text-emerald-600">
                            ✓ Verified
                          </span>
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {pkg.city ? <MetaPill icon={<MapPinIcon className="h-2.5 w-2.5" />} label={pkg.city} /> : null}
                          <MetaPill label="Toll, permit & driver bata extra" />
                        </div>
                      </div>
                    </div>
                  </article>

                  <section
                    id="booking-details"
                    className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"
                  >
                    <h2 className="text-base font-bold text-slate-900">Booking details</h2>
                    <p className="mt-1 text-xs text-slate-600">
                      Enter pickup, cab type and group size. Package fare updates by pickup city and vehicle — toll,
                      permit & driver bata are extra.
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
                              <span className="text-[10px] text-slate-500">{formatCabSeatText(cab)}</span>
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
                          Total payable: ₹{totals?.total.toLocaleString("en-IN")}
                          {d > 0
                            ? " (incl. online discount · excl. toll, permit & driver bata)"
                            : " (excl. toll, permit & driver bata)"}
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

                  <AdditionalChargesGrid items={tourChargeItems} />

                  <TourPackageProductContent pkg={pkg} seoKeywords={seoKeywords} />

                  <SimilarPackages
                    currentPackageId={pkgId}
                    category={pkg.category}
                    vendor={pkg.vendor}
                  />
                </div>

                <aside className="lg:col-span-1">
                  <div className="sticky top-24 space-y-4">
                    <TourPriceBreakdown
                      item={{
                        title: pkg.name,
                        type: "Holiday package",
                        vendor: pkg.vendor
                      }}
                      selection={selection}
                      compact
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

