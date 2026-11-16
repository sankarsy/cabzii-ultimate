"use client";

import Link from "next/link";
import CatalogCardImage from "../mmt/CatalogCardImage";
import MmtCardPriceBlock from "../mmt/MmtCardPriceBlock";
import VerifiedBadge from "./VerifiedBadge";

const ICON_SOFT_CLASS = "text-[var(--cabzii-brand)]";
/**
 * Premium vertical vehicle/driver card — Uber/Ola-style layout.
 * Full-width image on top, content below, no side-squeeze on mobile.
 */
export default function CatalogVehicleCard({
  href,
  imageSrc,
  imageAlt,
  imageProduct,
  title,
  subtitle,
  meta,
  features,
  priceBlockProps,
  ctaLabel = "SELECT",
  imageObjectPosition,
  onNavigate,
  compact = false
}) {
  return (
    <article className="group cab-card flex h-full min-w-0 max-w-full flex-col overflow-hidden rounded-2xl border border-[var(--cabzii-border)] bg-white shadow-[var(--emt-shadow-card)] transition-all duration-200 sm:hover:-translate-y-[3px] sm:hover:border-[var(--cabzii-brand)] sm:hover:shadow-[var(--emt-shadow-hover)]">
      <Link
        href={href}
        onClick={onNavigate}
        className="flex h-full min-w-0 flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cabzii-brand)] focus-visible:ring-offset-2"
      >
        <div
          className={`relative w-full shrink-0 overflow-hidden bg-[var(--cabzii-sky)] ${
            compact ? "aspect-[16/10]" : "aspect-[16/9]"
          }`}
        >
          <CatalogCardImage
            src={imageSrc}
            alt={imageAlt}
            product={imageProduct}
            illustration
            className="object-contain"
            objectPosition={imageObjectPosition || "center"}
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
          />
          <div className="absolute left-2.5 top-2.5">
            <VerifiedBadge compact />
          </div>
        </div>

        <div className={`flex min-h-0 flex-1 flex-col ${compact ? "gap-2 p-3 sm:p-3.5" : "gap-3 p-4"}`}>
          <div className="min-w-0 space-y-1">
            <h3
              className={`line-clamp-2 font-bold leading-snug tracking-tight text-[var(--cabzii-ink)] ${
                compact ? "text-[15px] sm:text-base" : "text-lg"
              }`}
            >
              {title}
            </h3>
            {subtitle ? (
              <p className="line-clamp-1 text-xs leading-relaxed text-slate-500 sm:text-sm">{subtitle}</p>
            ) : null}
            {meta ? <div className="pt-0.5">{meta}</div> : null}
          </div>

          {features ? (
            <div className="flex flex-wrap gap-1.5">{features}</div>
          ) : null}

          <div className={`mt-auto flex items-end justify-between gap-2 border-t border-slate-100 ${compact ? "pt-2.5" : "gap-3 pt-3"}`}>
            <MmtCardPriceBlock {...priceBlockProps} compact />
            <span
              className={`inline-flex shrink-0 items-center gap-1 rounded-[10px] bg-[var(--cabzii-brand)] font-bold text-white ${
                compact ? "px-2.5 py-1.5 text-[12px] sm:px-3 sm:text-[13px]" : "px-3.5 py-2 text-[13px]"
              }`}
            >
              {ctaLabel}
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function FeatureChip({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--cabzii-bg)] px-2 py-1 text-[13px] font-semibold text-[var(--cabzii-ink)]">
      {Icon ? <Icon className={`h-3 w-3 shrink-0 ${ICON_SOFT_CLASS}`} strokeWidth={1.75} /> : null}
      {children}
    </span>
  );
}
