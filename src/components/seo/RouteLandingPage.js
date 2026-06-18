import Link from "next/link";
import { routeToCabSearchHref, routeToDriverSearchHref } from "../../lib/routeTrip";
import Breadcrumbs from "./Breadcrumbs";
import BookingCtaBar from "./BookingCtaBar";
import FaqSection from "./FaqSection";
import { tunedRouteDescription, tunedRouteH1 } from "../../lib/seo/metadataTuning";
import { servicePath, SEO_SERVICES } from "../../lib/seo/services";

export default function RouteLandingPage({ route, faqs, extraBody = "" }) {
  const { fromCity, toCity, distance, duration, sedanFrom, suvFrom, slug } = route;
  const path = `/routes/${slug}`;
  const searchHref = routeToCabSearchHref(route);
  const reverseSlug = `${toCity.slug}-to-${fromCity.slug}-cab`;
  const reversePath = `/routes/${reverseSlug}`;
  const airportSvc = SEO_SERVICES.find((s) => s.slug === "airport-taxi");
  const outstationSvc = SEO_SERVICES.find((s) => s.slug === "outstation-cab");

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 md:py-14">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: fromCity.name, path: `/cab-booking/${fromCity.slug}` },
          { name: `${fromCity.name} to ${toCity.name}`, path }
        ]}
      />

      <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">One way cab · Cabzii</p>
      <h1 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
        {tunedRouteH1(route)}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-slate-700 md:text-lg">
        {tunedRouteDescription(route)} ({distance}, {duration})
      </p>

      <BookingCtaBar
        bookHref={searchHref}
        bookLabel="Book & get instant quote"
        quoteLabel="WhatsApp fare quote"
        routeFrom={fromCity.name}
        routeTo={toCity.name}
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
            <Link href={routeToDriverSearchHref(route)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-[var(--cabzii-brand)]">
              Acting driver · same route
            </Link>
          </li>
        </ul>
      </section>

      <FaqSection title={`${fromCity.name} to ${toCity.name} cab — FAQ`} faqs={faqs} />

      <section className="mt-10 rounded-2xl bg-[var(--cabzii-brand)] p-6 text-white md:p-8">
        <h2 className="text-xl font-bold md:text-2xl">Book {fromCity.name} to {toCity.name} cab now</h2>
        <p className="mt-2 text-sm text-blue-100">
          Instant online quote · Professional drivers · 24/7 WhatsApp &amp; phone support
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={searchHref}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[var(--cabzii-brand)] hover:bg-slate-100"
          >
            Get instant quote &amp; book
          </Link>
          <a
            href={`https://wa.me/9944197416?text=${encodeURIComponent(`Hi Cabzii, I need a cab from ${fromCity.name} to ${toCity.name}. Please share fare.`)}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold hover:bg-white/10"
          >
            WhatsApp booking
          </a>
        </div>
      </section>
    </article>
  );
}
