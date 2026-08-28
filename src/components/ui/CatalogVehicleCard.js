import Link from "next/link";
import CatalogCardImage from "../mmt/CatalogCardImage";
import MmtCardPriceBlock from "../mmt/MmtCardPriceBlock";
import VerifiedBadge from "./VerifiedBadge";
import { ICON_SOFT_CLASS } from "../icons";
import { isLocalFallbackImage, isPlaceholderProductImage } from "../../lib/dynamicImageSeo";

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
  ctaLabel = "Select",
  imageObjectPosition,
  onNavigate
}) {
  const hasRealPhoto =
    Boolean(imageSrc) && !isPlaceholderProductImage(imageSrc) && !isLocalFallbackImage(imageSrc);

  return (
    <article className="group flex h-full min-w-0 max-w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[var(--emt-shadow-card)] transition-all duration-200 sm:hover:-translate-y-1 sm:hover:shadow-[var(--emt-shadow-hover)]">
      <Link
        href={href}
        onClick={onNavigate}
        className="flex h-full min-w-0 flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cabzii-brand)] focus-visible:ring-offset-2"
      >
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[linear-gradient(180deg,#edf2f7_0%,#f8fafc_48%,#ffffff_100%)]">
          <CatalogCardImage
            src={imageSrc}
            alt={imageAlt}
            product={imageProduct}
            className={
              hasRealPhoto
                ? "object-cover object-center transition-transform duration-300 sm:group-hover:scale-[1.04]"
                : "object-contain p-5 transition-transform duration-300 sm:p-6 sm:group-hover:scale-105"
            }
            objectPosition={imageObjectPosition || (hasRealPhoto ? "center" : "center bottom")}
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
          />
          {hasRealPhoto ? (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-white/10" />
          ) : null}
          <div className="absolute left-2.5 top-2.5">
            <VerifiedBadge compact />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
          <div className="min-w-0 space-y-1">
            <h3 className="line-clamp-2 text-base font-extrabold leading-snug tracking-tight text-slate-900 transition group-hover:text-[var(--cabzii-brand)]">
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

          <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
            <MmtCardPriceBlock {...priceBlockProps} compact />
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-extrabold uppercase tracking-wide text-slate-900 transition group-hover:text-[var(--cabzii-cta)]">
              {ctaLabel}
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function FeatureChip({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50/90 px-2 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-slate-100">
      {Icon ? <Icon className={`h-3 w-3 shrink-0 ${ICON_SOFT_CLASS}`} strokeWidth={1.75} /> : null}
      {children}
    </span>
  );
}
