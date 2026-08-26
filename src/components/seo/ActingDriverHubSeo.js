import Link from "next/link";
import Breadcrumbs from "./Breadcrumbs";
import RelatedSeoLinks from "./RelatedSeoLinks";
import { actingDriverLinks } from "../../lib/seo/internalLinks";

export default function ActingDriverHubSeo() {
  const cities = actingDriverLinks(16);

  return (
    <article className="section-shell cabzii-seo-landing pb-10">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Call Driver", path: "/call-driver" },
          { name: "Acting driver", path: "/acting-driver" }
        ]}
      />
      <p className="cabzii-seo-kicker">Service · Your car, our driver</p>
      <h1>Acting driver — chauffeur on hire</h1>
      <p className="cabzii-seo-lead">
        Acting driver is a Cabzii service. You choose the city and package, enter date, time and your vehicle details,
        then pay Cabzii. A driver is assigned after booking. This is not a public directory of vendor drivers.
      </p>
      <div className="mt-4">
        <Link href="/call-driver" className="cabzii-btn cabzii-btn-primary cabzii-btn-sm">
          Book Call Driver
        </Link>
      </div>
      <section className="cabzii-seo-block">
        <h2>Choose a city</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {cities.map((item) => (
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
      </section>
      <RelatedSeoLinks page="drivers" title="Related driver services" />
    </article>
  );
}
