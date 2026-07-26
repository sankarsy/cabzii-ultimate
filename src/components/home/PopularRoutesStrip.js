"use client";

import Link from "next/link";
import { POPULAR_DOMESTIC_ROUTES } from "../../lib/domesticFocus";

const URGENCY_MESSAGES = ["Limited time fare", "High demand today", "Few cabs left"];

export default function PopularRoutesStrip() {
  return (
    <section className="border-t border-slate-200 bg-white py-8">
      <div className="section-shell">
        <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">Popular routes & services</h2>
        <p className="mt-1 text-sm text-slate-600">Book one-way, round trip & airport taxis across South India</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_DOMESTIC_ROUTES.map((route, index) => (
            <Link
              key={route.label}
              href={route.href}
              className="cabzii-tap flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 transition hover:border-[var(--cabzii-cta)]/35 hover:bg-[#FFF8F5]"
            >
              <span className="min-w-0 truncate text-sm font-semibold text-slate-800">{route.label}</span>
              <span className="flex shrink-0 items-center gap-2">
                {index % 3 === 0 ? (
                  <span className="cabzii-urgency-badge">{URGENCY_MESSAGES[(index / 3) % URGENCY_MESSAGES.length]}</span>
                ) : null}
                <span className="text-xs font-bold text-[var(--cabzii-cta)]">{route.fare}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
