import Link from "next/link";
import { ORG_EMAIL } from "../../lib/seo/constants";
import { CABZII_WHATSAPP, telUrl } from "../../lib/conversion";

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

export default function CityHubSeoArticle({ city, aboutCity = "", extraBody = "", localAreas = [], routes = [], quotes = [] }) {
  const year = new Date().getFullYear();
  const name = city.name;
  const areaLine =
    localAreas.length > 0
      ? `We serve ${localAreas.slice(0, 6).join(", ")}, and other major areas across ${name}.`
      : `Cabzii covers published pickup areas across ${name}.`;

  return (
    <article className="bg-white py-8 sm:py-10">
      <div className="section-shell max-w-3xl space-y-7 break-words text-[15px] leading-relaxed text-slate-700">
        <header className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Best cab service in {name} - Cabzii</h2>
          <h3 className="text-base font-bold text-slate-900 sm:text-lg">Best {name} Cab Services in {year}</h3>
        </header>

        <section>
          <h3 className="text-base font-bold text-slate-900">Cabzii Call Taxi {name} Number</h3>
          <p className="mt-2">
            Cabzii Call Taxi {name} Number:{" "}
            <a href={TEL} className="font-bold text-slate-900 hover:underline">
              {PHONE}
            </a>
          </p>
          <p>
            Book online:{" "}
            <Link href="/" className="font-semibold text-[var(--cabzii-brand)] hover:underline">
              {SITE}
            </Link>
          </p>
          <p className="mt-2">
            No app? No problem. Call Cabzii {name} cab service on {PHONE}, or book on this page. If you ride often, save{" "}
            {SITE} on your phone for quicker bookings — there is no separate Cabzii app.
          </p>
        </section>

        <section>
          <h3 className="text-base font-bold text-slate-900">Cabzii Call Taxi in {name} – Book a Cab Anytime</h3>
          <p className="mt-2">
            Getting a call taxi in {name} should not be a hassle. Book a Cabzii cab when you need one — weekday, weekend,
            airport drop, or an outstation trip. Enter pickup and drop on this page, choose the vehicle, and confirm.
            Driver details are sent on WhatsApp or SMS after confirmation. Cabzii is a
            cab booking and call taxi service in {name}, not a station-only transfer counter.
          </p>
          <p className="mt-2">
            Booking is simple. Enter pickup and drop, pick Hatchback, Sedan, SUV or Tempo Traveller, check the fare, and
            confirm. Tolls, parking and extra km are extra unless the quote lists them. You can also call {PHONE} or email{" "}
            {ORG_EMAIL}.
          </p>
        </section>

        <section>
          <h3 className="text-base font-bold text-slate-900">About {name}</h3>
          <p className="mt-2">{aboutCity || areaLine}</p>
          {aboutCity && localAreas.length ? <p className="mt-2">{areaLine}</p> : null}
        </section>

        <section>
          <h3 className="text-base font-bold text-slate-900">Cab options in {name}</h3>
          <p className="mt-2">Choose a vehicle on this page based on the trip. Starting fares show before you pay.</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>City travel: Hatchback, Sedan and SUV</li>
            <li>Airport transfers: pickup and drop on published airport pages</li>
            <li>Outstation trips: one-way or round trip to nearby cities</li>
            <li>Short-time use: hourly rental for errands, meetings or several stops</li>
            <li>Group travel: Tempo Traveller</li>
            <li>Premium rides: Innova and similar SUVs when listed</li>
          </ul>
          <p className="mt-2">
            For buses see{" "}
            <Link href="/buses" className="font-semibold text-[var(--cabzii-brand)] hover:underline">
              Cabzii buses
            </Link>
            . Weddings, corporate and family trips use the same booking form or a call to {PHONE}.
          </p>
        </section>

        <section>
          <h3 className="text-base font-bold text-slate-900">Why people use Cabzii cab services in {name}</h3>
          <p className="mt-2">
            You can check the call taxi fare before you pay. After you confirm, you get the assigned driver details. If
            you need help during booking, call or WhatsApp {PHONE}. Cabzii does not overpromise — the job is to get you
            from pickup to drop on the quoted trip, whether that is a short city ride or a long outstation corridor.
          </p>
        </section>

        {quotes.length ? (
          <section>
            <h3 className="text-base font-bold text-slate-900">What our customers say about cab services in {name}</h3>
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

        {routes.length ? (
          <section>
            <h3 className="text-base font-bold text-slate-900">Popular routes from {name}</h3>
            <ul className="mt-2 space-y-1">
              {routes.slice(0, 6).map((route) => (
                <li key={route.href}>
                  <Link href={route.href} className="font-semibold text-slate-800 hover:text-[var(--cabzii-brand)] hover:underline">
                    Cabs from {name} to {route.otherSlug ? route.label.replace(`${name} to `, "") : route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section>
          <h3 className="text-base font-bold text-slate-900">Cab booking in {name} – How it works</h3>
          <p className="mt-2">Booking a Cabzii call taxi in {name} is simple:</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Share your pickup and drop location</li>
            <li>Choose your vehicle and check the fare</li>
            <li>Confirm the booking</li>
          </ol>
          <p className="mt-2">
            You get driver details after confirmation, and clear pricing before you pay. Call the Cabzii call taxi {name}{" "}
            number{" "}
            <a href={TEL} className="font-bold text-slate-900 hover:underline">
              {PHONE}
            </a>{" "}
            or book on this page.
          </p>
        </section>

        {extraBody ? (
          <div className="prose prose-slate max-w-none overflow-x-auto break-words border-t border-slate-200 pt-6 text-sm text-slate-700 [&_img]:max-w-full" dangerouslySetInnerHTML={{ __html: extraBody }} />
        ) : null}
      </div>
    </article>
  );
}
