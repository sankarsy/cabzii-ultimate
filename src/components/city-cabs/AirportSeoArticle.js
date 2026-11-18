import Link from "next/link";
import { SeoPageArticle } from "./OutstationPageBelow";
import { ORG_EMAIL } from "../../lib/seo/constants";
import { CABZII_WHATSAPP, telUrl } from "../../lib/conversion";
import { pickOutstationRoutes } from "../../lib/cityOutstationRoutes";
import { cityCabLandingPath } from "../../lib/cityCabPaths";
import { MAIN_PAGE_CITY_SLUGS, cityBySlug } from "../../lib/seo/cities";

const PHONE = CABZII_WHATSAPP;
const TEL = telUrl(PHONE);
const SITE = "cabzii.in";

function quoteName(item) {
  const name = String(item?.name || "").trim();
  if (!name) return "Guest";
  const parts = name.split(/\s+/);
  if (parts.length === 1) return parts[0];
  const last = parts[1]?.[0];
  return last ? `${parts[0]} ${last}.` : parts[0];
}

export default function AirportSeoArticle({
  city,
  airport,
  extraBody = "",
  localAreas = [],
  places = [],
  vehicles = [],
  quotes = [],
  fromRoutes = []
}) {
  const year = new Date().getFullYear();
  const name = city.name;
  const airportLabel = airport?.name || `${name} Airport`;
  const code = airport?.code ? ` (${airport.code})` : "";
  const fleet = vehicles.length
    ? vehicles
    : ["Hatchback", "Sedan", "SUV / Ertiga", "Innova / Innova Crysta", "Tempo Traveller"];
  const routes = fromRoutes.length
    ? fromRoutes
    : pickOutstationRoutes(city.slug, { direction: "from", limit: 18 });
  const cities = MAIN_PAGE_CITY_SLUGS.map((slug) => cityBySlug(slug)).filter(Boolean);
  const areas = localAreas.length ? localAreas : [];
  const drops = places.map((place) => place.name).filter(Boolean);

  return (
    <article className="bg-white py-8 sm:py-10">
      <div className="section-shell max-w-3xl space-y-8 break-words text-left text-[15px] leading-relaxed text-slate-700">
        <header className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            Cabzii Airport Cab Booking in {name}
          </h2>
          <h3 className="text-base font-bold text-slate-900">
            Trusted {name} Airport Taxi Booking ({year})
          </h3>
        </header>

        <section>
          <h3 className="text-base font-bold text-slate-900">
            {name} Airport Cab Booking – Pickup &amp; Drop Made Easy
          </h3>
          <p className="mt-2">
            Getting to or from {airportLabel}
            {code} should be a booked trip, not a last-minute hunt at the kerb. On Cabzii you choose pickup or drop,
            compare Hatchback, Sedan, SUV or Innova, and see the fare before you pay. Early arrivals, late departures
            and family luggage are all scheduled trips — you pick the time on this page.
          </p>
          <p className="mt-2">
            Book a cab from {name} airport or to {name} airport on this website, or call{" "}
            <a href={TEL} className="font-bold text-slate-900 hover:underline">
              {PHONE}
            </a>
            . After you confirm, Cabzii shares the assigned driver, fare and pickup slot. This is
            not a walk-up airport taxi counter.
          </p>
        </section>

        <section>
          <h3 className="text-base font-bold text-slate-900">How Cabzii {name} Airport Taxi Booking Works</h3>
          <p className="mt-2">Whether you are landing or flying out, the steps stay the same:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>For pickups:</strong> keep Airport selected, set {airportLabel} as From and your house, hotel or
              landmark as To. After confirmation, share the terminal and flight time so the assigned driver can plan
              waiting.
            </li>
            <li>
              <strong>For drops:</strong> set your {name} pickup as From and the airport as To. Book with enough buffer
              for city traffic. Fuel and driver are included; parking, tolls and extra km are extra unless listed.
            </li>
          </ul>
          <p className="mt-2">
            Driver details follow on SMS or WhatsApp after the booking is confirmed. Call {PHONE} if the flight time
            changes.
          </p>
        </section>

        <section>
          <h3 className="text-base font-bold text-slate-900">Vehicles Available for {name} Airport Cab Booking</h3>
          <p className="mt-2">
            Choose by seats and luggage on the list above. We provide {name} airport taxi booking on the vehicles
            Cabzii publishes:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {fleet.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-2">
            Travelling light? A hatchback or sedan is usually enough. Multiple suitcases or a family trip — compare SUV
            or Innova. Groups can check Tempo Traveller when it appears on the quote.
          </p>
        </section>

        {quotes.length ? (
          <section>
            <h3 className="text-base font-bold text-slate-900">What Our Customers Say About Cab Services in {name}</h3>
            <ul className="mt-3 space-y-4">
              {quotes.map((item) => (
                <li key={String(item._id ?? item.name)} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-slate-800">“{item.message}”</p>
                  <p className="mt-2 text-sm font-semibold text-slate-600">— {quoteName(item)}</p>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              <Link href="/testimonials" className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
                More Cabzii reviews
              </Link>
            </p>
          </section>
        ) : null}

        <section>
          <h3 className="text-base font-bold text-slate-900">Why People Book Airport Cabs with Cabzii</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Scheduled pickups — book the slot that matches your flight, including early and late hours</li>
            <li>Drivers assigned after you confirm, with terminal and flight time you share</li>
            <li>Fare shown before you pay — parking, tolls and extra km listed separately</li>
            <li>Phone booking if you prefer to call {PHONE}</li>
            <li>Hatchback to Tempo on one page, so you pick the cab that fits bags and passengers</li>
          </ul>
          <p className="mt-2">
            Whether it is a taxi booking from {name} Airport or a cab for airport drop, you confirm the trip on Cabzii
            first. We do not sell a 24/7 kerbside stand.
          </p>
        </section>

        <section>
          <h3 className="text-base font-bold text-slate-900">How to Book a Cab to {name} Airport</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              Website:{" "}
              <Link href="/" className="font-semibold text-[var(--cabzii-brand)] hover:underline">
                {SITE}
              </Link>{" "}
              — use this airport page
            </li>
            <li>
              Call or WhatsApp:{" "}
              <a href={TEL} className="font-bold text-slate-900 hover:underline">
                {PHONE}
              </a>{" "}
              (support hours on this site)
            </li>
            <li>Email: {ORG_EMAIL}</li>
          </ul>
          <p className="mt-2">
            Choose pickup or drop, select the vehicle, confirm the time, confirm the booking. There is no
            separate Cabzii app — bookmark {SITE} on your phone.
          </p>
        </section>

        <section>
          <h3 className="text-base font-bold text-slate-900">Service Areas – Book Cab from {name} Airport</h3>
          <p className="mt-2">
            Cabzii covers published {name} areas for airport taxi pickup and drop. Enter the exact street so the
            assigned driver can reach the door. Common city-side points include
            {drops.length ? ` ${drops.join(", ")}` : areas.length ? ` ${areas.join(", ")}` : ` neighbourhoods across ${name}`}.
          </p>
          {airport?.type === "local" && airport?.name ? (
            <p className="mt-2">{airport.name} is the terminal you book as From on arrival, or To on departure.</p>
          ) : null}
        </section>

        <section>
          <h3 className="text-base font-bold text-slate-900">Cabzii Airport Taxi Booking for Repeat Travel</h3>
          <p className="mt-2">
            If you fly often, save this page and reuse the same From / To. For groups, guests or office travel, book
            SUV, Innova or Tempo Traveller on the list above, or call {PHONE} with passenger count and flight time.
            Luxury or chauffeur-only trips use{" "}
            <Link href="/call-driver" className="font-semibold text-[var(--cabzii-brand)] hover:underline">
              Call Driver
            </Link>{" "}
            when you want a driver in your own car.
          </p>
        </section>

        {extraBody ? <SeoPageArticle html={extraBody} /> : null}

        {routes.length ? (
          <section>
            <h3 className="text-base font-bold text-slate-900">Popular Outstation Cab Routes</h3>
            <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {routes.map((route) => (
                <li key={route.href}>
                  <Link href={route.href} className="text-slate-800 hover:text-[var(--cabzii-brand)] hover:underline">
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              <Link
                href={`/services/outstation-cab/${city.slug}`}
                className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline"
              >
                More outstation cab routes from {name}
              </Link>
            </p>
          </section>
        ) : null}

        {cities.length ? (
          <section>
            <h3 className="text-base font-bold text-slate-900">Cab Services by City</h3>
            <ul className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {cities.map((row) => (
                <li key={row.slug}>
                  <Link
                    href={cityCabLandingPath(row.slug)}
                    className="text-slate-800 hover:text-[var(--cabzii-brand)] hover:underline"
                  >
                    {row.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </article>
  );
}
