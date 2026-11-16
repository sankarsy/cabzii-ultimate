"use client";

import { Check, MapPin, Shield } from "../icons/rscIcons";
import FaqSection from "../seo/FaqSection";
import { compactVehicleSeoHtml, normalizeSeoCity } from "../../lib/vehicleEnterpriseSeo";

function youtubeEmbed(url) {
  const raw = String(url || "").trim();
  if (!raw) return "";
  try {
    const u = new URL(raw);
    if (u.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${u.pathname.replace("/", "")}`;
    const id = u.searchParams.get("v");
    if (id) return `https://www.youtube.com/embed/${id}`;
  } catch {
    return "";
  }
  return "";
}

function pageContentParts(cab) {
  const es = cab?.enterpriseSeo && typeof cab.enterpriseSeo === "object" ? cab.enterpriseSeo : {};
  const displayCity = normalizeSeoCity(cab?.city);
  const h2s = Array.isArray(es.h2)
    ? es.h2.filter(Boolean)
    : Array.isArray(cab?.h2)
      ? cab.h2.filter(Boolean)
      : [];
  const longHtml = compactVehicleSeoHtml(
    String(es.longSeoContent || cab?.longSeoContent || "").trim()
  ).replace(/\bAll India\b/gi, displayCity);
  const shortDesc = String(es.shortDescription || cab?.shortDescription || "")
    .replace(/\bAll India\b/gi, displayCity)
    .trim();
  return { es, displayCity, h2s, longHtml, shortDesc };
}

/** SEO / About block — render at the end of the product page only. */
export function VehiclePageContent({ cab }) {
  const { es, displayCity, h2s, longHtml, shortDesc } = pageContentParts(cab);
  if (!shortDesc && !longHtml && !h2s.length) return null;

  return (
    <section id="page-content" className="scroll-mt-28 rounded-2xl border border-[var(--cabzii-border)] bg-white p-4 shadow-[var(--cabzii-shadow-card)] sm:p-5">
      <h2 className="text-lg font-bold text-[var(--cabzii-ink)]">
        {(h2s[0] || es.h1 || cab?.h1 || `About this ${cab?.vehicleName || "cab"}`)
          .toString()
          .replace(/\bAll India\b/gi, displayCity)}
      </h2>
      {shortDesc ? (
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{shortDesc}</p>
      ) : null}
      {longHtml ? (
        <div
          className="cabzii-vehicle-seo mt-2.5 max-w-none text-slate-700"
          dangerouslySetInnerHTML={{ __html: longHtml }}
        />
      ) : null}
      {h2s.length > 1 && !longHtml ? (
        <ul className="mt-2.5 grid gap-1 sm:grid-cols-2">
          {h2s.slice(1).map((h) => (
            <li key={h} className="rounded-md bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-600 sm:text-xs">
              {h.replace(/\bAll India\b/gi, displayCity)}
            </li>
          ))}
        </ul>
      ) : null}
      {h2s.length > 1 && longHtml ? (
        <details className="mt-2.5 rounded-lg border border-slate-100 bg-slate-50/80 px-2.5 py-2">
          <summary className="cursor-pointer text-[10px] font-semibold text-slate-600 sm:text-[11px]">
            Topics on this page
          </summary>
          <ul className="mt-1.5 space-y-0.5">
            {h2s.slice(1).map((h) => (
              <li key={h} className="text-[10px] leading-snug text-slate-500 sm:text-[11px]">
                {h.replace(/\bAll India\b/gi, displayCity)}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}

export default function VehicleDetailExtras({ cab, showPageContent = false }) {
  const es = cab?.enterpriseSeo && typeof cab.enterpriseSeo === "object" ? cab.enterpriseSeo : {};
  const features = Array.isArray(cab?.features) ? cab.features : [];
  const pickups = Array.isArray(cab?.pickupLocations) ? cab.pickupLocations.filter(Boolean) : [];
  const faqs = Array.isArray(cab?.faq) ? cab.faq.filter((f) => f.question?.trim() && f.answer?.trim()) : [];
  const highlights = Array.isArray(es.highlights)
    ? es.highlights.filter(Boolean)
    : Array.isArray(cab?.highlights)
      ? cab.highlights.filter(Boolean)
      : [];
  const nearby = [
    ...(Array.isArray(es.nearbyLocations) ? es.nearbyLocations : []),
    ...(Array.isArray(es.nearbyAirports) ? es.nearbyAirports.map((x) => `${x} Airport`) : []),
    ...(Array.isArray(es.nearbyStations) ? es.nearbyStations.map((x) => `${x} Station`) : []),
    ...(Array.isArray(es.nearbyPlaces) ? es.nearbyPlaces : [])
  ].filter(Boolean);
  const embed = youtubeEmbed(es.youtubeUrl || cab?.youtubeUrl);
  const displayCity = normalizeSeoCity(cab?.city);

  const specFlags = [
    cab?.gps && "GPS",
    cab?.fastTag && "FastTag",
    cab?.musicSystem && "Music System",
    cab?.charger && "USB Charger",
    cab?.bottledWater && "Bottle Water",
    cab?.childSeat && "Child Seat",
    cab?.wheelchairAccessible && "Wheelchair Accessible"
  ].filter(Boolean);

  const allFeatures = [...new Set([...features, ...specFlags])];

  return (
    <div className="space-y-4 sm:space-y-5">
      {highlights.length > 0 ? (
        <section id="highlights" className="scroll-mt-28 rounded-2xl border border-[var(--cabzii-border)] bg-white p-4 shadow-[var(--cabzii-shadow-card)] sm:p-5">
          <h2 className="text-lg font-bold text-[var(--cabzii-ink)]">Why book with Cabzii</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {highlights.map((h) => (
              <li key={h} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 sm:text-sm">
                {h}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {showPageContent ? <VehiclePageContent cab={cab} /> : null}

      {allFeatures.length > 0 ? (
        <section id="features" className="scroll-mt-28 rounded-2xl border border-[var(--cabzii-border)] bg-white p-4 shadow-[var(--cabzii-shadow-card)] sm:p-5">
          <h2 className="text-lg font-bold text-[var(--cabzii-ink)]">Vehicle features</h2>
          <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {allFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-slate-700">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-emerald-50 text-emerald-600">
                  <Check className="h-4 w-4" strokeWidth={2} />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {nearby.length > 0 ? (
        <section id="nearby" className="scroll-mt-28 rounded-2xl border border-[var(--cabzii-border)] bg-white p-4 shadow-[var(--cabzii-shadow-card)] sm:p-5">
          <h2 className="text-lg font-bold text-[var(--cabzii-ink)]">Areas we serve</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {nearby.map((loc) => (
              <li key={loc} className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 sm:text-sm">
                {loc}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {pickups.length > 0 ? (
        <section id="pickup-locations" className="scroll-mt-28 rounded-2xl border border-[var(--cabzii-border)] bg-white p-4 shadow-[var(--cabzii-shadow-card)] sm:p-5">
          <h2 className="text-lg font-bold text-[var(--cabzii-ink)]">Pickup locations</h2>
          <ul className="mt-3 space-y-2.5">
            {pickups.map((loc) => (
              <li key={loc} className="flex items-start gap-2.5 text-sm text-slate-700">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--cabzii-brand)]" strokeWidth={2} />
                {loc}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {embed ? (
        <section id="video" className="scroll-mt-28 overflow-hidden rounded-2xl border border-[var(--cabzii-border)] bg-white shadow-[var(--cabzii-shadow-card)]">
          <div className="p-4 pb-0 sm:p-5 sm:pb-0">
            <h2 className="text-lg font-bold text-[var(--cabzii-ink)]">Vehicle video</h2>
          </div>
          <div className="aspect-video w-full p-3 pt-2 sm:p-4 sm:pt-2.5">
            <iframe
              title="Vehicle video"
              src={embed}
              className="h-full w-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      ) : null}

      <section id="vendor" className="scroll-mt-28 rounded-2xl border border-[var(--cabzii-border)] bg-white p-4 shadow-[var(--cabzii-shadow-card)] sm:p-5">
        <h2 className="text-lg font-bold text-[var(--cabzii-ink)]">Vendor details</h2>
        <div className="mt-3 flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-sky-100 text-sm font-bold text-sky-800">
            {(cab?.vendor || "C").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-base font-semibold text-slate-900">{cab?.vendor || "Cabzii Partner"}</p>
            <p className="text-sm text-slate-600">{displayCity} · Verified fleet partner</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-emerald-700">
              <Shield className="h-4 w-4 text-emerald-500" /> Background-verified drivers
            </p>
          </div>
        </div>
      </section>

      {faqs.length > 0 ? (
        <section id="faqs" className="scroll-mt-28">
          <FaqSection
            title="FAQs"
            subtitle={`About ${cab?.vehicleName || cab?.title || "this cab"}`}
            faqs={faqs.map((f) => [f.question, f.answer])}
            scrollMaxClass="max-h-[14rem] sm:max-h-[min(18rem,45vh)]"
          />
        </section>
      ) : null}
    </div>
  );
}
