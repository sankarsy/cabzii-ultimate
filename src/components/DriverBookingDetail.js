"use client";

import { useEffect, useMemo, useState } from "react";
import { resolveMediaUrl } from "../lib/media";
import PackageOptionCard from "./PackageOptionCard";
import AdditionalChargesGrid from "./AdditionalChargesGrid";
import {
  buildDriverChargeItems,
  buildDriverFareSlabs,
  driverInitials,
  formatDriverRating,
  isOutstationDriver,
  num,
  selectionFromDriverPackage
} from "../lib/driverFare";
import { MetaPill, ProductImageFrame, ProductMetaBlock } from "./productCardShared";
import {
  BriefcaseIcon,
  CalendarIcon,
  CarIcon,
  CheckIcon,
  HeadsetIcon,
  LangIcon,
  LockIcon,
  MapPinIcon,
  PersonIcon,
  RoadIcon,
  RouteIcon,
  RupeeIcon,
  ShieldIcon,
  TagIcon
} from "./icons";

const PinIcon = MapPinIcon;
const FALLBACK_DRIVER_IMAGE =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80";

export default function DriverBookingDetail({ driver, onSelectionChange, initialPackageId = "" }) {
  const discount = num(driver.discountPercentage, 0);
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
  const day = num(driver?.pricing?.day);
  const hourly = num(driver?.pricing?.hourly);
  const dayHireLabel =
    day > 0 ? `Day hire ₹${day.toLocaleString("en-IN")}/day` : hourly > 0 ? `From ₹${hourly.toLocaleString("en-IN")}/hr` : null;

  const fareSlabs = useMemo(() => buildDriverFareSlabs(driver), [driver._id, driver.pricing, driver.farePackages]);
  const [selectedPackageId, setSelectedPackageId] = useState(initialPackageId || "local_4hr");
  const [serviceTab, setServiceTab] = useState("local");

  const visiblePackages = fareSlabs.filter((pkg) => pkg.group === serviceTab);

  const emitSelection = (pkg, tab) => {
    if (!pkg || !onSelectionChange) return;
    onSelectionChange(selectionFromDriverPackage(pkg, tab, discount));
  };

  useEffect(() => {
    if (!initialPackageId) return;
    const pkg = fareSlabs.find((p) => p.id === initialPackageId);
    if (pkg) {
      setSelectedPackageId(pkg.id);
      setServiceTab(pkg.group);
      emitSelection(pkg, pkg.group);
    }
  }, [initialPackageId, fareSlabs, driver._id, discount, onSelectionChange]);

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
          <span className="rounded-md bg-[#0056D2] px-1.5 py-0.5 text-[8px] font-bold text-white shadow">
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
        {driver.city || driver.location ? (
          <MetaPill label={`${driver.city || "City"}${driver.location ? ` · ${driver.location}` : ""}`} />
        ) : null}
        <MetaPill icon={<BriefcaseIcon className="h-2.5 w-2.5" />} label={driver.experience ?? "Experienced"} />
        <MetaPill icon={<RouteIcon className="h-2.5 w-2.5" />} label={`${driver.trips ?? 0} trips`} />
        {vehicles[0] ? <MetaPill icon={<CarIcon className="h-2.5 w-2.5" />} label={vehicles[0]} /> : null}
        <MetaPill icon={<PersonIcon className="h-2.5 w-2.5" />} label="Your vehicle" />
        {languages[0] ? <MetaPill icon={<LangIcon className="h-2.5 w-2.5" />} label={languages[0]} /> : null}
        {dayHireLabel ? <MetaPill icon={<RupeeIcon className="h-2.5 w-2.5" />} label={dayHireLabel} /> : null}
      </ProductMetaBlock>

      <div className="lg:grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px]">
        <div className="border-t border-slate-100 p-3 sm:p-4 lg:border-r">
          <ServiceToggle serviceTab={serviceTab} setServiceTab={handleServiceTab} />
          <PackageSection
            visiblePackages={visiblePackages}
            selectedPackageId={selectedPackageId}
            onSelectPackage={handleSelectPackage}
            discount={discount}
          />
          <AdditionalChargesGrid items={chargeItems} />
        </div>

        <aside className="flex flex-col border-t border-slate-100 bg-slate-50/60 p-3 sm:p-4 lg:border-t-0">
          <VendorBox vendor={driver.vendor || driver.name} />
          <TrustGrid />
          <p className="mt-auto flex items-center justify-center gap-1 pt-3 text-[10px] text-slate-500">
            <LockIcon className="h-3.5 w-3.5" />
            100% Safe & Secure Payments
          </p>
        </aside>
      </div>
    </article>
  );
}

function ServiceToggle({ serviceTab, setServiceTab }) {
  return (
    <div className="mt-4 inline-flex rounded-full border border-slate-200 bg-slate-50 p-0.5">
      <button
        type="button"
        onClick={() => setServiceTab("local")}
        className={`inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
          serviceTab === "local"
            ? "bg-[#0056D2] text-white shadow-sm"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <PinIcon className="h-3.5 w-3.5" />
        Local
      </button>
      <button
        type="button"
        onClick={() => setServiceTab("outstation")}
        className={`inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
          serviceTab === "outstation"
            ? "bg-[#0056D2] text-white shadow-sm"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <RoadIcon className="h-3.5 w-3.5" />
        Outstation
      </button>
    </div>
  );
}

function PackageSection({ visiblePackages, selectedPackageId, onSelectPackage, discount }) {
  return (
    <div className="mt-5">
      <div className="-mx-1 flex gap-3 overflow-x-auto pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:grid sm:auto-rows-fr sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-2 xl:grid-cols-2 [&::-webkit-scrollbar]:hidden">
        {visiblePackages.map((pkg) => (
          <div key={pkg.id} className="flex min-h-[8.75rem] min-w-[13rem] shrink-0 snap-start sm:min-h-0 sm:min-w-0">
            <PackageOptionCard
              pkg={pkg}
              selected={selectedPackageId === pkg.id}
              discount={discount}
              compact
              onSelect={() => onSelectPackage(pkg)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ChargesGrid({ items }) {
  return <AdditionalChargesGrid items={items} />;
}

function VendorBox({ vendor }) {
  return (
    <div className="mt-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-[#0056D2]">
          {driverInitials(vendor)}
        </span>
        <div>
          <p className="text-sm font-bold text-slate-900">{vendor || "Cabzii Partner"}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-slate-600">
            <CheckIcon className="h-3.5 w-3.5" />
            Verified Vendor
          </p>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {["Trusted & Verified", "Professional Drivers", "100% Safe & Secure"].map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-600">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function TrustGrid() {
  const items = [
    { label: "Secure Booking", sub: "Your safety our priority", icon: ShieldIcon },
    { label: "Transparent Pricing", sub: "No hidden charges", icon: TagIcon },
    { label: "24/7 Support", sub: "Always here to help", icon: HeadsetIcon },
    { label: "Easy Cancellation", sub: "Flexible policies", icon: CalendarIcon }
  ];
  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="rounded-lg bg-white px-2 py-2 text-center shadow-sm">
            <Icon className="mx-auto h-4 w-4 text-[#0056D2]" />
            <p className="mt-1 text-[10px] font-bold text-slate-800">{item.label}</p>
            <p className="text-[9px] text-slate-500">{item.sub}</p>
          </div>
        );
      })}
    </div>
  );
}
