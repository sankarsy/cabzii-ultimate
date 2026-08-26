"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import CabBookingDetail from "./CabBookingDetail";
import CabProductSpecs from "./CabProductSpecs";
import TariffTerms from "./TariffTerms";
import PaymentBreakdown from "./PaymentBreakdown";
import SimilarCabs from "./SimilarCabs";
import ReviewsSection from "./reviews/ReviewsSection";
import VehicleDetailGallery from "./vehicles/VehicleDetailGallery";
import VehicleDetailExtras, { VehiclePageContent } from "./vehicles/VehicleDetailExtras";
import VehicleShareButtons from "./vehicles/VehicleShareButtons";
import VehicleActionButtons from "./vehicles/VehicleActionButtons";
import { buildFareSlabs, buildPaymentSearchParams, selectionFromPackage } from "../lib/cabFare";
import { getCabVehicleName } from "../lib/catalogDisplay";
import { formatInrCurrency } from "../lib/formatInr";
import { withPublicEnterpriseSeo } from "../lib/vehicleEnterpriseSeo";
import { trackEvent } from "../lib/analytics";

function firstParam(value) {
  if (Array.isArray(value)) return String(value[0] ?? "").trim();
  return String(value ?? "").trim();
}

const SECTION_LINKS = [
  { href: "#gallery", label: "Photos" },
  { href: "#packages", label: "Packages" },
  { href: "#features", label: "Features" },
  { href: "#pickup-locations", label: "Pickup" },
  { href: "#product-details", label: "Specs" },
  { href: "#faqs", label: "FAQs" },
  { href: "#reviews", label: "Reviews" },
  { href: "#similar-packages", label: "Similar" },
  { href: "#page-content", label: "About" }
];

function getInitialSelection(cab) {
  if (!cab) return null;
  const slabs = buildFareSlabs(cab);
  const first = slabs.find((p) => p.id === "local_4hr") || slabs[0];
  return first ? selectionFromPackage(first, first.group, cab) : null;
}

function applyCabData(data, setCab, setSelection) {
  const enriched = withPublicEnterpriseSeo(data);
  setCab(enriched);
  const slabs = buildFareSlabs(enriched);
  const first = slabs.find((p) => p.id === "local_4hr") || slabs[0];
  if (first) setSelection(selectionFromPackage(first, first.group, enriched));
}

function parseBreadcrumb(cab) {
  const city = (cab?.city || "Chennai").replace(/\bAll India\b/gi, "Chennai");
  const shortName = getCabVehicleName(cab) || cab?.title || "Cab";
  // Prefer short crumbs on mobile — stored SEO breadcrumb strings are often too long.
  return ["Home", "Cabs", city, shortName].filter(Boolean);
}

export default function CabDetailPage({ cabId, initialCab = null }) {
  const id = firstParam(cabId);
  const seeded = initialCab ? withPublicEnterpriseSeo(initialCab) : null;
  const [cab, setCab] = useState(seeded);
  const [loading, setLoading] = useState(!seeded);
  const [loadError, setLoadError] = useState("");
  const [selection, setSelection] = useState(() => getInitialSelection(seeded));

  useEffect(() => {
    if (initialCab) {
      applyCabData(initialCab, setCab, setSelection);
      setLoading(false);
      return undefined;
    }
    if (!id) {
      setLoadError("Missing cab id.");
      setLoading(false);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError("");
      try {
        const res = await fetch(`/api/cabs/${encodeURIComponent(id)}`, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok || !json?.data) {
          if (!cancelled) {
            setCab(null);
            setLoadError(json?.message || "Cab not found.");
          }
        } else if (!cancelled) {
          applyCabData(json.data, setCab, setSelection);
        }
      } catch {
        if (!cancelled) {
          setCab(null);
          setLoadError("Could not load cab details.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, initialCab]);

  const cabPk = cab ? String(cab._id ?? cab.id ?? "") : "";
  const payHref = useMemo(() => {
    const q = buildPaymentSearchParams(cabPk, selection);
    return q ? `/payment?${q.toString()}` : undefined;
  }, [cabPk, selection]);

  const vehicleName = cab ? getCabVehicleName(cab) : "";
  const rating = cab?.stats?.rating ?? cab?.rating;
  const reviewCount = cab?.stats?.totalReviews ?? cab?.reviewCount ?? 0;
  const crumbs = cab ? parseBreadcrumb(cab) : [];
  const totalFare = selection?.total ?? selection?.baseFare ?? 0;

  useEffect(() => {
    if (!cabPk || !cab) return;
    trackEvent("vehicle_view", {
      service_type: "cab",
      vehicle_id: cabPk,
      vehicle_name: getCabVehicleName(cab),
      city: cab.city || "",
      route: ""
    });
  }, [cabPk]);

  const fireBookingStarted = () => {
    trackEvent("booking_started", {
      service_type: "cab",
      vehicle_id: cabPk,
      vehicle_name: vehicleName,
      city: cab?.city || "",
      route: "",
      cta_location: "cab_detail"
    });
  };

  return (
    <section className="bg-cabzii-page pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] md:pb-10">
      <div className="section-shell">
        <nav
          className="mb-3 flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[10px] leading-snug text-slate-500 sm:mb-4 sm:text-xs"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-[var(--cabzii-brand)]">
            Home
          </Link>
          <span className="text-slate-300" aria-hidden>
            /
          </span>
          <Link href="/cabs" className="hover:text-[var(--cabzii-brand)]">
            Cabs
          </Link>
          {crumbs.slice(2).map((part, i) => {
            const isLast = i === crumbs.slice(2).length - 1;
            return (
              <span key={`${part}-${i}`} className="inline-flex max-w-full items-center gap-x-1">
                <span className="text-slate-300" aria-hidden>
                  /
                </span>
                <span
                  className={
                    isLast
                      ? "max-w-[11rem] truncate text-slate-600 sm:max-w-xs sm:text-slate-700"
                      : "text-slate-500"
                  }
                  title={isLast ? part : undefined}
                >
                  {part}
                </span>
              </span>
            );
          })}
        </nav>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-600">Loading cab…</div>
        ) : loadError || !cab ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
            <p className="font-semibold text-amber-900">{loadError || "Cab not available."}</p>
            <Link href="/cabs" className="mt-4 inline-block text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">← Browse all cabs</Link>
          </div>
        ) : (
          <>
            <header className="mb-2.5 sm:mb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-sky-700 sm:text-[10px]">
                    {cab.category || cab.type}
                  </p>
                  <h1 className="mt-0.5 text-base font-bold leading-snug text-slate-900 sm:text-xl">
                    {vehicleName ||
                      String(cab.enterpriseSeo?.h1 || cab.h1 || "")
                        .replace(/\bAll India\b/gi, "Chennai")
                        .trim()}
                  </h1>
                  <p className="mt-0.5 text-[11px] text-slate-600 sm:text-xs">
                    {(cab.city || "").replace(/\bAll India\b/gi, "Chennai") || "Chennai"} · {cab.vendor || "Cabzii Partner"}
                  </p>
                  {cab.enterpriseSeo?.offerText ? (
                    <p className="mt-1 text-xs font-semibold text-emerald-700">
                      {cab.enterpriseSeo.offerText}
                      {cab.enterpriseSeo.offerEnds ? ` · Ends ${cab.enterpriseSeo.offerEnds}` : ""}
                    </p>
                  ) : null}
                  {rating > 0 && reviewCount > 0 ? (
                    <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" strokeWidth={0} />
                      {Number(rating).toFixed(1)} · {reviewCount} reviews
                    </p>
                  ) : null}
                </div>
                <VehicleActionButtons vehicleId={cabPk} />
              </div>
              <div className="mt-1.5">
                <VehicleShareButtons cab={cab} compact />
              </div>
            </header>

            <nav
              className="scroll-x-touch mb-2.5 flex gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-white p-0.5 text-[11px] shadow-sm sm:mb-3 sm:gap-1.5 sm:rounded-xl sm:p-1 sm:text-xs"
              aria-label="Page sections"
            >
              {SECTION_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="shrink-0 rounded-md px-2 py-1 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-[var(--cabzii-brand)] sm:rounded-lg sm:px-2.5 sm:py-1.5"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(17rem,20rem)] lg:gap-4">
              <section id="gallery" className="scroll-mt-24 lg:sticky lg:top-24">
                <VehicleDetailGallery cab={cab} />
              </section>

              <div className="min-w-0 space-y-3 sm:space-y-4">
                <section id="packages" className="scroll-mt-24">
                  <h2 className="mb-1 text-xs font-semibold text-slate-900 sm:mb-1.5 sm:text-sm">Available packages</h2>
                  <CabBookingDetail cab={cab} onSelectionChange={setSelection} hideHeroImage />
                </section>

                <VehicleDetailExtras cab={cab} showPageContent={false} />
                <CabProductSpecs cab={cab} />
                <p className="mt-2 text-xs">
                  <Link href="/tariff" className="font-semibold text-[var(--cabzii-brand)] hover:underline">
                    View full Cabzii tariff
                  </Link>
                </p>
                <TariffTerms compact />

                <div id="reviews" className="scroll-mt-24">
                  <ReviewsSection itemType="cab" itemId={cabPk} />
                </div>

                <div id="similar-packages" className="scroll-mt-24">
                  <SimilarCabs currentCabId={cabPk} cabSlug={cab.slug} cabType={cab.type || cab.category} vendor={cab.vendor} />
                </div>

                <VehiclePageContent cab={cab} />
              </div>

              <aside className="hidden lg:block">
                <div className="sticky top-24 space-y-3">
                  <PaymentBreakdown cab={cab} selection={selection} payHref={payHref} proceedLabel="Book now" showExtrasNote compact onProceed={fireBookingStarted} />
                  <div className="rounded-xl border border-slate-200 bg-white p-3 text-[11px] text-slate-600 shadow-sm">
                    <p className="font-semibold text-slate-900">{selection?.packageLabel || "Selected package"}</p>
                    <p className="mt-1 capitalize">{selection?.serviceTab || "local"} · {cab.vendor || "Cabzii Partner"}</p>
                    <p className="mt-2 text-[10px] text-slate-500">Toll, parking and extra km/hr are billed as per the package card.</p>
                  </div>
                  <p className="text-center text-[10px] text-slate-500">Secure payment · Verified drivers · 24/7 support</p>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>

      {cab && payHref ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-6px_16px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
          <div className="section-shell flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">Selected package</p>
              <p className="text-base font-extrabold leading-tight text-slate-900">{formatInrCurrency(totalFare)}</p>
              <p className="truncate text-[10px] text-slate-600">{selection?.packageLabel || "Package fare"}</p>
            </div>
            <Link href={payHref} onClick={fireBookingStarted} className="cabzii-btn cabzii-btn-primary cabzii-btn-sm shrink-0 px-4 py-2 text-xs font-bold">
              Book now
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}
