"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import type { CarRentalCardProps, Package, PackageId } from "./types";

const DEFAULT_PACKAGES: Package[] = [
  { id: "local_4hr", label: "4 hrs / 40 kms", originalPrice: 1200, discountPct: 22, tripType: "local" },
  { id: "local_8hr", label: "8 hrs / 80 kms", originalPrice: 2400, discountPct: 22, tripType: "local" },
  { id: "out_oneway", label: "one way", subLabel: "min 250 kms", originalPrice: 3250, discountPct: 22, tripType: "outstation" },
  { id: "out_twoway", label: "two way", subLabel: "min 250 kms", originalPrice: 6500, discountPct: 22, tripType: "outstation" }
];

const formatRupee = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;
const discountedPrice = (pkg: Package) => Math.round(pkg.originalPrice * (1 - pkg.discountPct / 100));

export default function CarRentalCard({
  carName = "swift dzire",
  carType = "sedan",
  location = "chennai",
  rating = 4.8,
  seating = "4+1",
  driverBatta = 600,
  extraKmRate = 13,
  extraHrRate = 220,
  onBook
}: CarRentalCardProps) {
  const [selectedLocal, setSelectedLocal] = useState<PackageId>("local_8hr");
  const [selectedOutstation, setSelectedOutstation] = useState<PackageId>("out_twoway");
  const [lastTouchedGroup, setLastTouchedGroup] = useState<"local" | "outstation">("outstation");

  const localPackages = useMemo(() => DEFAULT_PACKAGES.filter((pkg) => pkg.tripType === "local"), []);
  const outstationPackages = useMemo(() => DEFAULT_PACKAGES.filter((pkg) => pkg.tripType === "outstation"), []);

  const selectedLocalPkg = useMemo(() => DEFAULT_PACKAGES.find((pkg) => pkg.id === selectedLocal) ?? DEFAULT_PACKAGES[0], [selectedLocal]);
  const selectedOutstationPkg = useMemo(
    () => DEFAULT_PACKAGES.find((pkg) => pkg.id === selectedOutstation) ?? DEFAULT_PACKAGES[2],
    [selectedOutstation]
  );

  const activeBookPkg = lastTouchedGroup === "local" ? selectedLocalPkg : selectedOutstationPkg;

  const selectPackage = (pkg: Package) => {
    if (pkg.tripType === "local") {
      setSelectedLocal(pkg.id);
      setLastTouchedGroup("local");
      return;
    }

    setSelectedOutstation(pkg.id);
    setLastTouchedGroup("outstation");
  };

  const onPackageKeyDown = (event: KeyboardEvent<HTMLDivElement>, pkg: Package) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectPackage(pkg);
    }
  };

  const handleBook = () => {
    onBook?.(activeBookPkg);
  };

  return (
    <article className="rounded-2xl border border-[#2f2f2f] bg-[#1b1b1b] p-6 text-[#ececec] shadow-[0_16px_40px_-24px_rgba(0,0,0,0.9)]">
      <div className="mb-4 flex items-start justify-between">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#3a3a3a] bg-[#242424] px-3 py-1 text-sm font-semibold text-[#d5d5d5]">
            <CarIcon />
            {carType}
          </span>
          <h2 className="text-5xl font-extrabold capitalize leading-none text-white">{carName}</h2>
          <p className="text-[2.15rem] font-semibold leading-none text-[#1f77da]">car rental</p>
          <p className="inline-flex items-center gap-1 text-xl text-[#d0d0d0]">
            <PinIcon />
            {location}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-[1.7rem] text-[#d4d4d4]">
            <span>{seating} seating</span>
            <span className="inline-flex items-center gap-1 text-[#f7d14d]">
              <StarIcon />
              <span className="text-[#d4d4d4]">{rating} rating</span>
            </span>
            <span>ac comfort</span>
            <span>driver batta {formatRupee(driverBatta)}/day</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#d7f8e8] px-4 py-1.5 text-sm font-bold text-[#0a7a4a]">{activeBookPkg.discountPct}% off</span>
          <button type="button" className="rounded-xl bg-[#2f2f2f] p-2 text-[#d7d7d7]" aria-label="More options">
            <DotsIcon />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <section className="space-y-4 rounded-xl border border-[#3a3a3a] bg-[#2b2b2b] p-4">
          <div>
            <h3 className="text-2xl font-bold text-white">local package</h3>
            <p className="text-sm text-[#c3c3c3]">choose your ideal time & km</p>
          </div>

          <div className="space-y-2" role="radiogroup" aria-label="Local packages">
            {localPackages.map((pkg) => (
              <PackageRow
                key={pkg.id}
                pkg={pkg}
                isSelected={selectedLocal === pkg.id}
                onSelect={selectPackage}
                onKeyDown={onPackageKeyDown}
              />
            ))}
          </div>

          <div className="rounded-lg bg-[#212121] px-3 py-2 text-sm font-semibold text-[#d4d4d4]">
            extra km {formatRupee(extraKmRate)}/km &nbsp; · &nbsp; extra hr {formatRupee(extraHrRate)}/hr
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-[#3a3a3a] bg-[#2b2b2b] p-4">
          <div>
            <h3 className="text-2xl font-extrabold capitalize text-white">outstation</h3>
            <p className="text-sm text-[#c3c3c3]">minimum 250 kms applicable</p>
          </div>

          <div className="space-y-2" role="radiogroup" aria-label="Outstation packages">
            {outstationPackages.map((pkg) => (
              <PackageRow
                key={pkg.id}
                pkg={pkg}
                isSelected={selectedOutstation === pkg.id}
                onSelect={selectPackage}
                onKeyDown={onPackageKeyDown}
              />
            ))}
          </div>

          <div className="rounded-lg bg-[#212121] px-3 py-2 text-sm font-semibold text-[#d4d4d4]">
            extra km {formatRupee(extraKmRate)}/km &nbsp; · &nbsp; extra hr {formatRupee(extraHrRate)}/hr
          </div>
        </section>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-xl bg-[#222222] p-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-sm text-[#d3d3d3]">
          <span className="inline-flex items-center gap-1">
            <ShieldIcon />
            safe & reliable
          </span>
          <span className="inline-flex items-center gap-1">
            <CancelIcon />
            free cancellation (up to 12 hrs)
          </span>
          <span className="inline-flex items-center gap-1">
            <SupportIcon />
            24x7 support
          </span>
          <span className="inline-flex items-center gap-1">
            <UserIcon />
            driver allowance {formatRupee(driverBatta)}/day
          </span>
        </div>

        <button
          type="button"
          onClick={handleBook}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#185FA5] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#144f8a]"
          aria-label={`Book now for ${activeBookPkg.label} at ${formatRupee(discountedPrice(activeBookPkg))}`}
        >
          book now
          <ArrowIcon />
        </button>
      </div>

      <p className="mt-3 text-xs text-[#9f9f9f]">
        note: outstation minimum 250 kms applicable. toll, parking & state tax extra as per actuals.
      </p>
    </article>
  );
}

interface PackageRowProps {
  pkg: Package;
  isSelected: boolean;
  onSelect: (pkg: Package) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>, pkg: Package) => void;
}

function PackageRow({ pkg, isSelected, onSelect, onKeyDown }: PackageRowProps) {
  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={() => onSelect(pkg)}
      onKeyDown={(event) => onKeyDown(event, pkg)}
      className={`cursor-pointer rounded-xl p-3 transition hover:bg-[#323232] ${
        isSelected ? "border-2 border-[#185FA5] bg-[#2d333d]" : "border border-[#464646] bg-[#2f2f2f]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <span
            className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border ${
              isSelected ? "border-[#185FA5]" : "border-[#666]"
            }`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${isSelected ? "bg-[#185FA5]" : "bg-transparent"}`} />
          </span>
          <div>
            <p className="text-sm font-bold text-[#efefef]">{pkg.label}</p>
            {pkg.subLabel ? <p className="text-xs text-[#b9b9b9]">{pkg.subLabel}</p> : null}
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-[#9f9f9f] line-through">{formatRupee(pkg.originalPrice)}</p>
          <span
            className="inline-flex rounded-full bg-[#e6f9f0] px-2 py-0.5 text-xs font-semibold text-[#0a7a4a]"
            aria-label={`${pkg.discountPct} percent off`}
          >
            {pkg.discountPct}% off
          </span>
          <p className="mt-1 text-2xl font-extrabold text-white">{formatRupee(discountedPrice(pkg))}</p>
        </div>
      </div>
    </div>
  );
}

function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11" />
      <path d="M3 11h18v6a1 1 0 0 1-1 1h-1M3 11v6a1 1 0 0 0 1 1h1" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s7-5.8 7-11a7 7 0 1 0-14 0c0 5.2 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-yellow-500" fill="currentColor">
      <path d="M12 2l2.8 5.7L21 8.6l-4.5 4.3 1.1 6.1L12 16l-5.6 3 1.1-6.1L3 8.6l6.2-.9L12 2z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#185FA5]" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z" />
    </svg>
  );
}

function CancelIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#185FA5]" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#185FA5]" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 13a8 8 0 1 1 16 0v5h-3v-4h-2v6h3a2 2 0 0 0 2-2v-5" />
      <path d="M4 18a2 2 0 0 0 2 2h3v-6H7v4H4z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#185FA5]" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="3" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}
