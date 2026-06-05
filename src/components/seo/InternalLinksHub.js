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

function LinkColumn({ title, items, scrollable = false }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <ul
        className={`mt-3 space-y-2 ${scrollable ? "max-h-72 overflow-y-auto pr-1 scrollbar-hide max-md:max-h-none max-md:overflow-visible" : ""}`}
      >
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-xs text-slate-600 transition hover:text-[#0056D2] hover:underline sm:text-sm"
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

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <LinkColumn title="Cab booking by city" items={cabs} scrollable />
          <LinkColumn title="Acting drivers by city" items={drivers} scrollable />
          <LinkColumn title="Popular one-way routes" items={routes} />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <LinkColumn title="Services in Chennai" items={servicesChennai} scrollable />
          <LinkColumn
            title="Services — Bengaluru, Hyderabad & more"
            items={servicesMoreCities}
            scrollable
          />
        </div>
      </div>
    </section>
  );
}
