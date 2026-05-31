"use client";

import Link from "next/link";
import { buildDomesticDestinations, INTERNATIONAL_DESTINATIONS } from "../../lib/holidayHome";
import { resolveMediaUrl } from "../../lib/media";

const FALLBACK_DEST_IMAGE =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&h=280&q=80";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(n) || 0);
}

function DestinationGrid({ title, items, loading }) {
  return (
    <div className="mb-8 sm:mb-10">
      <h3 className="mb-4 text-lg font-bold text-slate-900">{title}</h3>
      {loading ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading packages…
        </div>
      ) : (
        <div className="offers-scroll flex gap-3 overflow-x-auto overscroll-x-contain pb-2 pt-1 snap-x snap-mandatory scroll-smooth sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 lg:grid-cols-6">
          {items.map((d) => (
            <Link
              key={d.slug}
              href={d.href}
              title={d.packageName || d.name}
              className="group min-w-[140px] shrink-0 snap-start overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-[var(--cabzii-brand)]/30 hover:shadow-[var(--emt-shadow-hover)] sm:min-w-0"
            >
              <div className="relative aspect-[4/3] bg-slate-100">
                <img
                  src={resolveMediaUrl(d.image) || FALLBACK_DEST_IMAGE}
                  alt={d.packageName || d.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition group-hover:scale-105"
                  onError={(e) => {
                    if (e.currentTarget.src !== FALLBACK_DEST_IMAGE) {
                      e.currentTarget.src = FALLBACK_DEST_IMAGE;
                    }
                  }}
                />
              </div>
              <div className="p-2.5">
                <p className="font-bold text-slate-900 group-hover:text-[var(--emt-primary)]">{d.name}</p>
                {d.priceFrom > 0 ? (
                  <p className="text-xs font-semibold text-[var(--emt-primary)]">From {formatINR(d.priceFrom)}</p>
                ) : (
                  <p className="text-xs font-semibold text-[var(--emt-primary)]">View packages</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EmtPopularDestinations({ packages = [], loading = false }) {
  const domestic = buildDomesticDestinations(packages);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-4 pt-2">
      <DestinationGrid title="Domestic" items={domestic} loading={loading} />
      <DestinationGrid title="International" items={INTERNATIONAL_DESTINATIONS} loading={false} />
    </section>
  );
}
