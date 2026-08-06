import Link from "next/link";

/**
 * Consistent browse-page hero — width matches `.section-shell` site-wide.
 */
export default function CabziiBrowseHeader({ title, subtitle, breadcrumbs = [], icon: Icon, children }) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="section-shell py-2.5 sm:py-3.5 md:py-4">
        {breadcrumbs.length ? (
          <nav
            className="mb-1.5 flex flex-wrap items-center gap-1 text-[10px] text-slate-500 sm:mb-2 sm:text-xs"
            aria-label="Breadcrumb"
          >
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.path} className="inline-flex min-w-0 items-center gap-1">
                {i > 0 ? <span className="text-slate-300">/</span> : null}
                {i < breadcrumbs.length - 1 ? (
                  <Link href={crumb.path} className="hover:text-[var(--cabzii-brand)]">
                    {crumb.name}
                  </Link>
                ) : (
                  <span className="truncate text-slate-600">{crumb.name}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}
        <div className="flex items-start gap-2 sm:gap-2.5">
          {Icon ? (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 ring-1 ring-sky-100 sm:h-9 sm:w-9">
              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} aria-hidden />
            </span>
          ) : null}
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg md:text-xl">{title}</h1>
            {subtitle ? <p className="mt-0.5 text-[11px] text-slate-600 sm:text-xs">{subtitle}</p> : null}
          </div>
        </div>
        {children ? <div className="mt-2 space-y-2 sm:mt-2.5">{children}</div> : null}
      </div>
    </section>
  );
}
