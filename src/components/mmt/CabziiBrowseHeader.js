import Link from "next/link";

/**
 * Consistent browse-page hero — width matches `.section-shell` site-wide.
 */
export default function CabziiBrowseHeader({ title, subtitle, breadcrumbs = [], icon: Icon, children }) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="section-shell py-4 sm:py-5 md:py-6">
        {breadcrumbs.length ? (
          <nav className="mb-2 flex flex-wrap items-center gap-1 text-xs text-slate-500 sm:mb-3" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.path} className="inline-flex min-w-0 items-center gap-1">
                {i > 0 ? <span className="text-slate-300">/</span> : null}
                {i < breadcrumbs.length - 1 ? (
                  <Link href={crumb.path} className="hover:text-[var(--cabzii-brand)]">
                    {crumb.name}
                  </Link>
                ) : (
                  <span className="truncate text-slate-700">{crumb.name}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}
        <div className="flex items-start gap-2.5 sm:gap-3">
          {Icon ? (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100 sm:h-11 sm:w-11">
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} aria-hidden />
            </span>
          ) : null}
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">{title}</h1>
            {subtitle ? <p className="mt-1 text-xs text-slate-600 sm:text-sm">{subtitle}</p> : null}
          </div>
        </div>
        {children ? <div className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">{children}</div> : null}
      </div>
    </section>
  );
}
