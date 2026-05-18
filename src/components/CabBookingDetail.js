"use client";

import { useMemo, useState } from "react";
import PackageOptionCard from "./PackageOptionCard";
import {
  buildFareSlabs,
  formatRating,
  num,
  selectionFromPackage,
  vendorInitials
} from "../lib/cabFare";

const FALLBACK_CAB_IMAGE =
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80";

export default function CabBookingDetail({ cab, onSelectionChange }) {
  const discount = num(cab.discountPercentage, 0);
  const price = num(cab.price);
  const day = num(cab.dayRate);
  const hourly = num(cab.hourlyRate);
  const rawExtra = cab.extraHourRate;
  const extraHour =
    rawExtra != null && rawExtra !== "" && Number.isFinite(Number(rawExtra)) ? num(rawExtra) : num(cab.price);
  const extraKmRate = Math.max(12, Math.floor(price / 10) || 12);
  const nightCharge = extraHour > 0 ? Math.max(0, Math.round(extraHour * 0.25)) : null;
  const imageSrc = (cab.image && String(cab.image).trim()) || FALLBACK_CAB_IMAGE;
  const features = Array.isArray(cab.features) ? cab.features : [];
  const hasAc = features.some((f) => /^(ac|a\/c|air\s*condition)/i.test(String(f).trim()));
  const amenityLabel = hasAc ? "AC" : features[0] ? String(features[0]) : "—";
  const dayHireLabel =
    day > 0 ? `Day hire ₹${day.toLocaleString("en-IN")}/day` : hourly > 0 ? `From ₹${hourly.toLocaleString("en-IN")}/hr` : null;
  const ratingText = formatRating(cab);
  const reviewCount = cab.reviewCount ?? cab.reviews ?? 234;

  const fareSlabs = useMemo(
    () => buildFareSlabs(cab),
    [cab._id, cab.hourlyRate, cab.dayRate, cab.price, cab.extraHourRate, cab.discountPercentage]
  );
  const [selectedPackageId, setSelectedPackageId] = useState("local_4hr");
  const [serviceTab, setServiceTab] = useState("local");

  const visiblePackages = fareSlabs.filter((pkg) => pkg.group === serviceTab);
  const emitSelection = (pkg, tab) => {
    if (!pkg || !onSelectionChange) return;
    onSelectionChange(selectionFromPackage(pkg, tab, discount));
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
          <CabHeader cab={cab} />
          <FeatureRow cab={cab} amenityLabel={amenityLabel} dayHireLabel={dayHireLabel} />
          <ServiceToggle serviceTab={serviceTab} setServiceTab={handleServiceTab} />
          <PackageSection
            visiblePackages={visiblePackages}
            selectedPackageId={selectedPackageId}
            onSelectPackage={handleSelectPackage}
            discount={discount}
          />
          <ChargesGrid extraKmRate={extraKmRate} extraHour={extraHour} nightCharge={nightCharge} />
        </div>

        <aside className="flex flex-col border-t border-slate-100 bg-slate-50/60 p-3 sm:p-4 lg:border-t-0">
          <div className="relative overflow-hidden rounded-xl bg-white shadow-sm">
            <img src={imageSrc} alt={cab.title || "Cab"} className="h-44 w-full object-cover object-center sm:h-52" />
            {ratingText ? (
              <span className="absolute right-2 top-2 rounded-lg bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-slate-800 shadow">
                {ratingText} ★ ({reviewCount})
              </span>
            ) : null}
          </div>

          <VendorBox vendor={cab.vendor} />
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

function CabHeader({ cab }) {
  return (
    <header>
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-[#0056D2]">
        <CarIcon className="h-3.5 w-3.5" />
        {cab.type}
      </span>
      <h1 className="mt-1.5 text-lg font-bold leading-tight text-slate-900 sm:text-xl">{cab.title}</h1>
      <p className="mt-0.5 text-xs text-[#0056D2]/90">by {cab.vendor}</p>
    </header>
  );
}

function FeatureRow({ cab, amenityLabel, dayHireLabel }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-700">
      <span className="inline-flex items-center gap-1 font-medium">
        <SeatIcon className="h-3.5 w-3.5 text-[#0056D2]" />
        {cab.seats ?? "—"} Seats
      </span>
      <span className="inline-flex items-center gap-1 font-medium">
        <SnowflakeIcon className="h-3.5 w-3.5 text-[#0056D2]" />
        {amenityLabel}
      </span>
      <span className="inline-flex items-center gap-1 font-medium">
        <PersonIcon className="h-3.5 w-3.5 text-[#0056D2]" />
        Driver Included
      </span>
      {dayHireLabel ? (
        <span className="inline-flex items-center gap-1 text-slate-600">
          <RupeeIcon className="h-3.5 w-3.5 text-[#0056D2]" />
          {dayHireLabel}
        </span>
      ) : null}
    </div>
  );
}

function ServiceToggle({ serviceTab, setServiceTab }) {
  return (
    <div className="mt-4 inline-flex rounded-full border border-slate-200 bg-slate-50 p-0.5">
      <button
        type="button"
        onClick={() => setServiceTab("local")}
        className={`inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
          serviceTab === "local" ? "bg-[#0056D2] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <PinIcon className="h-3.5 w-3.5" />
        Local
      </button>
      <button
        type="button"
        onClick={() => setServiceTab("outstation")}
        className={`inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
          serviceTab === "outstation" ? "bg-[#0056D2] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
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
      <div className="-mx-1 flex gap-3 overflow-x-auto pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-2 xl:grid-cols-2 [&::-webkit-scrollbar]:hidden">
        {visiblePackages.map((pkg) => (
          <div key={pkg.id} className="min-w-[13rem] shrink-0 snap-start sm:min-w-0">
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

function ChargesGrid({ extraKmRate, extraHour, nightCharge }) {
  const items = [
    { label: "Extra KM Charge", value: `₹${extraKmRate}/km`, icon: RoadIcon },
    { label: "Extra Hour Charge", value: `₹${extraHour}/hr`, icon: ClockIcon },
    { label: "Drop Charge", value: "Contact Vendor", icon: PinIcon },
    { label: "Night Charges", value: nightCharge != null ? `₹${nightCharge} Extra (10 PM – 6 AM)` : "—", icon: ClockIcon },
    { label: "Cancel Charge", value: "As per vendor policy", icon: CalendarIcon },
    { label: "Out of City (>40 km)", value: "Per trip quote", icon: RoadIcon },
    { label: "Driver Allowance", value: "Included", icon: PersonIcon },
    { label: "Toll, Parking & State Tax", value: "As per actuals", icon: TagIcon }
  ];

  return (
    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/90 p-3">
      <h2 className="mb-2 text-xs font-bold text-slate-900">Additional charges</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <p key={item.label} className="flex items-start gap-1.5 text-xs text-slate-600">
              <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>
                <span className="font-medium text-slate-800">{item.label}</span>
                <br />
                <span className="text-slate-500">{item.value}</span>
              </span>
            </p>
          );
        })}
      </div>
    </div>
  );
}

function VendorBox({ vendor }) {
  return (
    <div className="mt-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
          {vendorInitials(vendor)}
        </span>
        <div>
          <p className="text-sm font-bold text-slate-900">{vendor}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-emerald-600">
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

function SeatIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M7 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M5 13h4a3 3 0 0 1 3 3v3H5v-6zM12 16h6l1 3h-7" />
    </svg>
  );
}

function PersonIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="3" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

function SnowflakeIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M12 2v20M12 2l3 4M12 2L9 6M12 22l3-4M12 22l-3-4M2 12h20M2 12l4 3M2 12l4-3M22 12l-4 3M22 12l-4-3" />
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

function PinIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  );
}

function RoadIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M4 19l4-14M16 5l4 14M9 19h6M10 12h4" />
    </svg>
  );
}

function ClockIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
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

function CheckIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function ShieldIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function TagIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    </svg>
  );
}

function HeadsetIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M3 11v2a7 7 0 0 0 7 7h1M21 11v2a7 7 0 0 1-7 7h-1" />
    </svg>
  );
}

function CalendarIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}



