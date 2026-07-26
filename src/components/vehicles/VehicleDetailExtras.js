"use client";

import { Check, MapPin, Shield } from "lucide-react";
import FaqSection from "../seo/FaqSection";

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

export default function VehicleDetailExtras({ cab }) {
  const es = cab?.enterpriseSeo && typeof cab.enterpriseSeo === "object" ? cab.enterpriseSeo : {};
  const features = Array.isArray(cab?.features) ? cab.features : [];
  const pickups = Array.isArray(cab?.pickupLocations) ? cab.pickupLocations.filter(Boolean) : [];
  const faqs = Array.isArray(cab?.faq) ? cab.faq.filter((f) => f.question?.trim() && f.answer?.trim()) : [];
  const highlights = Array.isArray(es.highlights) ? es.highlights.filter(Boolean) : [];
  const nearby = [
    ...(Array.isArray(es.nearbyLocations) ? es.nearbyLocations : []),
    ...(Array.isArray(es.nearbyAirports) ? es.nearbyAirports.map((x) => `${x} Airport`) : []),
    ...(Array.isArray(es.nearbyStations) ? es.nearbyStations.map((x) => `${x} Station`) : []),
    ...(Array.isArray(es.nearbyPlaces) ? es.nearbyPlaces : [])
  ].filter(Boolean);
  const h2s = Array.isArray(es.h2) ? es.h2.filter(Boolean) : [];
  const embed = youtubeEmbed(es.youtubeUrl);
  const longHtml = String(es.longSeoContent || "").trim();
  const shortDesc = String(es.shortDescription || "").trim();

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
    <div className="space-y-6">
      {highlights.length > 0 ? (
        <section id="highlights" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <h2 className="text-base font-bold text-slate-900">Why book with Cabzii</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {highlights.map((h) => (
              <li key={h} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                {h}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {shortDesc || longHtml || h2s.length ? (
        <section id="seo-content" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          {h2s[0] ? <h2 className="text-base font-bold text-slate-900">{h2s[0]}</h2> : <h2 className="text-base font-bold text-slate-900">About this cab</h2>}
          {shortDesc ? <p className="mt-2 text-sm text-slate-700">{shortDesc}</p> : null}
          {longHtml ? (
            <div className="prose prose-sm mt-3 max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: longHtml }} />
          ) : null}
          {h2s.length > 1 ? (
            <ul className="mt-4 space-y-1 text-sm text-slate-700">
              {h2s.slice(1).map((h) => (
                <li key={h} className="font-medium text-slate-800">
                  {h}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {allFeatures.length > 0 ? (
        <section id="features" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <h2 className="text-base font-bold text-slate-900">Vehicle features</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {allFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                <Check className="h-4 w-4 shrink-0 text-emerald-400" strokeWidth={2} />
                {f}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {nearby.length > 0 ? (
        <section id="nearby" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <h2 className="text-base font-bold text-slate-900">Areas we serve</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {nearby.map((loc) => (
              <li key={loc} className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                {loc}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {pickups.length > 0 ? (
        <section id="pickup-locations" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <h2 className="text-base font-bold text-slate-900">Pickup locations</h2>
          <ul className="mt-3 space-y-2">
            {pickups.map((loc) => (
              <li key={loc} className="flex items-start gap-2 text-sm text-slate-700">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" strokeWidth={2} />
                {loc}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {embed ? (
        <section id="video" className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-4 pb-0 md:p-5 md:pb-0">
            <h2 className="text-base font-bold text-slate-900">Vehicle video</h2>
          </div>
          <div className="aspect-video w-full p-4 pt-3 md:p-5 md:pt-3">
            <iframe title="Vehicle video" src={embed} className="h-full w-full rounded-xl" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        </section>
      ) : null}

      <section id="vendor" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <h2 className="text-base font-bold text-slate-900">Vendor details</h2>
        <div className="mt-3 flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sm font-bold text-sky-800">
            {(cab?.vendor || "C").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{cab?.vendor || "Cabzii Partner"}</p>
            <p className="text-xs text-slate-600">{cab?.city || "South India"} · Verified fleet partner</p>
            <p className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-500">
              <Shield className="h-3.5 w-3.5 text-emerald-400" /> Background-verified drivers
            </p>
          </div>
        </div>
      </section>

      {faqs.length > 0 ? (
        <section id="faqs" className="scroll-mt-24">
          <FaqSection title="FAQs" subtitle={`About ${cab?.vehicleName || cab?.title || "this cab"}`} faqs={faqs.map((f) => [f.question, f.answer])} />
        </section>
      ) : null}
    </div>
  );
}
