"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buildDomesticDestinations, INTERNATIONAL_DESTINATIONS } from "../../lib/holidayHome";
import { resolveMediaUrl } from "../../lib/media";

const CARD_CLASS =
  "group flex h-[13.5rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-[var(--cabzii-brand)]/35 hover:shadow-md sm:h-[15.5rem] md:h-[16.5rem]";

const VISIBLE_PER_ROW = 5;

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
      <div className="relative min-h-0 flex-1 overflow-hidden bg-slate-200">
        {src ? (
          <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            onError={onImageError}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-100">
            <span className="text-sm font-semibold text-slate-500">{d.name}</span>
          </div>
        )}
      </div>
      <div className="flex shrink-0 flex-col justify-end border-t border-slate-100 bg-white px-3 pb-3 pt-2.5 text-center sm:px-4 sm:pb-4 sm:pt-3">
        <p className="line-clamp-2 w-full text-base font-bold leading-snug text-slate-900 group-hover:text-[var(--emt-primary)] sm:text-lg">
          {d.name}
        </p>
        {d.priceFrom > 0 ? (
          <p className="mt-1 line-clamp-1 w-full text-sm font-semibold text-[var(--emt-primary)] sm:text-base">
            From {formatINR(d.priceFrom)}
          </p>
        ) : (
          <p className="mt-1 line-clamp-1 w-full text-sm font-semibold text-[var(--emt-primary)] sm:text-base">
            Explore
          </p>
        )}
      </div>
    </Link>
  );
}

function DestinationGrid({ title, items, loading, viewAllHref, viewAllLabel = "View all →" }) {
  const visible = items.slice(0, VISIBLE_PER_ROW);

  return (
    <div className="mb-8 last:mb-0 sm:mb-10">
      <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
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
      ) : visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          No holiday packages yet. Restart the backend to auto-load packages, or add tours in admin.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {visible.map((d) => (
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
        viewAllHref="/holidays"
        viewAllLabel="View all destinations →"
      />
    </section>
  );
}
