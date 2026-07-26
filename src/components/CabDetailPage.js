"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import CabBookingDetail from "./CabBookingDetail";
import CabProductSpecs from "./CabProductSpecs";
import PaymentBreakdown from "./PaymentBreakdown";
import SimilarCabs from "./SimilarCabs";
import ReviewsSection from "./reviews/ReviewsSection";
import VehicleDetailGallery from "./vehicles/VehicleDetailGallery";
import VehicleDetailExtras from "./vehicles/VehicleDetailExtras";
import VehicleShareButtons from "./vehicles/VehicleShareButtons";
import VehicleActionButtons from "./vehicles/VehicleActionButtons";
import { buildFareSlabs, buildPaymentSearchParams, selectionFromPackage } from "../lib/cabFare";
import { getCabVehicleName } from "../lib/catalogDisplay";
import { formatInrCurrency } from "../lib/formatInr";

function firstParam(value) {
  if (Array.isArray(value)) return String(value[0] ?? "").trim();
  return String(value ?? "").trim();
}

const SECTION_LINKS = [
  { href: "#packages", label: "Packages" },
  { href: "#features", label: "Features" },
  { href: "#pickup-locations", label: "Pickup" },
  { href: "#product-details", label: "Specs" },
  { href: "#faqs", label: "FAQs" },
  { href: "#reviews", label: "Reviews" },
  { href: "#related", label: "Related" }
];

function getInitialSelection(cab) {
  if (!cab) return null;
  const slabs = buildFareSlabs(cab);
  const first = slabs.find((p) => p.id === "local_4hr") || slabs[0];
  return first ? selectionFromPackage(first, first.group, cab.discountPercentage) : null;
}

function applyCabData(data, setCab, setSelection) {
  setCab(data);
  const slabs = buildFareSlabs(data);
  const first = slabs.find((p) => p.id === "local_4hr") || slabs[0];
  if (first) setSelection(selectionFromPackage(first, first.group, data.discountPercentage));
}

function parseBreadcrumb(cab) {
  if (cab?.breadcrumb) {
    return cab.breadcrumb.split(">").map((s) => s.trim()).filter(Boolean);
  }
  return ["Home", "Cabs", cab?.city, cab?.vehicleName || cab?.title].filter(Boolean);
}

export default function CabDetailPage({ cabId, initialCab = null }) {
  const id = firstParam(cabId);
  const [cab, setCab] = useState(initialCab);
  const [loading, setLoading] = useState(!initialCab);
  const [loadError, setLoadError] = useState("");
  const [selection, setSelection] = useState(() => getInitialSelection(initialCab));

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

  return (
    <section className="bg-cabzii-page pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-10">
      <div className="section-shell">
        <nav className="mb-4 flex flex-wrap items-center gap-1 text-xs text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--cabzii-brand)]">Home</Link>
          <span>/</span>
          <Link href="/cabs" className="hover:text-[var(--cabzii-brand)]">Cabs</Link>
          {crumbs.slice(2).map((part, i) => (
            <span key={`${part}-${i}`} className="inline-flex items-center gap-1">
              <span>/</span>
              <span className={i === crumbs.slice(2).length - 1 ? "text-slate-800 font-medium" : ""}>{part}</span>
            </span>
          ))}
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
            <header className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-sky-700">{cab.category || cab.type}</p>
                <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">{cab.enterpriseSeo?.h1 || vehicleName}</h1>
                <p className="mt-1 text-sm text-slate-600">{cab.brand} {cab.model} · {cab.city} · {cab.vendor}</p>
                {cab.enterpriseSeo?.offerText ? (
                  <p className="mt-2 text-sm font-semibold text-emerald-700">
                    {cab.enterpriseSeo.offerText}
                    {cab.enterpriseSeo.offerEnds ? ` · Ends ${cab.enterpriseSeo.offerEnds}` : ""}
                  </p>
                ) : null}
                {rating > 0 && reviewCount > 0 ? (
                  <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" strokeWidth={0} />
                    {Number(rating).toFixed(1)} · {reviewCount} reviews
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col items-end gap-2">
                <VehicleActionButtons vehicleId={cabPk} />
                <VehicleShareButtons cab={cab} />
              </div>
            </header>

            <nav className="scroll-x-touch mb-6 flex gap-1.5 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 text-xs shadow-sm" aria-label="Page sections">
              {SECTION_LINKS.map((link) => (
                <a key={link.href} href={link.href} className="shrink-0 rounded-lg px-2.5 py-1.5 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-[var(--cabzii-brand)]">
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <VehicleDetailGallery cab={cab} />

                <section id="packages" className="scroll-mt-24">
                  <h2 className="mb-3 text-lg font-bold text-slate-900">Available packages</h2>
                  <CabBookingDetail cab={cab} onSelectionChange={setSelection} hideHeroImage />
                </section>

                <VehicleDetailExtras cab={cab} />
                <CabProductSpecs cab={cab} />

                <div id="reviews" className="scroll-mt-24">
                  <ReviewsSection itemType="cab" itemId={cabPk} />
                </div>

                <div id="related" className="scroll-mt-24">
                  <SimilarCabs currentCabId={cabPk} cabSlug={cab.slug} cabType={cab.type || cab.category} vendor={cab.vendor} />
                </div>
              </div>

              <aside className="hidden lg:col-span-1 lg:block">
                <div className="sticky top-24 space-y-4">
                  <PaymentBreakdown cab={cab} selection={selection} payHref={payHref} proceedLabel="Book now" showExtrasNote compact />
                  <p className="text-center text-[10px] text-slate-500">Secure payment · Verified drivers · 24/7 support</p>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>

      {cab && payHref ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
          <div className="section-shell flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase text-slate-500">Selected package</p>
              <p className="text-lg font-extrabold text-slate-900">{formatInrCurrency(totalFare)}</p>
              <p className="text-[11px] text-slate-600">{selection?.packageLabel || "Package fare"}</p>
            </div>
            <Link href={payHref} className="cabzii-btn cabzii-btn-primary shrink-0 px-5 py-3 text-sm font-bold">
              Book now
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}
