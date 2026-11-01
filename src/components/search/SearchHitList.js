"use client";

import Link from "next/link";
import { ArrowRightLeft, Bus, Car, ChevronRight, MapPinned, Plane, UserRound } from "../icons/rscIcons";

const HIT_ICONS = {
  cab: Car,
  outstation: MapPinned,
  oneway: ArrowRightLeft,
  tempo: Bus,
  airport: Plane,
  driver: UserRound
};

export default function SearchHitList({ hits = [] }) {
  if (!hits.length) return null;
  return (
    <section>
      <h2 className="text-[13px] font-bold uppercase tracking-wide text-slate-500">Packages to book</h2>
      <ul className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        {hits.map((hit, index) => {
          const Icon = HIT_ICONS[hit.kind] || Car;
          return (
            <li key={hit.href} className={index ? "border-t border-slate-100" : ""}>
              <Link
                href={hit.href}
                className="flex min-h-[4.25rem] items-center gap-3 px-3.5 py-3 active:bg-slate-50 sm:px-4"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef3ff] text-[var(--cabzii-brand)]">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-extrabold leading-snug text-slate-900">{hit.title}</span>
                  {hit.hint ? <span className="mt-0.5 block text-[12px] leading-snug text-slate-500">{hit.hint}</span> : null}
                </span>
                <span className="inline-flex shrink-0 items-center gap-0.5 text-[11px] font-extrabold uppercase tracking-wide text-[var(--cabzii-cta)]">
                  Book
                  <ChevronRight className="h-4 w-4" strokeWidth={2.25} aria-hidden />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
