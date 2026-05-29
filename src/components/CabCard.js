"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  buildFareSlabs,
  formatRating,
  num,
  packageYouPay
} from "../lib/cabFare";
import { resolveMediaUrl } from "../lib/media";
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

const FALLBACK_CAB_IMAGE =
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80";

export default function CabCard({ cab, onBook, bookHref }) {
  const discount = num(cab.discountPercentage, 0);
  const basePrice = num(cab.price);

  const imageSrc =
    resolveMediaUrl(cab.image) || FALLBACK_CAB_IMAGE;

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
      cab.farePackages
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

  const d = Math.min(
    99,
    Math.max(0, discount)
  );

  const packageDiscount = selectedPackage?.discountPercentage ?? d;

  const listPrice = selectedPackage
    ? num(selectedPackage.originalPrice ?? selectedPackage.list)
    : basePrice;

  const finalPrice = selectedPackage?.price
    ? num(selectedPackage.price)
    : packageYouPay(listPrice > 0 ? listPrice : basePrice, packageDiscount);

  const originalPrice =
    listPrice > 0
      ? listPrice
      : num(cab.originalPrice) > 0
      ? num(cab.originalPrice)
      : basePrice;

  const savedAmount = Math.max(
    0,
    originalPrice - finalPrice
  );

  const extraKmCharge =
    selectedPackage?.extraKm ??
    Math.max(
      12,
      Math.floor(basePrice / 10) || 12
    );

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
        {d > 0 && (
          <span className="rounded-md bg-[#0056D2] px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
            {d}% OFF
          </span>
        )}

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
        imageClassName="h-[185px] w-full object-cover object-top p-0"
      />

      <ProductMetaBlock title={cab.title} vendor={cab.vendor}>
        {cab.city || cab.location ? (
          <MetaPill label={`${cab.city || "City"}${cab.location ? ` · ${cab.location}` : ""}`} />
        ) : null}
        <MetaPill icon={<SeatIcon className="h-2.5 w-2.5" />} label={`${cab.seats ?? "4"} Seats`} />
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
            originalPrice={originalPrice}
            savedAmount={savedAmount}
            discountPct={packageDiscount}
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
