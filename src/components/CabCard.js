"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  buildFareSlabs,
  formatRating,
  num
} from "../lib/cabFare";
import {
  CARD_ARTICLE_CLASS,
  CARD_BOOK_BTN_CLASS,
  MetaPill,
  PackagePill,
  PriceSummaryCard,
  ProductImageFrame,
  ProductMetaBlock
} from "./productCardShared";
import { ArrowRightIcon, PersonIcon, SeatIcon, SnowflakeIcon, StarFilledIcon } from "./icons";

import { resolveCabImage } from "../lib/vehicleImages";
import { formatCabSeatPill } from "../lib/cabSeats";

export default function CabCard({ cab, onBook, bookHref }) {
  const basePrice = num(cab.price);

  const imageSrc = resolveCabImage(cab);

  const features = Array.isArray(cab.features)
    ? cab.features
    : [];

  const hasAc = features.some((f) =>
    /^(ac|a\/c|air\s*condition)/i.test(
      String(f).trim()
    )
  );

  const amenityLabel = hasAc
    ? "AC"
    : features[0]
    ? String(features[0])
    : "—";

  const ratingText = formatRating(cab);

  const reviewCountRaw =
    cab.reviewCount ?? cab.reviews;

  const reviewCount =
    reviewCountRaw != null &&
    Number.isFinite(Number(reviewCountRaw))
      ? Number(reviewCountRaw)
      : null;

  const fareSlabs = useMemo(
    () => buildFareSlabs(cab),
    [
      cab._id,
      cab.hourlyRate,
      cab.dayRate,
      cab.price,
      cab.extraHourRate,
      cab.discountPercentage,
      cab.farePackages,
      cab.packages
    ]
  );

  const localPackages = fareSlabs.filter(
    (pkg) => pkg.group === "local"
  );

  const outstationPackages = fareSlabs.filter(
    (pkg) => pkg.group === "outstation"
  );

  const [selectedPackageId, setSelectedPackageId] =
    useState("local_4hr");

  useEffect(() => {
    const preferred =
      fareSlabs.find(
        (p) => p.id === "local_4hr"
      ) || fareSlabs[0];

    if (preferred) {
      setSelectedPackageId(preferred.id);
    }
  }, [fareSlabs]);

  const selectedPackage = fareSlabs.find(
    (pkg) => pkg.id === selectedPackageId
  );

  const listPrice = selectedPackage
    ? num(selectedPackage.price ?? selectedPackage.originalPrice ?? selectedPackage.list)
    : basePrice;

  const finalPrice = listPrice;

  const extraKmCharge =
    selectedPackage?.extraKm ??
    (num(cab.pricePerKm) > 0 ? num(cab.pricePerKm) : Math.max(12, Math.floor(basePrice / 10) || 12));

  const rawExtraHour = cab.extraHourRate;

  const extraHourCharge =
    selectedPackage?.extraHr ??
    (rawExtraHour != null &&
    rawExtraHour !== "" &&
    Number.isFinite(Number(rawExtraHour))
      ? num(rawExtraHour)
      : Math.max(
          12,
          Math.floor(basePrice / 12) || 12
        ));

  const nightCharge =
    extraHourCharge > 0
      ? Math.max(
          0,
          Math.round(
            extraHourCharge * 0.25
          )
        )
      : null;

  const BookAction = bookHref ? (
    <Link
      href={bookHref}
      className={CARD_BOOK_BTN_CLASS}
    >
      Book Now
      <ArrowRightIcon className="h-4 w-4" />
    </Link>
  ) : (
    <button
      type="button"
      onClick={() => onBook?.(cab)}
      className={CARD_BOOK_BTN_CLASS}
    >
      Book Now
      <ArrowRightIcon className="h-4 w-4" />
    </button>
  );

  const imageBadges = (
    <>
      <div className="absolute left-1.5 top-1.5 flex items-center gap-1">
        <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
          {cab.type || "Cab"}
        </span>
      </div>

      {ratingText && (
        <div className="absolute right-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 shadow-sm">
          <StarFilledIcon className="h-2.5 w-2.5 text-yellow-400" />

          {ratingText}

          {reviewCount != null ? (
            <span className="text-slate-400">
              ({reviewCount})
            </span>
          ) : null}
        </div>
      )}
    </>
  );

  const extraBadges = (
    <>
      {num(cab.driverAllowance) > 0 ? (
        <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-slate-600">
          Driver ₹{num(cab.driverAllowance)}
        </span>
      ) : null}

      {nightCharge != null &&
      nightCharge > 0 ? (
        <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-slate-600">
          Night ₹{nightCharge}
        </span>
      ) : null}

      {cab.tollCharge ? (
        <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-slate-600">
          Toll Extra
        </span>
      ) : null}

      {cab.airportCharge ? (
        <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-slate-600">
          Airport Extra
        </span>
      ) : null}
    </>
  );

  return (
    <article className={CARD_ARTICLE_CLASS}>
      <ProductImageFrame
        src={imageSrc}
        alt={cab.title || "Cab"}
        badges={imageBadges}
        imageClassName="h-[100px] w-full object-cover object-top p-0 sm:h-[118px] md:h-[110px]"
      />

      <ProductMetaBlock title={cab.title} vendor={cab.vendor}>
        {cab.city || cab.location ? (
          <MetaPill label={`${cab.city || "City"}${cab.location ? ` · ${cab.location}` : ""}`} />
        ) : null}
        <MetaPill icon={<SeatIcon className="h-2.5 w-2.5" />} label={formatCabSeatPill(cab)} />
        <MetaPill icon={<SnowflakeIcon className="h-2.5 w-2.5" />} label={amenityLabel} />
        <MetaPill icon={<PersonIcon className="h-2.5 w-2.5" />} label="Driver" />
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
                {localPackages.map((pkg) => (
                  <PackagePill
                    key={pkg.id}
                    pkg={pkg}
                    selected={selectedPackageId === pkg.id}
                    onSelect={() => setSelectedPackageId(pkg.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* OUTSTATION PACKAGES */}

          {outstationPackages.length > 0 && (
            <div className="flex-1">
              <h4 className="mb-1 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                Outstation Packages
              </h4>

              <div className="flex w-full gap-1.5">
                {outstationPackages.map((pkg) => (
                  <PackagePill
                    key={pkg.id}
                    pkg={pkg}
                    selected={selectedPackageId === pkg.id}
                    onSelect={() => setSelectedPackageId(pkg.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PRICE CARD */}

        {selectedPackage && (
          <PriceSummaryCard
            finalPrice={finalPrice}
            extraKmCharge={extraKmCharge}
            extraHourCharge={extraHourCharge}
            extraBadges={extraBadges}
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
