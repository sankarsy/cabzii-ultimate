"use client";

import { ArrowLeftRight } from "../icons/rscIcons";
import { CatalogGridSkeleton } from "../ui/Skeleton";
import HomeSectionHeader from "../home/HomeSectionHeader";

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
  band = "home-band home-band-sky"
}) {
  void loadingLabel;
  return (
    <section className={band}>
      <div className="section-shell">
        <HomeSectionHeader
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          href={viewAllHref}
          linkLabel={viewAllLabel ? `${viewAllLabel.replace(/→\s*$/, "").trim()} →` : undefined}
        />
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
      </div>
    </section>
  );
}
