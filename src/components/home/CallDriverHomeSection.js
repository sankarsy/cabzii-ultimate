"use client";

import Link from "next/link";
import {
  Building2,
  CarFront,
  ChevronRight,
  GraduationCap,
  MapPin,
  Plane,
  Route,
  ShieldCheck,
  UserRound
} from "../icons/rscIcons";
import { CALL_DRIVER_SERVICES, callDriverBookHref, formatFromPrice } from "../../lib/callDriver";
import { CALL_DRIVER_TARIFF } from "../../data/call-drivers-chennai";
import { CLAIMS } from "../../config/claims";
import { formatInr } from "../../lib/formatInr";
import HomeSectionHeader from "./HomeSectionHeader";

const SERVICE_ICONS = {
  local: MapPin,
  outstation: Route,
  airport: Plane,
  school: GraduationCap,
  corporate: Building2,
  valet: CarFront
};

const STEPS = [
  { n: "1", title: "Pick a service", desc: "Local, outstation, airport, monthly, corporate or valet." },
  { n: "2", title: "Add trip details", desc: "Date, time, pickup and your vehicle." },
  { n: "3", title: "Cabzii assigns", desc: "A professional driver is assigned after you book." }
];

function fareFor(svc) {
  const from = formatFromPrice(svc.fromPrice);
  if (svc.id === "outstation" && from) return `${from}/day`;
  return from || "";
}

export default function CallDriverHomeSection({ services: servicesProp }) {
  const services = Array.isArray(servicesProp) && servicesProp.length ? servicesProp : CALL_DRIVER_SERVICES;
  const localFrom = Number(services.find((s) => s.id === "local")?.fromPrice);
  const localAmount = Number.isFinite(localFrom) && localFrom > 0 ? localFrom : CALL_DRIVER_TARIFF.local.standard;
  const localFare = `₹${formatInr(localAmount)} · ${CALL_DRIVER_TARIFF.local.minHours} hours`;

  return (
    <section className="home-band home-band-sky">
      <div className="section-shell">
        <HomeSectionHeader
          eyebrow="Call Driver"
          title="Need a driver for your own car?"
          subtitle="You keep the car. Cabzii sends a professional driver after booking."
          href="/call-driver"
          linkLabel="View all →"
        />

        <div className="overflow-hidden rounded-[22px] bg-[var(--cabzii-ink)] text-white shadow-[var(--cabzii-shadow-card)]">
          <div className="grid gap-5 p-5 sm:gap-6 sm:p-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="relative">
              <span className="absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/10" aria-hidden />
              <span
                className="absolute bottom-2 right-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25"
                aria-hidden
              >
                <UserRound className="h-6 w-6" strokeWidth={2} />
              </span>
              <p className="relative text-[11px] font-bold uppercase tracking-wider text-[#b9c6ee]">Driver for your car</p>
              <p className="relative mt-2 max-w-sm text-sm text-[#d5def8]">
                Local from <span className="font-bold text-white">{localFare}</span>
              </p>
              <ul className="relative mt-3 flex flex-wrap gap-2">
                <li className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.25} />
                  {CLAIMS.verifiedDrivers ? "Verified drivers" : "Assigned after booking"}
                </li>
                <li className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold">You keep your car</li>
              </ul>
              <div className="relative mt-5">
                <Link href="/call-driver" className="cabzii-btn cabzii-btn-cta cabzii-tap min-h-11 px-5">
                  Book a Driver
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <ol className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {STEPS.map((step) => (
                <li key={step.n} className="rounded-[14px] bg-white/8 p-3.5">
                  <p className="font-[family-name:var(--font-sora)] text-[13px] font-bold text-[var(--cabzii-cta)]">
                    Step {step.n}
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">{step.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#b9c6ee]">{step.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <ul className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
          {services.map((svc) => {
            const Icon = SERVICE_ICONS[svc.id] || MapPin;
            const fare = fareFor(svc);
            return (
              <li key={svc.id}>
                <Link
                  href={callDriverBookHref(svc.id)}
                  className="cabzii-tap group flex h-full flex-col rounded-2xl border border-[var(--cabzii-border)] bg-white p-3.5 shadow-sm transition hover:-translate-y-[3px] hover:border-[var(--cabzii-brand)] hover:shadow-md sm:p-4"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--cabzii-sky)] text-[var(--cabzii-brand)]">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <h3 className="mt-2.5 text-[13px] font-bold leading-snug text-slate-900 sm:text-sm">{svc.shortTitle || svc.title}</h3>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-600 sm:text-xs">{svc.blurb}</p>
                  <span className={`mt-auto flex items-center gap-2 border-t border-slate-100 pt-2.5 ${fare ? "justify-between" : "justify-end"}`}>
                    {fare ? (
                      <span className="text-xs font-extrabold text-[var(--cabzii-cta)] sm:text-sm">{fare}</span>
                    ) : null}
                    <span className="inline-flex items-center text-[11px] font-extrabold tracking-wide text-[var(--cabzii-cta)]">
                      {svc.quoteOnly ? "Quote" : "Book"}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
