"use client";

import { useState } from "react";
import Link from "next/link";
import CallDriverServiceIcon from "./CallDriverMarks";
import ApproxPriceNote from "../ui/ApproxPriceNote";
import { callDriverBookHref, callDriverFareLabel } from "../../lib/callDriver";

export default function CallDriverServiceGrid({ services = [], pickup = "" }) {
  const [selectedId, setSelectedId] = useState(services[0]?.id || "local");
  const selected = services.find((service) => service.id === selectedId) || services[0];
  const cityName = pickup || "Chennai";

  if (!services.length) return null;

  return (
    <div className="section-shell grid gap-3 py-4 sm:gap-4 sm:py-5 sm:pl-20 lg:grid-cols-[minmax(17rem,22rem)_minmax(0,1fr)] lg:py-6 xl:pl-6">
      <aside className="min-w-0">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          <h2 className="text-base font-bold text-slate-900">Choose a service</h2>
          <div className="mt-3 grid grid-cols-3 gap-1 rounded-2xl bg-[var(--cabzii-sky)] p-1" role="tablist" aria-label="Call Driver service">
            {services.map((service) => {
              const active = service.id === selected?.id;
              return (
                <button
                  key={service.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedId(service.id)}
                  className={`min-h-11 rounded-xl px-1 py-2 text-center text-[12px] font-bold leading-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cabzii-brand)] focus-visible:ring-offset-2 ${
                    active ? "bg-[var(--cabzii-brand)] text-white" : "text-[var(--cabzii-brand)] hover:bg-white"
                  }`}
                >
                  {service.shortTitle || service.title}
                </button>
              );
            })}
          </div>
          {selected ? (
            <div className="mt-4">
              <p className="text-lg font-extrabold tracking-tight text-slate-900">{selected.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{selected.blurb}</p>
              <p className="mt-3 text-sm font-extrabold text-slate-900">{callDriverFareLabel(selected)}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Driver for your own car in {cityName}. A driver is assigned after you confirm.
              </p>
              <Link
                href={callDriverBookHref(selected.id, { pickup: cityName })}
                className="mt-4 flex min-h-12 items-center justify-center rounded-[10px] bg-[var(--cabzii-brand)] px-4 text-[15px] font-bold text-white hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cabzii-brand)] focus-visible:ring-offset-2"
              >
                {selected.cta || "Book now"}
              </Link>
            </div>
          ) : null}
        </div>
      </aside>

      <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)] sm:p-4">
        <h2 className="px-1 text-base font-bold text-slate-900">Call Driver in {cityName}</h2>
        <p className="mt-1 px-1 text-sm text-slate-600">You book the service. Cabzii assigns the driver.</p>
        <ul className="mt-3 space-y-2">
            {services.map((service) => {
              const active = service.id === selected?.id;
            return (
              <li key={service.id}>
                <Link
                  href={callDriverBookHref(service.id, { pickup: cityName })}
                  onClick={() => setSelectedId(service.id)}
                  aria-current={active ? "true" : undefined}
                  className={`flex items-start gap-3 rounded-xl border p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cabzii-brand)] focus-visible:ring-offset-2 ${
                    active ? "border-[var(--cabzii-brand)] bg-[var(--cabzii-sky)]" : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <span className="flex h-12 w-14 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200">
                    <CallDriverServiceIcon id={service.id} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-extrabold leading-snug text-slate-900">{service.title}</span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-slate-600">{service.blurb}</span>
                    <span className="mt-1 block text-[12px] font-semibold text-slate-700">{callDriverFareLabel(service)}</span>
                  </span>
                  <span className="hidden shrink-0 self-center rounded-[10px] bg-[var(--cabzii-brand)] px-3 py-2 text-[13px] font-bold text-white sm:inline-flex">
                    {service.cta || "Book now"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <ApproxPriceNote />
      </div>
    </div>
  );
}
