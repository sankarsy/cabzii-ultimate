"use client";

import { useState } from "react";
import MmtVerticalNav from "./MmtVerticalNav";
import MmtCabSearchWidget from "./MmtCabSearchWidget";

export default function MmtHomeHero({ defaultCity = "" }) {
  const [active, setActive] = useState("cabs");

  return (
    <section className="relative">
      <div className="absolute inset-0 h-72 bg-mmt-header" aria-hidden="true">
        <div className="h-full w-full bg-linear-to-br from-[#1a2744] via-[#243b5c] to-[#0056D2]/40 opacity-90" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl px-4 pt-6 pb-12">
        <h1 className="mb-1 text-center text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Book cabs at best prices
        </h1>
        <p className="mb-5 text-center text-sm font-medium text-white/85 sm:text-base">
          Outstation · Airport · Hourly · Local — verified vendors across India
        </p>
        <div className="rounded-2xl bg-white shadow-xl">
          <div className="px-4 pt-4">
            <MmtVerticalNav active={active} onSelect={setActive} />
          </div>
          <div className="px-4 pb-6 pt-2 sm:px-8">
            {active === "cabs" ? (
              <MmtCabSearchWidget defaultCity={defaultCity} />
            ) : (
              <ComingSoon vertical={active} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ComingSoon({ vertical }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">🚧</div>
      <h3 className="text-xl font-bold capitalize text-slate-900">{vertical} booking is coming soon</h3>
      <p className="max-w-md text-sm text-slate-600">
        We&apos;re building {vertical} on Cabzii. Use the <strong>Cabs</strong> tab for outstation, airport and hourly
        rides — or browse <strong>Tours</strong> and <strong>Drivers</strong> below.
      </p>
    </div>
  );
}
