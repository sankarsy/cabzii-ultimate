import Link from "next/link";
import CatalogCardImage from "../mmt/CatalogCardImage";
import MmtCardPriceBlock from "../mmt/MmtCardPriceBlock";
import VerifiedBadge from "./VerifiedBadge";

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
  packageLine,
  priceBlockProps,
  ctaLabel = "Select",
  imageObjectPosition
}) {
  return (
    <article className="cabzii-card cabzii-card-interactive flex h-full min-w-0 flex-col overflow-hidden">
      <Link href={href} className="group flex h-full min-w-0 flex-col">
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-slate-100">
          <CatalogCardImage
            src={imageSrc}
            alt={imageAlt}
            product={imageProduct}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            objectPosition={imageObjectPosition || "center"}
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
          />
          <div className="absolute left-2.5 top-2.5">
            <VerifiedBadge compact />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3 p-3.5 sm:p-4">
          <div className="min-w-0 space-y-1">
            <h3 className="line-clamp-2 text-base font-bold leading-snug tracking-tight text-slate-900">
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

          {packageLine ? <div className="text-xs text-slate-500">{packageLine}</div> : null}

          <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
            <MmtCardPriceBlock {...priceBlockProps} compact />
            <span className="cabzii-btn cabzii-btn-primary cabzii-btn-sm shrink-0 pointer-events-none sm:min-h-[var(--cabzii-touch-min)]">
              {ctaLabel}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function FeatureChip({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-100">
      {Icon ? <Icon className="h-3 w-3 shrink-0 text-slate-400" strokeWidth={2} /> : null}
      {children}
    </span>
  );
}
