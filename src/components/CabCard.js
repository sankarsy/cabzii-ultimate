"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { buildFareSlabs, formatRating, num, packageYouPay } from "../lib/cabFare";
import {
  CARD_ARTICLE_CLASS,
  CARD_BOOK_BTN_CLASS,
  MetaPill,
  PriceSummaryCard,
  ProductImageFrame,
  ProductMetaBlock
} from "./productCardShared";

const FALLBACK_CAB_IMAGE =
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80";

export default function CabCard({ cab, onBook, bookHref }) {
  const discount = num(cab.discountPercentage, 0);
  const basePrice = num(cab.price);

  const imageSrc =
    (cab.image && String(cab.image).trim()) || FALLBACK_CAB_IMAGE;

  const features = Array.isArray(cab.features) ? cab.features : [];

  const hasAc = features.some((f) =>
    /^(ac|a\/c|air\s*condition)/i.test(String(f).trim())
  );

  const amenityLabel = hasAc
    ? "AC"
    : features[0]
    ? String(features[0])
    : "—";

  const ratingText = formatRating(cab);
  const reviewCountRaw = cab.reviewCount ?? cab.reviews;
  const reviewCount =
    reviewCountRaw != null && Number.isFinite(Number(reviewCountRaw)) ? Number(reviewCountRaw) : null;

  const fareSlabs = useMemo(
    () => buildFareSlabs(cab),
    [cab._id, cab.hourlyRate, cab.dayRate, cab.price, cab.extraHourRate, cab.discountPercentage]
  );

  const localPackages = fareSlabs.filter((pkg) => pkg.group === "local");
  const outstationPackages = fareSlabs.filter((pkg) => pkg.group === "outstation");

  const [selectedPackageId, setSelectedPackageId] = useState("local_4hr");

  useEffect(() => {
    const preferred = fareSlabs.find((p) => p.id === "local_4hr") || fareSlabs[0];
    if (preferred) setSelectedPackageId(preferred.id);
  }, [fareSlabs]);

  const selectedPackage = fareSlabs.find((pkg) => pkg.id === selectedPackageId);

  const d = Math.min(99, Math.max(0, discount));

  const listPrice = selectedPackage ? num(selectedPackage.list) : basePrice;
  const finalPrice = packageYouPay(listPrice > 0 ? listPrice : basePrice, d);
  const originalPrice =
    listPrice > 0 ? listPrice : num(cab.originalPrice) > 0 ? num(cab.originalPrice) : basePrice;
  const savedAmount = Math.max(0, originalPrice - finalPrice);

  const extraKmCharge =
    selectedPackage?.extraKm ?? Math.max(12, Math.floor(basePrice / 10) || 12);
  const rawExtraHour = cab.extraHourRate;
  const extraHourCharge =
    selectedPackage?.extraHr ??
    (rawExtraHour != null && rawExtraHour !== "" && Number.isFinite(Number(rawExtraHour))
      ? num(rawExtraHour)
      : Math.max(12, Math.floor(basePrice / 12) || 12));
  const nightCharge =
    extraHourCharge > 0 ? Math.max(0, Math.round(extraHourCharge * 0.25)) : null;

  const BookAction = bookHref ? (
    <Link href={bookHref} className={CARD_BOOK_BTN_CLASS}>
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
          <span className="rounded-md bg-orange-500 px-1.5 py-0.5 text-[8px] font-bold text-white shadow">
            {d}% OFF
          </span>
        )}
        <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-white backdrop-blur">
          {cab.type || "Cab"}
        </span>
      </div>
      {ratingText && (
        <div className="absolute right-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-white px-1.5 py-0.5 text-[8px] font-semibold text-slate-700 shadow-sm">
          <StarIcon className="h-2.5 w-2.5 text-yellow-400" />
          {ratingText}
          {reviewCount != null ? <span className="text-slate-400">({reviewCount})</span> : null}
        </div>
      )}
    </>
  );

  const extraBadges = (
    <>
      {num(cab.driverAllowance) > 0 ? (
        <span className="rounded-full bg-white px-2 py-1 text-[9px] font-medium text-slate-600">
          Driver ₹{num(cab.driverAllowance)}
        </span>
      ) : null}
      {nightCharge != null && nightCharge > 0 ? (
        <span className="rounded-full bg-white px-2 py-1 text-[9px] font-medium text-slate-600">
          Night ₹{nightCharge}
        </span>
      ) : null}
      {cab.tollCharge ? (
        <span className="rounded-full bg-white px-2 py-1 text-[9px] font-medium text-slate-600">Toll Extra</span>
      ) : null}
      {cab.airportCharge ? (
        <span className="rounded-full bg-white px-2 py-1 text-[9px] font-medium text-slate-600">Airport Extra</span>
      ) : null}
    </>
  );

  return (
    <article className={CARD_ARTICLE_CLASS}>
      <ProductImageFrame src={imageSrc} alt={cab.title || "Cab"} badges={imageBadges} />

      <ProductMetaBlock title={cab.title} vendor={cab.vendor}>
        <MetaPill icon={<SeatIcon className="h-2.5 w-2.5" />} label={`${cab.seats ?? "4"} Seats`} />
        <MetaPill icon={<SnowflakeIcon className="h-2.5 w-2.5" />} label={amenityLabel} />
        <MetaPill icon={<PersonIcon className="h-2.5 w-2.5" />} label="Driver" />
      </ProductMetaBlock>

      <div className="flex flex-1 flex-col px-2.5 pb-2.5">

        {/* LOCAL PACKAGES */}

        {localPackages.length > 0 && (
          <>
            <div className="mt-1">
              <h4 className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                Local Packages
              </h4>
            </div>

            <div className="mt-1.5 flex flex-wrap gap-1.5">

              {localPackages.map((pkg) => {
                const isSelected =
                  selectedPackageId === pkg.id;

                return (
                  <button
                    key={pkg.id}
                    onClick={() =>
                      setSelectedPackageId(pkg.id)
                    }
                    className={`rounded-lg border px-2.5 py-1.5 text-center transition-all duration-200 ${
                      isSelected
                        ? "border-blue-600 bg-blue-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-blue-300"
                    }`}
                  >
                    <span className="text-[10px] font-bold text-slate-900">
                      {pkg.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* OUTSTATION PACKAGES */}

        {outstationPackages.length > 0 && (
          <>
            <div className="mt-3">
              <h4 className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                Outstation Packages
              </h4>
            </div>

            <div className="mt-1.5 flex flex-wrap gap-1.5">

              {outstationPackages.map((pkg) => {
                const isSelected =
                  selectedPackageId === pkg.id;

                return (
                  <button
                    key={pkg.id}
                    onClick={() =>
                      setSelectedPackageId(pkg.id)
                    }
                    className={`rounded-lg border px-2.5 py-1.5 text-center transition-all duration-200 ${
                      isSelected
                        ? "border-blue-600 bg-blue-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-blue-300"
                    }`}
                  >
                    <span className="text-[10px] font-bold text-slate-900">
                      {pkg.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* PRICE CARD */}

        {selectedPackage && (
          <PriceSummaryCard
            finalPrice={finalPrice}
            originalPrice={originalPrice}
            savedAmount={savedAmount}
            discountPct={d}
            extraKmCharge={extraKmCharge}
            extraHourCharge={extraHourCharge}
            extraBadges={extraBadges}
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

function SeatIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M7 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M5 13h4a3 3 0 0 1 3 3v3H5v-6zM12 16h6l1 3h-7" />
    </svg>
  );
}

function PersonIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="8" r="3" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

function SnowflakeIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 2v20M2 12h20" />
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

function ArrowRightIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}