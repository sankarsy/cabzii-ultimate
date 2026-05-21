"use client";

import Link from "next/link";
import { num, packageYouPay } from "../lib/cabFare";
import {
  CARD_ARTICLE_CLASS,
  CARD_BOOK_BTN_CLASS,
  MetaPill,
  PriceSummaryCard,
  ProductImageFrame,
  ProductMetaBlock
} from "./productCardShared";

const FALLBACK_TOUR_IMAGE =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=60";

export default function PackageCard({ pkg, actionText = "Book Now", onAction, actionHref }) {
  const discount = num(pkg.discountPercentage, 0);
  const basePrice = num(pkg.price);
  const originalPrice = num(pkg.originalPrice) > 0 ? num(pkg.originalPrice) : basePrice;
  const d = Math.min(99, Math.max(0, discount));
  const perPersonPay = packageYouPay(basePrice, d);
  const perPersonOriginal = originalPrice;
  const savedAmount = Math.max(0, perPersonOriginal - perPersonPay);
  const tagLabel = pkg.tag || (Array.isArray(pkg.tags) && pkg.tags[0] ? String(pkg.tags[0]) : "Tour");

  const imageSrc = (pkg.image && String(pkg.image).trim()) || FALLBACK_TOUR_IMAGE;

  const imageBadges = (
    <>
      <div className="absolute left-1.5 top-1.5 flex items-center gap-1">
        {d > 0 && (
          <span className="rounded-md bg-orange-500 px-1.5 py-0.5 text-[8px] font-bold text-white shadow">
            {d}% OFF
          </span>
        )}
        <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-white backdrop-blur">
          {tagLabel}
        </span>
      </div>
      {pkg.duration ? (
        <span className="absolute right-1.5 top-1.5 inline-flex items-center gap-0.5 rounded-full bg-white px-1.5 py-0.5 text-[8px] font-semibold text-slate-700 shadow-sm">
          <ClockIcon className="h-2.5 w-2.5 text-[#0056D2]" />
          {pkg.duration}
        </span>
      ) : null}
    </>
  );

  const BookAction = actionHref ? (
    <Link href={actionHref} className={CARD_BOOK_BTN_CLASS}>
      {actionText} <ArrowRightIcon className="h-3.5 w-3.5" />
    </Link>
  ) : (
    <button type="button" onClick={() => onAction?.(pkg)} className={CARD_BOOK_BTN_CLASS}>
      {actionText} <ArrowRightIcon className="h-3.5 w-3.5" />
    </button>
  );

  return (
    <article className={CARD_ARTICLE_CLASS}>
      <ProductImageFrame
        src={imageSrc}
        alt={pkg.name || "Tour"}
        badges={imageBadges}
        imageClassName="h-[185px] w-full object-cover object-center"
      />

      <ProductMetaBlock title={pkg.name} vendor={pkg.vendor} vendorFallback="Tour Partner">
        {pkg.duration ? (
          <MetaPill icon={<CalendarIcon className="h-2.5 w-2.5" />} label={pkg.duration} />
        ) : null}
        <MetaPill icon={<UsersIcon className="h-2.5 w-2.5" />} label="Per person pricing" />
        <MetaPill icon={<MapPinIcon className="h-2.5 w-2.5" />} label="Pickup on booking" />
      </ProductMetaBlock>

      <div className="flex flex-1 flex-col px-2.5 pb-2.5">
        {pkg.originNote ? (
          <div className="mb-1.5 flex items-start gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1">
            <AlertIcon className="mt-0.5 h-2.5 w-2.5 shrink-0 text-amber-500" />
            <p className="text-[9px] font-medium leading-tight text-amber-800">{pkg.originNote}</p>
          </div>
        ) : null}

        <PriceSummaryCard
          finalPrice={perPersonPay}
          originalPrice={perPersonOriginal}
          savedAmount={savedAmount}
          discountPct={d}
          priceSuffix="/person"
        />

        <div className="mt-2">{BookAction}</div>
      </div>
    </article>
  );
}

function ClockIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2.2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
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

function MapPinIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function UsersIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3 20a6 6 0 0 1 12 0M14 20a5 5 0 0 1 8 0" />
    </svg>
  );
}

function AlertIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

function ArrowRightIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
