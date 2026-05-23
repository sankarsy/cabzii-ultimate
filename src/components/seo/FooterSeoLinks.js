import Link from "next/link";
import { SEO_CITIES, SEO_ROUTES, SEO_SERVICES } from "../../lib/seo";
import { servicePath } from "../../lib/seo/services";

const FEATURED_CITIES = ["chennai", "bengaluru", "hyderabad", "coimbatore", "madurai", "mysore"];

export default function FooterSeoLinks() {
  const cities = SEO_CITIES.filter((c) => FEATURED_CITIES.includes(c.slug));
  const services = SEO_SERVICES.slice(0, 6);
  const routes = SEO_ROUTES.slice(0, 6);

  return (
    <div className="mt-10 border-t border-slate-800 pt-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div>
          <h4 className="text-sm font-semibold text-white">Cab booking by city</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            {cities.map((city) => (
              <li key={city.slug}>
                <Link href={`/cab-booking/${city.slug}`} className="hover:text-sky-300">
                  Cab booking {city.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Popular services</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            {services.map((svc) => (
              <li key={svc.slug}>
                <Link href={servicePath(svc, cities[0])} className="hover:text-sky-300">
                  {svc.name} Chennai
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">One way routes</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            {routes.map((route) => (
              <li key={route.slug}>
                <Link href={`/routes/${route.slug}`} className="hover:text-sky-300">
                  {route.slug.replace(/-/g, " ").replace(/ cab$/, "")}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
