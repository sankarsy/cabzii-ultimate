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
          Get fare
        </Link>
      </div>

      <div className="emt-hero-search-card emt-cab-search-card">
        <div className="emt-search-wrap">
          <div className="emt-search-bar emt-search-bar-drivers">
            <div className="cabzii-search-cell">
              <span className="emt-redbus-label">SERVICE</span>
              <span className="text-lg font-extrabold text-slate-900 sm:text-xl">{selected?.title}</span>
              <span className="text-sm font-medium text-slate-400">{selected?.blurb}</span>
            </div>
            <div className="cabzii-search-cell">
              <span className="emt-redbus-label">FARE</span>
              <span className="text-lg font-extrabold text-slate-900 sm:text-xl">{fareLabel}</span>
              <span className="text-sm font-medium text-slate-400">Driver assigned after you confirm</span>
            </div>
          </div>
          <Link href={callDriverBookHref(selected?.id || "local")} className="emt-search-submit cabzii-tap">
            SEARCH
          </Link>
        </div>
      </div>

      <div className="mt-3 flex justify-end sm:mt-4">
        <p className="rounded-md border border-white/40 bg-white/10 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
          Driver for your own car · fare shown before you confirm
        </p>
      </div>
    </div>
  );
}
