"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Star } from "./icons/rscIcons";
import CabBookingDetail from "./CabBookingDetail";
import PaymentBreakdown from "./PaymentBreakdown";
import SimilarCabs from "./SimilarCabs";
import ReviewsSection from "./reviews/ReviewsSection";
import VehicleDetailGallery from "./vehicles/VehicleDetailGallery";
import VehicleShareButtons from "./vehicles/VehicleShareButtons";
import VehicleActionButtons from "./vehicles/VehicleActionButtons";
import { buildFareSlabs, buildPaymentSearchParams, selectionFromPackage } from "../lib/cabFare";
import { getCabVehicleName } from "../lib/catalogDisplay";
import { formatCabSeatPill } from "../lib/cabSeats";
import { formatInrCurrency } from "../lib/formatInr";
import { trackEvent } from "../lib/analytics";

function firstParam(value) {
  if (Array.isArray(value)) return String(value[0] ?? "").trim();
  return String(value ?? "").trim();
}

function getInitialSelection(cab) {
  if (!cab) return null;
  const slabs = buildFareSlabs(cab);
  const first = slabs.find((p) => p.id === "local_4hr") || slabs[0];
  return first ? selectionFromPackage(first, first.group, cab) : null;
}

function applyCabData(data, setCab, setSelection) {
  setCab(data);
  const slabs = buildFareSlabs(data);
  const first = slabs.find((p) => p.id === "local_4hr") || slabs[0];
  if (first) setSelection(selectionFromPackage(first, first.group, data));
}

function featurePills(cab) {
  const features = Array.isArray(cab?.features) ? cab.features : [];
  const hasAc = features.some((f) => /^(ac|a\/c|air\s*condition)/i.test(String(f).trim()));
  const pills = [formatCabSeatPill(cab), hasAc ? "AC" : null, "Driver included"].filter(Boolean);
  const extras = features
    .map((f) => String(f).trim())
    .filter((f) => f && !/^(ac|a\/c|air\s*condition)/i.test(f))
    .slice(0, 3);
  return [...pills, ...extras];
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
  const totalFare = selection?.total ?? selection?.baseFare ?? 0;
  const cityLabel = (cab?.city || "").replace(/\bAll India\b/gi, "Chennai") || "Chennai";

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
    <section className="bg-cabzii-page pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))] lg:pb-12">
      <div className="section-shell pt-4 sm:pt-6">
        {loading ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-40 animate-pulse bg-[var(--cabzii-sky)] sm:h-52" />
            <div className="space-y-3 p-5">
              <div className="h-4 w-24 rounded bg-slate-100" />
              <div className="h-7 w-48 rounded bg-slate-100" />
              <div className="h-4 w-full max-w-md rounded bg-slate-100" />
            </div>
          </div>
        ) : loadError || !cab ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-12 text-center">
            <p className="text-lg font-bold text-amber-900">{loadError || "Cab not available."}</p>
            <Link href="/cabs" className="mt-4 inline-block text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
              ← Browse all cabs
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,22rem)]">
            <div className="min-w-0 space-y-4 sm:space-y-5">
              <article className="overflow-hidden rounded-2xl border border-[var(--cabzii-border)] bg-white shadow-[var(--cabzii-shadow-card)]">
                <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
                  <div className="order-2 lg:order-1">
                    <VehicleDetailGallery cab={cab} size="hero" />
                  </div>
                  <div className="order-1 flex flex-col justify-center p-4 sm:p-6 lg:order-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--cabzii-cta)]">
                          {cab.category || cab.type || "Cab"}
                        </p>
                        <h1 className="mt-1 text-[1.5rem] font-extrabold leading-tight tracking-tight text-[var(--cabzii-ink)] sm:text-[1.75rem]">
                          {vehicleName}
                        </h1>
                        <p className="mt-1 text-sm text-slate-600">
                          {cityLabel} · {cab.vendor || "Cabzii Partner"}
                        </p>
                      </div>
                      <VehicleActionButtons vehicleId={cabPk} />
                    </div>

                    {rating > 0 && reviewCount > 0 ? (
                      <p className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-950">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" strokeWidth={0} />
                        {Number(rating).toFixed(1)}
                        <span className="font-medium text-amber-800/80">· {reviewCount} reviews</span>
                      </p>
                    ) : null}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {featurePills(cab).map((pill) => (
                        <span
                          key={pill}
                          className="inline-flex items-center rounded-full bg-[var(--cabzii-sky)] px-3 py-1 text-xs font-semibold text-[var(--cabzii-brand)]"
                        >
                          {pill}
                        </span>
                      ))}
                    </div>

                    {totalFare > 0 ? (
                      <p className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">From</span>
                        <span className="text-2xl font-extrabold tracking-tight text-[var(--cabzii-ink)]">
                          {formatInrCurrency(totalFare)}
                        </span>
                        <span className="text-sm text-slate-500">{selection?.packageLabel || "selected package"}</span>
                      </p>
                    ) : null}

                    <div className="mt-4">
                      <VehicleShareButtons cab={cab} variant="icon" />
                    </div>
                  </div>
                </div>
              </article>

              <section className="overflow-hidden rounded-2xl border border-[var(--cabzii-border)] bg-white p-4 shadow-[var(--cabzii-shadow-card)] sm:p-5">
                <h2 className="text-lg font-bold text-[var(--cabzii-ink)]">Choose a package</h2>
                <p className="mt-1 text-sm text-slate-600">Switch Local or Outstation, then tap a card to choose it.</p>
                <div className="mt-4">
                  <CabBookingDetail cab={cab} onSelectionChange={setSelection} hideHeroImage comfortable />
                </div>
              </section>

              <ReviewsSection itemType="cab" itemId={cabPk} />
              <SimilarCabs currentCabId={cabPk} cabSlug={cab.slug} cabType={cab.type || cab.category} vendor={cab.vendor} />
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-[calc(var(--cabzii-home-header-h)+0.75rem)]">
                <PaymentBreakdown
                  cab={cab}
                  selection={selection}
                  payHref={payHref}
                  proceedLabel="Book now"
                  showExtrasNote
                  onProceed={fireBookingStarted}
                />
                <p className="mt-3 text-center text-xs text-slate-500">Secure payment · Verified drivers · WhatsApp support</p>
              </div>
            </aside>
          </div>
        )}
      </div>

      {cab && payHref ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(10,22,64,0.1)] backdrop-blur lg:hidden">
          <div className="section-shell flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Payable now</p>
              <p className="text-xl font-extrabold leading-tight text-[var(--cabzii-ink)]">{formatInrCurrency(totalFare)}</p>
              <p className="truncate text-xs text-slate-600">{selection?.packageLabel || "Selected package"}</p>
            </div>
            <Link
              href={payHref}
              onClick={fireBookingStarted}
              className="cabzii-btn cabzii-btn-cta cabzii-tap h-11 shrink-0 px-6 text-sm font-bold"
            >
              Book now
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}
