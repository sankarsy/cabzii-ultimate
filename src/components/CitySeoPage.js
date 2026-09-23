import Link from "next/link";
import Breadcrumbs from "./seo/Breadcrumbs";
import FaqSection from "./seo/FaqSection";
import BookingCtaBar from "./seo/BookingCtaBar";
import RelatedSeoLinks from "./seo/RelatedSeoLinks";
import SeoPageView from "./seo/SeoPageView";
import { peerCitiesForHub, isTamilNaduCity, isPrimaryFocusCity } from "../lib/seo";
import { actingDriverLandingPath } from "../lib/cityCabPaths";
import { classifyRoute } from "../lib/seo/indexation";
import { getCityFaqs } from "../lib/seo/content";
import { cityHasCommercialAirport } from "../lib/seo/airports";
import { tunedActingDriverH1 } from "../lib/seo/metadataTuning";
import { servicesForCityHub } from "../lib/seo/programmaticMeta";
import { routesForCity } from "../lib/seo/routes";
import { servicePath } from "../lib/seo/services";

export default function CitySeoPage({ city, extraBody = "", headingOverride = "", faqsOverride = null }) {
  const title = headingOverride || tunedActingDriverH1(city);
  const hubPath = actingDriverLandingPath(city.slug);
  const faqs =
    Array.isArray(faqsOverride) && faqsOverride.length
      ? faqsOverride
      : getCityFaqs(city, "driver");
  const cityRoutes = routesForCity(city.slug)
    .filter((route) => classifyRoute(route).indexable)
    .sort((a, b) => classifyRoute(b).commercialScore - classifyRoute(a).commercialScore)
    .slice(0, 8);
  const topServices = servicesForCityHub(city.slug, 4);

  return (
    <article className="section-shell cabzii-seo-landing">
      <SeoPageView pageType="acting-driver" city={city.slug} />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Acting driver", path: "/acting-driver" },
          { name: `Acting Driver in ${city.name}`, path: hubPath }
        ]}
      />

      <p className="cabzii-seo-kicker">{city.state} · Cabzii</p>
      <h1>{title}</h1>
      <p className="cabzii-seo-lead">
        Book a Cabzii Call Driver / acting driver in {city.name} for your own car — local, outstation and airport driver
        service. Cabzii assigns a professional driver after you book.
      </p>
      {!isPrimaryFocusCity(city) ? (
        <p className="mt-2 text-[11px] text-slate-600 sm:text-xs">
          Availability in {city.name} is confirmed when you search. Quotes depend on partner vehicles on your travel date.
        </p>
      ) : null}

      <BookingCtaBar variant="compact" bookHref="/call-driver" bookLabel={`Book a driver in ${city.name}`} />

      {extraBody ? (
        <div
          className="prose prose-slate mt-6 max-w-none text-sm text-slate-700 md:text-base"
          dangerouslySetInnerHTML={{ __html: extraBody }}
        />
      ) : null}

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Link href="/call-driver" className="cabzii-btn cabzii-btn-primary cabzii-btn-sm">
          Book a driver in {city.name}
        </Link>
        <Link href="/cabs" className="cabzii-btn cabzii-btn-secondary cabzii-btn-sm">
          Browse all cabs
        </Link>
      </div>

      <section className="cabzii-seo-block">
        <h2>Driver services in {city.name}</h2>
        <ul className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
          {topServices.map((svc) => (
            <li key={svc.slug}>
              <Link
                href={servicePath(svc, city)}
                title={`${svc.name} in ${city.name} — book on Cabzii.in`}
                className="block rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm hover:border-[var(--cabzii-brand)]/30 hover:text-[var(--cabzii-brand)]"
              >
                <span className="block">
                  {svc.name} in {city.name}
                </span>
                <span className="mt-0.5 block text-xs font-normal text-slate-500">
                  View {svc.name.toLowerCase()} packages →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {cityRoutes.length ? (
        <section className="cabzii-seo-block">
          <h2>Popular routes from {city.name}</h2>
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {cityRoutes.map((route) => (
              <li key={route.slug}>
                <Link
                  href={`/routes/${route.slug}`}
                  className="inline-block rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-[var(--cabzii-brand)]"
                >
                  {route.fromCity.name} → {route.toCity.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="cabzii-seo-block">
        <h2>Why hire acting drivers on Cabzii?</h2>
        <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[11px] text-slate-700 sm:text-xs">
          <li>Instant online booking with clear fare breakdown</li>
          <li>Professional partner drivers in {city.name}</li>
          <li>
            {cityHasCommercialAirport(city.slug)
              ? "Outstation, airport, local and tour options in one place"
              : "Outstation, local, one-way and acting-driver options in one place"}
          </li>
          <li>Support on WhatsApp for quick trip changes</li>
        </ul>
      </section>

      <FaqSection title={`${city.name} — FAQ`} faqs={faqs} />

      <RelatedSeoLinks page="drivers" citySlug={city.slug} title={`Related driver services in ${city.name}`} />

      <section className="cabzii-seo-block">
        <h2>{isTamilNaduCity(city) ? "Other Tamil Nadu cities" : "Other service cities"}</h2>
        <ul className="mt-2.5 flex flex-wrap gap-1.5">
          {peerCitiesForHub(city, 12).map((peer) => (
            <li key={peer.slug}>
              <Link
                href={actingDriverLandingPath(peer.slug)}
                className="inline-block rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-[var(--cabzii-brand)]"
              >
                {peer.name}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/locations" className="mt-2 inline-block text-[11px] font-semibold sm:text-xs text-[var(--cabzii-brand)] hover:underline">
          View all service locations →
        </Link>
      </section>
    </article>
  );
}
