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
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl lg:text-2xl">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm leading-relaxed text-slate-600">{subtitle}</p> : null}
        </div>
        {viewAllHref ? (
          <Link href={viewAllHref} className="shrink-0 text-sm font-semibold text-[var(--cabzii-brand)] transition hover:underline">
            {viewAllLabel}
          </Link>
        ) : null}
      </div>
      {loading ? (
        <CatalogGridSkeleton count={4} />
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
