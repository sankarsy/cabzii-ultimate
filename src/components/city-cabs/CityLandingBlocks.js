import Link from "next/link";
import TrackedLeadCtas from "../conversion/TrackedLeadCtas";
import ApproxPriceNote from "../ui/ApproxPriceNote";
import { APPROX_PRICE_LABEL } from "../../lib/approxPrice";
import { ORG_ADDRESS, ORG_EMAIL, ORG_PHONE, ORG_MAPS_URL } from "../../lib/seo/constants";
import { formatInrCurrency } from "../../lib/formatInr";

export function LinkChips({ items }) {
  if (!items?.length) return null;
  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="inline-block rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:border-sky-300"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function TrustStrip({ items }) {
  if (!items?.length) return null;
  return (
    <section className="border-b border-slate-200 bg-white">
      <ul className="section-shell grid grid-cols-2 gap-px bg-slate-200 py-0 sm:grid-cols-4">
        {items.map((item) => (
          <li key={item.label} className="bg-white px-2 py-2 text-center sm:px-3 sm:py-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--cabzii-brand)] sm:text-[11px]">{item.label}</p>
            <p className="mt-0.5 text-[11px] font-semibold leading-snug text-slate-800 sm:text-xs">{item.value}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ServiceCards({ title, subtitle, items }) {
  if (!items?.length) return null;
  return (
    <section className="section-shell py-5 sm:py-7">
      {title ? <h2 className="text-base font-bold text-slate-900 sm:text-lg">{title}</h2> : null}
      {subtitle ? <p className="mt-1 text-xs text-slate-600 sm:text-sm">{subtitle}</p> : null}
      <ul className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="block h-full rounded-xl border border-slate-200 bg-white p-3 hover:border-sky-300 sm:p-4">
              <h3 className="text-sm font-bold text-slate-900">{item.label}</h3>
              {item.hint ? <p className="mt-1 text-[11px] leading-relaxed text-slate-600 sm:text-xs">{item.hint}</p> : null}
              <p className="mt-2 text-[11px] font-semibold text-[var(--cabzii-brand)] sm:text-xs">Book →</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function WhyGrid({ title, items }) {
  if (!items?.length) return null;
  return (
    <section className="bg-[#f4f6fa] py-5 sm:py-7">
      <div className="section-shell">
        <h2 className="text-center text-base font-bold text-slate-900 sm:text-lg">{title}</h2>
        <ul className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.title} className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm sm:p-4">
                {Icon ? <Icon className="mx-auto h-5 w-5 text-[var(--cabzii-brand)] sm:h-6 sm:w-6" strokeWidth={1.6} aria-hidden /> : null}
                <h3 className="mt-1.5 text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-600 sm:text-xs">{item.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function HowToSteps({ title, subtitle, steps }) {
  if (!steps?.length) return null;
  return (
    <section className="section-shell py-5 sm:py-7">
      <h2 className="text-base font-bold text-slate-900 sm:text-lg">{title}</h2>
      {subtitle ? <p className="mt-1 text-xs text-slate-600 sm:text-sm">{subtitle}</p> : null}
      <ol className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--cabzii-brand)] sm:text-xs">Step {index + 1}</p>
            <h3 className="mt-1 text-sm font-bold text-slate-900">{step.title}</h3>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 sm:text-sm">{step.subtitle}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function RouteFareGrid({ title, subtitle, routes }) {
  if (!routes?.length) return null;
  return (
    <section className="section-shell pb-5 sm:pb-8">
      <h2 className="text-base font-bold text-slate-900 sm:text-lg">{title}</h2>
      {subtitle ? <p className="mt-1 text-xs text-slate-600 sm:text-sm">{subtitle}</p> : null}
      <ul className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {routes.map((route) => (
          <li key={route.href}>
            <Link href={route.href} className="block rounded-xl border border-slate-200 bg-white p-3 hover:border-sky-300 sm:p-4">
              <h3 className="text-sm font-bold text-slate-900">{route.label}</h3>
              <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
                {route.distance || "Distance on route page"}
                {route.duration ? ` · ${route.duration}` : ""}
              </p>
              <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-bold text-slate-900 sm:text-sm">
                {route.sedanFrom ? (
                  <span>
                    Sedan {formatInrCurrency(route.sedanFrom)}{" "}
                    <span className="font-medium text-slate-400">{APPROX_PRICE_LABEL}</span>
                  </span>
                ) : null}
                {route.suvFrom ? (
                  <span>
                    SUV {formatInrCurrency(route.suvFrom)}{" "}
                    <span className="font-medium text-slate-400">{APPROX_PRICE_LABEL}</span>
                  </span>
                ) : null}
                {route.innovaFrom ? (
                  <span>
                    Innova {formatInrCurrency(route.innovaFrom)}{" "}
                    <span className="font-medium text-slate-400">{APPROX_PRICE_LABEL}</span>
                  </span>
                ) : null}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <ApproxPriceNote />
    </section>
  );
}

export function AreaChips({ title, areas }) {
  if (!areas?.length) return null;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-bold text-slate-900 sm:text-base">{title}</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {areas.map((area) => (
          <li key={area}>
            <span className="inline-block rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800">
              {area}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ContactNap({ title, source, message }) {
  const tel = ORG_PHONE.replace(/[^\d+]/g, "");
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-bold text-slate-900 sm:text-base">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm text-slate-700">
        <li>
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Address</span>
          <a href={ORG_MAPS_URL} className="font-semibold hover:underline">
            {ORG_ADDRESS.streetAddress}, {ORG_ADDRESS.addressLocality}, {ORG_ADDRESS.addressRegion} {ORG_ADDRESS.postalCode}
          </a>
        </li>
        <li>
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Phone</span>
          <a href={`tel:${tel}`} className="font-semibold hover:underline">
            {ORG_PHONE}
          </a>
        </li>
        <li>
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Email</span>
          <a href={`mailto:${ORG_EMAIL}`} className="font-semibold hover:underline">
            {ORG_EMAIL}
          </a>
        </li>
      </ul>
      <div className="mt-3">
        <TrackedLeadCtas source={source} message={message} compact />
      </div>
    </div>
  );
}

export function PlaceGrid({ title, places }) {
  if (!places?.length) return null;
  return (
    <section className="cabzii-seo-block">
      <h2>{title}</h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {places.map((place) => (
          <li key={place.name} className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-bold text-slate-900">{place.name}</h3>
            <p className="mt-1 text-sm text-slate-600">{place.subtitle}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export const CAB_TRUST = [
  { label: "Fare first", value: "Shown before you pay" },
  { label: "Included", value: "Fuel and driver" },
  { label: "Tolls", value: "Extra unless listed" },
  { label: "Confirm", value: "50% advance" }
];
