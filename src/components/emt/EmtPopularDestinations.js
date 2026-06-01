"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buildDomesticDestinations, INTERNATIONAL_DESTINATIONS } from "../../lib/holidayHome";
import { resolveMediaUrl } from "../../lib/media";

const CARD_CLASS =
  "group flex h-[11rem] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-[var(--cabzii-brand)]/35 hover:shadow-md sm:h-[11.5rem]";

const IMAGE_SLOT = "relative h-[5.25rem] w-full shrink-0 overflow-hidden bg-slate-200 sm:h-[5.5rem]";

const BODY_SLOT =
  "flex h-[5.75rem] shrink-0 flex-col items-center justify-center px-2 text-center sm:h-[6rem] sm:px-2.5";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(n) || 0);
}

function DestinationCard({ d }) {
  const cover = resolveMediaUrl(d.fallbackImage || d.image);
  const primary = resolveMediaUrl(d.image);
  const [src, setSrc] = useState(primary || cover);

  useEffect(() => {
    setSrc(primary || cover);
  }, [primary, cover]);

  function onImageError() {
    if (cover && src !== cover) {
      setSrc(cover);
      return;
    }
    setSrc(null);
  }

  return (
    <Link href={d.href} title={d.packageName || d.name} className={CARD_CLASS}>
      <div className={IMAGE_SLOT}>
        {src ? (
          <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
            onError={onImageError}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-100">
            <span className="text-xs font-semibold text-slate-500">{d.name}</span>
          </div>
        )}
      </div>
      <div className={BODY_SLOT}>
        <p className="line-clamp-2 w-full text-sm font-bold leading-snug text-slate-900 group-hover:text-[var(--emt-primary)]">
          {d.name}
        </p>
        {d.priceFrom > 0 ? (
          <p className="mt-1 line-clamp-1 w-full text-xs font-semibold text-[var(--emt-primary)]">
            From {formatINR(d.priceFrom)}
          </p>
        ) : (
          <p className="mt-1 line-clamp-1 w-full text-xs font-semibold text-[var(--emt-primary)]">Explore</p>
        )}
      </div>
    </Link>
  );
}

function DestinationGrid({ title, items, loading, viewAllHref, viewAllLabel = "View all →" }) {
  return (
    <div className="mb-8 last:mb-0 sm:mb-10">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="min-w-0 text-lg font-bold text-slate-900 sm:text-xl">{title}</h3>
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="shrink-0 whitespace-nowrap text-sm font-semibold text-[var(--emt-primary)] hover:underline"
          >
            {viewAllLabel}
          </Link>
        ) : null}
      </div>
      {loading ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading packages…
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          No destinations yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {items.map((d) => (
            <DestinationCard key={d.slug} d={d} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function EmtPopularDestinations({ packages = [], loading = false }) {
  const domestic = buildDomesticDestinations(packages);

  const international = INTERNATIONAL_DESTINATIONS.map((d) => ({
    ...d,
    fallbackImage: d.image
  }));

  return (
    <section className="section-shell border-t border-slate-200 py-8 sm:py-10">
      <DestinationGrid
        title="Domestic"
        items={domestic}
        loading={loading}
        viewAllHref="/holidays"
        viewAllLabel="View all packages →"
      />
      <DestinationGrid
        title="International"
        items={international}
        loading={false}
        viewAllHref="/flights"
        viewAllLabel="View all destinations →"
      />
    </section>
  );
}
