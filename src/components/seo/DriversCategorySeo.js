import Link from "next/link";
import Breadcrumbs from "./Breadcrumbs";
import RelatedSeoLinks from "./RelatedSeoLinks";
import { actingDriverLinks, serviceLinks } from "../../lib/seo/internalLinks";

export default function DriversCategorySeo() {
  const cities = actingDriverLinks(12);
  const chennaiDriverServices = serviceLinks("chennai", 12).filter((l) =>
    /driver|chauffeur/i.test(l.service || "")
  );

  return (
    <article className="section-shell cabzii-seo-landing pb-10">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Drivers", path: "/drivers" }
        ]}
      />
      <p className="cabzii-seo-kicker">Cabzii · Driver services</p>
      <h1>Driver hire &amp; chauffeur services</h1>
      <p className="cabzii-seo-lead">
        Public driver pages on Cabzii are a service: you book an acting driver, chauffeur or driver-on-hire for your own
        car. Cabzii assigns a professional driver after booking. Individual vendor driver records are not listed here as
        a directory.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/call-driver" className="cabzii-btn cabzii-btn-primary cabzii-btn-sm">
          Book Call Driver
        </Link>
        <Link href="/acting-driver" className="cabzii-btn cabzii-btn-secondary cabzii-btn-sm">
          Acting driver by city
        </Link>
        <Link href="/cabs" className="cabzii-btn cabzii-btn-secondary cabzii-btn-sm">
          Book a cab instead
        </Link>
      </div>

      <section className="cabzii-seo-block">
        <h2>What you can book</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li>
            <strong>Acting driver / Call Driver</strong> — chauffeur for your vehicle (hourly, daily, outstation).
          </li>
          <li>
            <strong>Driver on hire</strong> — city packages when you need a professional at the wheel of your car.
          </li>
          <li>
            <strong>Chauffeur service</strong> — corporate, wedding and multi-stop presentation driving.
          </li>
        </ul>
      </section>

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

      {chennaiDriverServices.length ? (
        <section className="cabzii-seo-block">
          <h2>Related Chennai driver services</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {chennaiDriverServices.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:border-sky-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <RelatedSeoLinks page="drivers" title="Related driver pages" />
    </article>
  );
}
