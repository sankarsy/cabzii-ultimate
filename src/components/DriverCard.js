"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { resolveMediaUrl } from "../lib/media";
import { num, packageYouPay } from "../lib/cabFare";
import {
  buildDriverFareSlabs,
  formatDriverRating,
  getDriverPricing,
  isOutstationDriver
} from "../lib/driverFare";

import {
  CARD_ARTICLE_CLASS,
  CARD_BOOK_BTN_CLASS,
  MetaPill,
  PriceSummaryCard,
  ProductImageFrame,
  ProductMetaBlock
} from "./productCardShared";

const FALLBACK_DRIVER_IMAGE =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80";

export default function DriverCard({
  driver,
  onBook,
  bookHref
}) {
  const discount = num(
    driver.discountPercentage,
    0
  );

  const imageSrc =
    resolveMediaUrl(driver.image) ||
    FALLBACK_DRIVER_IMAGE;

  const ratingText =
    formatDriverRating(driver);

  const reviewCountRaw =
    driver.reviewCount ?? driver.reviews;

  const reviewCount =
    reviewCountRaw != null &&
    Number.isFinite(
      Number(reviewCountRaw)
    )
      ? Number(reviewCountRaw)
      : null;

  const typeLabel = driver.type
    ? String(driver.type).replace(
        /\b\w/g,
        (c) => c.toUpperCase()
      )
    : isOutstationDriver(driver)
    ? "Outstation"
    : "Driver";

  const vehicles = Array.isArray(
    driver.supportedVehicles
  )
    ? driver.supportedVehicles
    : [];

  const vehicleLabel = vehicles[0]
    ? String(vehicles[0])
    : "All vehicles";

  const displayName =
    driver.serviceTitle ||
    driver.name ||
    "Driver";

  const displayVendor =
    driver.vendor ||
    driver.serviceSubtitle ||
    "Cabzii Partner";

  const fareSlabs = useMemo(
    () => buildDriverFareSlabs(driver),
    [
      driver._id,
      driver.pricing,
      driver.type
    ]
  );

  const {
    extraKm,
    extraHr,
    nightCharge
  } = useMemo(
    () => getDriverPricing(driver),
    [driver]
  );

  const defaultTab =
    isOutstationDriver(driver)
      ? "outstation"
      : "local";

  const defaultPkg =
    defaultTab === "outstation"
      ? "outstation_12hr"
      : "local_4hr";

  const [
    selectedPackageId,
    setSelectedPackageId
  ] = useState(defaultPkg);

  useEffect(() => {
    const preferred =
      fareSlabs.find(
        (p) => p.id === defaultPkg
      ) || fareSlabs[0];

    if (preferred) {
      setSelectedPackageId(
        preferred.id
      );
    }
  }, [fareSlabs, defaultPkg]);

  const localPackages =
    fareSlabs.filter(
      (pkg) => pkg.group === "local"
    );

  const outstationPackages =
    fareSlabs.filter(
      (pkg) =>
        pkg.group === "outstation"
    );

  const selectedPackage =
    fareSlabs.find(
      (pkg) =>
        pkg.id === selectedPackageId
    );

  const d = Math.min(
    99,
    Math.max(0, discount)
  );

  const listPrice = selectedPackage
    ? num(selectedPackage.list)
    : 0;

  const finalPrice = packageYouPay(
    listPrice > 0 ? listPrice : 1,
    d
  );

  const originalPrice =
    listPrice > 0
      ? listPrice
      : finalPrice;

  const savedAmount = Math.max(
    0,
    originalPrice - finalPrice
  );

  const extraKmCharge =
    selectedPackage?.extraKm ??
    extraKm;

  const extraHourCharge =
    selectedPackage?.extraHr ??
    extraHr;

  const driverPk = String(
    driver._id ?? driver.id ?? ""
  );

  const detailHref =
    bookHref ??
    (driverPk
      ? `/drivers/${driverPk}`
      : undefined);

  const BookAction = detailHref ? (
    <Link
      href={detailHref}
      className={CARD_BOOK_BTN_CLASS}
    >
      Book Now
      <ArrowRightIcon className="h-3.5 w-3.5" />
    </Link>
  ) : (
    <button
      type="button"
      onClick={() => onBook?.(driver)}
      className={CARD_BOOK_BTN_CLASS}
    >
      Book Now
      <ArrowRightIcon className="h-3.5 w-3.5" />
    </button>
  );

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

      {/* {ratingText && (
        <div className="absolute right-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-white px-1.5 py-0.5 text-[8px] font-semibold text-slate-700 shadow-sm">
          <StarIcon className="h-2.5 w-2.5 text-amber-400" />

          {ratingText}

          {reviewCount != null ? (
            <span className="text-slate-400">
              ({reviewCount})
            </span>
          ) : null}
        </div>
      )} */}
    </>
  );

  return (
    <article className={CARD_ARTICLE_CLASS}>
      <ProductImageFrame
        src={imageSrc}
        alt={displayName}
        badges={imageBadges}
        imageClassName="h-[185px] w-full object-cover object-top p-0"
      />

      <ProductMetaBlock
        title={displayName}
        vendor={displayVendor}
        vendorFallback="Cabzii Partner"
      >
        <MetaPill
          icon={
            <BriefcaseIcon className="h-2.5 w-2.5" />
          }
          label={
            driver.experience ??
            "Experienced"
          }
        />

        <MetaPill
          icon={
            <RouteIcon className="h-2.5 w-2.5" />
          }
          label={`${
            driver.trips ?? 0
          } trips`}
        />

        <MetaPill
          icon={
            <CarIcon className="h-2.5 w-2.5" />
          }
          label={vehicleLabel}
        />
      </ProductMetaBlock>

      <div className="flex flex-1 flex-col px-2.5 pb-2.5">
        {/* PACKAGE SECTION */}

        <div className="mt-2 flex items-start justify-between gap-2">
          {/* LOCAL PACKAGES */}

          {localPackages.length > 0 && (
            <div className="flex-1">
              <h4 className="mb-1 text-center text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                Local Packages
              </h4>

              <div className="flex justify-center gap-1.5">
                {localPackages.map(
                  (pkg) => (
                    <PackagePill
                      key={pkg.id}
                      pkg={pkg}
                      selected={
                        selectedPackageId ===
                        pkg.id
                      }
                      onSelect={() =>
                        setSelectedPackageId(
                          pkg.id
                        )
                      }
                    />
                  )
                )}
              </div>
            </div>
          )}

          {/* OUTSTATION PACKAGES */}

          {outstationPackages.length >
            0 && (
            <div className="flex-1">
              <h4 className="mb-1 text-center text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                Outstation Packages
              </h4>

              <div className="flex justify-center gap-1.5">
                {outstationPackages.map(
                  (pkg) => (
                    <PackagePill
                      key={pkg.id}
                      pkg={pkg}
                      selected={
                        selectedPackageId ===
                        pkg.id
                      }
                      onSelect={() =>
                        setSelectedPackageId(
                          pkg.id
                        )
                      }
                    />
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* PRICE CARD */}

        {selectedPackage && (
          <PriceSummaryCard
            finalPrice={finalPrice}
            originalPrice={originalPrice}
            savedAmount={savedAmount}
            discountPct={d}
            extraKmCharge={
              extraKmCharge
            }
            extraHourCharge={
              extraHourCharge
            }
            extraBadges={
              nightCharge != null &&
              nightCharge > 0 ? (
                <span className="rounded-full bg-white px-2 py-1 text-[9px] font-medium text-slate-600">
                  Night ₹
                  {nightCharge}
                </span>
              ) : null
            }
          />
        )}

        {/* BOOK BUTTON */}

        <div className="mt-2">
          {BookAction}
        </div>
      </div>
    </article>
  );
}

function PackagePill({
  pkg,
  selected,
  onSelect
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-xl border px-3 py-1.5 text-center transition-all duration-200 ${
        selected
          ? "border-blue-600 bg-blue-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-blue-300"
      }`}
    >
      <span className="text-[10px] font-bold text-slate-900">
        {pkg.label}
      </span>
    </button>
  );
}

function BriefcaseIcon({
  className
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="3"
        y="7"
        width="18"
        height="13"
        rx="2"
      />
      <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" />
      <path d="M3 12h18" />
    </svg>
  );
}

function RouteIcon({
  className
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle
        cx="6"
        cy="18"
        r="2"
      />
      <circle
        cx="18"
        cy="6"
        r="2"
      />
      <path d="M8 18h3a5 5 0 0 0 5-5V8" />
    </svg>
  );
}

function CarIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 11l1.5-4A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 2L19 11" />
      <path d="M3 11h18v5a1 1 0 0 1-1 1h-1" />
      <path d="M3 11v5a1 1 0 0 0 1 1h1" />
      <circle
        cx="7.5"
        cy="17"
        r="1.5"
      />
      <circle
        cx="16.5"
        cy="17"
        r="1.5"
      />
    </svg>
  );
}

function StarIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function ArrowRightIcon({
  className
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}