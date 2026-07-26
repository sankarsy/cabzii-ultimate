import Link from "next/link";
import { packageBookingHref, packageDisplayPrice, packageSeoHref } from "../../lib/holidayHome";
import { resolveMediaUrl } from "../../lib/media";

function inr(n) {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return null;
  return `₹${v.toLocaleString("en-IN")}`;
}

/**
 * Compact holiday-package booking block for /services/tour-packages/{city}.
 * Funnel: SEO landing → book with Mongo id (not slug).
 */
export default function SeoPackageBookingSection({
  title,
  cityName,
  priceFrom,
  browseHref = "/holidays",
  packages = []
}) {
  const priceText = inr(priceFrom);

  return (
    <section className="mt-6 space-y-3" aria-label={title || "Book tour packages"}>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-slate-100 px-3 py-2.5 sm:px-4">
          <p className="text-xs font-semibold text-slate-800">
            Tour packages{cityName ? ` in ${cityName}` : ""}
          </p>
          {priceText ? (
            <p className="ml-auto text-sm font-bold text-slate-900">
              From {priceText}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2 bg-slate-50/70 p-2.5 sm:p-3">
          <Link
            href={browseHref}
            className="cabzii-btn cabzii-btn-primary cabzii-btn-sm cabzii-tap max-sm:flex-1"
          >
            Browse packages
          </Link>
          <Link
            href="/holidays"
            className="cabzii-btn cabzii-btn-secondary cabzii-btn-sm cabzii-tap max-sm:flex-1"
          >
            All holidays
          </Link>
        </div>
      </div>

      {packages.length ? (
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900">Popular packages</h3>
            <Link href={browseHref} className="text-[11px] font-semibold text-[var(--cabzii-brand)] hover:underline">
              View all →
            </Link>
          </div>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {packages.map((pkg) => {
              const id = String(pkg._id || pkg.id);
              const img = resolveMediaUrl(pkg.image);
              const pay = packageDisplayPrice(pkg);
              return (
                <li
                  key={id}
                  className="flex gap-2.5 overflow-hidden rounded-lg border border-slate-200 bg-white p-2"
                >
                  <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md bg-slate-100">
                    {img ? (
                      <img src={img} alt={pkg.imageAlt || pkg.name || "Package"} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={packageSeoHref(pkg)}
                      className="line-clamp-1 text-xs font-bold text-slate-900 hover:text-[var(--cabzii-brand)]"
                    >
                      {pkg.name}
                    </Link>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {[pkg.duration, pkg.city].filter(Boolean).join(" · ") || "Holiday package"}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      {pay > 0 ? (
                        <span className="text-xs font-extrabold text-[var(--cabzii-brand)]">{inr(pay)}</span>
                      ) : null}
                      <Link
                        href={packageBookingHref(pkg)}
                        className="cabzii-btn cabzii-btn-primary cabzii-btn-sm cabzii-tap ml-auto !min-h-7 !px-2.5 !text-[11px]"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
