import Link from "next/link";
import {
  INTERNAL_LINK_CITIES,
  actingDriverLinks,
  cabBookingLinks,
  routeLinks,
  serviceLinks,
  serviceLinksForCities
} from "../../lib/seo/internalLinks";
import { SEO_ROUTES } from "../../lib/seo/routes";

const QUICK_PILLS = [
  { href: "/cabs", label: "Cabs" },
  { href: "/holidays", label: "Holidays" },
  { href: "/drivers", label: "Drivers" },
  { href: "/locations", label: "Locations" },
  { href: "/blogs", label: "Blog" }
];

function FooterLinkList({ title, items }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-white">{title}</h4>
      <ul className="scroll-x-touch -mx-1 mt-3 flex max-h-none gap-2 overflow-x-auto pb-1 text-sm text-slate-400 sm:mx-0 sm:max-h-48 sm:flex-col sm:space-y-2 sm:overflow-y-auto sm:overflow-x-hidden sm:pr-1 scrollbar-hide">
        {items.map((item) => (
          <li key={item.href} className="shrink-0 sm:shrink">
            <Link
              href={item.href}
              className="inline-block whitespace-nowrap rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs hover:border-sky-500 hover:text-sky-400 sm:block sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-sm"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FooterSeoLinks() {
  const cabs = cabBookingLinks(INTERNAL_LINK_CITIES.length);
  const drivers = actingDriverLinks(INTERNAL_LINK_CITIES.length);
  const routes = routeLinks(SEO_ROUTES.length);
  const servicesChennai = serviceLinks("chennai");
  const servicesOther = serviceLinksForCities(["bengaluru", "hyderabad", "coimbatore"]);

  return (
    <div className="mt-10 border-t border-slate-800 pt-8">
      <div className="mb-6 flex flex-wrap gap-2">
        {QUICK_PILLS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-300 transition hover:border-sky-500 hover:text-sky-400"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <FooterLinkList title="Cab booking by city" items={cabs} />
        <FooterLinkList title="Acting drivers by city" items={drivers} />
        <FooterLinkList title="Services in Chennai" items={servicesChennai} />
        <FooterLinkList title="Services — BLR, HYD & CBE" items={servicesOther} />
        <FooterLinkList title="Popular one-way routes" items={routes} />
      </div>
    </div>
  );
}
