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
    <article className="section-shell py-6 sm:py-10 md:py-14">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: fromCity.name, path: `/cab-booking/${fromCity.slug}` },
          { name: `${fromCity.name} to ${toCity.name}`, path }
        ]}
      />

      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-600 sm:text-xs">One way cab · Cabzii</p>
      <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:mt-3 sm:text-3xl md:text-4xl">
        {tunedRouteH1(route)}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:mt-4 sm:text-base md:text-lg">
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

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Distance &amp; travel time</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <tbody>
              <tr className="border-b border-slate-100">
                <th className="px-4 py-3 font-semibold text-slate-700">Route</th>
                <td className="px-4 py-3 text-slate-600">
                  {fromCity.name} → {toCity.name}
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <th className="px-4 py-3 font-semibold text-slate-700">Pickup location</th>
                <td className="px-4 py-3 text-slate-600">{fromCity.name}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <th className="px-4 py-3 font-semibold text-slate-700">Drop location</th>
                <td className="px-4 py-3 text-slate-600">{toCity.name}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <th className="px-4 py-3 font-semibold text-slate-700">Distance</th>
                <td className="px-4 py-3 text-slate-600">{distance}</td>
              </tr>
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">Travel time</th>
                <td className="px-4 py-3 text-slate-600">{duration}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Cab fare &amp; pricing</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
          <table className="w-full text-left text-sm">
            <tbody>
              <tr className="border-b border-slate-100 bg-white">
                <th className="px-4 py-3 font-semibold text-slate-700">Sedan (Dzire / Etios)</th>
                <td className="px-4 py-3 font-bold text-slate-900">from ₹{sedanFrom.toLocaleString("en-IN")}</td>
              </tr>
              <tr className="bg-white">
                <th className="px-4 py-3 font-semibold text-slate-700">SUV / Innova</th>
                <td className="px-4 py-3 font-bold text-slate-900">from ₹{suvFrom.toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Indicative one-way fares — exact quote on Cabzii before booking. Tolls and state taxes may apply.
        </p>
      </section>

      {extraBody ? (
        <div
          className="prose prose-slate mt-10 max-w-none text-sm text-slate-700 md:text-base"
          dangerouslySetInnerHTML={{ __html: extraBody }}
        />
      ) : null}

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Why choose Cabzii for this route?</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
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
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Related services &amp; links</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          <li>
            <Link href={`/cab-booking/${fromCity.slug}`} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-[var(--cabzii-brand)]">
              Cab booking {fromCity.name}
            </Link>
          </li>
          {outstationSvc ? (
            <li>
              <Link href={servicePath(outstationSvc, fromCity)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-[var(--cabzii-brand)]">
                Outstation cab {fromCity.name}
              </Link>
            </li>
          ) : null}
          {fromCity.slug === "chennai" && airportSvc ? (
            <li>
              <Link href={servicePath(airportSvc, fromCity)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-[var(--cabzii-brand)]">
                Airport taxi Chennai
              </Link>
            </li>
          ) : null}
          <li>
            <Link href={reversePath} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-[var(--cabzii-brand)]">
              {toCity.name} → {fromCity.name} cab
            </Link>
          </li>
          <li>
            <Link href={driverHref} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-[var(--cabzii-brand)]">
              Acting driver · same route
            </Link>
          </li>
        </ul>
      </section>

      <FaqSection title={`${fromCity.name} to ${toCity.name} cab — FAQ`} faqs={faqs} />

      <section className="mt-10 rounded-2xl bg-[var(--cabzii-brand)] p-5 text-white md:p-6">
        <h2 className="text-lg font-bold md:text-xl">Book {fromCity.name} to {toCity.name} cab now</h2>
        <p className="mt-1.5 text-xs text-blue-100 md:text-sm">
          Instant online quote · Professional drivers · 24/7 WhatsApp &amp; phone support
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
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
