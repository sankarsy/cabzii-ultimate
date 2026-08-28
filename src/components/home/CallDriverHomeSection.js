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
} from "lucide-react";
import { CALL_DRIVER_SERVICES, callDriverBookHref, formatFromPrice } from "../../lib/callDriver";

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
  { n: "3", title: "Cabzii assigns", desc: "A verified driver is assigned after you book." }
];

function fareFor(svc) {
  const from = formatFromPrice(svc.fromPrice);
  if (svc.id === "outstation" && from) return `${from}/day`;
  return from || "";
}

export default function CallDriverHomeSection({ services: servicesProp }) {
  const services = Array.isArray(servicesProp) && servicesProp.length ? servicesProp : CALL_DRIVER_SERVICES;
  const localFare = formatFromPrice(services.find((s) => s.id === "local")?.fromPrice);

  return (
    <section className="border-t border-slate-200 bg-linear-to-b from-sky-50/70 to-white py-8 sm:py-10">
      <div className="section-shell">
        <div className="relative mb-5 sm:mb-6">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--cabzii-brand)]">Call Driver</p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-[1.75rem]">
              Need a driver for your own car?
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              You keep the car. Cabzii sends a professional driver after booking.
            </p>
          </div>
          <div className="mt-3 flex justify-center sm:absolute sm:right-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2">
            <Link href="/call-driver" className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
              View all →
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[var(--cabzii-shadow-card)]">
          <div className="grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <div className="relative overflow-hidden bg-linear-to-br from-[var(--cabzii-brand)] to-blue-500 p-5 text-white sm:p-7">
              <span
                className="absolute -right-6 -top-8 h-32 w-32 rounded-full bg-white/10"
                aria-hidden
              />
              <span
                className="absolute bottom-4 right-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25"
                aria-hidden
              >
                <UserRound className="h-7 w-7" strokeWidth={2} />
              </span>
              <p className="relative text-[11px] font-bold uppercase tracking-wider text-white/80">Driver for your car</p>
              <h3 className="relative mt-1 max-w-sm text-lg font-extrabold leading-snug sm:text-xl">
                Local, outstation, airport, monthly &amp; valet — without hiring a cab.
              </h3>
              <ul className="relative mt-3 flex flex-wrap gap-2">
                <li className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.25} />
                  Verified drivers
                </li>
                <li className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold">You keep your car</li>
                <li className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold">Assigned after booking</li>
              </ul>
              <div className="relative mt-5 flex flex-wrap items-center gap-3">
                <Link href="/call-driver" className="cabzii-btn cabzii-btn-cta cabzii-tap min-h-11 px-5">
                  Book a Driver
                  <ChevronRight className="h-4 w-4" />
                </Link>
                {localFare ? (
                  <p className="text-sm font-bold text-white/95">Local from {localFare.replace(/^From /, "")}</p>
                ) : null}
              </div>
            </div>

            <ol className="grid divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0 md:grid-cols-1 md:divide-x-0 md:divide-y">
              {STEPS.map((step) => (
                <li key={step.n} className="flex gap-3 p-4 sm:p-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sm font-extrabold text-[var(--cabzii-brand)]">
                    {step.n}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900">{step.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-600 sm:text-[13px]">{step.desc}</p>
                  </div>
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
                  className="cabzii-tap group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--cabzii-cta)]/35 hover:shadow-md sm:p-4"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-[var(--cabzii-brand)]">
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
