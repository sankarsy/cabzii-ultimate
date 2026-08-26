"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import DriverBookingDetail from "./DriverBookingDetail";
import DriverProductSpecs from "./DriverProductSpecs";
import PaymentBreakdown from "./PaymentBreakdown";
import SimilarDrivers from "./SimilarDrivers";
import ReviewsSection from "./reviews/ReviewsSection";
import { ProductImageFrame } from "./productCardShared";
import { resolveMediaUrl } from "../lib/media";
import {
  buildDriverFareSlabs,
  buildDriverPaymentSearchParams,
  selectionFromDriverPackage
} from "../lib/driverFare";

function firstParam(value) {
  if (Array.isArray(value)) return String(value[0] ?? "").trim();
  return String(value ?? "").trim();
}

const SECTION_LINKS = [
  { href: "#packages", label: "Packages" },
  { href: "#product-details", label: "Details" },
  { href: "#similar-drivers", label: "Alternatives" },
  { href: "#about", label: "About" }
];

function applyDriverData(data, setDriver, setSelection, preferredPackageId = "") {
  setDriver(data);
  const slabs = buildDriverFareSlabs(data);
  const preferred = preferredPackageId
    ? slabs.find((p) => p.id === preferredPackageId)
    : null;
  const first = preferred || slabs.find((p) => p.id === "local_4hr") || slabs[0];
  if (first) setSelection(selectionFromDriverPackage(first, first.group, data.discountPercentage));
}

export default function DriverDetailPage({ driverId, initialDriver = null }) {
  const searchParams = useSearchParams();
  const packageFromUrl = searchParams.get("packageId") || searchParams.get("package") || "";
  const id = firstParam(driverId);
  const [driver, setDriver] = useState(initialDriver);
  const [loading, setLoading] = useState(!initialDriver);
  const [loadError, setLoadError] = useState("");
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    if (initialDriver) {
      applyDriverData(initialDriver, setDriver, setSelection, packageFromUrl);
      setLoading(false);
      return undefined;
    }
    if (!id) {
      setLoadError("Missing driver id.");
      setLoading(false);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError("");
      try {
        const res = await fetch(`/api/drivers/${encodeURIComponent(id)}`, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok || !json?.data) {
          if (!cancelled) {
            setDriver(null);
            setLoadError(json?.message || "Driver not found.");
          }
        } else if (!cancelled) {
          applyDriverData(json.data, setDriver, setSelection, packageFromUrl);
        }
      } catch {
        if (!cancelled) {
          setDriver(null);
          setLoadError("Could not load driver details.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, initialDriver, packageFromUrl]);

  const driverPk = driver ? String(driver._id ?? driver.id ?? "") : "";
  const payHref = useMemo(() => {
    const q = buildDriverPaymentSearchParams(driverPk, selection);
    return q ? `/payment?${q.toString()}` : undefined;
  }, [driverPk, selection]);

  const seoTitle =
    driver?.seoTitle ||
    (driver ? `Hire ${driver.name} Acting Driver in ${driver.city || "South India"}` : "Acting Driver");
  const seoDescription =
    driver?.seoDescription ||
    (driver
      ? `Professional chauffeur for your ${driver.name} in ${driver.city || "South India"}. Local & outstation packages with transparent pricing on cabzii.in.`
      : "");
  const seoKeywords = (driver?.seo || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const paymentItem = driver
    ? {
        title: driver.name,
        type: driver.type || "Driver",
        vendor: driver.vendor || "Cabzii Partner"
      }
    : null;

  return (
    <section className="bg-cabzii-page py-3 sm:py-6 md:py-8">
      <div className="section-shell">
          <nav className="mb-2.5 text-[10px] text-slate-500 sm:mb-3 sm:text-xs" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[var(--cabzii-brand)]">
              Home
            </Link>
            <span className="mx-1.5 text-slate-300">/</span>
            <Link href="/drivers" className="hover:text-[var(--cabzii-brand)]">
              Drivers
            </Link>
            <span className="mx-1.5 text-slate-300">/</span>
            <span className="text-slate-600">{driver?.name ?? "Details"}</span>
          </nav>

          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
              Loading driver…
            </div>
          ) : loadError || !driver ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
              <p className="font-semibold text-amber-900">{loadError || "Driver not available."}</p>
              <Link href="/drivers" className="mt-3 inline-block text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
                ← Browse all drivers
              </Link>
            </div>
          ) : (
            <>
              <header className="mb-2.5 sm:mb-3">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--cabzii-brand)] sm:text-[10px]">
                  Driver · cabzii.in
                </p>
                <h1 className="mt-0.5 text-base font-bold text-slate-900 sm:text-xl">{driver.name}</h1>
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

              <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(17rem,20rem)] lg:gap-4">
                <section className="lg:sticky lg:top-24">
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <ProductImageFrame
                      src={resolveMediaUrl(driver.image)}
                      alt={driver.name || "Acting driver"}
                      imageClassName="h-40 w-full object-cover object-top sm:h-44 lg:h-48"
                    />
                  </div>
                </section>

                <div className="min-w-0 space-y-3 sm:space-y-4">
                  <section id="packages" className="scroll-mt-24">
                    <h2 className="mb-1 text-xs font-semibold text-slate-900 sm:mb-1.5 sm:text-sm">Choose your package</h2>
                    <DriverBookingDetail
                      driver={driver}
                      initialPackageId={packageFromUrl}
                      onSelectionChange={setSelection}
                      hideHeroImage
                    />
                  </section>

                  <DriverProductSpecs driver={driver} />

                  <ReviewsSection itemType="driver" itemId={driverPk} />

                  <SimilarDrivers currentDriverId={driverPk} vendor={driver.vendor} />

                  <article id="about" className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                    <h2 className="text-xs font-semibold text-slate-900 sm:text-sm">About this chauffeur service</h2>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600 sm:text-xs">
                      {driver.seoDescription ||
                        `Hire an acting driver for your ${driver.name} with ${driver.vendor || "Cabzii"} on cabzii.in. Verified chauffeur for local and outstation trips — same package structure as cab booking with clear fares and additional charges.`}
                    </p>
                    {seoKeywords.length > 0 ? (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {seoKeywords.map((kw) => (
                          <span key={kw} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                            {kw}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <ul className="mt-2.5 grid gap-1 text-[11px] text-slate-600 sm:grid-cols-2 sm:text-xs">
                      {[
                        "Verified vendor & drivers",
                        "Local & outstation packages",
                        "Secure online booking",
                        "Transparent extra charges",
                        "Your vehicle — chauffeur only",
                        "Driver allowance included"
                      ].map((point) => (
                        <li key={point} className="flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" strokeWidth={2.5} aria-hidden />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>

                <aside>
                  <div className="sticky top-24 space-y-3">
                    <PaymentBreakdown
                      item={paymentItem}
                      selection={selection}
                      payHref={payHref}
                      proceedLabel="Book now"
                      showExtrasNote
                      compact
                    />
                    <div className="rounded-xl border border-slate-200 bg-white p-3 text-[11px] text-slate-600 shadow-sm">
                      <p className="font-semibold text-slate-900">{selection?.packageLabel || "Selected package"}</p>
                      <p className="mt-1 capitalize">{selection?.serviceTab || "local"} · {driver.vendor || "Cabzii Partner"}</p>
                    </div>
                    <p className="text-center text-[10px] text-slate-500">
                      Need help? Call our 24/7 support line from the website header.
                    </p>
                  </div>
                </aside>
              </div>
            </>
          )}
      </div>
    </section>
  );
}
