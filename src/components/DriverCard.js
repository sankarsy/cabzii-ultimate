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
  PackagePill,
  PriceSummaryCard,
  ProductImageFrame,
  ProductMetaBlock
} from "./productCardShared";
import { ArrowRightIcon, BriefcaseIcon, CarIcon, RouteIcon, StarFilledIcon } from "./icons";

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

  const packageDiscount = selectedPackage?.discountPercentage ?? d;

  const listPrice = selectedPackage
    ? num(selectedPackage.originalPrice ?? selectedPackage.list)
    : 0;

  const finalPrice = selectedPackage?.price
    ? num(selectedPackage.price)
    : packageYouPay(listPrice > 0 ? listPrice : 1, packageDiscount);

  const originalPrice = listPrice > 0 ? listPrice : finalPrice;

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
          <span className="rounded-md bg-[#0056D2] px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
            {d}% OFF
          </span>
        )}

        <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
          {typeLabel}
        </span>
      </div>

      {/* {ratingText && (
        <div className="absolute right-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 shadow-sm">
          <StarFilledIcon className="h-2.5 w-2.5 text-amber-400" />

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

      <ProductMetaBlock title={displayName} vendor={displayVendor} vendorFallback="Cabzii Partner">
        <MetaPill icon={<BriefcaseIcon className="h-2.5 w-2.5" />} label={driver.experience ?? "Experienced"} />
        <MetaPill icon={<RouteIcon className="h-2.5 w-2.5" />} label={`${driver.trips ?? 0} trips`} />
        <MetaPill icon={<CarIcon className="h-2.5 w-2.5" />} label={vehicleLabel} />
      </ProductMetaBlock>

      <div className="flex flex-1 flex-col px-2.5 pb-2.5">
        {/* PACKAGE SECTION */}

        <div className="mt-2 flex items-start justify-between gap-2">
          {/* LOCAL PACKAGES */}

          {localPackages.length > 0 && (
            <div className="flex-1">
              <h4 className="mb-1 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                Local Packages
              </h4>

              <div className="flex w-full gap-1.5">
                {localPackages.map(
                  (pkg) => (
                    <PackagePill
                      key={pkg.id}
                      pkg={pkg}
                      selected={selectedPackageId === pkg.id}
                      onSelect={() => setSelectedPackageId(pkg.id)}
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
              <h4 className="mb-1 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                Outstation Packages
              </h4>

              <div className="flex w-full gap-1.5">
                {outstationPackages.map(
                  (pkg) => (
                    <PackagePill
                      key={pkg.id}
                      pkg={pkg}
                      selected={selectedPackageId === pkg.id}
                      onSelect={() => setSelectedPackageId(pkg.id)}
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
            extraKmCharge={extraKmCharge}
            extraHourCharge={extraHourCharge}
            extraBadges={
              nightCharge != null &&
              nightCharge > 0 ? (
                <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-slate-600">
                  Night ₹
                  {nightCharge}
                </span>
              ) : null
            }
          />
        )}

        {/* BOOK BUTTON */}

        <div className="mt-auto pt-2">
          {BookAction}
        </div>
      </div>
    </article>
  );
}
