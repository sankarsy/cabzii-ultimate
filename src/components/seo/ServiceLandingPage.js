import Link from "next/link";
import Breadcrumbs from "./Breadcrumbs";
import BookingCtaBar from "./BookingCtaBar";
import FaqSection from "./FaqSection";
import SerpRichBar from "./SerpRichBar";
import SeoPackageBookingSection from "./SeoPackageBookingSection";
import SeoTripBookingSection from "./SeoTripBookingSection";
import { cityAreas } from "../../lib/seo/content";
import { serviceSearchHref, tunedServiceDescription, tunedServiceH1 } from "../../lib/seo/metadataTuning";
import { formatSerpPrice, serviceSerpBadges } from "../../lib/seo/serpRichData";
import { servicePath } from "../../lib/seo/services";
import { routesForCity } from "../../lib/seo/routes";
import { driverTripToSearchQuery } from "../../lib/driverTrip";
import { todayStr } from "../../lib/mmtTrip";

/** Map SEO service slug → search widget trip type so the right tab is pre-selected */
const SERVICE_TRIP_TYPES = {
  "airport-taxi": "airport",
  "hourly-rental": "hourly",
  "car-rental": "hourly",
  "cab-rental": "hourly",
  "local-taxi": "hourly",
  "chauffeur-service": "hourly"
};

const DRIVER_FOCUS_SLUGS = new Set(["chauffeur-service", "acting-driver"]);

export default function ServiceLandingPage({
  city,
  service,
  faqs,
  extraBody = "",
  reviewStats,
  cabs = [],
  drivers = [],
  packages = []
}) {
  const path = servicePath(service, city);
  const areas = cityAreas(city.slug);
  const isTourPackages = service.slug === "tour-packages" || service.slug === "holiday-packages";
  const seenRouteSlugs = new Set();
  const cityRoutes = isTourPackages
    ? []
    : routesForCity(city.slug).filter((route) => {
        if (seenRouteSlugs.has(route.slug)) return false;
        seenRouteSlugs.add(route.slug);
        return true;
      });
  const searchHref = serviceSearchHref(service, city);
  const h1 = tunedServiceH1(service, city);
  const lead = tunedServiceDescription(service, city);
  const serpBadges = serviceSerpBadges(service, city);
  const tripType = SERVICE_TRIP_TYPES[service.slug] || "outstation";
  const widgetTrip = {
    from: city.name,
    tripType,
    date: todayStr(),
    time: "09:00",
    packageHours: 8
  };
  const driverFocus = DRIVER_FOCUS_SLUGS.has(service.slug);
  const driverSearchHref = `/drivers/results?${driverTripToSearchQuery({
    ...widgetTrip,
    tripType: tripType === "airport" ? "outstation" : tripType
  }).toString()}`;
  const dropHint =
    tripType === "airport"
      ? `${city.name} Airport`
      : tripType === "outstation"
        ? "Choose drop city"
        : `${city.name} local drop`;

  return (
    <article className="section-shell py-6 sm:py-10 md:py-14">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: city.name, path: `/cab-booking/${city.slug}` },
          { name: service.name, path }
        ]}
      />

      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-600 sm:text-xs">
        {city.state} · {service.name}
      </p>
      <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:mt-3 sm:text-3xl md:text-4xl">{h1}</h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:mt-4 sm:text-base md:text-lg">{lead}</p>

      <SerpRichBar
        ratingValue={reviewStats?.ratingValue}
        reviewCount={reviewStats?.reviewCount}
        priceLabel={formatSerpPrice(service.priceFrom)}
        badges={serpBadges}
      />

      {isTourPackages ? (
        <SeoPackageBookingSection
          title={`Book tour packages in ${city.name}`}
          cityName={city.name}
          priceFrom={service.priceFrom}
          browseHref={searchHref}
          packages={packages}
        />
      ) : (
        <SeoTripBookingSection
          title={`Book ${service.name} in ${city.name}`}
          pickup={city.name}
          drop={dropHint}
          priceFrom={service.priceFrom}
          priceLabel={formatSerpPrice(service.priceFrom)}
          cabSearchHref={searchHref}
          driverSearchHref={driverSearchHref}
          cabs={cabs}
          drivers={driverFocus ? drivers : []}
          trip={widgetTrip}
          showCabWidget
          showDriverWidget={driverFocus}
          showDriverCta={driverFocus}
          widgetDefaultCity={city.name}
          widgetInitialTrip={widgetTrip}
          allowedTripTypes={[tripType]}
        />
      )}

      {cityRoutes.length ? (
        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Popular one-way routes</h2>
          <p className="mt-2 text-sm text-slate-600">
            Fixed-fare one-way cabs to and from {city.name} — tap a route to see live fares.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {cityRoutes.map((route) => (
              <li key={route.slug}>
                <Link
                  href={`/routes/${route.slug}`}
                  className="inline-block rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-[var(--emt-orange)] hover:bg-[#fff4ee] hover:text-[var(--emt-orange)]"
                >
                  {route.fromCity.name} → {route.toCity.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {extraBody ? (
        <div
          className="prose prose-slate mt-4 max-w-none text-sm text-slate-700"
          dangerouslySetInnerHTML={{ __html: extraBody }}
        />
      ) : null}

      <BookingCtaBar
        bookHref={searchHref}
        bookLabel={isTourPackages ? `Browse packages in ${city.name}` : `Book ${service.name} in ${city.name}`}
        quoteLabel="WhatsApp instant quote"
        airportDirection={service.slug === "airport-taxi" ? "pickup" : undefined}
        variant="compact"
      />
      <div className="mt-3">
        <Link
          href={isTourPackages ? "/holidays" : `/cab-booking/${city.slug}`}
          className="text-xs font-semibold text-[var(--cabzii-brand)] hover:underline"
        >
          {isTourPackages ? "All holiday packages →" : `All cabs in ${city.name} →`}
        </Link>
      </div>

      {["car-rental", "cab-rental", "hourly-rental", "local-taxi"].includes(service.slug) ? (
        <section className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
            {city.name} cabs — hourly packages &amp; fares
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            Choose a cab package that fits your trip — popular slabs include{" "}
            <strong>4 hours</strong> / 40 km and <strong>8 hours</strong> / 80 km for local {city.name} errands, weddings
            and sightseeing. Extra hours and km rates are shown on each package before you pay on Cabzii.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>4 hours local package — meetings, shopping, hospital visits</li>
            <li>8 hours full-day package — weddings, multi-stop city tours</li>
            <li>12 hours package — long wedding days and corporate events</li>
          </ul>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Why book on Cabzii?</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {service.highlights.map((item) => (
            <li
              key={item}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      {areas.length ? (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Areas we serve in {city.name}</h2>
          <p className="mt-2 text-sm text-slate-600">
            Pickup available across popular neighbourhoods including {areas.join(", ")} and nearby localities.
          </p>
        </section>
      ) : null}

      <FaqSection title={`${service.name} in ${city.name} — FAQ`} faqs={faqs} />

      <section className="mt-10 rounded-2xl bg-[var(--cabzii-brand)] p-5 text-white md:p-6">
        <h2 className="text-lg font-bold md:text-xl">Ready to book {service.name.toLowerCase()}?</h2>
        <p className="mt-1.5 text-xs text-blue-100 md:text-sm">
          Compare vendors, see fare upfront and confirm in minutes — no app download required.
        </p>
        <Link
          href={searchHref}
          className="cabzii-btn cabzii-btn-sm cabzii-tap mt-3 inline-flex rounded-full bg-white font-bold text-[var(--cabzii-brand)] hover:bg-slate-100"
        >
          {isTourPackages ? "Browse packages" : "Search & book now"}
        </Link>
      </section>
    </article>
  );
}
