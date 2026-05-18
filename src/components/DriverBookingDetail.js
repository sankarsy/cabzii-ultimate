"use client";

import { useMemo, useState } from "react";
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

const FALLBACK_DRIVER_IMAGE =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80";

export default function DriverBookingDetail({ driver, onSelectionChange }) {
  const discount = num(driver.discountPercentage, 0);
  const { hourly, day } = getDriverPricing(driver);
  const chargeItems = useMemo(() => buildDriverChargeItems(driver), [driver]);
  const imageSrc = (driver.image && String(driver.image).trim()) || FALLBACK_DRIVER_IMAGE;
  const vehicles = Array.isArray(driver.supportedVehicles) ? driver.supportedVehicles : [];
  const languages = Array.isArray(driver.languages) ? driver.languages : [];
  const ratingText = formatDriverRating(driver);
  const reviewCount = driver.reviewCount ?? driver.reviews ?? 0;
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

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <div className="lg:grid lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px]">
        <div className="p-3 sm:p-4 lg:border-r lg:border-slate-100">
          <header>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-[#0056D2]">
              {typeLabel}
            </span>
            <h1 className="mt-1.5 text-lg font-bold leading-tight text-slate-900 sm:text-xl">
              {driver.name}
            </h1>
            <p className="mt-0.5 text-xs text-[#0056D2]/90">by {driver.vendor || "Cabzii Partner"}</p>
          </header>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-700">
            <span className="font-medium">{driver.experience ?? "—"} experience</span>
            <span className="font-medium">{driver.trips ?? 0} trips</span>
            {vehicles[0] ? <span className="font-medium">{vehicles[0]}</span> : null}
            {languages[0] ? <span className="font-medium">{languages[0]}</span> : null}
            {dayHireLabel ? <span className="text-slate-600">{dayHireLabel}</span> : null}
          </div>

          <div className="mt-4 inline-flex rounded-full border border-slate-200 bg-slate-50 p-0.5">
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
          <div className="relative overflow-hidden rounded-xl bg-white shadow-sm">
            <img src={imageSrc} alt={driver.name || "Driver"} className="h-44 w-full object-cover sm:h-52" />
            {ratingText ? (
              <span className="absolute right-2 top-2 rounded-lg bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-slate-800 shadow">
                {ratingText} ★ ({reviewCount})
              </span>
            ) : null}
          </div>

          <div className="mt-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
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

          <p className="mt-auto pt-3 text-center text-[10px] text-slate-500">100% Safe & Secure Payments</p>
        </aside>
      </div>
    </article>
  );
}

