import Link from "next/link";

/**
 * Consistent browse-page hero used on cabs, drivers, tours.
 */
export default function CabziiBrowseHeader({ title, subtitle, breadcrumbs = [], children }) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-6">
        {breadcrumbs.length ? (
          <nav className="mb-3 text-xs text-slate-500" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.path}>
                {i > 0 ? <span className="mx-2">/</span> : null}
                {i < breadcrumbs.length - 1 ? (
                  <Link href={crumb.path} className="hover:text-[var(--cabzii-brand)]">
                    {crumb.name}
                  </Link>
                ) : (
                  <span className="text-slate-700">{crumb.name}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
        {children ? <div className="mt-4">{children}</div> : null}
      </div>
    </section>
  );
}
