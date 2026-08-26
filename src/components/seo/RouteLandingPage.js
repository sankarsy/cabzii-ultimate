import Link from "next/link";
import { routeToCabSearchHref, routeToDriverSearchHref, routeToTrip } from "../../lib/routeTrip";
import Breadcrumbs from "./Breadcrumbs";
import BookingCtaBar from "./BookingCtaBar";
import FaqSection from "./FaqSection";
import SeoTripBookingSection from "./SeoTripBookingSection";
import { tunedRouteDescription, tunedRouteH1 } from "../../lib/seo/metadataTuning";
import { servicePath, SEO_SERVICES } from "../../lib/seo/services";
import { formatSerpPrice } from "../../lib/seo/serpRichData";

export default function RouteLandingPage({ route, faqs, extraBody = "", cabs = [] }) {
  const { fromCity, toCity, distance, duration, sedanFrom, suvFrom, slug } = route;
  const path = `/routes/${slug}`;
  const searchHref = routeToCabSearchHref(route);
  const driverHref = routeToDriverSearchHref(route);
  const trip = routeToTrip(route);
  const reverseSlug = `${toCity.slug}-to-${fromCity.slug}-cab`;
  const reversePath = `/routes/${reverseSlug}`;
  const airportSvc = SEO_SERVICES.find((s) => s.slug === "airport-taxi");
  const outstationSvc = SEO_SERVICES.find((s) => s.slug === "outstation-cab");

  return (
    <article className="section-shell cabzii-seo-landing">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: fromCity.name, path: `/cab-booking/${fromCity.slug}` },
          { name: `${fromCity.name} to ${toCity.name}`, path }
        ]}
      />

      <p className="cabzii-seo-kicker">One way cab · Cabzii</p>
      <h1>{tunedRouteH1(route)}</h1>
      <p className="cabzii-seo-lead">
        {tunedRouteDescription(route)} ({distance}, {duration})
      </p>

      <SeoTripBookingSection
        title={`${fromCity.name} → ${toCity.name}`}
        pickup={fromCity.name}
        drop={toCity.name}
        priceFrom={sedanFrom}
        priceLabel={formatSerpPrice(sedanFrom)}
        distance={distance}
        duration={duration}
        cabSearchHref={searchHref}
        cabs={cabs}
        trip={trip}
        showCabWidget
        showDriverCta={false}
        widgetDefaultCity={fromCity.name}
        widgetInitialTrip={trip}
        allowedTripTypes={["outstation"]}
      />

      <BookingCtaBar
        bookHref={searchHref}
        bookLabel="Book Now"
        quoteLabel="Get Quote"
        callLabel="Call Now"
        availabilityLabel="Check Availability"
        routeFrom={fromCity.name}
        routeTo={toCity.name}
        variant="compact"
      />

      <section className="cabzii-seo-block">
        <h2>Distance &amp; travel time</h2>
        <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-[11px] sm:text-xs">
            <tbody>
              <tr className="border-b border-slate-100">
                <th className="px-3 py-2 font-semibold text-slate-700">Route</th>
                <td className="px-3 py-2 text-slate-600">
                  {fromCity.name} → {toCity.name}
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <th className="px-3 py-2 font-semibold text-slate-700">Pickup location</th>
                <td className="px-3 py-2 text-slate-600">{fromCity.name}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <th className="px-3 py-2 font-semibold text-slate-700">Drop location</th>
                <td className="px-3 py-2 text-slate-600">{toCity.name}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <th className="px-3 py-2 font-semibold text-slate-700">Distance</th>
                <td className="px-3 py-2 text-slate-600">{distance}</td>
              </tr>
              <tr>
                <th className="px-3 py-2 font-semibold text-slate-700">Travel time</th>
                <td className="px-3 py-2 text-slate-600">{duration}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="cabzii-seo-block">
        <h2>Cab fare &amp; pricing</h2>
        <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
          <table className="w-full text-left text-[11px] sm:text-xs">
            <tbody>
              <tr className="border-b border-slate-100 bg-white">
                <th className="px-3 py-2 font-semibold text-slate-700">Sedan (Dzire / Amaze)</th>
                <td className="px-3 py-2 font-bold text-slate-900">from ₹{sedanFrom.toLocaleString("en-IN")}</td>
              </tr>
              <tr className="bg-white">
                <th className="px-3 py-2 font-semibold text-slate-700">SUV / Innova</th>
                <td className="px-3 py-2 font-bold text-slate-900">from ₹{suvFrom.toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-1.5 text-[10px] text-slate-500">
          Indicative one-way fares — exact quote on Cabzii before booking. Tolls and state taxes may apply.
        </p>
      </section>

      {extraBody ? (
        <div
          className="prose prose-slate cabzii-seo-block max-w-none text-xs text-slate-700"
          dangerouslySetInnerHTML={{ __html: extraBody }}
        />
      ) : null}

      <section className="cabzii-seo-block">
        <h2>Why choose Cabzii for this route?</h2>
        <ul className="cabzii-seo-card-list mt-2.5 grid gap-2 sm:grid-cols-2">
          {[
            "True one-way pricing — no return empty charge confusion",
            `Highway-experienced drivers on ${fromCity.name} – ${toCity.name}`,
            "Sedan, SUV, Innova and tempo for groups",
            "Instant confirmation with mobile OTP booking",
            "WhatsApp support before and during your trip",
            "Upfront fare breakdown before you pay"
          ].map((item) => (
            <li
              key={item}
              className="rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="cabzii-seo-block">
        <h2>Related services &amp; links</h2>
        <ul className="mt-2.5 flex flex-wrap gap-1.5">
          <li>
            <Link href={`/cab-booking/${fromCity.slug}`} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-[var(--cabzii-brand)]">
              Cab booking {fromCity.name}
            </Link>
          </li>
          {outstationSvc ? (
            <li>
              <Link href={servicePath(outstationSvc, fromCity)} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-[var(--cabzii-brand)]">
                Outstation cab {fromCity.name}
              </Link>
            </li>
          ) : null}
          {fromCity.slug === "chennai" && airportSvc ? (
            <li>
              <Link href={servicePath(airportSvc, fromCity)} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-[var(--cabzii-brand)]">
                Airport taxi Chennai
              </Link>
            </li>
          ) : null}
          <li>
            <Link href={reversePath} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-[var(--cabzii-brand)]">
              {toCity.name} → {fromCity.name} cab
            </Link>
          </li>
          <li>
            <Link href={driverHref} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-[var(--cabzii-brand)]">
              Acting driver · same route
            </Link>
          </li>
        </ul>
      </section>

      <FaqSection title={`${fromCity.name} to ${toCity.name} cab — FAQ`} faqs={faqs} />

      <section className="cabzii-seo-block rounded-xl bg-[var(--cabzii-brand)] p-3.5 text-white sm:p-4">
        <h2 className="!text-white text-sm font-bold sm:text-base">Book {fromCity.name} to {toCity.name} cab now</h2>
        <p className="mt-1 text-[11px] text-blue-100 sm:text-xs">
          Instant online quote · Professional drivers · 24/7 WhatsApp &amp; phone support
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <Link
            href={searchHref}
            className="cabzii-btn cabzii-btn-sm cabzii-tap rounded-full bg-white font-bold text-[var(--cabzii-brand)] hover:bg-slate-100"
          >
            Get quote &amp; book
          </Link>
          <a
            href={`https://wa.me/9944197416?text=${encodeURIComponent(`Hi Cabzii, I need a cab from ${fromCity.name} to ${toCity.name}. Please share fare.`)}`}
            target="_blank"
            rel="noreferrer"
            className="cabzii-btn cabzii-btn-sm cabzii-tap rounded-full border border-white/40 bg-transparent font-semibold text-white hover:bg-white/10"
          >
            WhatsApp
          </a>
        </div>
      </section>
    </article>
  );
}
