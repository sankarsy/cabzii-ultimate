"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import DriverBookingDetail from "./DriverBookingDetail";
import DriverProductSpecs from "./DriverProductSpecs";
import PaymentBreakdown from "./PaymentBreakdown";
import SimilarDrivers from "./SimilarDrivers";
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
  { href: "#about", label: "About" },
  { href: "#similar-drivers", label: "Alternatives" }
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
    <section className="bg-cabzii-page py-8 md:py-10">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
          <nav className="mb-4 text-xs text-slate-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[var(--cabzii-brand)]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/drivers" className="hover:text-[var(--cabzii-brand)]">
              Drivers
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-700">{driver?.name ?? "Details"}</span>
          </nav>

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-600">
              Loading driver…
            </div>
          ) : loadError || !driver ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
              <p className="font-semibold text-amber-900">{loadError || "Driver not available."}</p>
              <Link href="/drivers" className="mt-4 inline-block text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
                ← Browse all drivers
              </Link>
            </div>
          ) : (
            <>
              <header className="mb-5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--cabzii-brand)]">
                  Driver · cabzii.in
                </p>
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
                  <section id="packages" className="scroll-mt-24">
                    <h2 className="mb-2 text-base font-bold text-slate-900">Choose your package</h2>
                    <DriverBookingDetail
                      driver={driver}
                      initialPackageId={packageFromUrl}
                      onSelectionChange={setSelection}
                    />
                  </section>

                  <DriverProductSpecs driver={driver} />

                  <article id="about" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
                    <h2 className="text-base font-bold text-slate-900">About this chauffeur service</h2>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {driver.seoDescription ||
                        `Hire an acting driver for your ${driver.name} with ${driver.vendor || "Cabzii"} on cabzii.in. Verified chauffeur for local and outstation trips — same package structure as cab booking with clear fares and additional charges.`}
                    </p>
                    {seoKeywords.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {seoKeywords.map((kw) => (
                          <span key={kw} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-700">
                            {kw}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <ul className="mt-3 grid gap-1.5 text-xs text-slate-600 sm:grid-cols-2">
                      <li>✓ Verified vendor & drivers</li>
                      <li>✓ Local & outstation packages</li>
                      <li>✓ Secure online booking</li>
                      <li>✓ Transparent extra charges</li>
                      <li>✓ Your vehicle — chauffeur only</li>
                      <li>✓ Driver allowance included</li>
                    </ul>
                  </article>

                  <SimilarDrivers currentDriverId={driverPk} vendor={driver.vendor} />
                </div>

                <aside className="lg:col-span-1">
                  <div className="sticky top-24 space-y-4">
                    <PaymentBreakdown
                      item={paymentItem}
                      selection={selection}
                      payHref={payHref}
                      proceedLabel="Continue to payment"
                      showExtrasNote
                      compact
                    />
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
