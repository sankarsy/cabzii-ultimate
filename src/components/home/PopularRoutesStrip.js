"use client";

import Link from "next/link";
import { POPULAR_DOMESTIC_ROUTES } from "../../lib/domesticFocus";

export default function PopularRoutesStrip() {
  return (
    <section className="border-t border-slate-200 bg-white py-8">
      <div className="section-shell">
        <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">Popular routes & services</h2>
        <p className="mt-1 text-sm text-slate-600">Book one-way, round trip & airport taxis across South India</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_DOMESTIC_ROUTES.map((route) => (
            <Link
              key={route.label}
              href={route.href}
              className="cabzii-tap flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 transition hover:border-[var(--cabzii-brand)]/30 hover:bg-blue-50/50"
            >
              <span className="text-sm font-semibold text-slate-800">{route.label}</span>
              <span className="shrink-0 text-xs font-bold text-[var(--cabzii-brand)]">{route.fare}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
