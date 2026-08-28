import Link from "next/link";
import { ArrowLeftRight } from "lucide-react";
import { CatalogGridSkeleton } from "../ui/Skeleton";

export function MmtHomeCatalogScroll({ children }) {
  return <div className="cabzii-catalog-grid">{children}</div>;
}

export function MmtHomeCatalogScrollItem({ children }) {
  return <div className="cabzii-catalog-item">{children}</div>;
}

export default function MmtHomeCatalogSection({
  eyebrow,
  title,
  subtitle,
  viewAllHref,
  viewAllLabel,
  loading,
  loadingLabel = "Loading…",
  isEmpty = false,
  emptyMessage = "Nothing to show yet.",
  children,
  borderedTop = false
}) {
  return (
    <section
      className={`section-shell py-8 sm:py-10 ${borderedTop ? "border-t border-slate-200" : ""}`}
    >
      <div className="relative mb-5 sm:mb-7">
        <div className="text-center">
          {eyebrow ? (
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--cabzii-brand)]">{eyebrow}</p>
          ) : null}
          <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-[1.75rem]">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-sm leading-relaxed text-slate-600" suppressHydrationWarning>
              {subtitle}
            </p>
          ) : null}
        </div>
        {viewAllHref ? (
          <div className="mt-3 flex justify-center sm:absolute sm:right-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2 sm:justify-end">
            <Link href={viewAllHref} className="shrink-0 text-sm font-semibold text-[var(--cabzii-brand)] transition hover:underline">
              {viewAllLabel} →
            </Link>
          </div>
        ) : null}
      </div>
      {loading ? (
        <CatalogGridSkeleton count={8} />
      ) : isEmpty ? (
        <div className="cabzii-empty">
          <div className="cabzii-empty-icon" aria-hidden>
            <ArrowLeftRight className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <p className="text-sm font-medium text-slate-600">{emptyMessage}</p>
        </div>
      ) : (
        children
      )}
    </section>
  );
}
