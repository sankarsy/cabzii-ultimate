"use client";

import Link from "next/link";
import { resolveMediaUrl } from "../lib/media";
import { num, packageYouPay } from "../lib/cabFare";
import { categoryLabel } from "../lib/holidays";
import { optimizeImageUrl } from "../lib/imageOptimize";
import { AlertIcon, ArrowRightIcon, MapPinIcon, CheckIcon } from "./icons";

const FALLBACK_TOUR_IMAGE =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=60";

export default function PackageCard({ pkg, actionText = "Book Now", onAction, actionHref }) {
  const discount = num(pkg.discountPercentage, 0);
  const basePrice = num(pkg.price);
  const originalPrice = num(pkg.originalPrice) > 0 ? num(pkg.originalPrice) : basePrice;
  const d = Math.min(99, Math.max(0, discount));
  const packagePay = packageYouPay(basePrice, d);
  const packageOriginal = originalPrice;
  const tagLabel = pkg.category
    ? categoryLabel(pkg.category)
    : pkg.tag || (Array.isArray(pkg.tags) && pkg.tags[0] ? String(pkg.tags[0]) : "Holiday");

  const imageSrc = optimizeImageUrl(resolveMediaUrl(pkg.image) || FALLBACK_TOUR_IMAGE, 480);

  const BookAction = actionHref ? (
    <Link
      href={actionHref}
      className="cabzii-btn cabzii-btn-primary cabzii-btn-sm cabzii-tap w-full justify-center text-[11px]"
    >
      {actionText} <ArrowRightIcon className="h-3 w-3 text-white/90" />
    </Link>
  ) : (
    <button
      type="button"
      onClick={() => onAction?.(pkg)}
      className="cabzii-btn cabzii-btn-primary cabzii-btn-sm cabzii-tap w-full justify-center text-[11px]"
    >
      {actionText} <ArrowRightIcon className="h-3 w-3 text-white/90" />
    </button>
  );

  return (
    <article className="cabzii-card cabzii-card-interactive group relative flex h-full flex-col overflow-hidden">
      <div className="relative p-1">
        <div className="relative overflow-hidden rounded-xl bg-slate-100">
          <img
            src={imageSrc}
            alt={pkg.name || "Tour"}
            width={480}
            height={180}
            loading="lazy"
            decoding="async"
            className="h-[112px] w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.02] sm:h-[120px]"
            onError={(e) => {
              if (e.currentTarget.src !== FALLBACK_TOUR_IMAGE) {
                e.currentTarget.src = FALLBACK_TOUR_IMAGE;
              }
            }}
          />
          <div className="absolute left-1.5 top-1.5 flex items-center gap-1">
            {d > 0 ? (
              <span className="rounded bg-[#0056D2] px-1 py-0.5 text-[9px] font-bold text-white shadow">
                {d}% OFF
              </span>
            ) : null}
            <span className="rounded bg-black/35 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white backdrop-blur">
              {tagLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-0.5">
        <h3 className="line-clamp-2 text-xs font-bold leading-snug text-slate-900 sm:text-[13px]">
          {pkg.name}
        </h3>
        <div className="mt-0.5 flex items-center justify-between gap-1.5">
          <p className="line-clamp-1 text-[10px] text-slate-500">by {pkg.vendor || "Tour Partner"}</p>
          <span className="hidden shrink-0 items-center gap-0.5 text-[10px] text-slate-500 sm:inline-flex">
            <CheckIcon className="h-2.5 w-2.5 text-emerald-400" />
            Verified
          </span>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-1">
          {pkg.city ? (
            <span className="inline-flex items-center gap-0.5 rounded-full border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-600">
              <MapPinIcon className="h-2.5 w-2.5 text-sky-400" />
              {pkg.city}
            </span>
          ) : null}
        </div>

        {pkg.originNote ? (
          <div className="mt-1 flex items-start gap-1 rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5">
            <AlertIcon className="mt-0.5 h-2.5 w-2.5 shrink-0 text-amber-400" />
            <p className="text-[10px] font-medium leading-tight text-amber-800">{pkg.originNote}</p>
          </div>
        ) : null}

        <div className="mt-1.5 flex items-end justify-between gap-2 border-t border-slate-100 pt-1.5">
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">From</p>
            <p className="text-sm font-extrabold tracking-tight text-slate-900">
              ₹{packagePay.toLocaleString("en-IN")}
              <span className="ml-0.5 hidden text-[10px] font-medium text-slate-500 sm:inline">onwards</span>
            </p>
            {packageOriginal > packagePay ? (
              <p className="text-[10px] text-slate-400 line-through">
                ₹{packageOriginal.toLocaleString("en-IN")}
              </p>
            ) : null}
          </div>
          {d > 0 ? (
            <span className="shrink-0 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
              {d}% OFF
            </span>
          ) : null}
        </div>

        <div className="mt-1.5">{BookAction}</div>
      </div>
    </article>
  );
}
