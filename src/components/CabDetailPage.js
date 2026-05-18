"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CabBookingDetail from "./CabBookingDetail";
import CabProductSpecs from "./CabProductSpecs";
import Footer from "./Footer";
import Navbar from "./Navbar";
import PaymentBreakdown from "./PaymentBreakdown";
import SimilarCabs from "./SimilarCabs";
import { buildFareSlabs, buildPaymentSearchParams, selectionFromPackage } from "../lib/cabFare";

function firstParam(value) {
  if (Array.isArray(value)) return String(value[0] ?? "").trim();
  return String(value ?? "").trim();
}

const SECTION_LINKS = [
  { href: "#packages", label: "Packages" },
  { href: "#product-details", label: "Details" },
  { href: "#about", label: "About" },
  { href: "#similar-cabs", label: "Alternatives" }
];

export default function CabDetailPage({ cabId }) {
  const id = firstParam(cabId);
  const [cab, setCab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoadError("Missing cab id.");
      setLoading(false);
      return;
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
          const data = json.data;
          setCab(data);
          const slabs = buildFareSlabs(data);
          const first = slabs.find((p) => p.id === "local_4hr") || slabs[0];
          if (first) setSelection(selectionFromPackage(first, first.group, data.discountPercentage));
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
  }, [id]);

  const cabPk = cab ? String(cab._id ?? cab.id ?? "") : "";
  const payHref = useMemo(() => {
    const q = buildPaymentSearchParams(cabPk, selection);
    return q ? `/payment?${q.toString()}` : undefined;
  }, [cabPk, selection]);

  const seoTitle = cab?.seoTitle || (cab ? `${cab.title} – ${cab.type} Cab` : "Cab");
  const seoDescription =
    cab?.seoDescription ||
    (cab
      ? `Book ${cab.title} by ${cab.vendor}. Compare local & outstation packages with transparent pricing on cabzii.in.`
      : "");
  const seoKeywords = (cab?.seo || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-sky-50/40 to-white">
      <Navbar />

      <section className="py-8 md:py-10">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <nav className="mb-4 text-xs text-slate-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#0056D2]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/cabs" className="hover:text-[#0056D2]">
              Cabs
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-700">{cab?.title ?? "Details"}</span>
          </nav>

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-600">
              Loading cab…
            </div>
          ) : loadError || !cab ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
              <p className="font-semibold text-amber-900">{loadError || "Cab not available."}</p>
              <Link href="/cabs" className="mt-4 inline-block text-sm font-semibold text-[#0056D2] hover:underline">
                ← Browse all cabs
              </Link>
            </div>
          ) : (
            <>
              <header className="mb-5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#0056D2]">Cab product page</p>
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
                  <section id="packages" className="scroll-mt-24">
                    <h2 className="mb-2 text-base font-bold text-slate-900">Choose your package</h2>
                    <CabBookingDetail cab={cab} onSelectionChange={setSelection} />
                  </section>

                  <CabProductSpecs cab={cab} />

                  <article id="about" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
                    <h2 className="text-base font-bold text-slate-900">About this cab</h2>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {cab.seoDescription ||
                        `Book ${cab.title} (${cab.type}) with ${cab.vendor} on cabzii.in. Professional drivers, AC cabs, and clear local & outstation fares.`}
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
                      <li>✓ Local hourly & outstation trips</li>
                      <li>✓ Secure online booking</li>
                      <li>✓ Transparent extra charges</li>
                    </ul>
                  </article>

                  <SimilarCabs currentCabId={cabPk} cabType={cab.type} vendor={cab.vendor} />

                </div>

                <aside className="lg:col-span-1">
                  <div className="sticky top-24 space-y-4">
                    <PaymentBreakdown
                      cab={cab}
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

      <Footer />
    </main>
  );
}
