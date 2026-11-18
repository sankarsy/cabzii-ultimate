"use client";

import Link from "next/link";
import CallDriverServiceIcon from "../call-driver/CallDriverMarks";
import { CALL_DRIVER_TARIFF } from "../../data/call-drivers-chennai";
import { CALL_DRIVER_SERVICES, callDriverBookHref, callDriverFareLabel } from "../../lib/callDriver";
import { formatInr } from "../../lib/formatInr";

function rowFare(service) {
  const labeled = callDriverFareLabel(service);
  if (labeled !== "Fare shown before you confirm") return labeled;
  if (service.id === "local" || service.id === "airport") {
    const row = CALL_DRIVER_TARIFF[service.id];
    return `Approx. from ₹${formatInr(row.standard)} · ${row.minHours} hrs`;
  }
  if (service.id === "outstation") {
    return `Approx. from ₹${formatInr(CALL_DRIVER_TARIFF.outstation.perDayStandard)}/day`;
  }
  if (service.id === "valet") {
    return `Approx. from ₹${formatInr(CALL_DRIVER_TARIFF.valet.driverRate)} · ${CALL_DRIVER_TARIFF.valet.minHours} hrs`;
  }
  return labeled;
}

export default function CallDriverHomeSection({ services: servicesProp }) {
  const services = Array.isArray(servicesProp) && servicesProp.length ? servicesProp : CALL_DRIVER_SERVICES;

  return (
    <section id="call-driver-home" className="home-band home-band-sky">
      <div className="section-shell">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[1.25rem] font-extrabold tracking-tight text-[var(--cabzii-ink)] sm:text-[1.65rem]">
              Need a driver for your own car?
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--cabzii-muted)]">
              You keep the car. Cabzii assigns a driver after you confirm.
            </p>
          </div>
          <Link href="/call-driver" className="shrink-0 text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
            All services
          </Link>
        </div>

        <ul className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          {services.map((service) => (
            <li key={service.id} className="border-b border-slate-100 last:border-b-0">
              <Link
                href={callDriverBookHref(service.id)}
                className="flex items-center gap-3 px-3 py-3 hover:bg-[#f4f6fa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--cabzii-brand)] sm:px-4"
              >
                <span className="flex h-12 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--cabzii-sky)]">
                  <CallDriverServiceIcon id={service.id} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-extrabold leading-snug text-slate-900">
                    {service.shortTitle || service.title}
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-slate-600">{service.blurb}</span>
                  <span className="mt-1 block text-[12px] font-semibold text-slate-800">{rowFare(service)}</span>
                </span>
                <span className="shrink-0 rounded-[10px] bg-[var(--cabzii-brand)] px-3 py-2 text-[13px] font-bold text-white">
                  {service.quoteOnly ? "Quote" : "Book"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
