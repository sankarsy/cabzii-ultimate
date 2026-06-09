import Link from "next/link";
import SectionIntro from "../ui/SectionIntro";
import {
  CORE_INTERNAL_LINKS,
  INTERNAL_LINK_CITIES,
  actingDriverLinks,
  cabBookingLinks,
  routeLinks,
  serviceLinks,
  serviceLinksForCities
} from "../../lib/seo/internalLinks";

/** Compact horizontal scroll — avoids tall link columns on mobile. */
function LinkScrollStrip({ title, items }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <div
        className="scroll-x-touch -mx-1 mt-3 flex gap-2 overflow-x-auto pb-1 pt-0.5"
        role="list"
        aria-label={title}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            role="listitem"
            className="shrink-0 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-[var(--cabzii-brand)]/35 hover:bg-[var(--cabzii-brand-light)] hover:text-[var(--cabzii-brand)] sm:text-sm"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function LinkColumn({ title, items }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <ul className="scroll-x-touch -mx-1 mt-3 flex max-h-none gap-2 overflow-x-auto pb-1 pt-0.5 sm:mx-0 sm:max-h-48 sm:flex-col sm:overflow-y-auto sm:overflow-x-hidden sm:space-y-2 sm:pr-1 scrollbar-hide">
        {items.map((item) => (
          <li key={item.href} className="shrink-0 sm:shrink">
            <Link
              href={item.href}
              className="inline-block whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 transition hover:border-[var(--cabzii-brand)]/35 hover:bg-[var(--cabzii-brand-light)] hover:text-[var(--cabzii-brand)] hover:underline sm:block sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-sm"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function InternalLinksHub({ title = "Explore Cabzii across South India" }) {
  const cabs = cabBookingLinks(INTERNAL_LINK_CITIES.length);
  const drivers = actingDriverLinks(INTERNAL_LINK_CITIES.length);
  const routes = routeLinks();
  const servicesChennai = serviceLinks("chennai");
  const servicesMoreCities = serviceLinksForCities(["bengaluru", "hyderabad", "coimbatore", "madurai"]);

  return (
    <section id="explore" className="py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <SectionIntro
          eyebrow="Plan your trip"
          title={title}
          subtitle="Browse cabs, drivers, tour packages and city pages — book online with transparent fares on cabzii.in."
        />

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CORE_INTERNAL_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-center shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <span className="block text-sm font-bold text-slate-900">{item.label}</span>
              <span className="mt-1 block text-[10px] text-slate-500">{item.desc}</span>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <LinkScrollStrip title="Cab booking by city" items={cabs} />
          <LinkScrollStrip title="Acting drivers by city" items={drivers} />
          <LinkScrollStrip title="Popular one-way routes" items={routes} />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <LinkColumn title="Services in Chennai" items={servicesChennai} />
          <LinkColumn title="Services — Bengaluru, Hyderabad & more" items={servicesMoreCities} />
        </div>
      </div>
    </section>
  );
}
