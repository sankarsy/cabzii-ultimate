import Link from "next/link";
import Breadcrumbs from "./Breadcrumbs";
import RelatedSeoLinks from "./RelatedSeoLinks";
import ChennaiClusterLinks from "./ChennaiClusterLinks";
import SeoPageView from "./SeoPageView";
import { actingDriverLinks } from "../../lib/seo/internalLinks";

export default function ActingDriverHubSeo() {
  const cities = actingDriverLinks(12);

  return (
    <article className="section-shell cabzii-seo-landing pb-10">
      <SeoPageView pageType="acting-driver-hub" />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Acting driver", path: "/acting-driver" }
        ]}
      />
      <p className="cabzii-seo-kicker">Service · Your car, our driver</p>
      <h1>Acting Driver — Hire a Driver for Your Own Car</h1>
      <p className="cabzii-seo-lead">
        Acting driver (call driver / driver on hire) is a Cabzii service: a professional drives your vehicle. Choose a
        city guide, then book on Call Driver. Cabzii assigns a driver after you confirm — this is not a public driver
        directory.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/call-driver" className="cabzii-btn cabzii-btn-primary cabzii-btn-sm">
          Book Call Driver
        </Link>
        <Link href="/acting-driver/chennai" className="cabzii-btn cabzii-btn-secondary cabzii-btn-sm">
          Acting driver in Chennai
        </Link>
      </div>

      <section className="cabzii-seo-block">
        <h2>What you can book</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li>Local acting driver (4-hour minimum on the current tariff)</li>
          <li>Outstation driver for highway days in your car</li>
          <li>Airport chauffeur in your vehicle (not an airport taxi)</li>
          <li>Monthly and corporate drivers (quoted after you share the schedule)</li>
          <li>Valet drivers for events and functions</li>
        </ul>
      </section>

      <ChennaiClusterLinks title="Chennai — highest-demand Cabzii services" excludeHref="/acting-driver" />

      <section className="cabzii-seo-block">
        <h2>Acting driver by city</h2>
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
