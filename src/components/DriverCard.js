"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PackageOptionCard from "./PackageOptionCard";
import { num } from "../lib/cabFare";
import AdditionalChargesGrid from "./AdditionalChargesGrid";
import {
  buildDriverChargeItems,
  buildDriverFareSlabs,
  formatDriverRating,
  isOutstationDriver
} from "../lib/driverFare";

const FALLBACK_DRIVER_IMAGE =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80";

function formatRating(driver) {
  return formatDriverRating(driver);
}

export default function DriverCard({ driver, onBook, bookHref }) {
  const discount = num(driver.discountPercentage, 0);
  const imageSrc = (driver.image && String(driver.image).trim()) || FALLBACK_DRIVER_IMAGE;
  const ratingText = formatRating(driver);
  const reviewCount = driver.reviewCount ?? driver.reviews ?? 0;
  const typeLabel = driver.type
    ? String(driver.type).replace(/\b\w/g, (c) => c.toUpperCase())
    : isOutstationDriver(driver)
      ? "Outstation"
      : "Driver";
  const vehicles = Array.isArray(driver.supportedVehicles) ? driver.supportedVehicles : [];
  const vehicleLabel = vehicles[0] ? String(vehicles[0]) : "All vehicles";

  const fareSlabs = useMemo(() => buildDriverFareSlabs(driver), [driver._id, driver.pricing, driver.type]);
  const chargeItems = useMemo(() => buildDriverChargeItems(driver).slice(0, 4), [driver]);
  const defaultTab = isOutstationDriver(driver) ? "outstation" : "local";
  const defaultPkg = defaultTab === "outstation" ? "outstation_12hr" : "local_4hr";
  const [selectedPackageId, setSelectedPackageId] = useState(defaultPkg);
  const [serviceTab, setServiceTab] = useState(defaultTab);
  const driverPk = String(driver._id ?? driver.id ?? "");
  const detailHref = bookHref ?? (driverPk ? `/drivers/${driverPk}` : undefined);

  const visiblePackages = fareSlabs.filter((pkg) => pkg.group === serviceTab);
  const d = Math.min(99, Math.max(0, discount));

  const handleServiceTab = (tab) => {
    setServiceTab(tab);
    const first = fareSlabs.find((p) => p.group === tab);
    if (first) setSelectedPackageId(first.id);
  };

  const bookButtonClass =
    "inline-flex w-full items-center justify-center gap-1 rounded-lg bg-[#0056D2] px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#0047b3]";

  const BookAction = detailHref ? (
    <Link href={detailHref} className={bookButtonClass}>
      Book Now <span aria-hidden>→</span>
    </Link>
  ) : (
    <button type="button" onClick={() => onBook?.(driver)} className={bookButtonClass}>
      Book Now <span aria-hidden>→</span>
    </button>
  );

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative shrink-0 bg-slate-50">
        <img src={imageSrc} alt={driver.name || "Driver"} className="h-28 w-full object-cover object-center sm:h-32" />
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-blue-600/95 px-2 py-0.5 text-[10px] font-semibold text-white">
          <UserIcon className="h-3 w-3" />
          {typeLabel}
        </span>
        {ratingText ? (
          <span className="absolute right-2 top-2 rounded-md bg-white/95 px-1.5 py-0.5 text-[10px] font-semibold text-slate-800 shadow-sm">
            {ratingText} ★
            {reviewCount ? <span className="font-normal text-slate-500"> ({reviewCount})</span> : null}
          </span>
        ) : null}
        {d > 0 ? (
          <span className="absolute bottom-2 left-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
            {d}% OFF
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-1 text-sm font-bold text-slate-900">{driver.serviceTitle || driver.name}</h3>
        <p className="mt-0.5 line-clamp-1 text-[11px] text-[#0056D2]/80">
          by {driver.vendor || driver.serviceSubtitle || "Cabzii Partner"}
        </p>

        <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[10px] text-slate-600">
          <span className="inline-flex items-center gap-0.5 font-medium">
            <BriefcaseIcon className="h-3 w-3 text-[#0056D2]" />
            {driver.experience ?? "—"}
          </span>
          <span className="inline-flex items-center gap-0.5 font-medium">
            <RouteIcon className="h-3 w-3 text-[#0056D2]" />
            {driver.trips ?? 0} trips
          </span>
          <span className="inline-flex items-center gap-0.5 font-medium">
            <CarIcon className="h-3 w-3 text-[#0056D2]" />
            {vehicleLabel}
          </span>
        </div>

        <div className="mt-2.5 inline-flex w-full rounded-full border border-slate-200 bg-slate-50 p-0.5">
          <button
            type="button"
            onClick={() => handleServiceTab("local")}
            className={`flex-1 rounded-full py-1 text-[10px] font-semibold transition ${
              serviceTab === "local" ? "bg-[#0056D2] text-white" : "text-slate-600"
            }`}
          >
            Local
          </button>
          <button
            type="button"
            onClick={() => handleServiceTab("outstation")}
            className={`flex-1 rounded-full py-1 text-[10px] font-semibold transition ${
              serviceTab === "outstation" ? "bg-[#0056D2] text-white" : "text-slate-600"
            }`}
          >
            Outstation
          </button>
        </div>

        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {visiblePackages.map((pkg) => (
            <PackageOptionCard
              key={pkg.id}
              pkg={pkg}
              selected={selectedPackageId === pkg.id}
              discount={d}
              compact
              onSelect={() => setSelectedPackageId(pkg.id)}
            />
          ))}
        </div>

        <AdditionalChargesGrid items={chargeItems} compact />

        <div className="mt-2 flex items-center justify-end border-t border-slate-100 pt-2">
          <span className="flex items-center gap-0.5 text-[9px] font-medium text-emerald-600">
            <CheckIcon className="h-3 w-3" />
            Verified driver
          </span>
        </div>

        <div className="mt-auto pt-2.5">{BookAction}</div>
      </div>
    </article>
  );
}

function UserIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="3" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

function BriefcaseIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}

function RouteIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M4 19l4-14M16 5l4 14M9 19h6M10 12h4" />
    </svg>
  );
}

function CarIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11" />
      <path d="M3 11h18v6a1 1 0 0 1-1 1h-1M3 11v6a1 1 0 0 0 1 1h1" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}



