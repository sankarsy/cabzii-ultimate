"use client";

import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import PackageOptionCard from "./PackageOptionCard";
import AdditionalChargesGrid from "./AdditionalChargesGrid";
import {
  buildCabChargeItems,
  buildFareSlabs,
  formatRating,
  num,
  selectionFromPackage,
  vendorInitials
} from "../lib/cabFare";
import { formatInrCurrency } from "../lib/formatInr";
import { formatCabSeatPill } from "../lib/cabSeats";
import { MetaPill, ProductImageFrame, ProductMetaBlock } from "./productCardShared";
import {
  CalendarIcon,
  CheckIcon,
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

import { resolveCabImage } from "../lib/vehicleImages";

export default function CabBookingDetail({ cab, onSelectionChange, hideHeroImage = false }) {
  const price = num(cab.price);
  const day = num(cab.dayRate);
  const hourly = num(cab.hourlyRate);
  const rawExtra = cab.extraHourRate;
  const fareSlabs = useMemo(
    () => buildFareSlabs(cab),
    [cab._id, cab.hourlyRate, cab.dayRate, cab.price, cab.extraHourRate, cab.discountPercentage, cab.farePackages, cab.packages]
  );
  const extraKmRate =
    num(cab.pricePerKm) > 0
      ? num(cab.pricePerKm)
      : num(fareSlabs.find((p) => num(p.extraKm) > 0)?.extraKm) || Math.max(12, Math.floor(price / 10) || 12);
  const extraHour =
    rawExtra != null && rawExtra !== "" && Number.isFinite(Number(rawExtra)) && num(rawExtra) > 0
      ? num(rawExtra)
      : num(fareSlabs.find((p) => num(p.extraHr) > 0)?.extraHr) || 0;
  const nightCharge = extraHour > 0 ? Math.max(0, Math.round(extraHour * 0.25)) : null;
  const chargeItems = useMemo(
    () => buildCabChargeItems(cab, { extraKm: extraKmRate, extraHr: extraHour, nightCharge }),
    [cab, extraKmRate, extraHour, nightCharge]
  );
  const imageSrc = resolveCabImage(cab);
  const features = Array.isArray(cab.features) ? cab.features : [];
  const hasAc = features.some((f) => /^(ac|a\/c|air\s*condition)/i.test(String(f).trim()));
  const amenityLabel = hasAc ? "AC" : features[0] ? String(features[0]) : "—";
  const dayHireLabel =
    day > 0 ? `Day hire ${formatInrCurrency(day)}/day` : hourly > 0 ? `From ${formatInrCurrency(hourly)}/hr` : null;
  const ratingText = formatRating(cab);
  const reviewCountRaw = cab.reviewCount ?? cab.reviews;
  const reviewCount =
    reviewCountRaw != null && Number.isFinite(Number(reviewCountRaw)) ? Number(reviewCountRaw) : null;

  const [selectedPackageId, setSelectedPackageId] = useState(fareSlabs[0]?.id || "local_4hr");
  const [serviceTab, setServiceTab] = useState(fareSlabs[0]?.group || "local");

  const visiblePackages = fareSlabs.filter((pkg) => pkg.group === serviceTab);
  const emitSelection = (pkg, tab) => {
    if (!pkg || !onSelectionChange) return;
    onSelectionChange(selectionFromPackage(pkg, tab, cab));
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
        <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-white backdrop-blur">
          {cab.type || "Cab"}
        </span>
      </div>
      {ratingText && (
        <div className="absolute right-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-white px-1.5 py-0.5 text-[8px] font-semibold text-slate-700 shadow-sm">
          <Star className="h-2 w-2 fill-amber-400 text-amber-400" strokeWidth={0} aria-hidden /> {ratingText}
          {reviewCount != null ? <span className="text-slate-400"> ({reviewCount})</span> : null}
        </div>
      )}
    </>
  );

  return (
    <article className={`overflow-hidden border border-slate-200 bg-white ${hideHeroImage ? "rounded-xl shadow-sm" : "rounded-[18px] shadow-lg"}`}>
      {!hideHeroImage ? (
        <ProductImageFrame src={imageSrc} alt={cab.title || "Cab"} badges={imageBadges} imageClassName="h-[200px] w-full object-contain p-2 sm:h-[220px]" />
      ) : null}

      {!hideHeroImage ? (
        <ProductMetaBlock title={cab.title} vendor={cab.vendor}>
          <MetaPill icon={<SeatIcon className="h-2.5 w-2.5" />} label={formatCabSeatPill(cab)} />
          <MetaPill icon={<SnowflakeIcon className="h-2.5 w-2.5" />} label={amenityLabel} />
          <MetaPill icon={<PersonIcon className="h-2.5 w-2.5" />} label="Driver Included" />
          {dayHireLabel ? <MetaPill icon={<RupeeIcon className="h-2.5 w-2.5" />} label={dayHireLabel} /> : null}
        </ProductMetaBlock>
      ) : null}

      <div className={hideHeroImage ? "" : "lg:grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px]"}>
        <div className={`border-t border-slate-100 ${hideHeroImage ? "p-2.5 sm:p-3" : "p-3 sm:p-4 lg:border-r"}`}>
          <ServiceToggle serviceTab={serviceTab} setServiceTab={handleServiceTab} />
          <PackageSection
            visiblePackages={visiblePackages}
            selectedPackageId={selectedPackageId}
            onSelectPackage={handleSelectPackage}
          />
          <ChargesGrid items={chargeItems} compact />
        </div>

        {hideHeroImage ? null : (
          <aside className="flex flex-col border-t border-slate-100 bg-slate-50/60 p-3 sm:p-4 lg:border-t-0">
            <VendorBox vendor={cab.vendor} />
            <TrustGrid />
            <p className="mt-auto flex items-center justify-center gap-1 pt-2 text-[9px] text-slate-500 sm:pt-3 sm:text-[10px]">
              <LockIcon className="h-3 w-3 text-slate-400 sm:h-3.5 sm:w-3.5" />
              100% Safe & Secure Payments
            </p>
          </aside>
        )}
      </div>
    </article>
  );
}

function ServiceToggle({ serviceTab, setServiceTab }) {
  return (
    <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-0.5">
      <button
        type="button"
        onClick={() => setServiceTab("local")}
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition sm:px-3.5 sm:py-1.5 sm:text-xs ${
          serviceTab === "local" ? "bg-[#0056D2] text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
        }`}
      >
        <PinIcon className="h-3 w-3 text-current sm:h-3.5 sm:w-3.5" />
        Local
      </button>
      <button
        type="button"
        onClick={() => setServiceTab("outstation")}
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition sm:px-3.5 sm:py-1.5 sm:text-xs ${
          serviceTab === "outstation" ? "bg-[#0056D2] text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
        }`}
      >
        <RoadIcon className="h-3 w-3 text-current sm:h-3.5 sm:w-3.5" />
        Outstation
      </button>
    </div>
  );
}

function PackageSection({ visiblePackages, selectedPackageId, onSelectPackage }) {
  const few = visiblePackages.length <= 2;

  return (
    <div className="mt-2.5 sm:mt-3">
      {/* ≤2 packages: always 2-up grid so both fit on one mobile screen */}
      <div
        className={
          few
            ? "grid grid-cols-2 gap-2 pt-2"
            : "scroll-x-touch -mx-1 flex gap-2 overflow-x-auto px-1 pb-1.5 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-2.5 sm:overflow-visible sm:px-0 sm:pb-0 sm:pt-1 [&::-webkit-scrollbar]:hidden"
        }
      >
        {visiblePackages.map((pkg) => (
          <div
            key={pkg.id}
            className={few ? "min-w-0" : "flex w-[min(9.5rem,calc(50%-0.35rem))] max-w-[9.5rem] shrink-0 snap-start sm:w-auto sm:max-w-none sm:min-w-0"}
          >
            <PackageOptionCard
              pkg={pkg}
              selected={selectedPackageId === pkg.id}
              compact
              onSelect={() => onSelectPackage(pkg)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ChargesGrid({ items, compact = false }) {
  return <AdditionalChargesGrid items={items} compact={compact} />;
}

function VendorBox({ vendor, compact = false }) {
  return (
    <div className={`rounded-lg border border-slate-100 bg-white shadow-sm ${compact ? "mt-2 p-2" : "mt-3 p-3"}`}>
      <div className="flex items-center gap-2">
        <span
          className={`flex items-center justify-center rounded-full bg-slate-100 font-bold text-sky-500 ${
            compact ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm"
          }`}
        >
          {vendorInitials(vendor)}
        </span>
        <div>
          <p className={`font-bold text-slate-900 ${compact ? "text-xs" : "text-sm"}`}>{vendor}</p>
          <p className={`mt-0.5 flex items-center gap-1 font-medium text-slate-600 ${compact ? "text-[10px]" : "text-xs"}`}>
            <CheckIcon className="h-3 w-3 text-emerald-400" />
            Verified Vendor
          </p>
        </div>
      </div>
      {!compact ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {["Trusted & Verified", "Professional Drivers", "100% Safe & Secure"].map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-600">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function TrustGrid({ compact = false }) {
  const items = [
    { label: "Secure Booking", sub: "Your safety our priority", icon: ShieldIcon },
    { label: "Transparent Pricing", sub: "No hidden charges", icon: TagIcon },
    { label: "24/7 Support", sub: "Always here to help", icon: HeadsetIcon },
    { label: "Easy Cancellation", sub: "Flexible policies", icon: CalendarIcon }
  ];
  return (
    <div className={`grid grid-cols-2 ${compact ? "mt-2 gap-1.5" : "mt-4 gap-2"}`}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className={`rounded-lg bg-white text-center shadow-sm ${compact ? "px-1.5 py-1.5" : "px-2 py-2"}`}>
            <Icon className={`mx-auto text-sky-400 ${compact ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
            <p className={`mt-0.5 font-bold text-slate-800 ${compact ? "text-[9px]" : "text-[10px]"}`}>{item.label}</p>
            {!compact ? <p className="text-[9px] text-slate-500">{item.sub}</p> : null}
          </div>
        );
      })}
    </div>
  );
}


