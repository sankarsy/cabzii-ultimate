"use client";

import { useMemo, useState } from "react";
import { resolveMediaUrl } from "../lib/media";
import AdditionalChargesGrid from "./AdditionalChargesGrid";
import PackageOptionCard from "./PackageOptionCard";
import {
  buildDriverChargeItems,
  buildDriverFareSlabs,
  driverInitials,
  formatDriverRating,
  getDriverPricing,
  isOutstationDriver,
  num,
  selectionFromDriverPackage
} from "../lib/driverFare";
import { MetaPill, ProductImageFrame, ProductMetaBlock } from "./productCardShared";

const FALLBACK_DRIVER_IMAGE =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80";

export default function DriverBookingDetail({ driver, onSelectionChange }) {
  const discount = num(driver.discountPercentage, 0);
  const { hourly, day } = getDriverPricing(driver);
  const chargeItems = useMemo(() => buildDriverChargeItems(driver), [driver]);
  const imageSrc = resolveMediaUrl(driver.image) || FALLBACK_DRIVER_IMAGE;
  const vehicles = Array.isArray(driver.supportedVehicles) ? driver.supportedVehicles : [];
  const languages = Array.isArray(driver.languages) ? driver.languages : [];
  const ratingText = formatDriverRating(driver);
  const reviewCountRaw = driver.reviewCount ?? driver.reviews;
  const reviewCount =
    reviewCountRaw != null && Number.isFinite(Number(reviewCountRaw)) ? Number(reviewCountRaw) : null;
  const d = Math.min(99, Math.max(0, discount));
  const displayName = driver.serviceTitle || driver.name || "Driver";
  const typeLabel = driver.type
    ? String(driver.type).replace(/\b\w/g, (c) => c.toUpperCase())
    : isOutstationDriver(driver)
      ? "Outstation"
      : "Driver";
  const dayHireLabel =
    day > 0 ? `Day hire ₹${day.toLocaleString("en-IN")}/day` : hourly > 0 ? `From ₹${hourly.toLocaleString("en-IN")}/hr` : null;

  const fareSlabs = useMemo(() => buildDriverFareSlabs(driver), [driver._id, driver.pricing, driver.type]);
  const defaultTab = isOutstationDriver(driver) ? "outstation" : "local";
  const defaultPkg = defaultTab === "outstation" ? "outstation_12hr" : "local_4hr";

  const [selectedPackageId, setSelectedPackageId] = useState(defaultPkg);
  const [serviceTab, setServiceTab] = useState(defaultTab);

  const visiblePackages = fareSlabs.filter((pkg) => pkg.group === serviceTab);

  const emitSelection = (pkg, tab) => {
    if (!pkg || !onSelectionChange) return;
    onSelectionChange(selectionFromDriverPackage(pkg, tab, discount));
  };

  const handleServiceTab = (tab) => {
    setServiceTab(tab);
    const first = fareSlabs.find((p) => p.group === tab);
    if (first) {
      setSelectedPackageId(first.id);
      emitSelection(first, tab);
    }
  };

  const handleSelectPackage = (pkg) => {
    setSelectedPackageId(pkg.id);
    emitSelection(pkg, serviceTab);
  };

  const imageBadges = (
    <>
      <div className="absolute left-1.5 top-1.5 flex items-center gap-1">
        {d > 0 && (
          <span className="rounded-md bg-orange-500 px-1.5 py-0.5 text-[8px] font-bold text-white shadow">
            {d}% OFF
          </span>
        )}
        <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-white backdrop-blur">
          {typeLabel}
        </span>
      </div>
      {ratingText && (
        <div className="absolute right-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-white px-1.5 py-0.5 text-[8px] font-semibold text-slate-700 shadow-sm">
          ★ {ratingText}
          {reviewCount != null ? <span className="text-slate-400"> ({reviewCount})</span> : null}
        </div>
      )}
    </>
  );

  return (
    <article className="overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-lg">
      <ProductImageFrame
        src={imageSrc}
        alt={displayName}
        badges={imageBadges}
        imageClassName="h-[200px] w-full object-cover object-top sm:h-[220px]"
      />

      <ProductMetaBlock title={displayName} vendor={driver.vendor} vendorFallback="Cabzii Partner">
        <MetaPill icon={<BriefcaseIcon className="h-2.5 w-2.5" />} label={driver.experience ?? "Experienced"} />
        <MetaPill icon={<RouteIcon className="h-2.5 w-2.5" />} label={`${driver.trips ?? 0} trips`} />
        {vehicles[0] ? <MetaPill icon={<CarIcon className="h-2.5 w-2.5" />} label={vehicles[0]} /> : null}
        {languages[0] ? <MetaPill icon={<LangIcon className="h-2.5 w-2.5" />} label={languages[0]} /> : null}
        {dayHireLabel ? <MetaPill icon={<RupeeIcon className="h-2.5 w-2.5" />} label={dayHireLabel} /> : null}
      </ProductMetaBlock>

      <div className="lg:grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px]">
        <div className="border-t border-slate-100 p-3 sm:p-4 lg:border-r">
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-0.5">
            <button
              type="button"
              onClick={() => handleServiceTab("local")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                serviceTab === "local" ? "bg-[#0056D2] text-white shadow-sm" : "text-slate-600"
              }`}
            >
              Local
            </button>
            <button
              type="button"
              onClick={() => handleServiceTab("outstation")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                serviceTab === "outstation" ? "bg-[#0056D2] text-white shadow-sm" : "text-slate-600"
              }`}
            >
              Outstation
            </button>
          </div>

          <div className="mt-5 -mx-1 flex gap-3 overflow-x-auto pb-2 pt-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0">
            {visiblePackages.map((pkg) => (
              <div key={pkg.id} className="min-w-[13rem] shrink-0 sm:min-w-0">
                <PackageOptionCard
                  pkg={pkg}
                  selected={selectedPackageId === pkg.id}
                  discount={discount}
                  compact
                  onSelect={() => handleSelectPackage(pkg)}
                />
              </div>
            ))}
          </div>

          <AdditionalChargesGrid items={chargeItems} />
        </div>

        <aside className="flex flex-col border-t border-slate-100 bg-slate-50/60 p-3 sm:p-4 lg:border-t-0">
          <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                {driverInitials(driver.vendor || driver.name)}
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">{driver.vendor || "Cabzii Partner"}</p>
                <p className="mt-0.5 text-xs font-medium text-emerald-600">Verified driver</p>
              </div>
            </div>
          </div>

          <p className="mt-auto flex items-center justify-center gap-1 pt-3 text-[10px] text-slate-500">
            <LockIcon className="h-3.5 w-3.5" />
            100% Safe & Secure Payments
          </p>
        </aside>
      </div>
    </article>
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
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
    </svg>
  );
}

function LangIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
    </svg>
  );
}

function RupeeIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M6 3h12M6 8h12M8 21l8-10H6" />
    </svg>
  );
}

function LockIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

