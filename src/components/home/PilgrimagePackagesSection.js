"use client";

import Link from "next/link";
import { PILGRIMAGE_PACKAGES } from "../../lib/domesticFocus";

export default function PilgrimagePackagesSection() {
  return (
    <section className="border-t border-slate-200 bg-gradient-to-b from-orange-50/40 to-white py-10 sm:py-12">
      <div className="section-shell">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-orange-600">Temple & pilgrimage</p>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">Popular tour packages</h2>
            <p className="mt-1 text-sm text-slate-600">Tirupati, Rameswaram, Madurai, Navagraha & South India tours</p>
          </div>
          <Link
            href="/holidays?category=pilgrimage"
            className="cabzii-tap inline-flex items-center justify-center rounded-full bg-[var(--cabzii-brand)] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[var(--cabzii-brand-hover)]"
          >
            View all packages
          </Link>
        </div>
        <div className="scroll-x-touch flex gap-4 overflow-x-auto pb-1">
          {PILGRIMAGE_PACKAGES.map((pkg) => (
            <Link
              key={pkg.slug}
              href={pkg.href}
              className="cabzii-tap group flex w-[min(100%,17rem)] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative h-32 bg-gradient-to-br from-orange-100 to-amber-50">
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-700 shadow-sm">
                  {pkg.tag}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-bold text-slate-900 group-hover:text-[var(--cabzii-brand)]">{pkg.name}</h3>
                <p className="mt-2 text-sm font-extrabold text-[var(--cabzii-brand)]">{pkg.fromPrice}</p>
                <span className="mt-auto pt-3 text-xs font-semibold text-slate-500">Instant enquiry →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
