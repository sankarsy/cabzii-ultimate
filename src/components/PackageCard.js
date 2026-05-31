"use client";

import Link from "next/link";
import { resolveMediaUrl } from "../lib/media";
import { num, packageYouPay } from "../lib/cabFare";
import { categoryLabel } from "../lib/holidays";
import {
  CARD_ARTICLE_CLASS,
  CARD_BOOK_BTN_CLASS,
  MetaPill,
  PriceSummaryCard,
  ProductImageFrame,
  ProductMetaBlock
} from "./productCardShared";
import { AlertIcon, ArrowRightIcon, MapPinIcon } from "./icons";

const FALLBACK_TOUR_IMAGE =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=60";

export default function PackageCard({ pkg, actionText = "Book Now", onAction, actionHref }) {
  const discount = num(pkg.discountPercentage, 0);
  const basePrice = num(pkg.price);
  const originalPrice = num(pkg.originalPrice) > 0 ? num(pkg.originalPrice) : basePrice;
  const d = Math.min(99, Math.max(0, discount));
  const packagePay = packageYouPay(basePrice, d);
  const packageOriginal = originalPrice;
  const savedAmount = Math.max(0, packageOriginal - packagePay);
  const tagLabel = pkg.category
    ? categoryLabel(pkg.category)
    : pkg.tag || (Array.isArray(pkg.tags) && pkg.tags[0] ? String(pkg.tags[0]) : "Holiday");

  const imageSrc = resolveMediaUrl(pkg.image) || FALLBACK_TOUR_IMAGE;

  const imageBadges = (
    <div className="absolute left-1.5 top-1.5 flex items-center gap-1">
      {d > 0 && (
        <span className="rounded-md bg-[#0056D2] px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
          {d}% OFF
        </span>
      )}
      <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
        {tagLabel}
      </span>
    </div>
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
        {pkg.city ? <MetaPill icon={<MapPinIcon className="h-2.5 w-2.5" />} label={pkg.city} /> : null}
        <MetaPill label="Toll, permit & driver bata extra" />
      </ProductMetaBlock>

      <div className="flex flex-1 flex-col px-2.5 pb-2.5">
        {pkg.originNote ? (
          <div className="mb-1.5 flex items-start gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1">
            <AlertIcon className="mt-0.5 h-2.5 w-2.5 shrink-0 text-amber-500" />
            <p className="text-xs font-medium leading-tight text-amber-800">{pkg.originNote}</p>
          </div>
        ) : null}

        <PriceSummaryCard
          finalPrice={packagePay}
          originalPrice={packageOriginal}
          savedAmount={savedAmount}
          discountPct={d}
          priceSuffix=" onwards"
        />

        <div className="mt-auto pt-2">{BookAction}</div>
      </div>
    </article>
  );
}
