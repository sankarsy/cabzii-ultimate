import Link from "next/link";
import { cityCabLandingPath } from "../../lib/cityCabPaths";
import { cityBySlug } from "../../lib/seo/cities";
import { routeLinksForCity } from "../../lib/seo/internalLinks";

const HOME_HUB_CITIES = [
  "chennai",
  "coimbatore",
  "madurai",
  "trichy",
  "salem",
  "pondicherry",
  "tirupati",
  "bengaluru"
];

const CHENNAI_SERVICES = [
  { href: "/services/airport-taxi/chennai", label: "Airport taxi Chennai", hint: "Pickup and drop" },
  { href: "/services/outstation-cab/chennai", label: "Outstation cab Chennai", hint: "One-way and round-trip" },
  { href: "/services/hourly-rental/chennai", label: "Local package Chennai", hint: "4 hr / 8 hr hire" },
  { href: "/call-drivers-chennai", label: "Acting driver Chennai", hint: "Driver for your car" }
];

function HubCard({ href, title, hint }) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-slate-200 bg-white px-3 py-2.5 hover:border-[var(--cabzii-brand)]"
    >
      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[var(--cabzii-brand)]">{title}</h3>
      {hint ? <p className="mt-0.5 text-xs text-slate-500">{hint}</p> : null}
    </Link>
  );
}

/** Homepage discovery links — unique city/route hubs, not a keyword dump. */
export default function HomeSeoDiscover() {
  const cities = HOME_HUB_CITIES.map((slug) => cityBySlug(slug)).filter(Boolean);
  const routes = routeLinksForCity("chennai", 8);

  return (
    <section className="border-t border-slate-200 bg-slate-50 py-8 sm:py-10">
      <div className="section-shell">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg">Book a cab in Chennai</h2>
        <p className="mt-1 text-sm text-slate-600">Airport, outstation, local packages and acting driver — then get your fare.</p>
        <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {CHENNAI_SERVICES.map((item) => (
            <li key={item.href}>
              <HubCard href={item.href} title={item.label} hint={item.hint} />
            </li>
          ))}
        </ul>

        <h2 className="mt-8 text-base font-bold text-slate-900 sm:text-lg">Our top cities</h2>
        <p className="mt-1 text-sm text-slate-600">City cab booking pages with unique fares and routes.</p>
        <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((city) => (
            <li key={city.slug}>
              <HubCard
                href={cityCabLandingPath(city.slug)}
                title={`Cab booking in ${city.name}`}
                hint={city.slug === "chennai" ? "Maduravoyal HQ · city-wide pickup" : `${city.state} taxi booking`}
              />
            </li>
          ))}
        </ul>

        <h2 className="mt-8 text-base font-bold text-slate-900 sm:text-lg">Top outstation routes</h2>
        <p className="mt-1 text-sm text-slate-600">One-way and round-trip cabs from Chennai.</p>
        <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {routes.map((item) => (
            <li key={item.href}>
              <HubCard href={item.href} title={`${item.label} cab`} hint="Fares shown before you confirm" />
            </li>
          ))}
        </ul>

        <h2 className="mt-8 text-base font-bold text-slate-900 sm:text-lg">More on Cabzii</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {[
            { href: "/tariff", label: "Chennai tariff" },
            { href: "/cabs", label: "All cabs" },
            { href: "/call-driver", label: "Call Driver" },
            { href: "/holidays", label: "Tours" },
            { href: "/routes", label: "All routes" },
            { href: "/services", label: "Services" },
            { href: "/blogs", label: "Blog" }
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="inline-block rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:border-sky-300"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
