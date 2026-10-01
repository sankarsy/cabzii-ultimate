"use client";

import Link from "next/link";
import { Building2, CarFront, ChevronRight, GraduationCap, MapPin, Plane, Route } from "lucide-react";
import { callDriverBookHref, formatFromPrice } from "../../lib/callDriver";
import ApproxPriceNote from "../ui/ApproxPriceNote";

const SERVICE_ICONS = {
  local: MapPin,
  outstation: Route,
  airport: Plane,
  school: GraduationCap,
  corporate: Building2,
  valet: CarFront
};

export default function CallDriverServiceGrid({ services = [], pickup = "" }) {
  return (
    <div>
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((svc) => {
        const from = formatFromPrice(svc.fromPrice);
        const fromLabel = svc.id === "outstation" && from ? `${from}/day` : from;
        const Icon = SERVICE_ICONS[svc.id] || MapPin;
        return (
          <li key={svc.id}>
            <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-[var(--cabzii-brand)] sm:h-10 sm:w-10">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold leading-snug text-slate-900 sm:text-[15px]">{svc.title}</h3>
                  <p className="mt-1 text-xs leading-snug text-slate-600 sm:text-sm">{svc.blurb}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2 sm:mt-4 sm:gap-3">
                {svc.quoteOnly ? (
                  <p className="text-xs font-semibold text-slate-700 sm:text-sm">
                    {svc.id === "corporate" ? "Corporate quote" : "Request a quote"}
                  </p>
                ) : fromLabel ? (
                  <p className="text-xs font-bold text-[var(--cabzii-brand)] sm:text-sm">{fromLabel}</p>
                ) : (
                  <span />
                )}
                <Link
                  href={callDriverBookHref(svc.id, pickup ? { pickup } : {})}
                  className="cabzii-btn cabzii-btn-cta cabzii-btn-sm cabzii-tap shrink-0 px-3 sm:px-4"
                >
                  {svc.cta}
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
    <ApproxPriceNote />
    </div>
  );
}
