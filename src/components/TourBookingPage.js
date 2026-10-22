"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, X as XIcon } from "lucide-react";
import SimilarPackages from "./SimilarPackages";
import CityHubMarketplace from "./city-cabs/CityHubMarketplace";
import OutstationPageBelow, { SeoPageArticle, cmsPageHtml } from "./city-cabs/OutstationPageBelow";
import { useSelectedCity } from "../lib/useSelectedCity";
import { airportInfoForCity } from "../lib/seo/airports";
import { customerPickupCity, packageBookingTrip, packageDestinationName } from "../lib/packageTrip";

function firstParam(value) {
  if (Array.isArray(value)) return String(value[0] ?? "").trim();
  return String(value ?? "").trim();
}

function TourPackageProductContent({ pkg, seoKeywords = [] }) {
  const overview = cmsPageHtml(pkg);
  const highlights = (pkg.highlights || []).filter((x) => String(x || "").trim());
  const itinerary = (pkg.itinerary || []).filter((d) => d?.title || d?.details);
  const inclusions = (pkg.inclusions || []).filter((x) => String(x || "").trim());
  const exclusions = (pkg.exclusions || []).filter((x) => String(x || "").trim());
  const durationLabel =
    Number(pkg.days) > 0
      ? `${pkg.days} Day${pkg.days > 1 ? "s" : ""}${Number(pkg.nights) > 0 ? ` / ${pkg.nights} Night${pkg.nights > 1 ? "s" : ""}` : ""}`
      : pkg.duration || "";

  return (
    <article id="about" className="scroll-mt-24 space-y-3">
      {overview ? <SeoPageArticle html={overview} /> : null}
      {highlights.length > 0 || durationLabel || seoKeywords.length > 0 ? (
      <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-slate-900">About this package</h2>
          {durationLabel ? (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
              {durationLabel}
            </span>
          ) : null}
        </div>
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
      ) : null}

      {itinerary.length > 0 ? (
        <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <h2 className="text-sm font-bold text-slate-900">Day-wise itinerary</h2>
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
              <h2 className="text-sm font-bold text-slate-900">Inclusions</h2>
              <ul className="mt-2 space-y-1 text-[11px] text-slate-600 sm:text-xs">
                {inclusions.map((item) => (
                  <li key={item} className="flex items-start gap-1.5">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={2.5} aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {exclusions.length > 0 ? (
            <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
              <h2 className="text-sm font-bold text-slate-900">Exclusions</h2>
              <ul className="mt-2 space-y-1 text-[11px] text-slate-600 sm:text-xs">
                {exclusions.map((item) => (
                  <li key={item} className="flex items-start gap-1.5">
                    <XIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" strokeWidth={2.5} aria-hidden />
                    <span>{item}</span>
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
  const { city: selectedCity, locating } = useSelectedCity();
  const [pkg, setPkg] = useState(initialPackage);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(!initialPackage);

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

  const origin = useMemo(() => customerPickupCity(selectedCity), [selectedCity]);
  const destName = useMemo(() => (pkg ? packageDestinationName(pkg) : ""), [pkg]);
  const bookingTrip = useMemo(() => packageBookingTrip(origin, destName), [origin, destName]);
  const pickupReady = !locating && Boolean(origin.name);
  const airport = airportInfoForCity(origin.slug);
  const airportLabel = airport?.name ? `${airport.name} taxi` : "";
  const pkgId = pkg ? String(pkg._id ?? pkg.id ?? "") : "";
  const seoKeywords = (pkg?.seo || pkg?.metaKeywords || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div>
      <div className="bg-[#f4f6fa]">
        <div className="section-shell pt-6 pb-2 sm:pt-8">
          <nav className="mb-2 break-words px-1 text-center text-[11px] text-slate-500 sm:text-xs" aria-label="Breadcrumb">
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
            <p className="py-8 text-center text-sm text-slate-500">Loading holiday package…</p>
          ) : loadError || !pkg ? (
            <div className="mx-auto max-w-lg rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
              <p className="font-semibold text-amber-900">{loadError || "Package not available."}</p>
              <Link href="/holidays" className="mt-3 inline-block text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
                ← Browse all holidays
              </Link>
            </div>
          ) : !pickupReady ? (
            <h1 className="text-center text-xl font-extrabold text-slate-900">Finding pickup location…</h1>
          ) : null}
        </div>
      </div>

      {pkg && pickupReady ? (
        <CityHubMarketplace
          city={origin}
          initialTrip={bookingTrip}
          airportLabel={airportLabel}
        />
      ) : pkg ? (
        <p className="section-shell py-10 text-center text-sm text-slate-500">Loading cabs from your location…</p>
      ) : null}

      {pkg ? (
        <OutstationPageBelow fromName={origin.name} fromSlug={origin.slug} toName={destName}>
          <div className="space-y-6">
            <TourPackageProductContent pkg={pkg} seoKeywords={seoKeywords} />
            <SimilarPackages currentPackageId={pkgId} category={pkg.category} vendor={pkg.vendor} />
          </div>
        </OutstationPageBelow>
      ) : null}
    </div>
  );
}
