"use client";

import { useMemo, useState } from "react";
import { resolveMediaUrl } from "../lib/media";
import PackageOptionCard from "./PackageOptionCard";
import {
  buildFareSlabs,
  formatRating,
  num,
  selectionFromPackage,
  vendorInitials
} from "../lib/cabFare";
import { MetaPill, ProductImageFrame, ProductMetaBlock } from "./productCardShared";
import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  HeadsetIcon,
  LockIcon,
  MapPinIcon,
  PersonIcon,
  RoadIcon,
  RupeeIcon,
  SeatIcon,
  ShieldIcon,
  SnowflakeIcon,
  TagIcon
} from "./icons";

const PinIcon = MapPinIcon;

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
  const imageSrc = resolveMediaUrl(cab.image) || FALLBACK_CAB_IMAGE;
  const features = Array.isArray(cab.features) ? cab.features : [];
  const hasAc = features.some((f) => /^(ac|a\/c|air\s*condition)/i.test(String(f).trim()));
  const amenityLabel = hasAc ? "AC" : features[0] ? String(features[0]) : "—";
  const dayHireLabel =
    day > 0 ? `Day hire ₹${day.toLocaleString("en-IN")}/day` : hourly > 0 ? `From ₹${hourly.toLocaleString("en-IN")}/hr` : null;
  const ratingText = formatRating(cab);
  const reviewCountRaw = cab.reviewCount ?? cab.reviews;
  const reviewCount =
    reviewCountRaw != null && Number.isFinite(Number(reviewCountRaw)) ? Number(reviewCountRaw) : null;

  const fareSlabs = useMemo(
    () => buildFareSlabs(cab),
    [cab._id, cab.hourlyRate, cab.dayRate, cab.price, cab.extraHourRate, cab.discountPercentage, cab.farePackages]
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

  const d = Math.min(99, Math.max(0, discount));

  const imageBadges = (
    <>
      <div className="absolute left-1.5 top-1.5 flex items-center gap-1">
        {d > 0 && (
          <span className="rounded-md bg-[#0056D2] px-1.5 py-0.5 text-[8px] font-bold text-white shadow">
            {d}% OFF
          </span>
        )}
        <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-white backdrop-blur">
          {cab.type || "Cab"}
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
      <ProductImageFrame src={imageSrc} alt={cab.title || "Cab"} badges={imageBadges} imageClassName="h-[200px] w-full object-contain p-2 sm:h-[220px]" />

      <ProductMetaBlock title={cab.title} vendor={cab.vendor}>
        <MetaPill icon={<SeatIcon className="h-2.5 w-2.5" />} label={`${cab.seats ?? "4"} Seats`} />
        <MetaPill icon={<SnowflakeIcon className="h-2.5 w-2.5" />} label={amenityLabel} />
        <MetaPill icon={<PersonIcon className="h-2.5 w-2.5" />} label="Driver Included" />
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
          <ChargesGrid extraKmRate={extraKmRate} extraHour={extraHour} nightCharge={nightCharge} />
        </div>

        <aside className="flex flex-col border-t border-slate-100 bg-slate-50/60 p-3 sm:p-4 lg:border-t-0">
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
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-[#0056D2]">
          {vendorInitials(vendor)}
        </span>
        <div>
          <p className="text-sm font-bold text-slate-900">{vendor}</p>
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


