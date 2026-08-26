"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CALL_DRIVER_SERVICES,
  callDriverBookHref,
  mergeCallDriverServices,
  formatFromPrice
} from "../../lib/callDriver";

export default function CallDriverHeroPanel() {
  const [services, setServices] = useState(CALL_DRIVER_SERVICES);
  const [selectedId, setSelectedId] = useState("local");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/call-driver", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled || !json?.data?.services) return;
        setServices(mergeCallDriverServices(json.data.services));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = services.find((s) => s.id === selectedId) || services[0];
  const from = formatFromPrice(selected?.fromPrice);
  const fareLabel = selected?.quoteOnly
    ? selected.cta
    : selected?.id === "outstation" && from
      ? `${from}/day`
      : from || selected?.cta || "";

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
        <div className="emt-cab-mode-capsule" role="tablist" aria-label="Call Driver service">
          {services.map((svc) => (
            <button
              key={svc.id}
              type="button"
              role="tab"
              aria-selected={selectedId === svc.id}
              onClick={() => setSelectedId(svc.id)}
              className={`emt-cab-mode-pill cabzii-tap ${selectedId === svc.id ? "emt-cab-mode-pill-active" : ""}`}
            >
              {svc.shortTitle || svc.title}
            </button>
          ))}
        </div>
        <Link
          href={callDriverBookHref(selected?.id || "local")}
          className="emt-hero-price-hint cabzii-tap hidden sm:inline-flex items-center hover:underline"
        >
          Book a Driver
        </Link>
      </div>

      <div className="emt-hero-search-card emt-cab-search-card">
        <div className="emt-search-wrap">
          <div className="emt-search-bar emt-search-bar-drivers">
            <div className="cabzii-search-cell">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Service</span>
              <span className="text-base font-bold text-slate-900 sm:text-lg">{selected?.title}</span>
              <span className="text-xs text-slate-400">{selected?.blurb}</span>
            </div>
            <div className="cabzii-search-cell">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fare</span>
              <span className="text-base font-bold text-slate-900 sm:text-lg">{fareLabel}</span>
              <span className="text-xs text-slate-400">Professional driver assigned after booking</span>
            </div>
          </div>
          <Link href={callDriverBookHref(selected?.id || "local")} className="emt-search-submit cabzii-tap">
            {selected?.quoteOnly ? "QUOTE" : "BOOK"}
          </Link>
        </div>
      </div>

      <div className="mt-3 flex justify-end sm:mt-4">
        <p className="rounded-md border border-white/40 bg-white/10 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
          ✓ Trusted by 50K+ travellers
        </p>
      </div>
    </div>
  );
}
