"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PackageOptionCard from "./PackageOptionCard";
import { num } from "../lib/cabFare";
import {
  buildDriverChargeItems,
  buildDriverFareSlabs,
  formatDriverRating,
  isOutstationDriver,
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

  const fareSlabs = useMemo(
    () => buildDriverFareSlabs(driver),
    [driver._id, driver.pricing, driver.type]
  );
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
    "inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white tracking-wide shadow-sm transition-all duration-150 hover:bg-blue-700 hover:shadow-md active:scale-[0.98]";

  const BookAction = detailHref ? (
    <Link href={detailHref} className={bookButtonClass}>
      Book Now <ArrowRightIcon className="h-3 w-3" />
    </Link>
  ) : (
    <button type="button" onClick={() => onBook?.(driver)} className={bookButtonClass}>
      Book Now <ArrowRightIcon className="h-3 w-3" />
    </button>
  );

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm ring-1 ring-slate-900/5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">

      {/* ── Image Section ── */}
      <div className="relative shrink-0 overflow-hidden">
        <img
          src={imageSrc}
          alt={driver.name || "Driver"}
          className="h-36 w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />

        {/* Type badge — top left */}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-semibold text-white shadow">
          <UserIcon className="h-3 w-3" />
          {typeLabel}
        </span>

        {/* Rating — top right */}
        {ratingText && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-700 shadow backdrop-blur-sm">
            <StarIcon className="h-3 w-3 text-amber-400" />
            {ratingText}
            {reviewCount ? (
              <span className="font-normal text-slate-400">({reviewCount})</span>
            ) : null}
          </span>
        )}

        {/* Discount — bottom left */}
        {d > 0 && (
          <span className="absolute bottom-3 left-3 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
            {d}% OFF
          </span>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col gap-3 p-3.5">

        {/* Name + vendor + verified */}
        <div>
          <h3 className="line-clamp-1 text-sm font-bold leading-snug text-slate-900">
            {driver.serviceTitle || driver.name}
          </h3>
          <div className="mt-0.5 flex items-center justify-between">
            <p className="line-clamp-1 text-[11px] text-blue-600/80">
              by {driver.vendor || driver.serviceSubtitle || "Cabzii Partner"}
            </p>
            <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-600">
              <CheckIcon className="h-3 w-3" />
              Verified
            </span>
          </div>
        </div>

        {/* Stat pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Pill icon={<BriefcaseIcon className="h-3 w-3" />} label={driver.experience ?? "—"} />
          <Pill icon={<RouteIcon className="h-3 w-3" />} label={`${driver.trips ?? 0} trips`} />
          <Pill icon={<CarIcon className="h-3 w-3" />} label={vehicleLabel} />
        </div>

        {/* Service toggle */}
        <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-[10px] font-semibold">
          {["local", "outstation"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleServiceTab(tab)}
              className={`flex-1 rounded-md py-1.5 capitalize transition-all duration-150 ${
                serviceTab === tab
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Package cards */}
        {visiblePackages.length > 0 && (
          <div className="grid grid-cols-2 gap-1.5">
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
        )}

    
        {/* Book button — pinned to bottom */}
        <div className="mt-auto pt-1">{BookAction}</div>
      </div>
    </article>
  );
}

/* ── Shared Pill ── */
function Pill({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
      <span className="text-blue-500">{icon}</span>
      {label}
    </span>
  );
}

/* ── Icons ── */
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

function StarIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function ArrowRightIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}