import Link from "next/link";

export function MmtHomeCatalogScroll({ children }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  );
}

export function MmtHomeCatalogScrollItem({ children }) {
  return <div className="min-w-0 w-full">{children}</div>;
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
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-sm text-slate-600">{subtitle}</p> : null}
        </div>
        {viewAllHref ? (
          <Link href={viewAllHref} className="shrink-0 text-sm font-semibold text-[var(--emt-primary)] hover:underline">
            {viewAllLabel}
          </Link>
        ) : null}
      </div>
      {loading ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500 sm:p-10">
          {loadingLabel}
        </div>
      ) : isEmpty ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500 sm:p-10">
          {emptyMessage}
        </div>
      ) : (
        children
      )}
    </section>
  );
}
